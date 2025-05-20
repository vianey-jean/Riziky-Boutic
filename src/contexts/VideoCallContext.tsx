
import React, { createContext, useState, useContext, useRef, useEffect } from 'react';
import { toast } from '@/components/ui/sonner';
import Peer from 'simple-peer';
import io from 'socket.io-client';

// Add custom type extension for Peer Instance to handle _localSignal property
interface ExtendedPeerInstance extends Peer.Instance {
  _localSignal?: any;
}

interface VideoCallContextType {
  callState: CallState;
  localStream: MediaStream | null;
  remoteStream: MediaStream | null;
  incomingCall: IncomingCall | null;
  initiateCall: (userId: string, isVideo: boolean) => Promise<void>;
  acceptCall: () => Promise<void>;
  rejectCall: () => void;
  endCall: () => void;
}

interface CallState {
  isInCall: boolean;
  isCallInitiator: boolean;
  isVideo: boolean;
  callWith: string | null;
}

interface IncomingCall {
  from: string;
  name: string;
  isVideo: boolean;
  signal?: any;
}

const initialCallState: CallState = {
  isInCall: false,
  isCallInitiator: false,
  isVideo: false,
  callWith: null,
};

const VideoCallContext = createContext<VideoCallContextType | null>(null);

export const useVideoCall = () => {
  const context = useContext(VideoCallContext);
  if (!context) {
    throw new Error('useVideoCall must be used within a VideoCallProvider');
  }
  return context;
};

// Vérifier si nous sommes en mode développement sans serveur disponible
const useMockWebRTC = process.env.NODE_ENV === 'development' && !import.meta.env.VITE_USE_REAL_WEBRTC;

// Logger personnalisé
const createLogger = (prefix: string) => ({
  log: (message: string, ...args: any[]) => console.log(`[${prefix}] ${message}`, ...args),
  error: (message: string, ...args: any[]) => console.error(`[${prefix}] ${message}`, ...args),
  warn: (message: string, ...args: any[]) => console.warn(`[${prefix}] ${message}`, ...args),
  info: (message: string, ...args: any[]) => console.info(`[${prefix}] ${message}`, ...args)
});

const logger = createLogger('VideoCall');

export const VideoCallProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [callState, setCallState] = useState<CallState>(initialCallState);
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);
  const [incomingCall, setIncomingCall] = useState<IncomingCall | null>(null);
  
  const peerRef = useRef<ExtendedPeerInstance | null>(null);
  const socketRef = useRef<any>(null);
  const socketErrorShown = useRef<boolean>(false);
  const connectionAttempts = useRef<number>(0);
  
  // Récupérer l'utilisateur actuel
  const getCurrentUser = () => {
    try {
      const userData = localStorage.getItem('user');
      if (!userData) return null;
      return JSON.parse(userData);
    } catch (error) {
      console.error("Erreur lors de la récupération de l'utilisateur:", error);
      return null;
    }
  };
  
  const currentUser = getCurrentUser();
  
  // Initialize socket connection
  useEffect(() => {
    // Use the server URL from environment variables or a fallback
    const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || 'https://riziky-boutic-server.onrender.com';
    
    logger.log('Connecting to socket server:', apiBaseUrl);
    
    try {
      if (useMockWebRTC) {
        logger.log('Using mock WebRTC mode for development');
        return () => {};
      }
      
      // Connect with retry options and timeout
      socketRef.current = io(apiBaseUrl, {
        reconnectionAttempts: 5,
        reconnectionDelay: 1000,
        timeout: 20000,
        transports: ['websocket', 'polling'],
        auth: {
          token: currentUser?.token || ''
        }
      });
      
      // Socket connection error handling
      socketRef.current.on('connect_error', (err: any) => {
        logger.error('Socket connection error:', err);
        connectionAttempts.current += 1;
        
        // Only show toast once to avoid spam
        if (!socketErrorShown.current && connectionAttempts.current < 3) {
          toast.error('Erreur de connexion au serveur de chat');
          socketErrorShown.current = true;
        }
      });

      socketRef.current.on('connect', () => {
        logger.log('Socket connected successfully');
        socketErrorShown.current = false;
        connectionAttempts.current = 0;
        
        // Authentifier l'utilisateur quand le socket est connecté
        if (currentUser && currentUser.id) {
          socketRef.current.emit('authenticate', currentUser);
          logger.log('User authenticated with socket:', currentUser.id);
        }
      });
      
      // Socket event listeners
      socketRef.current.on('callIncoming', (data: { from: string; name: string; isVideo: boolean; signal: any }) => {
        logger.log('Incoming call from:', data);
        setIncomingCall(data);
      });
      
      socketRef.current.on('callAccepted', async (signal: any) => {
        logger.log('Call accepted, received signal');
        if (peerRef.current && signal) {
          try {
            peerRef.current.signal(signal);
          } catch (error) {
            logger.error('Error signaling peer after call accepted:', error);
            endCall();
          }
        } else {
          logger.error('Cannot process call acceptance: peer or signal is missing');
          endCall();
        }
      });
      
      socketRef.current.on('callRejected', () => {
        toast.error('L\'appel a été refusé');
        endCall();
      });
      
      socketRef.current.on('callEnded', () => {
        toast.info('L\'appel a pris fin');
        endCall();
      });
      
      socketRef.current.on('peerSignal', (signal: any) => {
        logger.log('Received peer signal:', signal);
        if (peerRef.current && signal) {
          try {
            peerRef.current.signal(signal);
          } catch (error) {
            logger.error('Error processing peer signal:', error);
          }
        } else {
          logger.error('Cannot process peer signal: peer or signal is missing');
        }
      });
      
      socketRef.current.on('sendSignalRequest', (data: { to: string }) => {
        logger.log('Received signal request from:', data.to);
        if (peerRef.current && peerRef.current._localSignal) {
          socketRef.current.emit('sendSignalResponse', {
            to: data.to,
            signal: peerRef.current._localSignal
          });
        } else {
          logger.error('Cannot respond to signal request: local signal is missing');
        }
      });
      
      socketRef.current.on('callFailed', (data: { reason: string }) => {
        if (data.reason === 'user-offline') {
          toast.error('L\'utilisateur n\'est pas en ligne');
        } else {
          toast.error('L\'appel a échoué');
        }
        endCall();
      });
    } catch (error) {
      logger.error('Failed to initialize socket connection:', error);
      if (!socketErrorShown.current) {
        toast.error('Impossible de se connecter au serveur de chat');
        socketErrorShown.current = true;
      }
    }
    
    // Cleanup
    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
      endCall();
    };
  }, []);
  
  // Initiate a call to another user
  const initiateCall = async (userId: string, isVideo: boolean) => {
    try {
      logger.log(`Initiating ${isVideo ? 'video' : 'audio'} call to user ${userId}`);
      
      if (!userId) {
        throw new Error('ID utilisateur invalide');
      }
      
      // For development when server is unavailable
      if (useMockWebRTC) {
        setCallState({
          isInCall: true,
          isCallInitiator: true,
          isVideo,
          callWith: userId,
        });
        
        // Create a mock stream
        const constraints = {
          video: isVideo ? { width: 640, height: 480 } : false,
          audio: true
        };
        
        try {
          const stream = await navigator.mediaDevices.getUserMedia(constraints);
          setLocalStream(stream);
          toast.success(`Appel simulé en cours (mode développement)`);
          return;
        } catch (err) {
          toast.error('Permissions de caméra/micro refusées');
          endCall();
          return;
        }
      }
      
      // Verify socket connection
      if (!socketRef.current || !socketRef.current.connected) {
        toast.error('Non connecté au serveur. Veuillez rafraîchir la page et réessayer.');
        return;
      }
      
      // Get user media based on call type
      const constraints = {
        video: isVideo ? { width: 640, height: 480 } : false,
        audio: true
      };
      
      let stream: MediaStream;
      try {
        stream = await navigator.mediaDevices.getUserMedia(constraints);
        setLocalStream(stream);
      } catch (err: any) {
        logger.error('Error getting user media:', err);
        let errorMessage = 'Erreur d\'accès à la caméra ou au microphone';
        
        if (err.name === 'NotAllowedError') {
          errorMessage = 'Permissions refusées pour la caméra ou le microphone';
        } else if (err.name === 'NotFoundError') {
          errorMessage = 'Aucun périphérique audio/vidéo détecté';
        } else if (err.name === 'NotReadableError') {
          errorMessage = 'Périphérique audio/vidéo déjà utilisé par une autre application';
        }
        
        toast.error(errorMessage);
        return;
      }
      
      // Create peer connection
      try {
        // Correction ici: S'assurer que simple-peer est correctement initialisé
        if (typeof Peer !== 'function') {
          throw new Error('La bibliothèque simple-peer n\'est pas correctement initialisée');
        }
        
        const peerOptions = {
          initiator: true,
          trickle: false,
          stream: stream,
          config: {
            iceServers: [
              { urls: 'stun:stun.l.google.com:19302' },
              { urls: 'stun:global.stun.twilio.com:3478' }
            ]
          }
        };
        
        const peer = new Peer(peerOptions) as ExtendedPeerInstance;
        
        peer.on('signal', (signal) => {
          logger.log('Generated signal for peer, sending to remote user');
          // Store the local signal for potential retrieval later
          peer._localSignal = signal;
          
          if (socketRef.current && socketRef.current.connected) {
            socketRef.current.emit('callUser', {
              userToCall: userId,
              signal,
              isVideo,
            });
          } else {
            toast.error('Serveur de chat non connecté');
            endCall();
          }
        });
        
        peer.on('stream', (remoteStream) => {
          logger.log('Received remote stream');
          setRemoteStream(remoteStream);
        });
        
        peer.on('error', (err) => {
          logger.error('Peer connection error:', err);
          endCall();
          toast.error('Erreur de connexion');
        });
        
        peer.on('close', () => {
          logger.log('Peer connection closed');
          endCall();
        });
        
        peerRef.current = peer;
        
        setCallState({
          isInCall: true,
          isCallInitiator: true,
          isVideo,
          callWith: userId,
        });
        
        toast.success(`Appel en cours...`);
      } catch (peerError: any) {
        logger.error('Error creating peer connection:', peerError);
        stream.getTracks().forEach(track => track.stop());
        setLocalStream(null);
        toast.error('Erreur de connexion peer-to-peer');
      }
    } catch (error: any) {
      logger.error('Failed to initiate call:', error);
      
      // More user-friendly error messages
      if (error.name === 'NotAllowedError') {
        toast.error('Accès au microphone ou à la caméra refusé. Veuillez vérifier les permissions de votre navigateur.');
      } else if (error.name === 'NotFoundError') {
        toast.error('Microphone ou caméra introuvable. Veuillez vérifier que votre matériel est connecté.');
      } else {
        toast.error('Impossible de démarrer l\'appel. ' + error.message);
      }
    }
  };
  
  // Accept an incoming call
  const acceptCall = async () => {
    if (!incomingCall) {
      toast.error('Aucun appel à accepter');
      return;
    }
    
    try {
      logger.log(`Accepting ${incomingCall.isVideo ? 'video' : 'audio'} call from ${incomingCall.from}`);
      
      // For development when server is unavailable
      if (useMockWebRTC) {
        setCallState({
          isInCall: true,
          isCallInitiator: false,
          isVideo: incomingCall.isVideo,
          callWith: incomingCall.from,
        });
        
        // Create a mock stream
        const constraints = {
          video: incomingCall.isVideo ? { width: 640, height: 480 } : false,
          audio: true
        };
        
        try {
          const stream = await navigator.mediaDevices.getUserMedia(constraints);
          setLocalStream(stream);
          setIncomingCall(null);
          toast.success(`Appel accepté (mode développement)`);
          return;
        } catch (err) {
          toast.error('Permissions de caméra/micro refusées');
          setIncomingCall(null);
          endCall();
          return;
        }
      }
      
      // Verify socket connection
      if (!socketRef.current || !socketRef.current.connected) {
        toast.error('Non connecté au serveur. Veuillez rafraîchir la page et réessayer.');
        setIncomingCall(null);
        return;
      }
      
      // Get user media based on call type
      const constraints = {
        video: incomingCall.isVideo ? { width: 640, height: 480 } : false,
        audio: true
      };
      
      let stream: MediaStream;
      try {
        stream = await navigator.mediaDevices.getUserMedia(constraints);
        setLocalStream(stream);
      } catch (err: any) {
        logger.error('Error getting user media:', err);
        let errorMessage = 'Erreur d\'accès à la caméra ou au microphone';
        
        if (err.name === 'NotAllowedError') {
          errorMessage = 'Permissions refusées pour la caméra ou le microphone';
        } else if (err.name === 'NotFoundError') {
          errorMessage = 'Aucun périphérique audio/vidéo détecté';
        }
        
        toast.error(errorMessage);
        setIncomingCall(null);
        return;
      }
      
      try {
        // Correction ici aussi pour s'assurer que simple-peer est correctement initialisé
        if (typeof Peer !== 'function') {
          throw new Error('La bibliothèque simple-peer n\'est pas correctement initialisée');
        }
        
        const peerOptions = {
          initiator: false,
          trickle: false,
          stream: stream,
          config: {
            iceServers: [
              { urls: 'stun:stun.l.google.com:19302' },
              { urls: 'stun:global.stun.twilio.com:3478' }
            ]
          }
        };
        
        const peer = new Peer(peerOptions) as ExtendedPeerInstance;
        
        peer.on('signal', (signal) => {
          logger.log('Generated accept signal, sending to caller');
          // Store the local signal for potential retrieval later
          peer._localSignal = signal;
          
          if (socketRef.current && socketRef.current.connected && incomingCall) {
            socketRef.current.emit('acceptCall', {
              to: incomingCall.from,
              signal,
            });
          } else {
            toast.error('Serveur de chat non connecté');
            endCall();
          }
        });
        
        peer.on('stream', (remoteStream) => {
          logger.log('Received remote stream from caller');
          setRemoteStream(remoteStream);
        });
        
        peer.on('error', (err) => {
          logger.error('Peer connection error:', err);
          endCall();
          toast.error('Erreur de connexion');
        });
        
        peer.on('close', () => {
          logger.log('Peer connection closed');
          endCall();
        });
        
        peerRef.current = peer;
        
        // Si le signal existe déjà, on l'utilise directement
        if (incomingCall.signal) {
          peer.signal(incomingCall.signal);
        } else {
          // Sinon on demande le signal au serveur
          if (socketRef.current && socketRef.current.connected) {
            socketRef.current.emit('getCallerSignal', { from: incomingCall.from });
          } else {
            throw new Error('Socket not connected');
          }
        }
        
        setCallState({
          isInCall: true,
          isCallInitiator: false,
          isVideo: incomingCall.isVideo,
          callWith: incomingCall.from,
        });
        
        setIncomingCall(null);
        toast.success('Appel en cours...');
      } catch (peerError: any) {
        logger.error('Error creating peer connection:', peerError);
        stream.getTracks().forEach(track => track.stop());
        setLocalStream(null);
        setIncomingCall(null);
        toast.error('Erreur de connexion peer-to-peer');
      }
    } catch (error: any) {
      logger.error('Failed to accept call:', error);
      
      // More user-friendly error messages
      if (error.name === 'NotAllowedError') {
        toast.error('Accès au microphone ou à la caméra refusé. Veuillez vérifier les permissions de votre navigateur.');
      } else if (error.name === 'NotFoundError') {
        toast.error('Microphone ou caméra introuvable. Veuillez vérifier que votre matériel est connecté.');
      } else if (error.message === 'Permissions required') {
        toast.error('Permissions de microphone ou caméra requises pour répondre à l\'appel.');
      } else if (error.message === 'Socket not connected') {
        toast.error('La connexion au serveur est perdue. Impossible de répondre à l\'appel.');
      } else {
        toast.error('Impossible de répondre à l\'appel. ' + error.message);
      }
      
      setIncomingCall(null);
    }
  };
  
  // Reject an incoming call
  const rejectCall = () => {
    logger.log('Rejecting call');
    
    if (useMockWebRTC) {
      setIncomingCall(null);
      return;
    }
    
    if (incomingCall && socketRef.current && socketRef.current.connected) {
      socketRef.current.emit('rejectCall', { to: incomingCall.from });
    }
    
    setIncomingCall(null);
  };
  
  // End the current call
  const endCall = () => {
    logger.log('Ending call');
    
    if (!useMockWebRTC) {
      // Notify other participant if in a call
      if (callState.isInCall && callState.callWith && socketRef.current && socketRef.current.connected) {
        socketRef.current.emit('endCall', { to: callState.callWith });
      }
    }
    
    // Close peer connection
    if (peerRef.current) {
      try {
        peerRef.current.destroy();
      } catch (error) {
        logger.error('Error destroying peer:', error);
      }
      peerRef.current = null;
    }
    
    // Stop local media streams
    if (localStream) {
      try {
        localStream.getTracks().forEach(track => {
          track.stop();
        });
      } catch (error) {
        logger.error('Error stopping local tracks:', error);
      }
    }
    
    // Reset state
    setLocalStream(null);
    setRemoteStream(null);
    setCallState(initialCallState);
  };
  
  return (
    <VideoCallContext.Provider
      value={{
        callState,
        localStream,
        remoteStream,
        incomingCall,
        initiateCall,
        acceptCall,
        rejectCall,
        endCall,
      }}
    >
      {children}
    </VideoCallContext.Provider>
  );
};

export default VideoCallProvider;
