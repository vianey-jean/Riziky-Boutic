
/**
 * Audio utilities for the application
 * Functions for managing audio playback in the application
 */

/**
 * Play a notification sound from a static file
 * @param soundFile Path to the audio file in the public folder
 * @returns Audio element or null in case of error
 */
export const playNotificationSound = (soundFile: string = '/ringtone.mp3'): HTMLAudioElement | null => {
  try {
    const audio = new Audio(soundFile);
    
    // Add error listener before playing
    audio.addEventListener('error', (err) => {
      console.error("Could not play notification sound:", err);
    });
    
    // Force load the audio first
    audio.load();
    
    // Play with error handling
    audio.play().catch(err => {
      console.error("Could not play notification sound:", err);
      
      // Try fallback approaches
      vibrateDevice();
      createSystemNotification("Notification", { body: "New notification" });
    });
    
    return audio;
  } catch (error) {
    console.error("Error playing notification sound:", error);
    return null;
  }
};

/**
 * Create a system notification with sound if possible
 * @param title Title of the notification
 * @param options Options for the notification
 * @returns true if the notification was created, false otherwise
 */
export const createSystemNotification = (title: string, options?: NotificationOptions): boolean => {
  if ("Notification" in window) {
    if (Notification.permission === "granted") {
      new Notification(title, options);
      return true;
    } else if (Notification.permission !== "denied") {
      Notification.requestPermission().then(permission => {
        if (permission === "granted") {
          new Notification(title, options);
          return true;
        }
      });
    }
  }
  return false;
};

/**
 * Trigger device vibration if available
 * @param pattern Vibration pattern
 * @returns true if vibration was triggered, false otherwise
 */
export const vibrateDevice = (pattern: number[] = [200, 100, 200]): boolean => {
  if (navigator.vibrate) {
    navigator.vibrate(pattern);
    return true;
  }
  return false;
};
