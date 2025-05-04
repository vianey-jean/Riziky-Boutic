
import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Send, Edit, Trash2, Smile, X } from 'lucide-react';
import { clientChatAPI, Message } from '@/services/api';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from '@/components/ui/sonner';
import { 
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import data from '@emoji-mart/data';
import Picker from '@emoji-mart/react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

interface ClientChatProps {
  onClose?: () => void;
}

const ClientChat: React.FC<ClientChatProps> = ({ onClose }) => {
  const { user: currentUser } = useAuth();
  const [messageText, setMessageText] = useState('');
  const [editingMessageId, setEditingMessageId] = useState<string | null>(null);
  const [editText, setEditText] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const queryClient = useQueryClient();

  // Récupérer les informations du service client
  const { data: serviceClientData } = useQuery({
    queryKey: ['serviceClient'],
    queryFn: async () => {
      try {
        const response = await clientChatAPI.getServiceClient();
        return response.data;
      } catch (error) {
        console.error('Erreur lors du chargement du service client:', error);
        return null;
      }
    },
    enabled: !!currentUser,
  });

  // Vérifier le statut en ligne du service client
  const { data: serviceClientStatus } = useQuery({
    queryKey: ['serviceClientStatus'],
    queryFn: async () => {
      try {
        const response = await clientChatAPI.checkServiceClientStatus();
        return response.data;
      } catch (error) {
        console.error('Erreur lors de la vérification du statut du service client:', error);
        return { isOnline: false };
      }
    },
    refetchInterval: 10000, // Vérifier toutes les 10 secondes
    enabled: !!currentUser,
  });

  // Récupérer la conversation - Augmentation de la fréquence de rafraîchissement
  const { data: conversation, isLoading: isLoadingConversation } = useQuery({
    queryKey: ['clientConversation'],
    queryFn: async () => {
      try {
        // Ajout de timestamp pour éviter le cache client
        const timestamp = new Date().getTime();
        const response = await clientChatAPI.getMyConversation(timestamp);
        console.log("Conversation récupérée:", response.data);
        
        // Vérifiez si response.data et response.data.messages existent
        if (!response.data || !response.data.messages) {
          console.warn("Données de conversation manquantes ou format incorrect:", response.data);
          return { messages: [] };
        }
        
        return response.data;
      } catch (error) {
        console.error('Erreur lors du chargement de la conversation:', error);
        return { messages: [] };
      }
    },
    enabled: !!currentUser,
    refetchInterval: 1000, // Rafraîchir toutes les 1 seconde pour une mise à jour plus rapide
    staleTime: 0,  // Les données sont considérées comme périmées immédiatement
    gcTime: 0   // Utiliser gcTime au lieu de cacheTime
  });

  // Mutation pour envoyer un message avec mise à jour optimiste UI améliorée
  const sendMessageMutation = useMutation({
    mutationFn: (message: string) => {
      console.log("Tentative d'envoi de message:", message);
      return clientChatAPI.sendMessage(message);
    },
    onMutate: async (newMessage) => {
      // Annuler les requêtes en cours pour éviter les conflits
      await queryClient.cancelQueries({ queryKey: ['clientConversation'] });
      
      // Sauvegarder l'état précédent
      const previousConversation = queryClient.getQueryData(['clientConversation']);
      
      // Optimistic update avec le nouveau message et ID persistant
      if (currentUser) {
        queryClient.setQueryData(['clientConversation'], (old: any) => {
          if (!old || !old.messages) return { messages: [] };
          
          // Créer un ID persistant pour l'optimistic update
          const persistentId = `temp-${Date.now()}`;
          
          const optimisticMessage = {
            id: persistentId,
            senderId: currentUser.id,
            content: newMessage,
            timestamp: new Date().toISOString(),
            read: false,
            isPersistent: true, // Marqueur pour empêcher la suppression
            isOptimistic: true // Marqueur pour identifier ce message comme optimiste
          };
          
          return {
            ...old,
            messages: [...old.messages, optimisticMessage]
          };
        });
      }
      
      return { previousConversation };
    },
    onSuccess: (data) => {
      console.log("Message envoyé avec succès, réponse:", data);
      setMessageText('');
      
      // Attendre un court délai avant d'invalider les requêtes pour éviter les conflits
      setTimeout(() => {
        queryClient.invalidateQueries({ queryKey: ['clientConversation'] });
      }, 300);
      
      toast.success("Message envoyé! 📨");
    },
    onError: (error, variables, context) => {
      console.error("Erreur lors de l'envoi du message:", error);
      toast.error("L'envoi du message a échoué. Veuillez réessayer. ❌");
      
      // Restaurer l'état précédent
      if (context?.previousConversation) {
        queryClient.setQueryData(['clientConversation'], context.previousConversation);
      }
    }
  });

  // Mutation pour modifier un message avec optimistic update
  const editMessageMutation = useMutation({
    mutationFn: ({ messageId, content, conversationId }: { messageId: string; content: string; conversationId: string }) => 
      clientChatAPI.editMessage(messageId, content, conversationId),
    onMutate: async ({ messageId, content }) => {
      // Optimistic update pour l'édition
      await queryClient.cancelQueries({ queryKey: ['clientConversation'] });
      const previousConversation = queryClient.getQueryData(['clientConversation']);
      
      queryClient.setQueryData(['clientConversation'], (old: any) => {
        if (!old || !old.messages) return old;
        
        return {
          ...old,
          messages: old.messages.map((msg: any) => 
            msg.id === messageId ? { ...msg, content, isEdited: true } : msg
          )
        };
      });
      
      return { previousConversation };
    },
    onSuccess: () => {
      setEditingMessageId(null);
      setEditText('');
      
      // Attendre un court délai avant d'invalider les requêtes
      setTimeout(() => {
        queryClient.invalidateQueries({ queryKey: ['clientConversation'] });
      }, 300);
      
      toast.success("Message modifié avec succès 👍");
    },
    onError: (error, variables, context) => {
      toast.error("La modification du message a échoué ❌");
      
      // Restaurer l'état précédent
      if (context?.previousConversation) {
        queryClient.setQueryData(['clientConversation'], context.previousConversation);
      }
    },
  });

  // Mutation pour supprimer un message avec optimistic update
  const deleteMessageMutation = useMutation({
    mutationFn: ({ messageId, conversationId }: { messageId: string; conversationId: string }) => 
      clientChatAPI.deleteMessage(messageId, conversationId),
    onMutate: async ({ messageId }) => {
      // Optimistic update pour la suppression
      await queryClient.cancelQueries({ queryKey: ['clientConversation'] });
      const previousConversation = queryClient.getQueryData(['clientConversation']);
      
      queryClient.setQueryData(['clientConversation'], (old: any) => {
        if (!old || !old.messages) return old;
        
        return {
          ...old,
          messages: old.messages.filter((msg: any) => msg.id !== messageId)
        };
      });
      
      return { previousConversation };
    },
    onSuccess: () => {
      // Attendre un court délai avant d'invalider les requêtes
      setTimeout(() => {
        queryClient.invalidateQueries({ queryKey: ['clientConversation'] });
      }, 300);
      
      toast.success("Message supprimé 🗑️");
    },
    onError: (error, variables, context) => {
      toast.error("La suppression du message a échoué ❌");
      
      // Restaurer l'état précédent
      if (context?.previousConversation) {
        queryClient.setQueryData(['clientConversation'], context.previousConversation);
      }
    },
  });

  // Mutation pour marquer un message comme lu
  const markAsReadMutation = useMutation({
    mutationFn: ({ messageId, conversationId }: { messageId: string; conversationId: string }) =>
      clientChatAPI.markMessageAsRead(messageId, conversationId),
    onSuccess: () => {
      console.log("Message marqué comme lu");
    },
    onError: (error) => {
      console.error("Erreur lors du marquage du message comme lu:", error);
    },
  });

  // Marquer les messages non lus comme lus
  useEffect(() => {
    if (!currentUser || !serviceClientData || !conversation?.messages) return;
    
    const conversationId = currentUser.id < serviceClientData.id
      ? `${currentUser.id}-${serviceClientData.id}`
      : `${serviceClientData.id}-${currentUser.id}`;
    
    // Trouver les messages non lus envoyés par le service client
    const unreadMessages = conversation.messages.filter(
      msg => !msg.read && msg.senderId === serviceClientData.id
    );
    
    // Marquer chaque message non lu comme lu
    unreadMessages.forEach(msg => {
      markAsReadMutation.mutate({ messageId: msg.id, conversationId });
    });
  }, [conversation?.messages, currentUser, serviceClientData]);

  // Défiler vers le bas quand de nouveaux messages arrivent ou sont envoyés
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [conversation?.messages]);

  const handleSendMessage = () => {
    if (!messageText.trim() || !currentUser) return;
    console.log("handleSendMessage appelé avec:", messageText);
    sendMessageMutation.mutate(messageText);
  };

  const handleEditMessage = () => {
    if (!editText.trim() || !editingMessageId || !conversation) return;
    
    // Rechercher la conversation ID
    if (!currentUser || !serviceClientData) return;
    
    const conversationId = currentUser.id < serviceClientData.id
      ? `${currentUser.id}-${serviceClientData.id}`
      : `${serviceClientData.id}-${currentUser.id}`;
    
    editMessageMutation.mutate({ 
      messageId: editingMessageId, 
      content: editText,
      conversationId
    });
  };

  const startEditMessage = (message: Message) => {
    setEditingMessageId(message.id);
    setEditText(message.content);
  };

  const handleDeleteMessage = (messageId: string) => {
    if (!currentUser || !serviceClientData || !confirm('Êtes-vous sûr de vouloir supprimer ce message ?')) return;
    
    const conversationId = currentUser.id < serviceClientData.id
      ? `${currentUser.id}-${serviceClientData.id}`
      : `${serviceClientData.id}-${currentUser.id}`;
    
    deleteMessageMutation.mutate({ messageId, conversationId });
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('fr-FR', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

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

  const handleEmojiSelect = (emoji: any) => {
    setMessageText((prev) => prev + emoji.native);
  };

  const handleEditEmojiSelect = (emoji: any) => {
    setEditText((prev) => prev + emoji.native);
  };

  // Si utilisé comme Dialog
  if (isDialogOpen) {
    return (
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="w-full max-w-md sm:max-w-lg md:max-w-xl p-0">
          <DialogTitle className="sr-only">Service client</DialogTitle>
          <ChatContent 
            currentUser={currentUser}
            serviceClientData={serviceClientData}
            serviceClientStatus={serviceClientStatus}
            conversation={conversation}
            isLoadingConversation={isLoadingConversation}
            messageText={messageText}
            setMessageText={setMessageText}
            editingMessageId={editingMessageId}
            setEditingMessageId={setEditingMessageId}
            editText={editText}
            setEditText={setEditText}
            messagesEndRef={messagesEndRef}
            handleSendMessage={handleSendMessage}
            handleEditMessage={handleEditMessage}
            startEditMessage={startEditMessage}
            handleDeleteMessage={handleDeleteMessage}
            formatTime={formatTime}
            getTimeAgo={getTimeAgo}
            handleEmojiSelect={handleEmojiSelect}
            handleEditEmojiSelect={handleEditEmojiSelect}
            onClose={() => setIsDialogOpen(false)}
          />
        </DialogContent>
      </Dialog>
    );
  }

  if (!currentUser) {
    return (
      <Card className="w-full h-[500px] flex items-center justify-center">
        <p>Veuillez vous connecter pour discuter avec le service client.</p>
      </Card>
    );
  }

  // Utilisation directe comme composant
  return (
    <Card className="w-full h-[500px] flex flex-col relative">
      <ChatContent 
        currentUser={currentUser}
        serviceClientData={serviceClientData}
        serviceClientStatus={serviceClientStatus}
        conversation={conversation}
        isLoadingConversation={isLoadingConversation}
        messageText={messageText}
        setMessageText={setMessageText}
        editingMessageId={editingMessageId}
        setEditingMessageId={setEditingMessageId}
        editText={editText}
        setEditText={setEditText}
        messagesEndRef={messagesEndRef}
        handleSendMessage={handleSendMessage}
        handleEditMessage={handleEditMessage}
        startEditMessage={startEditMessage}
        handleDeleteMessage={handleDeleteMessage}
        formatTime={formatTime}
        getTimeAgo={getTimeAgo}
        handleEmojiSelect={handleEmojiSelect}
        handleEditEmojiSelect={handleEditEmojiSelect}
        onClose={onClose}
      />
    </Card>
  );
};

// Séparation du contenu pour éviter la duplication de code
interface ChatContentProps {
  currentUser: any;
  serviceClientData: any;
  serviceClientStatus: any;
  conversation: any;
  isLoadingConversation: boolean;
  messageText: string;
  setMessageText: React.Dispatch<React.SetStateAction<string>>;
  editingMessageId: string | null;
  setEditingMessageId: React.Dispatch<React.SetStateAction<string | null>>;
  editText: string;
  setEditText: React.Dispatch<React.SetStateAction<string>>;
  messagesEndRef: React.RefObject<HTMLDivElement>;
  handleSendMessage: () => void;
  handleEditMessage: () => void;
  startEditMessage: (message: Message) => void;
  handleDeleteMessage: (messageId: string) => void;
  formatTime: (dateString: string) => string;
  getTimeAgo: (dateString?: string) => string;
  handleEmojiSelect: (emoji: any) => void;
  handleEditEmojiSelect: (emoji: any) => void;
  onClose?: () => void;
}

const ChatContent: React.FC<ChatContentProps> = ({
  currentUser,
  serviceClientData,
  serviceClientStatus,
  conversation,
  isLoadingConversation,
  messageText,
  setMessageText,
  editingMessageId,
  setEditingMessageId,
  editText,
  setEditText,
  messagesEndRef,
  handleSendMessage,
  handleEditMessage,
  startEditMessage,
  handleDeleteMessage,
  formatTime,
  getTimeAgo,
  handleEmojiSelect,
  handleEditEmojiSelect,
  onClose,
}) => {
  // Ensure conversation.messages is always an array
  const messages = conversation?.messages || [];

  // Préserver les messages optimistiques dans l'interface
  const preservedMessages = React.useMemo(() => {
    // S'assurer que les messages existent et sont un tableau
    if (!Array.isArray(messages)) return [];
    
    // Filtre pour éliminer les doublons potentiels en cas de conflit d'ID
    const messageIds = new Set();
    return messages
      .filter(message => {
        if (messageIds.has(message.id)) {
          // Si un ID existe déjà, garder seulement la version non-optimistique
          return !message.isOptimistic;
        }
        messageIds.add(message.id);
        return true;
      });
  }, [messages]);

  return (
    <>
      {/* Header */}
      <div className="p-4 border-b flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="relative">
            <div className="w-10 h-10 bg-red-800 text-white rounded-full flex items-center justify-center">
              SC
            </div>
            <div className={`absolute bottom-0 right-0 w-3 h-3 rounded-full ${
              serviceClientStatus?.isOnline ? 'bg-green-500' : 'bg-gray-400'
            }`}></div>
          </div>
          <div>
            <h2 className="font-semibold">Service Client</h2>
            <p className="text-xs text-muted-foreground">
              {serviceClientStatus?.isOnline ? 'En ligne 🟢' : `Dernier accès ${getTimeAgo(serviceClientStatus?.lastSeen)} ⏱️`}
            </p>
          </div>
        </div>
        {onClose && (
          <Button 
            variant="ghost" 
            size="icon"
            onClick={onClose}
            className="h-8 w-8"
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>
      
      {/* Messages */}
      <ScrollArea className="flex-1 p-4">
        {isLoadingConversation ? (
          <div className="text-center p-4">Chargement de la conversation... ⏳</div>
        ) : preservedMessages.length === 0 ? (
          <div className="text-center p-4 text-muted-foreground">
            Aucun message. Démarrez la conversation ! 😀
          </div>
        ) : (
          <div className="space-y-4">
            {preservedMessages.map((message: Message) => (
              <div key={message.id} className={`flex ${
                message.senderId === currentUser.id ? 'justify-end' : 'justify-start'
              }`}>
                {editingMessageId === message.id ? (
                  <div className="w-full max-w-[80%] bg-gray-50 p-3 rounded-lg">
                    <div className="flex">
                      <Input 
                        value={editText}
                        onChange={(e) => setEditText(e.target.value)}
                        className="flex-1 mr-2"
                      />
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button variant="outline" size="icon">
                            <Smile className="h-4 w-4" />
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-full p-0" side="top">
                          <Picker 
                            data={data}
                            onEmojiSelect={handleEditEmojiSelect}
                            theme="light"
                          />
                        </PopoverContent>
                      </Popover>
                      <Button 
                        onClick={handleEditMessage} 
                        className="ml-2 bg-red-800 hover:bg-red-700"
                        disabled={false}
                      >
                        Enregistrer ✅
                      </Button>
                      <Button 
                        variant="ghost" 
                        onClick={() => setEditingMessageId(null)} 
                        className="ml-2"
                      >
                        Annuler ❌
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className={`max-w-[70%] p-3 rounded-lg relative group ${
                    message.senderId === currentUser.id 
                      ? 'bg-green-600 text-white'  // Couleur verte pour les messages envoyés
                      : 'bg-red-800 text-white'   // Couleur grenat pour les messages reçus
                  }`}>
                    {message.senderId === currentUser.id && !message.isAutoReply && (
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="absolute right-0 top-0 opacity-0 group-hover:opacity-100 h-6 w-6 text-white"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                          <DropdownMenuItem onClick={() => startEditMessage(message)}>
                            <Edit className="mr-2 h-4 w-4" /> Modifier ✏️
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem 
                            onClick={() => handleDeleteMessage(message.id)}
                            className="text-red-600"
                          >
                            <Trash2 className="mr-2 h-4 w-4" /> Supprimer 🗑️
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    )}
                    <p>{message.content}</p>
                    <div className="flex items-center justify-between mt-1">
                      <p className="text-xs opacity-80">
                        {formatTime(message.timestamp)}
                      </p>
                      {message.isEdited && (
                        <p className="text-xs opacity-80 ml-2">(modifié ✏️)</p>
                      )}
                      {message.isAutoReply && (
                        <p className="text-xs opacity-80 ml-2">(auto 🤖)</p>
                      )}
                      {message.isOptimistic && (
                        <p className="text-xs opacity-80 ml-2">(en cours d'envoi...)</p>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        )}
      </ScrollArea>
      
      {/* Input */}
      <div className="p-4 border-t">
        <form onSubmit={(e) => { e.preventDefault(); handleSendMessage(); }} className="flex space-x-2">
          <div className="relative flex-1">
            <Input
              value={messageText}
              onChange={(e) => setMessageText(e.target.value)}
              placeholder="Écrivez votre message... 😊"
              className="pr-10"
            />
            <Popover>
              <PopoverTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="absolute right-0 top-0 h-full"
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
            type="submit" 
            className="bg-red-800 hover:bg-red-700"
          >
            <Send className="h-4 w-4 mr-1" /> Envoyer
          </Button>
        </form>
      </div>
    </>
  );
};

export default ClientChat;
