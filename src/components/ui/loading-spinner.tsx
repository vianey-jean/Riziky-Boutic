import React from 'react';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  overlay?: boolean;
  text?: string;
}

const LoadingSpinner = ({ 
  size = 'md', 
  className = '', 
  overlay = false,
  text
}: LoadingSpinnerProps) => {
  const sizeClasses = {
    sm: 'w-5 h-5',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
  };

  if (overlay) {
    return (
      <div className="fixed inset-0 bg-black/50 z-50 flex flex-col justify-center items-center">
        <div className={`animate-spin rounded-full border-4 border-gray-200 border-t-4 border-t-primary ${sizeClasses[size]}`}></div>
        {text && <p className="mt-4 text-white font-medium">{text}</p>}
      </div>
    );
  }

  return (
    <div className={`flex flex-col justify-center items-center ${className}`}>
      <div className={`animate-spin rounded-full border-4 border-gray-200 border-t-4 border-t-primary ${sizeClasses[size]}`}></div>
      {text && <p className="mt-2 text-sm text-muted-foreground">{text}</p>}
    </div>
  );
};

export default LoadingSpinner;