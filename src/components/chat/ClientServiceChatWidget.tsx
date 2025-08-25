import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, Send, User, Bot, Minus, Smile } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { clientChatAPI } from '@/services/chatAPI';
import { chatFilesAPI } from '@/services/chatFilesAPI';
import { useAuth } from '@/contexts/AuthContext';
import data from '@emoji-mart/data';
import Picker from '@emoji-mart/react';
import { toast } from 'sonner';
import UserAvatar from '@/components/user/UserAvatar';
import FileUploadButton from '@/components/chat/FileUploadButton';
import VoiceRecorder from '@/components/chat/VoiceRecorder';
import FileAttachment from '@/components/chat/FileAttachment';

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

const ClientServiceChatWidget: React.FC = () => {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [message, setMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const queryClient = useQueryClient();
  const [previousUnreadCount, setPreviousUnreadCount] = useState(0);

  // Persister l'état fermé dans localStorage
  const WIDGET_CLOSED_KEY = 'clientChatWidgetClosed';

  // Récupérer la conversation de service client
  const { data: conversation, isLoading } = useQuery({
    queryKey: ['serviceConversation'],
    queryFn: async () => {
      try {
        const response = await clientChatAPI.getServiceChat();
        return response.data;
      } catch (error) {
        console.error('Erreur lors du chargement de la conversation:', error);
        return null;
      }
    },
    enabled: !!user,
    refetchInterval: 3000,
  });

  // Récupérer les informations de l'admin service client
  const { data: serviceClientInfo } = useQuery({
    queryKey: ['serviceClientInfo'],
    queryFn: async () => {
      try {
        const response = await clientChatAPI.getServiceAdmins();
        const serviceAdmin = response.data?.find((admin: any) => admin.email === "service.client@example.com");
        return serviceAdmin || {
          id: 'service-client',
          nom: 'Service',
          prenom: 'Client',
          email: 'service.client@example.com',
          profileImage: null,
          genre: 'autre'
        };
      } catch (error) {
        console.error('Erreur lors du chargement des infos service client:', error);
        return {
          id: 'service-client',
          nom: 'Service',
          prenom: 'Client',
          email: 'service.client@example.com',
          profileImage: null,
          genre: 'autre'
        };
      }
    },
    enabled: !!user,
  });

  // Mutation pour envoyer un message
  const sendMessageMutation = useMutation({
    mutationFn: async (messageText: string) => {
      return clientChatAPI.sendServiceMessage(messageText);
    },
    onSuccess: () => {
      setMessage('');
      queryClient.invalidateQueries({ queryKey: ['serviceConversation'] });
    },
    onError: (error) => {
      console.error('Erreur lors de l\'envoi du message:', error);
      toast.error('Erreur lors de l\'envoi du message');
    }
  });

  // Mutation pour upload de fichier
  const uploadFileMutation = useMutation({
    mutationFn: async ({ file, messageText }: { file: File; messageText?: string }) => {
      const conversationId = `client-${user?.id}-service`;
      return chatFilesAPI.uploadServiceFile(conversationId, file, messageText);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['serviceConversation'] });
      toast.success('Fichier envoyé avec succès');
    },
    onError: (error) => {
      console.error('Erreur lors de l\'upload du fichier:', error);
      toast.error('Erreur lors de l\'envoi du fichier');
    }
  });

  // Mutation pour marquer les messages comme lus
  const markAsReadMutation = useMutation({
    mutationFn: async ({ messageId, conversationId }: { messageId: string; conversationId: string }) => {
      return clientChatAPI.markAsRead(messageId, conversationId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['serviceConversation'] });
    }
  });

  // Compter les messages non lus
  const unreadCount = conversation?.messages?.filter(
    (msg: Message) => !msg.read && msg.senderId !== user?.id && !msg.isSystemMessage
  ).length || 0;

  // Marquer les messages comme lus quand le widget est ouvert
  useEffect(() => {
    if (isOpen && !isMinimized && conversation?.messages && user) {
      const unreadMessages = conversation.messages.filter(
        (msg: Message) => !msg.read && msg.senderId !== user.id && !msg.isSystemMessage
      );
      
      unreadMessages.forEach((msg: Message) => {
        const conversationId = `client-${user.id}-service`;
        markAsReadMutation.mutate({ messageId: msg.id, conversationId });
      });
    }
  }, [isOpen, isMinimized, conversation?.messages, user]);

  // Vérifier l'état fermé au montage
  useEffect(() => {
    const isClosed = localStorage.getItem(WIDGET_CLOSED_KEY) === 'true';
    if (isClosed) {
      setIsOpen(false);
    }
  }, []);

  // Ouvrir automatiquement le widget quand il y a de nouveaux messages
  useEffect(() => {
    const isClosed = localStorage.getItem(WIDGET_CLOSED_KEY) === 'true';
    
    if (unreadCount > previousUnreadCount && unreadCount > 0 && !isClosed) {
      setIsOpen(true);
      setIsMinimized(false);
    }
    setPreviousUnreadCount(unreadCount);
  }, [unreadCount, previousUnreadCount]);

  // Scroll vers le bas quand les messages changent
  useEffect(() => {
    if (messagesEndRef.current && isOpen && !isMinimized) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [conversation?.messages, isOpen, isMinimized]);

  // Marquer comme en ligne au montage
  useEffect(() => {
    if (user) {
      clientChatAPI.setOnline();
      return () => {
        clientChatAPI.setOffline();
      };
    }
  }, [user]);

  // Ne pas afficher le widget si c'est l'admin service client ou si pas d'utilisateur
  if (!user || user?.email === "service.client@example.com") {
    return null;
  }

  const handleSendMessage = () => {
    if (!message.trim()) return;
    sendMessageMutation.mutate(message);
  };

  const handleFileSelect = (file: File) => {
    uploadFileMutation.mutate({ file });
  };

  const handleVoiceRecording = (audioBlob: Blob) => {
    const audioFile = new File([audioBlob], `voice-message-${Date.now()}.wav`, {
      type: 'audio/wav'
    });
    uploadFileMutation.mutate({ file: audioFile, messageText: 'Message vocal' });
  };

  const handleEmojiSelect = (emoji: any) => {
    setMessage((prev) => prev + emoji.native);
  };

  const handleCloseWidget = () => {
    setIsOpen(false);
    localStorage.setItem(WIDGET_CLOSED_KEY, 'true');
  };

  const handleOpenWidget = () => {
    setIsOpen(true);
    localStorage.removeItem(WIDGET_CLOSED_KEY);
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('fr-FR', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <>
      {/* Bouton flottant */}
      {!isOpen && (
        <motion.div
          className="fixed bottom-6 right-6 z-50"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <Button
            onClick={handleOpenWidget}
            className="rounded-full w-14 h-14 bg-blue-600 hover:bg-blue-700 shadow-lg"
          >
            <MessageCircle className="h-6 w-6" />
          </Button>
          
          {unreadCount > 0 && (
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ repeat: Infinity, duration: 2 }}
              className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center"
            >
              {unreadCount}
            </motion.div>
          )}
        </motion.div>
      )}

      {/* Fenêtre de chat */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            className={`fixed bottom-6 right-6 z-50 ${
              isMinimized ? 'w-80 h-16' : 'w-80 h-96'
            }`}
          >
            <Card className="h-full flex flex-col shadow-xl">
              {/* En-tête */}
              <div className="bg-blue-600 text-white p-4 rounded-t-lg">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                    <span className="font-medium">Service Client</span>
                  </div>
                  <div className="flex space-x-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setIsMinimized(!isMinimized)}
                      className="text-white hover:bg-blue-700 p-1"
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleCloseWidget}
                      className="text-white hover:bg-blue-700 p-1"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>

              {/* Messages (seulement si pas minimisé) */}
              {!isMinimized && (
                <>
                  <ScrollArea className="flex-1 p-4">
                    <div className="space-y-3">
                      {isLoading ? (
                        <p className="text-center py-4 text-gray-500">Chargement...</p>
                      ) : conversation?.messages?.map((msg: Message) => (
                        <div
                          key={msg.id}
                          className={`flex items-start space-x-2 ${msg.senderId === user.id ? 'flex-row-reverse space-x-reverse' : ''}`}
                        >
                          {/* Avatar de l'utilisateur */}
                          <div className="flex-shrink-0">
                            {msg.senderId === user?.id ? (
                              <UserAvatar user={user} size="sm" />
                            ) : (
                              serviceClientInfo ? (
                                <UserAvatar user={serviceClientInfo} size="sm" />
                              ) : (
                                <Avatar className="w-6 h-6">
                                  <AvatarFallback className="bg-blue-100">
                                    <Bot className="h-3 w-3 text-blue-600" />
                                  </AvatarFallback>
                                </Avatar>
                              )
                            )}
                          </div>
                          
                          <div className="max-w-[80%]">
                            <div
                              className={`p-3 rounded-lg text-sm ${
                                msg.isSystemMessage
                                  ? 'bg-gray-200 text-gray-700'
                                  : msg.senderId === user.id
                                  ? 'bg-blue-600 text-white'
                                  : 'bg-gray-100 text-gray-800'
                              }`}
                            >
                              {msg.content}
                              <p className={`text-xs mt-1 ${
                                msg.isSystemMessage ? 'text-gray-500' :
                                msg.senderId === user.id ? 'text-blue-100' : 'text-gray-500'
                              }`}>
                                {formatTime(msg.timestamp)}
                              </p>
                            </div>
                            
                            {/* Affichage des fichiers attachés */}
                            {msg.fileAttachment && (
                              <div className="mt-2">
                                <FileAttachment attachment={msg.fileAttachment} />
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                      <div ref={messagesEndRef} />
                    </div>
                  </ScrollArea>

                  {/* Zone de saisie */}
                  <div className="p-4 border-t">
                    <div className="flex space-x-2 mb-2">
                      {/* Boutons d'upload et micro */}
                      <FileUploadButton
                        onFileSelect={handleFileSelect}
                        accept="*/*"
                        maxSize={50}
                        disabled={uploadFileMutation.isPending}
                      />
                      
                      <VoiceRecorder
                        onRecordingComplete={handleVoiceRecording}
                        disabled={uploadFileMutation.isPending}
                      />
                    </div>
                    
                    <div className="flex space-x-2">
                      <div className="relative flex-1">
                        <Input
                          value={message}
                          onChange={(e) => setMessage(e.target.value)}
                          placeholder="Tapez votre message..."
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
                        className="bg-blue-600 hover:bg-blue-700"
                        disabled={sendMessageMutation.isPending}
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
                      placeholder="Message rapide..."
                      onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                      className="text-sm"
                    />
                    <Button 
                      onClick={handleSendMessage}
                      size="sm"
                      className="bg-blue-600 hover:bg-blue-700"
                      disabled={sendMessageMutation.isPending}
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

export default ClientServiceChatWidget;
