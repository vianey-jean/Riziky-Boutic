
import React from 'react';
import { Carousel, CarouselContent, CarouselItem } from '@/components/ui/carousel';
import { Skeleton } from "@/components/ui/skeleton";
import { DynamicIcon } from '@/utils/iconLoader';
import { PubLayout } from '@/services/pubLayoutAPI';
import { motion } from 'framer-motion';
import { Zap } from 'lucide-react';

interface PromoBannerProps {
  pubLayoutItems: PubLayout[];
  isLoading: boolean;
}

const PromoBanner: React.FC<PromoBannerProps> = ({ pubLayoutItems, isLoading }) => {
  return (
    <motion.div 
      className="bg-gradient-to-r from-red-600 via-red-500 to-pink-600 text-white py-2 overflow-hidden relative"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      {/* Background animation */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-pulse"></div>
      
      {/* Floating elements */}
      <div className="absolute left-10 top-0 bottom-0 flex items-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
        >
          <Zap className="h-4 w-4 text-yellow-300" />
        </motion.div>
      </div>
      
      <div className="absolute right-10 top-0 bottom-0 flex items-center">
        <motion.div
          animate={{ rotate: -360 }}
          transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
        >
          <Zap className="h-4 w-4 text-yellow-300" />
        </motion.div>
      </div>

      <Carousel
        opts={{
          align: "center",
          loop: true,
        }}
        autoPlay={true}
        interval={4000}
        className="w-full relative z-10"
      >
        <CarouselContent className="mx-auto">
          {isLoading ? (
            <CarouselItem className="basis-full flex justify-center items-center">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                <Skeleton className="h-5 w-80 bg-white/20" />
              </motion.div>
            </CarouselItem>
          ) : (
            pubLayoutItems.map((pub, index) => (
              <CarouselItem key={pub.id} className="basis-full flex justify-center items-center text-center">
                <motion.div
                  className="flex items-center gap-3 text-sm font-medium"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  whileHover={{ scale: 1.05 }}
                >
                  <motion.div
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <DynamicIcon name={pub.icon} className="h-5 w-5 text-yellow-300" />
                  </motion.div>
                  
                  <span className="bg-gradient-to-r from-white to-yellow-100 bg-clip-text text-transparent font-semibold">
                    {pub.text}
                  </span>
                  
                  <motion.div
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 2, repeat: Infinity, delay: 1 }}
                  >
                    <DynamicIcon name={pub.icon} className="h-5 w-5 text-yellow-300" />
                  </motion.div>
                </motion.div>
              </CarouselItem>
            ))
          )}
        </CarouselContent>
      </Carousel>
    </motion.div>
  );
};

export default PromoBanner;
