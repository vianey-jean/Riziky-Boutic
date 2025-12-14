import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { 
  Shield, 
  CreditCard, 
  CheckCircle, 
  XCircle, 
  Loader2, 
  Package, 
  MapPin, 
  Phone,
  User,
  Lock
} from 'lucide-react';
import { toast } from '@/components/ui/sonner';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';

interface CartItem {
  product: {
    id: string;
    name: string;
    price: number;
    images?: string[];
    promotion?: number;
  };
  quantity: number;
}

interface ShippingAddress {
  nom: string;
  prenom: string;
  adresse: string;
  ville: string;
  codePostal: string;
  pays: string;
  telephone: string;
}

interface CardInfo {
  id?: string;
  maskedNumber: string;
  cardType: string;
  cardName: string;
  expiryDate: string;
}

interface StripePaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPaymentSuccess: () => void;
  onPaymentFailed: () => void;
  cartItems: CartItem[];
  shippingAddress: ShippingAddress;
  cardInfo: CardInfo;
  subtotal: number;
  taxAmount: number;
  deliveryPrice: number;
  orderTotal: number;
}

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const STRIPE_PUBLISHABLE_KEY = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY;

// Charger Stripe une seule fois
const stripePromise = STRIPE_PUBLISHABLE_KEY ? loadStripe(STRIPE_PUBLISHABLE_KEY) : null;

// Style pour CardElement
const cardElementOptions = {
  style: {
    base: {
      fontSize: '16px',
      color: '#1f2937',
      fontFamily: '"Inter", system-ui, sans-serif',
      '::placeholder': {
        color: '#9ca3af',
      },
      iconColor: '#6366f1',
    },
    invalid: {
      color: '#ef4444',
      iconColor: '#ef4444',
    },
  },
  hidePostalCode: true,
};

// Composant de formulaire de paiement interne
const PaymentForm: React.FC<{
  cartItems: CartItem[];
  shippingAddress: ShippingAddress;
  cardInfo: CardInfo;
  subtotal: number;
  taxAmount: number;
  deliveryPrice: number;
  orderTotal: number;
  onPaymentSuccess: () => void;
  onPaymentFailed: () => void;
  onClose: () => void;
}> = ({
  cartItems,
  shippingAddress,
  cardInfo,
  subtotal,
  taxAmount,
  deliveryPrice,
  orderTotal,
  onPaymentSuccess,
  onPaymentFailed,
  onClose
}) => {
  const stripe = useStripe();
  const elements = useElements();
  const [paymentStatus, setPaymentStatus] = useState<'idle' | 'processing' | 'success' | 'failed'>('idle');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [cardComplete, setCardComplete] = useState(false);
  const [cardholderName, setCardholderName] = useState('');
  const [cardholderNameError, setCardholderNameError] = useState('');

  // Validation du nom du titulaire
  const validateCardholderName = (name: string): boolean => {
    const trimmedName = name.trim();
    if (trimmedName.length < 2) {
      setCardholderNameError('Le nom du titulaire est requis');
      return false;
    }
    if (!/^[a-zA-ZÀ-ÿ\s\-']+$/.test(trimmedName)) {
      setCardholderNameError('Le nom ne doit contenir que des lettres');
      return false;
    }
    setCardholderNameError('');
    return true;
  };

  const processStripePayment = async () => {
    // Valider le nom du titulaire
    if (!validateCardholderName(cardholderName)) {
      return;
    }

    if (!stripe || !elements) {
      setErrorMessage('Stripe n\'est pas encore chargé. Veuillez patienter.');
      return;
    }

    const cardElement = elements.getElement(CardElement);
    if (!cardElement) {
      setErrorMessage('Erreur lors du chargement du formulaire de carte.');
      return;
    }

    setPaymentStatus('processing');
    setErrorMessage('');

    try {
      // 1. Créer le PaymentIntent côté serveur
      const response = await fetch(`${API_BASE_URL}/api/payments/create-intent`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        },
        body: JSON.stringify({
          amount: Math.round(orderTotal * 100), // Stripe utilise les centimes
          currency: 'eur',
          orderDetails: {
            items: cartItems.map(item => ({
              productId: item.product.id,
              name: item.product.name,
              quantity: item.quantity,
              price: item.product.price
            })),
            shippingAddress,
            subtotal,
            taxAmount,
            deliveryPrice,
            total: orderTotal
          }
        })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Erreur lors de la création du paiement');
      }

      const { clientSecret, simulated } = await response.json();

      // Mode simulation (Stripe non configuré côté serveur)
      if (simulated) {
        console.log('Mode simulation: Paiement simulé accepté');
        await new Promise(resolve => setTimeout(resolve, 2000));
        setPaymentStatus('success');
        toast.success('Paiement accepté !');
        setTimeout(() => {
          onPaymentSuccess();
        }, 1500);
        return;
      }

      // 2. Confirmer le paiement avec Stripe Elements
      const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: cardElement,
          billing_details: {
            name: cardholderName.trim(),
            email: undefined, // Optionnel
            phone: shippingAddress.telephone,
            address: {
              line1: shippingAddress.adresse,
              city: shippingAddress.ville,
              postal_code: shippingAddress.codePostal,
              country: 'FR',
            },
          },
        },
      });

      if (error) {
        console.error('Erreur Stripe:', error);
        setPaymentStatus('failed');
        setErrorMessage(error.message || 'Une erreur est survenue lors du paiement');
      } else if (paymentIntent?.status === 'succeeded') {
        setPaymentStatus('success');
        toast.success('Paiement accepté !');
        setTimeout(() => {
          onPaymentSuccess();
        }, 1500);
      } else {
        setPaymentStatus('failed');
        setErrorMessage('Le paiement n\'a pas pu être finalisé');
      }
    } catch (error: any) {
      console.error('Erreur de paiement:', error);
      setPaymentStatus('failed');
      setErrorMessage(error.message || 'Une erreur est survenue lors du paiement');
    }
  };

  const handleRetry = () => {
    setPaymentStatus('idle');
    setErrorMessage('');
  };

  const handleClose = () => {
    if (paymentStatus === 'processing') {
      return;
    }
    if (paymentStatus === 'failed') {
      onPaymentFailed();
    }
    onClose();
  };

  return (
    <div className="space-y-6 mt-4">
      {/* Statut du paiement */}
      <AnimatePresence mode="wait">
        {paymentStatus === 'processing' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="flex flex-col items-center justify-center py-12 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl"
          >
            <Loader2 className="h-16 w-16 text-blue-600 animate-spin mb-4" />
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Traitement en cours...</h3>
            <p className="text-gray-600">Veuillez patienter pendant la validation de votre paiement</p>
          </motion.div>
        )}

        {paymentStatus === 'success' && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center justify-center py-12 bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 200, delay: 0.2 }}
            >
              <CheckCircle className="h-20 w-20 text-green-500 mb-4" />
            </motion.div>
            <h3 className="text-2xl font-bold text-green-700 mb-2">Paiement réussi !</h3>
            <p className="text-gray-600">Redirection vers vos commandes...</p>
          </motion.div>
        )}

        {paymentStatus === 'failed' && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center justify-center py-8 bg-gradient-to-br from-red-50 to-pink-50 rounded-2xl"
          >
            <XCircle className="h-16 w-16 text-red-500 mb-4" />
            <h3 className="text-xl font-semibold text-red-700 mb-2">Paiement refusé</h3>
            <p className="text-gray-600 text-center px-4 mb-4">{errorMessage}</p>
            <Button onClick={handleRetry} variant="outline" className="border-red-300 hover:bg-red-50">
              Réessayer
            </Button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Formulaire - toujours monté mais caché pendant traitement/succès */}
      <div className={paymentStatus !== 'idle' && paymentStatus !== 'failed' ? 'hidden' : ''}>
        {/* Formulaire Stripe Elements */}
        <div className="bg-white rounded-2xl border-2 border-gray-200 shadow-sm overflow-hidden mb-6">
          <div className="bg-gradient-to-r from-indigo-500 to-purple-600 px-6 py-4">
            <h4 className="font-semibold text-white flex items-center gap-2">
              <CreditCard className="h-5 w-5" />
              Informations de carte bancaire
            </h4>
            <p className="text-indigo-100 text-sm mt-1">Saisissez vos informations de paiement sécurisé</p>
          </div>
          
          <div className="p-6 space-y-4">
            {/* Nom du titulaire */}
            <div>
              <label htmlFor="cardholderName" className="block text-sm font-medium text-gray-700 mb-2">
                Nom du titulaire de la carte
              </label>
              <input
                id="cardholderName"
                type="text"
                value={cardholderName}
                onChange={(e) => {
                  setCardholderName(e.target.value);
                  if (cardholderNameError) {
                    validateCardholderName(e.target.value);
                  }
                }}
                onBlur={() => validateCardholderName(cardholderName)}
                placeholder="Jean Dupont"
                className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all ${
                  cardholderNameError ? 'border-red-500 bg-red-50' : 'border-gray-200 bg-gray-50'
                }`}
              />
              {cardholderNameError && (
                <p className="text-red-500 text-sm mt-1">{cardholderNameError}</p>
              )}
            </div>

            {/* Carte bancaire (Stripe Elements) */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Informations de carte
              </label>
              <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                <CardElement 
                  options={cardElementOptions}
                  onChange={(e) => setCardComplete(e.complete)}
                />
              </div>
            </div>

            <p className="text-xs text-gray-500 mt-3 flex items-center gap-1">
              <Lock className="h-3 w-3" />
              Vos données sont cryptées et sécurisées par Stripe
            </p>
          </div>
        </div>

        {/* Récapitulatif de la commande */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden mb-6">
          <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-6 py-4 border-b">
            <h4 className="font-semibold text-gray-800 flex items-center gap-2">
              <Package className="h-5 w-5 text-primary" />
              Récapitulatif de la commande
            </h4>
          </div>
          
          <div className="p-6 space-y-4">
            {/* Produits */}
            <div className="space-y-3 max-h-48 overflow-y-auto">
              {cartItems.map((item, index) => (
                <div key={index} className="flex items-center gap-4 p-3 bg-gray-50 rounded-xl">
                  <div className="w-16 h-16 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0">
                    {item.product.images?.[0] ? (
                      <img 
                        src={`${API_BASE_URL}${item.product.images[0]}`}
                        alt={item.product.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Package className="h-6 w-6 text-gray-400" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-800 truncate">{item.product.name}</p>
                    <p className="text-sm text-gray-500">Quantité: {item.quantity}</p>
                  </div>
                  <p className="font-semibold text-gray-800">
                    {(item.product.price * item.quantity).toFixed(2)} €
                  </p>
                </div>
              ))}
            </div>

            <Separator />

            {/* Adresse de livraison */}
            <div className="p-4 bg-blue-50 rounded-xl">
              <h5 className="font-medium text-gray-800 flex items-center gap-2 mb-2">
                <MapPin className="h-4 w-4 text-blue-600" />
                Adresse de livraison
              </h5>
              <div className="text-sm text-gray-600 space-y-1">
                <p className="flex items-center gap-2">
                  <User className="h-3 w-3" />
                  {shippingAddress.prenom} {shippingAddress.nom}
                </p>
                <p>{shippingAddress.adresse}</p>
                <p>{shippingAddress.codePostal} {shippingAddress.ville}</p>
                <p>{shippingAddress.pays}</p>
                <p className="flex items-center gap-2">
                  <Phone className="h-3 w-3" />
                  {shippingAddress.telephone}
                </p>
              </div>
            </div>

            <Separator />

            {/* Totaux */}
            <div className="space-y-2">
              <div className="flex justify-between text-gray-600">
                <span>Sous-total</span>
                <span>{subtotal.toFixed(2)} €</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Livraison</span>
                <span>{deliveryPrice === 0 ? 'Gratuite' : `${deliveryPrice.toFixed(2)} €`}</span>
              </div>
              <Separator />
              <div className="flex justify-between text-xl font-bold text-gray-800">
                <span>Total TTC</span>
                <span className="text-primary">{orderTotal.toFixed(2)} €</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bouton de paiement */}
        <Button
          onClick={processStripePayment}
          disabled={!stripe || !cardComplete || paymentStatus === 'processing'}
          className="w-full h-14 text-lg font-semibold bg-gradient-to-r from-green-500 via-emerald-500 to-green-600 hover:from-green-600 hover:via-emerald-600 hover:to-green-700 shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed mb-4"
        >
          <Shield className="h-5 w-5 mr-2" />
          {!stripe ? 'Chargement...' : !cardComplete ? 'Complétez les informations de carte' : `Payer ${orderTotal.toFixed(2)} €`}
        </Button>

        {/* Sécurité */}
        <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
          <Shield className="h-4 w-4 text-green-500" />
          <span>Paiement 100% sécurisé par cryptage SSL</span>
        </div>
      </div>
    </div>
  );
};

const StripePaymentModal: React.FC<StripePaymentModalProps> = (props) => {
  const { isOpen, onClose, onPaymentFailed } = props;
  const [stripeLoaded, setStripeLoaded] = useState(false);

  useEffect(() => {
    if (isOpen && stripePromise) {
      stripePromise.then(() => setStripeLoaded(true));
    }
  }, [isOpen]);

  const handleClose = () => {
    onClose();
  };

  // Si Stripe n'est pas configuré
  if (!STRIPE_PUBLISHABLE_KEY) {
    return (
      <Dialog open={isOpen} onOpenChange={handleClose}>
        <DialogContent className="max-w-md bg-white">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-3 text-xl text-red-600">
              <XCircle className="h-6 w-6" />
              Configuration Stripe manquante
            </DialogTitle>
            <DialogDescription>
              La clé publique Stripe n'est pas configurée. Veuillez contacter l'administrateur.
            </DialogDescription>
          </DialogHeader>
          <Button onClick={handleClose} variant="outline" className="mt-4">
            Fermer
          </Button>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-gradient-to-br from-white to-gray-50">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3 text-2xl">
            <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg">
              <Lock className="h-6 w-6 text-white" />
            </div>
            <div>
              <span className="bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                Paiement sécurisé
              </span>
              <p className="text-sm text-muted-foreground font-normal mt-1">
                Paiement par carte via Stripe
              </p>
            </div>
          </DialogTitle>
          <DialogDescription className="sr-only">
            Entrez vos informations de carte pour effectuer le paiement
          </DialogDescription>
        </DialogHeader>

        {stripePromise && (
          <Elements stripe={stripePromise}>
            <PaymentForm {...props} />
          </Elements>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default StripePaymentModal;
