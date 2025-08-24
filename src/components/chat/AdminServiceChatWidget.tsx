import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, Send, User, Bot, Minus, Smile } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { clientChatAPI } from '@/services/chatAPI';
import { useAuth } from '@/contexts/AuthContext';
import { useLocation } from 'react-router-dom';
import data from '@emoji-mart/data';
import Picker from '@emoji-mart/react';
import { toast } from 'sonner';
import UserAvatar from '@/components/user/UserAvatar';

interface Message {
  id: string;
  senderId: string;
  content: string;
  timestamp: string;
  read: boolean;
  isSystemMessage?: boolean;
  isAdminReply?: boolean;
}

interface ServiceConversation {
  messages: Message[];
  participants: string[];
  type: string;
  clientInfo?: any;
  unreadCount?: number;
}

const AdminServiceChatWidget: React.FC = () => {
  const { user } = useAuth();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [message, setMessage] = useState('');
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const queryClient = useQueryClient();
  const [previousUnreadCount, setPreviousUnreadCount] = useState(0);

  // Persister l'état fermé dans localStorage
  const WIDGET_CLOSED_KEY = 'adminChatWidgetClosed';

  // Vérifier si on est sur la page admin service client
  const isOnAdminServicePage = location.pathname.includes('/admin/service-client');

  // Ne pas afficher le widget si on est sur la page admin ou si ce n'est pas l'admin service client
  const shouldShowWidget = user?.email === "service.client@example.com" && !isOnAdminServicePage;

  // Récupérer toutes les conversations de service client
  const { data: conversations } = useQuery<{[key: string]: ServiceConversation}>({
    queryKey: ['adminServiceConversations'],
    queryFn: async () => {
      try {
        const response = await clientChatAPI.getServiceConversations();
        return response.data || {};
      } catch (error) {
        console.error('Erreur lors du chargement des conversations:', error);
        return {};
      }
    },
    enabled: shouldShowWidget,
    refetchInterval: 3000,
  });

  // Mutation pour envoyer une réponse
  const sendReplyMutation = useMutation({
    mutationFn: async ({ conversationId, messageText }: { conversationId: string; messageText: string }) => {
      return clientChatAPI.sendServiceReply(conversationId, messageText);
    },
    onSuccess: () => {
      setMessage('');
      queryClient.invalidateQueries({ queryKey: ['adminServiceConversations'] });
    },
    onError: (error) => {
      console.error('Erreur lors de l\'envoi de la réponse:', error);
      toast.error('Erreur lors de l\'envoi de la réponse');
    }
  });

  // Mutation pour marquer les messages comme lus
  const markAsReadMutation = useMutation({
    mutationFn: async ({ messageId, conversationId }: { messageId: string; conversationId: string }) => {
      return clientChatAPI.markAsRead(messageId, conversationId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminServiceConversations'] });
    }
  });

  // Calculer le nombre total de messages non lus
  const totalUnreadCount = conversations ? Object.values(conversations).reduce(
    (total, conv) => total + (conv.unreadCount || 0), 0
  ) : 0;

  // Marquer les messages comme lus quand le widget est ouvert
  useEffect(() => {
    if (isOpen && !isMinimized && activeConversationId && conversations && user) {
      const activeConversation = conversations[activeConversationId];
      if (activeConversation?.messages) {
        const unreadMessages = activeConversation.messages.filter(
          (msg: Message) => !msg.read && msg.senderId !== user.id && !msg.isSystemMessage
        );
        
        unreadMessages.forEach((msg: Message) => {
          markAsReadMutation.mutate({ messageId: msg.id, conversationId: activeConversationId });
        });
      }
    }
  }, [isOpen, isMinimized, activeConversationId, conversations, user]);

  // Vérifier l'état fermé au montage
  useEffect(() => {
    const isClosed = localStorage.getItem(WIDGET_CLOSED_KEY) === 'true';
    if (isClosed) {
      setIsOpen(false);
    }
  }, []);

  // Ouvrir automatiquement le widget quand il y a de nouveaux messages (seulement si pas fermé manuellement)
  useEffect(() => {
    const isClosed = localStorage.getItem(WIDGET_CLOSED_KEY) === 'true';
    
    if (totalUnreadCount > previousUnreadCount && totalUnreadCount > 0 && !isClosed) {
      setIsOpen(true);
      setIsMinimized(false);
    }
    setPreviousUnreadCount(totalUnreadCount);
  }, [totalUnreadCount, previousUnreadCount]);

  // Sélectionner automatiquement la première conversation avec des messages non lus
  useEffect(() => {
    if (conversations && !activeConversationId) {
      const conversationsArray = Object.entries(conversations);
      const unreadConversation = conversationsArray.find(([_, conv]) => (conv.unreadCount || 0) > 0);
      
      if (unreadConversation) {
        setActiveConversationId(unreadConversation[0]);
      } else if (conversationsArray.length > 0) {
        setActiveConversationId(conversationsArray[0][0]);
      }
    }
  }, [conversations, activeConversationId]);

  // Scroll vers le bas quand les messages changent
  useEffect(() => {
    if (messagesEndRef.current && isOpen && !isMinimized) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [conversations, activeConversationId, isOpen, isMinimized]);

  const handleSendMessage = () => {
    if (!message.trim() || !activeConversationId) return;
    sendReplyMutation.mutate({
      conversationId: activeConversationId,
      messageText: message
    });
  };

  const handleEmojiSelect = (emoji: any) => {
    setMessage((prev) => prev + emoji.native);
  };

  const handleCloseWidget = () => {
    setIsOpen(false);
    // Persister l'état fermé
    localStorage.setItem(WIDGET_CLOSED_KEY, 'true');
  };

  const handleOpenWidget = () => {
    setIsOpen(true);
    // Enlever l'état fermé
    localStorage.removeItem(WIDGET_CLOSED_KEY);
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('fr-FR', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (!shouldShowWidget) return null;

  const activeConversation = activeConversationId && conversations ? 
    conversations[activeConversationId] : null;

  const conversationsList = conversations ? Object.entries(conversations) : [];

  return (
    <>
      {/* Bouton flottant - déplacé à droite en rouge */}
      {!isOpen && (
        <motion.div
          className="fixed bottom-6 right-6 z-50"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <Button
            onClick={handleOpenWidget}
            className="rounded-full w-14 h-14 bg-red-600 hover:bg-red-700 shadow-lg"
          >
            <MessageCircle className="h-6 w-6" />
          </Button>
          
          {/* Badge de notification - n'afficher que s'il y a des messages non lus */}
          {totalUnreadCount > 0 && (
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ repeat: Infinity, duration: 2 }}
              className="absolute -top-1 -right-1 bg-blue-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center"
            >
              {totalUnreadCount}
            </motion.div>
          )}
        </motion.div>
      )}

      {/* Fenêtre de chat - déplacée à droite */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            className={`fixed bottom-6 right-6 z-50 ${
              isMinimized ? 'w-80 h-20' : 'w-80 h-96'
            }`}
          >
            <Card className="h-full flex flex-col shadow-xl">
              {/* En-tête */}
              <div className="bg-red-600 text-white p-4 rounded-t-lg">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                    <span className="font-medium">Admin Chat</span>
                  </div>
                  <div className="flex space-x-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setIsMinimized(!isMinimized)}
                      className="text-white hover:bg-red-700 p-1"
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleCloseWidget}
                      className="text-white hover:bg-red-700 p-1"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>

              {/* Contenu (seulement si pas minimisé) */}
              {!isMinimized && (
                <>
                  {/* Sélecteur de conversation */}
                  {conversationsList.length > 1 && (
                    <div className="p-2 border-b">
                      <Select value={activeConversationId || ''} onValueChange={setActiveConversationId}>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Sélectionner une conversation" />
                        </SelectTrigger>
                        <SelectContent>
                          {conversationsList.map(([convId, conv]) => (
                            <SelectItem key={convId} value={convId}>
                              <div className="flex items-center justify-between w-full">
                                <span>
                                  {conv.clientInfo?.nom} {conv.clientInfo?.prenom}
                                </span>
                                {(conv.unreadCount || 0) > 0 && (
                                  <span className="ml-2 bg-blue-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                                    {conv.unreadCount}
                                  </span>
                                )}
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  )}

                  {/* Messages */}
                  <ScrollArea className="flex-1 p-4">
                    <div className="space-y-3">
                      {activeConversation?.messages?.map((msg: Message) => (
                        <div
                          key={msg.id}
                          className={`flex items-start space-x-2 ${msg.senderId === user?.id ? 'flex-row-reverse space-x-reverse' : ''}`}
                        >
                          {/* Avatar de l'utilisateur */}
                          <div className="flex-shrink-0">
                            {msg.senderId === user?.id ? (
                              <UserAvatar user={user} size="sm" />
                            ) : activeConversation?.clientInfo ? (
                              <UserAvatar user={activeConversation.clientInfo} size="sm" />
                            ) : (
                              <Avatar className="w-6 h-6">
                                <AvatarFallback className="bg-blue-100">
                                  <User className="h-3 w-3 text-blue-600" />
                                </AvatarFallback>
                              </Avatar>
                            )}
                          </div>
                          
                          <div className="max-w-[80%]">
                            <div
                              className={`p-3 rounded-lg text-sm ${
                                msg.isSystemMessage
                                  ? 'bg-gray-200 text-gray-700'
                                  : msg.senderId === user?.id
                                  ? 'bg-red-600 text-white'
                                  : 'bg-gray-100 text-gray-800'
                              }`}
                            >
                              {msg.content}
                              <p className={`text-xs mt-1 ${
                                msg.isSystemMessage ? 'text-gray-500' :
                                msg.senderId === user?.id ? 'text-red-100' : 'text-gray-500'
                              }`}>
                                {formatTime(msg.timestamp)}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                      <div ref={messagesEndRef} />
                    </div>
                  </ScrollArea>

                  {/* Zone de saisie */}
                  <div className="p-4 border-t">
                    <div className="flex space-x-2">
                      <div className="relative flex-1">
                        <Input
                          value={message}
                          onChange={(e) => setMessage(e.target.value)}
                          placeholder="Répondre au client..."
                          onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                          className="pr-10"
                        />
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 w-8"
                            >
                              <Smile className="h-4 w-4" />
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-full p-0" side="top">
                            <Picker 
                              data={data} 
                              onEmojiSelect={handleEmojiSelect}
                              theme="light"
                            />
                          </PopoverContent>
                        </Popover>
                      </div>
                      <Button 
                        onClick={handleSendMessage}
                        size="sm"
                        className="bg-red-600 hover:bg-red-700"
                        disabled={sendReplyMutation.isPending}
                      >
                        <Send className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </>
              )}

              {/* Mode minimisé - Zone de saisie rapide */}
              {isMinimized && (
                <div className="flex-1 p-2 border-t">
                  <div className="flex space-x-2">
                    <Input
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Réponse rapide..."
                      onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                      className="text-sm"
                    />
                    <Button 
                      onClick={handleSendMessage}
                      size="sm"
                      className="bg-red-600 hover:bg-red-700"
                      disabled={sendReplyMutation.isPending}
                    >
                      <Send className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              )}
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default AdminServiceChatWidget;
