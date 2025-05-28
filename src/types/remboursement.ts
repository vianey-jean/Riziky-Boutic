
export interface Remboursement {
  id: string;
  orderId: string;
  userId: string;
  userName: string;
  userEmail: string;
  reason: string;
  customReason?: string;
  photo?: string;
  status: 'vérification' | 'en étude' | 'traité';
  decision?: 'accepté' | 'refusé';
  adminComments: AdminComment[];
  createdAt: string;
  updatedAt: string;
}

export interface AdminComment {
  id: string;
  adminId: string;
  adminName: string;
  comment: string;
  status: string;
  createdAt: string;
}

export interface RemboursementFormData {
  orderId: string;
  reason: string;
  customReason?: string;
  photo?: File;
}
