import React, { useState, useCallback } from 'react';
import { Review } from '@/types/review';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Star, MessageCircle, Edit2, Trash2, Calendar, Image, Heart } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';
import { useAuth } from '@/contexts/AuthContext';
import { reviewsAPI } from '@/services/reviewsAPI';
import { toast } from '@/components/ui/sonner';
import ModernReviewForm from './ModernReviewForm';

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
          className={`h-4 w-4 ${
            star <= rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
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
      <div className="mt-4">
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {photosToShow.map((photo, index) => (
            <div key={index} className="relative group">
              <img
                src={`${AUTH_BASE_URL}${photo}`}
                alt={`Photo ${index + 1}`}
                className="w-full h-24 object-cover rounded-lg border border-gray-200 dark:border-gray-700 cursor-pointer hover:opacity-90 transition-opacity"
                onClick={() => window.open(`${AUTH_BASE_URL}${photo}`, '_blank')}
              />
            </div>
          ))}
        </div>
        
        {photos.length > 2 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => togglePhotos(reviewId)}
            className="mt-2 text-red-600 hover:text-red-700"
          >
            <Image className="h-4 w-4 mr-1" />
            {isExpanded ? 'Voir moins' : `Voir ${photos.length - 2} photo${photos.length - 2 > 1 ? 's' : ''} de plus`}
          </Button>
        )}
      </div>
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
      <Card key={review.id} className={`${isReply ? 'ml-8 mt-3 bg-gray-50 dark:bg-gray-800' : 'bg-white dark:bg-gray-900'} border border-gray-200 dark:border-gray-700`}>
        <CardContent className="p-4">
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center space-x-3">
              <Avatar className="h-10 w-10">
                <AvatarFallback className="bg-red-100 text-red-600 font-semibold">
                  {review.userName.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div>
                <h4 className="font-semibold text-gray-900 dark:text-gray-100">{review.userName}</h4>
                <div className="flex items-center space-x-2 text-sm text-gray-500">
                  <Calendar className="h-3 w-3" />
                  <span>{formatDistanceToNow(new Date(review.createdAt), { addSuffix: true, locale: fr })}</span>
                </div>
              </div>
            </div>
            
            {(canEdit || canDelete) && (
              <div className="flex space-x-1">
                {canEdit && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setEditingReview(review.id)}
                    className="h-8 w-8 p-0 text-green-600 hover:text-green-700 hover:bg-green-50"
                  >
                    <Edit2 className="h-4 w-4" />
                  </Button>
                )}
                {canDelete && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setDeletingReview(review.id)}
                    className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4 mb-3">
            <div>
              <p className="text-xs text-gray-500 mb-1">Produit</p>
              {renderStars(review.productRating)}
            </div>
            <div>
              <p className="text-xs text-gray-500 mb-1">Livraison</p>
              {renderStars(review.deliveryRating)}
            </div>
          </div>

          {review.comment && (
            <p className="text-gray-700 dark:text-gray-300 mb-3 leading-relaxed">
              {review.comment}
            </p>
          )}

          {renderPhotos(review.photos || [], review.id)}

          <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-100 dark:border-gray-700">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleToggleLike(review.id)}
                className={`text-gray-500 hover:text-red-600 ${hasLiked ? 'text-red-600' : ''}`}
              >
                <Heart className={`h-4 w-4 mr-1 ${hasLiked ? 'fill-red-600' : ''}`} />
                <span className="text-red-600 font-medium">{likesCount}</span>
              </Button>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setReplyingTo(review.id)}
                className="text-gray-500 hover:text-red-600"
              >
                <MessageCircle className="h-4 w-4 mr-1" />
                Répondre
              </Button>
            </div>
            
              {repliesCount > 0 && (
                <Badge variant="secondary" className="text-xs">
                  <span className="text-red-600 font-bold">{repliesCount}&nbsp;
                 Réponse{repliesCount > 1 ? "s" : ""}</span>
              </Badge>
           )}

          </div>

          {replyingTo === review.id && (
            <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700">
              <ModernReviewForm
                productId={review.productId}
                parentId={review.id}
                isReply={true}
                onSubmit={handleReply}
                onCancel={() => setReplyingTo(null)}
              />
            </div>
          )}

          {editingReview === review.id && (
            <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700">
              <ModernReviewForm
                productId={review.productId}
                onSubmit={handleEdit}
                onCancel={() => setEditingReview(null)}
                initialData={getEditInitialData(review)}
                isEdit={true}
              />
            </div>
          )}

          {review.replies && review.replies.length > 0 && (
            <div className="mt-4">
              {review.replies.map(reply => renderReview(reply, true))}
            </div>
          )}
        </CardContent>
      </Card>
    );
  };

  if (reviews.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="mx-auto w-24 h-24 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-4">
          <MessageCircle className="h-12 w-12 text-gray-400" />
        </div>
        <p className="text-gray-500 text-lg">Aucun commentaire pour ce produit.</p>
        <p className="text-gray-400 text-sm mt-1">Soyez le premier à laisser un avis !</p>
      </div>
    );
  };

  return (
    <div className="space-y-4">
      {reviews.filter(review => !review.parentId).map(review => renderReview(review))}
      
      <AlertDialog open={!!deletingReview} onOpenChange={() => setDeletingReview(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Supprimer le commentaire</AlertDialogTitle>
            <AlertDialogDescription>
              Êtes-vous sûr de vouloir supprimer ce commentaire ? Cette action est irréversible.
              Toutes les réponses à ce commentaire seront également supprimées.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (deletingReview) {
                  handleDelete(deletingReview);
                  setDeletingReview(null);
                }
              }}
              className="bg-red-600 hover:bg-red-700"
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
