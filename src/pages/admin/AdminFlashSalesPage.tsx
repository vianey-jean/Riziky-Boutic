import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import AdminLayout from './AdminLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { flashSaleAPI } from '@/services/flashSaleAPI';
import { productsAPI } from '@/services/productsAPI';
import { FlashSaleForm } from '@/components/admin/FlashSaleForm';
import { Plus, Clock, Play, Pause, Trash2, Edit, Flame, Timer, TrendingUp, Package, Zap } from 'lucide-react';
import PageDataLoader from '@/components/layout/PageDataLoader';
import { useToast } from '@/hooks/use-toast';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import AdminPageTitle from '@/components/admin/AdminPageTitle';
import DataStatsCard from '@/components/admin/DataStatsCard';

const AdminFlashSalesPage: React.FC = () => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingFlashSale, setEditingFlashSale] = useState(null);
  const [dataLoaded, setDataLoaded] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: flashSales = [], isLoading } = useQuery({
    queryKey: ['admin-flash-sales'],
    queryFn: async () => {
      const response = await flashSaleAPI.getAll();
      return response.data;
    },
    enabled: dataLoaded,
  });

  const { data: products = [] } = useQuery({
    queryKey: ['admin-products'],
    queryFn: async () => {
      const response = await productsAPI.getAll();
      return response.data;
    },
    enabled: dataLoaded,
  });

  const loadFlashSalesData = async () => {
    const [flashSalesResponse, productsResponse] = await Promise.all([
      flashSaleAPI.getAll(),
      productsAPI.getAll()
    ]);
    return { flashSales: flashSalesResponse.data, products: productsResponse.data };
  };

  const handleDataSuccess = () => {
    setDataLoaded(true);
  };

  const handleMaxRetriesReached = () => {
    toast({ title: 'Erreur de connexion', description: 'Impossible de charger les données', variant: 'destructive' });
  };

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

  // Calculate statistics
  const activeFlashSales = flashSales.filter((sale: any) => sale.isActive);
  const totalProducts = flashSales.reduce((acc: number, sale: any) => acc + (sale.productIds?.length || 0), 0);
  const averageDiscount = flashSales.length > 0 
    ? Math.round(flashSales.reduce((acc: number, sale: any) => acc + sale.discount, 0) / flashSales.length)
    : 0;

  if (!dataLoaded) {
    return (
      <AdminLayout>
        <PageDataLoader
          fetchFunction={loadFlashSalesData}
          onSuccess={handleDataSuccess}
          onMaxRetriesReached={handleMaxRetriesReached}
          loadingMessage="Chargement des ventes flash..."
          loadingSubmessage="Préparation de votre panel d'administration..."
          errorMessage="Erreur de chargement des ventes flash"
        >
        </PageDataLoader>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50">
        <div className="space-y-8 p-6">
          <AdminPageTitle 
            title="Gestion des Ventes Flash" 
            icon={Flame}
            description="Créez et gérez vos ventes flash avec compte à rebours en temps réel"
          />

          {/* Statistics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <DataStatsCard
              title="Total Ventes Flash"
              value={flashSales.length}
              icon={Zap}
              description="Campagnes créées"
              status="info"
            />
            <DataStatsCard
              title="Ventes Actives"
              value={activeFlashSales.length}
              icon={TrendingUp}
              description="En cours d'exécution"
              status="success"
            />
            <DataStatsCard
              title="Produits Inclus"
              value={totalProducts}
              icon={Package}
              description="Articles en promotion"
              status="warning"
            />
            <DataStatsCard
              title="Réduction Moyenne"
              value={`${averageDiscount}%`}
              icon={Timer}
              description="Discount moyen"
              status="error"
            />
          </div>

          {/* Header Actions */}
          <div className="flex justify-between items-center bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-white/20 shadow-xl">
            <div>
              <h2 className="text-2xl font-bold bg-gradient-to-r from-gray-900 via-gray-800 to-gray-700 bg-clip-text text-transparent">
                Vos Campagnes Flash
              </h2>
              <p className="text-gray-600 mt-1 font-medium">Gérez vos offres promotionnelles limitées dans le temps</p>
            </div>
          </div>

          {/* Flash Sales Grid */}
          <div className="grid gap-6">
            {flashSales.length === 0 ? (
              <Card className="bg-gradient-to-br from-white via-gray-50 to-blue-50 border-2 border-gray-200/60 shadow-2xl hover:shadow-3xl transition-all duration-500">
                <CardContent className="text-center py-16">
                  <div className="relative mb-6">
                    <div className="absolute inset-0 bg-gradient-to-r from-red-500 to-pink-600 rounded-full blur-2xl opacity-20"></div>
                    <Flame className="relative h-20 w-20 text-red-500 mx-auto" />
                  </div>
                  <h3 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent mb-3">
                    Aucune vente flash
                  </h3>
                  <p className="text-gray-600 text-lg mb-6 font-medium">
                    Créez votre première vente flash pour booster vos ventes
                  </p>
                  <Button 
                    onClick={() => setIsFormOpen(true)} 
                    className="bg-gradient-to-r from-red-500 via-pink-500 to-red-600 hover:from-red-600 hover:via-pink-600 hover:to-red-700 text-white px-8 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                  >
                    <Plus className="h-5 w-5 mr-2" />
                    Créer une vente flash
                  </Button>
                </CardContent>
              </Card>
            ) : (
              flashSales.map((flashSale: any) => (
                <Card 
                  key={flashSale.id} 
                  className="group bg-gradient-to-br from-white via-gray-50 to-blue-50 border-2 border-gray-200/60 shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-[1.02] overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 via-purple-500/5 to-pink-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  
                  <CardHeader className="relative">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center space-x-4 mb-4">
                          <div className="relative">
                            <div className="absolute inset-0 bg-gradient-to-r from-red-500 to-pink-600 rounded-2xl blur opacity-75 group-hover:opacity-100 transition-opacity"></div>
                            <div className="relative p-3 bg-gradient-to-r from-red-500 to-pink-600 rounded-2xl shadow-lg">
                              <Flame className="h-6 w-6 text-white" />
                            </div>
                          </div>
                          
                          <div className="flex-1">
                            <CardTitle className="text-2xl font-bold bg-gradient-to-r from-gray-900 via-gray-800 to-gray-700 bg-clip-text text-transparent">
                              {flashSale.title}
                            </CardTitle>
                            <div className="flex items-center space-x-3 mt-2">
                              <Badge 
                                variant={flashSale.isActive ? 'default' : 'secondary'}
                                className={`px-3 py-1 rounded-full font-semibold ${
                                  flashSale.isActive 
                                    ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white border-0 shadow-lg' 
                                    : 'bg-gray-100 text-gray-600 border border-gray-200'
                                }`}
                              >
                                {flashSale.isActive ? '🟢 Active' : '⚪ Inactive'}
                              </Badge>
                              <Badge className="bg-gradient-to-r from-red-50 to-pink-50 text-red-700 border-2 border-red-200 px-3 py-1 rounded-full font-bold text-lg shadow-lg">
                                -{flashSale.discount}% DE PROMOS
                              </Badge>
                            </div>
                          </div>
                        </div>
                        
                        <p className="text-gray-700 mb-4 text-lg font-medium">{flashSale.description}</p>
                        
                        {/* Products Section */}
                        <div className="bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 p-4 rounded-xl mb-4 border border-blue-200/60 shadow-inner">
                          <div className="flex items-center space-x-2 mb-2">
                            <Package className="h-5 w-5 text-blue-600" />
                            <p className="font-bold text-blue-800 text-lg">
                              Produits inclus ({flashSale.productIds?.length || 0}):
                            </p>
                          </div>
                          <p className="text-blue-700 font-medium text-sm leading-relaxed">
                            {getProductNames(flashSale.productIds || [])}
                          </p>
                        </div>
                        
                        {/* Time Information */}
                        <div className="flex items-center space-x-6 text-gray-600 bg-gradient-to-r from-gray-50 to-gray-100 p-4 rounded-xl border border-gray-200/60">
                          <div className="flex items-center space-x-2">
                            <Timer className="h-5 w-5 text-orange-500" />
                            <span className="font-semibold text-gray-800">Temps restant:</span>
                            <span className="font-bold text-orange-600 text-lg">
                              {getTimeRemaining(flashSale.endDate)}
                            </span>
                          </div>
                          <div className="text-sm font-medium">
                            <span className="text-gray-700">Du</span> {' '}
                            <span className="font-semibold text-gray-800">
                              {new Date(flashSale.startDate).toLocaleDateString()}
                            </span> {' '}
                            <span className="text-gray-700">au</span> {' '}
                            <span className="font-semibold text-gray-800">
                              {new Date(flashSale.endDate).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                      </div>
                      
                      {/* Action Buttons */}
                      <div className="flex flex-col space-y-2 ml-4">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEdit(flashSale)}
                          className="bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-200 text-blue-700 hover:from-blue-100 hover:to-indigo-100 hover:border-blue-300 transition-all duration-300 shadow-md hover:shadow-lg"
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
                          className={`border-2 transition-all duration-300 shadow-md hover:shadow-lg ${
                            flashSale.isActive 
                              ? 'bg-gradient-to-r from-orange-50 to-red-50 border-orange-200 text-orange-700 hover:from-orange-100 hover:to-red-100 hover:border-orange-300'
                              : 'bg-gradient-to-r from-green-50 to-emerald-50 border-green-200 text-green-700 hover:from-green-100 hover:to-emerald-100 hover:border-green-300'
                          }`}
                        >
                          {flashSale.isActive ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="bg-gradient-to-r from-red-50 to-pink-50 border-2 border-red-200 text-red-700 hover:from-red-100 hover:to-pink-100 hover:border-red-300 transition-all duration-300 shadow-md hover:shadow-lg"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent className="bg-gradient-to-br from-white to-gray-50 border-2 border-gray-200 shadow-2xl">
                            <AlertDialogHeader>
                              <AlertDialogTitle className="text-xl font-bold text-gray-900">
                                Supprimer la vente flash
                              </AlertDialogTitle>
                              <AlertDialogDescription className="text-gray-700 font-medium">
                                Êtes-vous sûr de vouloir supprimer cette vente flash ? Cette action est irréversible.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel className="bg-gray-100 hover:bg-gray-200 text-gray-700 border border-gray-300">
                                Annuler
                              </AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => deleteMutation.mutate(flashSale.id)}
                                className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white shadow-lg hover:shadow-xl transition-all duration-300"
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

          {/* Floating Action Button */}
          <div className="fixed bottom-8 right-8 z-50">
            <Button 
              onClick={() => setIsFormOpen(true)} 
              className="bg-gradient-to-r from-red-500 via-pink-500 to-red-600 hover:from-red-600 hover:via-pink-600 hover:to-red-700 text-white w-16 h-16 rounded-full shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:scale-110 active:scale-95 group relative overflow-hidden"
              size="icon"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent rounded-full transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
              <Plus className="h-8 w-8 relative z-10" />
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-yellow-400 rounded-full animate-pulse"></div>
            </Button>
            <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 text-xs font-bold text-gray-700 bg-white px-3 py-1 rounded-full shadow-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              Nouvelle Vente Flash
            </div>
          </div>

          {isFormOpen && (
            <FlashSaleForm
              flashSale={editingFlashSale}
              products={products}
              onClose={handleFormClose}
            />
          )}
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminFlashSalesPage;
