import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { productsAPI } from '@/services/productsAPI';
import { categoriesAPI } from '@/services/categoriesAPI';
import AdminLayout from './AdminLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Plus, Search, Edit, Trash2, Package, TrendingUp, Eye, Star, DollarSign } from 'lucide-react';
import { ProductForm } from '@/components/admin/ProductForm';
import { ProductList } from '@/components/admin/ProductList';
import PageDataLoader from '@/components/layout/PageDataLoader';
import { useToast } from '@/hooks/use-toast';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';

const AdminProductsPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [dataLoaded, setDataLoaded] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: products = [], isLoading } = useQuery({
    queryKey: ['admin-products'],
    queryFn: async () => {
      const response = await productsAPI.getAll();
      return response.data;
    },
    enabled: dataLoaded,
  });

  const { data: categories = [] } = useQuery({
    queryKey: ['admin-categories'],
    queryFn: async () => {
      const response = await categoriesAPI.getAll();
      return response.data;
    },
    enabled: dataLoaded,
  });

  const loadProductsData = async () => {
    const [productsResponse, categoriesResponse] = await Promise.all([
      productsAPI.getAll(),
      categoriesAPI.getAll()
    ]);
    return { products: productsResponse.data, categories: categoriesResponse.data };
  };

  const handleDataSuccess = () => {
    setDataLoaded(true);
  };

  const handleMaxRetriesReached = () => {
    toast({ title: 'Erreur de connexion', description: 'Impossible de charger les produits', variant: 'destructive' });
  };

  const deleteMutation = useMutation({
    mutationFn: productsAPI.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-products'] });
      toast({ title: 'Produit supprimé avec succès' });
    },
    onError: () => {
      toast({ title: 'Erreur lors de la suppression', variant: 'destructive' });
    },
  });

  const handleEdit = (product: any) => {
    setEditingProduct(product);
    setIsFormOpen(true);
  };

  const handleFormClose = () => {
    setIsFormOpen(false);
    setEditingProduct(null);
  };

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === '' || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const totalProducts = products.length;
  const totalValue = products.reduce((sum, product) => sum + (product.price * (product.stock || 0)), 0);
  const lowStockProducts = products.filter(product => (product.stock || 0) < 10).length;
  const averagePrice = products.length > 0 ? products.reduce((sum, product) => sum + product.price, 0) / products.length : 0;

  if (!dataLoaded) {
    return (
      <AdminLayout>
        <PageDataLoader
          fetchFunction={loadProductsData}
          onSuccess={handleDataSuccess}
          onMaxRetriesReached={handleMaxRetriesReached}
          loadingMessage="Chargement des produits..."
          loadingSubmessage="Préparation de votre catalogue..."
          errorMessage="Erreur de chargement des produits"
        >
        </PageDataLoader>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-8 p-6">
        {/* Enhanced Header Section */}
        <div className="bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700 rounded-3xl p-8 text-white shadow-2xl relative overflow-hidden">
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-32 translate-x-32"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-24 -translate-x-24"></div>
          
          <div className="relative z-10">
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between">
              <div className="space-y-4 mb-6 lg:mb-0">
                <div className="flex items-center space-x-4">
                  <div className="bg-white/20 backdrop-blur-sm p-4 rounded-2xl">
                    <Package className="h-10 w-10 text-white" />
                  </div>
                  <div>
                    <h1 className="text-4xl font-bold mb-2">Gestion des Produits</h1>
                    <p className="text-blue-100 text-lg">Gérez votre catalogue de produits</p>
                  </div>
                </div>
              </div>
              
              <Button 
                onClick={() => setIsFormOpen(true)}
                size="lg"
                className="bg-white text-blue-600 hover:bg-blue-50 border-0 shadow-xl font-semibold px-8 py-3 rounded-xl transition-all duration-300 hover:scale-105"
              >
                <Plus className="h-5 w-5 mr-2" />
                Nouveau Produit
              </Button>
            </div>
          </div>
        </div>

        {/* Enhanced Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="group hover:shadow-2xl transition-all duration-300 border-0 bg-gradient-to-br from-emerald-50 to-teal-100 hover:scale-105">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-emerald-600 text-sm font-medium">Total Produits</p>
                  <p className="text-3xl font-bold text-emerald-800 mt-1">{totalProducts}</p>
                </div>
                <div className="bg-gradient-to-br from-emerald-500 to-teal-600 p-3 rounded-2xl shadow-lg group-hover:shadow-xl transition-shadow">
                  <Package className="h-8 w-8 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="group hover:shadow-2xl transition-all duration-300 border-0 bg-gradient-to-br from-blue-50 to-indigo-100 hover:scale-105">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-600 text-sm font-medium">Valeur Stock</p>
                  <p className="text-3xl font-bold text-blue-800 mt-1">{totalValue.toFixed(0)}€</p>
                </div>
                <div className="bg-gradient-to-br from-blue-500 to-indigo-600 p-3 rounded-2xl shadow-lg group-hover:shadow-xl transition-shadow">
                  <DollarSign className="h-8 w-8 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="group hover:shadow-2xl transition-all duration-300 border-0 bg-gradient-to-br from-orange-50 to-red-100 hover:scale-105">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-orange-600 text-sm font-medium">Stock Faible</p>
                  <p className="text-3xl font-bold text-orange-800 mt-1">{lowStockProducts}</p>
                </div>
                <div className="bg-gradient-to-br from-orange-500 to-red-600 p-3 rounded-2xl shadow-lg group-hover:shadow-xl transition-shadow">
                  <TrendingUp className="h-8 w-8 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="group hover:shadow-2xl transition-all duration-300 border-0 bg-gradient-to-br from-purple-50 to-pink-100 hover:scale-105">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-600 text-sm font-medium">Prix Moyen</p>
                  <p className="text-3xl font-bold text-purple-800 mt-1">{averagePrice.toFixed(0)}€</p>
                </div>
                <div className="bg-gradient-to-br from-purple-500 to-pink-600 p-3 rounded-2xl shadow-lg group-hover:shadow-xl transition-shadow">
                  <Star className="h-8 w-8 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Enhanced Filters */}
        <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
          <CardHeader className="bg-gradient-to-r from-gray-50 to-white border-b">
            <CardTitle className="flex items-center text-gray-800">
              <Search className="h-5 w-5 mr-2 text-gray-600" />
              Filtres et Recherche
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <Input
                  placeholder="Rechercher un produit..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="h-12 text-lg border-2 border-gray-200 focus:border-blue-500 transition-colors"
                />
              </div>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none transition-colors min-w-[200px]"
              >
                <option value="">Toutes les catégories</option>
                {categories.map((category: any) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
          </CardContent>
        </Card>

        {/* Enhanced Products List */}
        <Card className="border-0 shadow-xl bg-white">
          <CardHeader className="bg-gradient-to-r from-gray-50 to-white border-b">
            <CardTitle className="text-gray-800">
              Liste des Produits ({filteredProducts.length})
            </CardTitle>
            <CardDescription>
              Gérez vos produits facilement
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            {filteredProducts.length === 0 ? (
              <div className="text-center py-16">
                <div className="bg-gradient-to-br from-gray-100 to-gray-200 p-8 rounded-3xl w-fit mx-auto mb-6">
                  <Package className="h-16 w-16 text-gray-400 mx-auto" />
                </div>
                <h3 className="text-2xl font-bold text-gray-700 mb-2">Aucun produit trouvé</h3>
                <p className="text-gray-500 mb-6">Commencez par ajouter votre premier produit</p>
                <Button 
                  onClick={() => setIsFormOpen(true)}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Créer un produit
                </Button>
              </div>
            ) : (
              <div className="grid gap-6 p-6">
                {filteredProducts.map((product: any) => (
                  <div key={product.id} className="group bg-gradient-to-r from-white to-gray-50 rounded-2xl border border-gray-200 p-6 hover:shadow-2xl transition-all duration-300 hover:scale-[1.02]">
                    <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between space-y-4 lg:space-y-0">
                      <div className="flex items-center space-x-6 flex-1">
                        <div className="w-20 h-20 bg-gradient-to-br from-gray-200 to-gray-300 rounded-2xl overflow-hidden flex-shrink-0 shadow-lg">
                          {product.image ? (
                            <img 
                              src={`${import.meta.env.VITE_API_BASE_URL}${product.image}`} 
                              alt={product.name}
                              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <Package className="h-8 w-8 text-gray-500" />
                            </div>
                          )}
                        </div>
                        
                        <div className="space-y-2 flex-1">
                          <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                            {product.name}
                          </h3>
                          <p className="text-gray-600 line-clamp-2">{product.description}</p>
                          <div className="flex items-center space-x-4">
                            <Badge className="bg-gradient-to-r from-green-500 to-emerald-600 text-white border-0">
                              {product.price}€
                            </Badge>
                            <Badge variant="outline" className="border-blue-200 text-blue-600">
                              Stock: {product.stock || 0}
                            </Badge>
                            {product.categoryName && (
                              <Badge variant="secondary" className="bg-purple-100 text-purple-700">
                                {product.categoryName}
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-3">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEdit(product)}
                          className="border-blue-200 text-blue-600 hover:bg-blue-50 transition-colors"
                        >
                          <Edit className="h-4 w-4 mr-1" />
                          Modifier
                        </Button>
                        
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button 
                              variant="outline" 
                              size="sm"
                              className="border-red-200 text-red-600 hover:bg-red-50 transition-colors"
                            >
                              <Trash2 className="h-4 w-4 mr-1" />
                              Supprimer
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Supprimer le produit</AlertDialogTitle>
                              <AlertDialogDescription>
                                Êtes-vous sûr de vouloir supprimer "{product.name}" ? Cette action est irréversible.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Annuler</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => deleteMutation.mutate(product.id)}
                                className="bg-red-600 hover:bg-red-700"
                              >
                                Supprimer
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {isFormOpen && (
          <ProductForm
            product={editingProduct}
            categories={categories}
            onClose={handleFormClose}
          />
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminProductsPage;
