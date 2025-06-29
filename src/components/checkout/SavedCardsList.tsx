
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { CreditCard, Trash2, Star } from 'lucide-react';
import { cardsAPI, type SavedCard } from '@/services/cards';
import { toast } from '@/components/ui/sonner';
import { Badge } from '@/components/ui/badge';

interface SavedCardsListProps {
  onCardSelect: (cardId: string) => void;
  selectedCardId?: string;
}

const SavedCardsList: React.FC<SavedCardsListProps> = ({ onCardSelect, selectedCardId }) => {
  const [cards, setCards] = useState<SavedCard[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCards();
  }, []);

  const loadCards = async () => {
    try {
      const userCards = await cardsAPI.getUserCards();
      setCards(userCards);
    } catch (error) {
      console.error('Erreur lors du chargement des cartes:', error);
      toast.error('Erreur lors du chargement des cartes');
    } finally {
      setLoading(false);
    }
  };

  const getCardIcon = (cardType: string) => {
    switch (cardType) {
      case 'visa':
        return '💳';
      case 'mastercard':
        return '💳';
      case 'american-express':
        return '💳';
      default:
        return '💳';
    }
  };

  const handleSetDefault = async (cardId: string) => {
    try {
      await cardsAPI.setDefaultCard(cardId);
      await loadCards();
      toast.success('Carte définie comme défaut');
    } catch (error) {
      console.error('Erreur:', error);
      toast.error('Erreur lors de la définition de la carte par défaut');
    }
  };

  const handleDeleteCard = async (cardId: string) => {
    try {
      await cardsAPI.deleteCard(cardId);
      await loadCards();
      toast.success('Carte supprimée');
    } catch (error) {
      console.error('Erreur:', error);
      toast.error('Erreur lors de la suppression de la carte');
    }
  };

  if (loading) {
    return <div className="text-center py-4">Chargement des cartes...</div>;
  }

  if (cards.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <CreditCard className="h-12 w-12 mx-auto mb-4 text-gray-300" />
        <p>Aucune carte enregistrée</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold flex items-center">
        <CreditCard className="h-5 w-5 mr-2" />
        Cartes enregistrées
      </h3>
      
      <RadioGroup value={selectedCardId} onValueChange={onCardSelect}>
        {cards.map((card) => (
          <div key={card.id} className="relative">
            <Label 
              htmlFor={card.id} 
              className="cursor-pointer block"
            >
              <Card className={`transition-colors ${
                selectedCardId === card.id 
                  ? 'ring-2 ring-red-500 bg-red-50' 
                  : 'hover:bg-gray-50'
              }`}>
                <CardContent className="p-4">
                  <div className="flex items-center space-x-3">
                    <RadioGroupItem value={card.id} id={card.id} />
                    <div className="flex-1">
                      <div className="flex items-center space-x-3">
                        <span className="text-2xl">{getCardIcon(card.cardType)}</span>
                        <div>
                          <div className="flex items-center space-x-2">
                            <span className="font-mono text-lg">{card.maskedNumber}</span>
                            {card.isDefault && (
                              <Badge variant="secondary" className="bg-green-100 text-green-700">
                                <Star className="h-3 w-3 mr-1" />
                                Par défaut
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm text-gray-600">{card.cardName}</p>
                          <p className="text-sm text-gray-500">Expire: {card.expiryDate}</p>
                        </div>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      {!card.isDefault && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={(e) => {
                            e.preventDefault();
                            handleSetDefault(card.id);
                          }}
                        >
                          <Star className="h-4 w-4" />
                        </Button>
                      )}
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={(e) => {
                          e.preventDefault();
                          handleDeleteCard(card.id);
                        }}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Label>
          </div>
        ))}
      </RadioGroup>
    </div>
  );
};

export default SavedCardsList;
