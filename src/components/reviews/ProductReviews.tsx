
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, MessageSquare } from 'lucide-react';
import { reviewsAPI } from '@/services/reviewsAPI';
import { Review } from '@/types/review';
import ReviewsList from './ReviewsList';
import ReviewForm from './ReviewForm';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/components/ui/sonner';

interface ProductReviewsProps {
  productId: string;
}

const ProductReviews: React.FC<ProductReviewsProps> = ({ productId }) => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const { isAuthenticated } = useAuth();

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const response = await reviewsAPI.getProductReviews(productId);
      setReviews(response.data);
    } catch (error) {
      console.error('Erreur lors du chargement des commentaires:', error);
      toast.error('Erreur lors du chargement des commentaires');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, [productId]);

  const handleSubmitReview = async (formData: FormData) => {
    try {
      const response = await reviewsAPI.addReview(formData);
      setReviews(prev => [response.data, ...prev]);
      setShowForm(false);
      toast.success('Votre avis a été ajouté avec succès !');
    } catch (error) {
      console.error('Error submitting review:', error);
      throw error; // Laisser le ReviewForm gérer l'erreur
    }
  };

  const averageRating = reviews.length > 0 
    ? reviews.reduce((sum, review) => sum + ((review.productRating + review.deliveryRating) / 2), 0) / reviews.length 
    : 0;

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center">Chargement des commentaires...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center">
            <MessageSquare className="mr-2 h-5 w-5" />
            Avis clients ({reviews.length})
            {reviews.length > 0 && (
              <span className="ml-2 text-sm text-muted-foreground">
                (Note moyenne: {averageRating.toFixed(1)}/5)
              </span>
            )}
          </div>
          {isAuthenticated && !showForm && (
            <Button
              onClick={() => setShowForm(true)}
              size="sm"
              className="bg-red-600 hover:bg-red-700"
            >
              <Plus className="mr-2 h-4 w-4" />
              Laisser un avis
            </Button>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {showForm && (
          <div className="mb-6 p-4 border rounded-lg bg-muted/50">
            <h3 className="font-medium mb-4">Laisser un commentaire</h3>
            <ReviewForm
              productId={productId}
              onSubmit={handleSubmitReview}
            />
            <Button
              variant="outline"
              onClick={() => setShowForm(false)}
              className="mt-2"
            >
              Annuler
            </Button>
          </div>
        )}
        
        <ReviewsList reviews={reviews} />
      </CardContent>
    </Card>
  );
};

export default ProductReviews;
