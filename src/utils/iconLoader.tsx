
import React from 'react';
import * as LucideIcons from 'lucide-react';

// Liste des icônes disponibles pour les publicités
export const availableIcons = [
  'ThumbsUp', 'Gift', 'Clock', 'Package', 'Truck', 
  'ShoppingBag', 'ShoppingCart', 'CreditCard', 'Percent', 'Tag', 
  'Star', 'Award', 'Heart', 'Mail', 'Phone', 'User'
];

// Fonction pour obtenir une icône Lucide par son nom
export const getIconByName = (iconName: string) => {
  const Icon = (LucideIcons as any)[iconName];
  if (Icon) {
    return Icon;
  }
  // Icône par défaut si le nom d'icône n'existe pas
  return LucideIcons.Info;
};

// Composant pour afficher une icône dynamiquement
interface DynamicIconProps {
  name: string;
  className?: string;
  size?: number;
}

export const DynamicIcon: React.FC<DynamicIconProps> = ({ name, className, size = 16 }) => {
  const IconComponent = getIconByName(name);
  return <IconComponent className={className} size={size} />;
};

export default {
  getIconByName,
  DynamicIcon,
  availableIcons
};
