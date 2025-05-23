
import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Camera, X } from 'lucide-react';
import StarRating from './StarRating';
import { toast } from '@/components/ui/sonner';

export interface ReviewFormProps {
  productId: string;
  onSubmit: (formData: FormData) => Promise<void>;
}

const ReviewForm: React.FC<ReviewFormProps> = ({ productId, onSubmit }) => {
  const [productRating, setProductRating] = useState<number>(0);
  const [deliveryRating, setDeliveryRating] = useState<number>(0);
  const [comment, setComment] = useState<string>('');
  const [photos, setPhotos] = useState<File[]>([]);
  const [photosPreviews, setPhotosPreviews] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleAddPhoto = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = e.target.files;
    
    if (selectedFiles) {
      // Check if the total number of photos will exceed 4
      if (photos.length + selectedFiles.length > 4) {
        toast.error("Vous ne pouvez pas ajouter plus de 4 photos.");
        return;
      }
      
      const newPhotos = [...photos];
      const newPhotosPreviews = [...photosPreviews];
      
      Array.from(selectedFiles).forEach(file => {
        // Check if the file is an image
        if (!file.type.startsWith('image/')) {
          toast.error(`Le fichier ${file.name} n'est pas une image.`);
          return;
        }
        
        // Check if the file size is less than 2MB
        if (file.size > 2 * 1024 * 1024) {
          toast.error(`L'image ${file.name} est trop volumineuse. La taille maximale est de 2MB.`);
          return;
        }
        
        newPhotos.push(file);
        newPhotosPreviews.push(URL.createObjectURL(file));
      });
      
      setPhotos(newPhotos);
      setPhotosPreviews(newPhotosPreviews);
      
      // Reset the input value to allow selecting the same file again
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const removePhoto = (index: number) => {
    const newPhotos = [...photos];
    const newPhotosPreviews = [...photosPreviews];
    
    // Revoke the object URL to avoid memory leaks
    URL.revokeObjectURL(newPhotosPreviews[index]);
    
    newPhotos.splice(index, 1);
    newPhotosPreviews.splice(index, 1);
    
    setPhotos(newPhotos);
    setPhotosPreviews(newPhotosPreviews);
  };

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
      // Create FormData
      const formData = new FormData();
      formData.append('productId', productId);
      formData.append('productRating', productRating.toString());
      formData.append('deliveryRating', deliveryRating.toString());
      formData.append('comment', comment);
      
      // Add photos to FormData
      photos.forEach(photo => {
        formData.append('photos', photo);
      });
      
      await onSubmit(formData);
      
      // Reset form after successful submission
      setProductRating(0);
      setDeliveryRating(0);
      setComment('');
      
      // Revoke all object URLs
      photosPreviews.forEach(url => URL.revokeObjectURL(url));
      
      setPhotos([]);
      setPhotosPreviews([]);
      
    } catch (error) {
      console.error("Error submitting review:", error);
      toast.error("Une erreur est survenue lors de la soumission de votre avis.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmitReview} className="space-y-4">
      <div>
        <Label htmlFor="product-rating">Note du produit</Label>
        <div className="mt-1">
          <StarRating
            rating={productRating}
            value={productRating}
            onChange={setProductRating}
            id="product-rating"
            readOnly={false}
          />
        </div>
      </div>
      
      <div>
        <Label htmlFor="delivery-rating">Note de la livraison</Label>
        <div className="mt-1">
          <StarRating
            rating={deliveryRating}
            value={deliveryRating}
            onChange={setDeliveryRating}
            id="delivery-rating"
            readOnly={false}
          />
        </div>
      </div>
      
      <div>
        <Label htmlFor="comment">Commentaire</Label>
        <Textarea
          id="comment"
          placeholder="Partagez votre expérience avec ce produit..."
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          className="h-24"
        />
      </div>
      
      <div>
        <Label>Photos (optionnel)</Label>
        <div className="mt-1 flex flex-wrap gap-2">
          {photosPreviews.map((url, index) => (
            <div key={index} className="relative">
              <img 
                src={url} 
                alt={`Aperçu ${index + 1}`} 
                className="w-20 h-20 object-cover rounded-md"
              />
              <button
                type="button"
                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1"
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
              className="w-20 h-20 border-2 border-dashed border-gray-300 rounded-md flex items-center justify-center text-gray-500 hover:text-gray-700 hover:bg-gray-50"
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
        <p className="text-xs text-gray-500 mt-1">
          Vous pouvez ajouter jusqu'à 4 photos (max 2MB chacune)
        </p>
      </div>
      
      <Button 
        type="submit" 
        disabled={isSubmitting}
        className="bg-red-800 hover:bg-red-700 text-white"
      >
        {isSubmitting ? 'Envoi en cours...' : 'Soumettre l\'avis'}
      </Button>
    </form>
  );
};

export default ReviewForm;
