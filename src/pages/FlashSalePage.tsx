import React, { useState, useEffect } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import ProductCard from '@/components/products/ProductCard';
import PageDataLoader from '@/components/layout/PageDataLoader';
import { Flame, Clock, Timer, ChevronLeft, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { flashSaleAPI } from '@/services/flashSaleAPI';
import { DynamicIcon } from '@/utils/iconLoader';

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

interface FlashSaleData {
  id: string;
  title: string;
  description: string;
  discount: number;
  startDate: string;
  endDate: string;
  isActive: boolean;
  backgroundColor?: string;
  icon?: string;
  emoji?: string;
  order?: number;
}

const FlashSalePage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [isExpired, setIsExpired] = useState(false);
  const [flashSaleProducts, setFlashSaleProducts] = useState<Product[]>([]);
  const [allFlashSales, setAllFlashSales] = useState<FlashSaleData[]>([]);
  const [currentFlashSaleIndex, setCurrentFlashSaleIndex] = useState(0);
  const [currentFlashSale, setCurrentFlashSale] = useState<FlashSaleData | null>(null);

  // Fonction pour récupérer toutes les ventes flash actives
  const fetchAllFlashSalesData = async () => {
    try {
      console.log('🔍 Chargement de toutes les ventes flash actives...');

      // Récupérer toutes les ventes flash actives
      const activeFlashSalesResponse = await flashSaleAPI.getActiveAll();
      const activeFlashSales = activeFlashSalesResponse.data;

      console.log('📦 Ventes flash actives récupérées:', activeFlashSales);

      if (!activeFlashSales || activeFlashSales.length === 0) {
        throw new Error('Aucune vente flash active trouvée');
      }

      // Trier par ordre
      const sortedFlashSales = activeFlashSales.sort((a, b) => (a.order || 999) - (b.order || 999));
      
      // Récupérer l'index depuis l'URL, sinon utiliser 0
      const urlIndex = parseInt(searchParams.get('index') || '0', 10);
      const targetIndex = Math.min(Math.max(urlIndex, 0), sortedFlashSales.length - 1);
      const targetFlashSale = sortedFlashSales[targetIndex];
      
      // Récupérer les produits de la vente flash ciblée
      const productsResponse = await flashSaleAPI.getProducts(targetFlashSale.id);
      const products = productsResponse.data;

      console.log(`📦 Produits de la vente flash ${targetIndex} récupérés:`, products);

      // Traiter les produits pour appliquer la réduction
      const processedProducts = products.map(product => ({
        ...product,
        originalPrice: product.price,
        price: +(product.price * (1 - targetFlashSale.discount / 100)).toFixed(2),
        promotion: targetFlashSale.discount,
        flashSaleDiscount: targetFlashSale.discount,
        flashSaleTitle: targetFlashSale.title,
        flashSaleDescription: targetFlashSale.description,
        flashSaleStartDate: targetFlashSale.startDate,
        flashSaleEndDate: targetFlashSale.endDate,
        originalFlashPrice: product.price,
        flashSalePrice: +(product.price * (1 - targetFlashSale.discount / 100)).toFixed(2)
      }));

      return { 
        allFlashSales: sortedFlashSales,
        currentFlashSale: targetFlashSale,
        products: processedProducts,
        initialIndex: targetIndex
      };

    } catch (error) {
      console.error('💥 Erreur lors du chargement des ventes flash:', error);
      throw error;
    }
  };

  // Fonction pour changer de vente flash
  const changeFlashSale = async (newIndex: number) => {
    if (newIndex < 0 || newIndex >= allFlashSales.length) return;
    
    try {
      const selectedFlashSale = allFlashSales[newIndex];
      console.log('🔄 Changement vers la vente flash:', selectedFlashSale.title);
      
      // Récupérer les produits de cette vente flash
      const productsResponse = await flashSaleAPI.getProducts(selectedFlashSale.id);
      const products = productsResponse.data;

      // Traiter les produits
      const processedProducts = products.map(product => ({
        ...product,
        originalPrice: product.price,
        price: +(product.price * (1 - selectedFlashSale.discount / 100)).toFixed(2),
        promotion: selectedFlashSale.discount,
        flashSaleDiscount: selectedFlashSale.discount,
        flashSaleTitle: selectedFlashSale.title,
        flashSaleDescription: selectedFlashSale.description,
        flashSaleStartDate: selectedFlashSale.startDate,
        flashSaleEndDate: selectedFlashSale.endDate,
        originalFlashPrice: product.price,
        flashSalePrice: +(product.price * (1 - selectedFlashSale.discount / 100)).toFixed(2)
      }));

      setCurrentFlashSaleIndex(newIndex);
      setCurrentFlashSale(selectedFlashSale);
      setFlashSaleProducts(processedProducts);
    } catch (error) {
      console.error('💥 Erreur lors du changement de vente flash:', error);
    }
  };

  const handleDataSuccess = (data: { allFlashSales: FlashSaleData[], currentFlashSale: FlashSaleData, products: Product[], initialIndex: number }) => {
    console.log('✅ Données chargées avec succès:', data);
    setAllFlashSales(data.allFlashSales);
    setCurrentFlashSale(data.currentFlashSale);
    setFlashSaleProducts(data.products);
    setCurrentFlashSaleIndex(data.initialIndex);
  };

  const handleMaxRetriesReached = () => {
    console.error('❌ Nombre maximum de tentatives atteint');
    setFlashSaleProducts([]);
    setCurrentFlashSale(null);
    setAllFlashSales([]);
  };

  // Calculer le temps restant
  useEffect(() => {
    if (!currentFlashSale || !currentFlashSale.endDate) return;

    const calculateTimeLeft = () => {
      const endTime = new Date(currentFlashSale.endDate).getTime();
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
  }, [currentFlashSale]);

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

  // Utiliser les données spécifiques de la vente flash pour le style
  const backgroundColor = currentFlashSale?.backgroundColor || '#dc2626';
  const iconName = currentFlashSale?.icon || 'Flame';
  const emoji = currentFlashSale?.emoji || '🔥';

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <PageDataLoader
          fetchFunction={fetchAllFlashSalesData}
          onSuccess={handleDataSuccess}
          onMaxRetriesReached={handleMaxRetriesReached}
          loadingMessage="Chargement des ventes flash..."
          loadingSubmessage="Récupération des promotions actives..."
          errorMessage="Erreur de chargement des ventes flash"
        >
          {currentFlashSale && allFlashSales.length > 0 && (
            <>
              {/* Navigation entre les ventes flash */}
              {allFlashSales.length > 1 && (
                <div className="flex justify-center items-center mb-6">
                  <button
                    onClick={() => changeFlashSale(currentFlashSaleIndex - 1)}
                    disabled={currentFlashSaleIndex === 0}
                    className="p-2 rounded-full bg-gray-200 hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed mr-4"
                  >
                   <ChevronLeft className="h-8 w-8 text-blue-800 font-bold" />

                  </button>
                  
                  <div className="text-center">
                    <p className="text-sm text-red-900 mb-1 font-bold">
                      VENTE FLASH  : {currentFlashSaleIndex + 1} sur {allFlashSales.length}
                    </p>
                 <div className="flex justify-center items-center space-x-2">
                  {allFlashSales.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => changeFlashSale(index)} 
                    className={`w-3 h-3 rounded-full ${
                    index === currentFlashSaleIndex ? 'bg-blue-500' : 'bg-gray-300'
                  }`}
                  />
                ))}
              </div>

                  </div>
                  
                  <button
                    onClick={() => changeFlashSale(currentFlashSaleIndex + 1)}
                    disabled={currentFlashSaleIndex === allFlashSales.length - 1}
                    className="p-2 rounded-full bg-gray-200 hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed ml-4"
                  >
                    <ChevronRight className="h-8 w-8 text-blue-800 font-bold"  />
                  </button>
                </div>
              )}

              {/* En-tête de la vente flash avec style personnalisé */}
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-white rounded-lg p-8 mb-8 relative overflow-hidden"
                style={{ backgroundColor }}
              >
                <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxkZWZzPjxwYXR0ZXJuIGlkPSJwYXR0ZXJuIiB4PSIwIiB5PSIwIiB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHBhdHRlcm5Vbml0cz0idXNlclNwYWNlT25Vc2UiIHBhdHRlcm5UcmFuc2Zvcm09InJvdGF0ZSgzMCkiPjxyZWN0IHg9IjAiIHk9IjAiIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCIgZmlsbD0icmdiYSgyNTUsMjU1LDI1NSwwLjA1KSIgLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHg9IjAiIHk9IjAiIHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjcGF0dGVybikiIC8+PC9zdmc+')] opacity-30" />
                
                <div className="text-center relative z-10">
                  <div className="flex items-center justify-center space-x-2 mb-4">
                    <div className="p-2 bg-white/20 backdrop-blur rounded-full">
                      <DynamicIcon name={iconName} className="h-8 w-8 text-white animate-pulse" />
                    </div>
                    <h1 className="text-3xl font-bold">{currentFlashSale.title}</h1>
                    <span className="text-2xl">{emoji}</span>
                    <span className="bg-yellow-400 text-black px-4 py-2 rounded-full text-lg font-bold">
                      -{currentFlashSale.discount}% DE PROMOS
                    </span>
                  </div>
                  
                  <p className="text-xl mb-6 opacity-90">{currentFlashSale.description}</p>
                  
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
                
                {flashSaleProducts.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {flashSaleProducts.map((product) => (
                      <motion.div
                        key={product.id}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.3 }}
                      >
                        <ProductCard product={product} />
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <p className="text-gray-600 text-lg">Aucun produit disponible pour cette vente flash.</p>
                  </div>
                )}
              </div>
            </>
          )}
        </PageDataLoader>
      </div>
    </Layout>
  );
};

export default FlashSalePage;
