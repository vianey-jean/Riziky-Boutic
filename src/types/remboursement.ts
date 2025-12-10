
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
    originalAmount?: number;
    subtotalProduits?: number;
    subtotalApresPromo?: number;
    discount?: number;
    taxRate?: number;
    taxAmount?: number;
    deliveryPrice?: number;
    shippingAddress?: {
      nom: string;
      prenom: string;
      adresse: string;
      ville: string;
      codePostal: string;
      pays: string;
      telephone: string;
    };
    paymentMethod?: string;
    createdAt: string;
    items: Array<{
      productId: string;
      name: string;
      price: number;
      originalPrice?: number;
      quantity: number;
      image?: string;
      subtotal?: number;
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
