import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import AdminLayout from './AdminLayout';
import PageDataLoader from '@/components/layout/PageDataLoader';
import AdminPageTitle from '@/components/admin/AdminPageTitle';
import UserStatusCard from '@/components/admin/UserStatusCard';
import ChatMessage from '@/components/admin/ChatMessage';
import MessageInput from '@/components/admin/MessageInput';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { 
  MessageCircle, 
  PhoneCall, 
  Video, 
  Users, 
  Zap,
  Phone,
  VideoIcon,
  MessageSquare,
  UserCheck
} from 'lucide-react';
import { adminChatAPI, Message } from '@/services/api';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from '@/components/ui/sonner';
import { VideoCallProvider, useVideoCall } from '@/contexts/VideoCallContext';
import CallNotification from '@/components/admin/CallNotification';
import CallInterface from '@/components/admin/CallInterface';

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

const AdminChatContent = () => {
  const { user: currentUser } = useAuth();
  const [selectedAdmin, setSelectedAdmin] = useState<AdminUser | null>(null);
  const [messageText, setMessageText] = useState('');
  const [editingMessageId, setEditingMessageId] = useState<string | null>(null);
  const [editText, setEditText] = useState('');
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const queryClient = useQueryClient();
  const { initiateCall, callState } = useVideoCall();

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
    // Signal que l'utilisateur est en ligne quand le composant monte
    if (currentUser) {
      adminChatAPI.setOnline();
    }
    
    return () => {
      // Signal que l'utilisateur est hors ligne quand le composant démonte
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

  const handleAudioCall = () => {
    if (!selectedAdmin || !selectedAdmin.isOnline) return;
    initiateCall(selectedAdmin.id, false);
  };
  
  const handleVideoCall = () => {
    if (!selectedAdmin || !selectedAdmin.isOnline) return;
    initiateCall(selectedAdmin.id, true);
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

  // Fonctions qui utilisent le picker d'emoji
  const handleEmojiSelect = (emoji: any) => {
    setMessageText((prev) => prev + emoji.native);
  };

  const handleEditEmojiSelect = (emoji: any) => {
    setEditText((prev) => prev + emoji.native);
  };

  // Display the call interface when in a call
  if (callState.isInCall) {
    return <CallInterface />;
  }

  return (
    <>
      <CallNotification />
      
      <AdminPageTitle 
        title="Chat Administrateurs" 
        icon={MessageCircle}
        description="Communiquez en temps réel avec les autres administrateurs"
      />
      
      <div className="grid md:grid-cols-4 gap-6 h-[70vh]">
        {/* Liste des Administrateurs */}
        <Card className="md:col-span-1 flex flex-col bg-gradient-to-b from-white to-gray-50">
          <div className="p-4 border-b bg-gradient-to-r from-blue-500 to-purple-600">
            <div className="flex items-center space-x-2">
              <Users className="h-5 w-5 text-white" />
              <h2 className="font-semibold text-white">Administrateurs</h2>
              <div className="ml-auto bg-white/20 px-2 py-1 rounded-full">
                <span className="text-xs text-white font-medium">{admins.length}</span>
              </div>
            </div>
          </div>
          
          <ScrollArea className="flex-1 p-2">
            {isLoadingAdmins ? (
              <div className="p-4 text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
                <p className="mt-2 text-sm text-gray-500">Chargement...</p>
              </div>
            ) : admins.length === 0 ? (
              <div className="p-4 text-center text-muted-foreground">
                <UserCheck className="h-12 w-12 mx-auto text-gray-300 mb-2" />
                <p>Aucun autre administrateur</p>
              </div>
            ) : (
              <div className="space-y-2">
                {admins.map((admin: AdminUser) => (
                  <UserStatusCard
                    key={`admin-${admin.id}-${admin.email}`}
                    user={admin}
                    isSelected={selectedAdmin?.id === admin.id}
                    onClick={() => setSelectedAdmin(admin)}
                    showActions={selectedAdmin?.id === admin.id && admin.isOnline}
                  >
                    {selectedAdmin?.id === admin.id && admin.isOnline && (
                      <>
                        <Button 
                          variant="outline" 
                          size="icon" 
                          onClick={handleAudioCall}
                          className="text-green-600 hover:text-green-700 hover:bg-green-50 h-8 w-8"
                        >
                          <Phone className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="outline" 
                          size="icon" 
                          onClick={handleVideoCall}
                          className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 h-8 w-8"
                        >
                          <VideoIcon className="h-4 w-4" />
                        </Button>
                      </>
                    )}
                  </UserStatusCard>
                ))}
              </div>
            )}
          </ScrollArea>
        </Card>
        
        {/* Zone de Chat */}
        <Card className="md:col-span-3 flex flex-col bg-white shadow-lg">
          {selectedAdmin ? (
            <>
              <div className="p-4 border-b bg-gradient-to-r from-gray-50 to-gray-100">
                <UserStatusCard
                  user={selectedAdmin}
                  showActions={selectedAdmin.isOnline}
                >
                  {selectedAdmin.isOnline && (
                    <div className="flex items-center space-x-2">
                      <Button 
                        variant="outline" 
                        size="icon" 
                        onClick={handleAudioCall}
                        className="text-green-600 hover:text-green-700 hover:bg-green-50"
                      >
                        <PhoneCall className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="outline" 
                        size="icon" 
                        onClick={handleVideoCall}
                        className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                      >
                        <Video className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                </UserStatusCard>
              </div>
              
              <ScrollArea className="flex-1 p-4 bg-gradient-to-b from-gray-50 to-white max-h-[70vh] overflow-y-auto">
                {isLoadingConversation ? (
                  <div className="text-center p-8">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
                    <p className="mt-4 text-gray-500">Chargement de la conversation...</p>
                  </div>
                ) : conversation?.messages.length === 0 ? (
                  <div className="text-center p-8 text-muted-foreground">
                    <MessageSquare className="h-16 w-16 mx-auto text-gray-300 mb-4" />
                    <h3 className="text-lg font-medium mb-2">Aucun message</h3>
                    <p>Démarrez la conversation en envoyant le premier message !</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {conversation?.messages.map((message) => (
                      <ChatMessage
                        key={message.id}
                        message={message}
                        isOwn={message.senderId === currentUser?.id}
                        isEditing={editingMessageId === message.id}
                        editText={editText}
                        onEdit={handleEditMessage}
                        onDelete={handleDeleteMessage}
                        onStartEdit={startEditMessage}
                        onCancelEdit={() => setEditingMessageId(null)}
                        onEditTextChange={setEditText}
                        onEmojiSelect={handleEditEmojiSelect}
                        isPending={editMessageMutation.isPending}
                      />
                    ))}
                    <div ref={messagesEndRef} />
                  </div>
                )}
              </ScrollArea>
              
              <MessageInput
                value={messageText}
                onChange={setMessageText}
                onSend={handleSendMessage}
                onEmojiSelect={handleEmojiSelect}
                disabled={sendMessageMutation.isPending}
                placeholder="Écrivez votre message..."
              />
            </>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-muted-foreground bg-gradient-to-b from-gray-50 to-white">
              <div className="text-center">
                <Zap className="h-20 w-20 mx-auto text-gray-300 mb-4" />
                <h3 className="text-xl font-medium mb-2">Sélectionnez un administrateur</h3>
                <p className="text-gray-500">Choisissez un administrateur dans la liste pour commencer à discuter</p>
              </div>
            </div>
          )}
        </Card>
      </div>
    </>
  );
};

const AdminChatPage = () => {
  return (
    <AdminLayout>
      <VideoCallProvider>
        <PageDataLoader
          fetchFunction={async () => {
            await new Promise(resolve => setTimeout(resolve, 1000));
            return { success: true };
          }}
          onSuccess={(data) => {
            console.log("PageDataLoader: Données chargées avec succès", data);
          }}
          loadingMessage="Chargement de votre boutique..."
          loadingSubmessage="Préparation de votre expérience shopping premium..."
          errorMessage="Erreur de chargement des produits"
        >
          <AdminChatContent />
        </PageDataLoader>
      </VideoCallProvider>
    </AdminLayout>
  );
};

export default AdminChatPage;
