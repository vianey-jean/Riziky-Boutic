import React, { useState, useRef } from 'react';
import AdminLayout from './AdminLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Switch } from '@/components/ui/switch';
import { Product } from '@/contexts/StoreContext';
import { Edit, Trash2, Plus, Percent, X, ArrowUp, ArrowDown } from 'lucide-react';
import { toast } from '@/components/ui/sonner';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import API from '@/services/api';

interface ExtendedProduct extends Product {
  originalPrice?: number;
  promotion?: number | null;
  promotionEnd?: string | null;
}

const AdminProductsPage = () => {
  // 🔁 URL de base récupérée depuis le .env
const AUTH_BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const queryClient = useQueryClient();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isPromotionDialogOpen, setIsPromotionDialogOpen] = useState(false);
  const [currentProduct, setCurrentProduct] = useState<ExtendedProduct | null>(null);
  const [formData, setFormData] = useState<Partial<ExtendedProduct>>({
    name: '',
    description: '',
    price: 0,
    category: '',
    isSold: true,
    stock: 0,
    image: '/placeholder.svg',
    images: ['/placeholder.svg'],
  });
  const [promotionData, setPromotionData] = useState({
    promotion: 0,
    hours: 24
  });
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);

  // Fetch products
  const { data: products = [] } = useQuery({
    queryKey: ['products'],
    queryFn: async () => {
      const response = await API.get('/products');
      return response.data;
    }
  });

  // Create product mutation
  const createProductMutation = useMutation({
    mutationFn: async (formData: FormData) => {
      return API.post('/products', formData);
    },
    onSuccess: () => {
      toast.success("Produit ajouté avec succès");
      setIsDialogOpen(false);
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
    onError: (error) => {
      console.error("Erreur lors de l'ajout du produit:", error);
      toast.error("Erreur lors de l'ajout du produit");
    }
  });

  // Update product mutation
  const updateProductMutation = useMutation({
    mutationFn: async ({ id, formData }: { id: string, formData: FormData }) => {
      return API.put(`/products/${id}`, formData);
    },
    onSuccess: () => {
      toast.success("Produit mis à jour avec succès");
      setIsDialogOpen(false);
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
    onError: (error) => {
      console.error("Erreur lors de la mise à jour du produit:", error);
      toast.error("Erreur lors de la mise à jour du produit");
    }
  });

  // Delete product mutation
  const deleteProductMutation = useMutation({
    mutationFn: async (id: string) => {
      return API.delete(`/products/${id}`);
    },
    onSuccess: () => {
      toast.success("Produit supprimé avec succès");
      setIsDeleteDialogOpen(false);
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
    onError: (error) => {
      console.error("Erreur lors de la suppression du produit:", error);
      toast.error("Erreur lors de la suppression du produit");
    }
  });

  // Apply promotion mutation
  const applyPromotionMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string, data: any }) => {
      return API.put(`/products/${id}`, data);
    },
    onSuccess: () => {
      toast.success("Promotion appliquée avec succès");
      setIsPromotionDialogOpen(false);
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
    onError: (error) => {
      console.error("Erreur lors de l'application de la promotion:", error);
      toast.error("Erreur lors de l'application de la promotion");
    }
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSwitchChange = (checked: boolean) => {
    setFormData(prev => ({ ...prev, isSold: checked }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const files = Array.from(e.target.files);
      const currentCount = imagePreviews.length;
      const totalCount = currentCount + files.length;
      
      if (totalCount > 4) {
        toast.warning("Vous ne pouvez télécharger que 4 images maximum");
        return;
      }
      
      // Add new files to existing files
      setImageFiles(prevFiles => [...prevFiles, ...files]);
      
      // Create URLs for previews
      const newPreviews = files.map(file => URL.createObjectURL(file));
      setImagePreviews(prevPreviews => [...prevPreviews, ...newPreviews]);
      
      // Reset the file input so the same file can be selected again
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };
  
  const handleRemoveImage = (index: number) => {
    const newFiles = [...imageFiles];
    const newPreviews = [...imagePreviews];
    
    // Check if this is a file or an existing image
    const isExistingImage = index >= imageFiles.length;
    
    // If it's a file, remove it from files array
    if (!isExistingImage) {
      newFiles.splice(index, 1);
    }
    
    // Remove from previews
    newPreviews.splice(index, 1);
    
    setImageFiles(newFiles);
    setImagePreviews(newPreviews);
  };
  
  const handleMoveImage = (index: number, direction: 'up' | 'down') => {
    if ((direction === 'up' && index === 0) || 
        (direction === 'down' && index === imagePreviews.length - 1)) {
      return;
    }
    
    const newPreviews = [...imagePreviews];
    const newFiles = [...imageFiles];
    
    if (direction === 'up') {
      // Swap with previous
      [newPreviews[index], newPreviews[index - 1]] = [newPreviews[index - 1], newPreviews[index]];
      
      // Only swap files if both are actual files (not existing images)
      if (index < imageFiles.length && index - 1 < imageFiles.length) {
        [newFiles[index], newFiles[index - 1]] = [newFiles[index - 1], newFiles[index]];
      }
    } else {
      // Swap with next
      [newPreviews[index], newPreviews[index + 1]] = [newPreviews[index + 1], newPreviews[index]];
      
      // Only swap files if both are actual files (not existing images)
      if (index < imageFiles.length && index + 1 < imageFiles.length) {
        [newFiles[index], newFiles[index + 1]] = [newFiles[index + 1], newFiles[index]];
      }
    }
    
    setImageFiles(newFiles);
    setImagePreviews(newPreviews);
  };

  const openAddDialog = () => {
    setCurrentProduct(null);
    setFormData({
      name: '',
      description: '',
      price: 0,
      category: '',
      isSold: true,
      stock: 0,
      image: '/placeholder.svg',
      images: ['/placeholder.svg']
    });
    setImageFiles([]);
    setImagePreviews([]);
    setIsDialogOpen(true);
  };

  const openEditDialog = (product: ExtendedProduct) => {
    setCurrentProduct(product);
    setFormData({
      name: product.name,
      description: product.description,
      price: product.price,
      category: product.category,
      isSold: product.isSold,
      stock: product.stock || 0,
      image: product.image,
      images: product.images || [product.image]
    });
    
    // Récupérer les images existantes comme prévisualisations
    const existingImages = product.images || [product.image];
    setImagePreviews(existingImages.map(img => `${AUTH_BASE_URL}${img}`));
    setImageFiles([]);
    
    setIsDialogOpen(true);
  };

  const openPromotionDialog = (product: ExtendedProduct) => {
    setCurrentProduct(product);
    setPromotionData({
      promotion: product.promotion || 0,
      hours: 24
    });
    setIsPromotionDialogOpen(true);
  };

  const openDeleteDialog = (product: ExtendedProduct) => {
    setCurrentProduct(product);
    setIsDeleteDialogOpen(true);
  };

  const handleSave = () => {
    if (!formData.name || !formData.description || formData.price === undefined || !formData.category) {
      toast.error("Veuillez remplir tous les champs obligatoires");
      return;
    }

    if (imagePreviews.length === 0) {
      toast.error("Veuillez ajouter au moins une image pour le produit");
      return;
    }

    const productFormData = new FormData();
    productFormData.append('name', formData.name as string);
    productFormData.append('description', formData.description as string);
    productFormData.append('price', formData.price.toString());
    productFormData.append('category', formData.category as string);
    productFormData.append('isSold', formData.isSold ? 'true' : 'false');
    productFormData.append('stock', (formData.stock || 0).toString());
    
    // Handle images
    if (imageFiles.length > 0) {
      // Add new image files
      imageFiles.forEach(file => {
        productFormData.append('images', file);
      });
      
      // If there are existing images we're keeping, we need to add them separately
      const existingImageCount = imagePreviews.length - imageFiles.length;
      if (existingImageCount > 0 && currentProduct) {
        // Get indices of existing images we're keeping
        const keptImages = [];
        const currentImages = currentProduct.images || [currentProduct.image];
        
        for (let i = imageFiles.length; i < imagePreviews.length; i++) {
          // Find which original image this preview corresponds to
          const previewUrl = imagePreviews[i];
          const originalIndex = currentImages.findIndex(img => 
            previewUrl === `${AUTH_BASE_URL}${img}`
          );
          if (originalIndex !== -1) {
            keptImages.push(currentImages[originalIndex]);
          }
        }
        
        // Combine new and existing images in the order of the previews
        const finalImages = [...keptImages];
        productFormData.append('imagesJson', JSON.stringify(finalImages));
      }
    } else if (currentProduct) {
      // If we're editing a product and only rearranging existing images
      const currentImages = currentProduct.images || [currentProduct.image];
      const finalImages = [];
      
      // Map preview URLs back to original image paths
      for (const previewUrl of imagePreviews) {
        const originalImage = currentImages.find(img => 
          previewUrl === `${AUTH_BASE_URL}${img}`
        );
        if (originalImage) {
          finalImages.push(originalImage);
        }
      }
      
      if (finalImages.length > 0) {
        productFormData.append('imagesJson', JSON.stringify(finalImages));
      }
    }
    
    if (currentProduct) {
      // Edit existing product
      updateProductMutation.mutate({ id: currentProduct.id, formData: productFormData });
    } else {
      // Add new product
      createProductMutation.mutate(productFormData);
    }
  };

  const handleDelete = () => {
    if (currentProduct) {
      deleteProductMutation.mutate(currentProduct.id);
    }
  };

  const handleApplyPromotion = () => {
    if (!currentProduct || promotionData.promotion <= 0) {
      toast.error("Veuillez entrer un pourcentage de promotion valide");
      return;
    }

    const originalPrice = currentProduct.price;
    const discountFactor = 1 - (promotionData.promotion / 100);
    const discountedPrice = parseFloat((originalPrice * discountFactor).toFixed(2));
    
    const promotionEnd = new Date();
    promotionEnd.setHours(promotionEnd.getHours() + promotionData.hours);
    
    const productFormData = new FormData();
    productFormData.append('price', discountedPrice.toString());
    productFormData.append('originalPrice', originalPrice.toString());
    productFormData.append('promotion', promotionData.promotion.toString());
    productFormData.append('promotionEnd', promotionEnd.toISOString());
    
    applyPromotionMutation.mutate({ id: currentProduct.id, data: productFormData });
  };

  const isPromotionActive = (product: ExtendedProduct): boolean => {
    return !!(product.promotion && 
      product.promotionEnd && 
      new Date(product.promotionEnd) > new Date());
  };

  const getTimeRemaining = (endDate: string): string => {
    const remainingMs = new Date(endDate).getTime() - new Date().getTime();
    if (remainingMs <= 0) return "Expirée";
    
    const hours = Math.floor(remainingMs / (1000 * 60 * 60));
    const minutes = Math.floor((remainingMs % (1000 * 60 * 60)) / (1000 * 60));
    return `${hours}h ${minutes}m`;
  };

  // Récupérer le nombre d'images pour un produit
  const getImageCount = (product: ExtendedProduct): number => {
    return product.images ? product.images.length : 1;
  };

  return (
    <AdminLayout>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Gestion des Produits</h1>
        <Button onClick={openAddDialog} className="bg-red-800 hover:bg-red-700">
          <Plus className="h-4 w-4 mr-2" />
          Ajouter un produit
        </Button>
      </div>
      
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Produit</TableHead>
              <TableHead>Catégorie</TableHead>
              <TableHead>Prix</TableHead>
              <TableHead>Stock</TableHead>
              <TableHead>Promotion</TableHead>
              <TableHead>Disponible</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.map((product: ExtendedProduct) => (
              <TableRow key={product.id}>
                <TableCell className="flex items-center space-x-3">
                <div className="relative w-[50px]">

                    <img 
                      src={`${AUTH_BASE_URL}${product.image}`} 
                      alt={product.name} 
                      className="w-10 h-10 object-cover rounded"
                    />
                    {getImageCount(product) > 1 && (
                      <span className="absolute -top-1 -right-1 bg-blue-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                        {getImageCount(product)}
                      </span>
                    )}
                  </div>
                  <div>
                    <p className="font-medium">{product.name}</p>
                    <p className="text-xs text-muted-foreground truncate max-w-xs">
                      {product.description}
                    </p>
                  </div>
                </TableCell>
                <TableCell>{product.category}</TableCell>
                <TableCell>
                  {isPromotionActive(product) ? (
                    <div>
                      <span className="text-xs line-through text-gray-500">
                        {typeof product.originalPrice === 'number' ? product.originalPrice.toFixed(2) : product.price.toFixed(2)} €
                      </span>
                      <span className="block font-semibold">
                        {product.price.toFixed(2)} €
                      </span>
                    </div>
                  ) : (
                    <span>{product.price.toFixed(2)} €</span>
                  )}
                </TableCell>
                <TableCell>
                  <span className="font-medium">{product.stock || 0}</span>
                </TableCell>
                <TableCell>
                  {isPromotionActive(product) ? (
                    <div>
                      <span className="inline-block px-2 py-1 bg-red-100 text-red-800 rounded text-xs font-medium">
                        -{product.promotion}%
                      </span>
                      <p className="text-xs mt-1">
                        Expire dans: {getTimeRemaining(product.promotionEnd!)}
                      </p>
                    </div>
                  ) : (
                    <Button 
                      size="sm" 
                      variant="outline" 
                      onClick={() => openPromotionDialog(product)}
                      className="text-xs"
                    >
                      <Percent className="h-3 w-3 mr-1" />
                      Ajouter
                    </Button>
                  )}
                </TableCell>
                <TableCell>
                  <span className={`inline-block px-2 py-1 rounded text-xs ${
                    product.isSold && (product.stock === undefined || product.stock > 0) 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {product.isSold && (product.stock === undefined || product.stock > 0) 
                      ? 'En stock' 
                      : 'Rupture'}
                  </span>
                </TableCell>
                <TableCell className="text-right">
                  <Button 
                    variant="ghost" 
                    size="icon"
                    onClick={() => openEditDialog(product)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="icon"
                    onClick={() => openDeleteDialog(product)}
                  >
                    <Trash2 className="h-4 w-4 text-red-500" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      
      {/* Add/Edit Product Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>
              {currentProduct ? 'Modifier le produit' : 'Ajouter un produit'}
            </DialogTitle>
            <DialogDescription>
              {currentProduct 
                ? 'Modifier les détails du produit ci-dessous.'
                : 'Remplissez les informations pour ajouter un nouveau produit.'
              }
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                Images du produit (maximum 4)
              </label>
              <div>
                <div className="flex flex-wrap gap-4 mb-4">
                  {imagePreviews.length > 0 ? (
                    imagePreviews.map((preview, index) => (
                      <div key={index} className="relative">
                        <div className="w-24 h-24 border rounded overflow-hidden">
                          <img 
                            src={preview} 
                            alt={`Aperçu ${index+1}`} 
                            className="w-full h-full object-cover" 
                          />
                        </div>
                        <div className="absolute -top-2 -right-2 bg-white rounded-full shadow">
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6 p-1 text-red-500"
                            onClick={() => handleRemoveImage(index)}
                          >
                            <X size={14} />
                          </Button>
                        </div>
                        <div className="absolute bottom-0 right-0 flex flex-col bg-white/80 rounded">
                          {index > 0 && (
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              className="h-6 w-6 p-0"
                              onClick={() => handleMoveImage(index, 'up')}
                            >
                              <ArrowUp size={14} />
                            </Button>
                          )}
                          {index < imagePreviews.length - 1 && (
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              className="h-6 w-6 p-0"
                              onClick={() => handleMoveImage(index, 'down')}
                            >
                              <ArrowDown size={14} />
                            </Button>
                          )}
                        </div>
                        {index === 0 && (
                          <span className="absolute top-0 left-0 bg-blue-500 text-white text-xs px-1 rounded">
                            Principale
                          </span>
                        )}
                      </div>
                    ))
                  ) : (
                    <div className="w-24 h-24 border rounded flex items-center justify-center text-gray-400">
                      Aucune image
                    </div>
                  )}
                  
                  {imagePreviews.length < 4 && (
                    <div className="w-24 h-24 border rounded flex items-center justify-center">
                      <Button
                        type="button"
                        variant="ghost"
                        onClick={() => fileInputRef.current?.click()}
                      >
                        + Ajouter
                      </Button>
                    </div>
                  )}
                </div>
                
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  multiple
                  className="hidden"
                  onChange={handleFileChange}
                />
                
                <p className="text-xs text-muted-foreground mt-1">
                  La première image sera utilisée comme image principale
                </p>
              </div>
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="name" className="text-right">
                Nom
              </label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="col-span-3"
              />
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="description" className="text-right">
                Description
              </label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                className="col-span-3"
              />
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="price" className="text-right">
                Prix (€)
              </label>
              <Input
                id="price"
                name="price"
                type="number"
                step="0.01"
                value={formData.price}
                onChange={handleChange}
                className="col-span-3"
              />
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="stock" className="text-right">
                Quantité en stock
              </label>
              <Input
                id="stock"
                name="stock"
                type="number"
                min="0"
                value={formData.stock}
                onChange={handleChange}
                className="col-span-3"
              />
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="category" className="text-right">
                Catégorie
              </label>
              <Select 
                value={formData.category} 
                onValueChange={(value) => handleSelectChange('category', value)}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Sélectionnez une catégorie" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Perruques">Perruques</SelectItem>
                  <SelectItem value="Tissages">Tissages</SelectItem>
                  <SelectItem value="Queue de cheval">Queue de cheval</SelectItem>
                  <SelectItem value="Peigne chauffance">Peigne chauffance</SelectItem>
                  <SelectItem value="Colle - dissolvant">Colle - dissolvant</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="isSold" className="text-right">
                En stock
              </label>
              <div className="col-span-3">
                <Switch 
                  checked={formData.isSold} 
                  onCheckedChange={handleSwitchChange} 
                />
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Annuler
            </Button>
            <Button onClick={handleSave} className="bg-red-800 hover:bg-red-700">
              {currentProduct ? 'Enregistrer' : 'Ajouter'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Confirmer la suppression</DialogTitle>
            <DialogDescription>
              Êtes-vous sûr de vouloir supprimer ce produit? Cette action est irréversible.
            </DialogDescription>
          </DialogHeader>
          
          <div className="flex justify-end space-x-2 py-4">
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Annuler
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              Supprimer
            </Button>
          </div>
        </DialogContent>
      </Dialog>
      
      {/* Promotion Dialog */}
      <Dialog open={isPromotionDialogOpen} onOpenChange={setIsPromotionDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Appliquer une promotion</DialogTitle>
            <DialogDescription>
              Définissez le pourcentage de réduction et la durée de la promotion.
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
                value={promotionData.promotion}
                onChange={(e) => setPromotionData({...promotionData, promotion: parseInt(e.target.value) || 0})}
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
                value={promotionData.hours}
                onChange={(e) => setPromotionData({...promotionData, hours: parseInt(e.target.value) || 24})}
                className="col-span-3"
              />
            </div>
            
            {currentProduct && promotionData.promotion > 0 && (
              <div className="bg-gray-50 p-3 rounded">
                <p className="text-sm text-muted-foreground">Prix actuel: <span className="font-medium">{currentProduct.price.toFixed(2)} €</span></p>
                <p className="text-sm text-muted-foreground">Nouveau prix: <span className="font-medium">{(currentProduct.price * (1 - promotionData.promotion/100)).toFixed(2)} €</span></p>
                <p className="text-sm text-muted-foreground mt-1">La promotion expirera dans {promotionData.hours} heures.</p>
              </div>
            )}
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsPromotionDialogOpen(false)}>
              Annuler
            </Button>
            <Button onClick={handleApplyPromotion} className="bg-red-800 hover:bg-red-700">
              Appliquer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
};

export default AdminProductsPage;
