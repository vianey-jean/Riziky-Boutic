
import React from 'react';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { CreditCard, CreditCardIcon, Banknote } from 'lucide-react';
import visaLogo from '@/assets/visa.png';
import mastercardLogo from '@/assets/mastercard.png';
import paypalLogo from '@/assets/paypal.png';
import applepayLogo from '@/assets/applepay.png';

interface PaymentMethodsProps {
  selectedMethod: string;
  onMethodChange: (method: string) => void;
  isDisabled?: boolean;
}

const PaymentMethods: React.FC<PaymentMethodsProps> = ({ 
  selectedMethod, 
  onMethodChange,
  isDisabled = false 
}) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h2 className="text-xl font-semibold mb-4">Mode de paiement</h2>
      
      <RadioGroup value={selectedMethod} onValueChange={onMethodChange} disabled={isDisabled}>
        <div className="flex flex-col space-y-3">
          <div className={`flex items-center space-x-2 rounded-md border p-3 ${selectedMethod === 'card' ? 'border-primary bg-primary/5' : ''}`}>
            <RadioGroupItem value="card" id="card" />
            <Label htmlFor="card" className="flex-grow cursor-pointer flex items-center">
              <CreditCard className="mr-2 h-4 w-4" />
              <span>Carte bancaire</span>
            </Label>
            <div className="flex space-x-1">
              <img src={visaLogo} alt="Visa" className="h-6" />
              <img src={mastercardLogo} alt="Mastercard" className="h-6" />
            </div>
          </div>

          <div className={`flex items-center space-x-2 rounded-md border p-3 ${selectedMethod === 'paypal' ? 'border-primary bg-primary/5' : ''}`}>
            <RadioGroupItem value="paypal" id="paypal" />
            <Label htmlFor="paypal" className="flex-grow cursor-pointer">
              <div className="flex items-center">
                <img src={paypalLogo} alt="PayPal" className="h-5 mr-2" />
                <span>PayPal</span>
              </div>
            </Label>
          </div>
          
          <div className={`flex items-center space-x-2 rounded-md border p-3 ${selectedMethod === 'applepay' ? 'border-primary bg-primary/5' : ''}`}>
            <RadioGroupItem value="applepay" id="applepay" />
            <Label htmlFor="applepay" className="flex-grow cursor-pointer">
              <div className="flex items-center">
                <img src={applepayLogo} alt="Apple Pay" className="h-5 mr-2" />
                <span>Apple Pay</span>
              </div>
            </Label>
          </div>
          
          <div className={`flex items-center space-x-2 rounded-md border p-3 ${selectedMethod === 'cash' ? 'border-primary bg-primary/5' : ''}`}>
            <RadioGroupItem value="cash" id="cash" />
            <Label htmlFor="cash" className="flex-grow cursor-pointer flex items-center">
              <Banknote className="mr-2 h-4 w-4" />
              <span>Paiement à la livraison</span>
            </Label>
          </div>
        </div>
      </RadioGroup>

      {selectedMethod === 'card' && (
        <div className="mt-4 text-sm text-muted-foreground">
          <p>Vous serez redirigé vers notre page de paiement sécurisé</p>
        </div>
      )}
      
      {selectedMethod === 'paypal' && (
        <div className="mt-4 text-sm text-muted-foreground">
          <p>Vous serez redirigé vers PayPal pour finaliser votre paiement</p>
        </div>
      )}
      
      {selectedMethod === 'applepay' && (
        <div className="mt-4 text-sm text-muted-foreground">
          <p>Paiement sécurisé avec Apple Pay</p>
        </div>
      )}
      
      {selectedMethod === 'cash' && (
        <div className="mt-4 text-sm text-muted-foreground">
          <p>Vous paierez à la livraison. Préparez le montant exact si possible.</p>
        </div>
      )}
    </div>
  );
};

export default PaymentMethods;
