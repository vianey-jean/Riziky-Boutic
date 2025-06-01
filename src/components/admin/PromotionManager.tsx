
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Edit, Trash2, Clock } from 'lucide-react';
import { toast } from '@/components/ui/sonner';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import API from '@/services/api';

interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  promotion?: number | null;
  promotionEnd?: string | null;
}

interface PromotionManagerProps {
  product: Product;
}

const PromotionManager: React.FC<PromotionManagerProps> = ({ product }) => {
  const queryClient = useQueryClient();
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editData, setEditData] = useState({
    promotion: product.promotion || 0,
    hours: 24
  });

  // Mutation pour modifier la promotion
  const updatePromotionMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string, data: any }) => {
      const formData = new FormData();
      Object.keys(data).forEach(key => {
        formData.append(key, data[key].toString());
      });
      return API.put(`/products/${id}`, formData);
    },
    onSuccess: () => {
      toast.success("Promotion modifiée avec succès");
      setIsEditDialogOpen(false);
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
    onError: (error) => {
      console.error("Erreur lors de la modification de la promotion:", error);
      toast.error("Erreur lors de la modification de la promotion");
    }
  });

  // Mutation pour supprimer la promotion
  const removePromotionMutation = useMutation({
    mutationFn: async (id: string) => {
      const formData = new FormData();
      formData.append('price', (product.originalPrice || product.price).toString());
      formData.append('originalPrice', '');
      formData.append('promotion', '');
      formData.append('promotionEnd', '');
      return API.put(`/products/${id}`, formData);
    },
    onSuccess: () => {
      toast.success("Promotion supprimée avec succès");
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
    onError: (error) => {
      console.error("Erreur lors de la suppression de la promotion:", error);
      toast.error("Erreur lors de la suppression de la promotion");
    }
  });

  const isPromotionActive = (): boolean => {
    return !!(product.promotion && 
      product.promotionEnd && 
      new Date(product.promotionEnd) > new Date());
  };

  const getTimeRemaining = (): string => {
    if (!product.promotionEnd) return "Expirée";
    const remainingMs = new Date(product.promotionEnd).getTime() - new Date().getTime();
    if (remainingMs <= 0) return "Expirée";
    
    const hours = Math.floor(remainingMs / (1000 * 60 * 60));
    const minutes = Math.floor((remainingMs % (1000 * 60 * 60)) / (1000 * 60));
    return `${hours}h ${minutes}m`;
  };

  const handleEditPromotion = () => {
    if (editData.promotion <= 0) {
      toast.error("Veuillez entrer un pourcentage de promotion valide");
      return;
    }

    const originalPrice = product.originalPrice || product.price;
    const discountFactor = 1 - (editData.promotion / 100);
    const discountedPrice = parseFloat((originalPrice * discountFactor).toFixed(2));
    
    const promotionEnd = new Date();
    promotionEnd.setHours(promotionEnd.getHours() + editData.hours);
    
    const updateData = {
      price: discountedPrice,
      originalPrice: originalPrice,
      promotion: editData.promotion,
      promotionEnd: promotionEnd.toISOString()
    };
    
    updatePromotionMutation.mutate({ id: product.id, data: updateData });
  };

  const handleRemovePromotion = () => {
    removePromotionMutation.mutate(product.id);
  };

  const openEditDialog = () => {
    setEditData({
      promotion: product.promotion || 0,
      hours: 24
    });
    setIsEditDialogOpen(true);
  };

  if (!isPromotionActive()) {
    return null;
  }

  return (
    <>
      <div className="flex items-center space-x-2">
        <div>
          <span className="inline-block px-2 py-1 bg-red-100 text-red-800 rounded text-xs font-medium">
            -{product.promotion}%
          </span>
          <p className="text-xs mt-1 flex items-center">
            <Clock className="h-3 w-3 mr-1" />
            {getTimeRemaining()}
          </p>
        </div>
        <div className="flex flex-col space-y-1">
          <Button 
            size="sm" 
            variant="outline" 
            onClick={openEditDialog}
            className="h-6 px-2 text-xs"
          >
            <Edit className="h-3 w-3" />
          </Button>
          <Button 
            size="sm" 
            variant="outline" 
            onClick={handleRemovePromotion}
            className="h-6 px-2 text-xs text-red-600 hover:text-red-800"
          >
            <Trash2 className="h-3 w-3" />
          </Button>
        </div>
      </div>

      {/* Dialog de modification */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Modifier la promotion</DialogTitle>
            <DialogDescription>
              Modifiez le pourcentage de réduction et la durée de la promotion.
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="promotion" className="text-right">
                Réduction (%)
              </label>
              <Input
                id="promotion"
                type="number"
                min="1"
                max="99"
                value={editData.promotion}
                onChange={(e) => setEditData({...editData, promotion: parseInt(e.target.value) || 0})}
                className="col-span-3"
              />
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="duration" className="text-right">
                Durée (heures)
              </label>
              <Input
                id="duration"
                type="number"
                min="1"
                value={editData.hours}
                onChange={(e) => setEditData({...editData, hours: parseInt(e.target.value) || 24})}
                className="col-span-3"
              />
            </div>
            
            {editData.promotion > 0 && (
              <div className="bg-gray-50 p-3 rounded">
                <p className="text-sm text-muted-foreground">Prix actuel: <span className="font-medium">{product.price.toFixed(2)} €</span></p>
                <p className="text-sm text-muted-foreground">Nouveau prix: <span className="font-medium">{((product.originalPrice || product.price) * (1 - editData.promotion/100)).toFixed(2)} €</span></p>
                <p className="text-sm text-muted-foreground mt-1">La promotion expirera dans {editData.hours} heures.</p>
              </div>
            )}
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Annuler
            </Button>
            <Button onClick={handleEditPromotion} className="bg-red-800 hover:bg-red-700">
              Modifier
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default PromotionManager;
