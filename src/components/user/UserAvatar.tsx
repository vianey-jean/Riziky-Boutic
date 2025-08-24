
import React from 'react';
import AnimatedUserAvatar from './AnimatedUserAvatar';
import { User } from '@/types/auth';

interface UserAvatarProps {
  user: User;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  showBorder?: boolean;
  showAnimation?: boolean;
}

const UserAvatar: React.FC<UserAvatarProps> = ({ 
  user, 
  size = 'md', 
  className = '', 
  showBorder = false,
  showAnimation = true 
}) => {
  return (
    <AnimatedUserAvatar 
      user={user}
      size={size}
      className={className}
      showAnimation={showAnimation}
    />
  );
};

export default UserAvatar;
