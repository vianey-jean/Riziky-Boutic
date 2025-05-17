
import React, { useState, useEffect } from 'react';
import { Review, reviewsAPI } from '@/services/api';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import StarRating from './StarRating';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertTriangle } from 'lucide-react';

interface ReviewDetailProps {
  reviewId: string;
  onClose: () => void;
  isOpen: boolean;
}

const ReviewDetail: React.FC<ReviewDetailProps> = ({ reviewId, onClose, isOpen }) => {
  const [review, setReview] = useState<Review | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // URL de base récupérée depuis le .env
  const AUTH_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  useEffect(() => {
    if (isOpen && reviewId) {
      fetchReviewDetails();
    }
  }, [reviewId, isOpen]);

  const fetchReviewDetails = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await reviewsAPI.getReviewDetail(reviewId);
      setReview(response.data);
    } catch (err) {
      console.error('Erreur lors du chargement des détails du commentaire:', err);
      setError('Impossible de charger les détails du commentaire');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Détails du commentaire</DialogTitle>
        </DialogHeader>
        
        {loading ? (
          <div className="flex justify-center py-8">Chargement...</div>
        ) : error ? (
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        ) : review ? (
          <div className="py-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-medium">{review.userName}</h3>
              <span className="text-sm text-muted-foreground">
                {formatDistanceToNow(new Date(review.createdAt), { addSuffix: true, locale: fr })}
              </span>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Produit</p>
                <div className="flex items-center">
                  <StarRating rating={review.productRating} readOnly />
                  <span className="ml-2 font-semibold">{review.productRating}</span>
                </div>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Livraison</p>
                <div className="flex items-center">
                  <StarRating rating={review.deliveryRating} readOnly />
                  <span className="ml-2 font-semibold">{review.deliveryRating}</span>
                </div>
              </div>
            </div>
            
            {review.comment && (
              <div className="mb-6">
                <h4 className="font-medium mb-2">Commentaire</h4>
                <p className="text-sm">{review.comment}</p>
              </div>
            )}
            
            {review.photos && review.photos.length > 0 && (
              <div className="mb-6">
                <Separator className="mb-4" />
                <h4 className="font-medium mb-3">Photos publiées ({review.photos.length})</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {review.photos.map((photo, index) => (
                    <img 
                      key={index}
                      src={`${AUTH_BASE_URL}${photo}`}
                      alt={`Photo ${index + 1}`}
                      className="w-full h-auto rounded-md object-contain"
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-4">Commentaire non trouvé</div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default ReviewDetail;
