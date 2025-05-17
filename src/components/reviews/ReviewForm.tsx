
import React, { useState, useRef } from 'react';
import StarRating from './StarRating';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/components/ui/sonner';
import { ImagePlus, X, Camera } from 'lucide-react';
import { ReviewFormData } from '@/services/api';

interface ReviewFormProps {
  productId: string;
  onSubmit: (review: ReviewFormData) => Promise<void>;
}

const ReviewForm: React.FC<ReviewFormProps> = ({ productId, onSubmit }) => {
  const [productRating, setProductRating] = useState(0);
  const [deliveryRating, setDeliveryRating] = useState(0);
  const [comment, setComment] = useState('');
  const [photoFiles, setPhotoFiles] = useState<File[]>([]);
  const [photoPreviews, setPhotoPreviews] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

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
        comment: comment.trim(),
        photos: photoFiles
      });
      
      // Réinitialiser le formulaire après soumission réussie
      setComment('');
      setProductRating(0);
      setDeliveryRating(0);
      setPhotoFiles([]);
      setPhotoPreviews([]);
      
      toast.success('Votre commentaire a été ajouté avec succès');
    } catch (error) {
      console.error('Erreur lors de l\'ajout du commentaire:', error);
      toast.error('Une erreur est survenue lors de l\'ajout de votre commentaire');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    
    // Limiter à 4 photos maximum
    const remainingSlots = 4 - photoFiles.length;
    if (remainingSlots <= 0) {
      toast.error('Vous ne pouvez pas ajouter plus de 4 photos');
      return;
    }
    
    const newFiles: File[] = [];
    const newPreviews: string[] = [];
    
    // Traiter chaque fichier sélectionné
    Array.from(files).slice(0, remainingSlots).forEach(file => {
      // Vérifier le type de fichier
      if (!file.type.startsWith('image/')) {
        toast.error(`Le fichier ${file.name} n'est pas une image`);
        return;
      }
      
      // Vérifier la taille du fichier (5MB max)
      if (file.size > 5 * 1024 * 1024) {
        toast.error(`L'image ${file.name} est trop volumineuse. La taille maximale est de 5MB`);
        return;
      }
      
      // Ajouter le fichier à la liste
      newFiles.push(file);
      
      // Créer une URL pour la prévisualisation
      const previewUrl = URL.createObjectURL(file);
      newPreviews.push(previewUrl);
    });
    
    // Mettre à jour les états
    setPhotoFiles(prev => [...prev, ...newFiles]);
    setPhotoPreviews(prev => [...prev, ...newPreviews]);
    
    // Réinitialiser l'input file pour permettre de sélectionner à nouveau les mêmes fichiers si nécessaire
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };
  
  const removePhoto = (index: number) => {
    // Supprimer la prévisualisation
    URL.revokeObjectURL(photoPreviews[index]);
    
    // Mettre à jour les listes
    setPhotoFiles(prev => prev.filter((_, i) => i !== index));
    setPhotoPreviews(prev => prev.filter((_, i) => i !== index));
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
      
      <div>
        <label className="block text-sm font-medium mb-2">
          Ajouter des photos (max 4)
        </label>
        
        <div className="flex flex-wrap gap-2 mb-2">
          {photoPreviews.map((preview, index) => (
            <div key={index} className="relative">
              <img 
                src={preview} 
                alt={`Aperçu ${index + 1}`} 
                className="w-20 h-20 object-cover rounded border"
              />
              <button 
                type="button"
                onClick={() => removePhoto(index)}
                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 w-6 h-6 flex items-center justify-center"
              >
                <X size={14} />
              </button>
            </div>
          ))}
          
          {photoFiles.length < 4 && (
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="w-20 h-20 border-2 border-dashed rounded flex flex-col items-center justify-center text-muted-foreground hover:text-foreground hover:border-primary transition-colors"
            >
              <Camera size={24} />
              <span className="text-xs mt-1">Ajouter</span>
            </button>
          )}
        </div>
        
        <input 
          type="file" 
          ref={fileInputRef}
          onChange={handlePhotoUpload}
          accept="image/*"
          multiple
          className="hidden"
        />
        
        {photoFiles.length < 4 && (
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => fileInputRef.current?.click()}
            className="w-full"
          >
            <ImagePlus className="mr-1 h-4 w-4" />
            Sélectionner des photos
          </Button>
        )}
        
        <p className="text-xs text-muted-foreground mt-1">
          Formats acceptés: JPEG, PNG, GIF. Taille max: 5MB par photo.
        </p>
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
