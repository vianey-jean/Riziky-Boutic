/*
 * RÉSUMÉ DU FICHIER:
 * ==================
 * Widget de chat administrateur pour le service client - Interface flottante permettant aux administrateurs 
 * de répondre aux conversations de service client en temps réel avec support de fichiers multimédias.
 * 
 * FONCTIONNALITÉS PRINCIPALES:
 * - Interface de chat flottante responsive
 * - Gestion multi-conversations avec sélecteur
 * - Envoi de messages texte avec emojis
 * - Upload de fichiers (documents, images, audio, vidéo)
 * - Enregistrement vocal intégré
 * - Notifications de messages non lus
 * - Auto-ouverture sur nouveaux messages
 * - État minimisé/maximisé persistant
 * - Suppression de fichiers par l'expéditeur (admin ou client)
 */

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
import { chatFilesAPI } from '@/services/chatFilesAPI';
import { useAuth } from '@/contexts/AuthContext';
import { useLocation } from 'react-router-dom';
import data from '@emoji-mart/data';
import Picker from '@emoji-mart/react';
import { toast } from 'sonner';
import UserAvatar from '@/components/user/UserAvatar';
import FileUploadButton from '@/components/chat/FileUploadButton';
import VoiceRecorder from '@/components/chat/VoiceRecorder';
import FilePreview from '@/components/chat/FilePreview';

// Interface pour les messages de chat
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

// Interface pour les conversations de service
interface ServiceConversation {
  messages: Message[];
  participants: string[];
  type: string;
  clientInfo?: any;
  unreadCount?: number;
}

/**
 * LOGIQUE GLOBALE DU COMPOSANT:
 * ============================
 * Ce widget permet aux administrateurs de service client de gérer les conversations
 * avec les clients de manière centralisée. Il affiche une interface flottante qui:
 * 
 * 1. Se cache automatiquement sur la page admin service client
 * 2. S'affiche uniquement pour l'utilisateur "service.client@example.com"
 * 3. Calcule automatiquement le nombre de messages non lus
 * 4. Permet la navigation entre plusieurs conversations
 * 5. Supporte tous types de fichiers multimédias
 * 6. Maintient l'état d'ouverture/fermeture via localStorage
 * 7. Permet la suppression des fichiers par l'expéditeur (admin ou client)
 */
const AdminServiceChatWidget: React.FC = () => {
  // Hook d'authentification pour récupérer les infos utilisateur
  const { user } = useAuth();
  
  // Hook de navigation pour détecter la page actuelle
  const location = useLocation();
  
  // États locaux du widget
  const [isOpen, setIsOpen] = useState(false); // État d'ouverture du widget
  const [isMinimized, setIsMinimized] = useState(false); // État minimisé/maximisé
  const [message, setMessage] = useState(''); // Message en cours de saisie
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null); // Conversation active
  
  // Références pour le scroll automatique
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  
  // Client de cache pour les requêtes
  const queryClient = useQueryClient();
  
  // État pour détecter les nouveaux messages
  const [previousUnreadCount, setPreviousUnreadCount] = useState(0);

  // Clé de persistance dans localStorage
  const WIDGET_CLOSED_KEY = 'adminChatWidgetClosed';

  // Vérifier si on est sur la page admin service client
  const isOnAdminServicePage = location.pathname.includes('/admin/service-client');

  // Déterminer si le widget doit être affiché
  const shouldShowWidget = user?.email === "service.client@example.com" && !isOnAdminServicePage;

  // Récupérer toutes les conversations de service client avec polling automatique
  const { data: conversations } = useQuery<{[key: string]: ServiceConversation}>({
    queryKey: ['adminServiceConversations'], // Clé unique pour le cache
    queryFn: async () => {
      try {
        // Appel API pour récupérer les conversations
        const response = await clientChatAPI.getServiceConversations();
        return response.data || {};
      } catch (error) {
        console.error('Erreur lors du chargement des conversations:', error);
        return {};
      }
    },
    enabled: shouldShowWidget, // Ne s'exécute que si le widget doit être affiché
    refetchInterval: 3000, // Polling toutes les 3 secondes
  });

  // Calculer le nombre total de messages non lus à partir des conversations
  const totalUnreadCount = React.useMemo(() => {
    if (!conversations) return 0;
    
    return Object.values(conversations).reduce((total, conversation) => {
      // Compter les messages non lus qui ne viennent pas de l'utilisateur actuel
      const unreadInConversation = conversation.messages?.filter(
        (msg: Message) => !msg.read && msg.senderId !== user?.id && !msg.isSystemMessage
      ).length || 0;
      
      return total + unreadInConversation;
    }, 0);
  }, [conversations, user?.id]);

  // Mutation pour envoyer une réponse admin
  const sendReplyMutation = useMutation({
    mutationFn: async ({ conversationId, messageText }: { conversationId: string; messageText: string }) => {
      return clientChatAPI.sendServiceReply(conversationId, messageText);
    },
    onSuccess: () => {
      // Réinitialiser le champ de saisie et rafraîchir les données
      setMessage('');
      queryClient.invalidateQueries({ queryKey: ['adminServiceConversations'] });
    },
    onError: (error) => {
      console.error('Erreur lors de l\'envoi de la réponse:', error);
      toast.error('Erreur lors de l\'envoi de la réponse');
    }
  });

  // Mutation pour l'upload de fichiers
  const uploadFileMutation = useMutation({
    mutationFn: async ({ conversationId, file, messageText }: { conversationId: string; file: File; messageText?: string }) => {
      return chatFilesAPI.uploadServiceFile(conversationId, file, messageText);
    },
    onSuccess: () => {
      // Rafraîchir les conversations et afficher un message de succès
      queryClient.invalidateQueries({ queryKey: ['adminServiceConversations'] });
      toast.success('Fichier envoyé avec succès');
    },
    onError: (error) => {
      console.error('Erreur lors de l\'upload du fichier:', error);
      toast.error('Erreur lors de l\'envoi du fichier');
    }
  });

  // Mutation pour supprimer un fichier - corrigée pour permettre à tous les utilisateurs de supprimer leurs propres fichiers
  const deleteFileMutation = useMutation({
    mutationFn: async ({ messageId, conversationId }: { messageId: string; conversationId: string }) => {
      return chatFilesAPI.deleteFile(messageId, conversationId, 'service');
    },
    onSuccess: () => {
      // Rafraîchir les conversations et afficher un message de succès
      queryClient.invalidateQueries({ queryKey: ['adminServiceConversations'] });
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
      // Rafraîchir les données après marquage comme lu
      queryClient.invalidateQueries({ queryKey: ['adminServiceConversations'] });
    }
  });

  // Marquer automatiquement les messages comme lus quand le widget est ouvert
  useEffect(() => {
    if (isOpen && !isMinimized && activeConversationId && conversations && user) {
      const activeConversation = conversations[activeConversationId];
      if (activeConversation?.messages) {
        // Filtrer les messages non lus qui ne viennent pas de l'admin
        const unreadMessages = activeConversation.messages.filter(
          (msg: Message) => !msg.read && msg.senderId !== user.id && !msg.isSystemMessage
        );
        
        // Marquer chaque message non lu comme lu
        unreadMessages.forEach((msg: Message) => {
          markAsReadMutation.mutate({ messageId: msg.id, conversationId: activeConversationId });
        });
      }
    }
  }, [isOpen, isMinimized, activeConversationId, conversations, user]);

  // Vérifier l'état fermé du widget au montage du composant
  useEffect(() => {
    const isClosed = localStorage.getItem(WIDGET_CLOSED_KEY) === 'true';
    if (isClosed) {
      setIsOpen(false);
    }
  }, []);

  // Ouvrir automatiquement le widget quand il y a de nouveaux messages
  useEffect(() => {
    const isClosed = localStorage.getItem(WIDGET_CLOSED_KEY) === 'true';
    
    // Si le nombre de messages non lus augmente et que le widget n'est pas fermé manuellement
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
      
      // Chercher une conversation avec des messages non lus
      const unreadConversation = conversationsArray.find(([_, conv]) => {
        const unreadCount = conv.messages?.filter(
          (msg: Message) => !msg.read && msg.senderId !== user?.id && !msg.isSystemMessage
        ).length || 0;
        return unreadCount > 0;
      });
      
      // Sélectionner la conversation non lue ou la première disponible
      if (unreadConversation) {
        setActiveConversationId(unreadConversation[0]);
      } else if (conversationsArray.length > 0) {
        setActiveConversationId(conversationsArray[0][0]);
      }
    }
  }, [conversations, activeConversationId, user?.id]);

  // Scroll automatique vers le bas quand les messages changent
  useEffect(() => {
    if (messagesEndRef.current && isOpen && !isMinimized) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [conversations, activeConversationId, isOpen, isMinimized]);

  // Gestionnaire d'envoi de message
  const handleSendMessage = () => {
    if (!message.trim() || !activeConversationId) return;
    
    sendReplyMutation.mutate({
      conversationId: activeConversationId,
      messageText: message
    });
  };

  // Gestionnaire de sélection de fichier
  const handleFileSelect = (file: File) => {
    if (!activeConversationId) return;
    
    uploadFileMutation.mutate({ 
      conversationId: activeConversationId, 
      file 
    });
  };

  // Gestionnaire d'enregistrement vocal
  const handleVoiceRecording = (audioBlob: Blob) => {
    if (!activeConversationId) return;
    
    // Créer un fichier audio à partir du blob
    const audioFile = new File([audioBlob], `admin-voice-${Date.now()}.wav`, {
      type: 'audio/wav'
    });
    
    uploadFileMutation.mutate({ 
      conversationId: activeConversationId, 
      file: audioFile, 
      messageText: 'Message vocal de l\'admin' 
    });
  };

  // Gestionnaire de suppression de fichier - corrigé pour permettre à chaque utilisateur de supprimer ses propres fichiers
  const handleFileDelete = (messageId: string) => {
    if (!activeConversationId) return;
    
    deleteFileMutation.mutate({
      messageId,
      conversationId: activeConversationId
    });
  };

  // Gestionnaire de sélection d'emoji
  const handleEmojiSelect = (emoji: any) => {
    setMessage((prev) => prev + emoji.native);
  };

  // Gestionnaire de fermeture du widget
  const handleCloseWidget = () => {
    setIsOpen(false);
    // Persister l'état fermé dans localStorage
    localStorage.setItem(WIDGET_CLOSED_KEY, 'true');
  };

  // Gestionnaire d'ouverture du widget
  const handleOpenWidget = () => {
    setIsOpen(true);
    // Supprimer l'état fermé du localStorage
    localStorage.removeItem(WIDGET_CLOSED_KEY);
  };

  // Formater l'heure d'un message
  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('fr-FR', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Ne pas afficher le widget si les conditions ne sont pas remplies
  if (!shouldShowWidget) return null;

  // Récupérer la conversation active
  const activeConversation = activeConversationId && conversations ? 
    conversations[activeConversationId] : null;

  // Convertir les conversations en tableau pour l'affichage
  const conversationsList = conversations ? Object.entries(conversations) : [];

  return (
    <>
      {/* Bouton flottant - affiché quand le widget est fermé */}
      {!isOpen && (
        <motion.div
          className="fixed bottom-6 right-6 z-50"
          whileHover={{ scale: 1.1 }} // Animation au survol
          whileTap={{ scale: 0.9 }} // Animation au clic
        >
          <Button
            onClick={handleOpenWidget}
            className="rounded-full w-14 h-14 bg-red-600 hover:bg-red-700 shadow-lg"
          >
            <MessageCircle className="h-6 w-6" />
          </Button>
          
          {/* Badge de notification pour les messages non lus */}
          {totalUnreadCount > 0 && (
            <motion.div
              animate={{ scale: [1, 1.2, 1] }} // Animation pulsante
              transition={{ repeat: Infinity, duration: 2 }}
              className="absolute -top-1 -right-1 bg-blue-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center"
            >
              {totalUnreadCount}
            </motion.div>
          )}
        </motion.div>
      )}

      {/* Fenêtre de chat principale */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }} // Animation d'entrée
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }} // Animation de sortie
            className={`fixed bottom-6 right-6 z-50 ${
              isMinimized ? 'w-80 h-20' : 'w-80 h-96'
            }`}
          >
            <Card className="h-full flex flex-col shadow-xl">
              {/* En-tête du widget */}
              <div className="bg-red-600 text-white p-4 rounded-t-lg">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    {/* Indicateur de statut en ligne */}
                    <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                    <span className="font-medium">Admin Chat</span>
                  </div>
                  <div className="flex space-x-1">
                    {/* Bouton minimiser/maximiser */}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setIsMinimized(!isMinimized)}
                      className="text-white hover:bg-red-700 p-1"
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                    {/* Bouton fermer */}
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

              {/* Contenu principal (seulement si pas minimisé) */}
              {!isMinimized && (
                <>
                  {/* Sélecteur de conversation (affiché s'il y a plusieurs conversations) */}
                  {conversationsList.length > 1 && (
                    <div className="p-2 border-b">
                      <Select value={activeConversationId || ''} onValueChange={setActiveConversationId}>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Sélectionner une conversation" />
                        </SelectTrigger>
                        <SelectContent>
                          {conversationsList.map(([convId, conv]) => {
                            // Calculer le nombre de messages non lus pour cette conversation
                            const unreadCount = conv.messages?.filter(
                              (msg: Message) => !msg.read && msg.senderId !== user?.id && !msg.isSystemMessage
                            ).length || 0;
                            
                            return (
                              <SelectItem key={convId} value={convId}>
                                <div className="flex items-center justify-between w-full">
                                  <span>
                                    {conv.clientInfo?.nom} {conv.clientInfo?.prenom}
                                  </span>
                                  {unreadCount > 0 && (
                                    <span className="ml-2 bg-blue-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                                      {unreadCount}
                                    </span>
                                  )}
                                </div>
                              </SelectItem>
                            );
                          })}
                        </SelectContent>
                      </Select>
                    </div>
                  )}

                  {/* Zone d'affichage des messages */}
                  <ScrollArea className="flex-1 p-4">
                    <div className="space-y-3">
                      {activeConversation?.messages?.map((msg: Message) => (
                        <div
                          key={msg.id}
                          className={`flex items-start space-x-2 ${msg.senderId === user?.id ? 'flex-row-reverse space-x-reverse' : ''}`}
                        >
                          {/* Avatar de l'expéditeur */}
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
                            {/* Bulle de message */}
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
                              {/* Horodatage du message */}
                              <p className={`text-xs mt-1 ${
                                msg.isSystemMessage ? 'text-gray-500' :
                                msg.senderId === user?.id ? 'text-red-100' : 'text-gray-500'
                              }`}>
                                {formatTime(msg.timestamp)}
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
                      {/* Point de référence pour le scroll automatique */}
                      <div ref={messagesEndRef} />
                    </div>
                  </ScrollArea>

                  {/* Zone de saisie et contrôles */}
                  <div className="p-4 border-t">
                    {/* Boutons pour fichiers et enregistrement vocal */}
                    <div className="flex space-x-2 mb-2">
                      <FileUploadButton
                        onFileSelect={handleFileSelect}
                        accept="*/*" // Accepter tous types de fichiers
                        maxSize={50} // Taille max 50MB
                        disabled={uploadFileMutation.isPending}
                      />
                      
                      <VoiceRecorder
                        onRecordingComplete={handleVoiceRecording}
                        disabled={uploadFileMutation.isPending}
                      />
                    </div>
                    
                    {/* Champ de saisie principal */}
                    <div className="flex space-x-2">
                      <div className="relative flex-1">
                        <Input
                          value={message}
                          onChange={(e) => setMessage(e.target.value)}
                          placeholder="Répondre au client..."
                          onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                          className="pr-10"
                        />
                        {/* Bouton emoji */}
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
                      {/* Bouton d'envoi */}
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

/*
 * RÉSUMÉ DE FIN DE FICHIER:
 * ========================
 * Ce composant implémente un widget de chat administrateur flottant pour le service client.
 * Il permet aux administrateurs de gérer plusieurs conversations simultanément avec support
 * complet de fichiers multimédias et possibilité de suppression par l'expéditeur (admin ou client).
 * 
 * POINTS CLÉS RÉSOLUS:
 * - Calcul automatique du totalUnreadCount depuis les conversations
 * - Support complet des fichiers (documents, images, audio, vidéo)
 * - Prévisualisation de tous types de fichiers (images, PDF, texte, audio, vidéo)
 * - Suppression de fichiers par l'expéditeur uniquement (admin ou client)
 * - Gestion d'état robuste avec React Query
 * - Interface responsive avec animations Framer Motion
 * - Persistance des préférences utilisateur
 */
