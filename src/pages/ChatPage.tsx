
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Paperclip, X, User, Bot, Smile } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { clientChatAPI } from '@/services/chatAPI';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import UserAvatar from '@/components/user/UserAvatar';
import FileUploadButton from '@/components/chat/FileUploadButton';
import FilePreview from '@/components/chat/FilePreview';
import { chatFilesAPI } from '@/services/chatFilesAPI';
import data from '@emoji-mart/data';
import Picker from '@emoji-mart/react';

interface Message {
  id: string;
  senderId: string;
  content: string;
  timestamp: string;
  read: boolean;
  isSystemMessage?: boolean;
  isAdminReply?: boolean;
  fileAttachment?: {
    filename: string;
    originalName: string;
    mimetype: string;
    size: number;
    path: string;
    url: string;
  };
}

interface Conversation {
  id: string;
  messages: Message[];
  participants: string[];
  type: string;
  clientInfo?: any;
}

const ChatPage: React.FC = () => {
  const { user } = useAuth();
  const [message, setMessage] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [isEmojiPickerOpen, setIsEmojiPickerOpen] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const queryClient = useQueryClient();

  const toggleEmojiPicker = () => {
    setIsEmojiPickerOpen(!isEmojiPickerOpen);
  };

  const { data: conversation, isLoading, error } = useQuery<Conversation>({
    queryKey: ['clientConversation'],
    queryFn: async () => {
      if (!user) throw new Error('Utilisateur non authentifié');
      const response = await clientChatAPI.getServiceChat();
      return response.data;
    },
    refetchOnMount: true,
    refetchOnReconnect: true,
    refetchInterval: 3000,
  });

  // Mutation pour envoyer un message
  const sendMessageMutation = useMutation({
    mutationFn: async (messageText: string) => {
      if (!user) throw new Error('Utilisateur non authentifié');
      if (!conversation?.id) throw new Error('Conversation ID manquante');
      return clientChatAPI.sendServiceMessage(messageText);
    },
    onSuccess: () => {
      setMessage('');
      queryClient.invalidateQueries({ queryKey: ['clientConversation'] });
    },
    onError: (error) => {
      console.error('Erreur lors de l\'envoi du message:', error);
      toast.error('Erreur lors de l\'envoi du message');
    }
  });

  // Mutation pour l'upload de fichiers
  const uploadFileMutation = useMutation({
    mutationFn: async ({ file, messageText }: { file: File; messageText?: string }) => {
      if (!user) throw new Error('Utilisateur non authentifié');
      if (!conversation?.id) throw new Error('Conversation ID manquante');
      return chatFilesAPI.uploadServiceFile(conversation.id, file, messageText);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clientConversation'] });
      toast.success('Fichier envoyé avec succès');
    },
    onError: (error) => {
      console.error('Erreur lors de l\'upload du fichier:', error);
      toast.error('Erreur lors de l\'envoi du fichier');
    }
  });

  // Mutation pour supprimer un fichier
  const deleteFileMutation = useMutation({
    mutationFn: async ({ messageId, conversationId }: { messageId: string; conversationId: string }) => {
      return chatFilesAPI.deleteFile(messageId, conversationId, 'service');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clientConversation'] });
      toast.success('Fichier supprimé avec succès');
    },
    onError: (error) => {
      console.error('Erreur lors de la suppression du fichier:', error);
      toast.error('Erreur lors de la suppression du fichier');
    }
  });

  // Mutation pour marquer les messages comme lus
  const markAsReadMutation = useMutation({
    mutationFn: async ({ messageId, conversationId }: { messageId: string; conversationId: string }) => {
      return clientChatAPI.markAsRead(messageId, conversationId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clientConversation'] });
    }
  });

  // Effet pour marquer les messages comme lus lors de l'ouverture du chat
  useEffect(() => {
    if (isOpen && conversation?.messages) {
      const unreadMessages = conversation.messages.filter(msg => !msg.read && msg.senderId !== user?.id && !msg.isSystemMessage);
      unreadMessages.forEach(msg => {
        if (conversation.id) {
          markAsReadMutation.mutate({ messageId: msg.id, conversationId: conversation.id });
        }
      });
    }
  }, [isOpen, conversation, user, markAsReadMutation]);

  // Effet pour scroller vers le bas lors de la réception de nouveaux messages
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [conversation?.messages]);

  // Gestionnaire d'envoi de message
  const handleSendMessage = () => {
    if (!message.trim()) return;
    sendMessageMutation.mutate(message);
  };

  // Gestionnaire de sélection de fichier
  const handleFileSelect = (file: File) => {
    uploadFileMutation.mutate({ file, messageText: `Fichier partagé par ${user?.nom}` });
  };

  // Gestionnaire de suppression de fichier
  const handleFileDelete = (messageId: string) => {
    if (!conversation?.id) return;
    
    deleteFileMutation.mutate({
      messageId,
      conversationId: conversation.id
    });
  };

  // Gestionnaire de sélection d'emoji
  const handleEmojiSelect = (emoji: any) => {
    setMessage((prev) => prev + emoji.native);
  };

  // Formater la date et l'heure
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const diffDays = Math.floor(diff / (1000 * 3600 * 24));

    if (diffDays === 0) {
      return format(date, 'HH:mm', { locale: fr });
    } else if (diffDays === 1) {
      return `Hier à ${format(date, 'HH:mm', { locale: fr })}`;
    } else if (diffDays < 7) {
      return format(date, 'EEEE à HH:mm', { locale: fr });
    } else {
      return format(date, 'dd/MM/yyyy à HH:mm', { locale: fr });
    }
  };

  const activeConversation = conversation;

  return (
    <div className="flex flex-col h-screen bg-gray-50 dark:bg-gray-900">
      {/* En-tête */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-4">
        <div className="container mx-auto flex items-center justify-between">
          <h1 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            Service Client
          </h1>
          <Button variant="outline" size="sm" onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? 'Fermer' : 'Ouvrir'} le Chat
          </Button>
        </div>
      </div>

      {/* Corps principal */}
      <div className="container mx-auto flex-1 p-4">
        {error && (
          <div className="text-red-500">
            Erreur lors du chargement de la conversation.
          </div>
        )}

        {isLoading && (
          <div className="text-gray-500 dark:text-gray-400">
            Chargement de la conversation...
          </div>
        )}

        {activeConversation && isOpen ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col h-full"
          >
            {/* Zone d'affichage des messages */}
            <ScrollArea className="flex-1 mb-4">
              <div className="space-y-3">
                {activeConversation.messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex items-start space-x-2 ${msg.senderId === user?.id ? 'flex-row-reverse space-x-reverse' : ''}`}
                  >
                    {/* Avatar de l'expéditeur */}
                    <div className="flex-shrink-0">
                      {msg.senderId === user?.id ? (
                        <UserAvatar user={user} size="sm" />
                      ) : (
                        <Avatar className="w-6 h-6">
                          <AvatarFallback className="bg-blue-100">
                            <Bot className="h-3 w-3 text-blue-600" />
                          </AvatarFallback>
                        </Avatar>
                      )}
                    </div>

                    <div className="max-w-[80%]">
                      {/* Bulle de message */}
                      <div
                        className={`p-3 rounded-lg text-sm ${msg.isSystemMessage
                          ? 'bg-gray-200 text-gray-700'
                          : msg.senderId === user?.id
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-100'
                          }`}
                      >
                        {msg.content}
                        {/* Horodatage du message */}
                        <p className={`text-xs mt-1 ${msg.isSystemMessage
                          ? 'text-gray-500'
                          : msg.senderId === user?.id
                            ? 'text-blue-100'
                            : 'text-gray-500 dark:text-gray-400'
                          }`}>
                          {formatDate(msg.timestamp)}
                        </p>
                      </div>

                      {/* Affichage des fichiers attachés avec possibilité de suppression pour l'expéditeur */}
                      {msg.fileAttachment && (
                        <div className="mt-2">
                          <FilePreview 
                            attachment={msg.fileAttachment}
                            canDelete={msg.senderId === user?.id}
                            onDelete={() => handleFileDelete(msg.id)}
                          />
                        </div>
                      )}
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>
            </ScrollArea>

            {/* Zone de saisie */}
            <div className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 p-4">
              <div className="flex items-center space-x-2">
                <FileUploadButton
                  onFileSelect={handleFileSelect}
                  accept="*/*"
                  maxSize={50}
                  disabled={uploadFileMutation.isPending}
                />
                <div className="relative flex-1">
                  <Input
                    placeholder="Votre message..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleSendMessage();
                      }
                    }}
                    className="pr-10"
                  />
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={toggleEmojiPicker}
                    className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 w-8"
                  >
                    <Smile className="h-4 w-4" />
                  </Button>
                </div>
                <Button
                  onClick={handleSendMessage}
                  disabled={sendMessageMutation.isPending}
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
              {isEmojiPickerOpen && (
                <div className="absolute bottom-20 right-0">
                  <Picker data={data} onEmojiSelect={handleEmojiSelect} theme="light" />
                </div>
              )}
            </div>
          </motion.div>
        ) : (
          <div className="text-center text-gray-500 dark:text-gray-400">
            {activeConversation ? 'Chat fermé.' : 'Aucune conversation active.'}
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatPage;
