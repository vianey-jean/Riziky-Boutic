
import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Clock, Wifi, WifiOff } from 'lucide-react';

interface UserStatusCardProps {
  user: {
    id: string;
    nom: string;
    email: string;
    isOnline?: boolean;
    lastSeen?: string;
  };
  isSelected?: boolean;
  onClick?: () => void;
  showActions?: boolean;
  children?: React.ReactNode;
}

const UserStatusCard: React.FC<UserStatusCardProps> = ({ 
  user, 
  isSelected = false, 
  onClick, 
  showActions = false,
  children 
}) => {
  const getTimeAgo = (dateString?: string) => {
    if (!dateString) return "inconnu";
    
    const date = new Date(dateString);
    const diff = Math.floor((new Date().getTime() - date.getTime()) / 60000);
    
    if (diff < 1) return "à l'instant";
    if (diff < 60) return `il y a ${diff} min`;
    
    const hours = Math.floor(diff / 60);
    if (hours < 24) return `il y a ${hours}h`;
    
    const days = Math.floor(hours / 24);
    return `il y a ${days}j`;
  };

  return (
    <Card 
      className={`p-4 cursor-pointer transition-all duration-200 hover:shadow-md ${
        isSelected ? 'ring-2 ring-blue-500 bg-blue-50' : 'hover:bg-gray-50'
      }`}
      onClick={onClick}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="relative">
            <Avatar className="w-12 h-12">
              <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold">
                {user.nom.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white flex items-center justify-center ${
              user.isOnline ? 'bg-green-500' : 'bg-gray-400'
            }`}>
              {user.isOnline ? (
                <Wifi className="h-2 w-2 text-white" />
              ) : (
                <WifiOff className="h-2 w-2 text-white" />
              )}
            </div>
          </div>
          
          <div className="flex-1">
            <h3 className="font-semibold text-gray-900">{user.nom}</h3>
            <p className="text-sm text-gray-500">{user.email}</p>
            <div className="flex items-center space-x-2 mt-1">
              <Badge variant={user.isOnline ? "default" : "secondary"} className="text-xs">
                {user.isOnline ? (
                  <div className="flex items-center space-x-1">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                    <span>En ligne</span>
                  </div>
                ) : (
                  <div className="flex items-center space-x-1">
                    <Clock className="h-3 w-3" />
                    <span>{getTimeAgo(user.lastSeen)}</span>
                  </div>
                )}
              </Badge>
            </div>
          </div>
        </div>
        
        {showActions && children && (
          <div className="flex items-center space-x-2">
            {children}
          </div>
        )}
      </div>
    </Card>
  );
};

export default UserStatusCard;
