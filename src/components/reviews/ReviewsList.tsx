
import React, { useState } from 'react';
import { Review } from '@/services/api';
import StarRating from './StarRating';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';
import ReviewPhotoThumbnails from './ReviewPhotoThumbnails';
import ReviewDetail from './ReviewDetail';
import { Button } from '@/components/ui/button';
import { GalleryHorizontal } from 'lucide-react';

interface ReviewsListProps {
  reviews: Review[];
}

const ReviewsList: React.FC<ReviewsListProps> = ({ reviews }) => {
  const [selectedReviewId, setSelectedReviewId] = useState<string | null>(null);

  if (reviews.length === 0) {
    return (
      <div className="text-center py-4">
        <p className="text-muted-foreground">Aucun commentaire pour ce produit.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {reviews.map((review) => (
        <div key={review.id} className="border-b pb-4">
          <div className="flex justify-between items-center mb-2">
            <h4 className="font-medium">{review.userName}</h4>
            <span className="text-sm text-muted-foreground">
              {formatDistanceToNow(new Date(review.createdAt), { addSuffix: true, locale: fr })}
            </span>
          </div>
          
          <div className="grid grid-cols-2 gap-4 mb-3">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Produit</p>
              <div className="flex justify-center">
                <StarRating rating={review.productRating} readOnly />
              </div>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1 text-center">Livraison</p>
              <div className="flex justify-center">
                <StarRating rating={review.deliveryRating} readOnly />
              </div>
            </div>
          </div>
          
          {review.comment && (
            <p className="mt-2 text-sm">{review.comment}</p>
          )}
          
          {review.photos && review.photos.length > 0 && (
            <div className="mt-3">
              <ReviewPhotoThumbnails photos={review.photos} reviewId={review.id} />
              
              <Button 
                variant="ghost" 
                size="sm" 
                className="mt-2"
                onClick={() => setSelectedReviewId(review.id)}
              >
                <GalleryHorizontal className="mr-1 h-4 w-4" />
                Voir toutes les photos et détails
              </Button>
            </div>
          )}
        </div>
      ))}
      
      {selectedReviewId && (
        <ReviewDetail
          reviewId={selectedReviewId}
          isOpen={!!selectedReviewId}
          onClose={() => setSelectedReviewId(null)}
        />
      )}
    </div>
  );
};

export default ReviewsList;
