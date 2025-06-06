import React, { useEffect, useState } from 'react';
import StarRating from './StarRating';
import axios from 'axios';
import { Avatar } from '@/components/ui/avatar';
import { motion } from 'framer-motion';
import { Quote, Star, Heart, CheckCircle, Users } from 'lucide-react';

interface ReviewData {
  id: string;
  userId: string;
  userName: string;
  productId: string;
  productRating: number;
  deliveryRating: number;
  comment: string;
  photos?: string[];
  createdAt: string;
  updatedAt: string;
}

const TestimonialSection: React.FC = () => {
  const [testimonials, setTestimonials] = useState<ReviewData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const AUTH_BASE_URL = import.meta.env.VITE_API_BASE_URL;
  
  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await axios.get(`${AUTH_BASE_URL}/api/reviews/best`);
        
        // Si l'API ne renvoie pas de données, utiliser l'approche de secours
        if (!response.data || !Array.isArray(response.data) || response.data.length === 0) {
          const allReviewsResponse = await axios.get(`${AUTH_BASE_URL}/api/reviews`);
          
          if (allReviewsResponse.data && Array.isArray(allReviewsResponse.data)) {
            // Trier les commentaires par note (d'abord les 5 étoiles, puis les 4, etc.)
            const sortedReviews = [...allReviewsResponse.data].sort((a, b) => {
              // Calculer la moyenne des notes (produit et livraison)
              const avgRatingA = (a.productRating + a.deliveryRating) / 2;
              const avgRatingB = (b.productRating + b.deliveryRating) / 2;
              
              // Trier par note moyenne décroissante
              if (avgRatingB !== avgRatingA) {
                return avgRatingB - avgRatingA;
              }
              
              // Si les notes sont identiques, trier par date (du plus récent au plus ancien)
              return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
            });
            
            // Prendre les trois premiers commentaires
            setTestimonials(sortedReviews.slice(0, 3));
          }
        } else {
          setTestimonials(response.data.slice(0, 3));
        }
        
      } catch (error) {
        console.error("Erreur lors de la récupération des témoignages:", error);
        
        // Approche de secours - charger tous les commentaires et trier
        try {
          const allReviewsResponse = await axios.get(`${AUTH_BASE_URL}/api/reviews`);
          if (allReviewsResponse.data && Array.isArray(allReviewsResponse.data)) {
            // Même logique de tri que ci-dessus
            const sortedReviews = [...allReviewsResponse.data].sort((a, b) => {
              const avgRatingA = (a.productRating + a.deliveryRating) / 2;
              const avgRatingB = (b.productRating + b.deliveryRating) / 2;
              
              if (avgRatingB !== avgRatingA) {
                return avgRatingB - avgRatingA;
              }
              
              return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
            });
            
            setTestimonials(sortedReviews.slice(0, 3));
          }
        } catch (e) {
          console.error("Erreur lors de la récupération de tous les commentaires:", e);
        }
      } finally {
        setLoading(false);
      }
    };
    
    fetchReviews();
  }, [AUTH_BASE_URL]);

  // Calcule la note moyenne (produit et livraison)
  const getAverageRating = (review: ReviewData) => {
    return Math.round((review.productRating + review.deliveryRating) / 2);
  };
  
  // Extraire les initiales du nom pour l'avatar
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  return (
    <section className="mb-16 relative overflow-hidden">
      {/* Éléments décoratifs */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-red-100 dark:bg-red-900/20 rounded-full translate-x-16 -translate-y-16 opacity-60"></div>
      <div className="absolute bottom-0 left-0 w-24 h-24 bg-blue-100 dark:bg-blue-900/20 rounded-full -translate-x-12 translate-y-12 opacity-60"></div>
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="text-center mb-12"
      >
        <div className="flex items-center justify-center space-x-3 mb-4">
          <Heart className="h-6 w-6 text-red-500" />
          <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-red-600 to-orange-600 bg-clip-text text-transparent">
            Ce Que Nos Clients Disent
          </h2>
          <Heart className="h-6 w-6 text-red-500" />
        </div>
        
        <motion.p 
          className="text-lg text-gray-600 dark:text-gray-300 mb-4"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          Découvrez les expériences authentiques de notre communauté
        </motion.p>
        
        <motion.div
          initial={{ width: 0 }}
          whileInView={{ width: 100 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="h-1 bg-gradient-to-r from-red-500 to-orange-500 rounded-full mx-auto"
        />
        
        {/* Statistiques de confiance */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="flex items-center justify-center space-x-6 mt-6 text-sm text-gray-600 dark:text-gray-400"
        >
          <div className="flex items-center space-x-1">
            <Star className="h-4 w-4 text-yellow-500" />
            <span className="font-semibold">4.8/5</span>
          </div>
          <div className="flex items-center space-x-1">
            <Users className="h-4 w-4 text-blue-500" />
            <span className="font-semibold">2,500+ avis</span>
          </div>
          <div className="flex items-center space-x-1">
            <CheckCircle className="h-4 w-4 text-green-500" />
            <span className="font-semibold">Avis vérifiés</span>
          </div>
        </motion.div>
      </motion.div>
      
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[1, 2, 3].map((item) => (
            <motion.div 
              key={item} 
              className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: item * 0.1 }}
            >
              <div className="animate-pulse space-y-4">
                <div className="flex items-center mb-4 h-5 bg-gray-200 dark:bg-gray-700 rounded"></div>
                <div className="h-20 bg-gray-200 dark:bg-gray-700 rounded"></div>
                <div className="flex items-center">
                  <div className="mr-4">
                    <div className="w-12 h-12 bg-gray-300 dark:bg-gray-600 rounded-full"></div>
                  </div>
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-2/3"></div>
                    <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/3"></div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      ) : testimonials.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((review, index) => (
            <motion.div 
              key={review.id} 
              className="group relative bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg hover:shadow-2xl border border-gray-100 dark:border-gray-700 transition-all duration-300"
              initial={{ opacity: 0, y: 30, scale: 0.9 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ y: -8, scale: 1.02 }}
            >
              {/* Quote décorative */}
              <div className="absolute top-4 right-4 opacity-10 group-hover:opacity-20 transition-opacity">
                <Quote className="h-12 w-12 text-red-500" />
              </div>
              
              {/* Badge de vérification */}
              <div className="absolute top-4 left-4">
                <div className="bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 px-2 py-1 rounded-full text-xs font-medium flex items-center space-x-1">
                  <CheckCircle className="h-3 w-3" />
                  <span>Vérifié</span>
                </div>
              </div>
              
              <div className="mt-8">
                <motion.div 
                  className="flex items-center text-yellow-400 mb-4"
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  transition={{ delay: index * 0.1 + 0.2 }}
                >
                  <StarRating rating={getAverageRating(review)} readOnly size={20} />
                  <span className="ml-2 text-sm text-gray-600 dark:text-gray-400 font-medium">
                    {getAverageRating(review)}/5
                  </span>
                </motion.div>
                
                <motion.div
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  transition={{ delay: index * 0.1 + 0.3 }}
                  className="relative"
                >
                  <Quote className="h-4 w-4 text-red-500 mb-2" />
                  <p className="text-gray-700 dark:text-gray-300 mb-6 line-clamp-4 min-h-[80px] italic leading-relaxed">
                    {review.comment}
                  </p>
                </motion.div>
                
                <motion.div 
                  className="flex items-center"
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 + 0.4 }}
                >
                  <div className="mr-4">
                    {review.photos && review.photos[0] ? (
                      <motion.div
                        whileHover={{ scale: 1.1 }}
                        className="relative"
                      >
                        <Avatar className="ring-2 ring-red-100 dark:ring-red-900/50">
                          <img 
                            src={`${AUTH_BASE_URL}${review.photos[0]}`}
                            alt={review.userName}
                            className="w-12 h-12 object-cover rounded-full"
                          />
                        </Avatar>
                        <div className="absolute -bottom-1 -right-1 bg-green-500 w-4 h-4 rounded-full border-2 border-white dark:border-gray-800"></div>
                      </motion.div>
                    ) : (
                      <motion.div whileHover={{ scale: 1.1 }}>
                        <Avatar className="bg-gradient-to-r from-red-500 to-orange-500 text-white ring-2 ring-red-100 dark:ring-red-900/50">
                          <span className="font-bold">{getInitials(review.userName)}</span>
                        </Avatar>
                      </motion.div>
                    )}
                  </div>
                  <div>
                    <p className="font-bold text-gray-800 dark:text-white">{review.userName}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Client{review.userName.endsWith('e') ? 'e' : ''} vérifié{review.userName.endsWith('e') ? 'e' : ''}
                    </p>
                    <div className="flex items-center space-x-1 mt-1">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="text-xs text-gray-400">Achat confirmé</span>
                    </div>
                  </div>
                </motion.div>
              </div>
              
              {/* Effet de hover décoratif */}
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-red-500/0 to-orange-500/0 group-hover:from-red-500/5 group-hover:to-orange-500/5 transition-all duration-300 pointer-events-none"></div>
            </motion.div>
          ))}
        </div>
      ) : (
        <motion.div 
          className="text-center py-12"
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
        >
          <div className="bg-gray-50 dark:bg-gray-800 rounded-2xl p-8 max-w-md mx-auto">
            <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500 dark:text-gray-400">
              Aucun témoignage disponible pour le moment.
            </p>
            <p className="text-sm text-gray-400 dark:text-gray-500 mt-2">
              Soyez le premier à partager votre expérience !
            </p>
          </div>
        </motion.div>
      )}
    </section>
  );
};

export default TestimonialSection;
