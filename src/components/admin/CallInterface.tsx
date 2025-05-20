
import React, { useEffect, useRef, useState } from 'react';
import { useVideoCall } from '@/contexts/VideoCallContext';
import { PhoneOff, Mic, MicOff, Video as VideoIcon, VideoOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { toast } from '@/components/ui/sonner';

const CallInterface = () => {
  const { callState, localStream, remoteStream, endCall } = useVideoCall();
  const localVideoRef = useRef<HTMLVideoElement | null>(null);
  const remoteVideoRef = useRef<HTMLVideoElement | null>(null);
  const [micEnabled, setMicEnabled] = useState(true);
  const [cameraEnabled, setCameraEnabled] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(true);
  
  // Set up local and remote streams
  useEffect(() => {
    console.log('Call interface - localStream:', !!localStream, 'remoteStream:', !!remoteStream);
    
    // Gérer le flux vidéo local
    if (localVideoRef.current && localStream) {
      try {
        localVideoRef.current.srcObject = localStream;
      } catch (error) {
        console.error('Error setting local video source:', error);
      }
    }
    
    // Gérer le flux vidéo distant
    if (remoteVideoRef.current && remoteStream) {
      try {
        remoteVideoRef.current.srcObject = remoteStream;
      } catch (error) {
        console.error('Error setting remote video source:', error);
      }
    }
  }, [localStream, remoteStream]);
  
  // Gestion du microphone
  const toggleMic = () => {
    if (localStream) {
      const audioTracks = localStream.getAudioTracks();
      if (audioTracks.length > 0) {
        audioTracks.forEach(track => {
          track.enabled = !track.enabled;
          setMicEnabled(track.enabled);
        });
      }
    }
  };
  
  // Gestion de la caméra
  const toggleCamera = () => {
    if (localStream && callState.isVideo) {
      const videoTracks = localStream.getVideoTracks();
      if (videoTracks.length > 0) {
        videoTracks.forEach(track => {
          track.enabled = !track.enabled;
          setCameraEnabled(track.enabled);
        });
      }
    }
  };
  
  // Gestion de la fin d'appel
  const handleEndCall = () => {
    try {
      endCall();
      setDialogOpen(false);
      toast.success('Appel terminé');
    } catch (error) {
      console.error('Error ending call:', error);
      toast.error('Erreur lors de la fermeture de l\'appel');
      
      // Forcer la fermeture de l'interface en cas d'erreur
      setDialogOpen(false);
    }
  };
  
  // Force cleanup on unmount
  useEffect(() => {
    return () => {
      try {
        endCall();
      } catch (error) {
        console.error('Error during cleanup:', error);
      }
    };
  }, [endCall]);
  
  if (!callState.isInCall) return null;
  
  // Use Dialog for accessibility
  return (
    <Dialog open={dialogOpen} onOpenChange={(open) => {
      if (!open) handleEndCall();
      setDialogOpen(open);
    }}>
      <DialogContent className="p-0 max-w-full w-full h-full max-h-screen sm:max-w-full sm:rounded-none" onInteractOutside={(e) => e.preventDefault()}>
        <DialogTitle className="sr-only">Appel en cours</DialogTitle>
        <DialogDescription className="sr-only">
          Interface d'appel {callState.isVideo ? "vidéo" : "audio"} avec contrôles
        </DialogDescription>
        
        <div className="fixed inset-0 bg-black bg-opacity-75 z-50 flex flex-col">
          <div className="flex-1 relative flex items-center justify-center">
            {/* Remote Video (Main View) */}
            {callState.isVideo && (
              remoteStream ? (
                <video 
                  ref={remoteVideoRef} 
                  autoPlay 
                  playsInline 
                  className="max-h-full max-w-full"
                />
              ) : (
                <div className="flex items-center justify-center h-full w-full">
                  <div className="w-32 h-32 bg-red-800 text-white rounded-full flex items-center justify-center">
                    <span className="text-4xl font-bold">?</span>
                  </div>
                </div>
              )
            )}
            
            {/* Audio call UI */}
            {!callState.isVideo && (
              <div className="flex flex-col items-center justify-center">
                <div className="w-32 h-32 bg-red-800 text-white rounded-full flex items-center justify-center mb-4">
                  <span className="text-4xl font-bold">?</span>
                </div>
                <h2 className="text-2xl text-white font-medium">Appel en cours...</h2>
                <p className="text-white opacity-75">Audio uniquement</p>
              </div>
            )}
            
            {/* Local Video (Picture-in-Picture) */}
            {callState.isVideo && localStream && (
              <div className="absolute bottom-4 right-4 w-48 h-auto border-2 border-white rounded-lg overflow-hidden shadow-lg">
                <video 
                  ref={localVideoRef} 
                  autoPlay 
                  playsInline 
                  muted
                  className="w-full h-full object-cover"
                />
              </div>
            )}
          </div>
          
          {/* Call Controls */}
          <div className="bg-gray-900 p-4 flex justify-center space-x-4">
            {/* Mic Toggle */}
            <Button
              onClick={toggleMic}
              className={micEnabled ? "bg-gray-700" : "bg-red-600"}
              size="icon"
            >
              {micEnabled ? <Mic className="h-5 w-5" /> : <MicOff className="h-5 w-5" />}
            </Button>
            
            {/* End Call */}
            <Button
              onClick={handleEndCall}
              className="bg-red-600 hover:bg-red-700 rounded-full h-14 w-14"
            >
              <PhoneOff className="h-6 w-6" />
            </Button>
            
            {/* Camera Toggle (only in video calls) */}
            {callState.isVideo && (
              <Button
                onClick={toggleCamera}
                className={cameraEnabled ? "bg-gray-700" : "bg-red-600"}
                size="icon"
              >
                {cameraEnabled ? <VideoIcon className="h-5 w-5" /> : <VideoOff className="h-5 w-5" />}
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CallInterface;
