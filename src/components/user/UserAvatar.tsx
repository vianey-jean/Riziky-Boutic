
import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { User } from '@/types/auth';

interface UserAvatarProps {
  user: User;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  showBorder?: boolean;
}

const UserAvatar: React.FC<UserAvatarProps> = ({ 
  user, 
  size = 'md', 
  className = '', 
  showBorder = false 
}) => {
  const sizeClasses = {
    sm: 'h-8 w-8',
    md: 'h-10 w-10',
    lg: 'h-16 w-16',
    xl: 'h-24 w-24'
  };

  const borderClass = showBorder ? 'ring-2 ring-white shadow-lg' : '';

  // Générer l'avatar 3D basé sur le genre
  const get3DAvatar = (genre: string) => {
    // Utiliser des avatars par défaut depuis des CDN publics ou des assets locaux
    if (genre === 'homme') {
      return '/placeholder.svg?height=100&width=100&text=👨';
    } else if (genre === 'femme') {
      return '/placeholder.svg?height=100&width=100&text=👩';
    }
    return '/placeholder.svg?height=100&width=100&text=👤';
  };

  const profileImageUrl = user.profileImage ? 
    `${import.meta.env.VITE_API_BASE_URL}${user.profileImage}` : 
    null;

  const fallbackImageUrl = get3DAvatar(user.genre || 'autre');

  return (
    <Avatar className={`${sizeClasses[size]} ${borderClass} ${className}`}>
      {profileImageUrl ? (
        <AvatarImage 
          src={profileImageUrl} 
          alt={`Photo de profil de ${user.nom}`}
          onError={(e) => {
            // Si l'image de profil ne se charge pas, utiliser l'avatar 3D
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
};

export default UserAvatar;
