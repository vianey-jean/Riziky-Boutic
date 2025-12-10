/**
 * @file RefundOrderDetails.tsx
 * @description Composant pour afficher les détails complets d'une commande
 * associée à un remboursement, incluant les produits, l'adresse et les totaux.
 * 
 * @component
 * @example
 * <RefundOrderDetails order={paiement.order} />
 */

import React from 'react';
import { Package, MapPin, Phone, BadgePercent, Truck, Receipt } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

/**
 * Structure d'un article de commande
 * @interface OrderItem
 */
interface OrderItem {
  productId: string;
  name: string;
  price: number;
  originalPrice: number;
  quantity: number;
  image?: string;
  subtotal: number;
}

/**
 * Structure de l'adresse de livraison
 * @interface ShippingAddress
 */
interface ShippingAddress {
  nom: string;
  prenom: string;
  adresse: string;
  ville: string;
  codePostal: string;
  pays: string;
  telephone: string;
}

/**
 * Structure des données de commande
 * @interface OrderData
 */
interface OrderData {
  id: string;
  totalAmount: number;
  originalAmount: number;
  discount: number;
  subtotalProduits?: number;
  subtotalApresPromo?: number;
  taxRate?: number;
  taxAmount?: number;
  deliveryPrice?: number;
  shippingAddress: ShippingAddress;
  paymentMethod: string;
  items: OrderItem[];
  createdAt: string;
}

/**
 * Props pour le composant RefundOrderDetails
 * @interface RefundOrderDetailsProps
 */
interface RefundOrderDetailsProps {
  /** Données de la commande à afficher */
  order: OrderData;
}

/**
 * Formate un montant en devise EUR
 * @param {number} amount - Montant à formater
 * @returns {string} Montant formaté (ex: "50,00 €")
 */
const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR'
  }).format(amount || 0);
};

/**
 * Affiche tous les détails d'une commande liée à un remboursement:
 * - Liste des produits avec images, quantités et sous-totaux
 * - Adresse de livraison complète
 * - Récapitulatif financier (sous-total, TVA, livraison, réduction, total)
 * 
 * @param {RefundOrderDetailsProps} props - Les props du composant
 * @returns {JSX.Element} Section détaillée de la commande
 */
const RefundOrderDetails: React.FC<RefundOrderDetailsProps> = ({ order }) => {
  // Calcul du sous-total des produits
  const subtotalProduits = order.subtotalProduits || 
    order.items.reduce((sum, item) => sum + item.subtotal, 0);

  return (
    <div className="space-y-6">
      {/* Section: Liste des produits commandés */}
      <div>
        <h3 className="font-semibold mb-4 flex items-center gap-2">
          <Package className="h-5 w-5 text-purple-500" />
          Produits commandés
        </h3>
        <div className="space-y-3">
          {order.items.map((item, index) => (
            <div 
              key={index} 
              className="flex items-center gap-4 p-4 bg-gradient-to-r from-slate-50 to-white dark:from-slate-800/50 dark:to-slate-900/50 rounded-xl border border-slate-100 dark:border-slate-800 hover:shadow-md transition-shadow"
            >
              {/* Image du produit */}
              {item.image && (
                <img 
                  src={`${import.meta.env.VITE_API_BASE_URL}${item.image}`}
                  alt={item.name}
                  className="w-20 h-20 object-cover rounded-xl shadow-lg"
                  loading="lazy"
                />
              )}

              {/* Informations du produit */}
              <div className="flex-1 min-w-0">
                <p className="font-semibold truncate">{item.name}</p>
                <p className="text-sm text-muted-foreground">
                  {item.quantity} × {formatCurrency(item.price)}
                </p>
              </div>

              {/* Sous-total de l'article */}
              <div className="text-right">
                <p className="font-bold text-lg">{formatCurrency(item.subtotal)}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <Separator />

      {/* Section: Adresse de livraison */}
      <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl">
        <h3 className="font-semibold mb-3 flex items-center gap-2">
          <MapPin className="h-5 w-5 text-rose-500" />
          Adresse de livraison
        </h3>
        <div className="space-y-1 text-sm">
          <p className="font-medium">
            {order.shippingAddress.prenom} {order.shippingAddress.nom}
          </p>
          <p className="text-muted-foreground">{order.shippingAddress.adresse}</p>
          <p className="text-muted-foreground">
            {order.shippingAddress.codePostal} {order.shippingAddress.ville}
          </p>
          <p className="text-muted-foreground">{order.shippingAddress.pays}</p>
          <p className="flex items-center gap-2 mt-2">
            <Phone className="h-4 w-4 text-muted-foreground" />
            {order.shippingAddress.telephone}
          </p>
        </div>
      </div>

      <Separator />

      {/* Section: Récapitulatif financier */}
      <div className="bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-800/50 dark:to-slate-900/50 p-4 rounded-xl">
        <h3 className="font-semibold mb-3 flex items-center gap-2">
          <Receipt className="h-5 w-5 text-amber-500" />
          Récapitulatif
        </h3>
        <div className="space-y-2 text-sm">
          {/* Sous-total des produits */}
          <div className="flex justify-between">
            <span className="text-muted-foreground">Sous-total produits</span>
            <span>{formatCurrency(subtotalProduits)}</span>
          </div>

          {/* TVA si applicable */}
          {order.taxAmount && order.taxAmount > 0 && (
            <div className="flex justify-between">
              <span className="text-muted-foreground flex items-center gap-1">
                <BadgePercent className="h-3 w-3" />
                TVA ({order.taxRate || 0}%)
              </span>
              <span>{formatCurrency(order.taxAmount)}</span>
            </div>
          )}

          {/* Frais de livraison si applicable */}
          {order.deliveryPrice && order.deliveryPrice > 0 && (
            <div className="flex justify-between">
              <span className="text-muted-foreground flex items-center gap-1">
                <Truck className="h-3 w-3" />
                Frais de livraison
              </span>
              <span>{formatCurrency(order.deliveryPrice)}</span>
            </div>
          )}

          {/* Réduction si applicable */}
          {order.discount > 0 && (
            <div className="flex justify-between text-emerald-600">
              <span>Réduction appliquée</span>
              <span>-{formatCurrency(order.discount)}</span>
            </div>
          )}

          <Separator className="my-2" />

          {/* Total à rembourser */}
          <div className="flex justify-between font-bold text-lg">
            <span>Total à rembourser</span>
            <span className="text-emerald-600">{formatCurrency(order.totalAmount)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RefundOrderDetails;
