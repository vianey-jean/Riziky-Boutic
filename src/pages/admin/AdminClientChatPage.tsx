import React, { useState, useEffect, useRef } from 'react';
import AdminLayout from './AdminLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { MessageSquare, Send, Users, Clock, Search, Filter, Sparkles, MessageCircle } from 'lucide-react';
import { clientChatAPI } from '@/services/chatAPI';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import PageDataLoader from '@/components/layout/PageDataLoader';

interface Message {
  id: string;
  senderId: string;
  senderName: string;
  content: string;
  timestamp: string;
  type: 'user' | 'admin';
}

interface ChatSession {
  id: string;
  userId: string;
  userName: string;
  status: 'active' | 'closed';
  lastMessage?: Message;
  unreadCount: number;
  createdAt: string;
  messages: Message[];
}

const AdminClientChatPage: React.FC = () => {
  const [chatSessions, setChatSessions] = useState<ChatSession[]>([]);
  const [selectedSession, setSelectedSession] = useState<ChatSession | null>(null);
  const [newMessage, setNewMessage] = useState('');
  const [dataLoaded, setDataLoaded] = useState(false);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  const loadChatSessions = async () => {
    try {
      // Mock data for now since the API might not be available
      const mockSessions: ChatSession[] = [
        {
          id: '1',
          userId: 'user1',
          userName: 'Jean Dupont',
          status: 'active',
          unreadCount: 2,
          createdAt: new Date().toISOString(),
          messages: [
            {
              id: '1',
              senderId: 'user1',
              senderName: 'Jean Dupont',
              content: 'Bonjour, j\'ai un problème avec ma commande',
              timestamp: new Date().toISOString(),
              type: 'user'
            }
          ]
        }
      ];
      return mockSessions;
    } catch (error) {
      console.error('Erreur lors du chargement des sessions de chat:', error);
      throw error;
    }
  };

  const handleDataSuccess = (data: ChatSession[]) => {
    setChatSessions(data);
    setDataLoaded(true);
  };

  const handleMaxRetriesReached = () => {
    console.error('Impossible de charger les conversations');
  };

  useEffect(() => {
    loadChatSessionsData();
  }, []);

  useEffect(() => {
    if (selectedSession) {
      scrollToBottom();
    }
  }, [selectedSession?.messages]);

  const loadChatSessionsData = async () => {
    try {
      const mockSessions: ChatSession[] = [
        {
          id: '1',
          userId: 'user1',
          userName: 'Jean Dupont',
          status: 'active',
          unreadCount: 2,
          createdAt: new Date().toISOString(),
          messages: [
            {
              id: '1',
              senderId: 'user1',
              senderName: 'Jean Dupont',
              content: 'Bonjour, j\'ai un problème avec ma commande',
              timestamp: new Date().toISOString(),
              type: 'user'
            }
          ]
        }
      ];
      setChatSessions(mockSessions);
    } catch (error) {
      console.error('Erreur lors du chargement des sessions de chat:', error);
    }
  };

  const handleSessionSelect = (session: ChatSession) => {
    setSelectedSession(session);
  };

  const handleSendMessage = async () => {
    if (!selectedSession || !newMessage.trim()) return;

    try {
      setNewMessage('');
      setSelectedSession(prevSession => {
        if (!prevSession) return null;
        return {
          ...prevSession,
          messages: [...prevSession.messages, {
            id: Date.now().toString(),
            senderId: 'admin',
            senderName: 'Admin',
            content: newMessage.trim(),
            timestamp: new Date().toISOString(),
            type: 'admin'
          }]
        };
      });
      scrollToBottom();
    } catch (error) {
      console.error('Erreur lors de l\'envoi du message:', error);
    }
  };

  const scrollToBottom = () => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  };
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return format(date, 'HH:mm', { locale: fr });
  };

  if (!dataLoaded) {
    return (
      <AdminLayout>
        <PageDataLoader
          fetchFunction={loadChatSessions}
          onSuccess={handleDataSuccess}
          onMaxRetriesReached={handleMaxRetriesReached}
          loadingMessage="Chargement des conversations..."
          loadingSubmessage="Récupération des messages clients..."
          errorMessage="Erreur de chargement des conversations"
        >
        </PageDataLoader>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
        {/* Enhanced Header Section */}
        <div className="bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700 rounded-3xl p-8 text-white shadow-2xl relative overflow-hidden mx-8 mt-8">
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-32 translate-x-32"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-24 -translate-x-24"></div>
          
          <div className="relative z-10">
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between">
              <div className="space-y-4 mb-6 lg:mb-0">
                <div className="flex items-center space-x-4">
                  <div className="bg-white/20 backdrop-blur-sm p-4 rounded-2xl">
                    <MessageCircle className="h-10 w-10 text-white" />
                  </div>
                  <div>
                    <h1 className="text-4xl font-bold mb-2">Chat Client</h1>
                    <p className="text-blue-100 text-lg">Assistance en temps réel pour vos clients</p>
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-white/20 backdrop-blur-sm p-4 rounded-xl text-center">
                  <div className="text-2xl font-bold">12</div>
                  <div className="text-sm text-blue-100">Conversations</div>
                </div>
                <div className="bg-white/20 backdrop-blur-sm p-4 rounded-xl text-center">
                  <div className="text-2xl font-bold">3</div>
                  <div className="text-sm text-blue-100">En attente</div>
                </div>
                <div className="bg-white/20 backdrop-blur-sm p-4 rounded-xl text-center">
                  <div className="text-2xl font-bold">8min</div>
                  <div className="text-sm text-blue-100">Temps moyen</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="container mx-auto p-8">
          <div className="grid lg:grid-cols-4 gap-8 h-[800px]">
            {/* Enhanced Chat List */}
            <Card className="lg:col-span-1 border-0 shadow-2xl bg-gradient-to-br from-white to-gray-50">
              <CardHeader className="bg-gradient-to-r from-gray-50 to-white border-b border-gray-200">
                <CardTitle className="flex items-center text-gray-800">
                  <Users className="h-5 w-5 mr-2 text-blue-600" />
                  Conversations
                </CardTitle>
                <CardDescription>Gérez vos chats clients</CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                {/* Search and Filter */}
                <div className="p-4 border-b border-gray-100">
                  <div className="relative mb-3">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input 
                      placeholder="Rechercher..." 
                      className="pl-10 border-2 border-gray-200 focus:border-blue-500 transition-colors"
                    />
                  </div>
                  <Button variant="outline" size="sm" className="w-full border-gray-200 text-gray-600 hover:bg-gray-50">
                    <Filter className="h-4 w-4 mr-2" />
                    Filtres
                  </Button>
                </div>
                
                {/* Chat Sessions List */}
                <ScrollArea className="h-[600px]">
                  <div className="space-y-2 p-4">
                    {chatSessions.map((session) => (
                      <div 
                        key={session.id} 
                        className={`p-4 rounded-xl border border-gray-100 hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 cursor-pointer transition-all duration-200 hover:shadow-md ${selectedSession?.id === session.id ? 'bg-blue-50' : ''}`}
                        onClick={() => handleSessionSelect(session)}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                              {session.userName.charAt(0).toUpperCase()}
                            </div>
                            <div>
                              <h4 className="font-semibold text-gray-800">{session.userName}</h4>
                              <p className="text-xs text-gray-500">{session.status === 'active' ? 'En ligne' : 'Hors ligne'}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            {session.unreadCount > 0 && (
                              <Badge className="bg-gradient-to-r from-red-500 to-pink-600 text-white border-0">
                                {session.unreadCount}
                              </Badge>
                            )}
                            <p className="text-xs text-gray-500 mt-1">
                              {session.lastMessage ? formatDate(session.lastMessage.timestamp) : formatDate(session.createdAt)}
                            </p>
                          </div>
                        </div>
                        <p className="text-sm text-gray-600 truncate">
                          {session.lastMessage ? session.lastMessage.content : 'Aucun message'}
                        </p>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>

            {/* Enhanced Chat Interface */}
            <Card className="lg:col-span-3 border-0 shadow-2xl bg-gradient-to-br from-white to-gray-50">
              <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-blue-100">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold shadow-lg">
                      {selectedSession ? selectedSession.userName.charAt(0).toUpperCase() : '#'}
                    </div>
                    <div>
                      <CardTitle className="text-gray-800">{selectedSession?.userName || 'Sélectionnez un chat'}</CardTitle>
                      <CardDescription className="flex items-center">
                        <div className={`w-2 h-2 rounded-full mr-2 ${selectedSession?.status === 'active' ? 'bg-green-500' : 'bg-gray-400'}`}></div>
                        {selectedSession?.status === 'active' ? 'En ligne' : 'Hors ligne'} - Dernière activité: {selectedSession ? formatDate(selectedSession.lastMessage?.timestamp || selectedSession.createdAt) : 'N/A'}
                      </CardDescription>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge className="bg-gradient-to-r from-green-500 to-emerald-600 text-white border-0">{selectedSession?.status === 'active' ? 'Active' : 'Inactive'}</Badge>
                    <Button variant="outline" size="sm" className="border-blue-200 text-blue-600 hover:bg-blue-50">
                      <Clock className="h-4 w-4 mr-2" />
                      Historique
                    </Button>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="p-0 flex flex-col h-[680px]">
                {/* Messages Area */}
                <ScrollArea className="flex-1 p-6" ref={chatContainerRef}>
                  <div className="space-y-4">
                    {selectedSession?.messages.map((msg) => (
                      <div key={msg.id} className={`flex ${msg.type === 'admin' ? 'justify-end' : 'justify-start'}`}>
                        <div className="max-w-xs lg:max-w-md">
                          {msg.type === 'admin' && (
                            <p className="text-xs text-gray-500 mt-2 mr-2 text-right">Vous • {formatDate(msg.timestamp)}</p>
                          )}
                          <div className={`p-4 rounded-2xl ${msg.type === 'admin' ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-tr-md' : 'bg-gradient-to-r from-gray-100 to-gray-200 text-gray-800 rounded-tl-md'} shadow-md`}>
                            <p>{msg.content}</p>
                          </div>
                          {msg.type === 'user' && selectedSession && (
                            <p className="text-xs text-gray-500 mt-2 ml-2">{selectedSession.userName} • {formatDate(msg.timestamp)}</p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>

                <Separator className="bg-gradient-to-r from-transparent via-gray-300 to-transparent" />

                {/* Enhanced Message Input */}
                <div className="p-6 bg-gradient-to-r from-gray-50 to-white">
                  <div className="flex space-x-4">
                    <Input 
                      placeholder="Tapez votre message..." 
                      className="flex-1 border-2 border-gray-200 focus:border-blue-500 transition-colors h-12 rounded-xl"
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                    />
                    <Button 
                      className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
                      onClick={handleSendMessage}
                    >
                      <Send className="h-5 w-5 mr-2" />
                      Envoyer
                    </Button>
                  </div>
                  
                  {/* Quick Responses */}
                  <div className="mt-4 flex flex-wrap gap-2">
                    <Button variant="outline" size="sm" className="border-gray-200 text-gray-600 hover:bg-gray-50 rounded-full">
                      Bonjour ! Comment puis-je vous aider ?
                    </Button>
                    <Button variant="outline" size="sm" className="border-gray-200 text-gray-600 hover:bg-gray-50 rounded-full">
                      Je vérifie votre commande...
                    </Button>
                    <Button variant="outline" size="sm" className="border-gray-200 text-gray-600 hover:bg-gray-50 rounded-full">
                      Merci pour votre patience
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminClientChatPage;
