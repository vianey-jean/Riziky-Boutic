
import React, { useEffect } from 'react';
import { useVideoCall } from '@/contexts/VideoCallContext';
import { 
  PhoneCall,
  PhoneOff,
  Video,
  User
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/sonner';
import { VisuallyHidden } from '@radix-ui/react-visually-hidden';

// Son de sonnerie statique (URL vers un fichier audio hébergé)
const RINGTONE_URL = 'https://actions.google.com/sounds/v1/alarms/beep_short.ogg';

const CallNotification = () => {
  const { incomingCall, acceptCall, rejectCall } = useVideoCall();
  const audioRef = React.useRef<HTMLAudioElement | null>(null);
  
  // Créer et gérer l'audio element pour la sonnerie
  useEffect(() => {
    if (incomingCall) {
      // Créer un élément audio pour la sonnerie
      if (!audioRef.current) {
        const audio = new Audio(RINGTONE_URL);
        audio.loop = true;
        audioRef.current = audio;
      }
      
      // Jouer la sonnerie
      try {
        audioRef.current.play().catch(err => {
          console.log('Impossible de jouer le son:', err);
        });
      } catch (error) {
        console.error('Erreur avec la lecture audio:', error);
      }
      
      // Utiliser l'API de notification native du navigateur si disponible
      if ("Notification" in window && Notification.permission !== "denied") {
        Notification.requestPermission().then(permission => {
          if (permission === "granted") {
            new Notification("Appel entrant", {
              icon: "/favicon.ico",
              body: `Appel ${incomingCall.isVideo ? 'vidéo' : 'audio'} de ${incomingCall.name}`,
              tag: "incoming-call", // Empêche les notifications multiples
            });
          }
        });
      }
      
      // Nettoyage
      return () => {
        if (audioRef.current) {
          audioRef.current.pause();
          audioRef.current.currentTime = 0;
        }
      };
    }
  }, [incomingCall]);
  
  // Handle accept call with error handling
  const handleAcceptCall = async () => {
    try {
      // Arrêter la sonnerie avant d'accepter l'appel
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
      await acceptCall();
    } catch (error) {
      console.error("Error accepting call:", error);
      toast.error("Impossible d'accepter l'appel. Vérifiez vos permissions de microphone et caméra.");
    }
  };
  
  // Handle reject call
  const handleRejectCall = () => {
    // Arrêter la sonnerie avant de rejeter l'appel
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    rejectCall();
  };
  
  if (!incomingCall) return null;
  
  return (
    <div className="fixed top-4 right-4 bg-white shadow-lg rounded-lg p-4 border z-50 w-80 animate-in fade-in slide-in-from-top-5 duration-300" role="alertdialog" aria-labelledby="incoming-call-title" aria-describedby="incoming-call-desc">
      <div className="flex items-center mb-4">
        <div className="w-12 h-12 bg-red-800 text-white rounded-full flex items-center justify-center mr-4">
          <User className="h-6 w-6" />
        </div>
        <div>
          <h3 id="incoming-call-title" className="font-medium">{incomingCall.name}</h3>
          <p id="incoming-call-desc" className="text-sm text-muted-foreground">
            {incomingCall.isVideo ? "Appel vidéo entrant" : "Appel audio entrant"}
          </p>
        </div>
        {incomingCall.isVideo ? <Video className="ml-auto h-5 w-5" /> : <PhoneCall className="ml-auto h-5 w-5" />}
      </div>
      
      <div className="flex space-x-2 justify-center">
        <Button
          onClick={handleRejectCall}
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
