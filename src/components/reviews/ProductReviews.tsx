
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, MessageSquare, Users, Star } from 'lucide-react';
import { reviewsAPI } from '@/services/reviewsAPI';
import { Review } from '@/types/review';
import ModernReviewsList from './ModernReviewsList';
import ModernReviewForm from './ModernReviewForm';
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
      // Organiser les reviews avec leurs réponses
      const organizedReviews = organizeReviewsWithReplies(response.data);
      setReviews(organizedReviews);
    } catch (error) {
      console.error('Erreur lors du chargement des commentaires:', error);
      toast.error('Erreur lors du chargement des commentaires');
    } finally {
      setLoading(false);
    }
  };

  const organizeReviewsWithReplies = (reviewsList: Review[]): Review[] => {
    const reviewsMap = new Map<string, Review>();
    const rootReviews: Review[] = [];

    // Première passe : créer la map et identifier les reviews principales
    reviewsList.forEach(review => {
      reviewsMap.set(review.id, { ...review, replies: [] });
      if (!review.parentId) {
        rootReviews.push(reviewsMap.get(review.id)!);
      }
    });

    // Deuxième passe : attacher les réponses aux reviews principales
    reviewsList.forEach(review => {
      if (review.parentId && reviewsMap.has(review.parentId)) {
        const parentReview = reviewsMap.get(review.parentId)!;
        const childReview = reviewsMap.get(review.id)!;
        if (!parentReview.replies) {
          parentReview.replies = [];
        }
        parentReview.replies.push(childReview);
      }
    });

    // Trier par date (plus récents en premier)
    return rootReviews.sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  };

  useEffect(() => {
    fetchReviews();
  }, [productId]);

  const handleSubmitReview = async (formData: FormData) => {
    try {
      await reviewsAPI.addReview(formData);
      toast.success('Votre avis a été ajouté avec succès !');
      setShowForm(false);
      fetchReviews();
    } catch (error) {
      console.error('Error submitting review:', error);
      throw error;
    }
  };

  const calculateAverageRating = () => {
    if (reviews.length === 0) return 0;
    const mainReviews = reviews.filter(r => !r.parentId);
    const totalRating = mainReviews.reduce((sum, review) => 
      sum + ((review.productRating + review.deliveryRating) / 2), 0
    );
    return totalRating / mainReviews.length;
  };

  const getTotalReviewsCount = () => {
    let count = 0;
    reviews.forEach(review => {
      count++; // Review principale
      if (review.replies) {
        count += review.replies.length; // Réponses
      }
    });
    return count;
  };

  const averageRating = calculateAverageRating();
  const totalReviews = getTotalReviewsCount();
  const mainReviewsCount = reviews.filter(r => !r.parentId).length;

  if (loading) {
    return (
      <Card className="border-0 shadow-lg">
        <CardContent className="p-8">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600"></div>
            <span className="ml-3 text-gray-600">Chargement des commentaires...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* En-tête des commentaires */}
      <Card className="border-0 shadow-lg bg-gradient-to-r from-red-50 to-pink-50 dark:from-red-900/20 dark:to-pink-900/20">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-red-100 dark:bg-red-900/30 rounded-lg">
                <MessageSquare className="h-6 w-6 text-red-600" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                  Avis clients
                </h2>
                <div className="flex items-center space-x-4 mt-1">
                  <div className="flex items-center space-x-1">
                    <Users className="h-4 w-4 text-gray-500" />
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      {totalReviews} commentaire{totalReviews > 1 ? 's' : ''}
                    </span>
                  </div>
                  {mainReviewsCount > 0 && (
                    <div className="flex items-center space-x-1">
                      <Star className="h-4 w-4 text-yellow-500" />
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        {averageRating.toFixed(1)}/5
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
            
            {isAuthenticated && (
              <Button
                onClick={() => setShowForm(!showForm)}
                className="bg-red-600 hover:bg-red-700 text-white shadow-lg hover:shadow-xl transition-all duration-200"
              >
                <Plus className="mr-2 h-4 w-4" />
                {showForm ? 'Annuler' : 'Laisser un avis'}
              </Button>
            )}
          </CardTitle>
        </CardHeader>
      </Card>

      {/* Formulaire d'ajout de commentaire */}
      {showForm && isAuthenticated && (
        <ModernReviewForm
          productId={productId}
          onSubmit={handleSubmitReview}
          onCancel={() => setShowForm(false)}
        />
      )}

      {/* Message pour les utilisateurs non connectés */}
      {!isAuthenticated && (
        <Card className="border-yellow-200 bg-yellow-50 dark:bg-yellow-900/20">
          <CardContent className="p-4">
            <p className="text-yellow-800 dark:text-yellow-200 text-center">
              <strong>Connectez-vous</strong> pour laisser un avis et interagir avec les commentaires
            </p>
          </CardContent>
        </Card>
      )}

      {/* Liste des commentaires */}
      <ModernReviewsList 
        reviews={reviews} 
        onReviewUpdate={fetchReviews}
      />
    </div>
  );
};

export default ProductReviews;
