
export interface ShippingAddress {
  nom: string;
  prenom: string;
  adresse: string;
  ville: string;
  codePostal: string;
  pays: string;
  telephone: string;
}

export interface OrderItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
  images?: string[];
  subtotal: number;
  codePromoApplied?: boolean;
  originalPrice?: number;
}

export interface CodePromoUsed {
  code: string;
  productId: string;
  pourcentage: number;
  discountAmount: number;
}

export interface Order {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  items: OrderItem[];
  totalAmount: number;
  shippingAddress: ShippingAddress;
  paymentMethod: string;
  codePromoUsed?: CodePromoUsed | string | null;
  status: 'confirmée' | 'en préparation' | 'en livraison' | 'livrée';
  createdAt: string;
  updatedAt: string;
  
  // Propriétés financières détaillées
  subtotalProduits?: number;
  originalAmount?: number;
  discount?: number;
  subtotalApresPromo?: number;
  taxRate?: number;
  taxAmount?: number;
  deliveryPrice?: number;
}
