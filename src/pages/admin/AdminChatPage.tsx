import React, { useState, useEffect, useRef } from 'react';
import AdminLayout from './AdminLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { MessageSquare, Send, Users, Clock, Search, Filter, Sparkles, MessageCircle } from 'lucide-react';
import { adminChatAPI } from '@/services/chatAPI';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import PageDataLoader from '@/components/layout/PageDataLoader';

interface AdminMessage {
  id: string;
  senderId: string;
  senderName: string;
  content: string;
  timestamp: string;
  type: 'message' | 'notification';
}

const AdminChatPage: React.FC = () => {
  const [messages, setMessages] = useState<AdminMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [dataLoaded, setDataLoaded] = useState(false);
  const [adminList, setAdminList] = useState([
    { name: 'Admin Principal', role: 'Super Admin', online: true },
    { name: 'Marie Dubois', role: 'Gestionnaire', online: true },
    { name: 'Pierre Martin', role: 'Support', online: false },
    { name: 'Sophie Laurent', role: 'Marketing', online: true },
    { name: 'Thomas Bernard', role: 'Technique', online: false }
  ]);
  const scrollRef = useRef<HTMLDivElement>(null);

  const loadChatData = async () => {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 500));

    const initialMessages: AdminMessage[] = [
      { id: '1', senderId: 'admin1', senderName: 'Admin Principal', content: 'Bonjour l\'équipe ! Réunion à 14h pour discuter des nouvelles fonctionnalités.', timestamp: '2024-05-03T09:30:00', type: 'message' },
      { id: '2', senderId: 'marie1', senderName: 'Marie Dubois', content: 'Parfait ! J\'ai préparé le rapport des ventes. Je l\'enverrai avant la réunion.', timestamp: '2024-05-03T09:32:00', type: 'message' },
      { id: '3', senderId: 'admin1', senderName: 'Admin Principal', content: 'Excellent ! N\'hésitez pas si vous avez des questions avant la réunion.', timestamp: '2024-05-03T09:35:00', type: 'message' },
      { id: '4', senderId: 'system', senderName: 'System', content: 'Marie Dubois a rejoint la conversation', timestamp: '2024-05-03T09:29:00', type: 'notification' }
    ];
    return initialMessages;
  };

  const handleDataSuccess = (data: AdminMessage[]) => {
    setMessages(data);
    setDataLoaded(true);
  };

  const handleMaxRetriesReached = () => {
    console.error('Impossible de charger le chat');
  };

  useEffect(() => {
    // Mocked function to simulate fetching messages
    const fetchMessages = async () => {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 500));

      const initialMessages: AdminMessage[] = [
        { id: '1', senderId: 'admin1', senderName: 'Admin Principal', content: 'Bonjour l\'équipe ! Réunion à 14h pour discuter des nouvelles fonctionnalités.', timestamp: '2024-05-03T09:30:00', type: 'message' },
        { id: '2', senderId: 'marie1', senderName: 'Marie Dubois', content: 'Parfait ! J\'ai préparé le rapport des ventes. Je l\'enverrai avant la réunion.', timestamp: '2024-05-03T09:32:00', type: 'message' },
        { id: '3', senderId: 'admin1', senderName: 'Admin Principal', content: 'Excellent ! N\'hésitez pas si vous avez des questions avant la réunion.', timestamp: '2024-05-03T09:35:00', type: 'message' },
        { id: '4', senderId: 'system', senderName: 'System', content: 'Marie Dubois a rejoint la conversation', timestamp: '2024-05-03T09:29:00', type: 'notification' }
      ];
      setMessages(initialMessages);
    };

    fetchMessages();
  }, []);

  useEffect(() => {
    // Scroll to bottom on message change
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSendMessage = () => {
    if (newMessage.trim() !== '') {
      const newMsg: AdminMessage = {
        id: String(messages.length + 1),
        senderId: 'you',
        senderName: 'You',
        content: newMessage,
        timestamp: new Date().toISOString(),
        type: 'message'
      };
      setMessages([...messages, newMsg]);
      setNewMessage('');
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewMessage(e.target.value);
  };
  
  return (
    <AdminLayout>
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50">
        {/* Enhanced Header Section */}
        <div className="bg-gradient-to-br from-purple-600 via-pink-600 to-red-700 rounded-3xl p-8 text-white shadow-2xl relative overflow-hidden mx-8 mt-8">
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
                    <h1 className="text-4xl font-bold mb-2">Chat Administrateur</h1>
                    <p className="text-pink-100 text-lg">Communication interne et gestion d'équipe</p>
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-white/20 backdrop-blur-sm p-4 rounded-xl text-center">
                  <div className="text-2xl font-bold">5</div>
                  <div className="text-sm text-pink-100">Administrateurs</div>
                </div>
                <div className="bg-white/20 backdrop-blur-sm p-4 rounded-xl text-center">
                  <div className="text-2xl font-bold">24</div>
                  <div className="text-sm text-pink-100">Messages</div>
                </div>
                <div className="bg-white/20 backdrop-blur-sm p-4 rounded-xl text-center">
                  <div className="text-2xl font-bold">2</div>
                  <div className="text-sm text-pink-100">En ligne</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="container mx-auto p-8">
          <div className="grid lg:grid-cols-4 gap-8 h-[800px]">
            {/* Enhanced Admin List */}
            <Card className="lg:col-span-1 border-0 shadow-2xl bg-gradient-to-br from-white to-purple-50">
              <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50 border-b border-purple-200">
                <CardTitle className="flex items-center text-gray-800">
                  <Users className="h-5 w-5 mr-2 text-purple-600" />
                  Équipe Admin
                </CardTitle>
                <CardDescription>Membres connectés</CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                {/* Search */}
                <div className="p-4 border-b border-purple-100">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input 
                      placeholder="Rechercher un admin..." 
                      className="pl-10 border-2 border-purple-200 focus:border-purple-500 transition-colors"
                    />
                  </div>
                </div>
                
                {/* Admin List */}
                <ScrollArea className="h-[600px]">
                  <div className="space-y-2 p-4">
                    {[
                      { name: 'Admin Principal', role: 'Super Admin', online: true },
                      { name: 'Marie Dubois', role: 'Gestionnaire', online: true },
                      { name: 'Pierre Martin', role: 'Support', online: false },
                      { name: 'Sophie Laurent', role: 'Marketing', online: true },
                      { name: 'Thomas Bernard', role: 'Technique', online: false }
                    ].map((admin, index) => (
                      <div 
                        key={index} 
                        className="p-4 rounded-xl border border-purple-100 hover:bg-gradient-to-r hover:from-purple-50 hover:to-pink-50 cursor-pointer transition-all duration-200 hover:shadow-md"
                      >
                        <div className="flex items-center space-x-3">
                          <div className="relative">
                            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full flex items-center justify-center text-white font-bold">
                              {admin.name.split(' ').map(n => n[0]).join('')}
                            </div>
                            <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white ${admin.online ? 'bg-green-500' : 'bg-gray-400'}`}></div>
                          </div>
                          <div className="flex-1">
                            <h4 className="font-semibold text-gray-800">{admin.name}</h4>
                            <p className="text-xs text-gray-500">{admin.role}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>

            {/* Enhanced Chat Interface */}
            <Card className="lg:col-span-3 border-0 shadow-2xl bg-gradient-to-br from-white to-purple-50">
              <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50 border-b border-purple-100">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full flex items-center justify-center text-white font-bold shadow-lg">
                      #
                    </div>
                    <div>
                      <CardTitle className="text-gray-800">Canal Principal</CardTitle>
                      <CardDescription>Communication générale de l'équipe</CardDescription>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge className="bg-gradient-to-r from-green-500 to-emerald-600 text-white border-0">5 membres</Badge>
                    <Button variant="outline" size="sm" className="border-purple-200 text-purple-600 hover:bg-purple-50">
                      <Clock className="h-4 w-4 mr-2" />
                      Historique
                    </Button>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="p-0 flex flex-col h-[680px]">
                {/* Messages Area */}
                <ScrollArea className="flex-1 p-6" ref={scrollRef}>
                  <div className="space-y-4">
                    {/* System notification */}
                    {messages.map((msg, index) => (
                      <div key={msg.id}>
                        {msg.type === 'notification' ? (
                          <div className="flex justify-center">
                            <div className="bg-gradient-to-r from-purple-100 to-pink-100 px-4 py-2 rounded-full border border-purple-200">
                              <p className="text-sm text-purple-700">{msg.content}</p>
                            </div>
                          </div>
                        ) : (
                          <div className={`flex ${msg.senderId === 'you' ? 'justify-end' : 'justify-start'}`}>
                            <div className="max-w-xs lg:max-w-md">
                              {msg.senderId !== 'you' && (
                                <div className="flex items-center space-x-2 mb-2">
                                  <div className="w-6 h-6 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white text-xs font-bold">
                                    {msg.senderName.split(' ').map(n => n[0]).join('')}
                                  </div>
                                  <span className="text-sm font-medium text-gray-700">{msg.senderName}</span>
                                  <span className="text-xs text-gray-500">{format(new Date(msg.timestamp), 'HH:mm', { locale: fr })}</span>
                                </div>
                              )}
                              <div className={`${msg.senderId === 'you'
                                ? 'bg-gradient-to-r from-purple-500 to-pink-600 text-white rounded-2xl rounded-tr-md'
                                : 'bg-gradient-to-r from-gray-100 to-gray-200 text-gray-800 rounded-2xl rounded-tl-md'} p-4 shadow-md ${msg.senderId === 'you' ? 'mr-8' : 'ml-8'}`}>
                                <p>{msg.content}</p>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </ScrollArea>

                <Separator className="bg-gradient-to-r from-transparent via-purple-300 to-transparent" />

                {/* Enhanced Message Input */}
                <div className="p-6 bg-gradient-to-r from-purple-50 to-pink-50">
                  <div className="flex space-x-4">
                    <Input 
                      placeholder="Tapez votre message..." 
                      className="flex-1 border-2 border-purple-200 focus:border-purple-500 transition-colors h-12 rounded-xl"
                      value={newMessage}
                      onChange={handleInputChange}
                    />
                    <Button 
                      className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
                      onClick={handleSendMessage}
                    >
                      <Send className="h-5 w-5 mr-2" />
                      Envoyer
                    </Button>
                  </div>
                  
                  {/* Quick Admin Responses */}
                  <div className="mt-4 flex flex-wrap gap-2">
                    <Button variant="outline" size="sm" className="border-purple-200 text-purple-600 hover:bg-purple-50 rounded-full">
                      Réunion planifiée
                    </Button>
                    <Button variant="outline" size="sm" className="border-purple-200 text-purple-600 hover:bg-purple-50 rounded-full">
                      Rapport disponible
                    </Button>
                    <Button variant="outline" size="sm" className="border-purple-200 text-purple-600 hover:bg-purple-50 rounded-full">
                      Urgent à traiter
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

export default AdminChatPage;
