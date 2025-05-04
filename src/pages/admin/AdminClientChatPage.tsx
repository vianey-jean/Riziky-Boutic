import React, { useState, useEffect, useRef } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { clientChatAPI, Message, ServiceConversation, User } from '@/services/api';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Send, User as UserIcon, Search, Edit, Trash2, Smile, MessageSquare } from 'lucide-react';
import { toast } from 'sonner';
import AdminLayout from './AdminLayout';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger,
  DropdownMenuSeparator 
} from '@/components/ui/dropdown-menu';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import data from '@emoji-mart/data';
import Picker from '@emoji-mart/react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';

// Define the type for conversations to fix TypeScript errors
interface ConversationsType {
  [key: string]: ServiceConversation;
}

const AdminClientChatPage = () => {
  const { user } = useAuth();
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null);
  const [messageText, setMessageText] = useState('');
  const [editingMessageId, setEditingMessageId] = useState<string | null>(null);
  const [editText, setEditText] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const queryClient = useQueryClient();
  
  // Verify if the current user is a service client admin
  useEffect(() => {
    if (user && user.email !== "service.client@example.com") {
      toast.error("Accès restreint au service client");
    }
  }, [user]);

  // Get all service client conversations
  const { 
    data: conversations, 
    isLoading: isLoadingConversations 
  } = useQuery<ConversationsType>({
    queryKey: ['serviceConversations'],
    queryFn: async () => {
      try {
        const response = await clientChatAPI.getServiceConversations();
        return response.data || {};
      } catch (error) {
        console.error("Erreur lors du chargement des conversations:", error);
        toast.error("Erreur lors du chargement des conversations");
        return {};
      }
    },
    refetchInterval: 5000, // Refresh every 5 seconds
    enabled: !!user && user.email === "service.client@example.com"
  });

  // Send message mutation
  const sendMessageMutation = useMutation({
    mutationFn: async ({ conversationId, message }: { conversationId: string; message: string }) => {
      return clientChatAPI.sendServiceReply(conversationId, message);
    },
    onSuccess: () => {
      setMessageText('');
      queryClient.invalidateQueries({ queryKey: ['serviceConversations'] });
    },
    onError: (error) => {
      console.error("Erreur lors de l'envoi du message:", error);
      toast.error("Erreur lors de l'envoi du message");
    }
  });

  // Edit message mutation
  const editMessageMutation = useMutation({
    mutationFn: async ({ messageId, content, conversationId }: { messageId: string; content: string; conversationId: string }) => {
      return clientChatAPI.editMessage(messageId, content, conversationId);
    },
    onSuccess: () => {
      setEditingMessageId(null);
      setEditText('');
      queryClient.invalidateQueries({ queryKey: ['serviceConversations'] });
    },
    onError: (error) => {
      console.error("Erreur lors de la modification du message:", error);
      toast.error("La modification du message a échoué");
    }
  });

  // Delete message mutation
  const deleteMessageMutation = useMutation({
    mutationFn: async ({ messageId, conversationId }: { messageId: string; conversationId: string }) => {
      return clientChatAPI.deleteMessage(messageId, conversationId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['serviceConversations'] });
      toast.success("Message supprimé avec succès");
    },
    onError: (error) => {
      console.error("Erreur lors de la suppression du message:", error);
      toast.error("La suppression du message a échoué");
    }
  });

  // Mark as online on mount
  useEffect(() => {
    if (user && user.email === "service.client@example.com") {
      clientChatAPI.setOnline();
      
      // Set as offline when component unmounts
      return () => {
        clientChatAPI.setOffline();
      };
    }
  }, [user]);

  // Scroll to bottom when messages change
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [activeConversationId, conversations]);

  const handleSendMessage = () => {
    if (!messageText.trim() || !activeConversationId) return;
    
    sendMessageMutation.mutate({
      conversationId: activeConversationId,
      message: messageText
    });
  };

  const handleEditMessage = (messageId: string) => {
    if (!editText.trim() || !activeConversationId) return;
    
    editMessageMutation.mutate({
      messageId,
      content: editText,
      conversationId: activeConversationId
    });
  };

  const startEditMessage = (message: Message) => {
    setEditingMessageId(message.id);
    setEditText(message.content);
  };

  const handleDeleteMessage = (messageId: string) => {
    if (!activeConversationId || !confirm('Êtes-vous sûr de vouloir supprimer ce message ?')) return;
    
    deleteMessageMutation.mutate({
      messageId,
      conversationId: activeConversationId
    });
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('fr-FR', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const handleEmojiSelect = (emoji: any) => {
    setMessageText((prev) => prev + emoji.native);
  };

  const handleEditEmojiSelect = (emoji: any) => {
    setEditText((prev) => prev + emoji.native);
  };

  // Filter conversations by search query
  const filteredConversations = conversations ? Object.entries(conversations).filter(([_, conversation]) => {
    const client = conversation.clientInfo;
    if (!client) return false;
    
    const fullName = `${client.nom} ${client.prenom || ''}`.toLowerCase();
    const email = client.email.toLowerCase();
    const query = searchQuery.toLowerCase();
    
    return fullName.includes(query) || email.includes(query);
  }) : [];

  // Active conversation
  const activeConversation = activeConversationId && conversations ? 
    conversations[activeConversationId] : null;
  
  // Active client
  const activeClient = activeConversation?.clientInfo;

  return (
    <AdminLayout>
      <div className="h-full">
        <h1 className="text-3xl font-bold mb-6">Service Client - Chat</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 h-[calc(100vh-200px)]">
          {/* Conversation List */}
          <Card className="col-span-1 p-4 overflow-hidden flex flex-col">
            <div className="mb-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
                <Input 
                  placeholder="Rechercher un client..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>
            
            <ScrollArea className="flex-1">
              <div className="space-y-2">
                {isLoadingConversations ? (
                  <p className="text-center py-4 text-gray-500">Chargement...</p>
                ) : filteredConversations.length === 0 ? (
                  <p className="text-center py-4 text-gray-500">Aucune conversation trouvée</p>
                ) : (
                  filteredConversations.map(([conversationId, conversation]) => {
                    const client = conversation.clientInfo;
                    const lastMessage = conversation.messages[conversation.messages.length - 1];
                    const unreadCount = conversation.unreadCount || 0;
                    
                    return (
                      <div 
                        key={conversationId}
                        className={`p-3 rounded-lg cursor-pointer transition-all ${
                          activeConversationId === conversationId 
                            ? 'bg-red-100' 
                            : 'hover:bg-gray-100'
                        }`}
                        onClick={() => setActiveConversationId(conversationId)}
                      >
                        <div className="flex items-center mb-1">
                          <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center mr-2">
                            <UserIcon className="h-4 w-4 text-gray-600" />
                          </div>
                          <div className="flex-1">
                            <p className="font-medium truncate">{client?.nom} {client?.prenom || ''}</p>
                            <p className="text-xs text-gray-500 truncate">{client?.email}</p>
                          </div>
                          {unreadCount > 0 && (
                            <Badge className="bg-red-600">{unreadCount}</Badge>
                          )}
                        </div>
                        {lastMessage && (
                          <div className="mt-1">
                            <p className="text-sm text-gray-500 truncate">
                              {lastMessage.isSystemMessage ? 'Système: ' : 
                               lastMessage.isAdminReply ? 'Vous: ' : 'Client: '}
                              {lastMessage.content}
                            </p>
                            <p className="text-xs text-gray-400">
                              {formatTime(lastMessage.timestamp)}
                            </p>
                          </div>
                        )}
                      </div>
                    );
                  })
                )}
              </div>
            </ScrollArea>
          </Card>
          
          {/* Conversation Area */}
          <Card className="col-span-1 md:col-span-3 p-0 flex flex-col overflow-hidden">
            {!activeConversationId ? (
              <div className="flex flex-col items-center justify-center h-full text-gray-500">
                <MessageSquare className="w-16 h-16 mb-4" />
                <p>Sélectionnez une conversation pour commencer</p>
              </div>
            ) : (
              <>
                {/* Chat Header */}
                <div className="p-4 border-b flex items-center">
                  <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center mr-3">
                    <UserIcon className="h-5 w-5 text-gray-600" />
                  </div>
                  <div>
                    <h3 className="font-medium">{activeClient?.nom} {activeClient?.prenom || ''}</h3>
                    <p className="text-sm text-gray-500">{activeClient?.email}</p>
                  </div>
                </div>
                
                {/* Messages Area */}
                <ScrollArea className="flex-1 p-4">
                  <div className="space-y-4">
                    {activeConversation?.messages.map(message => (
                      <div 
                        key={message.id} 
                        className={`flex ${
                          message.isSystemMessage ? 'justify-center' :
                          message.senderId === user?.id ? 'justify-end' : 'justify-start'
                        }`}
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
                              message.senderId === user?.id 
                                ? 'bg-green-600 text-white' 
                                : 'bg-blue-600 text-white'
                            }`}
                          >
                            {message.senderId === user?.id && !message.isSystemMessage && (
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
                              <p className={`text-xs ${
                                message.isSystemMessage ? 'text-gray-500' :
                                message.senderId === user?.id ? 'text-green-100' : 'text-blue-100'
                              }`}>
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
                </ScrollArea>
                
                {/* Input Area */}
                <div className="p-4 border-t">
                  <form 
                    onSubmit={(e) => { 
                      e.preventDefault();
                      handleSendMessage();
                    }} 
                    className="flex space-x-2"
                  >
                    <div className="relative flex-1">
                      <Textarea
                        value={messageText}
                        onChange={(e) => setMessageText(e.target.value)}
                        placeholder="Écrivez votre réponse..."
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
              </>
            )}
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminClientChatPage;
