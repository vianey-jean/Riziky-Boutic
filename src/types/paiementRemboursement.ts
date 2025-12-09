
export interface PaiementRemboursement {
  id: string;
  remboursementId: string;
  orderId: string;
  userId: string;
  userName: string;
  userEmail: string;
  order: {
    id: string;
    totalAmount: number;
    originalAmount: number;
    discount: number;
    subtotalProduits?: number;
    subtotalApresPromo?: number;
    taxRate?: number;
    taxAmount?: number;
    deliveryPrice?: number;
    shippingAddress: {
      nom: string;
      prenom: string;
      adresse: string;
      ville: string;
      codePostal: string;
      pays: string;
      telephone: string;
    };
    paymentMethod: string;
    items: Array<{
      productId: string;
      name: string;
      price: number;
      originalPrice: number;
      quantity: number;
      image?: string;
      subtotal: number;
    }>;
    createdAt: string;
  };
  reason: string;
  customReason?: string;
  status: 'debut' | 'en cours' | 'payé';
  decision: 'accepté' | 'refusé';
  clientValidated: boolean;
  createdAt: string;
  updatedAt: string;
}
