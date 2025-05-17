
import React from 'react';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { GalleryHorizontal } from 'lucide-react';

interface ReviewPhotoThumbnailsProps {
  photos: string[];
  reviewId: string;
}

const ReviewPhotoThumbnails: React.FC<ReviewPhotoThumbnailsProps> = ({ photos, reviewId }) => {
  // URL de base récupérée depuis le .env
  const AUTH_BASE_URL = import.meta.env.VITE_API_BASE_URL;
  
  if (!photos || photos.length === 0) return null;

  return (
    <div className="mt-3">
      <div className="flex flex-wrap gap-2">
        {photos.map((photo, index) => (
          <Dialog key={index}>
            <DialogTrigger asChild>
              <div className="w-16 h-16 rounded overflow-hidden cursor-pointer hover:opacity-90 transition-opacity">
                <img 
                  src={`${AUTH_BASE_URL}${photo}`} 
                  alt={`Photo du commentaire ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </div>
            </DialogTrigger>
            <DialogContent className="max-w-3xl p-1 bg-background">
              <img 
                src={`${AUTH_BASE_URL}${photo}`} 
                alt={`Photo du commentaire ${index + 1}`}
                className="w-full h-auto max-h-[80vh] object-contain"
              />
            </DialogContent>
          </Dialog>
        ))}
        
        {photos.length > 0 && (
          <Dialog>
            <DialogTrigger asChild>
              <div className="flex items-center justify-center w-16 h-16 rounded bg-muted cursor-pointer hover:bg-muted/80 transition-colors">
                <GalleryHorizontal size={20} />
              </div>
            </DialogTrigger>
            <DialogContent className="max-w-4xl p-4">
              <h3 className="text-lg font-medium mb-4">Photos du commentaire</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {photos.map((photo, index) => (
                  <img 
                    key={index}
                    src={`${AUTH_BASE_URL}${photo}`}
                    alt={`Photo du commentaire ${index + 1}`}
                    className="w-full h-auto rounded"
                  />
                ))}
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>
    </div>
  );
};

export default ReviewPhotoThumbnails;
