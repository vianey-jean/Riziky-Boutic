import React, { useState, useEffect, useMemo } from 'react';
import { codePromosAPI } from '@/services/api';
import { useAuth } from '@/contexts/AuthContext';
import AdminLayout from './AdminLayout';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import PageDataLoader from '@/components/layout/PageDataLoader';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from '@/components/ui/sonner';
import { Badge } from '@/components/ui/badge';
import { Percent, Plus, Search, Trash2, Tag, Gift, TrendingUp, Users, Calendar } from 'lucide-react';

const AdminCodePromosPage: React.FC = () => {
  const [codePromos, setCodePromos] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [productOptions, setProductOptions] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState('');
  const [pourcentage, setPourcentage] = useState(10);
  const [quantite, setQuantite] = useState(1);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { user, isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated && user && user.role !== 'admin') {
      window.location.href = '/';
      toast.error("Accès non autorisé");
    } else if (!isAuthenticated) {
      window.location.href = '/login';
    }
  }, [isAuthenticated, user]);

  useEffect(() => {
    fetchCodePromos();
  }, []);

  const fetchCodePromos = async () => {
    setIsLoading(true);
    try {
      const response = await codePromosAPI.getAll();
      if (response.data) {
        setCodePromos(response.data);
      }
    } catch (error) {
      console.error('Erreur lors du chargement des codes promo:', error);
      toast.error('Erreur lors du chargement des codes promo');
    } finally {
      setIsLoading(false);
    }
  };

  const searchProducts = async (query) => {
    if (!query || query.length < 2) {
      setProductOptions([]);
      return;
    }

    try {
      const response = await codePromosAPI.searchProducts(query);
      if (response.data) {
        setProductOptions(response.data);
      }
    } catch (error) {
      console.error('Erreur lors de la recherche de produits:', error);
    }
  };

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    searchProducts(value);
  };

  const handleCreatePromoCode = async () => {
    if (!selectedProduct) {
      toast.error('Veuillez sélectionner un produit');
      return;
    }

    if (pourcentage <= 0 || pourcentage > 100) {
      toast.error('Le pourcentage doit être entre 1 et 100');
      return;
    }

    if (quantite <= 0) {
      toast.error('La quantité doit être positive');
      return;
    }

    try {
      await codePromosAPI.create({
        productId: selectedProduct,
        pourcentage: pourcentage,
        quantite: quantite
      });

      toast.success('Code promo créé avec succès');
      fetchCodePromos();
      setSelectedProduct('');
      setPourcentage(10);
      setQuantite(1);
      setIsDialogOpen(false);
    } catch (error) {
      console.error('Erreur lors de la création du code promo:', error);
      toast.error('Erreur lors de la création du code promo');
    }
  };

  const handleDeletePromoCode = async (id) => {
    try {
      await codePromosAPI.delete(id);
      toast.success('Code promo supprimé avec succès');
      fetchCodePromos();
    } catch (error) {
      console.error('Erreur lors de la suppression du code promo:', error);
      toast.error('Erreur lors de la suppression du code promo');
    }
  };

  const filteredCodePromos = codePromos.filter(code => 
    code.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalCodes = codePromos.length;
  const activeCodes = codePromos.filter(code => code.quantite > 0).length;
  const totalUsages = codePromos.reduce((sum, code) => sum + (code.initialQuantite - code.quantite), 0);
  const averageDiscount = codePromos.length > 0 ? codePromos.reduce((sum, code) => sum + code.pourcentage, 0) / codePromos.length : 0;

  if (isLoading) {
    return (
      <AdminLayout>

                            <PageDataLoader
               
                  loadingMessage="Chargement de votre boutique..."
                  loadingSubmessage="Préparation de votre expérience shopping premium..."
                  errorMessage="Erreur de chargement des produits" fetchFunction={function (): Promise<any> {
                    throw new Error('Function not implemented.');
                  } } onSuccess={function (data: any): void {
                    throw new Error('Function not implemented.');
                  } } children={''}        >
        
                </PageDataLoader>
                
        {/* <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 via-white to-pink-50">
          <div className="text-center space-y-6">
            <div className="relative">
              <div className="animate-spin rounded-full h-20 w-20 border-4 border-purple-500 border-t-transparent mx-auto"></div>
              <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-purple-400 to-pink-500 opacity-20 animate-pulse"></div>
            </div>
            <div className="space-y-2">
              <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                Chargement des codes promo
              </h2>
              <p className="text-gray-600">Veuillez patienter...</p>
            </div>
          </div>
        </div> */}
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-8 p-6">
        {/* Enhanced Header */}
        <div className="bg-gradient-to-br from-purple-600 via-pink-600 to-indigo-700 rounded-3xl p-8 text-white shadow-2xl relative overflow-hidden">
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-32 translate-x-32"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-24 -translate-x-24"></div>
          
          <div className="relative z-10">
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between">
              <div className="space-y-4 mb-6 lg:mb-0">
                <div className="flex items-center space-x-4">
                  <div className="bg-white/20 backdrop-blur-sm p-4 rounded-2xl">
                    <Percent className="h-10 w-10 text-white" />
                  </div>
                  <div>
                    <h1 className="text-4xl font-bold mb-2">Gestion des Codes Promo</h1>
                    <p className="text-purple-100 text-lg">Créez et gérez vos codes de réduction</p>
                  </div>
                </div>
              </div>
              
              <Button 
                onClick={() => setIsDialogOpen(true)}
                size="lg"
                className="bg-white text-purple-600 hover:bg-purple-50 border-0 shadow-xl font-semibold px-8 py-3 rounded-xl transition-all duration-300 hover:scale-105"
              >
                <Plus className="h-5 w-5 mr-2" />
                Nouveau Code Promo
              </Button>
            </div>
          </div>
        </div>

        {/* Enhanced Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="group hover:shadow-2xl transition-all duration-300 border-0 bg-gradient-to-br from-purple-50 to-pink-100 hover:scale-105">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-600 text-sm font-medium">Total Codes</p>
                  <p className="text-3xl font-bold text-purple-800 mt-1">{totalCodes}</p>
                </div>
                <div className="bg-gradient-to-br from-purple-500 to-pink-600 p-3 rounded-2xl shadow-lg group-hover:shadow-xl transition-shadow">
                  <Tag className="h-8 w-8 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="group hover:shadow-2xl transition-all duration-300 border-0 bg-gradient-to-br from-green-50 to-emerald-100 hover:scale-105">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-600 text-sm font-medium">Codes Actifs</p>
                  <p className="text-3xl font-bold text-green-800 mt-1">{activeCodes}</p>
                </div>
                <div className="bg-gradient-to-br from-green-500 to-emerald-600 p-3 rounded-2xl shadow-lg group-hover:shadow-xl transition-shadow">
                  <Gift className="h-8 w-8 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="group hover:shadow-2xl transition-all duration-300 border-0 bg-gradient-to-br from-blue-50 to-cyan-100 hover:scale-105">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-600 text-sm font-medium">Utilisations</p>
                  <p className="text-3xl font-bold text-blue-800 mt-1">{totalUsages}</p>
                </div>
                <div className="bg-gradient-to-br from-blue-500 to-cyan-600 p-3 rounded-2xl shadow-lg group-hover:shadow-xl transition-shadow">
                  <Users className="h-8 w-8 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="group hover:shadow-2xl transition-all duration-300 border-0 bg-gradient-to-br from-orange-50 to-red-100 hover:scale-105">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-orange-600 text-sm font-medium">Remise Moyenne</p>
                  <p className="text-3xl font-bold text-orange-800 mt-1">{averageDiscount.toFixed(1)}%</p>
                </div>
                <div className="bg-gradient-to-br from-orange-500 to-red-600 p-3 rounded-2xl shadow-lg group-hover:shadow-xl transition-shadow">
                  <TrendingUp className="h-8 w-8 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Enhanced Search */}
        <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
          <CardHeader className="bg-gradient-to-r from-gray-50 to-white border-b">
            <CardTitle className="flex items-center text-gray-800">
              <Search className="h-5 w-5 mr-2 text-gray-600" />
              Rechercher des codes promo
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <Input
              placeholder="Rechercher un code..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="h-12 text-lg border-2 border-gray-200 focus:border-purple-500 transition-colors"
            />
          </CardContent>
        </Card>

        {/* Enhanced Codes List */}
        <Card className="border-0 shadow-xl bg-white">
          <CardHeader className="bg-gradient-to-r from-gray-50 to-white border-b">
            <CardTitle className="text-gray-800">
              Liste des Codes Promo ({filteredCodePromos.length})
            </CardTitle>
            <CardDescription>
              Gérez vos codes de réduction
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            {filteredCodePromos.length === 0 ? (
              <div className="text-center py-16">
                <div className="bg-gradient-to-br from-purple-100 to-pink-200 p-8 rounded-3xl w-fit mx-auto mb-6">
                  <Percent className="h-16 w-16 text-purple-500 mx-auto" />
                </div>
                <h3 className="text-2xl font-bold text-gray-700 mb-2">Aucun code promo trouvé</h3>
                <p className="text-gray-500 mb-6">Créez votre premier code de réduction</p>
                <Button 
                  onClick={() => setIsDialogOpen(true)}
                  className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Créer un code promo
                </Button>
              </div>
            ) : (
              <div className="p-6">
                <div className="rounded-2xl border border-gray-200 overflow-hidden">
                  <Table>
                    <TableHeader className="bg-gradient-to-r from-gray-50 to-gray-100">
                      <TableRow className="border-b-2 border-gray-200">
                        <TableHead className="font-bold text-gray-700">Code</TableHead>
                        <TableHead className="font-bold text-gray-700">Produit</TableHead>
                        <TableHead className="font-bold text-gray-700">Remise</TableHead>
                        <TableHead className="font-bold text-gray-700">Utilisations restantes</TableHead>
                        <TableHead className="text-right font-bold text-gray-700">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredCodePromos.map((codePromo) => (
                        <TableRow 
                          key={codePromo.id} 
                          className="hover:bg-gradient-to-r hover:from-purple-50 hover:to-pink-50 transition-all duration-200 border-b border-gray-100"
                        >
                          <TableCell className="font-mono font-bold text-purple-700 bg-purple-50 rounded-lg mx-1">
                            {codePromo.code}
                          </TableCell>
                          <TableCell className="text-gray-700">{codePromo.productId}</TableCell>
                          <TableCell>
                            <Badge className="bg-gradient-to-r from-green-500 to-emerald-600 text-white border-0">
                              -{codePromo.pourcentage}%
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Badge variant={codePromo.quantite > 0 ? "outline" : "destructive"} className="font-semibold">
                              {codePromo.quantite}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleDeletePromoCode(codePromo.id)}
                              className="border-red-200 text-red-600 hover:bg-red-50 transition-colors"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Enhanced Creation Dialog */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="max-w-2xl border-0 shadow-2xl">
            <DialogHeader className="border-b pb-4">
              <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                Créer un nouveau code promo
              </DialogTitle>
              <DialogDescription className="text-gray-600">
                Générez automatiquement un code de réduction pour un produit
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-6 py-6">
              <div className="space-y-2">
                <Label className="text-sm font-semibold text-gray-700">Rechercher un produit</Label>
                <Input
                  placeholder="Tapez le nom du produit..."
                  value={searchTerm}
                  onChange={handleSearchChange}
                  className="h-12 border-2 focus:border-purple-500 transition-colors"
                />
              </div>

              {productOptions.length > 0 && (
                <div className="space-y-2">
                  <Label className="text-sm font-semibold text-gray-700">Sélectionner un produit</Label>
                  <select
                    value={selectedProduct}
                    onChange={(e) => setSelectedProduct(e.target.value)}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-purple-500 focus:outline-none transition-colors"
                  >
                    <option value="">Choisir un produit</option>
                    {productOptions.map((product) => (
                      <option key={product.id} value={product.id}>
                        {product.name} {product.price ? `- ${product.price}€` : ''}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-sm font-semibold text-gray-700">Pourcentage de remise</Label>
                  <div className="flex items-center space-x-2">
                    <Input
                      type="number"
                      min="1"
                      max="100"
                      value={pourcentage}
                      onChange={(e) => setPourcentage(Number(e.target.value))}
                      className="h-12 border-2 focus:border-purple-500 transition-colors"
                    />
                    <span className="text-purple-600 font-bold text-lg">%</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-semibold text-gray-700">Nombre d'utilisations</Label>
                  <Input
                    type="number"
                    min="1"
                    value={quantite}
                    onChange={(e) => setQuantite(Number(e.target.value))}
                    className="h-12 border-2 focus:border-purple-500 transition-colors"
                  />
                </div>
              </div>
            </div>

            <DialogFooter className="border-t pt-4">
              <DialogClose asChild>
                <Button variant="outline" className="px-6">
                  Annuler
                </Button>
              </DialogClose>
              <Button
                onClick={handleCreatePromoCode}
                disabled={!selectedProduct}
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 px-6"
              >
                <Plus className="h-4 w-4 mr-2" />
                Créer le code
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
};

export default AdminCodePromosPage;
