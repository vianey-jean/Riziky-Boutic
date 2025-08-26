
import React from 'react';
import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';

interface LuxuryButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'premium' | 'outline' | 'ghost';
  size?: 'sm' | 'default' | 'lg';
  loading?: boolean;
  children: React.ReactNode;
}

const LuxuryButton = React.forwardRef<HTMLButtonElement, LuxuryButtonProps>(
  ({ className, variant = 'default', size = 'default', loading, children, disabled, ...props }, ref) => {
    const variants = {
      default: 'luxury-button',
      premium: 'bg-premium-gradient text-white font-semibold shadow-glow-rose hover:shadow-luxury-lg',
      outline: 'border-2 border-luxury-rose text-luxury-rose hover:bg-luxury-rose hover:text-white',
      ghost: 'text-luxury-rose hover:bg-luxury-rose/10'
    };

    const sizes = {
      sm: 'py-2 px-4 text-sm',
      default: 'py-3 px-6',
      lg: 'py-4 px-8 text-lg'
    };

    return (
      <button
        ref={ref}
        className={cn(
          'rounded-lg font-semibold transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed',
          variants[variant],
          sizes[size],
          className
        )}
        disabled={disabled || loading}
        {...props}
      >
        {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        {children}
      </button>
    );
  }
);

LuxuryButton.displayName = 'LuxuryButton';

export { LuxuryButton };
