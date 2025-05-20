
import { useEffect, useState } from 'react';
import { format, parseISO, differenceInHours } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Appointment } from './AppointmentService';
import { toast } from '@/hooks/use-toast';
import { playNotificationSound } from '@/utils/audio-utils';
import { Button } from '@/components/ui/button';

const NOTIFICATION_STORAGE_KEY = 'confirmed_notifications';

export function useNotificationService(appointments: Appointment[]) {
  const [confirmedNotifications, setConfirmedNotifications] = useState<string[]>([]);
  
  // Load confirmed notifications from localStorage on component mount
  useEffect(() => {
    const savedNotifications = localStorage.getItem(NOTIFICATION_STORAGE_KEY);
    if (savedNotifications) {
      setConfirmedNotifications(JSON.parse(savedNotifications));
    }
  }, []);
  
  // Save confirmed notifications to localStorage when they change
  useEffect(() => {
    localStorage.setItem(NOTIFICATION_STORAGE_KEY, JSON.stringify(confirmedNotifications));
  }, [confirmedNotifications]);
  
  // Check for upcoming appointments and show notifications
  useEffect(() => {
    checkUpcomingAppointments();
  }, [appointments]);
  
  const checkUpcomingAppointments = () => {
    if (!appointments || appointments.length === 0) return;
    
    const now = new Date();
    
    appointments.forEach(appointment => {
      try {
        const appointmentId = appointment.id.toString();
        
        // Skip if this notification has already been confirmed
        if (confirmedNotifications.includes(appointmentId)) {
          return;
        }
        
        const appointmentDate = parseISO(appointment.date);
        const appointmentTime = appointment.heure.split(':');
        
        // Set appointment datetime with hours and minutes
        appointmentDate.setHours(
          parseInt(appointmentTime[0], 10),
          parseInt(appointmentTime[1] || '0', 10),
          0,
          0
        );
        
        // Calculate hours until appointment
        const hoursUntil = differenceInHours(appointmentDate, now);
        
        // Only show notification if appointment is within 24 hours
        if (hoursUntil > 0 && hoursUntil <= 24) {
          showNotification(appointment);
        }
      } catch (error) {
        console.error("Error processing appointment notification:", error);
      }
    });
  };
  
  const showNotification = (appointment: Appointment) => {
    // Format the date in French
    const formattedDate = format(
      parseISO(appointment.date),
      "dd/MM/yyyy",
      { locale: fr }
    );

    // Play notification sound
    playNotificationSound();
    
    // Show toast notification
    toast({
      title: "Rappel de rendez-vous",
      description: `Vous aurez un rendez-vous le ${formattedDate} à ${appointment.heure} à "${appointment.location}", "${appointment.description}"`,
      variant: "destructive",
      action: (
        <Button 
          variant="secondary" 
          className="bg-black text-white"
          onClick={() => confirmNotification(appointment.id.toString())}
        >
          OK
        </Button>
      ),
    });
  };
  
  const confirmNotification = (appointmentId: string) => {
    setConfirmedNotifications(prev => [...prev, appointmentId]);
  };
  
  const resetNotifications = () => {
    setConfirmedNotifications([]);
    localStorage.removeItem(NOTIFICATION_STORAGE_KEY);
  };
  
  return {
    resetNotifications,
    confirmNotification
  };
}
