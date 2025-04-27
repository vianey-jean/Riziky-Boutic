
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import AdminLayout from './AdminLayout';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { User } from '@/services/api';
import { Send } from 'lucide-react';

// Simulated data for demonstration
interface Message {
  id: string;
  senderId: string;
  text: string;
  timestamp: Date;
}

interface AdminWithStatus extends User {
  isOnline: boolean;
  lastActive: Date;
}

const AdminChatPage = () => {
  const { user: currentUser } = useAuth();
  const [selectedAdmin, setSelectedAdmin] = useState<AdminWithStatus | null>(null);
  const [messageText, setMessageText] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  
  // Mock admin users with online status
  const [admins, setAdmins] = useState<AdminWithStatus[]>([
    {
      id: "1",
      nom: "Admin Principal",
      email: "admin@example.com",
      role: "admin",
      dateCreation: "2025-04-26T10:00:00.000Z",
      isOnline: true,
      lastActive: new Date()
    },
    {
      id: "3",
      nom: "Marie Dupont",
      email: "marie@example.com",
      role: "admin",
      dateCreation: "2025-04-26T14:30:00.000Z",
      isOnline: false,
      lastActive: new Date(Date.now() - 30 * 60000) // 30 minutes ago
    }
  ]);
  
  // Mock messages
  const mockMessages: Message[] = [
    {
      id: "msg1",
      senderId: "1",
      text: "Bonjour, comment puis-je vous aider?",
      timestamp: new Date(Date.now() - 120000)
    },
    {
      id: "msg2",
      senderId: currentUser?.id || "",
      text: "Bonjour! J'ai une question sur les nouvelles promotions.",
      timestamp: new Date(Date.now() - 60000)
    },
    {
      id: "msg3",
      senderId: "1",
      text: "Bien sûr! Quelle promotion souhaitez-vous mettre en place?",
      timestamp: new Date(Date.now() - 30000)
    }
  ];
  
  useEffect(() => {
    // In a real application, this would fetch online admins and maybe past conversations
    // from an API or WebSocket connection
    
    // Set the first admin as selected by default
    if (admins.length > 0 && admins[0].id !== currentUser?.id) {
      setSelectedAdmin(admins[0]);
      setMessages(mockMessages);
    } else if (admins.length > 1) {
      setSelectedAdmin(admins[1]);
    }
  }, []);
  
  const handleSendMessage = () => {
    if (!messageText.trim() || !selectedAdmin) return;
    
    const newMessage: Message = {
      id: `msg-${Date.now()}`,
      senderId: currentUser?.id || "",
      text: messageText,
      timestamp: new Date()
    };
    
    setMessages([...messages, newMessage]);
    setMessageText('');
    
    // Simulate response (in a real app this would come from WebSockets)
    setTimeout(() => {
      const responseMessage: Message = {
        id: `msg-${Date.now() + 1}`,
        senderId: selectedAdmin.id,
        text: "Merci pour votre message. Je vais regarder ça!",
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, responseMessage]);
    }, 2000);
  };
  
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('fr-FR', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  
  const getTimeAgo = (date: Date) => {
    const diff = Math.floor((new Date().getTime() - date.getTime()) / 60000);
    
    if (diff < 1) return "à l'instant";
    if (diff < 60) return `il y a ${diff} min`;
    
    const hours = Math.floor(diff / 60);
    if (hours < 24) return `il y a ${hours}h`;
    
    const days = Math.floor(hours / 24);
    return `il y a ${days}j`;
  };
  
  return (
    <AdminLayout>
      <h1 className="text-2xl font-bold mb-6">Chat entre administrateurs</h1>
      
      <div className="grid md:grid-cols-4 gap-6 h-[70vh]">
        {/* Admin List */}
        <Card className="md:col-span-1 flex flex-col">
          <div className="p-4 border-b">
            <h2 className="font-semibold">Administrateurs</h2>
          </div>
          
          <ScrollArea className="flex-1">
            {admins.filter(admin => admin.id !== currentUser?.id).map((admin) => (
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
                      {admin.isOnline ? 'En ligne' : `Dernier accès ${getTimeAgo(admin.lastActive)}`}
                    </p>
                  </div>
                </button>
                <Separator />
              </div>
            ))}
            
            {admins.filter(admin => admin.id !== currentUser?.id).length === 0 && (
              <div className="p-4 text-center text-muted-foreground">
                Aucun autre administrateur
              </div>
            )}
          </ScrollArea>
        </Card>
        
        {/* Chat Area */}
        <Card className="md:col-span-3 flex flex-col">
          {selectedAdmin ? (
            <>
              <div className="p-4 border-b flex items-center space-x-3">
                <div className="relative">
                  <div className="w-10 h-10 bg-red-800 text-white rounded-full flex items-center justify-center">
                    {selectedAdmin.nom.charAt(0)}
                  </div>
                  <div className={`absolute bottom-0 right-0 w-3 h-3 rounded-full ${
                    selectedAdmin.isOnline ? 'bg-green-500' : 'bg-gray-400'
                  }`}></div>
                </div>
                <div>
                  <h2 className="font-semibold">{selectedAdmin.nom}</h2>
                  <p className="text-xs text-muted-foreground">
                    {selectedAdmin.isOnline ? 'En ligne' : `Dernier accès ${getTimeAgo(selectedAdmin.lastActive)}`}
                  </p>
                </div>
              </div>
              
              <ScrollArea className="flex-1 p-4">
                <div className="space-y-4">
                  {messages.map((message) => (
                    <div key={message.id} className={`flex ${
                      message.senderId === currentUser?.id ? 'justify-end' : 'justify-start'
                    }`}>
                      <div className={`max-w-[70%] p-3 rounded-lg ${
                        message.senderId === currentUser?.id 
                          ? 'bg-red-800 text-white' 
                          : 'bg-gray-100'
                      }`}>
                        <p>{message.text}</p>
                        <p className={`text-xs mt-1 ${
                          message.senderId === currentUser?.id ? 'text-red-100' : 'text-gray-500'
                        }`}>
                          {formatTime(message.timestamp)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
              
              <div className="p-4 border-t">
                <form onSubmit={(e) => { e.preventDefault(); handleSendMessage(); }} className="flex space-x-2">
                  <Input
                    value={messageText}
                    onChange={(e) => setMessageText(e.target.value)}
                    placeholder="Écrivez votre message..."
                    className="flex-1"
                  />
                  <Button type="submit" className="bg-red-800 hover:bg-red-700">
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
