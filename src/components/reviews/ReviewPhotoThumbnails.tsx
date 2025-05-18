
import React, { useState, useRef, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  GalleryHorizontal,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { VisuallyHidden } from '@radix-ui/react-visually-hidden';

interface ReviewPhotoThumbnailsProps {
  photos: string[];
  reviewId: string;
}

const ReviewPhotoThumbnails: React.FC<ReviewPhotoThumbnailsProps> = ({
  photos,
  reviewId,
}) => {
  const AUTH_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
  const [dialogOpen, setDialogOpen] = useState(false);

  // Vérifie si les flèches doivent être affichées
  const checkScrollability = () => {
    const container = scrollContainerRef.current;
    if (container) {
      const { scrollLeft, scrollWidth, clientWidth } = container;
      setCanScrollLeft(scrollLeft > 5);
      setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 5);
    }
  };

  // Met à jour l'état au scroll et redimensionnement
  useEffect(() => {
    checkScrollability();
    const container = scrollContainerRef.current;
    container?.addEventListener('scroll', checkScrollability);
    window.addEventListener('resize', checkScrollability);

    return () => {
      container?.removeEventListener('scroll', checkScrollability);
      window.removeEventListener('resize', checkScrollability);
    };
  }, [photos]);

  // Gestionnaire d'événements pour les touches du clavier
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!dialogOpen) return;
      
      if (e.key === 'ArrowLeft') {
        navigatePhotos('prev');
      } else if (e.key === 'ArrowRight') {
        navigatePhotos('next');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [dialogOpen, currentPhotoIndex]);

  const scroll = (direction: 'left' | 'right') => {
    const container = scrollContainerRef.current;
    if (container) {
      const scrollAmount = container.clientWidth / 1.5; // Ajuste pour afficher partiellement les images
      const newScrollPosition =
        direction === 'left'
          ? container.scrollLeft - scrollAmount
          : container.scrollLeft + scrollAmount;

      container.scrollTo({ left: newScrollPosition, behavior: 'smooth' });

      setTimeout(checkScrollability, 350);
    }
  };

  const navigatePhotos = (direction: 'prev' | 'next') => {
    if (direction === 'prev' && currentPhotoIndex > 0) {
      setCurrentPhotoIndex((i) => i - 1);
    } else if (direction === 'next' && currentPhotoIndex < photos.length - 1) {
      setCurrentPhotoIndex((i) => i + 1);
    }
  };

  // Ouvre la dialog avec l'index de l'image sélectionnée
  const openPhotoDialog = (index: number) => {
    setCurrentPhotoIndex(index);
    setDialogOpen(true);
  };

  if (!photos || photos.length === 0) return null;

  return (
    <div className="mt-3 relative">
      <div className="flex items-center">
        {/* Flèche gauche */}
        {photos.length > 3 && (
          <Button
            variant="outline"
            size="icon"
            className={`absolute left-0 z-10 rounded-full h-8 w-8 bg-white shadow-md border transition-opacity ${
              !canScrollLeft ? 'opacity-0 pointer-events-none' : ''
            }`}
            onClick={() => scroll('left')}
          >
            <ChevronLeft className="h-4 w-4" />
            <span className="sr-only">Photos précédentes</span>
          </Button>
        )}

        {/* Liste des miniatures */}
        <div
          ref={scrollContainerRef}
          className="flex overflow-x-auto gap-2 py-1 px-2 scrollbar-hide scroll-smooth"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {photos.map((photo, index) => (
            <Dialog key={index} open={dialogOpen && currentPhotoIndex === index} onOpenChange={(open) => {
              if (open) {
                openPhotoDialog(index);
              } else {
                setDialogOpen(false);
              }
            }}>
              <DialogTrigger asChild>
                <div className="w-16 h-16 rounded overflow-hidden cursor-pointer hover:opacity-90 transition-opacity flex-shrink-0">
                  <img
                    src={`${AUTH_BASE_URL}${photo}`}
                    alt={`Photo du commentaire ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </div>
              </DialogTrigger>
              <DialogContent className="max-w-3xl p-1 bg-background">
                <DialogTitle>
                  <VisuallyHidden>Photo {index + 1}</VisuallyHidden>
                </DialogTitle>
                <div className="relative">
                  <img
                    src={`${AUTH_BASE_URL}${photos[currentPhotoIndex]}`}
                    alt={`Photo du commentaire ${currentPhotoIndex + 1}`}
                    className="w-full h-auto max-h-[80vh] object-contain"
                  />
                  {currentPhotoIndex > 0 && (
                    <Button
                      variant="outline"
                      size="icon"
                      className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full h-10 w-10 bg-white/80 shadow-md border hover:bg-white"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        navigatePhotos('prev');
                      }}
                    >
                      <ChevronLeft className="h-5 w-5" />
                      <span className="sr-only">Photo précédente</span>
                    </Button>
                  )}
                  {currentPhotoIndex < photos.length - 1 && (
                    <Button
                      variant="outline"
                      size="icon"
                      className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full h-10 w-10 bg-white/80 shadow-md border hover:bg-white"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        navigatePhotos('next');
                      }}
                    >
                      <ChevronRight className="h-5 w-5" />
                      <span className="sr-only">Photo suivante</span>
                    </Button>
                  )}
                </div>
              </DialogContent>
            </Dialog>
          ))}

          {/* Dernière vignette avec icône Galerie */}
          <Dialog>
            <DialogTrigger asChild>
              <div className="flex items-center justify-center w-16 h-16 rounded bg-muted cursor-pointer hover:bg-muted/80 transition-colors flex-shrink-0">
                <GalleryHorizontal size={20} />
              </div>
            </DialogTrigger>
            <DialogContent className="max-w-4xl p-4">
              <DialogTitle>Photos du commentaire</DialogTitle>
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
        </div>

        {/* Flèche droite */}
        {photos.length > 3 && (
          <Button
            variant="outline"
            size="icon"
            className={`absolute right-0 z-10 rounded-full h-8 w-8 bg-white shadow-md border transition-opacity ${
              !canScrollRight ? 'opacity-0 pointer-events-none' : ''
            }`}
            onClick={() => scroll('right')}
          >
            <ChevronRight className="h-4 w-4" />
            <span className="sr-only">Photos suivantes</span>
          </Button>
        )}
      </div>
    </div>
  );
};

export default ReviewPhotoThumbnails;
