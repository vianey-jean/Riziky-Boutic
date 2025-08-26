
import React from 'react';
import { cn } from '@/lib/utils';

interface LuxuryCardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'premium' | 'elevated';
  children: React.ReactNode;
}

const LuxuryCard = React.forwardRef<HTMLDivElement, LuxuryCardProps>(
  ({ className, variant = 'default', children, ...props }, ref) => {
    const variants = {
      default: 'luxury-card',
      premium: 'luxury-card bg-gradient-to-br from-luxury-gold/5 to-luxury-rose/5 border-luxury-gold/20',
      elevated: 'luxury-card shadow-luxury-xl hover:shadow-premium'
    };

    return (
      <div
        ref={ref}
        className={cn(variants[variant], className)}
        {...props}
      >
        {children}
      </div>
    );
  }
);

LuxuryCard.displayName = 'LuxuryCard';

export { LuxuryCard };
