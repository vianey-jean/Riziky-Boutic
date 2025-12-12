
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CreditCard, Plus } from 'lucide-react';
import SavedCardsList from './SavedCardsList';
import CreditCardForm from './CreditCardForm';
import StripePaymentModal from './StripePaymentModal';
import { cardsAPI, SavedCard, CardData } from '@/services/cards';
import { toast } from '@/components/ui/sonner';
import { useStore } from '@/contexts/StoreContext';
import { useNavigate } from 'react-router-dom';
import { getSecureRoute } from '@/services/security/routing/routeSecurity';

interface PaymentMethodSelectorProps {
  onPaymentSuccess: () => void;
  shippingAddress?: {
    nom: string;
    prenom: string;
    adresse: string;
    ville: string;
    codePostal: string;
    pays: string;
    telephone: string;
  };
  subtotal?: number;
  taxAmount?: number;
  deliveryPrice?: number;
  orderTotal?: number;
}

const PaymentMethodSelector: React.FC<PaymentMethodSelectorProps> = ({ 
  onPaymentSuccess,
  shippingAddress,
  subtotal = 0,
  taxAmount = 0,
  deliveryPrice = 0,
  orderTotal = 0
}) => {
  const { selectedCartItems } = useStore();
  const navigate = useNavigate();
  const [selectedCardId, setSelectedCardId] = useState<string>('');
  const [activeTab, setActiveTab] = useState('saved');
  const [hasSavedCards, setHasSavedCards] = useState(false);
  const [savedCards, setSavedCards] = useState<SavedCard[]>([]);
  const [showStripeModal, setShowStripeModal] = useState(false);
  const [selectedCardInfo, setSelectedCardInfo] = useState<{
    id?: string;
    maskedNumber: string;
    cardType: string;
    cardName: string;
    expiryDate: string;
  } | null>(null);
  const [pendingNewCard, setPendingNewCard] = useState<CardData | null>(null);

  useEffect(() => {
    checkSavedCards();
  }, []);

  const checkSavedCards = async () => {
    try {
      const cards = await cardsAPI.getUserCards();
      setSavedCards(cards);
      setHasSavedCards(cards.length > 0);
      
      // Sélectionner automatiquement la carte par défaut
      const defaultCard = cards.find(card => card.isDefault);
      if (defaultCard) {
        setSelectedCardId(defaultCard.id);
      }
      
      // Si pas de cartes sauvegardées, aller directement à l'onglet nouvelle carte
      if (cards.length === 0) {
        setActiveTab('new');
      }
    } catch (error) {
      console.error('Erreur lors de la vérification des cartes:', error);
    }
  };

  const handlePayWithSavedCard = async () => {
    if (!selectedCardId) {
      toast.error('Veuillez sélectionner une carte');
      return;
    }

    try {
      const card = savedCards.find(c => c.id === selectedCardId);
      if (!card) {
        toast.error('Carte non trouvée');
        return;
      }

      // Préparer les informations de la carte pour le modal
      setSelectedCardInfo({
        id: card.id,
        maskedNumber: card.maskedNumber,
        cardType: card.cardType,
        cardName: card.cardName,
        expiryDate: card.expiryDate
      });

      // Ouvrir le modal de confirmation Stripe
      setShowStripeModal(true);
    } catch (error) {
      console.error('Erreur lors de la récupération de la carte:', error);
      toast.error('Erreur lors du paiement');
    }
  };

  const handleNewCardPayment = (cardData: CardData) => {
    // Masquer le numéro de carte
    const maskedNumber = `**** **** **** ${cardData.cardNumber.slice(-4)}`;
    
    // Détecter le type de carte
    const cardType = detectCardType(cardData.cardNumber);
    
    setSelectedCardInfo({
      maskedNumber,
      cardType,
      cardName: cardData.cardName,
      expiryDate: cardData.expiryDate
    });
    
    setPendingNewCard(cardData);
    setShowStripeModal(true);
  };

  const detectCardType = (number: string): string => {
    const cleaned = number.replace(/\s/g, '');
    if (/^4/.test(cleaned)) return 'visa';
    if (/^5[1-5]/.test(cleaned)) return 'mastercard';
    if (/^3[47]/.test(cleaned)) return 'american-express';
    return 'other';
  };

  const handlePaymentSuccess = () => {
    setShowStripeModal(false);
    
    // Si une nouvelle carte était en attente, la sauvegarder si demandé
    if (pendingNewCard) {
      checkSavedCards();
      setPendingNewCard(null);
    }
    
    onPaymentSuccess();
  };

  const handlePaymentFailed = () => {
    setShowStripeModal(false);
    setPendingNewCard(null);
    // Rester sur la page de sélection de carte
  };

  // Valeurs par défaut pour l'adresse si non fournie
  const defaultShippingAddress = shippingAddress || {
    nom: '',
    prenom: '',
    adresse: '',
    ville: '',
    codePostal: '',
    pays: 'La Réunion',
    telephone: ''
  };

  return (
    <>
      <Card className="w-full max-w-md mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center">
            <CreditCard className="h-5 w-5 mr-2" />
            Méthode de paiement
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="saved" disabled={!hasSavedCards}>
                Cartes enregistrées
              </TabsTrigger>
              <TabsTrigger value="new">
                <Plus className="h-4 w-4 mr-1" />
                Nouvelle carte
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="saved" className="space-y-4">
              <SavedCardsList 
                onCardSelect={setSelectedCardId}
                selectedCardId={selectedCardId}
              />
              <Button 
                onClick={handlePayWithSavedCard}
                className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700"
                disabled={!selectedCardId}
              >
                Payer avec cette carte
              </Button>
            </TabsContent>
            
            <TabsContent value="new">
              <CreditCardForm 
                onSuccess={() => {
                  // Cette fonction n'est plus appelée directement
                  // Le paiement passe par le modal
                }}
                onPayWithCard={handleNewCardPayment}
              />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Modal de confirmation de paiement Stripe */}
      {selectedCardInfo && (
        <StripePaymentModal
          isOpen={showStripeModal}
          onClose={() => {
            setShowStripeModal(false);
            setPendingNewCard(null);
          }}
          onPaymentSuccess={handlePaymentSuccess}
          onPaymentFailed={handlePaymentFailed}
          cartItems={selectedCartItems}
          shippingAddress={defaultShippingAddress}
          cardInfo={selectedCardInfo}
          subtotal={subtotal}
          taxAmount={taxAmount}
          deliveryPrice={deliveryPrice}
          orderTotal={orderTotal}
        />
      )}
    </>
  );
};

export default PaymentMethodSelector;
