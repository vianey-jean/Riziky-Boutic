
import React, { useState, useEffect, useRef } from 'react';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Send, User, Edit, Trash2, Smile } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { clientChatAPI, Message } from '@/services/api';
import { toast } from '@/components/ui/sonner';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger,
  DropdownMenuSeparator 
} from '@/components/ui/dropdown-menu';
import data from '@emoji-mart/data';
import Picker from '@emoji-mart/react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Link } from 'react-router-dom';

const ChatPage = () => {
  const { user } = useAuth();
  const [messageText, setMessageText] = useState('');
  const [editingMessageId, setEditingMessageId] = useState<string | null>(null);
  const [editText, setEditText] = useState('');
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const queryClient = useQueryClient();

  // Récupérer la conversation avec le service client
  const { data: conversation, isLoading: isLoadingConversation } = useQuery({
    queryKey: ['serviceChat'],
    queryFn: async () => {
      try {
        const response = await clientChatAPI.getServiceChat();
        return response.data || { messages: [] };
      } catch (error) {
        console.error("Erreur lors du chargement du chat:", error);
        toast.error("Erreur lors du chargement du chat. Veuillez réessayer.");
        return { messages: [] };
      }
    },
    enabled: !!user,
    refetchInterval: 5000 // Rafraîchir toutes les 5 secondes
  });

  // Mutation pour envoyer un message
  const sendMessageMutation = useMutation({
    mutationFn: async (message: string) => {
      return clientChatAPI.sendServiceMessage(message);
    },
    onSuccess: () => {
      setMessageText('');
      queryClient.invalidateQueries({ queryKey: ['serviceChat'] });
    },
    onError: (error) => {
      console.error("Erreur lors de l'envoi du message:", error);
      toast.error("L'envoi du message a échoué. Veuillez réessayer.");
    }
  });

  // Mutation pour modifier un message
  const editMessageMutation = useMutation({
    mutationFn: async ({ messageId, content, conversationId }: { messageId: string; content: string; conversationId: string }) => {
      return clientChatAPI.editMessage(messageId, content, conversationId);
    },
    onSuccess: () => {
      setEditingMessageId(null);
      setEditText('');
      queryClient.invalidateQueries({ queryKey: ['serviceChat'] });
    },
    onError: (error) => {
      console.error("Erreur lors de la modification du message:", error);
      toast.error("La modification du message a échoué.");
    }
  });

  // Mutation pour supprimer un message
  const deleteMessageMutation = useMutation({
    mutationFn: async ({ messageId, conversationId }: { messageId: string; conversationId: string }) => {
      return clientChatAPI.deleteMessage(messageId, conversationId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['serviceChat'] });
      toast.success("Message supprimé avec succès");
    },
    onError: (error) => {
      console.error("Erreur lors de la suppression du message:", error);
      toast.error("La suppression du message a échoué.");
    }
  });

  // Marquer l'utilisateur comme en ligne au montage et hors ligne au démontage
  useEffect(() => {
    if (user) {
      clientChatAPI.setOnline();
    }
    
    return () => {
      if (user) {
        clientChatAPI.setOffline();
      }
    };
  }, [user]);

  // Défiler vers le bas quand de nouveaux messages arrivent
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [conversation?.messages]);

  const handleSendMessage = () => {
    if (!messageText.trim()) return;
    sendMessageMutation.mutate(messageText);
  };

  const handleEditMessage = (messageId: string) => {
    if (!editText.trim() || !conversation) return;
    
    const conversationId = `client-${user?.id}-service`;
    editMessageMutation.mutate({ 
      messageId, 
      content: editText,
      conversationId
    });
  };

  const startEditMessage = (message: Message) => {
    setEditingMessageId(message.id);
    setEditText(message.content);
  };

  const handleDeleteMessage = (messageId: string) => {
    if (!conversation || !confirm('Êtes-vous sûr de vouloir supprimer ce message ?')) return;
    
    const conversationId = `client-${user?.id}-service`;
    deleteMessageMutation.mutate({ messageId, conversationId });
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('fr-FR', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleEmojiSelect = (emoji: any) => {
    setMessageText((prev) => prev + emoji.native);
  };

  const handleEditEmojiSelect = (emoji: any) => {
    setEditText((prev) => prev + emoji.native);
  };

  if (!user) {
    return (
      <Layout>
        <div className="max-w-3xl mx-auto py-10 text-center">
          <h1 className="text-2xl font-bold mb-6">Service Client</h1>
          <p className="mb-6">Veuillez vous connecter pour accéder au service client en ligne.</p>
          <Button asChild className="bg-red-800 hover:bg-red-700">
            <Link to="/login">Se connecter</Link>
          </Button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Service Client</h1>
        
        <div className="bg-white border rounded-lg overflow-hidden">
          <div className="p-4 bg-gray-50 border-b">
            <div className="flex items-center">
              <div className="bg-red-800 w-10 h-10 rounded-full flex items-center justify-center text-white">
                <User className="h-5 w-5" />
              </div>
              <div className="ml-3">
                <h2 className="font-medium">Support Riziky Boutique</h2>
                <p className="text-xs text-muted-foreground">Nous vous répondons du lundi au vendredi de 9h à 18h</p>
              </div>
            </div>
          </div>
          
          <div className="h-96 overflow-y-auto p-4 space-y-4">
            {isLoadingConversation ? (
              <div className="text-center p-4">Chargement de la conversation...</div>
            ) : conversation?.messages.length === 0 ? (
              <div className="text-center p-4 text-muted-foreground">
                Aucun message. Démarrez la conversation !
              </div>
            ) : (
              <div className="space-y-4">
                {conversation?.messages.map(message => (
                  <div 
                    key={message.id} 
                    className={`flex ${message.senderId === user.id ? 'justify-end' : 'justify-start'}`}
                  >
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
                            onClick={() => handleEditMessage(message.id)} 
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
                      <div 
                        className={`max-w-[80%] rounded-lg px-4 py-2 relative group ${
                          message.isSystemMessage ? 'bg-gray-200 text-gray-700' :
                          message.senderId === user.id 
                            ? 'bg-green-600 text-white' 
                            : 'bg-blue-600 text-white'
                        }`}
                      >
                        {message.senderId === user.id && !message.isSystemMessage && (
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
                          <p className={`text-xs ${message.senderId === user.id ? 'text-green-100' : 'text-blue-100'}`}>
                            {formatTime(message.timestamp)}
                          </p>
                          {message.isEdited && (
                            <p className="text-xs ml-2 opacity-80">(modifié)</p>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>
            )}
          </div>
          
          <div className="p-4 border-t">
            <form onSubmit={(e) => { e.preventDefault(); handleSendMessage(); }} className="flex space-x-2">
              <div className="relative flex-1">
                <Textarea
                  value={messageText}
                  onChange={(e) => setMessageText(e.target.value)}
                  placeholder="Écrivez votre message..."
                  className="resize-none pr-10"
                  onKeyPress={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSendMessage();
                    }
                  }}
                />
                <Popover>
                  <PopoverTrigger asChild>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="absolute right-2 bottom-2"
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
                className="bg-red-800 hover:bg-red-700 self-end h-10"
              >
                <Send className="h-4 w-4" />
              </Button>
            </form>
          </div>
        </div>
        
        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-4">Questions fréquentes</h2>
          
          <div className="space-y-3">
            <Button 
              variant="outline" 
              onClick={() => setMessageText('Comment suivre ma livraison?')}
              className="w-full justify-start"
            >
              Comment suivre ma livraison?
            </Button>
            <Button 
              variant="outline" 
              onClick={() => setMessageText('Comment retourner un produit?')}
              className="w-full justify-start"
            >
              Comment retourner un produit?
            </Button>
            <Button 
              variant="outline" 
              onClick={() => setMessageText('Quels modes de paiement acceptez-vous?')}
              className="w-full justify-start"
            >
              Quels modes de paiement acceptez-vous?
            </Button>
            <Button 
              variant="outline" 
              onClick={() => setMessageText('Avez-vous des réductions régulières?')}
              className="w-full justify-start"
            >
              Avez-vous des réductions régulières?
            </Button>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ChatPage;
