
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
import { createAudioBlobUrl } from '@/utils/audio-utils';

const CallNotification = () => {
  const { incomingCall, acceptCall, rejectCall } = useVideoCall();
  const ringtoneRef = useRef<HTMLAudioElement | null>(null);
  const [ringtoneBlobUrl, setRingtoneBlobUrl] = useState<string | null>(null);
  
  // Créer le blob URL pour le son au chargement du composant
  useEffect(() => {
    const blobUrl = createAudioBlobUrl();
    if (blobUrl) {
      setRingtoneBlobUrl(blobUrl);
    }
    
    // Nettoyer le blob URL à la destruction du composant
    return () => {
      if (ringtoneBlobUrl) {
        URL.revokeObjectURL(ringtoneBlobUrl);
      }
    };
  }, []);
  
  // Initialiser et jouer/arrêter la sonnerie quand incomingCall change
  useEffect(() => {
    // Créer l'élément audio s'il n'existe pas
    if (!ringtoneRef.current && ringtoneBlobUrl) {
      try {
        ringtoneRef.current = new Audio(ringtoneBlobUrl);
        ringtoneRef.current.loop = true;
        ringtoneRef.current.preload = 'auto';
        
        // Ajouter un écouteur d'événements pour les erreurs
        ringtoneRef.current.addEventListener('error', (e) => {
          console.error("Ringtone error:", e);
          // Utiliser la notification native du navigateur si disponible
          if ("Notification" in window && Notification.permission === "granted") {
            new Notification("Appel entrant", {
              icon: "/favicon.ico",
              silent: false
            });
          }
        });
      } catch (err) {
        console.error("Could not create audio element:", err);
      }
    }
    
    // Jouer la sonnerie lorsqu'il y a un appel entrant
    if (incomingCall && ringtoneRef.current) {
      console.log("Playing ringtone for incoming call from:", incomingCall.name);
      ringtoneRef.current.play().catch(err => {
        console.error("Could not play ringtone:", err);
        // Demander la permission pour les notifications comme solution de secours
        if ("Notification" in window && Notification.permission !== "denied") {
          Notification.requestPermission();
        }
      });
    } else if (ringtoneRef.current) {
      // Arrêter la sonnerie lorsqu'il n'y a pas d'appel entrant
      ringtoneRef.current.pause();
      ringtoneRef.current.currentTime = 0;
    }
    
    // Nettoyage lors du démontage
    return () => {
      if (ringtoneRef.current) {
        ringtoneRef.current.pause();
        ringtoneRef.current.currentTime = 0;
      }
    };
  }, [incomingCall, ringtoneBlobUrl]);
  
  // Gérer l'acceptation de l'appel avec gestion des erreurs
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
