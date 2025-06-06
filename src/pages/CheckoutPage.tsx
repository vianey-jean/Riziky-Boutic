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
import CreditCardForm from '@/components/checkout/CreditCardForm';
import { ShippingAddress, codePromosAPI } from '@/services/api';
import { Link } from 'react-router-dom';
import { Percent, ShoppingCart, Shield, CreditCard, Truck, CheckCircle, Star, Sparkles, Gift, Lock } from 'lucide-react';
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
  const orderTotal = discountedSubtotal + deliveryPrice;
  
  // URL de base pour les images
  const AUTH_BASE_URL = import.meta.env.VITE_API_BASE_URL;
  
  // Si aucun élément n'est sélectionné, retourner au panier
  if (selectedCartItems.length === 0) {
    return (
      <Layout>
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50 dark:from-gray-900 dark:via-blue-950 dark:to-indigo-950">
          <div className="max-w-4xl mx-auto px-4 py-12">
            <motion.div 
              className="text-center"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6 }}
            >
              <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-3xl p-12 shadow-2xl border border-white/20">
                <motion.div
                  animate={{ 
                    scale: [1, 1.1, 1],
                    rotate: [0, 5, -5, 0]
                  }}
                  transition={{ duration: 3, repeat: Infinity }}
                  className="mb-8"
                >
                  <ShoppingCart className="h-20 w-20 mx-auto text-gray-400 drop-shadow-lg" />
                </motion.div>
                
                <motion.h1 
                  className="text-4xl font-bold mb-6 bg-gradient-to-r from-gray-600 to-gray-800 bg-clip-text text-transparent"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  Votre panier est vide
                </motion.h1>
                
                <motion.p 
                  className="text-gray-500 mb-8 text-xl"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  Ajoutez des produits à votre panier pour commander
                </motion.p>
                
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                >
                  <Button asChild className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-8 py-3 rounded-xl shadow-xl">
                    <Link to="/panier">Retour au panier</Link>
                  </Button>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </Layout>
    );
  }
  
  if (loading) {
    return (
      <Layout>
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-blue-950 dark:via-indigo-950 dark:to-purple-950">
          <div className="max-w-4xl mx-auto px-4 py-12">
            <div className="flex flex-col items-center justify-center min-h-[400px]">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                className="mb-8"
              >
                <div className="relative">
                  <div className="w-16 h-16 border-4 border-blue-200 rounded-full"></div>
                  <div className="absolute top-0 left-0 w-16 h-16 border-4 border-blue-600 rounded-full border-t-transparent animate-spin"></div>
                </div>
              </motion.div>
              <LoadingSpinner size="lg" text="Traitement de votre commande..." />
            </div>
          </div>
        </div>
      </Layout>
    );
  }
  
  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-blue-950 dark:via-indigo-950 dark:to-purple-950 relative overflow-hidden">
        {/* Éléments décoratifs */}
        <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-r from-blue-200/20 to-indigo-200/20 rounded-full -translate-x-48 -translate-y-48 animate-pulse"></div>
        <div className="absolute bottom-0 right-0 w-80 h-80 bg-gradient-to-l from-purple-200/20 to-blue-200/20 rounded-full translate-x-40 translate-y-40 animate-pulse"></div>
        
        <div className="max-w-6xl mx-auto px-4 py-8 relative z-10">
          {/* En-tête amélioré */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-white/20">
              <motion.div
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="flex justify-center mb-4"
              >
                <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-4 rounded-2xl shadow-lg">
                  <ShoppingCart className="h-10 w-10 text-white" />
                </div>
              </motion.div>
              
              <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent mb-4">
                Finaliser la commande
              </h1>
              
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: 120 }}
                transition={{ duration: 1, delay: 0.5 }}
                className="h-1 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full mx-auto"
              />
            </div>
          </motion.div>
          
          {/* Étapes du processus d'achat améliorées */}
          <motion.div 
            className="mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl p-6 shadow-xl border border-white/20">
              <div className="flex justify-between items-center">
                <motion.div 
                  className={`flex-1 text-center ${step === 'shipping' ? 'font-semibold' : ''}`}
                  whileHover={{ scale: 1.05 }}
                >
                  <motion.div 
                    className={`w-12 h-12 mx-auto mb-3 rounded-full flex items-center justify-center transition-all duration-300 ${
                      step === 'shipping' 
                        ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg' 
                        : 'bg-gray-200 dark:bg-gray-700'
                    }`}
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 0.6 }}
                  >
                    {step === 'payment' ? (
                      <CheckCircle className="h-6 w-6" />
                    ) : (
                      <Truck className="h-6 w-6" />
                    )}
                  </motion.div>
                  <span className="text-sm font-medium">Livraison</span>
                </motion.div>
                
                <div className="flex-1 h-1 mx-4 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-gradient-to-r from-blue-500 to-indigo-500"
                    initial={{ width: "0%" }}
                    animate={{ width: step === 'payment' ? "100%" : "0%" }}
                    transition={{ duration: 0.8 }}
                  />
                </div>
                
                <motion.div 
                  className={`flex-1 text-center ${step === 'payment' ? 'font-semibold' : ''}`}
                  whileHover={{ scale: 1.05 }}
                >
                  <motion.div 
                    className={`w-12 h-12 mx-auto mb-3 rounded-full flex items-center justify-center transition-all duration-300 ${
                      step === 'payment' 
                        ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg' 
                        : 'bg-gray-200 dark:bg-gray-700'
                    }`}
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 0.6 }}
                  >
                    <CreditCard className="h-6 w-6" />
                  </motion.div>
                  <span className="text-sm font-medium">Paiement</span>
                </motion.div>
              </div>
            </div>
          </motion.div>
          
          {showCardForm ? (
            <motion.div 
              className="max-w-md mx-auto"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4 }}
            >
              <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl p-8 rounded-3xl shadow-2xl border border-white/20">
                <div className="flex items-center justify-center mb-6">
                  <div className="bg-gradient-to-r from-green-500 to-emerald-500 p-3 rounded-2xl">
                    <Lock className="h-8 w-8 text-white" />
                  </div>
                </div>
                
                <h2 className="text-2xl font-semibold mb-6 text-center bg-gradient-to-r from-gray-700 to-gray-900 bg-clip-text text-transparent">
                  Paiement sécurisé
                </h2>
                
                <CreditCardForm onSuccess={handlePaymentSuccess} />
                
                <Button 
                  variant="outline" 
                  className="mt-6 w-full bg-white/50 hover:bg-white/70 border-2"
                  onClick={() => setShowCardForm(false)}
                >
                  Retour
                </Button>
              </div>
            </motion.div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              <div className="lg:col-span-8 space-y-6">
                {step === 'shipping' && (
                  <motion.form 
                    onSubmit={handleShippingSubmit}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5 }}
                  >
                    <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl p-8 rounded-3xl shadow-2xl border border-white/20">
                      <div className="flex items-center mb-6">
                        <div className="bg-gradient-to-r from-blue-500 to-indigo-500 p-3 rounded-2xl mr-4">
                          <Truck className="h-6 w-6 text-white" />
                        </div>
                        <h2 className="text-2xl font-semibold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                          Informations de livraison
                        </h2>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4 mb-4">
                        <div>
                          <Label htmlFor="nom">Nom*</Label>
                          <Input
                            id="nom"
                            name="nom"
                            value={shippingData.nom}
                            onChange={handleChange}
                            required
                          />
                        </div>
                        <div>
                          <Label htmlFor="prenom">Prénom*</Label>
                          <Input
                            id="prenom"
                            name="prenom"
                            value={shippingData.prenom}
                            onChange={handleChange}
                            required
                          />
                        </div>
                      </div>
                      
                      <div className="mb-4">
                        <Label htmlFor="adresse">Adresse*</Label>
                        <Input
                          id="adresse"
                          name="adresse"
                          value={shippingData.adresse}
                          onChange={handleChange}
                          required
                        />
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4 mb-4">
                        <div>
                          <Label htmlFor="ville">Ville de livraison*</Label>
                          <Select 
                            value={deliveryCity}
                            onValueChange={handleCityChange}
                          >
                            <SelectTrigger id="ville">
                              <SelectValue placeholder="Sélectionnez une ville" />
                            </SelectTrigger>
                            <SelectContent>
                              {Object.keys(DELIVERY_PRICES).sort().map(city => (
                                <SelectItem key={city} value={city}>
                                  {city} {DELIVERY_PRICES[city as keyof typeof DELIVERY_PRICES] === 0 
                                    ? "(Gratuit)" 
                                    : `(+${DELIVERY_PRICES[city as keyof typeof DELIVERY_PRICES]}€)`}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label htmlFor="codePostal">Code postal*</Label>
                          <Input
                            id="codePostal"
                            name="codePostal"
                            value={shippingData.codePostal}
                            onChange={handleChange}
                            required
                          />
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4 mb-4">
                        <div>
                          <Label htmlFor="pays">Pays*</Label>
                          <Select 
                            value={shippingData.pays}
                            onValueChange={(value) => setShippingData({...shippingData, pays: value})}
                          >
                            <SelectTrigger id="pays">
                              <SelectValue placeholder="Sélectionnez un pays" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="La Réunion">La Réunion</SelectItem>
                              <SelectItem value="France">France</SelectItem>
                              <SelectItem value="Madagascar">Madagascar</SelectItem>
                              <SelectItem value="Mayotte">Mayotte</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label htmlFor="telephone">Téléphone*</Label>
                          <Input
                            id="telephone"
                            name="telephone"
                            type="tel"
                            value={shippingData.telephone}
                            onChange={handleChange}
                            required
                          />
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex justify-between mt-8">
                      <Button 
                        type="button" 
                        variant="outline"
                        className="bg-white/50 hover:bg-white/70 border-2 px-8 py-3"
                        onClick={() => navigate('/panier')}
                      >
                        Retour au panier
                      </Button>
                      <Button 
                        type="submit" 
                        className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 px-8 py-3 shadow-xl"
                      >
                        Continuer au paiement
                      </Button>
                    </div>
                  </motion.form>
                )}
                
                {step === 'payment' && (
                  <motion.form 
                    onSubmit={handlePaymentSubmit}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5 }}
                  >
                    <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 overflow-hidden">
                      <div className="bg-gradient-to-r from-green-500 to-emerald-500 p-6">
                        <div className="flex items-center text-white">
                          <Shield className="h-6 w-6 mr-3" />
                          <h2 className="text-2xl font-semibold">Paiement sécurisé</h2>
                        </div>
                      </div>
                      
                      <div className="p-8">
                        <PaymentMethods 
                          selectedMethod={paymentMethod}
                          onMethodChange={setPaymentMethod}
                        />
                      </div>
                    </div>
                    
                    <div className="flex justify-between mt-8">
                      <Button 
                        type="button" 
                        variant="outline"
                        className="bg-white/50 hover:bg-white/70 border-2 px-8 py-3"
                        onClick={() => setStep('shipping')}
                      >
                        Retour
                      </Button>
                      <Button 
                        type="submit" 
                        className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 px-8 py-3 shadow-xl"
                        disabled={loading}
                      >
                        {loading ? 'Traitement en cours...' : 'Confirmer la commande'}
                      </Button>
                    </div>
                  </motion.form>
                )}
              </div>
              
              <div className="lg:col-span-4">
                <motion.div 
                  className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl p-8 rounded-3xl shadow-2xl mb-8 border border-white/20"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                >
                  <div className="flex items-center mb-6">
                    <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-3 rounded-2xl mr-4">
                      <ShoppingCart className="h-6 w-6 text-white" />
                    </div>
                    <h2 className="text-xl font-semibold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                      Récapitulatif
                    </h2>
                  </div>
                  
                  <div className="space-y-4 mb-6">
                    {selectedCartItems.map(item => (
                      <motion.div
                        key={item.product.id} 
                        className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-xl"
                        whileHover={{ scale: 1.02 }}
                        transition={{ duration: 0.2 }}
                      >
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
                      </motion.div>
                    ))}
                  </div>
                  
                  <div className="border-t pt-6 space-y-4">
                    <div className="flex justify-between">
                      <p>Sous-total</p>
                      <p>{formatPrice(subtotal)}</p>
                    </div>
                    
                    {hasPromoDiscount && (
                      <div className="flex justify-between text-red-600">
                        <p>Remise code promo</p>
                        <p>-{formatPrice(subtotal - discountedSubtotal)}</p>
                      </div>
                    )}
                    
                    <div className="flex justify-between">
                      <p>Frais de livraison ({deliveryCity || 'Non sélectionné'})</p>
                      <p>{deliveryPrice === 0 && !deliveryCity ? 'Non calculé' : deliveryPrice === 0 ? 'Gratuit' : formatPrice(deliveryPrice)}</p>
                    </div>
                    
                    {/* Section Code Promo améliorée */}
                    {step === 'shipping' && !allProductsOnPromotion && hasNonPromotionProduct && (
                      <motion.div 
                        className="py-4 border-t border-b bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 rounded-xl p-4"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                      >
                        <div className="flex items-center mb-3">
                          <Percent className="h-5 w-5 text-yellow-600 mr-2" />
                          <p className="font-medium text-yellow-800 dark:text-yellow-200">Code Promotion</p>
                        </div>
                        
                        <div className="flex space-x-2">
                          <Input
                            placeholder="Saisir votre code promo"
                            value={codePromo}
                            onChange={(e) => setCodePromo(e.target.value)}
                            disabled={verifiedPromo !== null || verifyingCode}
                            className="bg-white/80 border-yellow-200"
                          />
                          <Button 
                            onClick={handleVerifyCodePromo}
                            disabled={!codePromo || verifiedPromo !== null || verifyingCode}
                            variant="outline"
                            className="bg-yellow-100 hover:bg-yellow-200 border-yellow-300"
                          >
                            {verifyingCode ? 'Vérification...' : 'Appliquer'}
                          </Button>
                        </div>
                        
                        {verifiedPromo && verifiedPromo.valid && (
                          <motion.div 
                            className="mt-3 flex items-center text-sm text-green-600 bg-green-50 dark:bg-green-900/20 p-2 rounded-lg"
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                          >
                            <CheckCircle className="h-4 w-4 mr-2" />
                            Code promo appliqué : {verifiedPromo.pourcentage}% de réduction
                          </motion.div>
                        )}
                      </motion.div>
                    )}
                    
                    <div className="flex justify-between font-bold text-lg pt-2">
                      <p>Total</p>
                      <p>{formatPrice(orderTotal)}</p>
                    </div>
                  </div>
                </motion.div>
                
                {/* Informations sécurité améliorées */}
                <motion.div 
                  className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 p-6 rounded-2xl border border-green-200 dark:border-green-800"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  <div className="flex items-center mb-4">
                    <Shield className="h-6 w-6 text-green-600 mr-2" />
                    <h3 className="font-medium text-green-800 dark:text-green-200">Garanties & Sécurité</h3>
                  </div>
                  
                  <ul className="text-sm space-y-2 text-green-700 dark:text-green-300">
                    <motion.li 
                      className="flex items-center"
                      whileHover={{ x: 5 }}
                      transition={{ duration: 0.2 }}
                    >
                      <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
                      Paiements 100% sécurisés
                    </motion.li>
                    <motion.li 
                      className="flex items-center"
                      whileHover={{ x: 5 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Truck className="h-4 w-4 mr-2 text-green-500" />
                      Livraison rapide 3-5 jours
                    </motion.li>
                    <motion.li 
                      className="flex items-center"
                      whileHover={{ x: 5 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Gift className="h-4 w-4 mr-2 text-green-500" />
                      Retours gratuits sous 30 jours
                    </motion.li>
                    <motion.li 
                      className="flex items-center"
                      whileHover={{ x: 5 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Star className="h-4 w-4 mr-2 text-green-500" />
                      Support client 24/7
                    </motion.li>
                  </ul>
                </motion.div>
              </div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default CheckoutPage;
