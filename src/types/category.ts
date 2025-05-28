
export interface Category {
  id: string;
  name: string;
  description: string;
  order: number;
  isActive: boolean;
  createdAt: string;
  updatedAt?: string;
}

export interface CategoryFormData {
  name: string;
  description: string;
  order: number;
  isActive: boolean;
}
