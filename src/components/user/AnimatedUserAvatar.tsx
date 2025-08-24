
import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { User } from '@/types/auth';

interface AnimatedUserAvatarProps {
  user: User;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  showAnimation?: boolean;
}

const AnimatedUserAvatar: React.FC<AnimatedUserAvatarProps> = ({ 
  user, 
  size = 'md', 
  className = '', 
  showAnimation = true 
}) => {
  const sizeClasses = {
    sm: 'h-8 w-8',
    md: 'h-10 w-10',
    lg: 'h-16 w-16',
    xl: 'h-24 w-24'
  };

  const animationSizeClasses = {
    sm: 'h-12 w-12',
    md: 'h-14 w-14',
    lg: 'h-20 w-20',
    xl: 'h-28 w-28'
  };

  const profileImageUrl = user.profileImage ? 
    `${import.meta.env.VITE_API_BASE_URL}${user.profileImage}` : 
    null;

  const get3DAvatar = (genre: string) => {
    if (genre === 'homme') {
      return '/placeholder.svg?height=100&width=100&text=👨';
    } else if (genre === 'femme') {
      return '/placeholder.svg?height=100&width=100&text=👩';
    }
    return '/placeholder.svg?height=100&width=100&text=👤';
  };

  const fallbackImageUrl = get3DAvatar(user.genre || 'autre');

  if (!showAnimation) {
    return (
      <Avatar className={`${sizeClasses[size]} ${className}`}>
        {profileImageUrl ? (
          <AvatarImage 
            src={profileImageUrl} 
            alt={`Photo de profil de ${user.nom}`}
            onError={(e) => {
              (e.target as HTMLImageElement).src = fallbackImageUrl;
            }}
          />
        ) : (
          <AvatarImage 
            src={fallbackImageUrl} 
            alt={`Avatar 3D ${user.genre || 'default'}`}
          />
        )}
        <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold">
          {user.nom?.charAt(0)?.toUpperCase() || 'U'}
        </AvatarFallback>
      </Avatar>
    );
  }

  return (
    <div className={`relative ${className}`}>
      {/* Animation ring container */}
      <div className={`${animationSizeClasses[size]} rounded-full relative flex items-center justify-center`}>
        {/* Animated gradient ring */}
        <div className="absolute inset-0 rounded-full animate-spin-slow">
          <div className="w-full h-full rounded-full bg-gradient-to-r from-pink-500 via-purple-500 via-blue-500 via-green-500 via-yellow-500 via-red-500 to-pink-500 animate-gradient-shift p-0.5">
            <div className="w-full h-full rounded-full bg-white dark:bg-gray-900"></div>
          </div>
        </div>
        
        {/* Pulsing outer glow */}
        <div className="absolute inset-0 rounded-full bg-gradient-to-r from-pink-400 to-purple-400 opacity-75 animate-pulse blur-sm"></div>
        
        {/* Avatar container */}
        <div className="relative z-10">
          <Avatar className={`${sizeClasses[size]} ring-2 ring-white dark:ring-gray-900 shadow-lg`}>
            {profileImageUrl ? (
              <AvatarImage 
                src={profileImageUrl} 
                alt={`Photo de profil de ${user.nom}`}
                onError={(e) => {
                  (e.target as HTMLImageElement).src = fallbackImageUrl;
                }}
              />
            ) : (
              <AvatarImage 
                src={fallbackImageUrl} 
                alt={`Avatar 3D ${user.genre || 'default'}`}
              />
            )}
            <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold">
              {user.nom?.charAt(0)?.toUpperCase() || 'U'}
            </AvatarFallback>
          </Avatar>
        </div>
      </div>
    </div>
  );
};

export default AnimatedUserAvatar;
