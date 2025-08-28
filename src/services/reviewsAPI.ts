
import { API } from './apiConfig';
import { Review } from '@/types/review';

export const reviewsAPI = {
  getProductReviews: (productId: string) => API.get<Review[]>(`/reviews/product/${productId}`),
  getReviewDetail: (reviewId: string) => API.get<Review>(`/reviews/${reviewId}`),
  addReview: (formData: FormData) => {
    return API.post<Review>('/reviews', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
  },
  deleteReview: (reviewId: string) => API.delete(`/reviews/${reviewId}`),
};
