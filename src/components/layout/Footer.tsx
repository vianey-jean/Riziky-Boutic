
import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="py-10 mt-10 bg-gradient-to-r from-pink-500/50 to-purple-500/50">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">

          {/* À Propos */}
          <div className="transform transition-all duration-300 hover:translate-y-[-5px]">
            <h3 className="text-lg font-semibold mb-4 text-gray-800">À Propos</h3>
            <ul className="space-y-2">
              <li><Link to="/notre-histoire" className="text-gray-700 hover:text-gray-900 transition-colors duration-200">Notre Histoire</Link></li>
              <li><Link to="/contact" className="text-gray-700 hover:text-gray-900 transition-colors duration-200">Contact</Link></li>
              <li><Link to="/blog" className="text-gray-700 hover:text-gray-900 transition-colors duration-200">Blog</Link></li>
              <li><Link to="/carrieres" className="text-gray-700 hover:text-gray-900 transition-colors duration-200">Carrières</Link></li>
            </ul>
          </div>

          {/* Aide & Support */}
          <div className="transform transition-all duration-300 hover:translate-y-[-5px]">
            <h3 className="text-lg font-semibold mb-4 text-gray-800">Aide & Support</h3>
            <ul className="space-y-2">
              <li><Link to="/faq" className="text-gray-700 hover:text-gray-900 transition-colors duration-200">FAQ</Link></li>
              <li><Link to="/livraison" className="text-gray-700 hover:text-gray-900 transition-colors duration-200">Livraison</Link></li>
              <li><Link to="/retours" className="text-gray-700 hover:text-gray-900 transition-colors duration-200">Retours</Link></li>
              <li><Link to="/service-client" className="text-gray-700 hover:text-gray-900 transition-colors duration-200">Service Client</Link></li>
            </ul>
          </div>

          {/* Légal */}
          <div className="transform transition-all duration-300 hover:translate-y-[-5px]">
            <h3 className="text-lg font-semibold mb-4 text-gray-800">Légal</h3>
            <ul className="space-y-2">
              <li><Link to="/conditions-utilisation" className="text-gray-700 hover:text-gray-900 transition-colors duration-200">Conditions d'utilisation</Link></li>
              <li><Link to="/politique-confidentialite" className="text-gray-700 hover:text-gray-900 transition-colors duration-200">Politique de confidentialité</Link></li>
              <li><Link to="/politique-cookies" className="text-gray-700 hover:text-gray-900 transition-colors duration-200">Politique des cookies</Link></li>
            </ul>
          </div>

          {/* Réseaux Sociaux */}
          <div className="transform transition-all duration-300 hover:translate-y-[-5px]">
            <h3 className="text-lg font-semibold mb-4 text-gray-800">Nous Suivre</h3>
            <div className="flex flex-col space-y-2">
              <a href="#" className="text-gray-600 hover:text-blue-600">Facebook</a>
              <a href="#" className="text-gray-600 hover:text-blue-600">Twitter</a>
              <a href="#" className="text-gray-600 hover:text-blue-600">Instagram</a>
            </div>
          </div>

        </div>

        {/* Pied de page */}
        <div className="border-t border-gray-200 mt-8 pt-8 text-center">
          <p className="text-gray-700">© 2025 Riziky Boutique. Tous droits réservés.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
