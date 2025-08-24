
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Edit, Trash2, MoreVertical, Smile, Clock } from 'lucide-react';
import data from '@emoji-mart/data';
import Picker from '@emoji-mart/react';
import UserAvatar from '@/components/user/UserAvatar';
import { useAuth } from '@/contexts/AuthContext';

interface Message {
  id: string;
  senderId: string;
  content: string;
  timestamp: string;
  isEdited?: boolean;
  isAutoReply?: boolean;
}

interface ChatMessageProps {
  message: Message;
  isOwn: boolean;
  isEditing: boolean;
  editText: string;
  currentUserId?: string;
  onEdit: (messageId: string, content: string) => void;
  onDelete: (messageId: string) => void;
  onStartEdit: (message: Message) => void;
  onCancelEdit: () => void;
  onEditTextChange: (text: string) => void;
  onEmojiSelect: (emoji: any) => void;
  isPending?: boolean;
  senderUser?: any; // Utilisateur qui a envoyé le message
}

const ChatMessage: React.FC<ChatMessageProps> = ({
  message,
  isOwn,
  isEditing,
  editText,
  onEdit,
  onDelete,
  onStartEdit,
  onCancelEdit,
  onEditTextChange,
  onEmojiSelect,
  isPending = false,
  senderUser
}) => {
  const { user: currentUser } = useAuth();

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('fr-FR', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleEdit = () => {
    if (!editText.trim()) return;
    onEdit(message.id, editText);
  };

  const handleDelete = () => {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce message ?')) {
      onDelete(message.id);
    }
  };

  if (isEditing) {
    return (
      <div className={`flex items-start space-x-3 ${isOwn ? 'flex-row-reverse space-x-reverse' : ''}`}>
        {/* Avatar de l'utilisateur */}
        {senderUser && (
          <div className="flex-shrink-0">
            <UserAvatar user={senderUser} size="sm" showAnimation={false} />
          </div>
        )}
        
        <div className="w-full max-w-[80%] bg-gradient-to-r from-blue-50 to-purple-50 p-4 rounded-lg border border-blue-200 shadow-sm">
          <div className="flex items-center space-x-2">
            <Input 
              value={editText}
              onChange={(e) => onEditTextChange(e.target.value)}
              className="flex-1 border-blue-300 focus:border-blue-500"
              placeholder="Modifier votre message..."
            />
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" size="icon" className="border-blue-300 hover:bg-blue-50">
                  <Smile className="h-4 w-4 text-blue-600" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-full p-0" side="top">
                <Picker 
                  data={data}
                  onEmojiSelect={onEmojiSelect}
                  theme="light"
                />
              </PopoverContent>
            </Popover>
            <Button 
              onClick={handleEdit} 
              className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white shadow-md"
              disabled={isPending}
              size="sm"
            >
              Enregistrer
            </Button>
            <Button 
              variant="outline" 
              onClick={onCancelEdit} 
              className="border-gray-300 hover:bg-gray-50"
              size="sm"
            >
              Annuler
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`flex items-start space-x-3 ${isOwn ? 'flex-row-reverse space-x-reverse' : ''}`}>
      {/* Avatar de l'utilisateur */}
      {senderUser && (
        <div className="flex-shrink-0">
          <UserAvatar user={senderUser} size="sm" />
        </div>
      )}
      
      <div className={`max-w-[70%] relative group`}>
        <div className={`p-4 rounded-2xl shadow-md transition-all duration-200 hover:shadow-lg ${
          isOwn 
            ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white'
            : 'bg-gradient-to-r from-gray-100 to-gray-200 text-gray-800 border border-gray-300'
        }`}>
          {isOwn && !message.isAutoReply && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity h-6 w-6 text-white hover:bg-white/20"
                >
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem onClick={() => onStartEdit(message)} className="flex items-center">
                  <Edit className="mr-2 h-4 w-4" /> 
                  Modifier
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem 
                  onClick={handleDelete}
                  className="text-red-600 focus:text-red-600"
                >
                  <Trash2 className="mr-2 h-4 w-4" /> 
                  Supprimer
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
          
          {/* Nom de l'utilisateur (si ce n'est pas son propre message) */}
          {!isOwn && senderUser && (
            <div className="text-xs font-medium text-gray-600 mb-1">
              {senderUser.nom} {senderUser.prenom}
            </div>
          )}
          
          <p className="break-words">{message.content}</p>
          
          <div className="flex items-center justify-between mt-2 space-x-2">
            <div className="flex items-center space-x-1">
              <Clock className="h-3 w-3 opacity-70" />
              <p className={`text-xs opacity-80 ${isOwn ? 'text-blue-100' : 'text-gray-500'}`}>
                {formatTime(message.timestamp)}
              </p>
            </div>
            {message.isEdited && (
              <p className={`text-xs opacity-80 ${isOwn ? 'text-blue-100' : 'text-gray-500'}`}>
                (modifié)
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatMessage;
