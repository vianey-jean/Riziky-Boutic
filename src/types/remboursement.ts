
export interface Remboursement {
  id: string;
  orderId: string;
  userId: string;
  userName: string;
  userEmail: string;
  reason: string;
  customReason?: string;
  reasonDetails?: string;
  photo?: string;
  photos?: string[];
  status: 'vérification' | 'en étude' | 'traité';
  decision?: 'accepté' | 'refusé';
  adminComments: AdminComment[];
  comments?: AdminComment[];
  order?: {
    id: string;
    totalAmount: number;
    createdAt: string;
    items: Array<{
      productId: string;
      name: string;
      price: number;
      quantity: number;
      image?: string;
    }>;
  };
  createdAt: string;
  updatedAt: string;
}

export interface AdminComment {
  id: string;
  adminId: string;
  adminName: string;
  comment: string;
  content?: string;
  status: string;
  createdAt: string;
}

export interface RemboursementFormData {
  orderId: string;
  reason: string;
  customReason?: string;
  reasonDetails?: string;
  photo?: File;
  photos?: File[];
}
