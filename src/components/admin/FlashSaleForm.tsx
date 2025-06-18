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
import { Search, Palette, Star, Smile, Hash, Sparkles, Save, X } from 'lucide-react';

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
  { name: 'Turquoise', value: '#0d9488', class: 'bg-teal-600' },
  { name: 'Jaune', value: '#eab308', class: 'bg-yellow-500' },
  { name: 'Lime', value: '#84cc16', class: 'bg-lime-600' },
  { name: 'Émeraude', value: '#10b981', class: 'bg-emerald-600' },
  { name: 'Cyan', value: '#06b6d4', class: 'bg-cyan-600' },
  { name: 'Fuchsia', value: '#d946ef', class: 'bg-fuchsia-600' },
  { name: 'Ambre', value: '#f59e0b', class: 'bg-amber-500' },
  { name: 'Slate', value: '#64748b', class: 'bg-slate-600' },
  { name: 'Zinc', value: '#52525b', class: 'bg-zinc-600' },
  { name: 'Gris', value: '#6b7280', class: 'bg-gray-600' },
  { name: 'Neutre', value: '#737373', class: 'bg-neutral-600' },
  { name: 'Pierre', value: '#78716c', class: 'bg-stone-600' },
];

const icons = [
  'Flame',
  'Star',
  'Heart',
  'Zap',
  'Gift',
  'Crown',
  'Sparkles',
  'Trophy',
  'Target',
  'Gem',
  'Diamond',
  'Award',
  'Medal',
  'Rocket',
  'Flash',
  'Sun',
  'Moon',
  'Lightning',
  'Bolt',
  'Bell',
  'Shield',
  'CheckCircle',
  'XCircle',
  'Fire',
  'Bug',
  'ThumbsUp',
  'ThumbsDown',
  'Smile',
  'Calendar',
  'Clock',
  'Globe',
  'ShoppingCart',
  'Box',
  'StarHalf',
  'Tag',
  'Music',
  'Camera',
  'MagicWand',
  'Palette',
  'Phone',
  'MessageSquare',
  'Activity',
  'TrendingUp',
  'AlertTriangle',
  'Compass',
  'Eye',
  'Key',
  'Lock',
  'MapPin'
];

const emojis = [
  '🔥', '⭐', '💎', '⚡', '🎁', '👑', '✨', '🏆',
  '🎯', '💖', '🌟', '🎉', '💫', '🚀', '💥', '☀️',
  '🌈', '🧨', '🥇', '🥈', '🥉', '🛍️', '🧡', '💚',
  '💙', '💜', '🖤', '🎊', '🪄', '🪙', '🔔', '📦',
  '💡', '📣', '🎶', '🎵', '🌠', '🏅', '🎓', '🎨',
  '🧁', '🍭', '🍬', '🍀', '🪄', '🪐', '🌌', '🕹️'
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
    return selectedProducts.map(product => product.name).join('\n');
  };

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[95vh] overflow-y-auto bg-gradient-to-br from-white via-blue-50/30 to-purple-50/30 border-2 border-white/60 shadow-2xl backdrop-blur-xl">
        {/* Header avec animation */}
        <DialogHeader className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10 animate-pulse"></div>
          <div className="relative flex items-center space-x-4 p-6 bg-gradient-to-r from-white/80 to-white/60 rounded-2xl border border-white/50 shadow-xl backdrop-blur-sm">
            <div className="p-3 bg-gradient-to-r from-red-500 to-pink-600 rounded-2xl shadow-lg">
              <Sparkles className="h-8 w-8 text-white" />
            </div>
            <div>
              <DialogTitle className="text-3xl font-bold bg-gradient-to-r from-gray-900 via-purple-800 to-blue-800 bg-clip-text text-transparent">
                {flashSale ? 'Modifier la vente flash' : 'Créer une nouvelle vente flash'}
              </DialogTitle>
              <p className="text-gray-600 font-medium mt-1">Configurez votre campagne promotionnelle</p>
            </div>
          </div>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-8 p-6">
          {/* Section principale */}
          <div className="bg-gradient-to-r from-white/90 to-white/70 rounded-2xl p-6 border border-white/60 shadow-xl backdrop-blur-sm">
            <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center space-x-2">
              <div className="w-3 h-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full animate-pulse"></div>
              <span>Informations principales</span>
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="title" className="text-gray-700 font-semibold">Titre *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="Ex: Vente Flash Électronique"
                  required
                  className="bg-white/80 border-2 border-gray-200/60 focus:border-blue-400/60 focus:ring-2 focus:ring-blue-400/20 rounded-xl transition-all duration-300"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="discount" className="text-gray-700 font-semibold">Pourcentage de réduction *</Label>
                <Input
                  id="discount"
                  type="number"
                  min="1"
                  max="99"
                  value={formData.discount}
                  onChange={(e) => setFormData(prev => ({ ...prev, discount: parseInt(e.target.value) || 0 }))}
                  placeholder="Ex: 50"
                  required
                  className="bg-white/80 border-2 border-gray-200/60 focus:border-blue-400/60 focus:ring-2 focus:ring-blue-400/20 rounded-xl transition-all duration-300"
                />
              </div>
            </div>

            <div className="mt-6 space-y-2">
              <Label htmlFor="description" className="text-gray-700 font-semibold">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Description de la vente flash..."
                rows={3}
                className="bg-white/80 border-2 border-gray-200/60 focus:border-blue-400/60 focus:ring-2 focus:ring-blue-400/20 rounded-xl transition-all duration-300"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
              <div className="space-y-2">
                <Label htmlFor="startDate" className="text-gray-700 font-semibold">Date et heure de début *</Label>
                <Input
                  id="startDate"
                  type="datetime-local"
                  value={formData.startDate}
                  onChange={(e) => setFormData(prev => ({ ...prev, startDate: e.target.value }))}
                  required
                  className="bg-white/80 border-2 border-gray-200/60 focus:border-blue-400/60 focus:ring-2 focus:ring-blue-400/20 rounded-xl transition-all duration-300"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="endDate" className="text-gray-700 font-semibold">Date et heure de fin *</Label>
                <Input
                  id="endDate"
                  type="datetime-local"
                  value={formData.endDate}
                  onChange={(e) => setFormData(prev => ({ ...prev, endDate: e.target.value }))}
                  required
                  className="bg-white/80 border-2 border-gray-200/60 focus:border-blue-400/60 focus:ring-2 focus:ring-blue-400/20 rounded-xl transition-all duration-300"
                />
              </div>
            </div>
          </div>

          {/* Section personnalisation visuelle */}
          <div className="bg-gradient-to-r from-white/90 to-white/70 rounded-2xl p-6 border border-white/60 shadow-xl backdrop-blur-sm">
            <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center space-x-2">
              <div className="w-3 h-3 bg-gradient-to-r from-purple-500 to-pink-600 rounded-full animate-pulse"></div>
              <span>Personnalisation visuelle</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="space-y-3">
                <Label className="flex items-center space-x-2 text-gray-700 font-semibold">
                  <Palette className="h-5 w-5 text-purple-600" />
                  <span>Couleur de fond</span>
                </Label>
                <Select
                  value={formData.backgroundColor}
                  onValueChange={(value) => setFormData((prev) => ({ ...prev, backgroundColor: value }))}
                >
                  <SelectTrigger className="bg-white/80 border-2 border-gray-200/60 focus:border-purple-400/60 rounded-xl">
                    <SelectValue placeholder="Choisir une couleur" />
                  </SelectTrigger>
                  <SelectContent className="bg-white/95 backdrop-blur-sm border-2 border-gray-200/60 rounded-xl shadow-2xl">
                    {backgroundColors.map((color) => (
                      <SelectItem key={color.value} value={color.value} className="hover:bg-gray-50/80 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <span className={`w-5 h-5 rounded-full ${color.class} border-2 border-gray-300 shadow-sm`} />
                          <span className="font-medium">{color.name}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-3">
                <Label className="flex items-center space-x-2 text-gray-700 font-semibold">
                  <Star className="h-5 w-5 text-yellow-600" />
                  <span>Icône</span>
                </Label>
                <Select value={formData.icon} onValueChange={(value) => setFormData(prev => ({ ...prev, icon: value }))}>
                  <SelectTrigger className="bg-white/80 border-2 border-gray-200/60 focus:border-yellow-400/60 rounded-xl">
                    <SelectValue placeholder="Choisir une icône" />
                  </SelectTrigger>
                  <SelectContent className="bg-white/95 backdrop-blur-sm border-2 border-gray-200/60 rounded-xl shadow-2xl">
                    {icons.map((icon) => (
                      <SelectItem key={icon} value={icon} className="hover:bg-gray-50/80 rounded-lg font-medium">
                        {icon}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-3">
                <Label className="flex items-center space-x-2 text-gray-700 font-semibold">
                  <Smile className="h-5 w-5 text-orange-600" />
                  <span>Emoji</span>
                </Label>
                <Select
                  value={formData.emoji}
                  onValueChange={(value) => setFormData((prev) => ({ ...prev, emoji: value }))}
                >
                  <SelectTrigger className="bg-white/80 border-2 border-gray-200/60 focus:border-orange-400/60 rounded-xl">
                    <SelectValue placeholder="Choisir un emoji" />
                  </SelectTrigger>
                  <SelectContent className="bg-white/95 backdrop-blur-sm border-2 border-gray-200/60 rounded-xl shadow-2xl">
                    <div className="grid grid-cols-6 gap-2 p-3">
                      {emojis.map((emoji) => (
                        <SelectItem
                          key={emoji}
                          value={emoji}
                          className="flex items-center justify-center text-2xl p-3 hover:bg-gray-50/80 rounded-lg cursor-pointer transition-all duration-200 hover:scale-110"
                        >
                          {emoji}
                        </SelectItem>
                      ))}
                    </div>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-3">
                <Label className="flex items-center space-x-2 text-gray-700 font-semibold">
                  <Hash className="h-5 w-5 text-green-600" />
                  <span>Ordre d'affichage</span>
                </Label>
                <Input
                  type="number"
                  min="1"
                  value={formData.order}
                  onChange={(e) => setFormData(prev => ({ ...prev, order: parseInt(e.target.value) || 1 }))}
                  placeholder="1"
                  className="bg-white/80 border-2 border-gray-200/60 focus:border-green-400/60 focus:ring-2 focus:ring-green-400/20 rounded-xl transition-all duration-300"
                />
              </div>
            </div>
          </div>

          {/* Section produits */}
          <div className="bg-gradient-to-r from-white/90 to-white/70 rounded-2xl p-6 border border-white/60 shadow-xl backdrop-blur-sm">
            <div className="flex items-center space-x-2 mb-6">
              <div className="w-3 h-3 bg-gradient-to-r from-green-500 to-teal-600 rounded-full animate-pulse"></div>
              <h3 className="text-xl font-bold text-gray-800">Sélection des produits</h3>
            </div>
            <p className="text-gray-600 mb-6 font-medium bg-blue-50/60 p-4 rounded-xl border border-blue-200/40">
              Sélectionnez les produits qui bénéficieront de la réduction de {formData.discount}%
            </p>

            <div className="relative mb-6">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <Input
                type="text"
                placeholder="Rechercher des produits (minimum 3 caractères)..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-12 bg-white/80 border-2 border-gray-200/60 focus:border-blue-400/60 focus:ring-2 focus:ring-blue-400/20 rounded-xl transition-all duration-300"
              />
            </div>

            {searchTerm.length > 0 && searchTerm.length < 3 && (
              <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border-2 border-yellow-200/60 rounded-xl p-4 mb-6 shadow-lg">
                <p className="text-yellow-800 font-medium">
                  Veuillez saisir au moins 3 caractères pour rechercher
                </p>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-h-80 overflow-y-auto bg-white/60 border-2 border-gray-200/40 rounded-xl p-4 backdrop-blur-sm">
              {filteredProducts.length === 0 ? (
                <div className="col-span-full text-center py-12 text-gray-500">
                  {searchTerm.length >= 3 ? 'Aucun produit trouvé' : 'Tous les produits'}
                </div>
              ) : (
                filteredProducts.map((product) => (
                  <div key={product.id} className="flex items-start space-x-3 p-4 hover:bg-white/80 rounded-xl transition-all duration-300 border border-transparent hover:border-blue-200/60 hover:shadow-lg">
                    <Checkbox
                      id={`product-${product.id}`}
                      checked={Array.isArray(formData.productIds) && formData.productIds.includes(product.id)}
                      onCheckedChange={() => handleProductToggle(product.id)}
                      className="mt-1"
                    />
                    <div className="flex-1 min-w-0">
                      <label
                        htmlFor={`product-${product.id}`}
                        className="text-sm font-semibold cursor-pointer block truncate text-gray-800 hover:text-blue-600 transition-colors"
                      >
                        {product.name}
                      </label>
                      <p className="text-sm text-gray-600 truncate">
                        <span className="font-medium">{product.price}€</span>
                        {formData.discount > 0 && (
                          <span className="text-red-600 font-bold ml-2">
                            → {(product.price * (1 - formData.discount / 100)).toFixed(2)}€
                          </span>
                        )}
                      </p>
                      <p className="text-xs text-gray-500 truncate bg-gray-100/60 px-2 py-1 rounded-lg inline-block mt-1">
                        {product.category}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className="bg-gradient-to-r from-blue-50/80 to-indigo-50/80 p-4 rounded-xl mt-6 border-2 border-blue-200/40 shadow-lg">
              <p className="text-sm font-bold text-blue-800">
                {Array.isArray(formData.productIds) ? formData.productIds.length : 0} produit(s) sélectionné(s)
              </p>
              {Array.isArray(formData.productIds) && formData.productIds.length > 0 && (
                <div className="text-xs text-blue-600 mt-2">
                  <p className="font-semibold mb-1">Produits sélectionnés:</p>
                  <p className="whitespace-pre-line rounded-lg border border-blue-200/40">
                  {getSelectedProductNames()}
                  </p>

                </div>
              )}
            </div>
          </div>

          {/* Boutons d'action */}
          <div className="flex justify-end space-x-4 pt-6 border-t-2 border-gray-200/40">
            <Button 
              type="button" 
              variant="outline" 
              onClick={onClose}
              className="bg-white/80 border-2 border-gray-300/60 text-gray-700 hover:bg-gray-50/80 hover:border-gray-400/60 rounded-xl px-8 py-3 font-semibold transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              <X className="h-5 w-5 mr-2" />
              Annuler
            </Button>
            <Button
              type="submit"
              disabled={createMutation.isPending || updateMutation.isPending}
              className="bg-gradient-to-r from-red-500 via-pink-500 to-red-600 hover:from-red-600 hover:via-pink-600 hover:to-red-700 text-white rounded-xl px-8 py-3 font-semibold shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:scale-105 active:scale-95"
            >
              {createMutation.isPending || updateMutation.isPending ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Enregistrement...
                </>
              ) : (
                <>
                  <Save className="h-5 w-5 mr-2" />
                  {flashSale ? 'Mettre à jour' : 'Créer'}
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
