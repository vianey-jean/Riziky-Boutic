
import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Twitter, Instagram, MapPin, Mail, Phone, Clock, Heart, Shield, Truck, CreditCard } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  const socialLinks = [
    { icon: Facebook, href: "#", label: "Facebook", color: "hover:text-blue-500" },
    { icon: Twitter, href: "#", label: "Twitter", color: "hover:text-sky-400" },
    { icon: Instagram, href: "#", label: "Instagram", color: "hover:text-pink-500" }
  ];

  const benefits = [
    { icon: Shield, text: "Paiement sécurisé", color: "text-green-400" },
    { icon: Truck, text: "Livraison gratuite", color: "text-blue-400" },
    { icon: Heart, text: "Service client", color: "text-red-400" },
    { icon: CreditCard, text: "Garantie qualité", color: "text-purple-400" }
  ];
  
  return (
    <footer className="bg-gradient-to-br from-gray-900 via-slate-900 to-black text-white relative overflow-hidden">
      {/* Éléments décoratifs simplifiés */}
      <div className="absolute top-0 left-0 w-40 h-40 bg-gradient-to-br from-red-500/10 to-pink-500/10 rounded-full -translate-x-20 -translate-y-20"></div>
      <div className="absolute bottom-0 right-0 w-60 h-60 bg-gradient-to-tl from-blue-500/10 to-purple-500/10 rounded-full translate-x-30 translate-y-30"></div>
      
      {/* Barre de bénéfices compacte */}
      <div className="border-b border-gray-800 bg-gradient-to-r from-gray-800/50 to-gray-700/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-3">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            {benefits.map((benefit, index) => (
              <div key={index} className="flex items-center justify-center space-x-2 group">
                <div className={`w-8 h-8 ${benefit.color} bg-white/10 rounded-full flex items-center justify-center transition-all duration-300 group-hover:scale-105 group-hover:bg-white/20`}>
                  <benefit.icon className="h-4 w-4" />
                </div>
                <span className="text-xs font-medium text-gray-300 group-hover:text-white transition-colors">
                  {benefit.text}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="relative py-8">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">

            {/* À Propos */}
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-bold mb-3 text-white relative inline-block">
                  <span className="bg-gradient-to-r from-red-400 to-pink-400 bg-clip-text text-transparent">
                    Riziky Boutique
                  </span>
                  <div className="absolute -bottom-1 left-0 w-12 h-0.5 bg-gradient-to-r from-red-500 to-pink-500 rounded-full"></div>
                </h3>
              </div>
              <p className="text-gray-300 leading-relaxed text-sm">
                Découvrez notre collection exclusive de produits capillaires premium pour sublimer votre beauté naturelle.
              </p>
              <div className="flex space-x-3">
                {socialLinks.map((social, index) => (
                  <a 
                    key={index}
                    href={social.href} 
                    className={`group relative w-10 h-10 bg-gradient-to-r from-gray-700 to-gray-600 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 hover:shadow-lg ${social.color}`}
                    aria-label={social.label}
                  >
                    <social.icon className="h-4 w-4 transition-transform group-hover:scale-110" />
                    <div className="absolute inset-0 bg-gradient-to-r from-white/0 to-white/10 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  </a>
                ))}
              </div>
            </div>

            {/* Liens Utiles */}
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-bold mb-3 text-white relative inline-block">
                  Liens Utiles
                  <div className="absolute -bottom-1 left-0 w-10 h-0.5 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full"></div>
                </h3>
              </div>
              <ul className="space-y-2">
                {[
                  { to: "/notre-histoire", text: "Notre Histoire" },
                  { to: "/faq", text: "FAQ" },
                  { to: "/livraison", text: "Livraison" },
                  { to: "/retours", text: "Retours" },
                  { to: "/contact", text: "Contact" }
                ].map((link, index) => (
                  <li key={index}>
                    <Link 
                      to={link.to} 
                      className="group flex items-center text-gray-300 hover:text-white transition-all duration-300 text-sm"
                    >
                      <div className="w-1.5 h-1.5 bg-gradient-to-r from-blue-400 to-cyan-400 rounded-full mr-2 transition-all duration-300 group-hover:scale-125"></div>
                      <span className="relative">
                        {link.text}
                        <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-400 to-cyan-400 transition-all duration-300 group-hover:w-full"></div>
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Légal */}
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-bold mb-3 text-white relative inline-block">
                  Informations
                  <div className="absolute -bottom-1 left-0 w-10 h-0.5 bg-gradient-to-r from-purple-500 to-violet-500 rounded-full"></div>
                </h3>
              </div>
              <ul className="space-y-2">
                {[
                  { to: "/conditions-utilisation", text: "Conditions d'utilisation" },
                  { to: "/politique-confidentialite", text: "Politique de confidentialité" },
                  { to: "/politique-cookies", text: "Politique des cookies" },
                  { to: "/service-client", text: "Service Client" },
                  { to: "/carrieres", text: "Carrières" }
                ].map((link, index) => (
                  <li key={index}>
                    <Link 
                      to={link.to} 
                      className="group flex items-center text-gray-300 hover:text-white transition-all duration-300 text-sm"
                    >
                      <div className="w-1.5 h-1.5 bg-gradient-to-r from-purple-400 to-violet-400 rounded-full mr-2 transition-all duration-300 group-hover:scale-125"></div>
                      <span className="relative">
                        {link.text}
                        <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-purple-400 to-violet-400 transition-all duration-300 group-hover:w-full"></div>
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact */}
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-bold mb-3 text-white relative inline-block">
                  Contact
                  <div className="absolute -bottom-1 left-0 w-10 h-0.5 bg-gradient-to-r from-red-500 to-orange-500 rounded-full"></div>
                </h3>
              </div>
              <ul className="space-y-3">
                <li className="group flex items-start">
                  <div className="w-8 h-8 bg-gradient-to-r from-red-500 to-orange-500 rounded-lg flex items-center justify-center mr-3 flex-shrink-0 transition-all duration-300 group-hover:scale-105">
                    <MapPin className="h-4 w-4 text-white" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 mb-1">Adresse</p>
                    <span className="text-gray-300 leading-relaxed text-sm">123 Avenue de la Beauté, 97400 Saint-Denis</span>
                  </div>
                </li>
                <li className="group flex items-center">
                  <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg flex items-center justify-center mr-3 flex-shrink-0 transition-all duration-300 group-hover:scale-105">
                    <Phone className="h-4 w-4 text-white" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 mb-1">Téléphone</p>
                    <span className="text-gray-300 text-sm">+262 123 456 789</span>
                  </div>
                </li>
                <li className="group flex items-center">
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center mr-3 flex-shrink-0 transition-all duration-300 group-hover:scale-105">
                    <Mail className="h-4 w-4 text-white" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 mb-1">Email</p>
                    <span className="text-gray-300 text-sm">contact@riziky-boutique.com</span>
                  </div>
                </li>
                <li className="group flex items-center">
                  <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-violet-500 rounded-lg flex items-center justify-center mr-3 flex-shrink-0 transition-all duration-300 group-hover:scale-105">
                    <Clock className="h-4 w-4 text-white" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 mb-1">Horaires</p>
                    <span className="text-gray-300 text-sm">Lun-Sam: 9h00-19h00</span>
                  </div>
                </li>
              </ul>
            </div>

          </div>

          {/* Pied de page */}
          <div className="border-t border-gray-800 mt-8 pt-6">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <p className="text-gray-400 text-center md:text-left mb-3 md:mb-0 text-sm">
                © {currentYear} <span className="bg-gradient-to-r from-red-400 to-pink-400 bg-clip-text text-transparent font-semibold">Riziky Boutique</span>. 
                Tous droits réservés.
              </p>
              <div className="flex items-center space-x-2 text-gray-400 text-sm">
                <span>Fait avec</span>
                <Heart className="h-3 w-3 text-red-400 animate-pulse" />
                <span>à La Réunion</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
