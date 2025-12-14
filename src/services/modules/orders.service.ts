
import { apiClient } from '../core/apiClient';
import { Order } from '@/types/order';

export const ordersService = {
  getAll: () => apiClient.get<Order[]>('/orders'),
  getUserOrders: () => apiClient.get<Order[]>('/orders/user'),
  getById: (orderId: string) => apiClient.get<Order>(`/orders/${orderId}`),
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
      codePromo: orderData.codePromo,
      deliveryPrice: orderData.deliveryPrice || 0
    };
    
    return apiClient.post<Order>('/orders', validatedData);
  },
  updateStatus: (orderId: string, status: string) => 
    apiClient.put(`/orders/${orderId}/status`, { status }),
  cancelOrder: (orderId: string, itemsToCancel: string[]) => 
    apiClient.post(`/orders/${orderId}/cancel`, { itemsToCancel }),
};
