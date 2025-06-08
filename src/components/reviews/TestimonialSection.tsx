import React, { useEffect, useState } from 'react';
import StarRating from './StarRating';
import axios from 'axios';
import { Avatar } from '@/components/ui/avatar';
import { motion } from 'framer-motion';
import { Quote, Users, Star, Heart, MessageCircle } from 'lucide-react';

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
        
        if (!response.data || !Array.isArray(response.data) || response.data.length === 0) {
          const allReviewsResponse = await axios.get(`${AUTH_BASE_URL}/api/reviews`);
          
          if (allReviewsResponse.data && Array.isArray(allReviewsResponse.data)) {
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
        } else {
          setTestimonials(response.data.slice(0, 3));
        }
        
      } catch (error) {
        console.error("Erreur lors de la récupération des témoignages:", error);
        
        try {
          const allReviewsResponse = await axios.get(`${AUTH_BASE_URL}/api/reviews`);
          if (allReviewsResponse.data && Array.isArray(allReviewsResponse.data)) {
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

  const getAverageRating = (review: ReviewData) => {
    return Math.round((review.productRating + review.deliveryRating) / 2);
  };
  
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  return (
    <section className="mb-8 relative">
      {/* Éléments décoratifs réduits */}
      <div className="absolute top-0 left-0 w-24 h-24 bg-gradient-to-br from-red-500/5 to-pink-500/5 rounded-full -translate-x-12 -translate-y-12"></div>
      <div className="absolute bottom-0 right-0 w-32 h-32 bg-gradient-to-tl from-blue-500/5 to-purple-500/5 rounded-full translate-x-16 translate-y-16"></div>
      
      <div className="text-center mb-6 relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-r from-red-500 to-pink-500 rounded-2xl mb-3 shadow-lg">
            <MessageCircle className="h-6 w-6 text-white" />
          </div>
          <h2 className="text-2xl md:text-3xl font-bold mb-2 bg-gradient-to-r from-red-600 via-pink-600 to-purple-600 bg-clip-text text-transparent">
            Ce Que Nos Clients Disent
          </h2>
          <p className="text-base text-gray-600 dark:text-gray-300 max-w-2xl mx-auto leading-relaxed">
            Découvrez les expériences authentiques de notre communauté
          </p>
          <div className="mt-3 flex items-center justify-center space-x-2">
            <div className="flex -space-x-1">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="h-4 w-4 text-yellow-400 fill-current" />
              ))}
            </div>
            <span className="text-xs font-medium text-gray-600 dark:text-gray-400 ml-2">
              4.9/5 basé sur 2,400+ avis
            </span>
          </div>
        </motion.div>
      </div>
      
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map((item) => (
            <div key={item} className="bg-white dark:bg-gray-800 p-4 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 animate-pulse">
              <div className="flex items-center mb-3 h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
              <div className="h-16 bg-gray-200 dark:bg-gray-700 rounded mb-3"></div>
              <div className="flex items-center">
                <div className="mr-3">
                  <div className="w-10 h-10 bg-gray-300 dark:bg-gray-600 rounded-full"></div>
                </div>
                <div className="w-full">
                  <div className="h-3 bg-gray-300 dark:bg-gray-600 rounded w-2/3 mb-1"></div>
                  <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded w-1/3"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : testimonials.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {testimonials.map((review, index) => (
            <motion.div 
              key={review.id} 
              className="group bg-white dark:bg-gray-800 p-4 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 transition-all duration-500 hover:shadow-2xl hover:scale-105 relative overflow-hidden"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-red-500/5 to-pink-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              
              <div className="absolute top-3 right-3 w-8 h-8 bg-gradient-to-r from-red-500/10 to-pink-500/10 rounded-full flex items-center justify-center">
                <Quote className="h-4 w-4 text-red-500/50" />
              </div>
              
              <div className="relative z-10">
                <motion.div 
                  className="flex items-center text-yellow-400 mb-3"
                  whileHover={{ scale: 1.05 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <StarRating rating={getAverageRating(review)} readOnly size={16} />
                  <span className="ml-2 text-xs font-medium text-gray-600 dark:text-gray-400">
                    {getAverageRating(review)}/5
                  </span>
                </motion.div>
                
                <p className="text-gray-700 dark:text-gray-300 mb-3 line-clamp-3 min-h-[60px] text-sm leading-relaxed relative">
                  <span className="text-red-500 text-lg font-serif absolute -top-1 -left-1">«</span>
                  <span className="ml-3">{review.comment}</span>
                  <span className="text-red-500 text-lg font-serif">»</span>
                </p>
                
                <div className="flex items-center">
                  <div className="mr-3 relative">
                    {review.photos && review.photos[0] ? (
                      <Avatar className="ring-2 ring-red-500/20 group-hover:ring-red-500/40 transition-all duration-300">
                        <img 
                          src={`${AUTH_BASE_URL}${review.photos[0]}`}
                          alt={review.userName}
                          className="w-10 h-10 object-cover rounded-full"
                        />
                      </Avatar>
                    ) : (
                      <Avatar className="bg-gradient-to-r from-red-500 to-pink-500 text-white w-10 h-10 ring-2 ring-red-500/20 group-hover:ring-red-500/40 transition-all duration-300">
                        <span className="text-sm font-bold">{getInitials(review.userName)}</span>
                      </Avatar>
                    )}
                    <div className="absolute -bottom-0.5 -right-0.5 w-5 h-5 bg-green-500 rounded-full flex items-center justify-center border-2 border-white dark:border-gray-800">
                      <Users className="h-2 w-2 text-white" />
                    </div>
                  </div>
                  <div>
                    <p className="font-bold text-sm text-gray-900 dark:text-white">{review.userName}</p>
                    <div className="flex items-center space-x-1">
                      <p className="text-xs text-gray-500 dark:text-gray-400">Client{review.userName.endsWith('e') ? 'e' : ''} vérifié{review.userName.endsWith('e') ? 'e' : ''}</p>
                      <Heart className="h-2 w-2 text-red-500 fill-current" />
                    </div>
                    <p className="text-xs text-gray-400 dark:text-gray-500">
                      {new Date(review.createdAt).toLocaleDateString('fr-FR', { 
                        day: 'numeric', 
                        month: 'short', 
                        year: 'numeric' 
                      })}
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        <motion.div 
          className="text-center py-8 bg-gradient-to-r from-gray-50 to-white dark:from-gray-800 dark:to-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          <div className="w-12 h-12 bg-gradient-to-r from-gray-300 to-gray-400 rounded-full flex items-center justify-center mx-auto mb-3">
            <MessageCircle className="h-6 w-6 text-white" />
          </div>
          <p className="text-gray-500 dark:text-gray-400 text-base">Aucun témoignage disponible pour le moment.</p>
          <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">Soyez le premier à partager votre expérience !</p>
        </motion.div>
      )}
    </section>
  );
};

export default TestimonialSection;
