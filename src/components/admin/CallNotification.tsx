
import React, { useEffect, useRef, useState } from 'react';
import { useVideoCall } from '@/contexts/VideoCallContext';
import { 
  PhoneCall,
  PhoneOff,
  Video,
  User
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/sonner';
import { playNotificationSound, vibrateDevice } from '@/utils/audio-utils';

const CallNotification = () => {
  const { incomingCall, acceptCall, rejectCall } = useVideoCall();
  const ringtoneRef = useRef<HTMLAudioElement | null>(null);
  const [ringtonePlaying, setRingtonePlaying] = useState(false);
  
  // Initialize audio element when component loads
  useEffect(() => {
    // Clean up previous audio element if it exists
    if (ringtoneRef.current) {
      ringtoneRef.current.pause();
      ringtoneRef.current = null;
    }
    
    try {
      // Utiliser une chaîne audio encodée en base64 au lieu d'un fichier externe
      // Cela contourne les problèmes de chargement du fichier son
      const audioBase64 = 'data:audio/mpeg;base64,SUQzBAAAAAABEVRYWFgAAAAtAAADY29tbWVudABCYXNlNjQgZW5jb2RlZCBhdWRpbyBmb3IgcmluZ3RvbmUAAFRDT04AAAAHAAADaVR1bmVzAE1UQ09NAAAAGwAAA2VuY29kZXIAUHJvIFRvb2xzIDEwLjYuNgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA//uQxAADwAABpAAAACAAADSAAAAETEFNRTMuOTkuNVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVQ==';
      
      // Créer un nouvel élément audio avec cette source
      const audio = new Audio(audioBase64);
      audio.loop = true;
      audio.preload = 'auto';
      
      // Add event listeners to track playback status
      audio.addEventListener('play', () => {
        console.log('Ringtone started playing');
        setRingtonePlaying(true);
      });
      
      audio.addEventListener('pause', () => {
        console.log('Ringtone paused');
        setRingtonePlaying(false);
      });
      
      // Add error event listener
      audio.addEventListener('error', (e) => {
       // console.error("Ringtone error:", e);
        // Use fallback notification mechanism
        fallbackNotification();
      });
      
      // Load audio
      audio.load();
      ringtoneRef.current = audio;
      
    } catch (err) {
      console.error("Could not create audio element:", err);
      fallbackNotification();
    }
    
    // Cleanup on unmount
    return () => {
      if (ringtoneRef.current) {
        ringtoneRef.current.pause();
        ringtoneRef.current.src = '';
        ringtoneRef.current = null;
      }
    };
  }, []);
  
  // Play or stop the ringtone based on incomingCall
  useEffect(() => {
    if (incomingCall && ringtoneRef.current) {
      console.log("Playing ringtone for incoming call from:", incomingCall.name);
      
      // Use try/catch for play to handle autoplay policy issues
      ringtoneRef.current.play().catch(err => {
        console.error("Could not play ringtone:", err);
        fallbackNotification();
      });
    } else if (ringtoneRef.current) {
      // Stop the ringtone
      ringtoneRef.current.pause();
      ringtoneRef.current.currentTime = 0;
    }
  }, [incomingCall]);
  
  // Fallback notification function
  const fallbackNotification = () => {
    // Fallbacks if audio playback fails
    if (navigator.vibrate) {
      vibrateDevice();
    }
    
    if ("Notification" in window && Notification.permission !== "denied") {
      Notification.requestPermission().then(permission => {
        if (permission === "granted" && incomingCall) {
          new Notification("Appel entrant de " + (incomingCall?.name || "inconnu"), {
            icon: "/favicon.ico"
          });
        }
      });
    }
    
    // Visual fallback - flash the notification
    if (incomingCall) {
      toast.info(`Appel entrant de ${incomingCall.name}`);
    }
  };
  
  // Handle call acceptance with error handling
  const handleAcceptCall = async () => {
    try {
      console.log("Accepting call from:", incomingCall?.name);
      await acceptCall();
    } catch (error) {
      console.error("Error accepting call:", error);
      toast.error("Impossible d'accepter l'appel. Vérifiez vos permissions de microphone et caméra.");
    }
  };
  
  if (!incomingCall) return null;
  
  return (
    <div className="fixed top-4 right-4 bg-white shadow-lg rounded-lg p-4 border z-50 w-80 animate-in fade-in slide-in-from-top-5 duration-300" role="alertdialog" aria-label="Appel entrant">
      <div className="flex items-center mb-4">
        <div className="w-12 h-12 bg-red-800 text-white rounded-full flex items-center justify-center mr-4">
          <User className="h-6 w-6" />
        </div>
        <div>
          <h3 className="font-medium">{incomingCall.name}</h3>
          <p className="text-sm text-muted-foreground">
            {incomingCall.isVideo ? "Appel vidéo entrant" : "Appel audio entrant"}
          </p>
        </div>
        {incomingCall.isVideo ? <Video className="ml-auto h-5 w-5" /> : <PhoneCall className="ml-auto h-5 w-5" />}
      </div>
      
      <div className="flex space-x-2 justify-center">
        <Button
          onClick={rejectCall}
          className="bg-red-600 hover:bg-red-700 text-white"
          size="sm"
        >
          <PhoneOff className="h-4 w-4 mr-2" />
          Refuser
        </Button>
        <Button
          onClick={handleAcceptCall}
          className="bg-green-600 hover:bg-green-700 text-white"
          size="sm"
        >
          <PhoneCall className="h-4 w-4 mr-2" />
          Répondre
        </Button>
      </div>
    </div>
  );
};

export default CallNotification;
