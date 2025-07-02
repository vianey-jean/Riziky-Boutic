import React from 'react';
import { motion } from 'framer-motion';

interface CheckoutHeaderProps {
  title: string;
  subtitle: string;
}

const CheckoutHeader: React.FC<CheckoutHeaderProps> = ({ title, subtitle }) => {
  return (
    <motion.div 
      className="text-center mb-12"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-red-500 to-pink-500 rounded-full blur-3xl opacity-10 scale-150"></div>
        <h1 className="relative text-4xl md:text-5xl font-bold bg-gradient-to-r from-red-600 to-pink-600 bg-clip-text text-transparent mb-4">
          {title}
        </h1>
      </div>
      <p className="text-lg text-gray-600 max-w-2xl mx-auto">
        {subtitle}
      </p>
    </motion.div>
  );
};

export default CheckoutHeader;