import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from '@/components/ui/sonner';
import LoadingSpinner from '@/components/ui/loading-spinner';
import { cardsAPI } from '@/services/cards';

interface CreditCardFormProps {
  onSuccess: () => void;
  onSaveCard?: (cardData: any) => void;
}

const CreditCardForm: React.FC<CreditCardFormProps> = ({ onSuccess, onSaveCard }) => {
  const [cardNumber, setCardNumber] = useState('');
  const [cardName, setCardName] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');
  const [saveCard, setSaveCard] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({
    cardNumber: '',
    cardName: '',
    expiryDate: '',
    cvv: ''
  });

  const formatCardNumber = (value: string) => {
    const digits = value.replace(/\D/g, '');
    const limitedDigits = digits.slice(0, 16);
    const formatted = limitedDigits.replace(/(\d{4})(?=\d)/g, '$1 ');
    return formatted;
  };

  const formatExpiryDate = (value: string) => {
    const digits = value.replace(/\D/g, '');
    const limitedDigits = digits.slice(0, 4);
    if (limitedDigits.length > 2) {
      return `${limitedDigits.slice(0, 2)}/${limitedDigits.slice(2)}`;
    }
    return limitedDigits;
  };

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCardNumber(formatCardNumber(e.target.value));
    setErrors(prev => ({ ...prev, cardNumber: '' }));
  };

  const handleExpiryDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setExpiryDate(formatExpiryDate(e.target.value));
    setErrors(prev => ({ ...prev, expiryDate: '' }));
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCardName(e.target.value);
    setErrors(prev => ({ ...prev, cardName: '' }));
  };

  const handleCvvChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 3);
    setCvv(value);
    setErrors(prev => ({ ...prev, cvv: '' }));
  };

  const validateCardNumber = (number: string) => {
    const digits = number.replace(/\s/g, '');
    if (digits.length !== 16) return false;
    return /^\d{16}$/.test(digits);
  };
  
  const validateExpiryDate = (date: string) => {
    if (date.length !== 5) return false;
    
    const parts = date.split('/');
    if (parts.length !== 2) return false;
    
    const month = parseInt(parts[0], 10);
    const year = parseInt('20' + parts[1], 10);
    
    if (isNaN(month) || isNaN(year)) return false;
    if (month < 1 || month > 12) return false;
    
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth() + 1;
    
    if (year < currentYear) return false;
    if (year === currentYear && month < currentMonth) return false;
    
    return true;
  };

  const validateForm = () => {
    let valid = true;
    const newErrors = {
      cardNumber: '',
      cardName: '',
      expiryDate: '',
      cvv: ''
    };

    if (!cardName.trim()) {
      newErrors.cardName = 'Le nom du titulaire est requis';
      valid = false;
    }

    if (!validateCardNumber(cardNumber)) {
      newErrors.cardNumber = 'Numéro de carte invalide';
      valid = false;
    }

    if (!validateExpiryDate(expiryDate)) {
      newErrors.expiryDate = 'Date d\'expiration invalide';
      valid = false;
    }

    if (cvv.length < 3) {
      newErrors.cvv = 'CVV invalide';
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setLoading(true);
    
    try {
      // Sauvegarder la carte si demandé
      if (saveCard) {
        await cardsAPI.addCard({
          cardNumber,
          cardName,
          expiryDate,
          cvv
        });
        toast.success("Carte sauvegardée avec succès");
      }

      // Simuler le paiement
      setTimeout(() => {
        setLoading(false);
        toast.success("Paiement accepté");
        
        if (onSuccess && typeof onSuccess === 'function') {
          onSuccess();
        }
      }, 1500);
    } catch (error) {
      console.error('Erreur lors de la sauvegarde de la carte:', error);
      setLoading(false);
      toast.error("Erreur lors de la sauvegarde de la carte");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="cardName">Titulaire de la carte</Label>
        <Input
          id="cardName"
          placeholder="John Doe"
          value={cardName}
          onChange={handleNameChange}
          required
          className={errors.cardName ? "border-red-500" : ""}
        />
        {errors.cardName && <p className="text-red-500 text-sm mt-1">{errors.cardName}</p>}
      </div>
      
      <div>
        <Label htmlFor="cardNumber">Numéro de carte</Label>
        <Input
          id="cardNumber"
          placeholder="1234 5678 9012 3456"
          value={cardNumber}
          onChange={handleCardNumberChange}
          required
          className={errors.cardNumber ? "border-red-500" : ""}
        />
        {errors.cardNumber && <p className="text-red-500 text-sm mt-1">{errors.cardNumber}</p>}
      </div>
      
      <div className="flex space-x-4">
        <div className="w-1/2">
          <Label htmlFor="expiryDate">Date d'expiration</Label>
          <Input
            id="expiryDate"
            placeholder="MM/YY"
            value={expiryDate}
            onChange={handleExpiryDateChange}
            required
            className={errors.expiryDate ? "border-red-500" : ""}
          />
          {errors.expiryDate && <p className="text-red-500 text-sm mt-1">{errors.expiryDate}</p>}
        </div>
        <div className="w-1/2">
          <Label htmlFor="cvv">CVV</Label>
          <Input
            id="cvv"
            placeholder="123"
            value={cvv}
            onChange={handleCvvChange}
            required
            type="password"
            className={errors.cvv ? "border-red-500" : ""}
          />
          {errors.cvv && <p className="text-red-500 text-sm mt-1">{errors.cvv}</p>}
        </div>
      </div>

      <div className="flex items-center space-x-2">
        <Checkbox 
          id="saveCard" 
          checked={saveCard} 
          onCheckedChange={(checked) => setSaveCard(checked === true)}
        />
        <Label htmlFor="saveCard" className="text-sm">
          Enregistrer cette carte pour les prochains paiements
        </Label>
      </div>
      
      <Button 
        type="submit" 
        className="w-full mt-4 bg-red-800 hover:bg-red-700"
        disabled={loading}
      >
        {loading ? (
          <span className="flex items-center justify-center">
            <LoadingSpinner size="sm" className="mr-2" /> Traitement en cours...
          </span>
        ) : 'Payer'}
      </Button>
    </form>
  );
};

export default CreditCardForm;
