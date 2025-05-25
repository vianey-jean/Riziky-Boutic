
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, TrendingUp, Heart, ShoppingBag } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import ProductCard from '../products/ProductCard';
import { Product } from '@/contexts/StoreContext';

interface RecommendationSection {
  id: string;
  title: string;
  icon: React.ReactNode;
  description: string;
  products: Product[];
  color: string;
}

const PersonalizedRecommendations: React.FC = () => {
  const [recommendations, setRecommendations] = useState<RecommendationSection[]>([]);
  const [activeSection, setActiveSection] = useState(0);

  useEffect(() => {
    // Simuler des recommandations personnalisées
    const mockRecommendations: RecommendationSection[] = [
      {
        id: 'trending',
        title: 'Tendances pour vous',
        icon: <TrendingUp className="h-5 w-5" />,
        description: 'Basé sur vos recherches récentes',
        color: 'from-blue-500 to-purple-600',
        products: [
          {
            id: '1',
            name: 'Casque Gaming RGB',
            description: 'Casque haute qualité pour gaming',
            price: 89.99,
            image: '/placeholder.svg',
            category: 'Gaming',
            isSold: true,
            promotion: 15
          },
          {
            id: '2',
            name: 'Clavier Mécanique',
            description: 'Clavier gaming professionnel',
            price: 129.99,
            image: '/placeholder.svg',
            category: 'Gaming',
            isSold: true
          }
        ]
      },
      {
        id: 'favorites',
        title: 'Similaires à vos favoris',
        icon: <Heart className="h-5 w-5" />,
        description: 'Produits que vous pourriez aimer',
        color: 'from-pink-500 to-red-600',
        products: [
          {
            id: '3',
            name: 'Smartphone Premium',
            description: 'Dernière génération',
            price: 899.99,
            image: '/placeholder.svg',
            category: 'Électronique',
            isSold: true,
            promotion: 10
          }
        ]
      },
      {
        id: 'frequently',
        title: 'Souvent achetés ensemble',
        icon: <ShoppingBag className="h-5 w-5" />,
        description: 'Parfait complément à vos achats',
        color: 'from-green-500 to-teal-600',
        products: [
          {
            id: '4',
            name: 'Coque de Protection',
            description: 'Protection premium',
            price: 24.99,
            image: '/placeholder.svg',
            category: 'Accessoires',
            isSold: true
          }
        ]
      }
    ];
    
    setRecommendations(mockRecommendations);
  }, []);

  if (recommendations.length === 0) return null;

  return (
    <div className="py-12">
      <div className="text-center mb-8">
        <div className="flex items-center justify-center mb-4">
          <Sparkles className="h-6 w-6 text-yellow-500 mr-2" />
          <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
            Recommandations pour vous
          </h2>
        </div>
        <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
          Découvrez des produits sélectionnés spécialement selon vos préférences et habitudes d'achat
        </p>
      </div>

      {/* Navigation des sections */}
      <div className="flex justify-center mb-8">
        <div className="flex space-x-2 bg-gray-100 dark:bg-gray-800 p-1 rounded-full">
          {recommendations.map((section, index) => (
            <Button
              key={section.id}
              variant={activeSection === index ? "default" : "ghost"}
              size="sm"
              onClick={() => setActiveSection(index)}
              className={`rounded-full ${
                activeSection === index 
                  ? 'bg-white dark:bg-gray-700 shadow-sm' 
                  : ''
              }`}
            >
              {section.icon}
              <span className="ml-2 hidden sm:inline">{section.title}</span>
            </Button>
          ))}
        </div>
      </div>

      {/* Section active */}
      <motion.div
        key={activeSection}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        {recommendations[activeSection] && (
          <Card className="p-6 mb-6">
            <div className={`bg-gradient-to-r ${recommendations[activeSection].color} text-white p-6 rounded-lg mb-6`}>
              <div className="flex items-center space-x-3 mb-2">
                {recommendations[activeSection].icon}
                <h3 className="text-xl font-bold">
                  {recommendations[activeSection].title}
                </h3>
                <Badge variant="secondary" className="bg-white/20 text-white">
                  Nouveau
                </Badge>
              </div>
              <p className="opacity-90">
                {recommendations[activeSection].description}
              </p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {recommendations[activeSection].products.map((product) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.1 }}
                  whileHover={{ y: -5 }}
                >
                  <ProductCard product={product} />
                </motion.div>
              ))}
            </div>
            
            <div className="text-center mt-6">
              <Button 
                variant="outline" 
                className="px-8"
              >
                Voir plus de recommandations
              </Button>
            </div>
          </Card>
        )}
      </motion.div>
    </div>
  );
};

export default PersonalizedRecommendations;
