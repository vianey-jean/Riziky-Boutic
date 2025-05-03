
import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import AdminLayout from './AdminLayout';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Send, Edit, Trash2, Smile } from 'lucide-react';
import { adminChatAPI, Message } from '@/services/api';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
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

// Types pour le chat admin
interface AdminUser {
  id: string;
  nom: string;
  email: string;
  role: string;
  isOnline?: boolean;
  lastSeen?: string;
}

interface Conversation {
  messages: Message[];
  participants: string[];
}

const AdminChatPage = () => {
  const { user: currentUser } = useAuth();
  const [selectedAdmin, setSelectedAdmin] = useState<AdminUser | null>(null);
  const [messageText, setMessageText] = useState('');
  const [editingMessageId, setEditingMessageId] = useState<string | null>(null);
  const [editText, setEditText] = useState('');
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const queryClient = useQueryClient();

  // Récupérer la liste des administrateurs
  const { data: admins = [], isLoading: isLoadingAdmins } = useQuery({
    queryKey: ['admins'],
    queryFn: async () => {
      try {
        const response = await adminChatAPI.getAdmins();
        return (response.data || []).filter(
          (admin: AdminUser) => admin.id !== currentUser?.id
        );
      } catch (error) {
        console.error("Erreur lors du chargement des administrateurs:", error);
        throw error;
      }
    },
    enabled: !!currentUser
  });

  // Récupérer la conversation sélectionnée
  const { data: conversation, isLoading: isLoadingConversation } = useQuery({
    queryKey: ['conversation', selectedAdmin?.id],
    queryFn: async () => {
      if (!selectedAdmin) return { messages: [] };
      try {
        const response = await adminChatAPI.getConversation(selectedAdmin.id);
        return response.data || { messages: [] };
      } catch (error) {
        console.error("Erreur lors du chargement de la conversation:", error);
        return { messages: [] };
      }
    },
    enabled: !!selectedAdmin && !!currentUser,
    refetchInterval: 5000 // Rafraîchir toutes les 5 secondes
  });

  // Vérifier le statut en ligne des administrateurs
  useQuery({
    queryKey: ['adminStatus'],
    queryFn: async () => {
      if (!admins.length) return {};
      
      // Signaler que l'utilisateur courant est en ligne
      await adminChatAPI.setOnline();
      
      // Vérifier le statut de tous les autres admins
      const statusPromises = admins.map(async (admin: AdminUser) => {
        try {
          const response = await adminChatAPI.getStatus(admin.id);
          return { id: admin.id, ...response.data };
        } catch (error) {
          return { id: admin.id, isOnline: false };
        }
      });
      
      const statuses = await Promise.all(statusPromises);
      const statusMap = statuses.reduce((acc: Record<string, any>, status) => {
        acc[status.id] = status;
        return acc;
      }, {});
      
      // Mettre à jour le cache des admins avec leur statut
      queryClient.setQueryData(['admins'], (oldData: any) => 
        (oldData || []).map((admin: AdminUser) => ({
          ...admin,
          isOnline: statusMap[admin.id]?.isOnline || false,
          lastSeen: statusMap[admin.id]?.lastSeen
        }))
      );
      
      return statusMap;
    },
    enabled: !!admins.length && !!currentUser,
    refetchInterval: 15000 // Vérifier les statuts toutes les 15 secondes
  });

  // Mutation pour envoyer un message
  const sendMessageMutation = useMutation({
    mutationFn: async (message: string) => {
      if (!selectedAdmin) throw new Error("Aucun administrateur sélectionné");
      return adminChatAPI.sendMessage(selectedAdmin.id, message);
    },
    onSuccess: () => {
      setMessageText('');
      queryClient.invalidateQueries({ queryKey: ['conversation', selectedAdmin?.id] });
    },
    onError: (error) => {
      console.error("Erreur lors de l'envoi du message:", error);
      toast.error("L'envoi du message a échoué. Veuillez réessayer.");
    }
  });

  // Mutation pour modifier un message
  const editMessageMutation = useMutation({
    mutationFn: async ({ messageId, content }: { messageId: string; content: string }) => {
      if (!selectedAdmin) throw new Error("Aucun administrateur sélectionné");
      const conversationId = getConversationId();
      return adminChatAPI.editMessage(messageId, content, conversationId);
    },
    onSuccess: () => {
      setEditingMessageId(null);
      setEditText('');
      queryClient.invalidateQueries({ queryKey: ['conversation', selectedAdmin?.id] });
      toast.success("Message modifié avec succès");
    },
    onError: (error) => {
      console.error("Erreur lors de la modification du message:", error);
      toast.error("La modification du message a échoué");
    }
  });

  // Mutation pour supprimer un message
  const deleteMessageMutation = useMutation({
    mutationFn: async (messageId: string) => {
      if (!selectedAdmin) throw new Error("Aucun administrateur sélectionné");
      const conversationId = getConversationId();
      return adminChatAPI.deleteMessage(messageId, conversationId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['conversation', selectedAdmin?.id] });
      toast.success("Message supprimé");
    },
    onError: (error) => {
      console.error("Erreur lors de la suppression du message:", error);
      toast.error("La suppression du message a échoué");
    }
  });

  // Fonction pour obtenir l'ID de conversation
  const getConversationId = () => {
    if (!currentUser || !selectedAdmin) return '';
    return currentUser.id < selectedAdmin.id 
      ? `${currentUser.id}-${selectedAdmin.id}` 
      : `${selectedAdmin.id}-${currentUser.id}`;
  };

  // Marquer comme hors ligne au démontage du composant
  useEffect(() => {
    // Signal that user is online when component mounts
    if (currentUser) {
      adminChatAPI.setOnline();
    }
    
    return () => {
      // Signal that user is offline when component unmounts
      if (currentUser) {
        adminChatAPI.setOffline();
      }
    };
  }, [currentUser]);

  // Défiler vers le bas quand de nouveaux messages arrivent
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [conversation?.messages]);

  const handleSendMessage = () => {
    if (!messageText.trim() || !selectedAdmin) return;
    sendMessageMutation.mutate(messageText);
  };

  const handleEditMessage = () => {
    if (!editText.trim() || !editingMessageId) return;
    editMessageMutation.mutate({ messageId: editingMessageId, content: editText });
  };

  const startEditMessage = (message: Message) => {
    setEditingMessageId(message.id);
    setEditText(message.content);
  };

  const handleDeleteMessage = (messageId: string) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce message ?')) {
      deleteMessageMutation.mutate(messageId);
    }
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

  return (
    <AdminLayout>
      <h1 className="text-2xl font-bold mb-6">Chat entre administrateurs</h1>
      
      <div className="grid md:grid-cols-4 gap-6 h-[70vh]">
        {/* Liste des Administrateurs */}
        <Card className="md:col-span-1 flex flex-col">
          <div className="p-4 border-b">
            <h2 className="font-semibold">Administrateurs</h2>
          </div>
          
          <ScrollArea className="flex-1">
            {isLoadingAdmins ? (
              <div className="p-4 text-center">Chargement des administrateurs...</div>
            ) : admins.length === 0 ? (
              <div className="p-4 text-center text-muted-foreground">
                Aucun autre administrateur
              </div>
            ) : (
              admins.map((admin: AdminUser) => (
                <div key={admin.id}>
                  <button
                    className={`w-full p-3 flex items-center hover:bg-gray-100 ${
                      selectedAdmin?.id === admin.id ? 'bg-gray-100' : ''
                    }`}
                    onClick={() => setSelectedAdmin(admin)}
                  >
                    <div className="relative mr-3">
                      <div className="w-10 h-10 bg-red-800 text-white rounded-full flex items-center justify-center">
                        {admin.nom.charAt(0)}
                      </div>
                      <div className={`absolute bottom-0 right-0 w-3 h-3 rounded-full ${
                        admin.isOnline ? 'bg-green-500' : 'bg-gray-400'
                      }`}></div>
                    </div>
                    <div className="text-left">
                      <p className="font-medium">{admin.nom}</p>
                      <p className="text-xs text-muted-foreground">
                        {admin.isOnline ? 'En ligne' : `Dernier accès ${getTimeAgo(admin.lastSeen)}`}
                      </p>
                    </div>
                  </button>
                  <Separator />
                </div>
              ))
            )}
          </ScrollArea>
        </Card>
        
        {/* Zone de Chat */}
        <Card className="md:col-span-3 flex flex-col">
          {selectedAdmin ? (
            <>
              <div className="p-4 border-b flex items-center space-x-3">
                <div className="relative">
                  <div className="w-10 h-10 bg-red-800 text-white rounded-full flex items-center justify-center">
                    {selectedAdmin.nom.charAt(0)}
                  </div>
                  <div className={`absolute bottom-0 right-0 w-3 h-3 rounded-full ${
                    selectedAdmin.isOnline ? 'bg-green-500' : 'bg-red-500'
                  }`}></div>
                </div>
                <div>
                  <h2 className="font-semibold">{selectedAdmin.nom}</h2>
                  <p className="text-xs text-muted-foreground">
                    {selectedAdmin.isOnline ? 'En ligne' : `Dernier accès ${getTimeAgo(selectedAdmin.lastSeen)}`}
                  </p>
                </div>
              </div>
              
              <ScrollArea className="flex-1 p-4">
                {isLoadingConversation ? (
                  <div className="text-center p-4">Chargement de la conversation...</div>
                ) : conversation?.messages.length === 0 ? (
                  <div className="text-center p-4 text-muted-foreground">
                    Aucun message. Démarrez la conversation !
                  </div>
                ) : (
                  <div className="space-y-4">
                    {conversation?.messages.map((message) => (
                      <div key={message.id} className={`flex ${
                        message.senderId === currentUser?.id ? 'justify-end' : 'justify-start'
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
                                disabled={editMessageMutation.isPending}
                              >
                                Enregistrer
                              </Button>
                              <Button 
                                variant="ghost" 
                                onClick={() => setEditingMessageId(null)} 
                                className="ml-2"
                              >
                                Annuler
                              </Button>
                            </div>
                          </div>
                        ) : (
                          <div className={`max-w-[70%] p-3 rounded-lg relative group ${
                            message.senderId === currentUser?.id 
                              ? 'bg-green-600 text-white'  // Couleur verte pour les messages envoyés
                              : 'bg-red-800 text-white'   // Couleur grenat pour les messages reçus
                          }`}>
                            {message.senderId === currentUser?.id && !message.isAutoReply && (
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
                                    onClick={() => handleDeleteMessage(message.id)}
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
                        )}
                      </div>
                    ))}
                    <div ref={messagesEndRef} />
                  </div>
                )}
              </ScrollArea>
              
              <div className="p-4 border-t">
                <form onSubmit={(e) => { e.preventDefault(); handleSendMessage(); }} className="flex space-x-2">
                  <div className="relative flex-1">
                    <Input
                      value={messageText}
                      onChange={(e) => setMessageText(e.target.value)}
                      placeholder="Écrivez votre message..."
                      className="pr-10"
                      disabled={sendMessageMutation.isPending}
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
                    disabled={sendMessageMutation.isPending}
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </form>
              </div>
            </>
          ) : (
            <div className="flex items-center justify-center h-full text-muted-foreground">
              Sélectionnez un administrateur pour commencer à discuter
            </div>
          )}
        </Card>
      </div>
    </AdminLayout>
  );
};

export default AdminChatPage;
