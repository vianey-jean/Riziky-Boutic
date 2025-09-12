
import React from 'react';
import { Heart } from 'lucide-react';
import FooterBenefits from './footer/FooterBenefits';
import FooterBrand from './footer/FooterBrand';
import FooterLinks from './footer/FooterLinks';
import FooterLegal from './footer/FooterLegal';
import FooterContact from './footer/FooterContact';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-gradient-to-br from-gray-900 via-slate-900 to-black text-white relative overflow-hidden">
      {/* Éléments décoratifs simplifiés */}
      <div className="absolute top-0 left-0 w-40 h-40 bg-gradient-to-br from-red-500/10 to-pink-500/10 rounded-full -translate-x-20 -translate-y-20"></div>
      <div className="absolute bottom-0 right-0 w-60 h-60 bg-gradient-to-tl from-blue-500/10 to-purple-500/10 rounded-full translate-x-30 translate-y-30"></div>
      
      {/* Barre de bénéfices */}
      <FooterBenefits />

      <div className="relative py-8">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <FooterBrand />
            <FooterLinks />
            <FooterLegal />
            <FooterContact />
          </div>

          {/* Pied de page */}
          <div className="border-t border-gray-800 mt-8 pt-6">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <p className="text-gray-400 text-center md:text-left mb-3 md:mb-0 text-sm">
                © {currentYear} <span className="bg-gradient-to-r from-red-400 to-pink-400 bg-clip-text text-transparent font-semibold">Riziky Boutique</span>. 
                Tous droits réservés.
              </p>
              <div className="flex items-center space-x-2 text-gray-400 text-sm font-bold">
                <span className= "text-red-900">V4.0 </span>
                <span>Fait avec le</span>
                <Heart className="h-3 w-3 text-red-400 animate-pulse" />
                <span>à La Réunion</span>
                <span>/ RJMV</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
