
import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="py-10 mt-10" style={{ backgroundColor: '#ff007882' }}>
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-lg font-semibold mb-4">À Propos</h3>
            <ul className="space-y-2">
              <li><Link to="/a-propos" className="text-gray-600 hover:text-brand-blue">Notre Histoire</Link></li>
              <li><Link to="/contact" className="text-gray-600 hover:text-brand-blue">Contact</Link></li>
              <li><Link to="/blog" className="text-gray-600 hover:text-brand-blue">Blog</Link></li>
              <li><Link to="/carrieres" className="text-gray-600 hover:text-brand-blue">Carrières</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Aide & Support</h3>
            <ul className="space-y-2">
              <li><Link to="/faq" className="text-gray-600 hover:text-brand-blue">FAQ</Link></li>
              <li><Link to="/livraison" className="text-gray-600 hover:text-brand-blue">Livraison</Link></li>
              <li><Link to="/retours" className="text-gray-600 hover:text-brand-blue">Retours</Link></li>
              <li><Link to="/support" className="text-gray-600 hover:text-brand-blue">Service Client</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Légal</h3>
            <ul className="space-y-2">
              <li><Link to="/conditions" className="text-gray-600 hover:text-brand-blue">Conditions d'utilisation</Link></li>
              <li><Link to="/confidentialite" className="text-gray-600 hover:text-brand-blue">Politique de confidentialité</Link></li>
              <li><Link to="/cookies" className="text-gray-600 hover:text-brand-blue">Politique des cookies</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Nous Suivre</h3>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-600 hover:text-brand-blue">Facebook</a>
              <a href="#" className="text-gray-600 hover:text-brand-blue">Twitter</a>
              <a href="#" className="text-gray-600 hover:text-brand-blue">Instagram</a>
            </div>
            {/* <div className="mt-4">
              <h4 className="text-sm font-medium mb-2">Newsletter</h4>
              <form className="flex">
                <input
                  type="email"
                  placeholder="Votre email"
                  className="px-2 py-2 border rounded-l-md focus:outline-none  focus:ring-brand-blue"
                />
                <button
                  type="submit"
                  className="bg-brand-blue text-white px-4 py-2 rounded-r-md hover:bg-brand-light-blue transition"
                >
                  S'inscrire
                </button>
              </form>
            </div> */}
          </div>
        </div>
        
        <div className="border-t border-gray-200 mt-8 pt-8 text-center">
          <p className="text-gray-600">© 2025 Riziky Boutique. Tous droits réservés.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
