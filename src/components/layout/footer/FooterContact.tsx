
import React from 'react';
import { MapPin, Mail, Phone, Clock } from 'lucide-react';

const FooterContact = () => {
  const contactItems = [
    {
      icon: MapPin,
      label: "Adresse :",
      text: "10 Allée des Beryls Bleus, Bellepierre, 97400 Saint-Denis",
      color: "from-red-500 to-orange-500"
    },
    {
      icon: Phone,
      label: "Téléphone :",
      text: "+262 (0)6 92 84 23 70",
      color: "from-green-500 to-emerald-500"
    },
    {
      icon: Mail,
      label: "Email :",
      text: "contact@riziky-boutique.com",
      color: "from-blue-500 to-cyan-500"
    },
    {
      icon: Clock,
      label: "Horaires :",
      text: "Lun-Sam: 9h00-19h00",
      color: "from-purple-500 to-violet-500"
    }
  ];

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-bold mb-3 text-white relative inline-block">
          Contact :
          <div className="absolute -bottom-1 left-0 w-10 h-0.5 bg-gradient-to-r from-red-500 to-orange-500 rounded-full"></div>
        </h3>
      </div>
      <ul className="space-y-3">
        {contactItems.map((item, index) => (
          <li key={index} className="group flex items-start items-center">
            <div className={`w-8 h-8 bg-gradient-to-r ${item.color} rounded-lg flex items-center justify-center mr-3 flex-shrink-0 transition-all duration-300 group-hover:scale-105`}>
              <item.icon className="h-4 w-4 text-white" />
            </div>
            <div>
              <p className="text-xs text-gray-400 mb-1">{item.label}</p>
              <span className="text-gray-300 leading-relaxed text-sm">{item.text}</span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default FooterContact;
