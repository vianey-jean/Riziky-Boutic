
import { Product } from './product';

export interface CartItem {
  productId: string;
  quantity: number;
  price: number;
}

export interface Cart {
  userId: string;
  items: CartItem[];
}

export interface StoreCartItem {
  product: Product;
  quantity: number;
}
