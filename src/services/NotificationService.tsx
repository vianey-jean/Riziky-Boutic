
import React from 'react';
import { format, differenceInHours, parseISO } from 'date-fns';
import { fr } from 'date-fns/locale';
import { toast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';

// Définition de l'interface Appointment ici pour éviter les dépendances circulaires
export interface Appointment {
  id: number | string;
  userId: number | string;
  titre: string;
  description: string;
  date: string;
  heure: string;
  duree: number;
  location: string;
  lieu?: string;
}

const NOTIFICATION_SOUND_BASE64 = "data:audio/mpeg;base64,SUQzBAAAAAAAI1RTU0UAAAAPAAADTGF2ZjU4Ljc2LjEwMAAAAAAAAAAAAAAA/+M4wAAAAAAAAAAAAEluZm8AAAAPAAAAAwAAAbAAyMjIyMjIyMjIyMjIyMjIyMjI8PDw8PDw8PDw8PDw8PDw8PDw////////////////////////////////////////////AAAAAExhdmM1OC4xMwAAAAAAAAAAAAAAACQDQAAAAAABsLlBxsIAAAAAAAAAAAAAAAD/+xDEAAAEMi1tU0EAEPJyabE8Y1RTTVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVTEFNRTMuMTAwVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVWpqqqqqqqqqqqqqqqqqqqqqqqqqqqqANDK4EnF+P/7EMQjA8VmIj5jCgBJLcSiznOquMS7JE3an0hiiYOntN9UKUp/3fh//5cJyf/93X6gCBoMXXUpORDtx9QsXvuCVKXudmW3cd/z/oPfj6X2rL7XioSO3ehZRYmH94vto3//yPX5v+j6cvaebkAAAAECLzkATJEoEikA//sQxCgDxWYhKDOMAGBBP6KBAYAA/8PCkqxUKihlMqHQOBwEBwKAwCAMYcUCgDm2Kn7kGP/////8ioRCIRCMQHmKhCrVQ1DUNTDUNQ1DUQiEQjP//////2dCMQiMQiESiVT6KGQQIpZCh08IDwcOCAHmBoEGAgQDQIDA4GBgwPBx6JJlJ//7EMQ3gAnptVAShgBlCcGsQWGAARuCfHGB5YwMC4XnmgYXC84OCB/eTU1NTU1Pii0rOQ/5R/KP5Q6ammppqavi//KJ/lE+UOHf///6Jphif+UT/KL/KHQTimoqf//ohCE1P///+h0T//////////5oQhP/////uhCEJ//sQxEEDyKIvqAmBHmkDxmZkAYABqf////L////8v//////5Q6HTUTf5Q6L///////oQi//5Q6IE1NTU1NTU0wQHDB5J5J5N5N5N5JodDodDodDodFRUVFRUVdXV1dXV1dXWWWWWZZZlmWZZn/////////////////9//+xDEWgPHAhAfwzAAAAAXkznAAP///////////////4REQiIRCIREQiIRCIREQiIRCIREQiIRCIREQiIRCIREQiIRCPiIREJERCJERCJERCJERCJERCJERCJERCJERCJERCJEQiIh//////////////////sQxIKDwAABpAAAACAAANIAAAAT//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////8=";

export const NotificationService = {
  // Clé pour le stockage local des notifications confirmées
  CONFIRMED_NOTIFICATIONS_KEY: 'confirmed_notifications',

  // Récupérer les notifications confirmées
  getConfirmedNotifications: (): string[] => {
    const confirmed = localStorage.getItem(NotificationService.CONFIRMED_NOTIFICATIONS_KEY);
    return confirmed ? JSON.parse(confirmed) : [];
  },

  // Ajouter une notification confirmée
  addConfirmedNotification: (appointmentId: number | string): void => {
    const confirmed = NotificationService.getConfirmedNotifications();
    if (!confirmed.includes(String(appointmentId))) {
      confirmed.push(String(appointmentId));
      localStorage.setItem(NotificationService.CONFIRMED_NOTIFICATIONS_KEY, JSON.stringify(confirmed));
    }
  },

  // Vérifier si une notification est déjà confirmée
  isNotificationConfirmed: (appointmentId: number | string): boolean => {
    const confirmed = NotificationService.getConfirmedNotifications();
    return confirmed.includes(String(appointmentId));
  },

  // Jouer le son de notification
  playNotificationSound: (): void => {
    try {
      const audio = new Audio(NOTIFICATION_SOUND_BASE64);
      audio.play().catch(error => {
        console.error("Erreur lors de la lecture du son:", error);
      });
    } catch (error) {
      console.error("Erreur lors de la création de l'audio:", error);
    }
  },

  // Afficher les notifications pour les rendez-vous à venir dans moins de 24h
  showAppointmentNotifications: (appointments: Appointment[]): void => {
    if (!appointments || appointments.length === 0) return;

    const now = new Date();
    const upcomingAppointments = appointments.filter(appointment => {
      // Vérifier si la notification a déjà été confirmée
      if (NotificationService.isNotificationConfirmed(appointment.id)) {
        return false;
      }

      try {
        // Créer une date à partir de la date et l'heure du rendez-vous
        const appointmentDate = parseISO(`${appointment.date}T${appointment.heure}`);
        
        // Calculer la différence en heures
        const hoursDifference = differenceInHours(appointmentDate, now);
        
        // Retourner true si le rendez-vous est dans moins de 24h mais n'est pas encore passé
        return hoursDifference > 0 && hoursDifference <= 24;
      } catch (error) {
        console.error("Erreur lors du calcul de la date:", error);
        return false;
      }
    });

    // Afficher une notification pour chaque rendez-vous à venir
    upcomingAppointments.forEach(appointment => {
      try {
        const appointmentDate = parseISO(`${appointment.date}T${appointment.heure}`);
        const formattedDate = format(appointmentDate, "dd/MM/yyyy 'à' HH:mm", { locale: fr });
        const location = appointment.lieu || appointment.location || "";
        
        // Jouer le son de notification
        NotificationService.playNotificationSound();
        
        // Afficher la notification avec Shadcn Toast
        toast({
          variant: "destructive",
          title: "Rappel de rendez-vous",
          description: `Vous aurez un rendez-vous le ${formattedDate} à ${location}, "${appointment.description}".`,
          action: (
            <Button 
              onClick={() => NotificationService.addConfirmedNotification(appointment.id)}
              variant="outline"
              size="sm"
            >
              OK
            </Button>
          ),
        });
      } catch (error) {
        console.error("Erreur lors de l'affichage de la notification:", error);
      }
    });
  }
};

export function useNotificationService(appointments: Appointment[]) {
  React.useEffect(() => {
    if (appointments && appointments.length > 0) {
      NotificationService.showAppointmentNotifications(appointments);
    }
  }, [appointments]);

  const resetNotifications = () => {
    localStorage.removeItem(NotificationService.CONFIRMED_NOTIFICATIONS_KEY);
  };

  return {
    resetNotifications,
  };
}
