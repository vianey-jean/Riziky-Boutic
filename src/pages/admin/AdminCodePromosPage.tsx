
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
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from '@/components/ui/sonner';
import { PercentIcon, Edit, Trash2, PlusCircle, Search } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { CodePromo } from '@/types/codePromo';
const AUTH_BASE_URL = import.meta.env.VITE_AUTH_BASE_URL || "https://ton-backend.com";


const AdminCodePromosPage = () => {
  const { user } = useAuth();
  const [codePromos, setCodePromos] = useState<CodePromo[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedCodePromo, setSelectedCodePromo] = useState<CodePromo | null>(null);
  
  // État pour la création d'un nouveau code promo
  const [pourcentage, setPourcentage] = useState<number>(10);
  const [quantite, setQuantite] = useState<number>(1);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [newQuantity, setNewQuantity] = useState<number>(0);
  
  // Charger les codes promos existants
  const fetchCodePromos = async () => {
    setLoading(true);
    try {
      const response = await codePromosAPI.getAll();
      setCodePromos(response.data);
    } catch (error) {
      console.error("Erreur lors du chargement des codes promos:", error);
      toast.error("Erreur lors du chargement des codes promos");
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    fetchCodePromos();
  }, []);
  
  // Recherche de produits
  useEffect(() => {
    const searchProducts = async () => {
      if (searchQuery.length >= 3) {
        try {
          const response = await codePromosAPI.searchProducts(searchQuery);
          setSearchResults(response.data);
        } catch (error) {
          console.error("Erreur lors de la recherche de produits:", error);
          setSearchResults([]);
        }
      } else {
        setSearchResults([]);
      }
    };
    
    const debounceSearch = setTimeout(searchProducts, 300);
    return () => clearTimeout(debounceSearch);
  }, [searchQuery]);
  
  // Créer un nouveau code promo
  const handleCreateCodePromo = async () => {
    if (!selectedProduct) {
      toast.error("Veuillez sélectionner un produit");
      return;
    }
    
    try {
      await codePromosAPI.create({
        pourcentage,
        quantite,
        productId: selectedProduct.id
      });
      
      toast.success("Code promo créé avec succès");
      setIsCreateModalOpen(false);
      resetForm();
      fetchCodePromos();
    } catch (error) {
      console.error("Erreur lors de la création du code promo:", error);
      toast.error("Erreur lors de la création du code promo");
    }
  };
  
  // Mettre à jour un code promo
  const handleUpdateCodePromo = async () => {
    if (!selectedCodePromo) return;
    
    try {
      await codePromosAPI.update(selectedCodePromo.id, newQuantity);
      toast.success("Code promo mis à jour avec succès");
      setIsEditModalOpen(false);
      fetchCodePromos();
    } catch (error) {
      console.error("Erreur lors de la mise à jour du code promo:", error);
      toast.error("Erreur lors de la mise à jour du code promo");
    }
  };
  
  // Supprimer un code promo
  const handleDeleteCodePromo = async () => {
    if (!selectedCodePromo) return;
    
    try {
      await codePromosAPI.delete(selectedCodePromo.id);
      toast.success("Code promo supprimé avec succès");
      setIsDeleteModalOpen(false);
      fetchCodePromos();
    } catch (error) {
      console.error("Erreur lors de la suppression du code promo:", error);
      toast.error("Erreur lors de la suppression du code promo");
    }
  };
  
  // Réinitialiser le formulaire
  const resetForm = () => {
    setPourcentage(10);
    setQuantite(1);
    setSearchQuery('');
    setSearchResults([]);
    setSelectedProduct(null);
    setNewQuantity(0);
  };
  
  // Ouvrir le modal d'édition
  const openEditModal = (codePromo: CodePromo) => {
    setSelectedCodePromo(codePromo);
    setNewQuantity(codePromo.quantite);
    setIsEditModalOpen(true);
  };
  
  // Ouvrir le modal de suppression
  const openDeleteModal = (codePromo: CodePromo) => {
    setSelectedCodePromo(codePromo);
    setIsDeleteModalOpen(true);
  };
  
  return (
    <AdminLayout>
      <div className="container mx-auto py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Gestion des Codes Promo</h1>
          <Button onClick={() => setIsCreateModalOpen(true)}>
            <PlusCircle className="mr-2 h-4 w-4" />
            Créer un code promo
          </Button>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>Codes Promo</CardTitle>
            <CardDescription>Liste des codes promo disponibles</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-red-800"></div>
              </div>
            ) : codePromos.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-muted-foreground">Aucun code promo disponible</p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Code</TableHead>
                    <TableHead>Pourcentage</TableHead>
                    <TableHead>Quantité</TableHead>
                    <TableHead>Produit ID</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {codePromos.map((codePromo) => (
                    <TableRow key={codePromo.id}>
                      <TableCell className="font-medium">{codePromo.code}</TableCell>
                      <TableCell>{codePromo.pourcentage}%</TableCell>
                      <TableCell>
                        <Badge variant={codePromo.quantite > 0 ? "outline" : "destructive"}>
                          {codePromo.quantite}
                        </Badge>
                      </TableCell>
                      <TableCell>{codePromo.productId}</TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button size="sm" variant="outline" onClick={() => openEditModal(codePromo)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button size="sm" variant="destructive" onClick={() => openDeleteModal(codePromo)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
        
        {/* Modal de création */}
        <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Créer un nouveau code promo</DialogTitle>
              <DialogDescription>
                Remplissez le formulaire pour créer un nouveau code promo
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4 py-4">
              <div className="grid gap-4">
                <Label htmlFor="pourcentage">Pourcentage de réduction</Label>
                <div className="flex items-center">
                  <Input
                    id="pourcentage"
                    type="number"
                    min="1"
                    max="99"
                    value={pourcentage}
                    onChange={(e) => setPourcentage(parseInt(e.target.value))}
                    className="mr-2"
                  />
                  <span>%</span>
                </div>
              </div>
              
              <div className="grid gap-4">
                <Label htmlFor="quantite">Nombre de codes disponibles</Label>
                <Input
                  id="quantite"
                  type="number"
                  min="1"
                  value={quantite}
                  onChange={(e) => setQuantite(parseInt(e.target.value))}
                />
              </div>
              
              <div className="grid gap-4">
                <Label htmlFor="produit">Produit applicable</Label>
                <div className="relative">
                  <div className="flex items-center">
                    <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
                    <Input
                      id="produit"
                      placeholder="Rechercher un produit (min. 3 caractères)"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-8"
                    />
                  </div>
                  
                  {searchResults.length > 0 && (
                    <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-auto">
                      {searchResults.map(product => (
                        <div 
                          key={product.id}
                          className="flex items-center p-2 hover:bg-gray-100 cursor-pointer"
                          onClick={() => {
                            setSelectedProduct(product);
                            setSearchQuery(product.name);
                            setSearchResults([]);
                          }}
                        >
                          <img 
                            src={`${AUTH_BASE_URL}${product.image}`} 
                            alt={product.name}
                            className="w-10 h-10 object-cover rounded mr-2"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.src = `${AUTH_BASE_URL}/uploads/placeholder.jpg`;
                            }}
                          />
                          <div className="flex-1">
                            <div>{product.name}</div>
                            <div className="text-sm text-gray-500">{product.price} €</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                
                {selectedProduct && (
                  <div className="mt-2 p-2 border rounded-md">
                    <div className="flex items-center">
                      <img 
                        src={`${AUTH_BASE_URL}${selectedProduct.image}`} 
                        alt={selectedProduct.name}
                        className="w-12 h-12 object-cover rounded mr-3"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = `${AUTH_BASE_URL}/uploads/placeholder.jpg`;
                        }}
                      />
                      <div>
                        <div className="font-medium">{selectedProduct.name}</div>
                        <div className="text-sm text-gray-500">{selectedProduct.price} €</div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
            
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline">Annuler</Button>
              </DialogClose>
              <Button onClick={handleCreateCodePromo}>Créer</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        
        {/* Modal d'édition */}
        <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Modifier le code promo</DialogTitle>
              <DialogDescription>
                Modifiez la quantité disponible pour ce code promo
              </DialogDescription>
            </DialogHeader>
            
            {selectedCodePromo && (
              <div className="space-y-4 py-4">
                <div className="p-3 bg-muted rounded-md">
                  <div className="font-medium">Code: {selectedCodePromo.code}</div>
                  <div>Réduction: {selectedCodePromo.pourcentage}%</div>
                </div>
                
                <div className="grid gap-4">
                  <Label htmlFor="newQuantity">Quantité disponible</Label>
                  <Input
                    id="newQuantity"
                    type="number"
                    min="0"
                    value={newQuantity}
                    onChange={(e) => setNewQuantity(parseInt(e.target.value))}
                  />
                </div>
              </div>
            )}
            
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline">Annuler</Button>
              </DialogClose>
              <Button onClick={handleUpdateCodePromo}>Enregistrer</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        
        {/* Modal de suppression */}
        <Dialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Supprimer le code promo</DialogTitle>
              <DialogDescription>
                Êtes-vous sûr de vouloir supprimer ce code promo ? Cette action est irréversible.
              </DialogDescription>
            </DialogHeader>
            
            {selectedCodePromo && (
              <div className="p-3 bg-muted rounded-md my-4">
                <div className="font-medium">Code: {selectedCodePromo.code}</div>
                <div>Réduction: {selectedCodePromo.pourcentage}%</div>
                <div>Quantité: {selectedCodePromo.quantite}</div>
              </div>
            )}
            
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline">Annuler</Button>
              </DialogClose>
              <Button variant="destructive" onClick={handleDeleteCodePromo}>
                Supprimer
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
};

export default AdminCodePromosPage;
