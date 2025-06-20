
import React from 'react';
import { Link } from 'react-router-dom';
import { getSecureRoute } from '@/services/secureIds';

const FooterLegal = () => {
  const legalLinks = [
    { to: "/conditions-utilisation", text: "Conditions d'utilisation" },
    { to: "/politique-confidentialite", text: "Politique de confidentialité" },
    { to: "/politique-cookies", text: "Politique des cookies" },
    { to: "/service-client", text: "Service Client" },
    { to: "/carrieres", text: "Carrières" }
  ];

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-bold mb-3 text-white relative inline-block">
          Informations :
          <div className="absolute -bottom-1 left-0 w-10 h-0.5 bg-gradient-to-r from-purple-500 to-violet-500 rounded-full"></div>
        </h3>
      </div>
      <ul className="space-y-2">
        {legalLinks.map((link, index) => (
          <li key={index}>
            <Link 
              to={getSecureRoute(link.to)} 
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
  );
};

export default FooterLegal;
