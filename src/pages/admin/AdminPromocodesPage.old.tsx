import React, { useState, useEffect } from 'react';
import AdminLayout from './AdminLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from '@/components/ui/sonner';
import { Search, Plus, Trash2 } from 'lucide-react';
import { codePromosAPI, CodePromo } from '@/services/api';
import { formatDate } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import PageDataLoader from '@/components/layout/PageDataLoader';

// Define proper product type
interface Product {
  id: string;
  name: string;
  price: number;
  image?: string;
}

const AdminPromocodesPage: React.FC = () => {
  const [codePromos, setCodePromos] = useState<CodePromo[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [dataLoaded, setDataLoaded] = useState(false);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedProduct, setSelectedProduct] = useState<string>('');
  const [productOptions, setProductOptions] = useState<Product[]>([]);
  const [pourcentage, setPourcentage] = useState<number>(10);
  const [quantite, setQuantite] = useState<number>(1);
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect if not admin
    if (isAuthenticated && user && user.role !== 'admin') {
      navigate('/');
      toast.error("Accès non autorisé");
    } else if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, user, navigate]);

  const loadPromoCodesData = async () => {
    const response = await codePromosAPI.getAll();
    return response.data;
  };

  const handleDataSuccess = (data: CodePromo[]) => {
    setCodePromos(data);
    setDataLoaded(true);
    setIsLoading(false);
  };

  const handleMaxRetriesReached = () => {
    toast.error('Impossible de charger les codes promo');
    setIsLoading(false);
  };

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

  const searchProducts = async (query: string) => {
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

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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
    } catch (error) {
      console.error('Erreur lors de la création du code promo:', error);
      toast.error('Erreur lors de la création du code promo');
    }
  };

  const handleDeletePromoCode = async (id: string) => {
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

  // Fonction pour obtenir le nom du produit
  const getProductName = async (productId: string) => {
    try {
      const response = await codePromosAPI.searchProducts(productId);
      if (response.data && response.data.length > 0) {
        return response.data[0].name;
      }
      return productId;
    } catch (error) {
      console.error('Erreur lors de la récupération du nom du produit:', error);
      return productId;
    }
  };

  if (!dataLoaded) {
    return (
      <AdminLayout>
        <PageDataLoader
          fetchFunction={loadPromoCodesData}
          onSuccess={handleDataSuccess}
          onMaxRetriesReached={handleMaxRetriesReached}
          loadingMessage="Chargement des codes promo..."
          loadingSubmessage="Récupération des promotions..."
          errorMessage="Erreur de chargement des codes promo"
        >
        </PageDataLoader>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Gestion des codes promo</h1>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle>Créer un code promo</CardTitle>
                <CardDescription>
                  Les codes promo seront générés automatiquement
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Rechercher un produit</label>
                    <Input
                      placeholder="Nom du produit..."
                      value={searchTerm}
                      onChange={handleSearchChange}
                    />
                  </div>

                  {productOptions.length > 0 && (
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Sélectionner un produit</label>
                      <Select
                        value={selectedProduct}
                        onValueChange={setSelectedProduct}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionner un produit" />
                        </SelectTrigger>
                        <SelectContent>
                          {productOptions.map((product) => (
                            <SelectItem key={product.id} value={product.id}>
                              {product.name} {product.price ? `- ${Number(product.price).toFixed(2)}€` : ''}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  )}

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Pourcentage de remise</label>
                    <div className="flex items-center">
                      <Input
                        type="number"
                        min="1"
                        max="100"
                        value={pourcentage || ''}
                        onChange={(e) => {
                          const val = e.target.value;
                          setPourcentage(val === '' ? 0 : Number(val));
                        }}
                      />
                      <span className="ml-2">%</span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Nombre d'utilisations</label>
                    <Input
                      type="number"
                      min="1"
                      value={quantite || ''}
                      onChange={(e) => {
                        const val = e.target.value;
                        setQuantite(val === '' ? 0 : Number(val));
                      }}
                    />
                  </div>

                  <Button
                    onClick={handleCreatePromoCode}
                    className="w-full"
                    disabled={!selectedProduct}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Créer
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-3">
            <Card>
              <CardHeader>
                <CardTitle>Liste des codes promo</CardTitle>
                <CardDescription>
                  {filteredCodePromos.length || 0} codes promo disponibles
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="mb-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
                    <Input
                      placeholder="Rechercher un code..."
                      className="pl-10"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                </div>

                {isLoading ? (
                  <div className="text-center py-8">Chargement...</div>
                ) : filteredCodePromos.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    Aucun code promo trouvé
                  </div>
                ) : (
                  <div className="rounded-md border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Code</TableHead>
                          <TableHead>Produit</TableHead>
                          <TableHead>Remise</TableHead>
                          <TableHead>Utilisations restantes</TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredCodePromos.map((codePromo) => (
                          <TableRow key={codePromo.id}>
                            <TableCell className="font-mono font-medium">
                              {codePromo.code}
                            </TableCell>
                            <TableCell>{codePromo.productId}</TableCell>
                            <TableCell>{Number(codePromo.pourcentage) || 0}%</TableCell>
                            <TableCell>{Number(codePromo.quantite) || 0}</TableCell>
                            <TableCell className="text-right">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleDeletePromoCode(codePromo.id)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminPromocodesPage;
