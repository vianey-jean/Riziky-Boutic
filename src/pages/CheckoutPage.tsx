
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/contexts/AuthContext';
import { useStore } from '@/contexts/StoreContext';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';
import { Textarea } from '@/components/ui/textarea';

// Fonction de validation de carte bancaire (algorithme de Luhn)
const isValidCreditCard = (number: string) => {
  // Enlever les espaces et les tirets
  const cleanNumber = number.replace(/\s+|-/g, '');
  
  // Vérifier si la carte contient uniquement des chiffres
  if (!/^\d+$/.test(cleanNumber)) return false;
  
  // Vérifier la longueur (la plupart des cartes ont entre 13 et 19 chiffres)
  if (cleanNumber.length < 13 || cleanNumber.length > 19) return false;
  
  // Algorithme de Luhn
  let sum = 0;
  let shouldDouble = false;
  
  // Parcourir de droite à gauche
  for (let i = cleanNumber.length - 1; i >= 0; i--) {
    let digit = parseInt(cleanNumber.charAt(i));
    
    if (shouldDouble) {
      digit *= 2;
      if (digit > 9) digit -= 9;
    }
    
    sum += digit;
    shouldDouble = !shouldDouble;
  }
  
  return sum % 10 === 0;
};

// Fonction de validation de la date d'expiration
const isValidExpiryDate = (month: string, year: string) => {
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth() + 1; // getMonth() renvoie 0-11
  
  const expiryYear = parseInt(year);
  const expiryMonth = parseInt(month);
  
  // Vérifier le format
  if (isNaN(expiryYear) || isNaN(expiryMonth)) return false;
  if (expiryMonth < 1 || expiryMonth > 12) return false;
  
  // Vérifier si la date n'est pas expirée
  const fullExpiryYear = expiryYear < 100 ? 2000 + expiryYear : expiryYear;
  
  if (fullExpiryYear < currentYear) return false;
  if (fullExpiryYear === currentYear && expiryMonth < currentMonth) return false;
  
  return true;
};

const CheckoutPage = () => {
  const { user } = useAuth();
  const { selectedCartItems, createOrder } = useStore();
  const navigate = useNavigate();
  
  const [shippingInfo, setShippingInfo] = useState({
    firstName: user?.nom?.split(' ')[0] || '',
    lastName: user?.nom?.split(' ')[1] || '',
    email: user?.email || '',
    address: '',
    city: '',
    postalCode: '',
    country: 'France',
    phone: ''
  });
  
  const [paymentInfo, setPaymentInfo] = useState({
    cardNumber: '',
    cardName: '',
    expiryMonth: '',
    expiryYear: '',
    cvv: ''
  });
  
  const [cardNumberError, setCardNumberError] = useState('');
  const [expiryDateError, setExpiryDateError] = useState('');
  
  const handleShippingChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setShippingInfo(prev => ({ ...prev, [name]: value }));
  };
  
  const handlePaymentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    if (name === 'cardNumber') {
      // Formater le numéro de carte avec des espaces tous les 4 caractères
      const formattedValue = value.replace(/\s/g, '').replace(/(\d{4})/g, '$1 ').trim();
      setPaymentInfo(prev => ({ ...prev, [name]: formattedValue }));
      
      // Valider le numéro de carte
      if (value.length > 0) {
        setCardNumberError(isValidCreditCard(value) ? '' : 'Numéro de carte invalide');
      } else {
        setCardNumberError('');
      }
    } else if (name === 'expiryMonth' || name === 'expiryYear') {
      setPaymentInfo(prev => ({ ...prev, [name]: value }));
      
      // Valider la date d'expiration
      if (name === 'expiryMonth' && (paymentInfo.expiryYear || name === 'expiryYear' && paymentInfo.expiryMonth)) {
        const isValid = isValidExpiryDate(
          name === 'expiryMonth' ? value : paymentInfo.expiryMonth,
          name === 'expiryYear' ? value : paymentInfo.expiryYear
        );
        setExpiryDateError(isValid ? '' : 'Date d\'expiration invalide');
      }
    } else {
      setPaymentInfo(prev => ({ ...prev, [name]: value }));
    }
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Vérifier les informations de paiement
    if (!isValidCreditCard(paymentInfo.cardNumber)) {
      toast.error('Numéro de carte invalide');
      return;
    }
    
    if (!isValidExpiryDate(paymentInfo.expiryMonth, paymentInfo.expiryYear)) {
      toast.error('Date d\'expiration invalide');
      return;
    }
    
    try {
      const order = await createOrder(shippingInfo, `Carte ****${paymentInfo.cardNumber.slice(-4)}`);
      
      if (order) {
        toast.success('Commande effectuée avec succès !');
        navigate(`/commande/${order.id}`);
      } else {
        toast.error('Échec de la commande, veuillez réessayer');
      }
    } catch (error) {
      console.error('Erreur lors de la commande:', error);
      toast.error('Erreur lors de la commande, veuillez réessayer');
    }
  };
  
  const subtotal = selectedCartItems.reduce((total, item) => total + item.product.price * item.quantity, 0);
  const shippingCost = subtotal > 50 ? 0 : 5.99;
  const total = subtotal + shippingCost;
  
  useEffect(() => {
    // Rediriger vers le panier si aucun produit n'est sélectionné
    if (selectedCartItems.length === 0) {
      toast.warning('Veuillez sélectionner des produits dans votre panier');
      navigate('/panier');
    }
  }, [selectedCartItems, navigate]);
  
  return (
    <Layout>
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Finaliser votre commande</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Informations de livraison et paiement */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardContent className="pt-6">
                <h2 className="text-xl font-bold mb-4">Adresse de livraison</h2>
                <form className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="firstName">Prénom</Label>
                      <Input 
                        id="firstName" 
                        name="firstName" 
                        value={shippingInfo.firstName} 
                        onChange={handleShippingChange} 
                        required 
                      />
                    </div>
                    <div>
                      <Label htmlFor="lastName">Nom</Label>
                      <Input 
                        id="lastName" 
                        name="lastName" 
                        value={shippingInfo.lastName} 
                        onChange={handleShippingChange} 
                        required 
                      />
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input 
                      id="email" 
                      name="email" 
                      type="email" 
                      value={shippingInfo.email} 
                      onChange={handleShippingChange} 
                      required 
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="address">Adresse</Label>
                    <Textarea 
                      id="address" 
                      name="address" 
                      value={shippingInfo.address} 
                      onChange={handleShippingChange} 
                      required 
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="city">Ville</Label>
                      <Input 
                        id="city" 
                        name="city" 
                        value={shippingInfo.city} 
                        onChange={handleShippingChange} 
                        required 
                      />
                    </div>
                    <div>
                      <Label htmlFor="postalCode">Code postal</Label>
                      <Input 
                        id="postalCode" 
                        name="postalCode" 
                        value={shippingInfo.postalCode} 
                        onChange={handleShippingChange} 
                        required 
                      />
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="country">Pays</Label>
                    <Input 
                      id="country" 
                      name="country" 
                      value={shippingInfo.country} 
                      onChange={handleShippingChange} 
                      required 
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="phone">Téléphone</Label>
                    <Input 
                      id="phone" 
                      name="phone" 
                      value={shippingInfo.phone} 
                      onChange={handleShippingChange} 
                      required 
                    />
                  </div>
                </form>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6">
                <h2 className="text-xl font-bold mb-4">Informations de paiement</h2>
                <form className="space-y-4">
                  <div>
                    <Label htmlFor="cardNumber">Numéro de carte</Label>
                    <Input 
                      id="cardNumber" 
                      name="cardNumber" 
                      placeholder="1234 5678 9012 3456" 
                      value={paymentInfo.cardNumber} 
                      onChange={handlePaymentChange} 
                      maxLength={19}
                      required 
                    />
                    {cardNumberError && <p className="text-sm text-red-500 mt-1">{cardNumberError}</p>}
                  </div>
                  
                  <div>
                    <Label htmlFor="cardName">Nom sur la carte</Label>
                    <Input 
                      id="cardName" 
                      name="cardName" 
                      value={paymentInfo.cardName} 
                      onChange={handlePaymentChange} 
                      required 
                    />
                  </div>
                  
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="expiryMonth">Mois d'expiration</Label>
                      <Input 
                        id="expiryMonth" 
                        name="expiryMonth" 
                        placeholder="MM" 
                        maxLength={2}
                        value={paymentInfo.expiryMonth} 
                        onChange={handlePaymentChange} 
                        required 
                      />
                    </div>
                    <div>
                      <Label htmlFor="expiryYear">Année d'expiration</Label>
                      <Input 
                        id="expiryYear" 
                        name="expiryYear" 
                        placeholder="YY" 
                        maxLength={2}
                        value={paymentInfo.expiryYear} 
                        onChange={handlePaymentChange} 
                        required 
                      />
                    </div>
                    <div>
                      <Label htmlFor="cvv">CVV</Label>
                      <Input 
                        id="cvv" 
                        name="cvv" 
                        maxLength={4}
                        value={paymentInfo.cvv} 
                        onChange={handlePaymentChange} 
                        required 
                      />
                    </div>
                  </div>
                  {expiryDateError && <p className="text-sm text-red-500">{expiryDateError}</p>}
                </form>
              </CardContent>
            </Card>
          </div>
          
          {/* Récapitulatif de la commande */}
          <div>
            <Card>
              <CardContent className="pt-6">
                <h2 className="text-xl font-bold mb-4">Récapitulatif de la commande</h2>
                
                <div className="space-y-4">
                  {selectedCartItems.map((item) => (
                    <div key={item.product.id} className="flex items-center space-x-4">
                      <img 
                        src={item.product.image} 
                        alt={item.product.name} 
                        className="w-16 h-16 object-cover rounded" 
                      />
                      <div className="flex-1">
                        <p className="font-medium">{item.product.name}</p>
                        <p className="text-sm text-gray-500">Quantité: {item.quantity}</p>
                        <p className="text-sm font-medium">
                          {(item.product.price * item.quantity).toFixed(2)} €
                        </p>
                      </div>
                    </div>
                  ))}
                  
                  <Separator className="my-4" />
                  
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Sous-total</span>
                      <span>{subtotal.toFixed(2)} €</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Frais de livraison</span>
                      <span>{shippingCost === 0 ? 'Gratuit' : `${shippingCost.toFixed(2)} €`}</span>
                    </div>
                    <Separator className="my-2" />
                    <div className="flex justify-between font-bold">
                      <span>Total</span>
                      <span>{total.toFixed(2)} €</span>
                    </div>
                  </div>
                  
                  <Button 
                    className="w-full mt-4" 
                    size="lg" 
                    onClick={handleSubmit}
                    disabled={
                      !shippingInfo.firstName || 
                      !shippingInfo.lastName || 
                      !shippingInfo.email || 
                      !shippingInfo.address || 
                      !shippingInfo.city || 
                      !shippingInfo.postalCode || 
                      !shippingInfo.country ||
                      !paymentInfo.cardNumber ||
                      !paymentInfo.cardName ||
                      !paymentInfo.expiryMonth ||
                      !paymentInfo.expiryYear ||
                      !paymentInfo.cvv ||
                      !!cardNumberError ||
                      !!expiryDateError
                    }
                  >
                    Confirmer et payer
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default CheckoutPage;
