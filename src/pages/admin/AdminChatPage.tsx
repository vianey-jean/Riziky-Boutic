
import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import AdminLayout from './AdminLayout';
import { adminChatAPI, clientChatAPI, Message } from '@/services/api';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Send, Edit, Trash2, User, MessageCircle, Smile } from 'lucide-react';
import { toast } from '@/components/ui/sonner';
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

const AdminChatPage: React.FC = () => {
  const { user: currentUser } = useAuth();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState<'admins' | 'clients'>('clients');
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [messageText, setMessageText] = useState('');
  const [editingMessage, setEditingMessage] = useState<Message | null>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  // Effet pour marquer le service client comme en ligne dès que la page est chargée
  useEffect(() => {
    if (currentUser && currentUser.role === 'admin' && currentUser.email === 'service.client@example.com') {
      const setServiceClientOnline = async () => {
        try {
          await clientChatAPI.setServiceClientOnline();
          console.log("Service client marqué comme en ligne");
        } catch (error) {
          console.error("Erreur lors de la mise à jour du statut en ligne:", error);
        }
      };
      
      setServiceClientOnline();
      
      // Marquer comme hors ligne lors du démontage du composant
      return () => {
        clientChatAPI.setServiceClientOffline()
          .then(() => console.log("Service client marqué comme hors ligne"))
          .catch(error => console.error("Erreur lors de la mise à jour du statut hors ligne:", error));
      };
    }
  }, [currentUser]);

  // Récupérer la liste des admins
  const { data: admins } = useQuery({
    queryKey: ['admins'],
    queryFn: async () => {
      try {
        const response = await adminChatAPI.getAdmins();
        return response.data;
      } catch (error) {
        console.error('Erreur lors du chargement des administrateurs:', error);
        return [];
      }
    },
    enabled: !!currentUser && activeTab === 'admins',
  });

  // Récupérer la liste des clients avec conversations
  const { data: clients } = useQuery({
    queryKey: ['chatClients'],
    queryFn: async () => {
      try {
        const response = await clientChatAPI.getClients();
        console.log('Clients récupérés:', response.data);
        return response.data;
      } catch (error) {
        console.error('Erreur lors du chargement des clients:', error);
        return [];
      }
    },
    enabled: !!currentUser && activeTab === 'clients',
    refetchInterval: 5000, // Rafraîchir toutes les 5 secondes
  });

  // Récupérer la conversation sélectionnée
  const { data: conversation, isLoading: isLoadingConversation } = useQuery({
    queryKey: ['chatConversation', selectedUserId, activeTab],
    queryFn: async () => {
      if (!selectedUserId) return null;
      
      try {
        const timestamp = new Date().getTime(); // Ajouter un timestamp pour éviter le cache
        let response;
        
        if (activeTab === 'admins') {
          response = await adminChatAPI.getConversation(selectedUserId);
        } else {
          response = await clientChatAPI.getConversation(selectedUserId);
        }
        
        console.log(`Conversation avec ${activeTab === 'admins' ? 'admin' : 'client'} ${selectedUserId}:`, response.data);
        return response.data || { messages: [] }; // Assurez-vous que messages existe toujours
      } catch (error) {
        console.error('Erreur lors du chargement de la conversation:', error);
        return { messages: [] }; // Retourner un tableau vide en cas d'erreur
      }
    },
    enabled: !!currentUser && !!selectedUserId,
    refetchInterval: 1000, // Rafraîchir toutes les 1 seconde
    staleTime: 0, // Toujours considérer les données comme périmées
    gcTime: 0, // Ne pas utiliser de cache
  });

  // Envoyer un message
  const sendMessageMutation = useMutation({
    mutationFn: (content: string) => {
      if (!selectedUserId) {
        throw new Error('Aucun utilisateur sélectionné');
      }
      
      if (activeTab === 'admins') {
        return adminChatAPI.sendMessage(selectedUserId, content);
      } else {
        // Utilisation de l'API client comme service client
        return clientChatAPI.sendMessage(content);
      }
    },
    onMutate: async (newMessage) => {
      // Annuler les requêtes en cours
      await queryClient.cancelQueries({ queryKey: ['chatConversation', selectedUserId, activeTab] });
      
      // Sauvegarder l'état précédent
      const previousConversation = queryClient.getQueryData(['chatConversation', selectedUserId, activeTab]);
      
      // Optimistic update avec ID persistant
      if (currentUser && selectedUserId) {
        queryClient.setQueryData(['chatConversation', selectedUserId, activeTab], (old: any) => {
          if (!old || !old.messages) return { messages: [], participants: [currentUser.id, selectedUserId] };
          
          // Créer un ID persistant basé sur l'horodatage
          const persistentId = `temp-${Date.now()}`;
          
          const optimisticMessage = {
            id: persistentId,
            senderId: currentUser.id,
            content: newMessage,
            timestamp: new Date().toISOString(),
            read: false,
            isPersistent: true, // Marqueur pour empêcher la suppression
            isOptimistic: true
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
      
      // Au lieu d'invalider immédiatement, attendez un court délai
      setTimeout(() => {
        queryClient.invalidateQueries({ queryKey: ['chatConversation', selectedUserId, activeTab] });
        // Pour les clients, invalidez également la liste des clients pour mettre à jour les compteurs
        if (activeTab === 'clients') {
          queryClient.invalidateQueries({ queryKey: ['chatClients'] });
        }
      }, 300);
      
      toast.success("Message envoyé! 📨");
    },
    onError: (error, variables, context) => {
      console.error("Erreur lors de l'envoi du message:", error);
      toast.error("L'envoi du message a échoué. Veuillez réessayer. ❌");
      
      // Restaurer l'état précédent
      if (context?.previousConversation) {
        queryClient.setQueryData(['chatConversation', selectedUserId, activeTab], context.previousConversation);
      }
    }
  });

  // Éditer un message
  const editMessageMutation = useMutation({
    mutationFn: ({ messageId, content, conversationId }: { messageId: string; content: string; conversationId: string }) => {
      if (activeTab === 'admins') {
        return adminChatAPI.editMessage(messageId, content, conversationId);
      } else {
        // En tant que service client, utiliser l'API client
        return clientChatAPI.editMessage(messageId, content, conversationId);
      }
    },
    onMutate: async ({ messageId, content }) => {
      // Optimistic update pour l'édition
      await queryClient.cancelQueries({ queryKey: ['chatConversation', selectedUserId, activeTab] });
      const previousConversation = queryClient.getQueryData(['chatConversation', selectedUserId, activeTab]);
      
      queryClient.setQueryData(['chatConversation', selectedUserId, activeTab], (old: any) => {
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
      setEditingMessage(null);
      // Au lieu d'invalider immédiatement, attendez un court délai
      setTimeout(() => {
        queryClient.invalidateQueries({ queryKey: ['chatConversation', selectedUserId, activeTab] });
      }, 300);
      toast.success("Message modifié avec succès 👍");
    },
    onError: (error, variables, context) => {
      toast.error("La modification du message a échoué ❌");
      // Restaurer l'état précédent
      if (context?.previousConversation) {
        queryClient.setQueryData(['chatConversation', selectedUserId, activeTab], context.previousConversation);
      }
    }
  });

  // Supprimer un message
  const deleteMessageMutation = useMutation({
    mutationFn: ({ messageId, conversationId }: { messageId: string; conversationId: string }) => {
      if (activeTab === 'admins') {
        return adminChatAPI.deleteMessage(messageId, conversationId);
      } else {
        // En tant que service client, utiliser l'API client
        return clientChatAPI.deleteMessage(messageId, conversationId);
      }
    },
    onMutate: async ({ messageId }) => {
      // Optimistic update pour la suppression
      await queryClient.cancelQueries({ queryKey: ['chatConversation', selectedUserId, activeTab] });
      const previousConversation = queryClient.getQueryData(['chatConversation', selectedUserId, activeTab]);
      
      queryClient.setQueryData(['chatConversation', selectedUserId, activeTab], (old: any) => {
        if (!old || !old.messages) return old;
        
        return {
          ...old,
          messages: old.messages.filter((msg: any) => msg.id !== messageId)
        };
      });
      
      return { previousConversation };
    },
    onSuccess: () => {
      // Au lieu d'invalider immédiatement, attendez un court délai
      setTimeout(() => {
        queryClient.invalidateQueries({ queryKey: ['chatConversation', selectedUserId, activeTab] });
      }, 300);
      toast.success("Message supprimé 🗑️");
    },
    onError: (error, variables, context) => {
      toast.error("La suppression du message a échoué ❌");
      // Restaurer l'état précédent
      if (context?.previousConversation) {
        queryClient.setQueryData(['chatConversation', selectedUserId, activeTab], context.previousConversation);
      }
    }
  });

  // Marquer un message comme lu
  const markAsReadMutation = useMutation({
    mutationFn: ({ messageId, conversationId }: { messageId: string; conversationId: string }) => {
      if (activeTab === 'admins') {
        return adminChatAPI.markAsRead(messageId, conversationId);
      } else {
        // En tant que service client, utiliser l'API client
        return clientChatAPI.markMessageAsRead(messageId, conversationId);
      }
    }
  });

  // Marquer les messages non lus comme lus
  useEffect(() => {
    if (!currentUser || !conversation?.messages || !selectedUserId) return;
    
    const conversationId = currentUser.id < selectedUserId
      ? `${currentUser.id}-${selectedUserId}`
      : `${selectedUserId}-${currentUser.id}`;
    
    // Trouver les messages non lus envoyés par l'autre utilisateur
    const unreadMessages = conversation.messages.filter(
      msg => !msg.read && msg.senderId !== currentUser.id
    );
    
    // Marquer chaque message non lu comme lu
    unreadMessages.forEach(msg => {
      markAsReadMutation.mutate({ messageId: msg.id, conversationId });
    });
  }, [conversation?.messages, currentUser, selectedUserId]);

  // Défiler vers le bas quand de nouveaux messages arrivent
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [conversation?.messages]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageText.trim()) return;
    
    sendMessageMutation.mutate(messageText);
  };

  const handleEditMessage = () => {
    if (!editingMessage || !selectedUserId) return;
    
    const conversationId = currentUser!.id < selectedUserId
      ? `${currentUser!.id}-${selectedUserId}`
      : `${selectedUserId}-${currentUser!.id}`;
    
    editMessageMutation.mutate({
      messageId: editingMessage.id,
      content: messageText,
      conversationId
    });
  };

  const startEditMessage = (message: Message) => {
    setEditingMessage(message);
    setMessageText(message.content);
  };

  const cancelEditMessage = () => {
    setEditingMessage(null);
    setMessageText('');
  };

  const handleDeleteMessage = (message: Message) => {
    if (!selectedUserId || !confirm('Êtes-vous sûr de vouloir supprimer ce message ?')) return;
    
    const conversationId = currentUser!.id < selectedUserId
      ? `${currentUser!.id}-${selectedUserId}`
      : `${selectedUserId}-${currentUser!.id}`;
    
    deleteMessageMutation.mutate({
      messageId: message.id,
      conversationId
    });
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('fr-FR', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleEmojiSelect = (emoji: any) => {
    setMessageText(prev => prev + emoji.native);
  };

  const getUserName = (userId: string) => {
    if (activeTab === 'admins' && admins) {
      const admin = admins.find(a => a.id === userId);
      return admin ? `${admin.prenom || ''} ${admin.nom}` : 'Administrateur';
    } else if (activeTab === 'clients' && clients) {
      const client = clients.find(c => c.id === userId);
      return client ? `${client.prenom || ''} ${client.nom}` : 'Client';
    }
    return 'Utilisateur';
  };

  return (
    <AdminLayout>
      <div className="container mx-auto py-8">
        <h1 className="text-3xl font-bold mb-8">Chat</h1>
        
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <Tabs defaultValue="clients" value={activeTab} onValueChange={(value) => setActiveTab(value as 'admins' | 'clients')}>
            <TabsList className="grid grid-cols-2 w-full">
              <TabsTrigger value="clients" className="py-3">
                <MessageCircle className="h-4 w-4 mr-2" /> Clients
              </TabsTrigger>
              <TabsTrigger value="admins" className="py-3">
                <User className="h-4 w-4 mr-2" /> Administrateurs
              </TabsTrigger>
            </TabsList>
            
            <div className="grid grid-cols-4 h-[600px] border-t">
              {/* Liste des utilisateurs */}
              <div className="col-span-1 border-r overflow-hidden">
                <ScrollArea className="h-[600px]">
                  <TabsContent value="clients" className="m-0 p-0">
                    {clients && clients.length > 0 ? (
                      <div className="divide-y">
                        {clients.map(client => (
                          <div 
                            key={client.id}
                            className={`p-3 cursor-pointer hover:bg-gray-50 transition-colors ${
                              selectedUserId === client.id ? 'bg-gray-100' : ''
                            }`}
                            onClick={() => setSelectedUserId(client.id)}
                          >
                            <div className="flex items-center">
                              <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-800 mr-3">
                                {(client.prenom?.[0] || '') + (client.nom?.[0] || 'C')}
                              </div>
                              <div className="flex-1">
                                <h3 className="font-medium">{client.prenom} {client.nom}</h3>
                                <p className="text-xs text-gray-500">{client.email}</p>
                              </div>
                              {client.unreadCount > 0 && (
                                <span className="bg-red-800 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                                  {client.unreadCount}
                                </span>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="p-4 text-center text-gray-500">
                        Aucun client avec conversation
                      </div>
                    )}
                  </TabsContent>
                  
                  <TabsContent value="admins" className="m-0 p-0">
                    {admins && admins.length > 0 ? (
                      <div className="divide-y">
                        {admins
                          .filter(admin => admin.id !== currentUser?.id)
                          .map(admin => (
                            <div 
                              key={admin.id}
                              className={`p-3 cursor-pointer hover:bg-gray-50 transition-colors ${
                                selectedUserId === admin.id ? 'bg-gray-100' : ''
                              }`}
                              onClick={() => setSelectedUserId(admin.id)}
                            >
                              <div className="flex items-center">
                                <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center text-purple-800 mr-3">
                                  {(admin.prenom?.[0] || '') + (admin.nom?.[0] || 'A')}
                                </div>
                                <div className="flex-1">
                                  <h3 className="font-medium">{admin.prenom || ''} {admin.nom}</h3>
                                  <p className="text-xs text-gray-500">{admin.email}</p>
                                </div>
                              </div>
                            </div>
                          ))}
                      </div>
                    ) : (
                      <div className="p-4 text-center text-gray-500">
                        Aucun autre administrateur
                      </div>
                    )}
                  </TabsContent>
                </ScrollArea>
              </div>
              
              {/* Zone de chat */}
              <div className="col-span-3 flex flex-col h-[600px]">
                {selectedUserId ? (
                  <>
                    {/* Entête */}
                    <div className="p-4 border-b">
                      <h2 className="font-semibold">
                        {activeTab === 'admins' ? 'Chat avec ' : 'Client: '}
                        {getUserName(selectedUserId)}
                      </h2>
                    </div>
                    
                    {/* Messages */}
                    <ScrollArea className="flex-1 p-4">
                      {isLoadingConversation ? (
                        <div className="text-center p-4">Chargement des messages...</div>
                      ) : conversation && conversation.messages && conversation.messages.length > 0 ? (
                        <div className="space-y-4">
                          {conversation.messages.map(message => (
                            <div
                              key={message.id}
                              className={`flex ${message.senderId === currentUser?.id ? 'justify-end' : 'justify-start'}`}
                            >
                              <div className={`max-w-[70%] p-3 rounded-lg relative group ${
                                message.senderId === currentUser?.id 
                                  ? 'bg-red-800 text-white'  // Message envoyé (nous) - couleur rouge foncé
                                  : 'bg-gray-200 text-gray-800'  // Message reçu (autre)
                              }`}>
                                {message.senderId === currentUser?.id && (
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
                                        <Edit className="mr-2 h-4 w-4" /> Modifier
                                      </DropdownMenuItem>
                                      <DropdownMenuSeparator />
                                      <DropdownMenuItem 
                                        onClick={() => handleDeleteMessage(message)}
                                        className="text-red-600"
                                      >
                                        <Trash2 className="mr-2 h-4 w-4" /> Supprimer
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
                                    <p className="text-xs opacity-80 ml-2">(modifié)</p>
                                  )}
                                </div>
                              </div>
                            </div>
                          ))}
                          <div ref={messagesEndRef} />
                        </div>
                      ) : (
                        <div className="text-center p-4 text-gray-500">
                          Aucun message. Démarrez la conversation !
                        </div>
                      )}
                    </ScrollArea>
                    
                    {/* Zone de saisie */}
                    <div className="p-4 border-t">
                      <form onSubmit={handleSendMessage} className="flex items-center space-x-2">
                        <div className="relative flex-1">
                          <Input
                            value={messageText}
                            onChange={(e) => setMessageText(e.target.value)}
                            placeholder={editingMessage ? "Modifier votre message..." : "Écrivez votre message..."}
                            className="pr-10"
                          />
                          <Popover>
                            <PopoverTrigger asChild>
                              <Button 
                                variant="ghost" 
                                size="icon" 
                                type="button"
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
                        
                        {editingMessage ? (
                          <>
                            <Button 
                              type="button" 
                              onClick={handleEditMessage}
                              className="bg-red-800 hover:bg-red-700"
                            >
                              Enregistrer
                            </Button>
                            <Button 
                              type="button" 
                              variant="outline" 
                              onClick={cancelEditMessage}
                            >
                              Annuler
                            </Button>
                          </>
                        ) : (
                          <Button 
                            type="submit" 
                            className="bg-red-800 hover:bg-red-700"
                            disabled={!messageText.trim()}
                          >
                            <Send className="h-4 w-4 mr-2" /> Envoyer
                          </Button>
                        )}
                      </form>
                    </div>
                  </>
                ) : (
                  <div className="flex-1 flex items-center justify-center">
                    <Card className="p-6 max-w-md text-center">
                      <h3 className="text-lg font-medium mb-2">Aucune conversation sélectionnée</h3>
                      <p className="text-gray-500">
                        Sélectionnez un {activeTab === 'admins' ? 'administrateur' : 'client'} dans la liste pour démarrer ou continuer une conversation.
                      </p>
                    </Card>
                  </div>
                )}
              </div>
            </div>
          </Tabs>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminChatPage;
