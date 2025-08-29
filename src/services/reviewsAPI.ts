
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
  updateReview: (reviewId: string, formData: FormData) => {
    return API.put<Review>(`/reviews/${reviewId}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
  },
  deleteReview: (reviewId: string) => API.delete(`/reviews/${reviewId}`),
  addReply: (parentId: string, formData: FormData) => {
    return API.post<Review>(`/reviews/${parentId}/reply`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
  },
  toggleLike: (reviewId: string) => API.post(`/reviews/${reviewId}/like`),
  getLikes: (reviewId: string) => API.get(`/reviews/${reviewId}/likes`)
};
