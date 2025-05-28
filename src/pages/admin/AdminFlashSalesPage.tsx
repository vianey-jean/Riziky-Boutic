
import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import AdminLayout from './AdminLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { flashSaleAPI } from '@/services/flashSaleAPI';
import { productsAPI } from '@/services/productsAPI';
import { FlashSaleForm } from '@/components/admin/FlashSaleForm';
import { Plus, Clock, Play, Pause, Trash2, Edit, Flame } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';

const AdminFlashSalesPage: React.FC = () => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingFlashSale, setEditingFlashSale] = useState(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: flashSales = [], isLoading } = useQuery({
    queryKey: ['admin-flash-sales'],
    queryFn: async () => {
      const response = await flashSaleAPI.getAll();
      return response.data;
    },
  });

  const { data: products = [] } = useQuery({
    queryKey: ['admin-products'],
    queryFn: async () => {
      const response = await productsAPI.getAll();
      return response.data;
    },
  });

  const deleteMutation = useMutation({
    mutationFn: flashSaleAPI.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-flash-sales'] });
      toast({ title: 'Vente flash supprimée avec succès' });
    },
    onError: () => {
      toast({ title: 'Erreur lors de la suppression', variant: 'destructive' });
    },
  });

  const activateMutation = useMutation({
    mutationFn: flashSaleAPI.activate,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-flash-sales'] });
      queryClient.invalidateQueries({ queryKey: ['active-flash-sale'] });
      toast({ title: 'Vente flash activée avec succès' });
    },
    onError: () => {
      toast({ title: 'Erreur lors de l\'activation', variant: 'destructive' });
    },
  });

  const deactivateMutation = useMutation({
    mutationFn: flashSaleAPI.deactivate,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-flash-sales'] });
      queryClient.invalidateQueries({ queryKey: ['active-flash-sale'] });
      toast({ title: 'Vente flash désactivée avec succès' });
    },
    onError: () => {
      toast({ title: 'Erreur lors de la désactivation', variant: 'destructive' });
    },
  });

  const getTimeRemaining = (endDate: string) => {
    const end = new Date(endDate);
    const now = new Date();
    const diff = end.getTime() - now.getTime();
    
    if (diff <= 0) return 'Expiré';
    
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    
    if (days > 0) return `${days}j ${hours}h ${minutes}m`;
    if (hours > 0) return `${hours}h ${minutes}m`;
    return `${minutes}m`;
  };

  const getProductNames = (productIds: string[]) => {
    if (!productIds || productIds.length === 0) return 'Aucun produit';
    
    const selectedProducts = products.filter(product => productIds.includes(product.id));
    if (selectedProducts.length === 0) return 'Produits non trouvés';
    
    return selectedProducts.map(product => product.name).join(', ');
  };

  const handleEdit = (flashSale: any) => {
    setEditingFlashSale(flashSale);
    setIsFormOpen(true);
  };

  const handleFormClose = () => {
    setIsFormOpen(false);
    setEditingFlashSale(null);
  };

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="text-center py-20">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-red-600 mx-auto mb-6"></div>
          <h2 className="text-xl font-semibold">Chargement des ventes flash...</h2>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Gestion des Ventes Flash</h1>
            <p className="text-gray-600 mt-1">Créez et gérez vos ventes flash avec compte à rebours</p>
          </div>
          <Button onClick={() => setIsFormOpen(true)} className="bg-red-600 hover:bg-red-700">
            <Plus className="h-4 w-4 mr-2" />
            Nouvelle Vente Flash
          </Button>
        </div>

        <div className="grid gap-6">
          {flashSales.length === 0 ? (
            <Card>
              <CardContent className="text-center py-12">
                <Flame className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Aucune vente flash</h3>
                <p className="text-gray-600 mb-4">Créez votre première vente flash pour commencer</p>
                <Button onClick={() => setIsFormOpen(true)} className="bg-red-600 hover:bg-red-700">
                  <Plus className="h-4 w-4 mr-2" />
                  Créer une vente flash
                </Button>
              </CardContent>
            </Card>
          ) : (
            flashSales.map((flashSale: any) => (
              <Card key={flashSale.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <CardTitle className="text-xl">{flashSale.title}</CardTitle>
                        <Badge variant={flashSale.isActive ? 'default' : 'secondary'}>
                          {flashSale.isActive ? 'Active' : 'Inactive'}
                        </Badge>
                        <Badge variant="outline" className="bg-red-50 text-red-600 border-red-200">
                          -{flashSale.discount}%
                        </Badge>
                      </div>
                      <p className="text-gray-600 mb-3">{flashSale.description}</p>
                      
                      {/* Affichage des produits sélectionnés */}
                      <div className="bg-blue-50 p-3 rounded-lg mb-3">
                        <p className="text-sm font-medium text-blue-800 mb-1">
                          Produits inclus ({flashSale.productIds?.length || 0}):
                        </p>
                        <p className="text-xs text-blue-600">
                          {getProductNames(flashSale.productIds || [])}
                        </p>
                      </div>
                      
                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <div className="flex items-center">
                          <Clock className="h-4 w-4 mr-1" />
                          Temps restant: {getTimeRemaining(flashSale.endDate)}
                        </div>
                        <div>
                          Du {new Date(flashSale.startDate).toLocaleDateString()} au {new Date(flashSale.endDate).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(flashSale)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => flashSale.isActive 
                          ? deactivateMutation.mutate(flashSale.id)
                          : activateMutation.mutate(flashSale.id)
                        }
                        disabled={activateMutation.isPending || deactivateMutation.isPending}
                      >
                        {flashSale.isActive ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Supprimer la vente flash</AlertDialogTitle>
                            <AlertDialogDescription>
                              Êtes-vous sûr de vouloir supprimer cette vente flash ? Cette action est irréversible.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Annuler</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => deleteMutation.mutate(flashSale.id)}
                              className="bg-red-600 hover:bg-red-700"
                            >
                              Supprimer
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </div>
                </CardHeader>
              </Card>
            ))
          )}
        </div>

        {isFormOpen && (
          <FlashSaleForm
            flashSale={editingFlashSale}
            products={products}
            onClose={handleFormClose}
          />
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminFlashSalesPage;
