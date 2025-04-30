
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useNavigate } from 'react-router-dom';
import { toast } from '@/components/ui/sonner';

interface CreditCardFormProps {
  onSuccess: (orderId: string) => void;
}

const CreditCardForm: React.FC<CreditCardFormProps> = ({ onSuccess }) => {
  const [cardNumber, setCardNumber] = useState('');
  const [cardName, setCardName] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const formatCardNumber = (value: string) => {
    // Remove non-digit characters
    const digits = value.replace(/\D/g, '');
    // Limit to 16 digits
    const limitedDigits = digits.slice(0, 16);
    // Add spaces every 4 digits
    const formatted = limitedDigits.replace(/(\d{4})(?=\d)/g, '$1 ');
    return formatted;
  };

  const formatExpiryDate = (value: string) => {
    // Remove non-digit characters
    const digits = value.replace(/\D/g, '');
    // Limit to 4 digits
    const limitedDigits = digits.slice(0, 4);
    // Add slash after first 2 digits
    if (limitedDigits.length > 2) {
      return `${limitedDigits.slice(0, 2)}/${limitedDigits.slice(2)}`;
    }
    return limitedDigits;
  };

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCardNumber(formatCardNumber(e.target.value));
  };

  const handleExpiryDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setExpiryDate(formatExpiryDate(e.target.value));
  };

  const validateCardNumber = (number: string) => {
    const digits = number.replace(/\s/g, '');
    if (digits.length !== 16) return false;
    
    // Luhn algorithm for credit card validation
    let sum = 0;
    let shouldDouble = false;
    
    // Loop through values starting from the rightmost digit
    for (let i = digits.length - 1; i >= 0; i--) {
      let digit = parseInt(digits.charAt(i));
      
      if (shouldDouble) {
        digit *= 2;
        if (digit > 9) digit -= 9;
      }
      
      sum += digit;
      shouldDouble = !shouldDouble;
    }
    
    return (sum % 10) === 0;
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate card number
    if (!validateCardNumber(cardNumber)) {
      toast.error("Numéro de carte invalide");
      return;
    }
    
    // Validate expiry date
    if (!validateExpiryDate(expiryDate)) {
      toast.error("Date d'expiration invalide");
      return;
    }
    
    // Validate CVV
    if (cvv.length < 3) {
      toast.error("CVV invalide");
      return;
    }
    
    setLoading(true);
    
    // Simulate payment processing
    setTimeout(() => {
      setLoading(false);
      toast.success("Paiement accepté");
      // Generate a random order ID for demonstration purposes
      const orderId = `ORD-${Math.floor(Math.random() * 1000000)}`;
      onSuccess(orderId);
    }, 1500);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="cardName">Titulaire de la carte</Label>
        <Input
          id="cardName"
          placeholder="John Doe"
          value={cardName}
          onChange={e => setCardName(e.target.value)}
          required
        />
      </div>
      
      <div>
        <Label htmlFor="cardNumber">Numéro de carte</Label>
        <Input
          id="cardNumber"
          placeholder="1234 5678 9012 3456"
          value={cardNumber}
          onChange={handleCardNumberChange}
          required
        />
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
          />
        </div>
        <div className="w-1/2">
          <Label htmlFor="cvv">CVV</Label>
          <Input
            id="cvv"
            placeholder="123"
            value={cvv}
            onChange={e => setCvv(e.target.value.replace(/\D/g, '').slice(0, 3))}
            required
            type="password"
          />
        </div>
      </div>
      
      <Button 
        type="submit" 
        className="w-full mt-4 bg-red-800 hover:bg-red-700"
        disabled={loading}
      >
        {loading ? 'Traitement en cours...' : 'Payer'}
      </Button>
    </form>
  );
};

export default CreditCardForm;
