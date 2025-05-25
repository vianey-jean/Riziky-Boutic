
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, Send, User, Bot } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

const LiveChatWidget: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'Bonjour ! Comment puis-je vous aider aujourd\'hui ?',
      sender: 'bot',
      timestamp: new Date()
    }
  ]);

  const handleSendMessage = () => {
    if (!message.trim()) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      text: message,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, newMessage]);
    setMessage('');

    // Réponse automatique du bot (simulation)
    setTimeout(() => {
      const botResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: 'Merci pour votre message ! Un de nos conseillers va vous répondre rapidement.',
        sender: 'bot',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, botResponse]);
    }, 1000);
  };

  return (
    <>
      {/* Bouton flottant */}
      <motion.div
        className="fixed bottom-6 right-6 z-50"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        <Button
          onClick={() => setIsOpen(true)}
          className="rounded-full w-14 h-14 bg-blue-600 hover:bg-blue-700 shadow-lg"
        >
          <MessageCircle className="h-6 w-6" />
        </Button>
        
        {/* Notification badge */}
        <motion.div
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center"
        >
          1
        </motion.div>
      </motion.div>

      {/* Fenêtre de chat */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            className="fixed bottom-24 right-6 z-50 w-80 h-96"
          >
            <Card className="h-full flex flex-col shadow-xl">
              {/* En-tête */}
              <div className="bg-blue-600 text-white p-4 rounded-t-lg">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                    <span className="font-medium">Support en ligne</span>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsOpen(false)}
                    className="text-white hover:bg-blue-700 p-1"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 p-4 overflow-y-auto space-y-3">
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className="flex items-start space-x-2 max-w-[80%]">
                      {msg.sender === 'bot' && (
                        <Avatar className="w-6 h-6">
                          <AvatarFallback className="bg-blue-100">
                            <Bot className="h-3 w-3 text-blue-600" />
                          </AvatarFallback>
                        </Avatar>
                      )}
                      
                      <div
                        className={`p-3 rounded-lg text-sm ${
                          msg.sender === 'user'
                            ? 'bg-blue-600 text-white ml-auto'
                            : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {msg.text}
                      </div>
                      
                      {msg.sender === 'user' && (
                        <Avatar className="w-6 h-6">
                          <AvatarFallback className="bg-gray-200">
                            <User className="h-3 w-3 text-gray-600" />
                          </AvatarFallback>
                        </Avatar>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Zone de saisie */}
              <div className="p-4 border-t">
                <div className="flex space-x-2">
                  <Input
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Tapez votre message..."
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                    className="flex-1"
                  />
                  <Button 
                    onClick={handleSendMessage}
                    size="sm"
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default LiveChatWidget;
