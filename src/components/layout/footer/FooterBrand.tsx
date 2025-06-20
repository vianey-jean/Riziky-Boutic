
import React from 'react';
import { Facebook, Twitter, Instagram } from 'lucide-react';

const FooterBrand = () => {
  const socialLinks = [
    { icon: Facebook, href: "#", label: "Facebook", color: "hover:text-blue-500" },
    { icon: Twitter, href: "#", label: "Twitter", color: "hover:text-sky-400" },
    { icon: Instagram, href: "#", label: "Instagram", color: "hover:text-pink-500" }
  ];

  return (
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
  );
};

export default FooterBrand;
