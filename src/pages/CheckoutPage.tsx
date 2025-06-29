import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import { useStore } from '@/contexts/StoreContext';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from '@/components/ui/sonner';
import PaymentMethodSelector from '@/components/checkout/PaymentMethodSelector';
import { ShippingAddress, codePromosAPI } from '@/services/api';
import { Link } from 'react-router-dom';
import { Percent, ShoppingCart, CheckCircle, Truck, CreditCard, Shield, MapPin, Phone, Mail } from 'lucide-react';
import PaymentMethods from '@/components/checkout/PaymentMethods';
import CartSummary from '@/components/cart/CartSummary';
import LoadingSpinner from '@/components/ui/loading-spinner';
import { formatPrice } from '@/lib/utils';
import { motion } from 'framer-motion';

// Définition des prix de livraison par ville
const DELIVERY_PRICES = {
  "Saint-Benoît": 20,
  "Saint-Denis": 0,
  "Saint-Pierre": 20,
  "Bras-Panon": 25,
  "Entre-Deux": 20,
  "Etang-Salé": 25,
  "Petite-Île": 20,
  "Le Port": 0,
  "La Possession": 0,
  "Saint-André": 10,
  "Saint Joseph": 25,
  "Saint-Leu": 15,
  "Saint-Louis": 15,
  "Saint-Paul": 0,
  "Saint-Philippe": 25,
  "Sainte-Marie": 0,
  "Sainte-Rose": 25,
  "Sainte-Suzanne": 0,
  "Salazie": 25,
  "Tampon": 20,
  "Trois-Bassins": 20
};

// Constante pour le taux de taxe (20% de TVA)
const TAX_RATE = 0.20;

const CheckoutPage = () => {
  const { selectedCartItems, getCartTotal, createOrder } = useStore();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [showCardForm, setShowCardForm] = useState(false);
  const [deliveryCity, setDeliveryCity] = useState<string>("");
  const [deliveryPrice, setDeliveryPrice] = useState<number>(0);
  const [step, setStep] = useState<'shipping' | 'payment'>('shipping');
  
  // État pour le code promo
  const [codePromo, setCodePromo] = useState<string>('');
  const [verifyingCode, setVerifyingCode] = useState<boolean>(false);
  const [verifiedPromo, setVerifiedPromo] = useState<{
    valid: boolean;
    pourcentage: number;
    productId: string;
    code: string;
  } | null>(null);
  
  // Formulaire d'adresse
  const [shippingData, setShippingData] = useState<ShippingAddress>({
    nom: user?.nom || '',
    prenom: user?.prenom || '',
    adresse: user?.adresse || '',
    ville: user?.ville || '',
    codePostal: user?.codePostal || '',
    pays: user?.pays || 'La Réunion',
    telephone: user?.telephone || '',
  });
  
  // Vérifier si tous les produits sont en promotion
  const allProductsOnPromotion = selectedCartItems.every(item => 
    item.product.promotion && item.product.promotion > 0
  );
  
  // Vérifier s'il y a au moins un produit sans promotion
  const hasNonPromotionProduct = selectedCartItems.some(item => 
    !item.product.promotion || item.product.promotion <= 0
  );

  useEffect(() => {
    // Rediriger si le panier est vide
    if (selectedCartItems.length === 0) {
      toast.error("Votre panier est vide. Veuillez ajouter des produits avant de procéder au paiement.");
      navigate('/panier');
    }
  }, [selectedCartItems, navigate]);
  
  // Si les items du panier changent, mettre à jour les informations de livraison
  useEffect(() => {
    if (user) {
      setShippingData({
        nom: user.nom || '',
        prenom: user.prenom || '',
        adresse: user.adresse || '',
        ville: user.ville || '',
        codePostal: user.codePostal || '',
        pays: user.pays || 'La Réunion',
        telephone: user.telephone || '',
      });
    }
  }, [user]);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setShippingData(prev => ({ ...prev, [name]: value }));
  };

  // Mettre à jour la ville et le prix de livraison
  const handleCityChange = (city: string) => {
    setDeliveryCity(city);
    setShippingData(prev => ({ ...prev, ville: city }));
    
    const price = DELIVERY_PRICES[city as keyof typeof DELIVERY_PRICES] || 0;
    setDeliveryPrice(price);
  };
  
  // Vérifier le code promo
  const handleVerifyCodePromo = async () => {
    if (!codePromo.trim()) {
      toast.error("Veuillez saisir un code promo");
      return;
    }
    
    // Rechercher le premier produit sans promotion pour appliquer le code promo
    const nonPromoProduct = selectedCartItems.find(item => 
      !item.product.promotion || item.product.promotion <= 0
    );
    
    if (!nonPromoProduct) {
      toast.error("Aucun produit éligible pour un code promo");
      return;
    }
    
    setVerifyingCode(true);
    try {
      const response = await codePromosAPI.verify(codePromo, nonPromoProduct.product.id);
      const data = response.data;
      
      if (data.valid && data.pourcentage) {
        setVerifiedPromo({
          valid: true,
          pourcentage: data.pourcentage,
          productId: nonPromoProduct.product.id,
          code: codePromo
        });
        toast.success(`Code promo valide ! ${data.pourcentage}% de réduction appliquée`);
      } else {
        setVerifiedPromo(null);
        toast.error(data.message || "Code promo invalide");
      }
    } catch (error) {
      console.error("Erreur lors de la vérification du code promo:", error);
      setVerifiedPromo(null);
      toast.error("Erreur lors de la vérification du code promo");
    } finally {
      setVerifyingCode(false);
    }
  };
  
  const handleShippingSubmit = (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!validateShippingForm()) {
      toast.error("Veuillez remplir tous les champs obligatoires");
      return;
    }
    
    if (!deliveryCity) {
      toast.error("Veuillez sélectionner une ville de livraison");
      return;
    }

    // Passer à l'étape suivante
    setStep('payment');
    window.scrollTo(0, 0);
  };
  
  const handlePaymentSubmit = (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (paymentMethod === 'card') {
      setShowCardForm(true);
    } else {
      // Traiter les autres méthodes de paiement
      processOrder();
    }
  };
  
  const processOrder = async () => {
    setLoading(true);
    try {
      console.log('Traitement de commande avec données:', {
        shippingAddress: shippingData,
        paymentMethod: paymentMethod,
        cartItems: selectedCartItems.map(item => ({ 
          productId: item.product.id, 
          quantity: item.quantity 
        })),
        promoDetails: verifiedPromo ? {
          code: verifiedPromo.code,
          productId: verifiedPromo.productId,
          pourcentage: verifiedPromo.pourcentage
        } : undefined
      });
      
      // Ensure we're actually sending items to the server
      if (selectedCartItems.length === 0) {
        toast.error("Votre panier est vide. Impossible de créer la commande.");
        setLoading(false);
        return;
      }
      
      const order = await createOrder(
        shippingData, 
        paymentMethod, 
        verifiedPromo ? {
          code: verifiedPromo.code,
          productId: verifiedPromo.productId,
          pourcentage: verifiedPromo.pourcentage
        } : undefined
      );
      
      if (order) {
        toast.success("Commande effectuée avec succès !");
        navigate(`/commandes`);  // Redirect to orders page
      } else {
        toast.error("Erreur lors de la création de la commande");
      }
    } catch (error) {
      console.error("Erreur:", error);
      toast.error("Une erreur est survenue lors de la validation de la commande");
    } finally {
      setLoading(false);
    }
  };

  const handlePaymentSuccess = () => {
    console.log("Payment success, processing order...");
    processOrder();
  };
  
  const validateShippingForm = () => {
    return (
      shippingData.nom.trim() !== '' &&
      shippingData.prenom.trim() !== '' &&
      shippingData.adresse.trim() !== '' &&
      deliveryCity !== '' &&
      shippingData.codePostal.trim() !== '' &&
      shippingData.pays.trim() !== '' &&
      shippingData.telephone.trim() !== ''
    );
  };
  
  // Calculer le total en tenant compte du code promo
  const calculateItemPrice = (item: typeof selectedCartItems[0]) => {
    if (verifiedPromo && verifiedPromo.valid && item.product.id === verifiedPromo.productId) {
      return item.product.price * (1 - verifiedPromo.pourcentage / 100) * item.quantity;
    }
    return item.product.price * item.quantity;
  };
  
  const subtotal = getCartTotal();
  
  // Calculer le total avec remise code promo
  const discountedSubtotal = selectedCartItems.reduce((total, item) => {
    return total + calculateItemPrice(item);
  }, 0);
  
  const hasPromoDiscount = subtotal !== discountedSubtotal;
  
  // Calcul des taxes (20% de TVA)
  const taxAmount = discountedSubtotal * TAX_RATE;
  
  const orderTotal = discountedSubtotal + deliveryPrice + taxAmount;
  
  // URL de base pour les images
  const AUTH_BASE_URL = import.meta.env.VITE_API_BASE_URL;
  
  // Si aucun élément n'est sélectionné, retourner au panier
  if (selectedCartItems.length === 0) {
    return (
      <Layout>
        <div className="max-w-4xl mx-auto px-4 py-12">
          <div className="text-center">
            <ShoppingCart className="h-12 w-12 mx-auto text-gray-400 mb-4" />
            <h1 className="text-2xl font-bold mb-4">Votre panier est vide</h1>
            <p className="text-gray-500 mb-6">Ajoutez des produits à votre panier pour commander</p>
            <Button asChild>
              <Link to="/panier">Retour au panier</Link>
            </Button>
          </div>
        </div>
      </Layout>
    );
  }
  
  if (loading) {
    return (
      <Layout>
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
          <div className="max-w-4xl mx-auto px-4 py-12">
            <div className="flex flex-col items-center justify-center min-h-[500px]">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center"
              >
                <div className="w-16 h-16 bg-gradient-to-r from-red-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CreditCard className="h-8 w-8 text-white animate-pulse" />
                </div>
                <LoadingSpinner size="lg" text="Traitement sécurisé de votre commande..." />
                <p className="text-sm text-gray-500 mt-4">Veuillez patienter, ne fermez pas cette page</p>
              </motion.div>
            </div>
          </div>
        </div>
      </Layout>
    );
  }
  
  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
        <div className="max-w-7xl mx-auto px-4 py-8">
          {/* En-tête moderne avec gradient */}
          <motion.div 
            className="text-center mb-12"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-red-500 to-pink-500 rounded-full blur-3xl opacity-10 scale-150"></div>
              <h1 className="relative text-4xl md:text-5xl font-bold bg-gradient-to-r from-red-600 to-pink-600 bg-clip-text text-transparent mb-4">
                Finaliser votre commande
              </h1>
            </div>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Quelques étapes simples vous séparent de vos produits préférés
            </p>
          </motion.div>

          {/* Étapes du processus avec design moderne */}
          <motion.div 
            className="mb-16"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="flex justify-between items-center max-w-md mx-auto">
              <motion.div 
                className={`flex flex-col items-center ${step === 'shipping' ? 'scale-110' : ''}`}
                whileHover={{ scale: 1.05 }}
              >
                <div className={`w-12 h-12 mb-3 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${
                  step === 'shipping' 
                    ? 'bg-gradient-to-r from-red-500 to-pink-500 text-white border-red-500 shadow-lg' 
                    : 'bg-white text-gray-400 border-gray-300'
                }`}>
                  <Truck className="h-6 w-6" />
                </div>
                <span className={`text-sm font-medium ${step === 'shipping' ? 'text-red-600' : 'text-gray-500'}`}>
                  Livraison
                </span>
              </motion.div>
              
              <div className="flex-1 h-1 mx-4 bg-gray-200 rounded-full overflow-hidden">
                <motion.div 
                  className="h-full bg-gradient-to-r from-red-500 to-pink-500"
                  initial={{ width: '0%' }}
                  animate={{ width: step === 'payment' ? '100%' : '0%' }}
                  transition={{ duration: 0.5 }}
                />
              </div>
              
              <motion.div 
                className={`flex flex-col items-center ${step === 'payment' ? 'scale-110' : ''}`}
                whileHover={{ scale: 1.05 }}
              >
                <div className={`w-12 h-12 mb-3 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${
                  step === 'payment' 
                    ? 'bg-gradient-to-r from-red-500 to-pink-500 text-white border-red-500 shadow-lg' 
                    : 'bg-white text-gray-400 border-gray-300'
                }`}>
                  <CreditCard className="h-6 w-6" />
                </div>
                <span className={`text-sm font-medium ${step === 'payment' ? 'text-red-600' : 'text-gray-500'}`}>
                  Paiement
                </span>
              </motion.div>
            </div>
          </motion.div>
        
          {showCardForm ? (
            <motion.div 
              className="max-w-md mx-auto"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4 }}
            >
              <div className="bg-white p-8 rounded-2xl shadow-xl border border-gray-200">
                <div className="text-center mb-6">
                  <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Shield className="h-8 w-8 text-white" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">Paiement sécurisé</h2>
                  <p className="text-gray-600">Vos données sont protégées par cryptage SSL</p>
                </div>
                <PaymentMethodSelector onPaymentSuccess={handlePaymentSuccess} />
                <Button 
                  variant="outline" 
                  className="mt-6 w-full border-gray-300 hover:border-gray-400"
                  onClick={() => setShowCardForm(false)}
                >
                  Retour aux options de paiement
                </Button>
              </div>
            </motion.div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              <motion.div 
                className="lg:col-span-8 space-y-6"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
              >
                {step === 'shipping' && (
                  <form onSubmit={handleShippingSubmit}>
                    <div className="bg-white p-8 rounded-2xl shadow-xl border border-gray-200">
                      <div className="flex items-center mb-6">
                        <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center mr-4">
                          <MapPin className="h-6 w-6 text-white" />
                        </div>
                        <div>
                          <h2 className="text-2xl font-bold text-gray-900">Informations de livraison</h2>
                          <p className="text-gray-600">Où souhaitez-vous recevoir votre commande ?</p>
                        </div>
                      </div>
                      
                      <div className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="space-y-2">
                            <Label htmlFor="nom" className="text-sm font-semibold text-gray-700">Nom*</Label>
                            <Input
                              id="nom"
                              name="nom"
                              value={shippingData.nom}
                              onChange={handleChange}
                              required
                              className="h-12 border-gray-300 focus:border-red-500 focus:ring-red-500"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="prenom" className="text-sm font-semibold text-gray-700">Prénom*</Label>
                            <Input
                              id="prenom"
                              name="prenom"
                              value={shippingData.prenom}
                              onChange={handleChange}
                              required
                              className="h-12 border-gray-300 focus:border-red-500 focus:ring-red-500"
                            />
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="adresse" className="text-sm font-semibold text-gray-700">Adresse complète*</Label>
                          <Input
                            id="adresse"
                            name="adresse"
                            value={shippingData.adresse}
                            onChange={handleChange}
                            required
                            className="h-12 border-gray-300 focus:border-red-500 focus:ring-red-500"
                            placeholder="Numéro, rue, appartement..."
                          />
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="space-y-2">
                            <Label htmlFor="ville" className="text-sm font-semibold text-gray-700">Ville de livraison*</Label>
                            <Select value={deliveryCity} onValueChange={handleCityChange}>
                              <SelectTrigger id="ville" className="h-12 border-gray-300 focus:border-red-500">
                                <SelectValue placeholder="Sélectionnez votre ville" />
                              </SelectTrigger>
                              <SelectContent>
                                {Object.keys(DELIVERY_PRICES).sort().map(city => (
                                  <SelectItem key={city} value={city}>
                                    <div className="flex justify-between items-center w-full">
                                      <span>{city}</span>
                                      <span className="ml-4 text-sm text-gray-500">
                                        {DELIVERY_PRICES[city as keyof typeof DELIVERY_PRICES] === 0 
                                          ? "Gratuit" 
                                          : `+${DELIVERY_PRICES[city as keyof typeof DELIVERY_PRICES]}€`}
                                      </span>
                                    </div>
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="codePostal" className="text-sm font-semibold text-gray-700">Code postal*</Label>
                            <Input
                              id="codePostal"
                              name="codePostal"
                              value={shippingData.codePostal}
                              onChange={handleChange}
                              required
                              className="h-12 border-gray-300 focus:border-red-500 focus:ring-red-500"
                            />
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="space-y-2">
                            <Label htmlFor="pays" className="text-sm font-semibold text-gray-700">Pays/Région*</Label>
                            <Select 
                              value={shippingData.pays}
                              onValueChange={(value) => setShippingData({...shippingData, pays: value})}
                            >
                              <SelectTrigger id="pays" className="h-12 border-gray-300 focus:border-red-500">
                                <SelectValue placeholder="Sélectionnez votre pays" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="La Réunion">🇷🇪 La Réunion</SelectItem>
                                <SelectItem value="France">🇫🇷 France métropolitaine</SelectItem>
                                <SelectItem value="Madagascar">🇲🇬 Madagascar</SelectItem>
                                <SelectItem value="Mayotte">🇾🇹 Mayotte</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="telephone" className="text-sm font-semibold text-gray-700 flex items-center">
                              <Phone className="h-4 w-4 mr-1" />
                              Téléphone*
                            </Label>
                            <Input
                              id="telephone"
                              name="telephone"
                              type="tel"
                              value={shippingData.telephone}
                              onChange={handleChange}
                              required
                              className="h-12 border-gray-300 focus:border-red-500 focus:ring-red-500"
                              placeholder="+262 123 456 789"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex flex-col sm:flex-row justify-between gap-4 mt-8">
                      <Button 
                        type="button" 
                        variant="outline"
                        onClick={() => navigate('/panier')}
                        className="flex items-center px-6 py-3 h-12 border-gray-300 hover:border-gray-400"
                      >
                        <ShoppingCart className="h-5 w-5 mr-2" />
                        Retour au panier
                      </Button>
                      <Button 
                        type="submit" 
                        className="bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white px-8 py-3 h-12 shadow-lg hover:shadow-xl transition-all duration-300"
                      >
                        <CheckCircle className="h-5 w-5 mr-2" />
                        Continuer au paiement
                      </Button>
                    </div>
                  </form>
                )}
                
                {step === 'payment' && (
                  <form onSubmit={handlePaymentSubmit}>
                    <div className="bg-white p-8 rounded-2xl shadow-xl border border-gray-200">
                      <div className="flex items-center mb-6">
                        <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-blue-500 rounded-xl flex items-center justify-center mr-4">
                          <Shield className="h-6 w-6 text-white" />
                        </div>
                        <div>
                          <h2 className="text-2xl font-bold text-gray-900">Méthode de paiement</h2>
                          <p className="text-gray-600">Choisissez votre mode de paiement sécurisé</p>
                        </div>
                      </div>
                      
                      <PaymentMethods 
                        selectedMethod={paymentMethod}
                        onMethodChange={setPaymentMethod}
                      />
                    </div>
                    
                    <div className="flex flex-col sm:flex-row justify-between gap-4 mt-8">
                      <Button 
                        type="button" 
                        variant="outline"
                        onClick={() => setStep('shipping')}
                        className="flex items-center px-6 py-3 h-12 border-gray-300 hover:border-gray-400"
                      >
                        Retour aux informations
                      </Button>
                      <Button 
                        type="submit" 
                        className="bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white px-8 py-3 h-12 shadow-lg hover:shadow-xl transition-all duration-300"
                        disabled={loading}
                      >
                        {loading ? (
                          <>
                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                            Traitement en cours...
                          </>
                        ) : (
                          <>
                            <Shield className="h-5 w-5 mr-2" />
                            Confirmer la commande
                          </>
                        )}
                      </Button>
                    </div>
                  </form>
                )}
              </motion.div>
              
              <motion.div 
                className="lg:col-span-4"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                <div className="bg-white p-6 rounded-2xl shadow-xl border border-gray-200 mb-6 sticky top-4">
                  <div className="flex items-center mb-6">
                    <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center mr-3">
                      <ShoppingCart className="h-5 w-5 text-white" />
                    </div>
                    <h2 className="text-xl font-bold text-gray-900">Récapitulatif</h2>
                  </div>
                  
                  <div className="space-y-4 mb-6">
                    {selectedCartItems.map(item => (
                      <div key={item.product.id} className="flex items-center space-x-3">
                        <img 
                          src={`${AUTH_BASE_URL}${
                            item.product.images && item.product.images.length > 0 
                              ? item.product.images[0] 
                              : item.product.image
                          }`} 
                          alt={item.product.name} 
                          className="w-16 h-16 object-cover rounded" 
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src = `${AUTH_BASE_URL}/uploads/placeholder.jpg`;
                          }}
                        />
                        <div className="flex-grow">
                          <p className="font-medium line-clamp-2 text-sm">{item.product.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {item.quantity} x {formatPrice(item.product.price)}
                            {verifiedPromo && verifiedPromo.valid && item.product.id === verifiedPromo.productId && (
                              <span className="ml-2 text-red-600">
                                (-{verifiedPromo.pourcentage}%)
                              </span>
                            )}
                            {item.product.promotion && item.product.promotion > 0 && (
                              <span className="ml-2 text-green-600">
                                (Déjà en promo: -{item.product.promotion}%)
                              </span>
                            )}
                          </p>
                        </div>
                        <p className="font-semibold text-sm whitespace-nowrap">
                          {formatPrice(calculateItemPrice(item))}
                        </p>
                      </div>
                    ))}
                  </div>
                  
                  <div className="border-t pt-6 space-y-4">
                    <div className="flex justify-between text-gray-600">
                      <p>Sous-total</p>
                      <p className="font-semibold">{formatPrice(subtotal)}</p>
                    </div>
                    
                    {hasPromoDiscount && (
                      <div className="flex justify-between text-green-600">
                        <p className="flex items-center">
                          <Percent className="h-4 w-4 mr-1" />
                          Remise code promo
                        </p>
                        <p className="font-semibold">-{formatPrice(subtotal - discountedSubtotal)}</p>
                      </div>
                    )}

                    {/**C'est ici pour ajouter le taxe: */}
                    <div className="flex justify-between text-gray-600">
                      <p>TVA (20%)</p>
                      <p className="font-semibold">{formatPrice(taxAmount)}</p>
                    </div>

                    <div className="flex justify-between text-gray-600">
                      <p className="flex items-center">
                        <Truck className="h-4 w-4 mr-1" />
                        Livraison ({deliveryCity || 'Non sélectionné'})
                      </p>
                      <p className="font-semibold">
                        {deliveryPrice === 0 && !deliveryCity ? 'Non calculé' : 
                         deliveryPrice === 0 ? 'Gratuit' : formatPrice(deliveryPrice)}
                      </p>
                    </div>
                    
                    {/* Section Code Promo avec design amélioré */}
                    {step === 'shipping' && !allProductsOnPromotion && hasNonPromotionProduct && (
                      <div className="py-4 border-t border-b bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg p-4 -mx-2">
                        <p className="font-semibold mb-3 text-gray-800 flex items-center">
                          <Percent className="h-4 w-4 mr-2 text-yellow-600" />
                          Code Promotion
                        </p>
                        <div className="flex space-x-2">
                          <Input
                            placeholder="Entrez votre code"
                            value={codePromo}
                            onChange={(e) => setCodePromo(e.target.value)}
                            disabled={verifiedPromo !== null || verifyingCode}
                            className="border-yellow-300 focus:border-yellow-500"
                          />
                          <Button 
                            onClick={handleVerifyCodePromo}
                            disabled={!codePromo || verifiedPromo !== null || verifyingCode}
                            variant="outline"
                            className="border-yellow-300 text-yellow-700 hover:bg-yellow-50"
                          >
                            {verifyingCode ? 'Vérification...' : 'Appliquer'}
                          </Button>
                        </div>
                        {verifiedPromo && verifiedPromo.valid && (
                          <div className="mt-3 flex items-center text-sm text-green-600 bg-green-50 p-2 rounded-lg">
                            <CheckCircle className="h-4 w-4 mr-2" />
                            Code appliqué : {verifiedPromo.pourcentage}% de réduction
                          </div>
                        )}
                      </div>
                    )}
                    
                    <div className="flex justify-between font-bold text-xl pt-4 border-t-2">
                      <p className="text-gray-900">Total TTC</p>
                      <p className="text-red-600">{formatPrice(orderTotal)}</p>
                    </div>
                  </div>
                </div>
                
                {/* Informations de sécurité */}
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-2xl border border-blue-200">
                  <div className="flex items-center mb-4">
                    <Shield className="h-6 w-6 text-blue-600 mr-2" />
                    <h3 className="font-semibold text-blue-900">Paiement sécurisé</h3>
                  </div>
                  <ul className="text-sm space-y-2 text-blue-800">
                    <li className="flex items-center">
                      <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
                      Cryptage SSL 256 bits
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
                      Données bancaires protégées
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
                      Livraison assurée
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
                      Retours gratuits 30 jours
                    </li>
                  </ul>
                </div>
              </motion.div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default CheckoutPage;
