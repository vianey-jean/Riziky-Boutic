
import React, { useState } from 'react';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Send, User } from 'lucide-react';

type Message = {
  id: string;
  sender: 'user' | 'support';
  content: string;
  timestamp: Date;
};

const ChatPage = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      sender: 'support',
      content: 'Bonjour! Comment puis-je vous aider aujourd\'hui?',
      timestamp: new Date(Date.now() - 1000 * 60 * 5), // 5 minutes ago
    },
  ]);
  
  const [newMessage, setNewMessage] = useState('');
  
  const handleSendMessage = () => {
    if (!newMessage.trim()) return;
    
    // Add user message
    const userMessage: Message = {
      id: `user-${Date.now()}`,
      sender: 'user',
      content: newMessage,
      timestamp: new Date(),
    };
    
    setMessages(prevMessages => [...prevMessages, userMessage]);
    setNewMessage('');
    
    // Simulate response after a short delay
    setTimeout(() => {
      const supportMessage: Message = {
        id: `support-${Date.now()}`,
        sender: 'support',
        content: getAutoResponse(newMessage),
        timestamp: new Date(),
      };
      
      setMessages(prevMessages => [...prevMessages, supportMessage]);
    }, 1000);
  };
  
  // Simple auto-responses based on keywords
  const getAutoResponse = (message: string): string => {
    const lowerMsg = message.toLowerCase();
    
    if (lowerMsg.includes('livraison') || lowerMsg.includes('expédier')) {
      return 'Nos délais de livraison sont généralement de 3-5 jours ouvrés. Une fois votre commande expédiée, vous recevrez un email de confirmation avec un numéro de suivi.';
    } else if (lowerMsg.includes('retour') || lowerMsg.includes('rembourser')) {
      return 'Vous pouvez retourner un produit dans les 30 jours suivant la réception. Veuillez vous rendre dans la section "Mes Commandes" et suivre les instructions de retour.';
    } else if (lowerMsg.includes('paiement') || lowerMsg.includes('carte')) {
      return 'Nous acceptons les paiements par carte de crédit (Visa, MasterCard), PayPal et Apple Pay. Tous les paiements sont sécurisés et cryptés.';
    } else if (lowerMsg.includes('prix') || lowerMsg.includes('réduction')) {
      return 'Nous proposons régulièrement des promotions. Inscrivez-vous à notre newsletter pour être informé des prochaines réductions. Vous pouvez également utiliser le code "BIENVENUE10" pour obtenir 10% de réduction sur votre première commande.';
    }
    
    return 'Merci pour votre message. Un conseiller client vous répondra dans les plus brefs délais. Habituellement, nous répondons dans un délai de 24 heures.';
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('fr-FR', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <Layout>
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Service Client</h1>
        
        <div className="bg-white border rounded-lg overflow-hidden">
          <div className="p-4 bg-gray-50 border-b">
            <div className="flex items-center">
              <div className="bg-brand-blue w-10 h-10 rounded-full flex items-center justify-center text-white">
                <User className="h-5 w-5" />
              </div>
              <div className="ml-3">
                <h2 className="font-medium">Support FranceBoutique</h2>
                <p className="text-xs text-muted-foreground">En ligne</p>
              </div>
            </div>
          </div>
          
          <div className="h-96 overflow-y-auto p-4 space-y-4">
            {messages.map(message => (
              <div 
                key={message.id} 
                className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div 
                  className={`max-w-[80%] rounded-lg px-4 py-2 ${
                    message.sender === 'user' 
                      ? 'bg-brand-blue text-white' 
                      : 'bg-gray-100 text-gray-800'
                  }`}
                >
                  <p>{message.content}</p>
                  <p className={`text-xs mt-1 ${
                    message.sender === 'user' ? 'text-blue-100' : 'text-gray-500'
                  }`}>
                    {formatTime(message.timestamp)}
                  </p>
                </div>
              </div>
            ))}
          </div>
          
          <div className="p-4 border-t">
            <div className="flex space-x-2">
              <Textarea
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Écrivez votre message..."
                className="resize-none"
                onKeyPress={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage();
                  }
                }}
              />
              <Button onClick={handleSendMessage}>
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
        
        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-4">Questions fréquentes</h2>
          
          <div className="space-y-3">
            <Button 
              variant="outline" 
              onClick={() => setNewMessage('Comment suivre ma livraison?')}
              className="w-full justify-start"
            >
              Comment suivre ma livraison?
            </Button>
            <Button 
              variant="outline" 
              onClick={() => setNewMessage('Comment retourner un produit?')}
              className="w-full justify-start"
            >
              Comment retourner un produit?
            </Button>
            <Button 
              variant="outline" 
              onClick={() => setNewMessage('Quels modes de paiement acceptez-vous?')}
              className="w-full justify-start"
            >
              Quels modes de paiement acceptez-vous?
            </Button>
            <Button 
              variant="outline" 
              onClick={() => setNewMessage('Avez-vous des réductions régulières?')}
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
