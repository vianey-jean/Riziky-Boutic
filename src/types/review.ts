
export interface Review {
  id: string;
  userId: string;
  userName: string;
  productId: string;
  productRating: number;
  deliveryRating: number;
  comment: string;
  photos?: string[];
  createdAt: string;
  updatedAt: string;
}

export interface ReviewFormData {
  productId: string;
  productRating: number;
  deliveryRating: number;
  comment: string;
  photos?: File[];
}
