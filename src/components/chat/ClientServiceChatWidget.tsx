
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, Send, User, Bot, Minus, Smile, Sparkles, Crown, Zap } from 'lucide-react';
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
      {/* Bouton flottant ultra premium */}
      {!isOpen && (
        <motion.div
          className="fixed bottom-6 right-6 z-50"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <div className="relative">
            {/* Effet de halo animé */}
            <motion.div
              className="absolute inset-0 rounded-full"
              animate={{
                scale: [1, 1.4, 1],
                opacity: [0.3, 0.1, 0.3],
                rotate: [0, 180, 360]
              }}
              transition={{ duration: 4, repeat: Infinity }}
            >
              <div className="w-24 h-24 rounded-full bg-gradient-to-r from-blue-500/40 via-purple-500/40 via-pink-500/40 to-blue-500/40 blur-xl" />
            </motion.div>
            
            <Button
              onClick={handleOpenWidget}
              className="relative w-18 h-18 rounded-full bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 hover:from-blue-700 hover:via-purple-700 hover:to-pink-700 shadow-2xl border-3 border-white/30 backdrop-blur-sm transition-all duration-500 hover:shadow-3xl"
            >
              <motion.div
                animate={{ 
                  rotate: [0, 10, -10, 0],
                  scale: [1, 1.1, 1]
                }}
                transition={{ duration: 2, repeat: Infinity }}
                className="relative"
              >
                <MessageCircle className="h-8 w-8 text-white" />
                <motion.div
                  className="absolute -top-1 -right-1"
                  animate={{ scale: [0.8, 1.2, 0.8] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                </motion.div>
              </motion.div>
            </Button>
          </div>
          
          {unreadCount > 0 && (
            <motion.div
              animate={{ 
                scale: [1, 1.4, 1],
                boxShadow: [
                  "0 0 0 0 rgba(239, 68, 68, 0.8)",
                  "0 0 0 15px rgba(239, 68, 68, 0)",
                  "0 0 0 0 rgba(239, 68, 68, 0)"
                ]
              }}
              transition={{ duration: 2, repeat: Infinity }}
              className="absolute -top-3 -right-3 bg-gradient-to-r from-red-500 to-pink-600 text-white text-xs rounded-full w-7 h-7 flex items-center justify-center font-bold shadow-2xl border-3 border-white"
            >
              {unreadCount}
            </motion.div>
          )}
        </motion.div>
      )}

      {/* Fenêtre de chat ultra luxueuse */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            className={`fixed bottom-6 right-6 z-50 ${
              isMinimized ? 'w-96 h-20' : 'w-96 h-[550px]'
            }`}
          >
            <div className="relative h-full">
              {/* Fond ultra moderne avec effets */}
              <div className="absolute inset-0 bg-gradient-to-br from-slate-900/95 via-purple-900/95 to-slate-900/95 backdrop-blur-2xl rounded-3xl" />
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10 animate-pulse rounded-3xl" />
              <motion.div
                className="absolute top-0 left-1/4 w-32 h-32 bg-blue-500/20 rounded-full blur-2xl"
                animate={{ x: [0, 50, 0], y: [0, -20, 0] }}
                transition={{ duration: 8, repeat: Infinity }}
              />
              <motion.div
                className="absolute bottom-0 right-1/4 w-24 h-24 bg-purple-500/20 rounded-full blur-2xl"
                animate={{ x: [0, -30, 0], y: [0, 20, 0] }}
                transition={{ duration: 6, repeat: Infinity }}
              />
              
              <Card className="relative h-full flex flex-col bg-transparent border-2 border-white/20 shadow-2xl rounded-3xl overflow-hidden backdrop-blur-xl">
                {/* En-tête premium avec effets */}
                <div className="relative bg-gradient-to-r from-blue-600/90 via-purple-600/90 to-pink-600/90 backdrop-blur-xl p-6 border-b border-white/20">
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent"
                    animate={{ x: [-100, 400] }}
                    transition={{ duration: 3, repeat: Infinity, repeatDelay: 2 }}
                  />
                  <div className="relative flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <motion.div
                        animate={{ 
                          rotate: 360,
                          scale: [1, 1.1, 1]
                        }}
                        transition={{ 
                          rotate: { duration: 8, repeat: Infinity, ease: "linear" },
                          scale: { duration: 2, repeat: Infinity }
                        }}
                        className="relative"
                      >
                        <div className="absolute inset-0 bg-gradient-to-r from-emerald-400 to-green-500 rounded-full blur opacity-75" />
                        <div className="relative w-5 h-5 bg-gradient-to-r from-emerald-400 to-green-500 rounded-full shadow-xl border-2 border-white/30" />
                      </motion.div>
                      <div>
                        <motion.span 
                          className="font-bold text-white text-lg flex items-center gap-2"
                          whileHover={{ scale: 1.02 }}
                        >
                          Service Client VIP
                          <Zap className="h-4 w-4 text-yellow-300" />
                        </motion.span>
                        <p className="text-white/80 text-sm font-medium">Support premium exclusif</p>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setIsMinimized(!isMinimized)}
                          className="text-white hover:bg-white/20 p-2 rounded-xl transition-all duration-300 backdrop-blur-sm border border-white/20"
                        >
                          <Minus className="h-4 w-4" />
                        </Button>
                      </motion.div>
                      <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={handleCloseWidget}
                          className="text-white hover:bg-red-500/20 p-2 rounded-xl transition-all duration-300 backdrop-blur-sm border border-white/20 hover:border-red-400/30"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </motion.div>
                    </div>
                  </div>
                </div>

                {/* Messages (seulement si pas minimisé) */}
                {!isMinimized && (
                  <>
                    <ScrollArea className="flex-1 p-6">
                      <div className="space-y-6">
                        {isLoading ? (
                          <motion.div 
                            className="text-center py-8"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                          >
                            <div className="inline-flex items-center space-x-3 text-white/70">
                              <motion.div
                                animate={{ rotate: 360 }}
                                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                className="w-6 h-6 border-2 border-blue-400 border-t-transparent rounded-full"
                              />
                              <span className="font-semibold">Chargement de la magie...</span>
                            </div>
                          </motion.div>
                        ) : conversation?.messages?.map((msg: Message, index: number) => (
                          <motion.div
                            key={msg.id}
                            initial={{ opacity: 0, y: 20, scale: 0.9 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            transition={{ delay: index * 0.1 }}
                            className={`flex items-start space-x-3 ${msg.senderId === user.id ? 'flex-row-reverse space-x-reverse' : ''}`}
                          >
                            {/* Avatar premium avec animations */}
                            <motion.div 
                              className="flex-shrink-0"
                              whileHover={{ scale: 1.1 }}
                            >
                              {msg.senderId === user?.id ? (
                                <div className="relative">
                                  <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full blur opacity-75" />
                                  <UserAvatar user={user} size="sm" />
                                </div>
                              ) : (
                                serviceClientInfo ? (
                                  <div className="relative">
                                    <div className="absolute inset-0 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full blur opacity-75" />
                                    <UserAvatar user={serviceClientInfo} size="sm" />
                                  </div>
                                ) : (
                                  <div className="relative">
                                    <div className="absolute inset-0 bg-gradient-to-r from-purple-400 to-pink-500 rounded-full blur opacity-75" />
                                    <Avatar className="relative w-8 h-8 border-2 border-white/30">
                                      <AvatarFallback className="bg-gradient-to-br from-purple-500 to-pink-600 text-white">
                                        <Crown className="h-4 w-4" />
                                      </AvatarFallback>
                                    </Avatar>
                                  </div>
                                )
                              )}
                            </motion.div>
                            
                            <div className="max-w-[75%]">
                              <motion.div
                                whileHover={{ scale: 1.02 }}
                                className={`relative p-4 rounded-3xl backdrop-blur-xl border transition-all duration-300 ${
                                  msg.isSystemMessage
                                    ? 'bg-gradient-to-br from-gray-500/20 to-gray-600/20 text-white text-center italic border-gray-400/30'
                                    : msg.senderId === user.id
                                    ? 'bg-gradient-to-br from-blue-500/90 to-purple-600/90 text-white border-blue-400/30 shadow-lg'
                                    : 'bg-gradient-to-br from-white/15 to-white/5 text-white border-white/20 shadow-xl'
                                }`}
                              >
                                {/* Effet de brillance premium */}
                                <div className={`absolute inset-0 rounded-3xl opacity-30 ${
                                  msg.senderId === user.id 
                                    ? 'bg-gradient-to-r from-white/20 to-transparent'
                                    : 'bg-gradient-to-r from-blue-400/20 to-purple-400/20'
                                }`} />
                                
                                <p className="relative font-medium leading-relaxed">{msg.content}</p>
                                <div className="relative flex justify-between items-center mt-3 pt-3 border-t border-white/20">
                                  <span className="text-xs text-white/70 font-medium">
                                    {formatTime(msg.timestamp)}
                                  </span>
                                  {!msg.read && msg.senderId !== user.id && (
                                    <motion.div
                                      animate={{ scale: [1, 1.2, 1] }}
                                      transition={{ duration: 1, repeat: Infinity }}
                                      className="w-2 h-2 bg-blue-400 rounded-full"
                                    />
                                  )}
                                </div>
                              </motion.div>
                              
                              {/* Affichage des fichiers attachés avec design premium */}
                              {msg.fileAttachment && (
                                <motion.div 
                                  className="mt-3"
                                  initial={{ opacity: 0, scale: 0.8 }}
                                  animate={{ opacity: 1, scale: 1 }}
                                >
                                  <FileAttachment attachment={msg.fileAttachment} />
                                </motion.div>
                              )}
                            </div>
                          </motion.div>
                        ))}
                        <div ref={messagesEndRef} />
                      </div>
                    </ScrollArea>

                    {/* Zone de saisie ultra premium */}
                    <motion.div 
                      className="p-6 border-t border-white/20 bg-gradient-to-r from-white/5 to-white/10 backdrop-blur-xl"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                    >
                      <div className="flex space-x-3 mb-3">
                        {/* Boutons d'upload et micro avec effets */}
                        <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                          <FileUploadButton
                            onFileSelect={handleFileSelect}
                            accept="*/*"
                            maxSize={50}
                            disabled={uploadFileMutation.isPending}
                          />
                        </motion.div>
                        
                        <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                          <VoiceRecorder
                            onRecordingComplete={handleVoiceRecording}
                            disabled={uploadFileMutation.isPending}
                          />
                        </motion.div>
                      </div>
                      
                      <div className="flex space-x-3">
                        <div className="relative flex-1">
                          <Input
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            placeholder="✨ Tapez votre message VIP..."
                            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                            className="pr-12 bg-white/10 border-2 border-white/20 focus:border-blue-400/50 focus:ring-2 focus:ring-blue-400/20 rounded-2xl text-white placeholder-white/60 font-medium backdrop-blur-xl transition-all duration-500"
                          />
                          <Popover>
                            <PopoverTrigger asChild>
                              <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                                <Button 
                                  variant="ghost" 
                                  size="icon" 
                                  className="absolute right-2 top-1/2 transform -translate-y-1/2 h-8 w-8 text-white/70 hover:text-white hover:bg-white/10 rounded-xl transition-all duration-300"
                                >
                                  <Smile className="h-4 w-4" />
                                </Button>
                              </motion.div>
                            </PopoverTrigger>
                            <PopoverContent className="w-full p-0 bg-white/95 backdrop-blur-2xl border-2 border-white/30 rounded-3xl" side="top">
                              <Picker 
                                data={data} 
                                onEmojiSelect={handleEmojiSelect}
                                theme="light"
                              />
                            </PopoverContent>
                          </Popover>
                        </div>
                        
                        <motion.div
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <Button 
                            onClick={handleSendMessage}
                            size="sm"
                            className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white shadow-2xl rounded-2xl px-6 border-2 border-blue-400/30 transition-all duration-500 hover:shadow-3xl backdrop-blur-sm"
                            disabled={sendMessageMutation.isPending}
                          >
                            {sendMessageMutation.isPending ? (
                              <motion.div
                                animate={{ rotate: 360 }}
                                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full"
                              />
                            ) : (
                              <motion.div
                                whileHover={{ rotate: 15, scale: 1.1 }}
                                transition={{ type: "spring", stiffness: 400 }}
                              >
                                <Send className="h-4 w-4" />
                              </motion.div>
                            )}
                          </Button>
                        </motion.div>
                      </div>
                      
                      {/* Indicateur premium */}
                      <motion.div
                        animate={{ opacity: [0.5, 1, 0.5] }}
                        transition={{ duration: 3, repeat: Infinity }}
                        className="mt-3 text-center text-xs text-white/50 font-medium flex items-center justify-center gap-2"
                      >
                        <Crown className="h-3 w-3 text-yellow-400" />
                        Service Premium • Réponse instantanée garantie
                        <Sparkles className="h-3 w-3 text-yellow-400" />
                      </motion.div>
                    </motion.div>
                  </>
                )}

                {/* Mode minimisé premium */}
                {isMinimized && (
                  <motion.div 
                    className="flex-1 p-4 border-t border-white/20 bg-gradient-to-r from-white/5 to-white/10 backdrop-blur-xl"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    <div className="flex space-x-3">
                      <Input
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="💎 Message VIP rapide..."
                        onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                        className="text-sm bg-white/10 border-2 border-white/20 focus:border-blue-400/50 rounded-2xl text-white placeholder-white/60 font-medium backdrop-blur-xl"
                      />
                      <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                        <Button 
                          onClick={handleSendMessage}
                          size="sm"
                          className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white shadow-xl rounded-xl border border-blue-400/30"
                          disabled={sendMessageMutation.isPending}
                        >
                          <Send className="h-3 w-3" />
                        </Button>
                      </motion.div>
                    </div>
                  </motion.div>
                )}
              </Card>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default ClientServiceChatWidget;
