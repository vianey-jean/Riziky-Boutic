
/**
 * Audio utilities for the application
 * Simple ringtone in base64 format
 */

// A small, simple ringtone in base64 format (correctly encoded)
const RINGTONE_BASE64 = "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";

/**
 * Creates a blob URL for the ringtone audio
 * @returns A blob URL for the ringtone audio or null if there was an error
 */
export const createAudioBlobUrl = (): string | null => {
  try {
    // Decode the base64 string to binary
    const binaryString = window.atob(RINGTONE_BASE64);
    const bytes = new Uint8Array(binaryString.length);
    
    // Convert to byte array
    for (let i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    
    // Create an audio blob
    const blob = new Blob([bytes.buffer], { type: 'audio/mp3' });
    return URL.createObjectURL(blob);
  } catch (error) {
    console.error("Error creating audio blob URL:", error);
    return null;
  }
};
