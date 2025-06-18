import React, { useState, useEffect } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { flashSaleAPI } from '@/services/flashSaleAPI';
import { useToast } from '@/hooks/use-toast';
import { FlashSaleFormData } from '@/types/flashSale';
import { Product } from '@/types/product';
import { Search, Palette, Star, Smile, Hash } from 'lucide-react';

interface FlashSaleFormProps {
  flashSale?: any;
  products: Product[];
  onClose: () => void;
}

const backgroundColors = [
  { name: 'Rouge', value: '#dc2626', class: 'bg-red-600' },
  { name: 'Bleu', value: '#2563eb', class: 'bg-blue-600' },
  { name: 'Vert', value: '#16a34a', class: 'bg-green-600' },
  { name: 'Violet', value: '#9333ea', class: 'bg-purple-600' },
  { name: 'Rose', value: '#db2777', class: 'bg-pink-600' },
  { name: 'Orange', value: '#ea580c', class: 'bg-orange-600' },
  { name: 'Indigo', value: '#4f46e5', class: 'bg-indigo-600' },
  { name: 'Teal', value: '#0d9488', class: 'bg-teal-600' },
];

const icons = [
  'Flame', 'Star', 'Heart', 'Zap', 'Gift', 'Crown', 'Sparkles', 'Trophy',
  'Target', 'Gem', 'Diamond', 'Award', 'Medal', 'Rocket', 'Flash', 'Sun'
];

const emojis = [
  '🔥', '⭐', '💎', '⚡', '🎁', '👑', '✨', '🏆',
  '🎯', '💖', '🌟', '🎉', '💫', '🚀', '💥', '☀️'
];

export const FlashSaleForm: React.FC<FlashSaleFormProps> = ({
  flashSale,
  products,
  onClose,
}) => {
  const [formData, setFormData] = useState<FlashSaleFormData>({
    title: '',
    description: '',
    discount: 0,
    startDate: '',
    endDate: '',
    productIds: [],
    backgroundColor: '',
    icon: '',
    emoji: '',
    order: 1,
  });

  const [searchTerm, setSearchTerm] = useState('');
  const [filteredProducts, setFilteredProducts] = useState<Product[]>(products);

  const { toast } = useToast();
  const queryClient = useQueryClient();

  useEffect(() => {
    if (flashSale) {
      let productIds = [];
      if (Array.isArray(flashSale.productIds)) {
        productIds = flashSale.productIds;
      } else if (flashSale.productIds && typeof flashSale.productIds === 'object') {
        productIds = Object.values(flashSale.productIds);
      }

      setFormData({
        title: flashSale.title || '',
        description: flashSale.description || '',
        discount: flashSale.discount || 0,
        startDate: flashSale.startDate ? flashSale.startDate.slice(0, 16) : '',
        endDate: flashSale.endDate ? flashSale.endDate.slice(0, 16) : '',
        productIds: productIds,
        backgroundColor: flashSale.backgroundColor || '',
        icon: flashSale.icon || '',
        emoji: flashSale.emoji || '',
        order: flashSale.order || 1,
      });
    }
  }, [flashSale]);

  // Filtrage des produits par recherche
  useEffect(() => {
    if (searchTerm.length >= 3) {
      const filtered = products.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.category.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredProducts(filtered);
    } else {
      setFilteredProducts(products);
    }
  }, [searchTerm, products]);

  const createMutation = useMutation({
    mutationFn: flashSaleAPI.create,
    onSuccess: (response) => {
      console.log('Flash sale créée avec succès:', response.data);
      queryClient.invalidateQueries({ queryKey: ['admin-flash-sales'] });
      queryClient.invalidateQueries({ queryKey: ['active-flash-sale'] });
      toast({ title: 'Vente flash créée avec succès' });
      onClose();
    },
    onError: (error) => {
      console.error('Erreur lors de la création:', error);
      toast({ title: 'Erreur lors de la création', variant: 'destructive' });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<FlashSaleFormData> }) =>
      flashSaleAPI.update(id, data),
    onSuccess: (response) => {
      console.log('Flash sale mise à jour avec succès:', response.data);
      queryClient.invalidateQueries({ queryKey: ['admin-flash-sales'] });
      queryClient.invalidateQueries({ queryKey: ['active-flash-sale'] });
      toast({ title: 'Vente flash mise à jour avec succès' });
      onClose();
    },
    onError: (error) => {
      console.error('Erreur lors de la mise à jour:', error);
      toast({ title: 'Erreur lors de la mise à jour', variant: 'destructive' });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title || !formData.discount || !formData.startDate || !formData.endDate) {
      toast({ title: 'Veuillez remplir tous les champs requis', variant: 'destructive' });
      return;
    }

    if (new Date(formData.endDate) <= new Date(formData.startDate)) {
      toast({ title: 'La date de fin doit être après la date de début', variant: 'destructive' });
      return;
    }

    const productIdsToSend = Array.isArray(formData.productIds) ? formData.productIds : [];
    
    const dataToSend = {
      title: formData.title,
      description: formData.description,
      discount: Number(formData.discount),
      startDate: formData.startDate,
      endDate: formData.endDate,
      productIds: productIdsToSend,
      backgroundColor: formData.backgroundColor,
      icon: formData.icon,
      emoji: formData.emoji,
      order: Number(formData.order),
    };

    console.log('=== ENVOI DES DONNÉES ===');
    console.log('Données complètes à envoyer:', JSON.stringify(dataToSend, null, 2));

    if (flashSale) {
      updateMutation.mutate({ id: flashSale.id, data: dataToSend });
    } else {
      createMutation.mutate(dataToSend);
    }
  };

  const handleProductToggle = (productId: string) => {
    setFormData(prev => {
      const currentIds = Array.isArray(prev.productIds) ? prev.productIds : [];
      let newProductIds;
      if (currentIds.includes(productId)) {
        newProductIds = currentIds.filter(id => id !== productId);
      } else {
        newProductIds = [...currentIds, productId];
      }
      
      return {
        ...prev,
        productIds: newProductIds
      };
    });
  };

  const getSelectedProductNames = () => {
    const currentIds = Array.isArray(formData.productIds) ? formData.productIds : [];
    const selectedProducts = products.filter(product => currentIds.includes(product.id));
    return selectedProducts.map(product => product.name).join(', ');
  };

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {flashSale ? 'Modifier la vente flash' : 'Créer une nouvelle vente flash'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="title">Titre *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                placeholder="Ex: Vente Flash Électronique"
                required
              />
            </div>

            <div>
              <Label htmlFor="discount">Pourcentage de réduction *</Label>
              <Input
                id="discount"
                type="number"
                min="1"
                max="99"
                value={formData.discount}
                onChange={(e) => setFormData(prev => ({ ...prev, discount: parseInt(e.target.value) || 0 }))}
                placeholder="Ex: 50"
                required
              />
            </div>
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Description de la vente flash..."
              rows={3}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="startDate">Date et heure de début *</Label>
              <Input
                id="startDate"
                type="datetime-local"
                value={formData.startDate}
                onChange={(e) => setFormData(prev => ({ ...prev, startDate: e.target.value }))}
                required
              />
            </div>

            <div>
              <Label htmlFor="endDate">Date et heure de fin *</Label>
              <Input
                id="endDate"
                type="datetime-local"
                value={formData.endDate}
                onChange={(e) => setFormData(prev => ({ ...prev, endDate: e.target.value }))}
                required
              />
            </div>
          </div>

          {/* Nouvelles sections pour les propriétés visuelles */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 p-4 bg-gray-50 rounded-lg">
            <div>
              <Label className="flex items-center space-x-2 mb-2">
                <Palette className="h-4 w-4" />
                <span>Couleur de fond</span>
              </Label>
              <div className="grid grid-cols-4 gap-2">
                {backgroundColors.map((color) => (
                  <button
                    key={color.value}
                    type="button"
                    className={`w-8 h-8 rounded-full border-2 ${color.class} ${
                      formData.backgroundColor === color.value ? 'border-gray-800' : 'border-gray-300'
                    }`}
                    onClick={() => setFormData(prev => ({ ...prev, backgroundColor: color.value }))}
                    title={color.name}
                  />
                ))}
              </div>
            </div>

            <div>
              <Label className="flex items-center space-x-2 mb-2">
                <Star className="h-4 w-4" />
                <span>Icône</span>
              </Label>
              <Select value={formData.icon} onValueChange={(value) => setFormData(prev => ({ ...prev, icon: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Choisir une icône" />
                </SelectTrigger>
                <SelectContent>
                  {icons.map((icon) => (
                    <SelectItem key={icon} value={icon}>
                      {icon}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label className="flex items-center space-x-2 mb-2">
                <Smile className="h-4 w-4" />
                <span>Emoji</span>
              </Label>
              <div className="grid grid-cols-4 gap-1">
                {emojis.map((emoji) => (
                  <button
                    key={emoji}
                    type="button"
                    className={`p-2 text-lg rounded border ${
                      formData.emoji === emoji ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
                    }`}
                    onClick={() => setFormData(prev => ({ ...prev, emoji: emoji }))}
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <Label className="flex items-center space-x-2 mb-2">
                <Hash className="h-4 w-4" />
                <span>Ordre d'affichage</span>
              </Label>
              <Input
                type="number"
                min="1"
                value={formData.order}
                onChange={(e) => setFormData(prev => ({ ...prev, order: parseInt(e.target.value) || 1 }))}
                placeholder="1"
              />
            </div>
          </div>

          {/* Section produits - keep existing code */}
          <div>
            <Label className="text-base font-medium">Produits inclus dans la vente flash</Label>
            <p className="text-sm text-gray-600 mb-4">
              Sélectionnez les produits qui bénéficieront de la réduction de {formData.discount}%
            </p>

            <div className="relative mb-4">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                type="text"
                placeholder="Rechercher des produits (minimum 3 caractères)..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            {searchTerm.length > 0 && searchTerm.length < 3 && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-4">
                <p className="text-sm text-yellow-800">
                  Veuillez saisir au moins 3 caractères pour rechercher
                </p>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 max-h-60 overflow-y-auto border rounded-lg p-4">
              {filteredProducts.length === 0 ? (
                <div className="col-span-full text-center py-8 text-gray-500">
                  {searchTerm.length >= 3 ? 'Aucun produit trouvé' : 'Tous les produits'}
                </div>
              ) : (
                filteredProducts.map((product) => (
                  <div key={product.id} className="flex items-start space-x-3 p-2 hover:bg-gray-50 rounded">
                    <Checkbox
                      id={`product-${product.id}`}
                      checked={Array.isArray(formData.productIds) && formData.productIds.includes(product.id)}
                      onCheckedChange={() => handleProductToggle(product.id)}
                    />
                    <div className="flex-1 min-w-0">
                      <label
                        htmlFor={`product-${product.id}`}
                        className="text-sm font-medium cursor-pointer block truncate"
                      >
                        {product.name}
                      </label>
                      <p className="text-xs text-gray-500 truncate">
                        {product.price}€ 
                        {formData.discount > 0 && (
                          <span className="text-red-600 font-medium ml-2">
                            → {(product.price * (1 - formData.discount / 100)).toFixed(2)}€
                          </span>
                        )}
                      </p>
                      <p className="text-xs text-gray-400 truncate">{product.category}</p>
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className="bg-blue-50 p-3 rounded-lg mt-3">
              <p className="text-sm font-medium text-blue-800">
                {Array.isArray(formData.productIds) ? formData.productIds.length : 0} produit(s) sélectionné(s)
              </p>
              {Array.isArray(formData.productIds) && formData.productIds.length > 0 && (
                <div className="text-xs text-blue-600 mt-1">
                  <p className="font-medium">Produits sélectionnés:</p>
                  <p className="truncate">{getSelectedProductNames()}</p>
                </div>
              )}
            </div>
          </div>

          <div className="flex justify-end space-x-3 pt-4 border-t">
            <Button type="button" variant="outline" onClick={onClose}>
              Annuler
            </Button>
            <Button
              type="submit"
              disabled={createMutation.isPending || updateMutation.isPending}
              className="bg-red-600 hover:bg-red-700"
            >
              {createMutation.isPending || updateMutation.isPending
                ? 'Enregistrement...'
                : flashSale ? 'Mettre à jour' : 'Créer'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
