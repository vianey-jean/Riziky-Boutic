import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useStore } from '@/contexts/StoreContext';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/components/ui/sonner';

const CheckoutPage = () => {
  const { cart, getCartTotal, createOrder } = useStore();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);
  
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    address: '',
    city: '',
    postalCode: '',
    country: 'France',
    phone: '',
    cardNumber: '',
    cardExpiry: '',
    cardCvc: '',
    useShippingAddress: true,
  });

  // Fill in user information when user is loaded
  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        firstName: user.prenom || '',
        lastName: user.nom || '',
        email: user.email || '',
        address: user.adresse || '',
        city: user.ville || '',
        postalCode: user.codePostal || '',
        country: user.pays || 'France',
        phone: user.telephone || '',
      }));
    }
  }, [user]);

  if (cart.length === 0) {
    navigate('/panier');
    return null;
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    // Format card number with spaces every 4 digits
    if (name === 'cardNumber') {
      const formatted = value.replace(/\s/g, '').replace(/(\d{4})/g, '$1 ').trim();
      setFormData(prev => ({ ...prev, [name]: formatted.slice(0, 19) }));
      return;
    }
    
    // Format card expiry as MM/YY
    if (name === 'cardExpiry') {
      const expiry = value.replace(/\D/g, '');
      if (expiry.length <= 2) {
        setFormData(prev => ({ ...prev, [name]: expiry }));
      } else {
        const month = expiry.slice(0, 2);
        const year = expiry.slice(2, 4);
        setFormData(prev => ({ ...prev, [name]: `${month}/${year}` }));
      }
      return;
    }
    
    // Format CVC to only allow 3 or 4 digits
    if (name === 'cardCvc') {
      const cvc = value.replace(/\D/g, '');
      setFormData(prev => ({ ...prev, [name]: cvc.slice(0, 4) }));
      return;
    }
    
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const validateCardExpiry = (expiry: string): boolean => {
    // Extract month and year
    const parts = expiry.split('/');
    if (parts.length !== 2) return false;
    
    const month = parseInt(parts[0], 10);
    const year = parseInt(`20${parts[1]}`, 10);
    
    // Check if month is valid (1-12)
    if (month < 1 || month > 12) return false;
    
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth() + 1; // getMonth() returns 0-11
    
    // Check if the expiry date is in the future
    if (year < currentYear || (year === currentYear && month < currentMonth)) {
      return false;
    }
    
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate card expiry
    if (!validateCardExpiry(formData.cardExpiry)) {
      toast.error('La date d\'expiration de la carte est invalide ou expirée');
      return;
    }
    
    setIsProcessing(true);
    
    // Prepare shipping address
    const shippingAddress = {
      prenom: formData.firstName,
      nom: formData.lastName,
      adresse: formData.address,
      ville: formData.city,
      codePostal: formData.postalCode,
      pays: formData.country,
      telephone: formData.phone,
    };
    
    try {
      // Call the createOrder function
      const order = await createOrder(shippingAddress, 'Card');
      
      if (order) {
        navigate(`/commande/${order.id}`);
        toast.success('Commande passée avec succès!');
      } else {
        throw new Error('Erreur lors de la création de la commande');
      }
    } catch (error) {
      console.error('Error creating order:', error);
      toast.error('Une erreur est survenue. Veuillez réessayer.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Layout>
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Paiement</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2">
            <form onSubmit={handleSubmit}>
              {/* Informations personnelles */}
              <div className="bg-white p-6 rounded-lg border mb-6">
                <h2 className="text-xl font-semibold mb-4">Informations personnelles</h2>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                  <div>
                    <Label htmlFor="firstName">Prénom</Label>
                    <Input
                      id="firstName"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="lastName">Nom</Label>
                    <Input
                      id="lastName"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>
                
                <div className="mb-4">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="mb-4">
                  <Label htmlFor="phone">Téléphone</Label>
                  <Input
                    id="phone"
                    name="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
              
              {/* Adresse de livraison */}
              <div className="bg-white p-6 rounded-lg border mb-6">
                <h2 className="text-xl font-semibold mb-4">Adresse de livraison</h2>
                
                <div className="mb-4">
                  <Label htmlFor="address">Adresse</Label>
                  <Input
                    id="address"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    required
                  />
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                  <div>
                    <Label htmlFor="city">Ville</Label>
                    <Input
                      id="city"
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="postalCode">Code Postal</Label>
                    <Input
                      id="postalCode"
                      name="postalCode"
                      value={formData.postalCode}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="country">Pays</Label>
                  <Input
                    id="country"
                    name="country"
                    value={formData.country}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
              
              {/* Informations de paiement */}
              <div className="bg-white p-6 rounded-lg border mb-6">
                <h2 className="text-xl font-semibold mb-4">Informations de paiement</h2>
                
                <div className="mb-4">
                  <Label htmlFor="cardNumber">Numéro de carte</Label>
                  <Input
                    id="cardNumber"
                    name="cardNumber"
                    placeholder="1234 5678 9012 3456"
                    value={formData.cardNumber}
                    onChange={handleChange}
                    required
                  />
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="cardExpiry">Date d'expiration (MM/YY)</Label>
                    <Input
                      id="cardExpiry"
                      name="cardExpiry"
                      placeholder="MM/YY"
                      value={formData.cardExpiry}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="cardCvc">CVC</Label>
                    <Input
                      id="cardCvc"
                      name="cardCvc"
                      placeholder="123"
                      value={formData.cardCvc}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>
              </div>
              
              <Button type="submit" className="w-full" size="lg" disabled={isProcessing}>
                {isProcessing ? 'Traitement en cours...' : `Payer ${getCartTotal().toFixed(2)} €`}
              </Button>
            </form>
          </div>
          
          <div>
            <div className="bg-gray-50 p-6 rounded-lg border sticky top-6">
              <h2 className="text-xl font-semibold mb-4">Résumé de commande</h2>
              
              <div className="space-y-3 mb-4">
                {cart.map((item) => (
                  <div key={item.product.id} className="flex justify-between">
                    <div>
                      <span>{item.product.name} </span>
                      <span className="text-muted-foreground">x{item.quantity}</span>
                    </div>
                    <span className="font-medium">
                      {(item.product.price * item.quantity).toFixed(2)} €
                    </span>
                  </div>
                ))}
              </div>
              
              <div className="border-t pt-4 mt-4">
                <div className="flex justify-between mb-2">
                  <span>Sous-total</span>
                  <span>{getCartTotal().toFixed(2)} €</span>
                </div>
                <div className="flex justify-between mb-2">
                  <span>Livraison</span>
                  <span>0.00 €</span>
                </div>
                <div className="flex justify-between mb-2">
                  <span>Taxes</span>
                  <span>{(getCartTotal() * 0.2).toFixed(2)} €</span>
                </div>
                <div className="border-t pt-2 mt-2 flex justify-between font-bold">
                  <span>Total</span>
                  <span>{(getCartTotal() * 1.2).toFixed(2)} €</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default CheckoutPage;
