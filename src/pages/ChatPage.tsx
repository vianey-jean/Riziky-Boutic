
import React, { useState } from 'react';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { User } from 'lucide-react';
import ClientChat from '@/components/chat/ClientChat';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import { toast } from '@/components/ui/sonner';

const ChatPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  // État pour stocker la question sélectionnée
  const [selectedQuestion, setSelectedQuestion] = useState<string | null>(null);
  
  // Vérifier s'il y a une question dans le state de location
  useEffect(() => {
    if (location.state && location.state.faqQuestion && user) {
      setSelectedQuestion(location.state.faqQuestion);
      // Supprimer l'état pour éviter de réafficher la question après navigation
      navigate('/chat', { replace: true });
      toast.info("Question prête à être envoyée!", {
        description: location.state.faqQuestion
      });
    }
  }, [location, user]);
  
  // Handler pour les questions fréquentes
  const handleFaqClick = (question: string) => {
    if (!user) {
      console.log("FAQ clicked:", question);
      // Rediriger vers la page de connexion avec la question en state
      navigate('/login', { state: { faqQuestion: question } });
    } else {
      // Si l'utilisateur est connecté, définir la question sélectionnée
      setSelectedQuestion(question);
      toast.info("Question prête à être envoyée!");
    }
  };
  
  return (
    <Layout>
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Service Client</h1>
        
        {user ? (
          <ClientChat initialQuestion={selectedQuestion} />
        ) : (
          <div className="bg-white border rounded-lg overflow-hidden p-8 text-center">
            <div className="flex justify-center mb-4">
              <div className="bg-red-800 w-16 h-16 rounded-full flex items-center justify-center text-white">
                <User className="h-8 w-8" />
              </div>
            </div>
            <h2 className="text-xl font-semibold mb-4">Connectez-vous pour accéder au chat</h2>
            <p className="text-gray-600 mb-6">
              Pour discuter avec notre service client, veuillez vous connecter à votre compte.
            </p>
            <Button className="bg-red-800 hover:bg-red-700" onClick={() => navigate('/login')}>
              Se connecter
            </Button>
          </div>
        )}
        
        {!user && (
          <div className="mt-8">
            <h2 className="text-xl font-semibold mb-4">Questions fréquentes</h2>
            
            <div className="space-y-3">
              <Button 
                variant="outline" 
                className="w-full justify-start"
                onClick={() => handleFaqClick("Comment suivre ma livraison?")}
              >
                Comment suivre ma livraison?
              </Button>
              <Button 
                variant="outline" 
                className="w-full justify-start"
                onClick={() => handleFaqClick("Comment retourner un produit?")}
              >
                Comment retourner un produit?
              </Button>
              <Button 
                variant="outline" 
                className="w-full justify-start"
                onClick={() => handleFaqClick("Quels modes de paiement acceptez-vous?")}
              >
                Quels modes de paiement acceptez-vous?
              </Button>
              <Button 
                variant="outline" 
                className="w-full justify-start"
                onClick={() => handleFaqClick("Avez-vous des réductions régulières?")}
              >
                Avez-vous des réductions régulières?
              </Button>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default ChatPage;
