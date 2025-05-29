import { useState, useEffect } from 'react';
import { Order } from '@/types/order';
import { ordersAPI } from '@/services/api';
import { StoreCartItem } from '@/types/cart';
import { toast } from '@/components/ui/sonner';
import { useAuth } from '@/contexts/AuthContext';

export const useOrders = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const { isAuthenticated } = useAuth();

  const fetchOrders = async () => {
    if (!isAuthenticated) {
      setOrders([]);
      setLoading(false);
      return;
    }
    
    setLoading(true);
    try {
      const response = await ordersAPI.getUserOrders();
      if (Array.isArray(response.data)) {
        setOrders(response.data);
      } else {
        setOrders([]);
      }
    } catch (error) {
      console.error("Erreur lors du chargement des commandes:", error);
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchOrders();
    } else {
      setOrders([]);
      setLoading(false);
    }
  }, [isAuthenticated]);

  const createOrder = async (
    shippingAddress: any,
    paymentMethod: string,
    selectedCartItems: StoreCartItem[],
    codePromo?: { code: string; productId: string; pourcentage: number }
  ): Promise<Order | null> => {
    if (!isAuthenticated || selectedCartItems.length === 0) {
      toast.error('Impossible de créer la commande: utilisateur non connecté ou panier vide');
      return null;
    }

    try {
      console.log('Preparing order payload with items:', selectedCartItems.length);
      
      const orderItems = selectedCartItems.map(item => {
        const finalPrice = codePromo && codePromo.productId === item.product.id
          ? item.product.price * (1 - codePromo.pourcentage / 100)
          : item.product.price;

        return {
          productId: item.product.id,
          name: item.product.name,
          price: finalPrice,
          originalPrice: item.product.originalPrice || item.product.price,
          quantity: item.quantity,
          image: item.product.images && item.product.images.length > 0 
            ? item.product.images[0] 
            : item.product.image,
          subtotal: finalPrice * item.quantity,
          codePromoApplied: codePromo && codePromo.productId === item.product.id
        };
      });
      
      console.log('Order items mapped:', orderItems);

      const orderPayload = {
        items: orderItems,
        shippingAddress,
        paymentMethod,
        codePromo: codePromo || null
      };

      console.log('Sending order payload:', orderPayload);
      
      const response = await ordersAPI.create(orderPayload);

      if (response.data) {
        toast.success('Commande créée avec succès');
        fetchOrders();
        return response.data;
      } else {
        toast.error('Échec de la création de la commande');
        return null;
      }
    } catch (error) {
      console.error("Erreur lors de la création de la commande:", error);
      toast.error('Erreur lors de la création de la commande');
      return null;
    }
  };

  return {
    orders,
    loading,
    fetchOrders,
    createOrder
  };
};
