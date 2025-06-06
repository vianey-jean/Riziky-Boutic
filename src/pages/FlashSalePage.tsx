
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import ProductCard from '@/components/products/ProductCard';
import { Flame, Clock, Timer, Sparkles, Zap, Star, Gift } from 'lucide-react';
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
  useEffect(() => {
    const fetchFlashSaleProducts = async () => {
      try {
        setIsLoading(true);
        console.log('🔍 Chargement des produits de vente flash depuis l\'API');

        // Utiliser uniquement l'API, pas d'accès direct aux fichiers JSON
        const response = await flashSaleAPI.getBanniereProducts();
        const products = response.data;
        
        console.log('📦 Produits de vente flash récupérés via API:', products);

        if (!products || products.length === 0) {
          console.log('❌ Aucun produit dans la réponse API');
          setFlashSaleProducts([]);
          setFlashSaleInfo(null);
          setIsLoading(false);
          return;
        }

        // Utiliser les informations du premier produit pour la vente flash
        const firstProduct = products[0];
        setFlashSaleInfo({
          title: firstProduct.flashSaleTitle || 'Vente Flash',
          description: firstProduct.flashSaleDescription || 'Profitez de nos offres exceptionnelles !',
          discount: firstProduct.flashSaleDiscount || 0,
          startDate: firstProduct.flashSaleStartDate || '',
          endDate: firstProduct.flashSaleEndDate || ''
        });

        // Traiter les produits pour s'assurer que le prix affiché est le prix de vente flash
        const processedProducts = products.map(product => ({
          ...product,
          // Utiliser flashSalePrice comme prix principal si disponible
          price: product.flashSalePrice || product.price,
          // Conserver le prix original pour l'affichage de la réduction
          originalPrice: product.originalFlashPrice || product.originalPrice || product.price
        }));

        setFlashSaleProducts(processedProducts);

      } catch (error) {
        console.error('💥 Erreur lors du chargement des produits de vente flash via API:', error);
        setFlashSaleProducts([]);
        setFlashSaleInfo(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchFlashSaleProducts();
  }, [id]);

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

  if (isLoading) {
    return (
      <Layout>
        <div className="min-h-screen bg-gradient-to-br from-red-50 via-orange-50 to-yellow-50 dark:from-red-950 dark:via-orange-950 dark:to-yellow-950 relative overflow-hidden">
          {/* Éléments décoratifs animés */}
          <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-r from-red-300/20 to-orange-300/20 rounded-full -translate-x-48 -translate-y-48 animate-pulse"></div>
          <div className="absolute top-1/2 right-0 w-64 h-64 bg-gradient-to-r from-yellow-300/20 to-red-300/20 rounded-full translate-x-32 animate-bounce"></div>
          
          <div className="container mx-auto px-4 py-8">
            <div className="text-center py-20">
              <motion.div
                animate={{ 
                  rotate: 360,
                  scale: [1, 1.2, 1]
                }}
                transition={{ 
                  rotate: { duration: 2, repeat: Infinity, ease: "linear" },
                  scale: { duration: 1.5, repeat: Infinity }
                }}
                className="mx-auto mb-8"
              >
                <div className="relative">
                  <Flame className="h-20 w-20 text-red-600 drop-shadow-lg" />
                  <div className="absolute inset-0 h-20 w-20 bg-red-400 rounded-full opacity-30 animate-ping"></div>
                </div>
              </motion.div>
              
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-4xl font-bold bg-gradient-to-r from-red-600 via-orange-600 to-yellow-600 bg-clip-text text-transparent mb-6"
              >
                Chargement de la vente flash...
              </motion.h2>
              
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: "100%" }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                className="h-2 bg-gradient-to-r from-red-500 via-orange-500 to-yellow-500 rounded-full mx-auto max-w-xs shadow-lg"
              />
              
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="mt-8 flex justify-center space-x-4"
              >
                {[...Array(3)].map((_, i) => (
                  <motion.div
                    key={i}
                    animate={{ y: [0, -10, 0] }}
                    transition={{ 
                      duration: 1.5, 
                      repeat: Infinity, 
                      delay: i * 0.2,
                      ease: "easeInOut"
                    }}
                    className="w-3 h-3 bg-red-500 rounded-full shadow-lg"
                  />
                ))}
              </motion.div>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  if (!flashSaleInfo || flashSaleProducts.length === 0) {
    return (
      <Layout>
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-slate-100 to-gray-200 dark:from-gray-900 dark:via-slate-800 dark:to-gray-700 relative overflow-hidden">
          {/* Éléments décoratifs */}
          <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-bl from-gray-200/30 to-slate-300/30 rounded-full translate-x-40 -translate-y-40"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-slate-200/20 to-gray-300/20 rounded-full -translate-x-48 translate-y-48"></div>
          
          <div className="container mx-auto px-4 py-8">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6 }}
              className="text-center py-20"
            >
              <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-3xl shadow-2xl p-16 max-w-lg mx-auto border border-white/20">
                <motion.div
                  animate={{ 
                    rotate: [0, 10, -10, 0],
                    scale: [1, 1.1, 1]
                  }}
                  transition={{ duration: 3, repeat: Infinity }}
                  className="mb-8"
                >
                  <Flame className="h-24 w-24 text-gray-400 mx-auto drop-shadow-lg" />
                </motion.div>
                
                <motion.h2 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="text-4xl font-bold text-gray-900 dark:text-white mb-6"
                >
                  Aucune vente flash active
                </motion.h2>
                
                <motion.p 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="text-gray-600 dark:text-gray-300 text-xl leading-relaxed"
                >
                  Il n'y a actuellement aucune vente flash disponible.
                </motion.p>
                
                <motion.div
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.6, type: "spring", stiffness: 200 }}
                  className="mt-8 flex justify-center space-x-2"
                >
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="w-2 h-2 bg-gray-300 rounded-full animate-pulse" style={{ animationDelay: `${i * 0.3}s` }} />
                  ))}
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </Layout>
    );
  }

  if (isExpired) {
    return (
      <Layout>
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-red-50 to-orange-50 dark:from-gray-900 dark:via-red-950 dark:to-orange-950 relative overflow-hidden">
          {/* Éléments décoratifs */}
          <div className="absolute top-1/4 left-0 w-72 h-72 bg-gradient-to-r from-red-200/20 to-orange-200/20 rounded-full -translate-x-36 animate-pulse"></div>
          <div className="absolute bottom-1/4 right-0 w-64 h-64 bg-gradient-to-l from-orange-200/20 to-red-200/20 rounded-full translate-x-32 animate-pulse"></div>
          
          <div className="container mx-auto px-4 py-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center py-20"
            >
              <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl rounded-3xl shadow-2xl p-16 max-w-lg mx-auto border-l-8 border-red-500 relative overflow-hidden">
                {/* Effet de brillance */}
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-red-400 to-transparent animate-pulse"></div>
                
                <motion.div
                  animate={{ 
                    scale: [1, 1.1, 1],
                    opacity: [0.7, 1, 0.7]
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="mb-8"
                >
                  <Timer className="h-24 w-24 text-red-400 mx-auto drop-shadow-lg" />
                </motion.div>
                
                <motion.h2 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="text-4xl font-bold text-gray-900 dark:text-white mb-6"
                >
                  Vente flash expirée
                </motion.h2>
                
                <motion.p 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="text-gray-600 dark:text-gray-300 text-xl leading-relaxed"
                >
                  Cette vente flash est terminée.
                </motion.p>
                
                <motion.div
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.6, type: "spring" }}
                  className="mt-8 inline-flex items-center space-x-2 bg-red-100 dark:bg-red-900/30 px-6 py-3 rounded-full"
                >
                  <Clock className="h-5 w-5 text-red-500" />
                  <span className="text-red-700 dark:text-red-300 font-medium">Terminée</span>
                </motion.div>
              </div>
            </motion.div>
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
      <div className="min-h-screen bg-gradient-to-br from-red-50 via-orange-50 to-yellow-50 dark:from-red-950 dark:via-orange-950 dark:to-yellow-950 relative overflow-hidden">
        {/* Éléments décoratifs améliorés */}
        <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-r from-red-300/20 to-orange-300/20 rounded-full -translate-x-48 -translate-y-48 animate-pulse"></div>
        <div className="absolute top-1/2 right-0 w-80 h-80 bg-gradient-to-l from-yellow-300/20 to-red-300/20 rounded-full translate-x-40 animate-bounce"></div>
        <div className="absolute bottom-0 left-1/3 w-64 h-64 bg-gradient-to-t from-orange-300/15 to-red-300/15 rounded-full translate-y-32 animate-pulse"></div>
        
        <div className="container mx-auto px-4 py-8 relative z-10">
          {/* En-tête de la vente flash ultra-amélioré */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative overflow-hidden bg-gradient-to-r from-red-600 via-pink-600 to-orange-600 text-white rounded-3xl p-12 mb-12 shadow-2xl border border-red-300/30"
          >
            {/* Effets de brillance et éléments décoratifs */}
            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-transparent via-yellow-400 to-transparent animate-pulse"></div>
            <div className="absolute top-0 right-0 w-40 h-40 bg-yellow-400 opacity-20 rounded-full -translate-y-20 translate-x-20 animate-spin"></div>
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-white opacity-10 rounded-full translate-y-16 -translate-x-16 animate-pulse"></div>
            <div className="absolute top-1/2 left-1/2 w-6 h-6 bg-yellow-300 opacity-40 rounded-full animate-ping"></div>
            
            <div className="relative text-center">
              <motion.div 
                className="flex items-center justify-center space-x-4 mb-8"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              >
                <motion.div
                  animate={{ 
                    scale: [1, 1.3, 1],
                    rotate: [0, 15, -15, 0]
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="relative"
                >
                  <Flame className="h-12 w-12 text-yellow-300 drop-shadow-lg" />
                  <div className="absolute inset-0 h-12 w-12 bg-yellow-400 rounded-full opacity-30 animate-ping"></div>
                </motion.div>
                
                <motion.h1 
                  className="text-5xl md:text-6xl font-black tracking-tight drop-shadow-lg"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  {flashSaleInfo.title}
                </motion.h1>
                
                <motion.span 
                  className="bg-gradient-to-r from-yellow-400 to-orange-400 text-black px-8 py-4 rounded-full text-2xl font-black shadow-2xl border-2 border-yellow-300"
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  whileTap={{ scale: 0.95 }}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  -{flashSaleInfo.discount}%
                </motion.span>
                
                <motion.div
                  animate={{ 
                    rotate: [0, 360],
                    scale: [1, 1.2, 1]
                  }}
                  transition={{ 
                    rotate: { duration: 4, repeat: Infinity, ease: "linear" },
                    scale: { duration: 2, repeat: Infinity }
                  }}
                >
                  <Sparkles className="h-10 w-10 text-yellow-300 drop-shadow-lg" />
                </motion.div>
              </motion.div>
              
              <motion.p 
                className="text-2xl md:text-3xl mb-10 opacity-95 font-medium drop-shadow-md"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                {flashSaleInfo.description}
              </motion.p>
              
              <motion.div 
                className="flex justify-center items-center space-x-4 mb-8"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
              >
                <motion.div
                  animate={{ rotate: [0, 360] }}
                  transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                >
                  <Clock className="h-8 w-8 drop-shadow-lg" />
                </motion.div>
                <span className="text-2xl font-semibold drop-shadow-md">Se termine dans:</span>
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  <Zap className="h-8 w-8 text-yellow-300 drop-shadow-lg" />
                </motion.div>
              </motion.div>
              
              <div className="flex justify-center space-x-6 md:space-x-8">
                {timeUnits.map((time, index) => (
                  <motion.div
                    key={time.label}
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: index * 0.1 + 0.8 }}
                    className="text-center"
                  >
                    <motion.div
                      key={time.value}
                      initial={{ rotateX: -90 }}
                      animate={{ rotateX: 0 }}
                      transition={{ duration: 0.4 }}
                      className="bg-black/50 backdrop-blur-xl rounded-3xl px-6 py-6 min-w-[100px] mb-4 border-2 border-white/30 shadow-2xl relative overflow-hidden"
                      whileHover={{ scale: 1.05, y: -5 }}
                    >
                      {/* Effet de brillance interne */}
                      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-yellow-400 to-transparent opacity-60"></div>
                      
                      <div className="text-4xl font-black drop-shadow-lg">
                        {time.value.toString().padStart(2, '0')}
                      </div>
                    </motion.div>
                    <div className="text-sm opacity-90 font-medium uppercase tracking-wider drop-shadow-md">{time.label}</div>
                  </motion.div>
                ))}
              </div>
              
              {/* Indicateurs visuels supplémentaires */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.2 }}
                className="mt-8 flex justify-center space-x-6"
              >
                <div className="flex items-center space-x-2 bg-white/20 backdrop-blur-md px-4 py-2 rounded-full">
                  <Star className="h-5 w-5 text-yellow-300" />
                  <span className="text-sm font-medium">Offre limitée</span>
                </div>
                <div className="flex items-center space-x-2 bg-white/20 backdrop-blur-md px-4 py-2 rounded-full">
                  <Gift className="h-5 w-5 text-yellow-300" />
                  <span className="text-sm font-medium">Stocks limités</span>
                </div>
              </motion.div>
            </div>
          </motion.div>

          {/* Section produits ultra-améliorée */}
          <motion.div 
            className="mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.4 }}
          >
            <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl rounded-3xl p-8 mb-12 shadow-2xl border border-red-100 dark:border-red-900 relative overflow-hidden">
              {/* Éléments décoratifs du header */}
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-red-500 via-orange-500 to-yellow-500"></div>
              <div className="absolute top-2 right-4 w-8 h-8 bg-red-200 dark:bg-red-800 rounded-full opacity-30 animate-pulse"></div>
              
              <div className="flex items-center justify-between mb-6">
                <div>
                  <motion.h2 
                    className="text-4xl font-bold bg-gradient-to-r from-red-600 to-orange-600 bg-clip-text text-transparent mb-3"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                  >
                    Produits en vente flash
                  </motion.h2>
                  <div className="flex items-center space-x-3">
                    <span className="text-xl text-gray-600 dark:text-gray-300">Disponibles maintenant :</span>
                    <motion.span 
                      className="bg-gradient-to-r from-red-600 to-orange-600 text-white px-6 py-3 rounded-full font-bold text-xl shadow-xl border border-red-300"
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.2, type: "spring" }}
                    >
                      {flashSaleProducts.length}
                    </motion.span>
                  </div>
                </div>
                
                <motion.div
                  animate={{ 
                    rotate: [0, 10, -10, 0],
                    scale: [1, 1.1, 1]
                  }}
                  transition={{ duration: 3, repeat: Infinity }}
                  className="hidden md:block"
                >
                  <Flame className="h-16 w-16 text-red-500 drop-shadow-lg" />
                </motion.div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10">
              {flashSaleProducts.map((product, index) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, scale: 0.9, y: 30 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  whileHover={{ y: -8, scale: 1.02 }}
                  className="relative group"
                >
                  {/* Badge flash amélioré */}
                  <div className="absolute -top-3 -right-3 z-20">
                    <motion.div
                      animate={{ 
                        rotate: [0, 15, -15, 0],
                        scale: [1, 1.1, 1]
                      }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className="bg-gradient-to-r from-red-500 to-orange-500 text-white px-4 py-2 rounded-full text-sm font-bold shadow-xl border-2 border-yellow-300 relative overflow-hidden"
                    >
                      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-transparent via-yellow-400/30 to-transparent animate-pulse"></div>
                      <div className="relative flex items-center space-x-1">
                        <Flame className="h-4 w-4" />
                        <span>FLASH</span>
                      </div>
                    </motion.div>
                  </div>
                  
                  {/* Effet de brillance sur hover */}
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-10"></div>
                  
                  <ProductCard 
                    product={{
                      ...product,
                      promotion: product.flashSaleDiscount || product.promotion
                    }} 
                  />
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </Layout>
  );
};

export default FlashSalePage;
