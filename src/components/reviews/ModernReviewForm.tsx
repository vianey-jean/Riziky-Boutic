
import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Camera, X, Star } from 'lucide-react';
import { toast } from '@/components/ui/sonner';
import { Card, CardContent } from '@/components/ui/card';

export interface ModernReviewFormProps {
  productId: string;
  parentId?: string;
  isReply?: boolean;
  onSubmit: (formData: FormData) => Promise<void>;
  onCancel?: () => void;
  initialData?: {
    productRating: number;
    deliveryRating: number;
    comment: string;
    photos?: string[];
  };
  isEdit?: boolean;
}

const ModernReviewForm: React.FC<ModernReviewFormProps> = ({ 
  productId, 
  parentId,
  isReply = false,
  onSubmit, 
  onCancel,
  initialData,
  isEdit = false
}) => {
  const [productRating, setProductRating] = useState<number>(initialData?.productRating || 0);
  const [deliveryRating, setDeliveryRating] = useState<number>(initialData?.deliveryRating || 0);
  const [comment, setComment] = useState<string>(initialData?.comment || '');
  const [photos, setPhotos] = useState<File[]>([]);
  const [photosPreviews, setPhotosPreviews] = useState<string[]>(initialData?.photos || []);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleAddPhoto = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = e.target.files;
    
    if (selectedFiles) {
      if (photos.length + selectedFiles.length > 4) {
        toast.error("Vous ne pouvez pas ajouter plus de 4 photos.");
        return;
      }
      
      const newPhotos = [...photos];
      const newPhotosPreviews = [...photosPreviews];
      
      Array.from(selectedFiles).forEach(file => {
        if (!file.type.startsWith('image/')) {
          toast.error(`Le fichier ${file.name} n'est pas une image.`);
          return;
        }
        
        if (file.size > 2 * 1024 * 1024) {
          toast.error(`L'image ${file.name} est trop volumineuse. La taille maximale est de 2MB.`);
          return;
        }
        
        newPhotos.push(file);
        newPhotosPreviews.push(URL.createObjectURL(file));
      });
      
      setPhotos(newPhotos);
      setPhotosPreviews(newPhotosPreviews);
      
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const removePhoto = (index: number) => {
    const newPhotos = [...photos];
    const newPhotosPreviews = [...photosPreviews];
    
    if (newPhotosPreviews[index].startsWith('blob:')) {
      URL.revokeObjectURL(newPhotosPreviews[index]);
    }
    
    newPhotos.splice(index, 1);
    newPhotosPreviews.splice(index, 1);
    
    setPhotos(newPhotos);
    setPhotosPreviews(newPhotosPreviews);
  };

  const renderStarRating = (rating: number, onChange: (rating: number) => void, label: string) => (
    <div>
      <Label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">{label}</Label>
      <div className="flex space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => onChange(star)}
            className="transition-colors duration-150 hover:scale-110"
          >
            <Star
              className={`h-6 w-6 ${
                star <= rating 
                  ? 'fill-yellow-400 text-yellow-400' 
                  : 'text-gray-300 hover:text-yellow-300'
              }`}
            />
          </button>
        ))}
      </div>
    </div>
  );

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (productRating === 0) {
      toast.error("Veuillez noter le produit.");
      return;
    }
    
    if (deliveryRating === 0) {
      toast.error("Veuillez noter la livraison.");
      return;
    }
    
    if (!comment.trim()) {
      toast.error("Veuillez ajouter un commentaire.");
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const formData = new FormData();
      formData.append('productId', productId);
      if (parentId) {
        formData.append('parentId', parentId);
      }
      formData.append('productRating', productRating.toString());
      formData.append('deliveryRating', deliveryRating.toString());
      formData.append('comment', comment);
      
      photos.forEach(photo => {
        formData.append('photos', photo);
      });
      
      await onSubmit(formData);
      
      // Reset form after successful submission
      if (!isEdit) {
        setProductRating(0);
        setDeliveryRating(0);
        setComment('');
        
        photosPreviews.forEach(url => {
          if (url.startsWith('blob:')) {
            URL.revokeObjectURL(url);
          }
        });
        
        setPhotos([]);
        setPhotosPreviews([]);
      }
      
    } catch (error) {
      console.error("Error submitting review:", error);
      toast.error("Une erreur est survenue lors de la soumission de votre avis.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="border-0 shadow-xl bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-800">
      <CardContent className="p-6">
        <form onSubmit={handleSubmitReview} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {renderStarRating(productRating, setProductRating, "Note du produit")}
            {renderStarRating(deliveryRating, setDeliveryRating, "Note de la livraison")}
          </div>
          
          <div>
            <Label htmlFor="comment" className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
              {isReply ? "Votre réponse" : "Votre commentaire"}
            </Label>
            <Textarea
              id="comment"
              placeholder={isReply ? "Écrivez votre réponse..." : "Partagez votre expérience avec ce produit..."}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="min-h-[120px] border-gray-200 dark:border-gray-700 focus:border-red-500 focus:ring-red-500 bg-white dark:bg-gray-800 resize-none"
            />
          </div>
          
          <div>
            <Label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3 block">
              Photos (optionnel)
            </Label>
            <div className="flex flex-wrap gap-3">
              {photosPreviews.map((url, index) => (
                <div key={index} className="relative group">
                  <img 
                    src={url} 
                    alt={`Aperçu ${index + 1}`} 
                    className="w-20 h-20 object-cover rounded-lg border-2 border-gray-200 dark:border-gray-700"
                  />
                  <button
                    type="button"
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-red-600"
                    onClick={() => removePhoto(index)}
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              ))}
              
              {photos.length < 4 && (
                <button
                  type="button"
                  onClick={handleAddPhoto}
                  className="w-20 h-20 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg flex items-center justify-center text-gray-500 hover:text-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors duration-200"
                >
                  <Camera className="h-6 w-6" />
                </button>
              )}
              
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept="image/*"
                multiple
                className="hidden"
              />
            </div>
            <p className="text-xs text-gray-500 mt-2">
              Vous pouvez ajouter jusqu'à 4 photos (max 2MB chacune)
            </p>
          </div>
          
          <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200 dark:border-gray-700">
            {onCancel && (
              <Button 
                type="button"
                variant="outline" 
                onClick={onCancel}
                className="px-6"
              >
                Annuler
              </Button>
            )}
            <Button 
              type="submit" 
              disabled={isSubmitting}
              className="bg-red-600 hover:bg-red-700 text-white px-6"
            >
              {isSubmitting ? 'Envoi en cours...' : (isEdit ? 'Modifier' : (isReply ? 'Répondre' : 'Publier'))}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default ModernReviewForm;
