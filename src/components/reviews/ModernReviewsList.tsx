import React, { useState, useCallback } from 'react';
import { Review } from '@/types/review';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Star, MessageCircle, Edit2, Trash2, Calendar, Image, Heart, Sparkles } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';
import { useAuth } from '@/contexts/AuthContext';
import { reviewsAPI } from '@/services/reviewsAPI';
import { toast } from '@/components/ui/sonner';
import ModernReviewForm from './ModernReviewForm';
import { motion, AnimatePresence } from 'framer-motion';

interface ModernReviewsListProps {
  reviews: Review[];
  onReviewUpdate: () => void;
}

const ModernReviewsList: React.FC<ModernReviewsListProps> = ({ reviews, onReviewUpdate }) => {
  const { user } = useAuth();
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [editingReview, setEditingReview] = useState<string | null>(null);
  const [deletingReview, setDeletingReview] = useState<string | null>(null);
  const [expandedPhotos, setExpandedPhotos] = useState<{ [key: string]: boolean }>({});
  
  const AUTH_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  const handleReply = useCallback(async (formData: FormData) => {
    if (!replyingTo) return;
    
    try {
      await reviewsAPI.addReply(replyingTo, formData);
      toast.success('Votre réponse a été ajoutée avec succès !');
      setReplyingTo(null);
      onReviewUpdate();
    } catch (error) {
      console.error('Error adding reply:', error);
      toast.error('Erreur lors de l\'ajout de la réponse');
    }
  }, [replyingTo, onReviewUpdate]);

  const handleEdit = useCallback(async (formData: FormData) => {
    if (!editingReview) return;
    
    try {
      await reviewsAPI.updateReview(editingReview, formData);
      toast.success('Votre commentaire a été modifié avec succès !');
      setEditingReview(null);
      onReviewUpdate();
    } catch (error) {
      console.error('Error updating review:', error);
      toast.error('Erreur lors de la modification du commentaire');
    }
  }, [editingReview, onReviewUpdate]);

  const handleDelete = useCallback(async (reviewId: string) => {
    try {
      await reviewsAPI.deleteReview(reviewId);
      toast.success('Commentaire supprimé avec succès !');
      onReviewUpdate();
    } catch (error) {
      console.error('Error deleting review:', error);
      toast.error('Erreur lors de la suppression du commentaire');
    }
  }, [onReviewUpdate]);

  const handleToggleLike = useCallback(async (reviewId: string) => {
    if (!user) {
      toast.error('Vous devez être connecté pour aimer un commentaire');
      return;
    }
    
    try {
      await reviewsAPI.toggleLike(reviewId);
      onReviewUpdate();
    } catch (error) {
      console.error('Error toggling like:', error);
      toast.error('Erreur lors de l\'ajout du j\'aime');
    }
  }, [user, onReviewUpdate]);

  const togglePhotos = useCallback((reviewId: string) => {
    setExpandedPhotos(prev => ({
      ...prev,
      [reviewId]: !prev[reviewId]
    }));
  }, []);

  const renderStars = (rating: number) => (
    <div className="flex space-x-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={`h-4 w-4 transition-all duration-200 ${
            star <= rating ? 'fill-yellow-400 text-yellow-400 drop-shadow-sm' : 'text-gray-300'
          }`}
        />
      ))}
    </div>
  );

  const renderPhotos = (photos: string[], reviewId: string) => {
    if (!photos || photos.length === 0) return null;
    
    const isExpanded = expandedPhotos[reviewId];
    const photosToShow = isExpanded ? photos : photos.slice(0, 2);
    
    return (
      <motion.div 
        className="mt-6"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          <AnimatePresence>
            {photosToShow.map((photo, index) => (
              <motion.div 
                key={index} 
                className="relative group"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3 }}
              >
                <div className="overflow-hidden rounded-xl shadow-lg hover:shadow-xl transition-all duration-300">
                  <img
                    src={`${AUTH_BASE_URL}${photo}`}
                    alt={`Photo ${index + 1}`}
                    className="w-full h-28 object-cover cursor-pointer hover:scale-110 transition-transform duration-300"
                    onClick={() => window.open(`${AUTH_BASE_URL}${photo}`, '_blank')}
                  />
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
        
        {photos.length > 2 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => togglePhotos(reviewId)}
            className="mt-3 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 font-medium"
          >
            <Image className="h-4 w-4 mr-2" />
            {isExpanded ? 'Voir moins' : `Voir ${photos.length - 2} photo${photos.length - 2 > 1 ? 's' : ''} de plus`}
          </Button>
        )}
      </motion.div>
    );
  };

  const getEditInitialData = (review: Review) => ({
    productRating: review.productRating,
    deliveryRating: review.deliveryRating,
    comment: review.comment,
    photos: review.photos
  });

  const renderReview = (review: Review, isReply = false) => {
    const isOwnReview = user && user.id === review.userId;
    const canEdit = isOwnReview;
    const canDelete = isOwnReview;
    const hasLiked = user && review.likes?.includes(user.id);
    const likesCount = review.likesCount || review.likes?.length || 0;
    const repliesCount = review.replies?.length || 0;
    
    return (
      <motion.div
        key={review.id}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card className={`${
          isReply 
            ? 'ml-8 mt-4 bg-gradient-to-br from-gray-50 to-white dark:from-gray-800 dark:to-gray-900' 
            : 'bg-gradient-to-br from-white to-gray-50/50 dark:from-gray-900 dark:to-gray-800'
        } border border-gray-200 dark:border-gray-700 shadow-lg hover:shadow-xl transition-all duration-300 backdrop-blur-sm`}>
          <CardContent className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-4">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.2 }}
                >
                  <Avatar className="h-12 w-12 shadow-lg border-2 border-white dark:border-gray-700">
                    <AvatarFallback className="bg-gradient-to-br from-red-100 to-red-200 text-red-700 font-bold text-lg">
                      {review.userName.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                </motion.div>
                <div>
                  <h4 className="font-bold text-gray-900 dark:text-gray-100 text-lg">{review.userName}</h4>
                  <div className="flex items-center space-x-2 text-sm text-gray-500">
                    <Calendar className="h-3 w-3" />
                    <span>{formatDistanceToNow(new Date(review.createdAt), { addSuffix: true, locale: fr })}</span>
                  </div>
                </div>
              </div>
              
              {(canEdit || canDelete) && (
                <div className="flex space-x-2">
                  {canEdit && (
                    <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setEditingReview(review.id)}
                        className="h-9 w-9 p-0 text-green-600 hover:text-green-700 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-xl"
                      >
                        <Edit2 className="h-4 w-4" />
                      </Button>
                    </motion.div>
                  )}
                  {canDelete && (
                    <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setDeletingReview(review.id)}
                        className="h-9 w-9 p-0 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </motion.div>
                  )}
                </div>
              )}
            </div>

            <div className="grid grid-cols-2 gap-6 mb-4 p-4 bg-gradient-to-r from-gray-50 to-white dark:from-gray-800 dark:to-gray-700 rounded-xl shadow-inner">
              <div>
                <p className="text-xs text-gray-500 mb-2 font-medium flex items-center">
                  <Sparkles className="h-3 w-3 mr-1" />
                  Produit
                </p>
                {renderStars(review.productRating)}
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-2 font-medium flex items-center">
                  <Sparkles className="h-3 w-3 mr-1" />
                  Livraison
                </p>
                {renderStars(review.deliveryRating)}
              </div>
            </div>

            {review.comment && (
              <motion.p 
                className="text-gray-700 dark:text-gray-300 mb-4 leading-relaxed text-base"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                {review.comment}
              </motion.p>
            )}

            {renderPhotos(review.photos || [], review.id)}

            <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-100 dark:border-gray-700">
              <div className="flex items-center space-x-6">
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleToggleLike(review.id)}
                    className={`text-gray-500 hover:text-red-600 transition-all duration-200 ${hasLiked ? 'text-red-600' : ''} rounded-xl`}
                  >
                    <Heart className={`h-4 w-4 mr-2 transition-all duration-200 ${hasLiked ? 'fill-red-600' : ''}`} />
                    <span className="text-red-600 font-bold">{likesCount}</span>
                  </Button>
                </motion.div>
                
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      if (!user) {
                        toast.error('Vous ne pouvez pas ajouter une commentaire si vous n\'êtes pas connecté');
                        return;
                      }
                      setReplyingTo(review.id);
                    }}
                    className="text-gray-500 hover:text-red-600 transition-all duration-200 rounded-xl"
                  >
                    <MessageCircle className="h-4 w-4 mr-2" />
                    Répondre
                  </Button>
                </motion.div>
              </div>
              
              {repliesCount > 0 && (
                <Badge variant="secondary" className="text-xs bg-gradient-to-r from-red-100 to-red-50 dark:from-red-900/30 dark:to-red-800/30 text-red-700 dark:text-red-300 border border-red-200 dark:border-red-800">
                  {repliesCount} Réponse{repliesCount > 1 ? "s" : ""}
                </Badge>
              )}
            </div>

            <AnimatePresence>
              {replyingTo === review.id && (
                <motion.div 
                  className="mt-6 pt-6 border-t border-gray-100 dark:border-gray-700"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <ModernReviewForm
                    productId={review.productId}
                    parentId={review.id}
                    isReply={true}
                    onSubmit={handleReply}
                    onCancel={() => setReplyingTo(null)}
                  />
                </motion.div>
              )}

              {editingReview === review.id && (
                <motion.div 
                  className="mt-6 pt-6 border-t border-gray-100 dark:border-gray-700"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <ModernReviewForm
                    productId={review.productId}
                    onSubmit={handleEdit}
                    onCancel={() => setEditingReview(null)}
                    initialData={getEditInitialData(review)}
                    isEdit={true}
                  />
                </motion.div>
              )}
            </AnimatePresence>

            {review.replies && review.replies.length > 0 && (
              <motion.div 
                className="mt-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                {review.replies.map(reply => renderReview(reply, true))}
              </motion.div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    );
  };

  if (reviews.length === 0) {
    return (
      <motion.div 
        className="text-center py-16"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="mx-auto w-32 h-32 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 rounded-full flex items-center justify-center mb-6 shadow-xl">
          <MessageCircle className="h-16 w-16 text-gray-400" />
        </div>
        <h3 className="text-2xl font-bold text-gray-600 dark:text-gray-400 mb-2">Aucun commentaire</h3>
        <p className="text-gray-500 text-lg">Soyez le premier à laisser un avis sur ce produit !</p>
      </motion.div>
    );
  };

  return (
    <div className="space-y-6">
      <AnimatePresence>
        {reviews.filter(review => !review.parentId).map((review, index) => (
          <motion.div
            key={review.id}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            {renderReview(review)}
          </motion.div>
        ))}
      </AnimatePresence>
      
      <AlertDialog open={!!deletingReview} onOpenChange={() => setDeletingReview(null)}>
        <AlertDialogContent className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-800 border border-gray-200 dark:border-gray-700 shadow-2xl">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-xl font-bold">Supprimer le commentaire</AlertDialogTitle>
            <AlertDialogDescription className="text-gray-600 dark:text-gray-400">
              Êtes-vous sûr de vouloir supprimer ce commentaire ? Cette action est irréversible.
              Toutes les réponses à ce commentaire seront également supprimées.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="rounded-xl">Annuler</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (deletingReview) {
                  handleDelete(deletingReview);
                  setDeletingReview(null);
                }
              }}
              className="bg-gradient-to-r from-red-600 to-red-500 hover:from-red-700 hover:to-red-600 rounded-xl"
            >
              Supprimer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default ModernReviewsList;
