
import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Twitter, Instagram, MapPin, Mail, Phone, Clock } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-gray-900 text-white pt-16 pb-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">

          {/* À Propos */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold mb-4 text-white relative inline-block after:content-[''] after:absolute after:w-12 after:h-1 after:bg-red-600 after:bottom-0 after:left-0 after:mt-2">Riziky Boutique</h3>
            <p className="text-gray-300 pr-8">
              Découvrez notre collection exclusive de produits capillaires premium pour sublimer votre beauté naturelle.
            </p>
            <div className="flex space-x-4 mt-6">
              <a href="#" className="text-white hover:text-red-500 transition-colors duration-300" aria-label="Facebook">
                <Facebook size={20} />
              </a>
              <a href="#" className="text-white hover:text-red-500 transition-colors duration-300" aria-label="Twitter">
                <Twitter size={20} />
              </a>
              <a href="#" className="text-white hover:text-red-500 transition-colors duration-300" aria-label="Instagram">
                <Instagram size={20} />
              </a>
            </div>
          </div>

          {/* Liens Utiles */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold mb-4 text-white relative inline-block after:content-[''] after:absolute after:w-12 after:h-1 after:bg-red-600 after:bottom-0 after:left-0 after:mt-2">Liens Utiles</h3>
            <ul className="space-y-3">
              <li><Link to="/notre-histoire" className="text-gray-300 hover:text-red-500 transition-colors duration-300 flex items-center"><span className="mr-2">›</span> Notre Histoire</Link></li>
              <li><Link to="/faq" className="text-gray-300 hover:text-red-500 transition-colors duration-300 flex items-center"><span className="mr-2">›</span> FAQ</Link></li>
              <li><Link to="/livraison" className="text-gray-300 hover:text-red-500 transition-colors duration-300 flex items-center"><span className="mr-2">›</span> Livraison</Link></li>
              <li><Link to="/retours" className="text-gray-300 hover:text-red-500 transition-colors duration-300 flex items-center"><span className="mr-2">›</span> Retours</Link></li>
              <li><Link to="/contact" className="text-gray-300 hover:text-red-500 transition-colors duration-300 flex items-center"><span className="mr-2">›</span> Contact</Link></li>
            </ul>
          </div>

          {/* Légal */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold mb-4 text-white relative inline-block after:content-[''] after:absolute after:w-12 after:h-1 after:bg-red-600 after:bottom-0 after:left-0 after:mt-2">Informations</h3>
            <ul className="space-y-3">
              <li><Link to="/conditions-utilisation" className="text-gray-300 hover:text-red-500 transition-colors duration-300 flex items-center"><span className="mr-2">›</span> Conditions d'utilisation</Link></li>
              <li><Link to="/politique-confidentialite" className="text-gray-300 hover:text-red-500 transition-colors duration-300 flex items-center"><span className="mr-2">›</span> Politique de confidentialité</Link></li>
              <li><Link to="/politique-cookies" className="text-gray-300 hover:text-red-500 transition-colors duration-300 flex items-center"><span className="mr-2">›</span> Politique des cookies</Link></li>
              <li><Link to="/service-client" className="text-gray-300 hover:text-red-500 transition-colors duration-300 flex items-center"><span className="mr-2">›</span> Service Client</Link></li>
              <li><Link to="/carrieres" className="text-gray-300 hover:text-red-500 transition-colors duration-300 flex items-center"><span className="mr-2">›</span> Carrières</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold mb-4 text-white relative inline-block after:content-[''] after:absolute after:w-12 after:h-1 after:bg-red-600 after:bottom-0 after:left-0 after:mt-2">Contact</h3>
            <ul className="space-y-4">
              <li className="flex items-start">
                <MapPin size={20} className="text-red-500 mr-3 mt-1 flex-shrink-0" />
                <span className="text-gray-300">123 Avenue de la Beauté, 97400 Saint-Denis, La Réunion</span>
              </li>
              <li className="flex items-center">
                <Phone size={20} className="text-red-500 mr-3 flex-shrink-0" />
                <span className="text-gray-300">+262 123 456 789</span>
              </li>
              <li className="flex items-center">
                <Mail size={20} className="text-red-500 mr-3 flex-shrink-0" />
                <span className="text-gray-300">contact@riziky-boutique.com</span>
              </li>
              <li className="flex items-center">
                <Clock size={20} className="text-red-500 mr-3 flex-shrink-0" />
                <span className="text-gray-300">Lun-Sam: 9h00-19h00</span>
              </li>
            </ul>
          </div>

        </div>

        {/* Pied de page */}
        <div className="border-t border-gray-800 mt-12 pt-8 text-center">
          <p className="text-gray-400">© {currentYear} Riziky Boutique. Tous droits réservés.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
