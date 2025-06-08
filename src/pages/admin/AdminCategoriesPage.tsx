import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import PageDataLoader from '@/components/layout/PageDataLoader';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Plus, Edit, Trash2, ArrowUp, ArrowDown, Package, TrendingUp, Star, BarChart3 } from 'lucide-react';
import { categoriesAPI } from '@/services/categoriesAPI';
import { Category, CategoryFormData } from '@/types/category';
import { toast } from '@/hooks/use-toast';
import AdminLayout from './AdminLayout';

const AdminCategoriesPage: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [formData, setFormData] = useState<CategoryFormData>({
    name: '',
    description: '',
    order: 1,
    isActive: true
  });

  const loadCategories = async () => {
    try {
      setLoading(true);
      const response = await categoriesAPI.getAll();
      setCategories(response.data || []);
    } catch (error) {
      console.error('Erreur lors du chargement des catégories:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les catégories",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCategories();
  }, []);

  const handleOpenDialog = (category?: Category) => {
    if (category) {
      setEditingCategory(category);
      setFormData({
        name: category.name,
        description: category.description,
        order: category.order,
        isActive: category.isActive
      });
    } else {
      setEditingCategory(null);
      const maxOrder = Math.max(...categories.map(c => c.order), 0);
      setFormData({
        name: '',
        description: '',
        order: maxOrder + 1,
        isActive: true
      });
    }
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setEditingCategory(null);
    setFormData({
      name: '',
      description: '',
      order: 1,
      isActive: true
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      toast({
        title: "Erreur",
        description: "Le nom de la catégorie est requis",
        variant: "destructive",
      });
      return;
    }

    try {
      if (editingCategory) {
        await categoriesAPI.update(editingCategory.id, formData);
        toast({
          title: "Succès",
          description: "Catégorie mise à jour avec succès",
        });
      } else {
        await categoriesAPI.create(formData);
        toast({
          title: "Succès", 
          description: "Catégorie créée avec succès",
        });
      }
      
      handleCloseDialog();
      loadCategories();
    } catch (error: any) {
      console.error('Erreur lors de la sauvegarde:', error);
      toast({
        title: "Erreur",
        description: error.response?.data?.error || "Erreur lors de la sauvegarde",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (categoryId: string) => {
    try {
      await categoriesAPI.delete(categoryId);
      toast({
        title: "Succès",
        description: "Catégorie supprimée avec succès",
      });
      loadCategories();
    } catch (error: any) {
      console.error('Erreur lors de la suppression:', error);
      toast({
        title: "Erreur",
        description: error.response?.data?.error || "Erreur lors de la suppression",
        variant: "destructive",
      });
    }
  };

  const handleChangeOrder = async (categoryId: string, newOrder: number) => {
    try {
      await categoriesAPI.update(categoryId, { order: newOrder });
      loadCategories();
    } catch (error) {
      console.error('Erreur lors du changement d\'ordre:', error);
      toast({
        title: "Erreur",
        description: "Erreur lors du changement d'ordre",
        variant: "destructive",
      });
    }
  };

  if (loading) {
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

        {/* <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50">
          <div className="text-center space-y-6">
            <div className="relative">
              <div className="animate-spin rounded-full h-20 w-20 border-4 border-blue-500 border-t-transparent mx-auto"></div>
              <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-blue-400 to-purple-500 opacity-20 animate-pulse"></div>
            </div>
            <div className="space-y-2">
              <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Chargement des catégories
              </h2>
              <p className="text-gray-600">Veuillez patienter...</p>
            </div>
          </div>
        </div> */}
      </AdminLayout>
    );
  }

  const activeCategories = categories.filter(c => c.isActive).length;
  const inactiveCategories = categories.filter(c => !c.isActive).length;

  return (
    <AdminLayout>
      <div className="space-y-8 p-6">
        {/* Enhanced Header Section */}
        <div className="bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700 rounded-3xl p-8 text-white shadow-2xl relative overflow-hidden">
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
                    <h1 className="text-4xl font-bold mb-2">Gestion des Catégories</h1>
                    <p className="text-blue-100 text-lg">Gérez les catégories de produits du site</p>
                  </div>
                </div>
              </div>
              
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button 
                    onClick={() => handleOpenDialog()} 
                    size="lg"
                    className="bg-white text-blue-600 hover:bg-blue-50 border-0 shadow-xl font-semibold px-8 py-3 rounded-xl transition-all duration-300 hover:scale-105"
                  >
                    <Plus className="h-5 w-5 mr-2" />
                    Ajouter une catégorie
                  </Button>
                </DialogTrigger>
                
                <DialogContent className="sm:max-w-[500px] border-0 shadow-2xl">
                  <form onSubmit={handleSubmit}>
                    <DialogHeader className="space-y-4">
                      <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                        {editingCategory ? 'Modifier la catégorie' : 'Ajouter une catégorie'}
                      </DialogTitle>
                      <DialogDescription className="text-gray-600">
                        {editingCategory 
                          ? 'Modifiez les informations de la catégorie'
                          : 'Ajoutez une nouvelle catégorie de produits'
                        }
                      </DialogDescription>
                    </DialogHeader>
                    
                    <div className="grid gap-6 py-6">
                      <div className="grid gap-3">
                        <Label htmlFor="name" className="text-gray-700 font-medium">Nom *</Label>
                        <Input
                          id="name"
                          value={formData.name}
                          onChange={(e) => setFormData({...formData, name: e.target.value})}
                          placeholder="Ex: perruques"
                          required
                          className="border-2 border-gray-200 focus:border-blue-500 transition-colors"
                        />
                      </div>
                      
                      <div className="grid gap-3">
                        <Label htmlFor="description" className="text-gray-700 font-medium">Description</Label>
                        <Textarea
                          id="description"
                          value={formData.description}
                          onChange={(e) => setFormData({...formData, description: e.target.value})}
                          placeholder="Description de la catégorie"
                          className="border-2 border-gray-200 focus:border-blue-500 transition-colors"
                        />
                      </div>
                      
                      <div className="grid gap-3">
                        <Label htmlFor="order" className="text-gray-700 font-medium">Ordre d'affichage</Label>
                        <Input
                          id="order"
                          type="number"
                          min="1"
                          value={formData.order}
                          onChange={(e) => setFormData({...formData, order: parseInt(e.target.value) || 1})}
                          className="border-2 border-gray-200 focus:border-blue-500 transition-colors"
                        />
                      </div>
                      
                      <div className="flex items-center space-x-3 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl">
                        <Switch
                          id="isActive"
                          checked={formData.isActive}
                          onCheckedChange={(checked) => setFormData({...formData, isActive: checked})}
                        />
                        <Label htmlFor="isActive" className="text-gray-700 font-medium">Catégorie active</Label>
                      </div>
                    </div>
                    
                    <DialogFooter className="gap-3">
                      <Button 
                        type="button" 
                        variant="outline" 
                        onClick={handleCloseDialog}
                        className="border-gray-300 text-gray-700 hover:bg-gray-50"
                      >
                        Annuler
                      </Button>
                      <Button 
                        type="submit" 
                        className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 font-medium"
                      >
                        {editingCategory ? 'Modifier' : 'Ajouter'}
                      </Button>
                    </DialogFooter>
                  </form>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </div>

        {/* Enhanced Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="group hover:shadow-2xl transition-all duration-300 border-0 bg-gradient-to-br from-emerald-50 to-teal-100 hover:scale-105">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-emerald-600 text-sm font-medium">Total Catégories</p>
                  <p className="text-3xl font-bold text-emerald-800 mt-1">{categories.length}</p>
                </div>
                <div className="bg-gradient-to-br from-emerald-500 to-teal-600 p-3 rounded-2xl shadow-lg group-hover:shadow-xl transition-shadow">
                  <BarChart3 className="h-8 w-8 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="group hover:shadow-2xl transition-all duration-300 border-0 bg-gradient-to-br from-blue-50 to-indigo-100 hover:scale-105">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-600 text-sm font-medium">Catégories Actives</p>
                  <p className="text-3xl font-bold text-blue-800 mt-1">{activeCategories}</p>
                </div>
                <div className="bg-gradient-to-br from-blue-500 to-indigo-600 p-3 rounded-2xl shadow-lg group-hover:shadow-xl transition-shadow">
                  <TrendingUp className="h-8 w-8 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="group hover:shadow-2xl transition-all duration-300 border-0 bg-gradient-to-br from-orange-50 to-red-100 hover:scale-105">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-orange-600 text-sm font-medium">Catégories Inactives</p>
                  <p className="text-3xl font-bold text-orange-800 mt-1">{inactiveCategories}</p>
                </div>
                <div className="bg-gradient-to-br from-orange-500 to-red-600 p-3 rounded-2xl shadow-lg group-hover:shadow-xl transition-shadow">
                  <Star className="h-8 w-8 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Enhanced Categories Table */}
        <Card className="border-0 shadow-2xl bg-white">
          <CardHeader className="bg-gradient-to-r from-gray-50 to-white border-b border-gray-200">
            <CardTitle className="text-2xl text-gray-800">Liste des catégories</CardTitle>
            <CardDescription className="text-gray-600">
              {categories.length} catégorie(s) au total
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gradient-to-r from-gray-50 to-gray-100">
                    <TableHead className="font-bold text-gray-700">Ordre</TableHead>
                    <TableHead className="font-bold text-gray-700">Nom</TableHead>
                    <TableHead className="font-bold text-gray-700">Description</TableHead>
                    <TableHead className="font-bold text-gray-700">Statut</TableHead>
                    <TableHead className="font-bold text-gray-700">Date de création</TableHead>
                    <TableHead className="text-right font-bold text-gray-700">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {categories.map((category) => (
                    <TableRow key={category.id} className="hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 transition-all duration-200">
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <span className="font-medium text-gray-900">{category.order}</span>
                          <div className="flex flex-col">
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-6 w-6 p-0 hover:bg-blue-100 transition-colors"
                              onClick={() => handleChangeOrder(category.id, category.order - 1)}
                              disabled={category.order <= 1}
                            >
                              <ArrowUp className="h-3 w-3 text-blue-600" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-6 w-6 p-0 hover:bg-blue-100 transition-colors"
                              onClick={() => handleChangeOrder(category.id, category.order + 1)}
                              disabled={category.order >= categories.length}
                            >
                              <ArrowDown className="h-3 w-3 text-blue-600" />
                            </Button>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="font-medium text-gray-900">{category.name}</TableCell>
                      <TableCell className="text-gray-700">{category.description}</TableCell>
                      <TableCell>
                        <Badge 
                          variant={category.isActive ? "default" : "secondary"}
                          className={category.isActive ? 
                            "bg-gradient-to-r from-green-500 to-emerald-600 text-white" : 
                            "bg-gray-200 text-gray-700"
                          }
                        >
                          {category.isActive ? "Active" : "Inactive"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-gray-600">
                        {new Date(category.createdAt).toLocaleDateString('fr-FR')}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end space-x-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleOpenDialog(category)}
                            className="text-blue-600 hover:bg-blue-50 hover:text-blue-700 transition-colors"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                className="text-red-600 hover:bg-red-50 hover:text-red-700 transition-colors"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent className="border-0 shadow-2xl">
                              <AlertDialogHeader>
                                <AlertDialogTitle className="text-xl font-bold text-gray-900">
                                  Supprimer la catégorie
                                </AlertDialogTitle>
                                <AlertDialogDescription className="text-gray-600">
                                  Êtes-vous sûr de vouloir supprimer la catégorie "{category.name}" ? 
                                  Cette action est irréversible.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel className="border-gray-300 text-gray-700 hover:bg-gray-50">
                                  Annuler
                                </AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => handleDelete(category.id)}
                                  className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800"
                                >
                                  Supprimer
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default AdminCategoriesPage;
