
import React from 'react';
import visa from "@/assets/visa.png"; 
import applepay from "@/assets/applepay.png"; 
import mastercard from "@/assets/mastercard.png"; 
import american from "@/assets/american.png"; 
import paypal from "@/assets/paypal.png";

interface PaymentBadgesProps {
  hidePrompts?: boolean;
}

const PaymentBadges: React.FC<PaymentBadgesProps> = ({ hidePrompts = false }) => {
  if (hidePrompts) return null;

  return (
    <div className="bg-white dark:bg-neutral-900 py-6 border-t border-b border-neutral-200 dark:border-neutral-800">
      <div className="container mx-auto px-4">
        <div className="flex flex-wrap items-center justify-center gap-8">
          <img src={visa} alt="Visa" className="h-8 opacity-70 hover:opacity-100 transition-opacity" />
          <img src={mastercard} alt="Mastercard" className="h-8 opacity-70 hover:opacity-100 transition-opacity" />
          <img src={american} alt="American Express" className="h-8 opacity-70 hover:opacity-100 transition-opacity" />
          <img src={paypal} alt="PayPal" className="h-8 opacity-70 hover:opacity-100 transition-opacity" />
          <img src={applepay} alt="Apple Pay" className="h-8 opacity-70 hover:opacity-100 transition-opacity" />
        </div>
      </div>
    </div>
  );
};

export default PaymentBadges;
