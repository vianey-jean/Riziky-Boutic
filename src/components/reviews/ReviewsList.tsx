
import React from 'react';
import { Review } from '@/services/api';
import StarRating from './StarRating';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';

interface ReviewsListProps {
  reviews: Review[];
}

const ReviewsList: React.FC<ReviewsListProps> = ({ reviews }) => {
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
        </div>
      ))}
    </div>
  );
};

export default ReviewsList;
