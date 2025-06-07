
import React, { useEffect, useState } from 'react';
import StarRating from './StarRating';
import axios from 'axios';
import { Avatar } from '@/components/ui/avatar';

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
    <section className="mb-16">
      <div className="text-center mb-10">
        <h2 className="font-cormorant text-3xl md:text-4xl font-bold mb-2 text-brand-charcoal text-red-800">
          Ce Que Nos Clients Disent
        </h2>
        <p className="text-gray-500 text-red-800">Découvrez les expériences de notre communauté</p>
        <div className="h-px w-24 bg-brand-gold mx-auto mt-4"></div>
      </div>
      
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[1, 2, 3].map((item) => (
            <div key={item} className="bg-white p-8 rounded-lg shadow-sm border border-gray-100 animate-pulse">
              <div className="flex items-center mb-4 h-5 bg-gray-200 rounded"></div>
              <div className="h-20 bg-gray-200 rounded mb-4"></div>
              <div className="flex items-center">
                <div className="mr-4">
                  <div className="w-12 h-12 bg-gray-300 rounded-full"></div>
                </div>
                <div className="w-full">
                  <div className="h-4 bg-gray-300 rounded w-2/3 mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/3"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : testimonials.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((review) => (
            <div key={review.id} className="bg-white p-8 rounded-lg shadow-sm border border-gray-100 transition-all duration-300 hover:shadow-md">
              <div className="flex items-center text-yellow-400 mb-4">
                <StarRating rating={getAverageRating(review)} readOnly size={18} />
              </div>
              <p className="text-gray-600 mb-4 line-clamp-4 min-h-[80px]">« {review.comment} »</p>
              <div className="flex items-center">
                <div className="mr-4">
                  {review.photos && review.photos[0] ? (
                    <Avatar>
                      <img 
                        src={`${AUTH_BASE_URL}${review.photos[0]}`}
                        alt={review.userName}
                        className="w-12 h-12 object-cover rounded-full"
                      />
                    </Avatar>
                  ) : (
                    <Avatar className="bg-brand-gold text-white">
                      <span>{getInitials(review.userName)}</span>
                    </Avatar>
                  )}
                </div>
                <div>
                  <p className="font-semibold">{review.userName}</p>
                  <p className="text-sm text-gray-500">Client{review.userName.endsWith('e') ? 'e' : ''}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-10">
          <p className="text-gray-500">Aucun témoignage disponible pour le moment.</p>
        </div>
      )}
    </section>
  );
};

export default TestimonialSection;
