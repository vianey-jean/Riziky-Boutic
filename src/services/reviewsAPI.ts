
import { API } from './apiConfig';
import { Review, ReviewFormData } from '@/types/review';

export const reviewsAPI = {
  getProductReviews: (productId: string) => API.get<Review[]>(`/reviews/product/${productId}`),
  getReviewDetail: (reviewId: string) => API.get<Review>(`/reviews/${reviewId}`),
  addReview: (reviewData: ReviewFormData) => {
    const formData = new FormData();
    formData.append('productId', reviewData.productId);
    formData.append('productRating', reviewData.productRating.toString());
    formData.append('deliveryRating', reviewData.deliveryRating.toString());
    
    if (reviewData.comment) {
      formData.append('comment', reviewData.comment);
    }
    
    if (reviewData.photos && reviewData.photos.length > 0) {
      reviewData.photos.forEach(photo => {
        formData.append('photos', photo);
      });
    }
    
    return API.post<Review>('/reviews', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
  },
  deleteReview: (reviewId: string) => API.delete(`/reviews/${reviewId}`),
};
