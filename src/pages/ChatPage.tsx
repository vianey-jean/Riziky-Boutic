import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Paperclip, X, User, Bot, Smile, Trash2, Download, File, Image, Video, Music } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { clientChatAPI } from '@/services/chatAPI';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import UserAvatar from '@/components/user/UserAvatar';
import FileUploadButton from '@/components/chat/FileUploadButton';
import VoiceRecorder from '@/components/chat/VoiceRecorder';
import { chatFilesAPI } from '@/services/chatFilesAPI';
import Layout from '@/components/layout/Layout';
import data from '@emoji-mart/data';
import Picker from '@emoji-mart/react';

interface FileAttachment {
  filename: string;
  originalName: string;
  mimetype: string;
  size: number;
  path: string;
  url: string;
}

interface Message {
  id: string;
  senderId: string;
  content: string;
  timestamp: string;
  read: boolean;
  isSystemMessage?: boolean;
  isAdminReply?: boolean;
  fileAttachment?: FileAttachment;
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
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [fileToDelete, setFileToDelete] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const queryClient = useQueryClient();

  // Générer un ID de conversation basé sur l'utilisateur
  const getConversationId = () => {
    return user ? `client-${user.id}-service` : 'client-anonymous-service';
  };

  const toggleEmojiPicker = () => {
    setIsEmojiPickerOpen(!isEmojiPickerOpen);
  };

  const { data: conversation, isLoading, error } = useQuery<Conversation>({
    queryKey: ['clientConversation', user?.id],
    queryFn: async () => {
      if (!user) throw new Error('Utilisateur non authentifié');
      const response = await clientChatAPI.getServiceChat();
      const conversationData = response.data;
      // S'assurer qu'on a un ID de conversation
      if (!conversationData.id) {
        conversationData.id = getConversationId();
      }
      return conversationData;
    },
    enabled: !!user,
    refetchOnMount: true,
    refetchOnReconnect: true,
    refetchInterval: 2000,
  });

  // Mutation pour envoyer un message
  const sendMessageMutation = useMutation({
    mutationFn: async (messageText: string) => {
      if (!user) throw new Error('Utilisateur non authentifié');
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
      const conversationId = getConversationId();
      
      return chatFilesAPI.uploadServiceFile(conversationId, file, messageText);
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
    mutationFn: async ({ messageId }: { messageId: string }) => {
      const conversationId = getConversationId();
      return chatFilesAPI.deleteFile(messageId, conversationId, 'service');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clientConversation'] });
      toast.success('Fichier supprimé avec succès');
      setDeleteDialogOpen(false);
      setFileToDelete(null);
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
    uploadFileMutation.mutate({ 
      file, 
      messageText: `📎 Fichier partagé: ${file.name}` 
    });
  };

  // Gestionnaire d'enregistrement vocal
  const handleVoiceRecording = (audioBlob: Blob) => {
    // Create a File object using a different approach to avoid TypeScript issues
    const audioFile = Object.assign(audioBlob, {
      name: `audio-${Date.now()}.wav`,
      lastModified: Date.now()
    }) as File;
    
    uploadFileMutation.mutate({ 
      file: audioFile, 
      messageText: `🎤 Message vocal envoyé` 
    });
  };

  // Gestionnaire de suppression de fichier avec confirmation
  const handleFileDeleteRequest = (messageId: string) => {
    setFileToDelete(messageId);
    setDeleteDialogOpen(true);
  };

  const confirmFileDelete = () => {
    if (fileToDelete) {
      deleteFileMutation.mutate({ messageId: fileToDelete });
    }
  };

  // Gestionnaire de téléchargement de fichier
  const handleFileDownload = (attachment: FileAttachment) => {
    const downloadUrl = `${import.meta.env.VITE_API_URL}${attachment.url}`;
    const link = document.createElement('a');
    link.href = downloadUrl;
    link.download = attachment.originalName;
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Gestionnaire de sélection d'emoji
  const handleEmojiSelect = (emoji: any) => {
    setMessage((prev) => prev + emoji.native);
    setIsEmojiPickerOpen(false);
  };

  // Fonction pour obtenir l'icône selon le type de fichier
  const getFileIcon = (mimetype: string) => {
    if (mimetype.startsWith('image/')) return <Image className="h-5 w-5" />;
    if (mimetype.startsWith('video/')) return <Video className="h-5 w-5" />;
    if (mimetype.startsWith('audio/')) return <Music className="h-5 w-5" />;
    return <File className="h-5 w-5" />;
  };

  // Fonction pour formater la taille des fichiers
  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  // Composant pour afficher les fichiers avec design moderne
  const FilePreview: React.FC<{ 
    attachment: FileAttachment; 
    canDelete: boolean; 
    onDelete: () => void;
    messageId: string;
  }> = ({ attachment, canDelete, onDelete, messageId }) => {
    const isImage = attachment.mimetype.startsWith('image/');
    const isVideo = attachment.mimetype.startsWith('video/');
    const isAudio = attachment.mimetype.startsWith('audio/');

    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative bg-gradient-to-br from-white/20 to-white/5 backdrop-blur-xl rounded-3xl p-5 border border-white/20 shadow-2xl max-w-sm hover:shadow-3xl transition-all duration-500"
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-primary/20 rounded-2xl backdrop-blur-sm">
              {isImage && <Image className="h-6 w-6 text-primary" />}
              {isVideo && <Video className="h-6 w-6 text-primary" />}
              {isAudio && <Music className="h-6 w-6 text-primary" />}
              {!isImage && !isVideo && !isAudio && <File className="h-6 w-6 text-primary" />}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-white truncate">
                {attachment.originalName}
              </p>
              <p className="text-xs text-white/60">
                {((attachment.size || 0) / 1024 / 1024).toFixed(2)} MB
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => handleFileDownload(attachment)}
              className="h-10 w-10 text-white/70 hover:text-white hover:bg-white/10 rounded-xl transition-all duration-300"
            >
              <Download className="h-4 w-4" />
            </Button>
            
            {canDelete && (
              <Button
                variant="ghost"
                size="icon"
                onClick={onDelete}
                className="h-10 w-10 text-red-300 hover:text-red-100 hover:bg-red-500/20 rounded-xl transition-all duration-300"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>

        {/* Prévisualisations avec design amélioré */}
        {isImage && (
          <div className="mt-4 rounded-2xl overflow-hidden shadow-inner">
            <img
              src={`${import.meta.env.VITE_API_URL}${attachment.url}`}
              alt={attachment.originalName}
              className="w-full h-40 object-cover cursor-pointer hover:scale-105 transition-transform duration-300"
              onClick={() => handleFileDownload(attachment)}
            />
          </div>
        )}

        {isVideo && (
          <div className="mt-4 rounded-2xl overflow-hidden shadow-inner">
            <video
              src={`${import.meta.env.VITE_API_URL}${attachment.url}`}
              className="w-full h-40 object-cover rounded-2xl"
              controls
              preload="metadata"
            />
          </div>
        )}

        {isAudio && (
          <div className="mt-4">
            <audio
              src={`${import.meta.env.VITE_API_URL}${attachment.url}`}
              className="w-full"
              controls
              preload="metadata"
            />
          </div>
        )}
      </motion.div>
    );
  };

  const activeConversation = conversation;

  return (
    <Layout>
      <div className="flex flex-col h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
        {/* Effets de fond animés */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10 animate-pulse" />
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-bounce" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse" />
        
        {/* Header Premium Ultra Moderne */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative bg-white/10 backdrop-blur-2xl border-b border-white/20 shadow-2xl z-10"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 via-purple-600/20 to-pink-600/20" />
          <div className="relative container mx-auto flex items-center justify-between p-6">
            <motion.div 
              className="flex items-center space-x-6"
              whileHover={{ scale: 1.02 }}
            >
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 rounded-3xl blur opacity-75 animate-pulse" />
                <div className="relative flex items-center justify-center w-16 h-16 rounded-3xl bg-gradient-to-r from-blue-500 to-purple-600 shadow-2xl">
                  <Bot className="w-8 h-8 text-white" />
                </div>
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-white via-blue-200 to-purple-200 bg-clip-text text-transparent">
                  Service Client Premium Elite
                </h1>
                <p className="text-lg text-white/70 font-medium">Support instantané et professionnel 24/7</p>
              </div>
            </motion.div>
            
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button
                variant={isOpen ? "destructive" : "default"}
                size="lg"
                className={`rounded-2xl shadow-2xl transition-all duration-500 hover:shadow-3xl backdrop-blur-sm border-2 ${
                  isOpen 
                    ? "bg-gradient-to-r from-red-500 to-pink-600 border-red-400/50 hover:from-red-600 hover:to-pink-700" 
                    : "bg-gradient-to-r from-blue-500 to-purple-600 border-blue-400/50 hover:from-blue-600 hover:to-purple-700"
                } text-white font-semibold px-8 py-3`}
                onClick={() => setIsOpen(!isOpen)}
              >
                {isOpen ? (
                  <>
                    <X className="w-6 h-6 mr-3" />
                    Fermer le Chat
                  </>
                ) : (
                  <>
                    <Bot className="w-6 h-6 mr-3" />
                    Ouvrir le Chat Premium
                  </>
                )}
              </Button>
            </motion.div>
          </div>
        </motion.div>

        {/* Interface Chat */}
        <div className="container mx-auto flex-1 p-6 relative z-10">
          {/* Messages d'erreur et de chargement avec design moderne */}
          {error && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center p-10"
            >
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-red-500/20 text-red-400 mb-6 backdrop-blur-xl">
                <X className="w-10 h-10" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-3">Erreur de connexion</h3>
              <p className="text-white/60 text-lg">Impossible de charger la conversation</p>
            </motion.div>
          )}

          {isLoading && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center p-10"
            >
              <div className="inline-flex items-center space-x-4 text-white/70">
                <div className="w-3 h-3 bg-blue-500 rounded-full animate-bounce" />
                <div className="w-3 h-3 bg-purple-500 rounded-full animate-bounce [animation-delay:0.1s]" />
                <div className="w-3 h-3 bg-pink-500 rounded-full animate-bounce [animation-delay:0.2s]" />
                <span className="ml-6 font-semibold text-xl">Chargement de la conversation...</span>
              </div>
            </motion.div>
          )}

          <AnimatePresence mode="wait">
            {activeConversation && isOpen ? (
              <motion.div
                key="chat-open"
                initial={{ opacity: 0, y: 40, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -40, scale: 0.9 }}
                transition={{ type: "spring", stiffness: 200, damping: 25 }}
                className="flex flex-col h-full max-h-[calc(100vh-200px)] bg-white/10 backdrop-blur-2xl rounded-3xl shadow-2xl border border-white/20 overflow-hidden"
              >
                {/* Zone des Messages avec scroll moderne */}
                <ScrollArea className="flex-1 p-8 space-y-8">
                  <AnimatePresence initial={false}>
                    {activeConversation.messages.map((msg, index) => (
                      <motion.div
                        key={msg.id}
                        initial={{ opacity: 0, y: 30, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -30, scale: 0.9 }}
                        transition={{ delay: index * 0.1 }}
                        className={`flex items-start gap-6 ${msg.senderId === user?.id ? "flex-row-reverse" : ""}`}
                      >
                        {/* Avatar avec animations */}
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
                            <div className="relative">
                              <div className="absolute inset-0 bg-gradient-to-r from-green-400 to-blue-500 rounded-full blur opacity-75" />
                              <div className="relative flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-r from-green-400 to-blue-500 shadow-2xl">
                                <Bot className="w-6 h-6 text-white" />
                              </div>
                            </div>
                          )}
                        </motion.div>

                        {/* Contenu du Message */}
                        <div className={`max-w-[75%] ${msg.senderId === user?.id ? "items-end" : "items-start"} flex flex-col space-y-3`}>
                          {/* Message Texte avec design ultra moderne */}
                          <motion.div
                            whileHover={{ scale: 1.02 }}
                            className={`relative p-6 rounded-3xl shadow-2xl transition-all duration-500 hover:shadow-3xl backdrop-blur-xl ${
                              msg.isSystemMessage
                                ? "bg-white/20 text-white text-center italic border border-white/30"
                                : msg.senderId === user?.id
                                ? "bg-gradient-to-br from-blue-500/90 to-purple-600/90 text-white ml-auto border border-blue-400/30"
                                : "bg-gradient-to-br from-white/20 to-white/10 text-white border border-white/30"
                            }`}
                          >
                            {/* Queue de bulle moderne */}
                            {!msg.isSystemMessage && (
                              <div
                                className={`absolute w-0 h-0 ${
                                  msg.senderId === user?.id
                                    ? "right-0 top-6 border-l-[16px] border-l-blue-500/90 border-t-[10px] border-t-transparent border-b-[10px] border-b-transparent translate-x-full"
                                    : "left-0 top-6 border-r-[16px] border-r-white/20 border-t-[10px] border-t-transparent border-b-[10px] border-b-transparent -translate-x-full"
                                }`}
                              />
                            )}
                            
                            <p className="text-sm leading-relaxed font-medium">{msg.content}</p>
                            
                            <div className={`flex items-center justify-between mt-3 pt-3 border-t ${
                              msg.senderId === user?.id 
                                ? "border-white/30" 
                                : "border-white/20"
                            }`}>
                              <span className={`text-xs font-medium ${
                                msg.senderId === user?.id 
                                  ? "text-white/80" 
                                  : "text-white/60"
                              }`}>
                                {format(new Date(msg.timestamp), 'HH:mm', { locale: fr })}
                              </span>
                            </div>
                          </motion.div>

                          {/* Fichier Joint avec design premium */}
                          {msg.fileAttachment && (
                            <motion.div
                              initial={{ opacity: 0, scale: 0.8 }}
                              animate={{ opacity: 1, scale: 1 }}
                              className={msg.senderId === user?.id ? "ml-auto" : ""}
                            >
                              <FilePreview
                                attachment={msg.fileAttachment}
                                canDelete={msg.senderId === user?.id}
                                onDelete={() => handleFileDeleteRequest(msg.id)}
                                messageId={msg.id}
                              />
                            </motion.div>
                          )}
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                  <div ref={messagesEndRef} />
                </ScrollArea>

                {/* Zone de Saisie Ultra Moderne */}
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="relative border-t border-white/20 bg-white/5 backdrop-blur-2xl p-8"
                >
                  <div className="flex items-center gap-4">
                    {/* Bouton Upload de Fichier */}
                    <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                      <FileUploadButton
                        onFileSelect={handleFileSelect}
                        accept="image/*,video/*,audio/*,.pdf,.doc,.docx,.txt,.zip,.rar,.ppt,.pptx,.xls,.xlsx"
                        maxSize={50}
                        disabled={uploadFileMutation.isPending}
                      />
                    </motion.div>
                    
                    {/* Enregistreur Vocal */}
                    <motion.div whileHover={{ scale: 1.05 }}>
                      <VoiceRecorder
                        onRecordingComplete={handleVoiceRecording}
                        disabled={uploadFileMutation.isPending}
                      />
                    </motion.div>
                    
                    {/* Champ de Saisie */}
                    <div className="relative flex-1">
                      <Input
                        placeholder="💬 Écrivez votre message magique..."
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" && !e.shiftKey) {
                            e.preventDefault();
                            handleSendMessage();
                          }
                        }}
                        className="pr-16 rounded-2xl border-2 border-white/20 bg-white/10 backdrop-blur-xl focus:border-blue-400/50 focus:ring-2 focus:ring-blue-400/20 transition-all duration-500 text-white placeholder-white/50 font-medium py-4 text-lg"
                        disabled={sendMessageMutation.isPending}
                      />
                      
                      {/* Bouton Emoji */}
                      <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={toggleEmojiPicker}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-white/70 hover:text-white hover:bg-white/10 transition-all duration-300 rounded-xl"
                        >
                          <Smile className="h-6 w-6" />
                        </Button>
                      </motion.div>
                    </div>
                    
                    {/* Bouton Envoyer */}
                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                      <Button
                        onClick={handleSendMessage}
                        disabled={sendMessageMutation.isPending || !message.trim()}
                        className="rounded-2xl shadow-2xl transition-all duration-500 hover:shadow-3xl bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold px-8 py-4 border border-blue-400/30"
                      >
                        {sendMessageMutation.isPending ? (
                          <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        ) : (
                          <Send className="h-6 w-6" />
                        )}
                      </Button>
                    </motion.div>
                  </div>

                  {/* Sélecteur d'Emoji avec design moderne */}
                  <AnimatePresence>
                    {isEmojiPickerOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 20, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.9 }}
                        className="absolute bottom-24 right-8 z-50 bg-white/95 backdrop-blur-2xl border border-white/30 rounded-3xl shadow-2xl overflow-hidden"
                      >
                        <Picker 
                          data={data} 
                          onEmojiSelect={handleEmojiSelect} 
                          theme="light"
                          previewPosition="none"
                        />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              </motion.div>
            ) : (
              !isLoading && (
                <motion.div
                  key="chat-closed"
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -40 }}
                  className="text-center py-24"
                >
                  <motion.div 
                    className="inline-flex items-center justify-center w-32 h-32 rounded-full bg-gradient-to-br from-white/20 to-white/5 backdrop-blur-xl mb-8 shadow-2xl"
                    animate={{ 
                      boxShadow: [
                        "0 0 20px rgba(59, 130, 246, 0.3)",
                        "0 0 40px rgba(147, 51, 234, 0.4)",
                        "0 0 20px rgba(59, 130, 246, 0.3)"
                      ]
                    }}
                    transition={{ duration: 3, repeat: Infinity }}
                  >
                    <Bot className="w-16 h-16 text-white" />
                  </motion.div>
                  <h3 className="text-4xl font-bold text-white mb-4">
                    {activeConversation ? "Chat Fermé" : "Aucune Conversation"}
                  </h3>
                  <p className="text-white/60 text-xl max-w-md mx-auto leading-relaxed">
                    {activeConversation 
                      ? "Cliquez sur 'Ouvrir le Chat Premium' pour continuer la conversation magique" 
                      : "Aucune conversation active pour le moment"
                    }
                  </p>
                </motion.div>
              )
            )}
          </AnimatePresence>
        </div>

        {/* Dialog de Confirmation de Suppression Ultra Moderne */}
        <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
          <AlertDialogContent className="bg-gradient-to-br from-slate-900/95 to-purple-900/95 backdrop-blur-2xl border-2 border-white/20 shadow-2xl">
            <AlertDialogHeader>
              <AlertDialogTitle className="text-2xl font-bold text-white flex items-center gap-3">
                <div className="p-3 bg-red-500/20 rounded-2xl">
                  <Trash2 className="h-6 w-6 text-red-400" />
                </div>
                Supprimer le fichier
              </AlertDialogTitle>
              <AlertDialogDescription className="text-white/70 text-lg leading-relaxed">
                Êtes-vous sûr de vouloir supprimer ce fichier ? Cette action est irréversible et le fichier sera définitivement supprimé de la base de données.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter className="gap-3">
              <AlertDialogCancel 
                onClick={() => setDeleteDialogOpen(false)}
                className="bg-white/10 border-white/20 text-white hover:bg-white/20 backdrop-blur-xl rounded-xl font-semibold"
              >
                Annuler
              </AlertDialogCancel>
              <AlertDialogAction 
                onClick={confirmFileDelete}
                className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 rounded-xl font-semibold"
              >
                Supprimer définitivement
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </Layout>
  );
};

export default ChatPage;
