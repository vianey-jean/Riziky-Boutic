
import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Facebook, Twitter, Instagram, MapPin, Mail, Phone, Clock, Heart } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  };

  const linkVariants = {
    hover: {
      x: 5,
      transition: { duration: 0.2 }
    }
  };

  const socialVariants = {
    hover: {
      scale: 1.2,
      rotate: 5,
      transition: { duration: 0.3 }
    }
  };
  
  return (
    <footer className="bg-gradient-to-br from-gray-900 via-slate-900 to-neutral-900 text-white pt-20 pb-8 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-gradient-to-r from-red-900/10 via-transparent to-pink-900/10"></div>
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-red-500 via-pink-500 to-purple-500"></div>
      
      <div className="container mx-auto px-4 relative">
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12"
        >

          {/* À Propos */}
          <motion.div variants={itemVariants} className="space-y-6">
            <div className="relative">
              <h3 className="text-2xl font-bold mb-6 text-white relative inline-block">
                Riziky Boutique
                <motion.div
                  initial={{ width: 0 }}
                  whileInView={{ width: "3rem" }}
                  transition={{ delay: 0.5, duration: 0.8 }}
                  className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-red-600 to-pink-600 rounded-full"
                ></motion.div>
              </h3>
            </div>
            <p className="text-gray-300 leading-relaxed">
              Découvrez notre collection exclusive de produits capillaires premium pour sublimer votre beauté naturelle.
            </p>
            <div className="flex space-x-4 mt-8">
              {[
                { icon: Facebook, href: "#", color: "hover:text-blue-400" },
                { icon: Twitter, href: "#", color: "hover:text-sky-400" },
                { icon: Instagram, href: "#", color: "hover:text-pink-400" }
              ].map((social, index) => (
                <motion.a
                  key={index}
                  href={social.href}
                  variants={socialVariants}
                  whileHover="hover"
                  className={`text-white ${social.color} transition-colors duration-300 p-3 bg-white/10 rounded-full backdrop-blur-sm border border-white/20 hover:bg-white/20`}
                  aria-label={`Suivez-nous sur ${social.icon.name}`}
                >
                  <social.icon size={20} />
                </motion.a>
              ))}
            </div>
          </motion.div>

          {/* Liens Utiles */}
          <motion.div variants={itemVariants} className="space-y-6">
            <div className="relative">
              <h3 className="text-2xl font-bold mb-6 text-white relative inline-block">
                Liens Utiles
                <motion.div
                  initial={{ width: 0 }}
                  whileInView={{ width: "3rem" }}
                  transition={{ delay: 0.6, duration: 0.8 }}
                  className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-red-600 to-pink-600 rounded-full"
                ></motion.div>
              </h3>
            </div>
            <ul className="space-y-4">
              {[
                { to: "/notre-histoire", text: "Notre Histoire" },
                { to: "/faq", text: "FAQ" },
                { to: "/livraison", text: "Livraison" },
                { to: "/retours", text: "Retours" },
                { to: "/contact", text: "Contact" }
              ].map((link, index) => (
                <motion.li key={index} variants={linkVariants} whileHover="hover">
                  <Link 
                    to={link.to} 
                    className="text-gray-300 hover:text-red-400 transition-colors duration-300 flex items-center group py-1"
                  >
                    <motion.span 
                      className="mr-3 text-red-500 group-hover:text-red-400"
                      whileHover={{ x: 3 }}
                    >
                      ›
                    </motion.span> 
                    <span className="relative">
                      {link.text}
                      <motion.div
                        className="absolute bottom-0 left-0 h-0.5 bg-red-400 origin-left"
                        initial={{ scaleX: 0 }}
                        whileHover={{ scaleX: 1 }}
                        transition={{ duration: 0.3 }}
                      ></motion.div>
                    </span>
                  </Link>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          {/* Légal */}
          <motion.div variants={itemVariants} className="space-y-6">
            <div className="relative">
              <h3 className="text-2xl font-bold mb-6 text-white relative inline-block">
                Informations
                <motion.div
                  initial={{ width: 0 }}
                  whileInView={{ width: "3rem" }}
                  transition={{ delay: 0.7, duration: 0.8 }}
                  className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-red-600 to-pink-600 rounded-full"
                ></motion.div>
              </h3>
            </div>
            <ul className="space-y-4">
              {[
                { to: "/conditions-utilisation", text: "Conditions d'utilisation" },
                { to: "/politique-confidentialite", text: "Politique de confidentialité" },
                { to: "/politique-cookies", text: "Politique des cookies" },
                { to: "/service-client", text: "Service Client" },
                { to: "/carrieres", text: "Carrières" }
              ].map((link, index) => (
                <motion.li key={index} variants={linkVariants} whileHover="hover">
                  <Link 
                    to={link.to} 
                    className="text-gray-300 hover:text-red-400 transition-colors duration-300 flex items-center group py-1"
                  >
                    <motion.span 
                      className="mr-3 text-red-500 group-hover:text-red-400"
                      whileHover={{ x: 3 }}
                    >
                      ›
                    </motion.span> 
                    <span className="relative">
                      {link.text}
                      <motion.div
                        className="absolute bottom-0 left-0 h-0.5 bg-red-400 origin-left"
                        initial={{ scaleX: 0 }}
                        whileHover={{ scaleX: 1 }}
                        transition={{ duration: 0.3 }}
                      ></motion.div>
                    </span>
                  </Link>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          {/* Contact */}
          <motion.div variants={itemVariants} className="space-y-6">
            <div className="relative">
              <h3 className="text-2xl font-bold mb-6 text-white relative inline-block">
                Contact
                <motion.div
                  initial={{ width: 0 }}
                  whileInView={{ width: "3rem" }}
                  transition={{ delay: 0.8, duration: 0.8 }}
                  className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-red-600 to-pink-600 rounded-full"
                ></motion.div>
              </h3>
            </div>
            <ul className="space-y-6">
              {[
                {
                  icon: MapPin,
                  text: "123 Avenue de la Beauté, 97400 Saint-Denis, La Réunion",
                  color: "text-red-400"
                },
                {
                  icon: Phone,
                  text: "+262 123 456 789",
                  color: "text-green-400"
                },
                {
                  icon: Mail,
                  text: "contact@riziky-boutique.com",
                  color: "text-blue-400"
                },
                {
                  icon: Clock,
                  text: "Lun-Sam: 9h00-19h00",
                  color: "text-yellow-400"
                }
              ].map((contact, index) => (
                <motion.li 
                  key={index} 
                  className="flex items-start group"
                  whileHover={{ x: 5 }}
                  transition={{ duration: 0.2 }}
                >
                  <motion.div
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    className={`${contact.color} mr-4 mt-1 flex-shrink-0 p-2 bg-white/10 rounded-lg backdrop-blur-sm border border-white/20`}
                  >
                    <contact.icon size={18} />
                  </motion.div>
                  <span className="text-gray-300 group-hover:text-white transition-colors duration-300 leading-relaxed">
                    {contact.text}
                  </span>
                </motion.li>
              ))}
            </ul>
          </motion.div>

        </motion.div>

        {/* Pied de page */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9, duration: 0.6 }}
          viewport={{ once: true }}
          className="border-t border-gray-800/50 mt-16 pt-8"
        >
          <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
            <motion.p 
              className="text-gray-400 text-center md:text-left"
              whileHover={{ color: "#ffffff" }}
              transition={{ duration: 0.3 }}
            >
              © {currentYear} Riziky Boutique. Tous droits réservés.
            </motion.p>
            <motion.div 
              className="flex items-center space-x-2 text-gray-400"
              whileHover={{ color: "#ffffff" }}
              transition={{ duration: 0.3 }}
            >
              <span>Fait avec</span>
              <motion.div
                animate={{ 
                  scale: [1, 1.2, 1],
                  color: ["#ef4444", "#ec4899", "#ef4444"]
                }}
                transition={{ 
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                <Heart size={16} fill="currentColor" />
              </motion.div>
              <span>à La Réunion</span>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </footer>
  );
};

export default Footer;
