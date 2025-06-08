import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import ProductCard from '@/components/products/ProductCard';
import PageDataLoader from '@/components/layout/PageDataLoader';
import { Flame, Clock, Timer } from 'lucide-react';
import { motion } from 'framer-motion';
import { flashSaleAPI } from '@/services/flashSaleAPI';

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  image: string;
  images?: string[];
  category: string;
  isSold: boolean;
  promotion?: number | null;
  promotionEnd?: string | null;
  stock?: number;
  dateAjout?: string;
  flashSaleDiscount?: number;
  flashSaleStartDate?: string;
  flashSaleEndDate?: string;
  flashSaleTitle?: string;
  flashSaleDescription?: string;
  originalFlashPrice?: number;
  flashSalePrice?: number;
}

const FlashSalePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [isExpired, setIsExpired] = useState(false);
  const [flashSaleProducts, setFlashSaleProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [flashSaleInfo, setFlashSaleInfo] = useState<{
    title: string;
    description: string;
    discount: number;
    startDate: string;
    endDate: string;
  } | null>(null);

  // Récupérer les produits de vente flash depuis l'API
  const fetchFlashSaleProducts = async () => {
    try {
      console.log('🔍 Chargement des produits de vente flash depuis l\'API');

      // Utiliser uniquement l'API, pas d'accès direct aux fichiers JSON
      const response = await flashSaleAPI.getBanniereProducts();
      const products = response.data;
      
      console.log('📦 Produits de vente flash récupérés via API:', products);

      if (!products || products.length === 0) {
        console.log('❌ Aucun produit dans la réponse API');
        throw new Error('Aucun produit de vente flash disponible');
      }

      // Utiliser les informations du premier produit pour la vente flash
      const firstProduct = products[0];
      const saleInfo = {
        title: firstProduct.flashSaleTitle || 'Vente Flash',
        description: firstProduct.flashSaleDescription || 'Profitez de nos offres exceptionnelles !',
        discount: firstProduct.flashSaleDiscount || 0,
        startDate: firstProduct.flashSaleStartDate || '',
        endDate: firstProduct.flashSaleEndDate || ''
      };

      // Traiter les produits pour s'assurer que le prix affiché est le prix de vente flash
      const processedProducts = products.map(product => ({
        ...product,
        // Utiliser flashSalePrice comme prix principal si disponible
        price: product.flashSalePrice || product.price,
        // Conserver le prix original pour l'affichage de la réduction
        originalPrice: product.originalFlashPrice || product.originalPrice || product.price
      }));

      return { products: processedProducts, saleInfo };

    } catch (error) {
      console.error('💥 Erreur lors du chargement des produits de vente flash via API:', error);
      throw error;
    }
  };

  const handleDataSuccess = (data: { products: Product[], saleInfo: any }) => {
    setFlashSaleProducts(data.products);
    setFlashSaleInfo(data.saleInfo);
    setIsLoading(false);
  };

  const handleMaxRetriesReached = () => {
    setFlashSaleProducts([]);
    setFlashSaleInfo(null);
    setIsLoading(false);
  };

  // Calculer le temps restant
  useEffect(() => {
    if (!flashSaleInfo || !flashSaleInfo.endDate) return;

    const calculateTimeLeft = () => {
      const endTime = new Date(flashSaleInfo.endDate).getTime();
      const difference = endTime - new Date().getTime();
      
      if (difference > 0) {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);
        
        setTimeLeft({ days, hours, minutes, seconds });
        setIsExpired(false);
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        setIsExpired(true);
      }
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(timer);
  }, [flashSaleInfo]);

  if (!flashSaleInfo || flashSaleProducts.length === 0) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <div className="text-center py-20">
            <Flame className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">Aucune vente flash active</h2>
            <p className="text-gray-600">Il n'y a actuellement aucune vente flash disponible.</p>
          </div>
        </div>
      </Layout>
    );
  }

  if (isExpired) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <div className="text-center py-20">
            <Timer className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">Vente flash expirée</h2>
            <p className="text-gray-600">Cette vente flash est terminée.</p>
          </div>
        </div>
      </Layout>
    );
  }

  const timeUnits = [
    { label: 'Jours', value: timeLeft.days },
    { label: 'Heures', value: timeLeft.hours },
    { label: 'Min', value: timeLeft.minutes },
    { label: 'Sec', value: timeLeft.seconds }
  ];

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <PageDataLoader
          fetchFunction={fetchFlashSaleProducts}
          onSuccess={handleDataSuccess}
          onMaxRetriesReached={handleMaxRetriesReached}
          loadingMessage="Chargement de la vente flash..."
          loadingSubmessage="Récupération des offres exceptionnelles..."
          errorMessage="Erreur de chargement de la vente flash"
        >
          {/* En-tête de la vente flash */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-r from-red-600 via-pink-600 to-orange-600 text-white rounded-lg p-8 mb-8"
          >
            <div className="text-center">
              <div className="flex items-center justify-center space-x-2 mb-4">
                <Flame className="h-8 w-8 text-yellow-300 animate-pulse" />
                <h1 className="text-3xl font-bold">{flashSaleInfo.title}</h1>
                <span className="bg-yellow-400 text-black px-4 py-2 rounded-full text-lg font-bold">
                  -{flashSaleInfo.discount}%
                </span>
              </div>
              
              <p className="text-xl mb-6 opacity-90">{flashSaleInfo.description}</p>
              
              <div className="flex justify-center items-center space-x-2 mb-4">
                <Clock className="h-5 w-5" />
                <span className="text-lg font-medium">Se termine dans:</span>
              </div>
              
              <div className="flex justify-center space-x-4">
                {timeUnits.map((time, index) => (
                  <motion.div
                    key={time.label}
                    initial={{ scale: 0.8 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: index * 0.1 }}
                    className="text-center"
                  >
                    <motion.div
                      key={time.value}
                      initial={{ rotateX: -90 }}
                      animate={{ rotateX: 0 }}
                      transition={{ duration: 0.3 }}
                      className="bg-black/30 backdrop-blur rounded-lg px-4 py-3 min-w-[70px] mb-2"
                    >
                      <div className="text-2xl font-bold">
                        {time.value.toString().padStart(2, '0')}
                      </div>
                    </motion.div>
                    <div className="text-sm opacity-80">{time.label}</div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Produits en vente flash */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Produits en vente flash : <span className="text-red-800 font-bold">{flashSaleProducts.length}</span>
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {flashSaleProducts.map((product) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <ProductCard 
                    product={{
                      ...product,
                      // S'assurer que la promotion est affichée
                      promotion: product.flashSaleDiscount || product.promotion
                    }} 
                  />
                </motion.div>
              ))}
            </div>
          </div>
        </PageDataLoader>
      </div>
    </Layout>
  );
};

export default FlashSalePage;
