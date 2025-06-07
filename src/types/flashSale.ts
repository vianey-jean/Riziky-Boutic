
export interface FlashSale {
  id: string;
  title: string;
  description: string;
  discount: number;
  startDate: string;
  endDate: string;
  isActive: boolean;
  productIds: string[];
  createdAt: string;
}

export interface FlashSaleFormData {
  title: string;
  description: string;
  discount: number;
  startDate: string;
  endDate: string;
  productIds: string[];
}
