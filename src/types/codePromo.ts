
export interface CodePromo {
  id: string;
  code: string;
  pourcentage: number;
  quantite: number;
  productId: string;
  productName?: string;
}

export interface VerifyCodePromoResponse {
  valid: boolean;
  pourcentage?: number;
  message?: string;
}
