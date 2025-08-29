
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
  parentId?: string; // For replies to other reviews
  replies?: Review[]; // Nested replies
  likes?: string[]; // Array of user IDs who liked this review
  likesCount?: number; // Count of likes
}

export interface ReviewFormData {
  productId: string;
  productRating: number;
  deliveryRating: number;
  comment: string;
  photos?: File[];
  parentId?: string; // For reply functionality
}
