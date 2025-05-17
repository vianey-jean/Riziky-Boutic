
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { reviewsAPI, Review } from '@/services/api';
import { Button } from '@/components/ui/button';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import ReviewsList from './ReviewsList';
import ReviewForm from './ReviewForm';
import StarRating from './StarRating';
import { AlertTriangle } from 'lucide-react';

interface ProductReviewsProps {
  productId: string;
}

const ProductReviews: React.FC<ProductReviewsProps> = ({ productId }) => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const { isAuthenticated } = useAuth();
  
  const fetchReviews = async () => {
    setLoading(true);
    setError(null);
    
    try {
      console.log('Fetching reviews for product:', productId);
      const response = await reviewsAPI.getProductReviews(productId);
      console.log('Reviews response:', response.data);
      setReviews(response.data);
    } catch (error) {
      console.error('Erreur lors du chargement des commentaires:', error);
      setError('Impossible de charger les commentaires');
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    fetchReviews();
  }, [productId]);
  
  const handleAddReview = async (reviewData: {
    productId: string;
    productRating: number;
    deliveryRating: number;
    comment: string;
  }) => {
    try {
      await reviewsAPI.addReview(reviewData);
      fetchReviews(); // Recharger les commentaires
      setShowForm(false); // Masquer le formulaire
    } catch (error) {
      console.error('Erreur lors de l\'ajout du commentaire:', error);
      throw error; // Remonter l'erreur pour l'afficher dans le formulaire
    }
  };
  
  // Calcul des moyennes des notes
  const calculateAverages = () => {
    if (!reviews || reviews.length === 0) return { productAvg: 0, deliveryAvg: 0, totalAvg: 0 };
    
    const productTotal = reviews.reduce((sum, review) => sum + review.productRating, 0);
    const deliveryTotal = reviews.reduce((sum, review) => sum + review.deliveryRating, 0);
    
    const productAvg = productTotal / reviews.length;
    const deliveryAvg = deliveryTotal / reviews.length;
    const totalAvg = (productAvg + deliveryAvg) / 2;
    
    return {
      productAvg,
      deliveryAvg,
      totalAvg
    };
  };
  
  const { productAvg, deliveryAvg, totalAvg } = calculateAverages();
  
  if (loading) {
    return <div className="py-4 text-center">Chargement des commentaires...</div>;
  }
  
  if (error) {
    return (
      <Alert variant="destructive">
        <AlertTriangle className="h-4 w-4" />
        <AlertTitle>Erreur</AlertTitle>
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }
  
  return (
    <div className="my-8">
      <h2 className="text-2xl font-semibold mb-6">Avis clients</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-muted/30 p-4 rounded-lg text-center">
          <div className="text-4xl font-bold mb-2">{totalAvg.toFixed(1)}</div>
          <div className="flex justify-center mb-1">
            <StarRating rating={totalAvg} />
          </div>
          <div className="text-sm text-muted-foreground">
            {reviews.length} avis
          </div>
        </div>
        
        <div className="bg-muted/30 p-4 rounded-lg">
          <h3 className="font-medium mb-2">Produit</h3>
           <div className="flex justify-center">
          <div className="flex items-center">
            <StarRating rating={productAvg} />
            <span className="ml-2 font-semibold">{productAvg.toFixed(1)}</span>
          </div>
          </div>
        </div>
        
        <div className="bg-muted/30 p-4 rounded-lg">
          <h3 className="font-medium mb-2">Livraison</h3>
          <div className="flex justify-center">
            <div className="flex items-center">
            <StarRating rating={deliveryAvg} />
          <span className="ml-2 font-semibold">{deliveryAvg.toFixed(1)}</span>
            </div>
        </div>
      </div>
      </div>
      
      {isAuthenticated && !showForm && (
        <div className="mb-8">
          <Button 
            variant="outline" 
            onClick={() => setShowForm(true)}
            className="w-full md:w-auto"
          >
            Donnez votre avis
          </Button>
        </div>
      )}
      
      {isAuthenticated && showForm && (
        <div className="mb-8">
          <ReviewForm 
            productId={productId} 
            onSubmit={handleAddReview} 
          />
          <div className="mt-2 text-right">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => setShowForm(false)}
            >
              Annuler
            </Button>
          </div>
        </div>
      )}
      
      {!isAuthenticated && (
        <Alert className="mb-8">
          <AlertTitle>Connectez-vous pour laisser un avis</AlertTitle>
          <AlertDescription>
            Vous devez être connecté pour pouvoir partager votre expérience avec ce produit.
          </AlertDescription>
        </Alert>
      )}
      
      <Separator className="mb-6" />
      
      <ReviewsList reviews={reviews} />
    </div>
  );
};

export default ProductReviews;
