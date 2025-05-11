
import React, { createContext, useState, useContext, useRef, useEffect } from 'react';
import { toast } from '@/components/ui/sonner';
import * as SimplePeer from 'simple-peer';
import { io } from 'socket.io-client';

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

// Mode de développement pour simuler WebRTC sans serveur
const useMockWebRTC = process.env.NODE_ENV === 'development';

export const VideoCallProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [callState, setCallState] = useState<CallState>(initialCallState);
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);
  const [incomingCall, setIncomingCall] = useState<IncomingCall | null>(null);
  
  const peerRef = useRef<SimplePeer.Instance | null>(null);
  const socketRef = useRef<any>(null);
  const socketErrorShown = useRef<boolean>(false);
  
  // Initialize socket connection
  useEffect(() => {
    // Use the server URL from environment variables or a fallback
    const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || 'https://riziky-boutic-server.onrender.com';
    
    console.log('Connecting to socket server:', apiBaseUrl);
    
    try {
      if (useMockWebRTC) {
        console.log('Using mock WebRTC mode for development');
        return;
      }
      
      // Connect with retry options and timeout
      socketRef.current = io(apiBaseUrl, {
        reconnectionAttempts: 5,
        reconnectionDelay: 1000,
        timeout: 10000,
        transports: ['websocket', 'polling']
      });
      
      // Socket connection error handling
      socketRef.current.on('connect_error', (err: any) => {
        console.error('Socket connection error:', err);
        // Only show toast once to avoid spam
        if (!socketErrorShown.current) {
          toast.error('Erreur de connexion au serveur de chat');
          socketErrorShown.current = true;
        }
      });
      
      // Socket event listeners
      socketRef.current.on('callIncoming', (data: { from: string; name: string; isVideo: boolean }) => {
        console.log('Incoming call from:', data);
        setIncomingCall(data);
      });
      
      socketRef.current.on('callAccepted', async (signal: any) => {
        console.log('Call accepted, received signal');
        if (peerRef.current) {
          try {
            peerRef.current.signal(signal);
          } catch (error) {
            console.error('Error signaling peer after call accepted:', error);
            endCall();
          }
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
        console.log('Received peer signal:', signal);
        if (peerRef.current) {
          try {
            peerRef.current.signal(signal);
          } catch (error) {
            console.error('Error processing peer signal:', error);
          }
        }
      });
    } catch (error) {
      console.error('Failed to initialize socket connection:', error);
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
      console.log(`Initiating ${isVideo ? 'video' : 'audio'} call to user ${userId}`);
      
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
      
      // Request permissions first before creating stream
      try {
        await navigator.permissions.query({ name: 'microphone' as PermissionName });
        if (isVideo) {
          await navigator.permissions.query({ name: 'camera' as PermissionName });
        }
      } catch (err) {
        console.log('Permissions API not supported, trying direct access');
      }
      
      // Get user media based on call type
      const constraints = {
        video: isVideo ? { width: 640, height: 480 } : false,
        audio: true
      };
      
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      
      if (!stream) {
        throw new Error('Failed to create media stream');
      }
      
      setLocalStream(stream);
      
      // Create peer connection
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
      
      // Création du peer avec SimplePeer
      const peer = new SimplePeer(peerOptions);
      
      peer.on('signal', (signal) => {
        console.log('Generated signal for peer, sending to remote user');
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
        console.log('Received remote stream');
        setRemoteStream(remoteStream);
      });
      
      peer.on('error', (err) => {
        console.error('Peer connection error:', err);
        endCall();
        toast.error('Erreur de connexion');
      });
      
      peer.on('close', () => {
        console.log('Peer connection closed');
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
    } catch (error: any) {
      console.error('Failed to initiate call:', error);
      
      // More user-friendly error messages
      if (error.name === 'NotAllowedError') {
        toast.error('Accès au microphone ou à la caméra refusé. Veuillez vérifier les permissions de votre navigateur.');
      } else if (error.name === 'NotFoundError') {
        toast.error('Microphone ou caméra introuvable. Veuillez vérifier que votre matériel est connecté.');
      } else if (error.message === 'Permissions required') {
        toast.error('Permissions de microphone ou caméra requises pour passer un appel.');
      } else if (error.message === 'Stream is undefined') { 
        toast.error('Erreur lors de l\'accès au microphone ou à la caméra.');
      } else {
        toast.error('Impossible de démarrer l\'appel. Vérifiez vos permissions de caméra et microphone.');
      }
    }
  };
  
  // Accept an incoming call
  const acceptCall = async () => {
    if (!incomingCall) return;
    
    try {
      console.log(`Accepting ${incomingCall.isVideo ? 'video' : 'audio'} call from ${incomingCall.from}`);
      
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
      
      // Try to request permissions
      try {
        await navigator.permissions.query({ name: 'microphone' as PermissionName });
        if (incomingCall.isVideo) {
          await navigator.permissions.query({ name: 'camera' as PermissionName });
        }
      } catch (err) {
        console.log('Permissions API not supported, trying direct access');
      }
      
      // Get user media based on call type
      const constraints = {
        video: incomingCall.isVideo ? { width: 640, height: 480 } : false,
        audio: true
      };
      
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      
      if (!stream) {
        throw new Error('Failed to create media stream');
      }
      
      setLocalStream(stream);
      
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
      
      const peer = new SimplePeer(peerOptions);
      
      peer.on('signal', (signal) => {
        console.log('Generated accept signal, sending to caller');
        if (socketRef.current && socketRef.current.connected) {
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
        console.log('Received remote stream from caller');
        setRemoteStream(remoteStream);
      });
      
      peer.on('error', (err) => {
        console.error('Peer connection error:', err);
        endCall();
        toast.error('Erreur de connexion');
      });
      
      peer.on('close', () => {
        console.log('Peer connection closed');
        endCall();
      });
      
      if (socketRef.current && socketRef.current.connected) {
        socketRef.current.emit('getCallerSignal', { from: incomingCall.from });
      } else {
        throw new Error('Socket not connected');
      }
      
      peerRef.current = peer;
      
      setCallState({
        isInCall: true,
        isCallInitiator: false,
        isVideo: incomingCall.isVideo,
        callWith: incomingCall.from,
      });
      
      setIncomingCall(null);
    } catch (error: any) {
      console.error('Failed to accept call:', error);
      
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
        toast.error('Impossible de répondre à l\'appel. Vérifiez vos permissions de caméra et microphone.');
      }
      
      rejectCall();
    }
  };
  
  // Reject an incoming call
  const rejectCall = () => {
    console.log('Rejecting call');
    
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
    console.log('Ending call');
    
    if (!useMockWebRTC) {
      // Notify other participant if in a call
      if (callState.isInCall && callState.callWith && socketRef.current && socketRef.current.connected) {
        socketRef.current.emit('endCall', { to: callState.callWith });
      }
    }
    
    // Close peer connection
    if (peerRef.current) {
      peerRef.current.destroy();
      peerRef.current = null;
    }
    
    // Stop local media streams
    if (localStream) {
      localStream.getTracks().forEach(track => {
        track.stop();
      });
    }
    
    // Reset state
    setLocalStream(null);
    setRemoteStream(null);
    setCallState(initialCallState);
    setIncomingCall(null);
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
