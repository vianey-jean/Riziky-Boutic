
import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Camera, X, Star, Upload, Sparkles } from 'lucide-react';
import { toast } from '@/components/ui/sonner';
import { Card, CardContent } from '@/components/ui/card';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';

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
  const [photosPreviews, setPhotosPreviews] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const { isAuthenticated, setRedirectAfterLogin } = useAuth();

  // Pour l'édition, on supprime les anciennes photos et on commence avec un tableau vide
  React.useEffect(() => {
    if (isEdit) {
      setPhotosPreviews([]);
      setPhotos([]);
    }
  }, [isEdit]);

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
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Label className="text-sm font-semibold text-gray-800 dark:text-gray-200 mb-3 block flex items-center">
        <Sparkles className="h-4 w-4 mr-2 text-yellow-500" />
        {label}
      </Label>
      <div className="flex space-x-2">
        {[1, 2, 3, 4, 5].map((star) => (
          <motion.button
            key={star}
            type="button"
            onClick={() => onChange(star)}
            className="transition-all duration-200 p-1 rounded-full hover:bg-yellow-100 dark:hover:bg-yellow-900/20"
            whileHover={{ scale: 1.2 }}
            whileTap={{ scale: 0.9 }}
          >
            <Star
              className={`h-8 w-8 transition-all duration-200 ${
                star <= rating 
                  ? 'fill-yellow-400 text-yellow-400 drop-shadow-lg' 
                  : 'text-gray-300 hover:text-yellow-300'
              }`}
            />
          </motion.button>
        ))}
      </div>
    </motion.div>
  );

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isAuthenticated) {
      setRedirectAfterLogin(window.location.pathname);
      toast.error("Il faut être connecté pour poster une réponse", {
        style: { backgroundColor: '#EF4444', color: 'white', fontWeight: 'bold' },
        duration: 4000,
        position: 'top-center',
      });
      window.location.href = '/login';
      return;
    }
    
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
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <Card className="border-0 shadow-2xl bg-gradient-to-br from-white via-neutral-50 to-white dark:from-neutral-900 dark:via-neutral-800 dark:to-neutral-900 backdrop-blur-sm">
        <CardContent className="p-8">
          <div className="mb-6">
            <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 font-playfair flex items-center">
              <Sparkles className="h-6 w-6 mr-3 text-yellow-500" />
              {isReply ? "Votre réponse" : isEdit ? "Modifier votre avis" : "Partagez votre avis"}
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              {isReply ? "Répondez à ce commentaire" : "Votre opinion compte pour nous et les autres clients"}
            </p>
          </div>

          <form onSubmit={handleSubmitReview} className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {renderStarRating(productRating, setProductRating, "Note du produit")}
              {renderStarRating(deliveryRating, setDeliveryRating, "Note de la livraison")}
            </div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Label htmlFor="comment" className="text-sm font-semibold text-gray-800 dark:text-gray-200 mb-3 block">
                {isReply ? "Votre réponse" : "Votre commentaire"}
              </Label>
              <Textarea
                id="comment"
                placeholder={isReply ? "Écrivez votre réponse..." : "Partagez votre expérience avec ce produit..."}
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                className="min-h-[140px] border-2 border-gray-200 dark:border-gray-700 focus:border-red-500 focus:ring-red-500 bg-white dark:bg-gray-800 resize-none text-base rounded-xl shadow-lg transition-all duration-300"
              />
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <Label className="text-sm font-semibold text-gray-800 dark:text-gray-200 mb-4 block flex items-center">
                <Camera className="h-4 w-4 mr-2 text-red-500" />
                Photos {isEdit && "(Les anciennes photos seront remplacées)"}
              </Label>
              <div className="flex flex-wrap gap-4">
                <AnimatePresence>
                  {photosPreviews.map((url, index) => (
                    <motion.div 
                      key={index} 
                      className="relative group"
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      transition={{ duration: 0.3 }}
                    >
                      <div className="w-24 h-24 rounded-xl overflow-hidden shadow-lg border-2 border-gray-200 dark:border-gray-700">
                        <img 
                          src={url} 
                          alt={`Aperçu ${index + 1}`} 
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <motion.button
                        type="button"
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-all duration-200 hover:bg-red-600 shadow-lg"
                        onClick={() => removePhoto(index)}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        <X className="h-3 w-3" />
                      </motion.button>
                    </motion.div>
                  ))}
                </AnimatePresence>
                
                {photos.length < 4 && (
                  <motion.button
                    type="button"
                    onClick={handleAddPhoto}
                    className="w-24 h-24 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl flex flex-col items-center justify-center text-gray-500 hover:text-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all duration-200 shadow-lg hover:shadow-xl"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Upload className="h-6 w-6 mb-1" />
                    <span className="text-xs">Ajouter</span>
                  </motion.button>
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
              <p className="text-xs text-gray-500 mt-3">
                Vous pouvez ajouter jusqu'à 4 photos (max 2MB chacune)
                {isEdit && " - Les anciennes photos seront supprimées"}
              </p>
            </motion.div>
            
            <motion.div 
              className="flex justify-end space-x-4 pt-6 border-t border-gray-200 dark:border-gray-700"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              {onCancel && (
                <Button 
                  type="button"
                  variant="outline" 
                  onClick={onCancel}
                  className="px-8 py-3 border-2 border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-xl font-semibold transition-all duration-300"
                >
                  Annuler
                </Button>
              )}
              <Button 
                type="submit" 
                disabled={isSubmitting}
                className="bg-gradient-to-r from-red-600 to-red-500 hover:from-red-700 hover:to-red-600 text-white px-8 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
              >
                {isSubmitting ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
                    Envoi en cours...
                  </div>
                ) : (
                  isEdit ? 'Modifier l\'avis' : (isReply ? 'Publier la réponse' : 'Publier l\'avis')
                )}
              </Button>
            </motion.div>
          </form>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default ModernReviewForm;
