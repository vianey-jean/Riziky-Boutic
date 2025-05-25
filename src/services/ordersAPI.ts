
import { API } from './apiConfig';
import { Order } from '@/types/order';

export const ordersAPI = {
  getAll: () => API.get<Order[]>('/orders'),
  getUserOrders: () => API.get<Order[]>('/orders/user'),
  getById: (orderId: string) => API.get<Order>(`/orders/${orderId}`),
  create: (orderData: any) => {
    console.log('Sending order data to server:', JSON.stringify(orderData));
    
    const validatedData = {
      items: Array.isArray(orderData.items) 
        ? orderData.items.map((item: any) => ({
            productId: item.productId,
            quantity: Number(item.quantity),
            ...(item.price !== undefined && { price: Number(item.price) }),
          })) 
        : [],
      shippingAddress: orderData.shippingAddress,
      paymentMethod: orderData.paymentMethod,
      codePromo: orderData.codePromo
    };
    
    return API.post<Order>('/orders', validatedData);
  },
  updateStatus: (orderId: string, status: string) => 
    API.put(`/orders/${orderId}/status`, { status }),
  cancelOrder: (orderId: string, itemsToCancel: string[]) => 
    API.post(`/orders/${orderId}/cancel`, { itemsToCancel }),
};
