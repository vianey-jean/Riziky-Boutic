import React, { useState, useEffect } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { flashSaleAPI } from '@/services/flashSaleAPI';
import { useToast } from '@/hooks/use-toast';
import { FlashSaleFormData } from '@/types/flashSale';
import { Product } from '@/types/product';
import { Search } from 'lucide-react';

interface FlashSaleFormProps {
  flashSale?: any;
  products: Product[];
  onClose: () => void;
}

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
  });

  const [searchTerm, setSearchTerm] = useState('');
  const [filteredProducts, setFilteredProducts] = useState<Product[]>(products);

  const { toast } = useToast();
  const queryClient = useQueryClient();

  useEffect(() => {
    if (flashSale) {
      // S'assurer que productIds est un array
      let productIds = [];
      if (Array.isArray(flashSale.productIds)) {
        productIds = flashSale.productIds;
      } else if (flashSale.productIds && typeof flashSale.productIds === 'object') {
        productIds = Object.values(flashSale.productIds);
      }

      setFormData({
        title: flashSale.title,
        description: flashSale.description,
        discount: flashSale.discount,
        startDate: flashSale.startDate.slice(0, 16),
        endDate: flashSale.endDate.slice(0, 16),
        productIds: productIds,
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

    // S'assurer que les productIds sont bien inclus dans les données envoyées comme array
    const productIdsToSend = Array.isArray(formData.productIds) ? formData.productIds : [];
    
    const dataToSend = {
      title: formData.title,
      description: formData.description,
      discount: Number(formData.discount),
      startDate: formData.startDate,
      endDate: formData.endDate,
      productIds: productIdsToSend
    };

    console.log('=== ENVOI DES DONNÉES ===');
    console.log('Données complètes à envoyer:', JSON.stringify(dataToSend, null, 2));
    console.log('ProductIds sélectionnés:', productIdsToSend);
    console.log('Nombre de produits:', productIdsToSend.length);

    if (flashSale) {
      updateMutation.mutate({ id: flashSale.id, data: dataToSend });
    } else {
      createMutation.mutate(dataToSend);
    }
  };

  const handleProductToggle = (productId: string) => {
    console.log('=== TOGGLE PRODUIT ===');
    console.log('ID du produit cliqué:', productId);
    
    setFormData(prev => {
      const currentIds = Array.isArray(prev.productIds) ? prev.productIds : [];
      console.log('IDs actuels:', currentIds);
      
      let newProductIds;
      if (currentIds.includes(productId)) {
        newProductIds = currentIds.filter(id => id !== productId);
        console.log('Produit retiré. Nouveaux IDs:', newProductIds);
      } else {
        newProductIds = [...currentIds, productId];
        console.log('Produit ajouté. Nouveaux IDs:', newProductIds);
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
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
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

          <div>
            <Label className="text-base font-medium">Produits inclus dans la vente flash</Label>
            <p className="text-sm text-gray-600 mb-4">
              Sélectionnez les produits qui bénéficieront de la réduction de {formData.discount}%
            </p>

            {/* Barre de recherche */}
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

            {/* Affichage du message si recherche trop courte */}
            {searchTerm.length > 0 && searchTerm.length < 3 && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-4">
                <p className="text-sm text-yellow-800">
                  Veuillez saisir au moins 3 caractères pour rechercher
                </p>
              </div>
            )}

            {/* Liste des produits filtrés */}
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

            {/* Résumé des produits sélectionnés */}
            <div className="bg-blue-50 p-3 rounded-lg mt-3">
              <p className="text-sm font-medium text-blue-800">
                {Array.isArray(formData.productIds) ? formData.productIds.length : 0} produit(s) sélectionné(s)
              </p>
              {Array.isArray(formData.productIds) && formData.productIds.length > 0 && (
                <div className="text-xs text-blue-600 mt-1">
                  <p className="font-medium">Produits sélectionnés:</p>
                  <p className="truncate">{getSelectedProductNames()}</p>
                  <p className="mt-1">IDs: {formData.productIds.join(', ')}</p>
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
