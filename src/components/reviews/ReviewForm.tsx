
import React, { useState } from 'react';
import StarRating from './StarRating';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/components/ui/sonner';

interface ReviewFormProps {
  productId: string;
  onSubmit: (review: {
    productId: string;
    productRating: number;
    deliveryRating: number;
    comment: string;
  }) => Promise<void>;
}

const ReviewForm: React.FC<ReviewFormProps> = ({ productId, onSubmit }) => {
  const [productRating, setProductRating] = useState(0);
  const [deliveryRating, setDeliveryRating] = useState(0);
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (productRating === 0 || deliveryRating === 0) {
      toast.error('Veuillez attribuer une note au produit et à la livraison');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      await onSubmit({
        productId,
        productRating,
        deliveryRating,
        comment: comment.trim()
      });
      
      // Réinitialiser le formulaire après soumission réussie
      setComment('');
      setProductRating(0);
      setDeliveryRating(0);
      
      toast.success('Votre commentaire a été ajouté avec succès');
    } catch (error) {
      console.error('Erreur lors de l\'ajout du commentaire:', error);
      toast.error('Une erreur est survenue lors de l\'ajout de votre commentaire');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 border p-4 rounded-lg">
      <h3 className="text-lg font-medium mb-4">Votre avis</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="block text-sm font-medium">
            Note du produit <span className="text-red-500">*</span>
          </label>
          <StarRating 
            rating={productRating} 
            onClick={setProductRating} 
            readOnly={false} 
          />
        </div>
        
        <div className="space-y-2">
          <label className="block text-sm font-medium">
            Note de la livraison <span className="text-red-500">*</span>
          </label>
          <StarRating 
            rating={deliveryRating} 
            onClick={setDeliveryRating} 
            readOnly={false} 
          />
        </div>
      </div>
      
      <div>
        <label htmlFor="comment" className="block text-sm font-medium mb-1">
          Votre commentaire (300 caractères max)
        </label>
        <Textarea
          id="comment"
          placeholder="Partagez votre expérience avec ce produit..."
          value={comment}
          onChange={(e) => setComment(e.target.value.slice(0, 300))}
          className="min-h-[100px]"
        />
        <div className="text-xs text-right mt-1 text-muted-foreground">
          {comment.length}/300
        </div>
      </div>
      
      <Button 
        type="submit" 
        className="w-full" 
        disabled={isSubmitting || productRating === 0 || deliveryRating === 0}
      >
        {isSubmitting ? 'Envoi en cours...' : 'Publier mon avis'}
      </Button>
    </form>
  );
};

export default ReviewForm;
