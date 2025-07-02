import React from 'react';
import { motion } from 'framer-motion';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { MapPin, Phone, ShoppingCart, CheckCircle } from 'lucide-react';
import { ShippingAddress } from '@/services/api';

interface ShippingFormProps {
  shippingData: ShippingAddress;
  deliveryCity: string;
  deliveryPrices: Record<string, number>;
  onShippingDataChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onCityChange: (city: string) => void;
  onSubmit: (e: React.SyntheticEvent<HTMLFormElement>) => void;
  onBackToCart: () => void;
}

const ShippingForm: React.FC<ShippingFormProps> = ({
  shippingData,
  deliveryCity,
  deliveryPrices,
  onShippingDataChange,
  onCityChange,
  onSubmit,
  onBackToCart
}) => {
  return (
    <form onSubmit={onSubmit}>
      <motion.div 
        className="bg-white p-8 rounded-2xl shadow-xl border border-gray-200 backdrop-blur-sm"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex items-center mb-8">
          <div className="w-14 h-14 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mr-4 shadow-lg">
            <MapPin className="h-7 w-7 text-white" />
          </div>
          <div>
            <h2 className="text-3xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
              Informations de livraison
            </h2>
            <p className="text-gray-600 mt-1">Où souhaitez-vous recevoir votre commande ?</p>
          </div>
        </div>
        
        <div className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <motion.div 
              className="space-y-2"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <Label htmlFor="nom" className="text-sm font-semibold text-gray-700 flex items-center">
                <div className="w-2 h-2 bg-red-500 rounded-full mr-2"></div>
                Nom*
              </Label>
              <Input
                id="nom"
                name="nom"
                value={shippingData.nom}
                onChange={onShippingDataChange}
                required
                className="h-12 border-gray-300 focus:border-red-500 focus:ring-red-500 rounded-xl transition-all duration-200 hover:border-gray-400"
                placeholder="Votre nom de famille"
              />
            </motion.div>
            
            <motion.div 
              className="space-y-2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Label htmlFor="prenom" className="text-sm font-semibold text-gray-700 flex items-center">
                <div className="w-2 h-2 bg-red-500 rounded-full mr-2"></div>
                Prénom*
              </Label>
              <Input
                id="prenom"
                name="prenom"
                value={shippingData.prenom}
                onChange={onShippingDataChange}
                required
                className="h-12 border-gray-300 focus:border-red-500 focus:ring-red-500 rounded-xl transition-all duration-200 hover:border-gray-400"
                placeholder="Votre prénom"
              />
            </motion.div>
          </div>
          
          <motion.div 
            className="space-y-2"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <Label htmlFor="adresse" className="text-sm font-semibold text-gray-700 flex items-center">
              <div className="w-2 h-2 bg-red-500 rounded-full mr-2"></div>
              Adresse complète*
            </Label>
            <Input
              id="adresse"
              name="adresse"
              value={shippingData.adresse}
              onChange={onShippingDataChange}
              required
              className="h-12 border-gray-300 focus:border-red-500 focus:ring-red-500 rounded-xl transition-all duration-200 hover:border-gray-400"
              placeholder="Numéro, rue, appartement, résidence..."
            />
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <motion.div 
              className="space-y-2"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <Label htmlFor="ville" className="text-sm font-semibold text-gray-700 flex items-center">
                <div className="w-2 h-2 bg-red-500 rounded-full mr-2"></div>
                Ville de livraison*
              </Label>
              <Select value={deliveryCity} onValueChange={onCityChange}>
                <SelectTrigger id="ville" className="h-12 border-gray-300 focus:border-red-500 rounded-xl">
                  <SelectValue placeholder="Sélectionnez votre ville" />
                </SelectTrigger>
                <SelectContent className="bg-white border border-gray-200 shadow-xl rounded-xl">
                  {Object.keys(deliveryPrices).sort().map(city => (
                    <SelectItem key={city} value={city} className="hover:bg-gray-50 rounded-lg m-1">
                      <div className="flex justify-between items-center w-full">
                        <span className="font-medium">{city}</span>
                        <span className="ml-4 text-sm px-2 py-1 rounded-full bg-gradient-to-r from-green-100 to-blue-100 text-gray-700">
                          {deliveryPrices[city as keyof typeof deliveryPrices] === 0 
                            ? "Gratuit" 
                            : `+${deliveryPrices[city as keyof typeof deliveryPrices]}€`}
                        </span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </motion.div>
            
            <motion.div 
              className="space-y-2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
            >
              <Label htmlFor="codePostal" className="text-sm font-semibold text-gray-700 flex items-center">
                <div className="w-2 h-2 bg-red-500 rounded-full mr-2"></div>
                Code postal*
              </Label>
              <Input
                id="codePostal"
                name="codePostal"
                value={shippingData.codePostal}
                onChange={onShippingDataChange}
                required
                className="h-12 border-gray-300 focus:border-red-500 focus:ring-red-500 rounded-xl transition-all duration-200 hover:border-gray-400"
                placeholder="97400"
              />
            </motion.div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <motion.div 
              className="space-y-2"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
            >
              <Label htmlFor="pays" className="text-sm font-semibold text-gray-700 flex items-center">
                <div className="w-2 h-2 bg-red-500 rounded-full mr-2"></div>
                Pays/Région*
              </Label>
              <Select 
                value={shippingData.pays}
                onValueChange={(value) => {/* handled by parent */}}
              >
                <SelectTrigger id="pays" className="h-12 border-gray-300 focus:border-red-500 rounded-xl">
                  <SelectValue placeholder="Sélectionnez votre pays" />
                </SelectTrigger>
                <SelectContent className="bg-white border border-gray-200 shadow-xl rounded-xl">
                  <SelectItem value="La Réunion" className="hover:bg-gray-50 rounded-lg m-1">🇷🇪 La Réunion</SelectItem>
                  <SelectItem value="France" className="hover:bg-gray-50 rounded-lg m-1">🇫🇷 France métropolitaine</SelectItem>
                  <SelectItem value="Madagascar" className="hover:bg-gray-50 rounded-lg m-1">🇲🇬 Madagascar</SelectItem>
                  <SelectItem value="Mayotte" className="hover:bg-gray-50 rounded-lg m-1">🇾🇹 Mayotte</SelectItem>
                </SelectContent>
              </Select>
            </motion.div>
            
            <motion.div 
              className="space-y-2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.7 }}
            >
              <Label htmlFor="telephone" className="text-sm font-semibold text-gray-700 flex items-center">
                <Phone className="h-4 w-4 mr-2 text-red-500" />
                <div className="w-2 h-2 bg-red-500 rounded-full mr-2"></div>
                Téléphone*
              </Label>
              <Input
                id="telephone"
                name="telephone"
                type="tel"
                value={shippingData.telephone}
                onChange={onShippingDataChange}
                required
                className="h-12 border-gray-300 focus:border-red-500 focus:ring-red-500 rounded-xl transition-all duration-200 hover:border-gray-400"
                placeholder="+262 123 456 789"
              />
            </motion.div>
          </div>
        </div>
      </motion.div>
      
      <motion.div 
        className="flex flex-col sm:flex-row justify-between gap-4 mt-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.8 }}
      >
        <Button 
          type="button" 
          variant="outline"
          onClick={onBackToCart}
          className="flex items-center px-8 py-4 h-14 border-2 border-gray-300 hover:border-gray-400 rounded-xl transition-all duration-300 hover:scale-105"
        >
          <ShoppingCart className="h-5 w-5 mr-2" />
          Retour au panier
        </Button>
        <Button 
          type="submit" 
          className="bg-gradient-to-r from-red-500 via-pink-500 to-purple-500 hover:from-red-600 hover:via-pink-600 hover:to-purple-600 text-white px-10 py-4 h-14 shadow-xl hover:shadow-2xl transition-all duration-300 rounded-xl hover:scale-105"
        >
          <CheckCircle className="h-5 w-5 mr-2" />
          Continuer au paiement
        </Button>
      </motion.div>
    </form>
  );
};

export default ShippingForm;