
import React from 'react';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  overlay?: boolean;
  text?: string;
  variant?: 'default' | 'elegant' | 'dots' | 'pulse' | 'logo' | 'luxury';
}

const LoadingSpinner = ({ 
  size = 'md', 
  className = '', 
  overlay = false,
  text,
  variant = 'luxury'
}: LoadingSpinnerProps) => {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-16 h-16',
    lg: 'w-24 h-24',
    xl: 'w-32 h-32',
  };

  const renderSpinner = () => {
    switch (variant) {
      case 'logo':
        return (
          <div className="relative flex flex-col items-center">
            <div className={`${sizeClasses[size]} relative`}>
              <img 
                src="/images/logo/logo.png" 
                alt="Riziky Boutique" 
                className="w-full h-full object-contain animate-pulse"
              />
              <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-500/20 to-purple-500/20 animate-spin"></div>
            </div>
            <div className="mt-4 flex space-x-1">
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
              <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
              <div className="w-2 h-2 bg-blue-700 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
            </div>
          </div>
        );
      
      case 'luxury':
        return (
          <div className="relative flex flex-col items-center">
            {/* Spinner principal avec effet de luxe */}
            <div className={`${sizeClasses[size]} relative`}>
              {/* Anneau extérieur avec dégradé doré-bleu */}
              <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-600 via-blue-500 to-indigo-600 animate-spin p-1">
                <div className="w-full h-full rounded-full bg-white dark:bg-gray-900"></div>
              </div>
              
              {/* Anneau intermédiaire */}
              <div className="absolute inset-2 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 animate-spin p-1" style={{ animationDirection: 'reverse', animationDuration: '2s' }}>
                <div className="w-full h-full rounded-full bg-white dark:bg-gray-900"></div>
              </div>
              
              {/* Centre avec effet brillant */}
              <div className="absolute inset-1/3 rounded-full bg-gradient-to-br from-blue-400 via-blue-500 to-blue-600 shadow-lg">
                <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-white/30 to-transparent animate-pulse"></div>
              </div>
              
              {/* Particules flottantes */}
              <div className="absolute -top-1 -left-1 w-3 h-3 bg-blue-500 rounded-full animate-ping opacity-60"></div>
              <div className="absolute -bottom-1 -right-1 w-2 h-2 bg-cyan-400 rounded-full animate-ping opacity-70" style={{ animationDelay: '0.5s' }}></div>
              <div className="absolute top-1/2 -left-2 w-1.5 h-1.5 bg-indigo-500 rounded-full animate-ping opacity-50" style={{ animationDelay: '1s' }}></div>
            </div>
            
            {/* Effet de lueur */}
            <div className={`absolute ${sizeClasses[size]} rounded-full bg-blue-500/20 animate-pulse blur-md`}></div>
            
            {/* Indicateurs de progression élégants */}
            <div className="mt-6 flex space-x-1">
              <div className="w-3 h-1 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full animate-pulse"></div>
              <div className="w-3 h-1 bg-gradient-to-r from-blue-600 to-cyan-500 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
              <div className="w-3 h-1 bg-gradient-to-r from-cyan-500 to-indigo-500 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
            </div>
          </div>
        );
      
      case 'elegant':
        return (
          <div className="relative">
            <div className={`${sizeClasses[size]} animate-spin relative`}>
              {/* Anneau extérieur */}
              <div className="absolute inset-0 rounded-full border-4 border-blue-100 dark:border-blue-900/30"></div>
              {/* Anneau principal animé */}
              <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-blue-600 border-r-blue-500 shadow-lg"></div>
              {/* Anneau intérieur avec animation inverse */}
              <div className={`absolute ${size === 'sm' ? 'inset-1' : size === 'lg' ? 'inset-3' : size === 'xl' ? 'inset-4' : 'inset-2'} rounded-full border-2 border-blue-200 dark:border-blue-800 animate-spin shadow-inner`} 
                   style={{ animationDirection: 'reverse', animationDuration: '2s' }}></div>
              {/* Point central lumineux */}
              <div className="absolute inset-1/2 w-2 h-2 -translate-x-1/2 -translate-y-1/2 bg-blue-600 rounded-full shadow-lg animate-pulse"></div>
            </div>
            {/* Effet de lueur */}
            <div className={`absolute inset-0 ${sizeClasses[size]} rounded-full bg-blue-500/20 animate-ping`}></div>
          </div>
        );
      
      case 'dots':
        return (
          <div className="flex space-x-2">
            <div className="w-4 h-4 bg-blue-600 rounded-full animate-bounce shadow-lg"></div>
            <div className="w-4 h-4 bg-blue-500 rounded-full animate-bounce shadow-lg" style={{ animationDelay: '0.15s' }}></div>
            <div className="w-4 h-4 bg-blue-400 rounded-full animate-bounce shadow-lg" style={{ animationDelay: '0.3s' }}></div>
          </div>
        );
      
      case 'pulse':
        return (
          <div className={`${sizeClasses[size]} relative`}>
            <div className="absolute inset-0 bg-blue-600 rounded-full animate-ping opacity-30 shadow-xl"></div>
            <div className="absolute inset-2 bg-blue-500 rounded-full animate-ping opacity-50 shadow-lg" style={{ animationDelay: '0.3s' }}></div>
            <div className="absolute inset-4 bg-blue-600 rounded-full shadow-lg"></div>
          </div>
        );
      
      default:
        return (
          <div className={`animate-spin rounded-full border-4 border-blue-200 border-t-blue-600 shadow-lg ${sizeClasses[size]}`}></div>
        );
    }
  };

  if (overlay) {
    return (
      <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex flex-col justify-center items-center">
        <div className="bg-white/95 dark:bg-gray-900/95 rounded-3xl p-12 shadow-2xl border border-gray-200/50 dark:border-gray-700/50 max-w-sm mx-auto backdrop-blur-xl">
          <div className="flex flex-col items-center space-y-8">
            {renderSpinner()}
            {text && (
              <div className="text-center">
                <p className="text-gray-700 dark:text-gray-300 font-semibold text-lg mb-2">{text}</p>
                <div className="w-20 h-1 bg-gradient-to-r from-blue-500 via-cyan-500 to-indigo-500 rounded-full mx-auto"></div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`flex flex-col justify-center items-center ${className}`}>
      {renderSpinner()}
      {text && (
        <div className="mt-8 text-center">
          <p className="text-gray-600 dark:text-gray-400 font-medium text-lg mb-2">{text}</p>
          <div className="w-16 h-1 bg-gradient-to-r from-blue-500 via-cyan-500 to-indigo-500 rounded-full mx-auto"></div>
        </div>
      )}
    </div>
  );
};

export default LoadingSpinner;
