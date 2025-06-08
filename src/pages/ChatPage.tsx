
import React, { useState, useEffect, useRef } from 'react';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Send, User, Edit, Trash2, Smile, MessageCircle, Headphones, Clock, CheckCircle } from 'lucide-react';
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
        <div className="min-h-screen bg-gradient-to-br from-red-50 to-pink-50 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center py-12">
          <div className="max-w-md mx-auto text-center bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8 border border-gray-200 dark:border-gray-700">
            <div className="w-20 h-20 bg-gradient-to-r from-red-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <MessageCircle className="h-10 w-10 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">Service Client</h1>
            <p className="text-gray-600 dark:text-gray-400 mb-8 leading-relaxed">
              Connectez-vous pour accéder à notre service client en ligne et bénéficier d'une assistance personnalisée.
            </p>
            <Button asChild className="bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 w-full">
              <Link to="/login">Se connecter</Link>
            </Button>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 py-8">
        <div className="max-w-4xl mx-auto px-4">
          {/* En-tête */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-red-600 to-pink-600 bg-clip-text text-transparent mb-4">
              Service Client
            </h1>
            <p className="text-gray-600 dark:text-gray-400 text-lg">
              Notre équipe est là pour vous aider
            </p>
          </div>
          
          {/* Chat Container */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl overflow-hidden border border-gray-200 dark:border-gray-700">
            {/* Chat Header */}
            <div className="bg-gradient-to-r from-red-600 to-pink-600 p-6 text-white">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                    <Headphones className="h-6 w-6" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold">Support Riziky Boutique</h2>
                    <div className="flex items-center space-x-2 text-sm opacity-90">
                      <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                      <span>En ligne</span>
                    </div>
                  </div>
                </div>
                <div className="text-right text-sm opacity-90">
                  <div className="flex items-center space-x-2">
                    <Clock className="h-4 w-4" />
                    <span>Lun-Ven 9h-18h</span>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Messages */}
            <div className="h-96 overflow-y-auto p-6 bg-gray-50 dark:bg-gray-900 space-y-4">
              {isLoadingConversation ? (
                <div className="flex justify-center items-center h-full">
                  <div className="text-center">
                    <div className="w-12 h-12 border-4 border-red-200 border-t-red-600 rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-600 dark:text-gray-400">Chargement de la conversation...</p>
                  </div>
                </div>
              ) : conversation?.messages.length === 0 ? (
                <div className="text-center h-full flex items-center justify-center">
                  <div className="max-w-sm">
                    <div className="w-16 h-16 bg-gradient-to-r from-red-100 to-pink-100 dark:from-red-900/20 dark:to-pink-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
                      <MessageCircle className="h-8 w-8 text-red-600" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
                      Commencez la conversation
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400">
                      Posez-nous vos questions, nous sommes là pour vous aider !
                    </p>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  {conversation?.messages.map(message => (
                    <div 
                      key={message.id} 
                      className={`flex ${message.senderId === user.id ? 'justify-end' : 'justify-start'}`}
                    >
                      {editingMessageId === message.id ? (
                        <div className="w-full max-w-[80%] bg-white dark:bg-gray-700 p-4 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-600">
                          <div className="flex space-x-2">
                            <Input 
                              value={editText}
                              onChange={(e) => setEditText(e.target.value)}
                              className="flex-1 rounded-xl"
                            />
                            <Popover>
                              <PopoverTrigger asChild>
                                <Button variant="outline" size="icon" className="rounded-xl">
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
                              className="bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 text-white rounded-xl"
                              disabled={editMessageMutation.isPending}
                            >
                              <CheckCircle className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              onClick={() => setEditingMessageId(null)} 
                              className="rounded-xl"
                            >
                              ✕
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <div 
                          className={`max-w-[80%] rounded-2xl px-6 py-4 relative group shadow-lg border ${
                            message.isSystemMessage 
                              ? 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-600' :
                            message.senderId === user.id 
                              ? 'bg-gradient-to-r from-red-600 to-pink-600 text-white border-red-200' 
                              : 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white border-blue-200'
                          }`}
                        >
                          {message.senderId === user.id && !message.isSystemMessage && (
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button 
                                  variant="ghost" 
                                  size="icon" 
                                  className="absolute -top-2 -right-2 opacity-0 group-hover:opacity-100 h-8 w-8 text-white bg-black/20 hover:bg-black/40 rounded-full transition-all duration-200"
                                >
                                  <Edit className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent className="rounded-xl">
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
                          <p className="mb-2 leading-relaxed">{message.content}</p>
                          <div className="flex items-center justify-between text-xs opacity-80">
                            <span>{formatTime(message.timestamp)}</span>
                            {message.isEdited && (
                              <span className="italic">modifié</span>
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
            
            {/* Input Area */}
            <div className="p-6 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
              <form onSubmit={(e) => { e.preventDefault(); handleSendMessage(); }} className="flex space-x-3">
                <div className="relative flex-1">
                  <Textarea
                    value={messageText}
                    onChange={(e) => setMessageText(e.target.value)}
                    placeholder="Tapez votre message..."
                    className="resize-none pr-12 rounded-xl border-gray-300 dark:border-gray-600 focus:border-red-500 focus:ring-red-500"
                    rows={3}
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
                        className="absolute right-2 bottom-2 text-gray-400 hover:text-red-500 rounded-lg"
                      >
                        <Smile className="h-5 w-5" />
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
                  className="bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 text-white self-end h-12 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                  disabled={sendMessageMutation.isPending}
                >
                  <Send className="h-5 w-5" />
                </Button>
              </form>
            </div>
          </div>
          
          {/* FAQ Section */}
          <div className="mt-12">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6 text-center">
              Questions fréquentes
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                'Comment suivre ma livraison?',
                'Comment retourner un produit?',
                'Quels modes de paiement acceptez-vous?',
                'Avez-vous des réductions régulières?'
              ].map((question, index) => (
                <Button 
                  key={index}
                  variant="outline" 
                  onClick={() => setMessageText(question)}
                  className="w-full justify-start p-4 h-auto text-left border-gray-200 dark:border-gray-600 hover:border-red-300 hover:bg-red-50 dark:hover:bg-red-900/10 rounded-xl transition-all duration-300 hover:scale-105"
                >
                  <MessageCircle className="h-5 w-5 mr-3 text-red-600" />
                  <span className="font-medium">{question}</span>
                </Button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ChatPage;
