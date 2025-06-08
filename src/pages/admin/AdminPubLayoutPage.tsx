
import React, { useState } from 'react';
import AdminLayout from './AdminLayout';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import pubLayoutAPI, { PubLayout, PubLayoutInput } from '@/services/pubLayoutAPI';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import { DynamicIcon, availableIcons } from '@/utils/iconLoader';
import { AlertCircle, Edit, Loader2, Plus, Trash2, Sparkles, Star, TrendingUp } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';

// Schéma de validation pour le formulaire
const pubLayoutSchema = z.object({
  icon: z.string().min(1, 'Veuillez sélectionner une icône'),
  text: z.string().min(5, 'Le texte doit contenir au moins 5 caractères').max(100, 'Le texte ne doit pas dépasser 100 caractères')
});

type PubLayoutFormValues = z.infer<typeof pubLayoutSchema>;

const AdminPubLayoutPage: React.FC = () => {
  const queryClient = useQueryClient();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingPub, setEditingPub] = useState<PubLayout | null>(null);
  
  const { data: pubLayoutItems = [], isLoading, error } = useQuery({
    queryKey: ['pub-layout'],
    queryFn: pubLayoutAPI.getAll,
    refetchInterval: 30 * 1000,
    refetchOnWindowFocus: true
  });

  const form = useForm<PubLayoutFormValues>({
    resolver: zodResolver(pubLayoutSchema),
    defaultValues: {
      icon: '',
      text: ''
    }
  });

  // Mutation pour ajouter une publicité
  const addMutation = useMutation({
    mutationFn: (data: PubLayoutInput) => pubLayoutAPI.add(data),
    onSuccess: () => {
      toast.success('Publicité ajoutée avec succès');
      queryClient.invalidateQueries({ queryKey: ['pub-layout'] });
      setIsAddDialogOpen(false);
      form.reset();
    },
    onError: (error: any) => {
      const errorMessage = error.response?.data?.message || 'Erreur lors de l\'ajout de la publicité';
      toast.error(errorMessage);
    }
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string, data: PubLayoutInput }) => 
      pubLayoutAPI.update(id, data),
    onSuccess: () => {
      toast.success('Publicité mise à jour avec succès');
      queryClient.invalidateQueries({ queryKey: ['pub-layout'] });
      setEditingPub(null);
      form.reset();
    },
    onError: (error: any) => {
      const errorMessage = error.response?.data?.message || 'Erreur lors de la mise à jour de la publicité';
      toast.error(errorMessage);
    }
  });

  const deleteMutation = useMutation({
    mutationFn: pubLayoutAPI.delete,
    onSuccess: () => {
      toast.success('Publicité supprimée avec succès');
      queryClient.invalidateQueries({ queryKey: ['pub-layout'] });
    },
    onError: (error: any) => {
      const errorMessage = error.response?.data?.message || 'Erreur lors de la suppression de la publicité';
      toast.error(errorMessage);
    }
  });

  const onSubmit = (values: PubLayoutFormValues) => {
    const pubLayoutData: PubLayoutInput = {
      icon: values.icon,
      text: values.text
    };
    
    if (editingPub) {
      updateMutation.mutate({ id: editingPub.id, data: pubLayoutData });
    } else {
      addMutation.mutate(pubLayoutData);
    }
  };

  const handleEdit = (pub: PubLayout) => {
    setEditingPub(pub);
    form.reset({
      icon: pub.icon,
      text: pub.text
    });
  };

  const handleDelete = (id: string) => {
    if (pubLayoutItems.length <= 2) {
      toast.error('Il faut conserver au moins 2 publicités');
      return;
    }
    
    if (confirm('Êtes-vous sûr de vouloir supprimer cette publicité ?')) {
      deleteMutation.mutate(id);
    }
  };

  const handleAdd = () => {
    if (pubLayoutItems.length >= 6) {
      toast.error('Le nombre maximum de publicités (6) est atteint');
      return;
    }
    
    form.reset({
      icon: '',
      text: ''
    });
    setEditingPub(null);
    setIsAddDialogOpen(true);
  };

  const handleCancel = () => {
    setEditingPub(null);
    setIsAddDialogOpen(false);
    form.reset();
  };

  return (
    <AdminLayout>
      <div className="space-y-8 p-6">
        {/* Enhanced Header Section */}
        <div className="bg-gradient-to-br from-purple-600 via-pink-600 to-red-600 rounded-3xl p-8 text-white shadow-2xl relative overflow-hidden">
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-32 translate-x-32"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-24 -translate-x-24"></div>
          
          <div className="relative z-10">
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between">
              <div className="space-y-4 mb-6 lg:mb-0">
                <div className="flex items-center space-x-4">
                  <div className="bg-white/20 backdrop-blur-sm p-4 rounded-2xl">
                    <Sparkles className="h-10 w-10 text-white" />
                  </div>
                  <div>
                    <h1 className="text-4xl font-bold mb-2">Gestion des Publicités</h1>
                    <p className="text-pink-100 text-lg">Gérez les annonces promotionnelles de la barre rotative</p>
                  </div>
                </div>
              </div>
              
              <Button 
                onClick={handleAdd} 
                disabled={pubLayoutItems.length >= 6}
                size="lg"
                className="bg-white text-purple-600 hover:bg-pink-50 border-0 shadow-xl font-semibold px-8 py-3 rounded-xl transition-all duration-300 hover:scale-105"
              >
                <Plus className="h-5 w-5 mr-2" />
                Ajouter une publicité
              </Button>
            </div>
          </div>
        </div>

        {/* Enhanced Stats Card */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="group hover:shadow-2xl transition-all duration-300 border-0 bg-gradient-to-br from-blue-50 to-indigo-100 hover:scale-105">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-600 text-sm font-medium">Publicités Actives</p>
                  <p className="text-3xl font-bold text-blue-800 mt-1">{pubLayoutItems.length}</p>
                </div>
                <div className="bg-gradient-to-br from-blue-500 to-indigo-600 p-3 rounded-2xl shadow-lg group-hover:shadow-xl transition-shadow">
                  <Star className="h-8 w-8 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="group hover:shadow-2xl transition-all duration-300 border-0 bg-gradient-to-br from-green-50 to-emerald-100 hover:scale-105">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-600 text-sm font-medium">Limite Maximum</p>
                  <p className="text-3xl font-bold text-green-800 mt-1">6</p>
                </div>
                <div className="bg-gradient-to-br from-green-500 to-emerald-600 p-3 rounded-2xl shadow-lg group-hover:shadow-xl transition-shadow">
                  <TrendingUp className="h-8 w-8 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="group hover:shadow-2xl transition-all duration-300 border-0 bg-gradient-to-br from-orange-50 to-red-100 hover:scale-105">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-orange-600 text-sm font-medium">Minimum Requis</p>
                  <p className="text-3xl font-bold text-orange-800 mt-1">2</p>
                </div>
                <div className="bg-gradient-to-br from-orange-500 to-red-600 p-3 rounded-2xl shadow-lg group-hover:shadow-xl transition-shadow">
                  <AlertCircle className="h-8 w-8 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Enhanced Info Alert */}
        <Alert className="border-0 bg-gradient-to-r from-amber-50 to-yellow-50 shadow-lg">
          <AlertCircle className="h-4 w-4 text-amber-600" />
          <AlertTitle className="text-amber-800 font-semibold">Informations importantes</AlertTitle>
          <AlertDescription className="text-amber-700">
            Vous devez avoir au minimum 2 publicités et vous pouvez en ajouter jusqu'à 6 maximum.
          </AlertDescription>
        </Alert>

        {isLoading ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="border-0 shadow-xl">
                <CardHeader>
                  <Skeleton className="h-5 w-20" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-4 w-full mb-2" />
                </CardContent>
                <CardFooter>
                  <Skeleton className="h-9 w-full" />
                </CardFooter>
              </Card>
            ))}
          </div>
        ) : error ? (
          <Alert variant="destructive" className="border-0 shadow-xl">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Erreur</AlertTitle>
            <AlertDescription>
              Une erreur est survenue lors du chargement des publicités. Veuillez réessayer plus tard.
            </AlertDescription>
          </Alert>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {pubLayoutItems.map((pub) => (
              <Card key={pub.id} className="group border-0 shadow-xl bg-gradient-to-br from-white to-gray-50 hover:shadow-2xl transition-all duration-300 hover:scale-105">
                <CardHeader className="bg-gradient-to-r from-gray-50 to-white border-b border-gray-100">
                  <CardTitle className="flex items-center text-gray-800">
                    <div className="bg-gradient-to-br from-purple-500 to-pink-600 p-2 rounded-xl mr-3 shadow-lg">
                      <DynamicIcon name={pub.icon} className="h-5 w-5 text-white" />
                    </div>
                    <span className="font-bold">{pub.icon}</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <p className="text-gray-700 leading-relaxed">{pub.text}</p>
                </CardContent>
                <CardFooter className="flex justify-between bg-gradient-to-r from-gray-50 to-white border-t border-gray-100 p-4">
                  <Button 
                    variant="outline" 
                    onClick={() => handleEdit(pub)}
                    className="border-blue-200 text-blue-600 hover:bg-blue-50 transition-colors font-medium"
                  >
                    <Edit className="mr-2 h-4 w-4" /> 
                    Modifier
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => handleDelete(pub.id)}
                    className="border-red-200 text-red-600 hover:bg-red-50 transition-colors font-medium"
                  >
                    <Trash2 className="mr-2 h-4 w-4" /> 
                    Supprimer
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}

        {/* Enhanced Dialog */}
        <Dialog open={isAddDialogOpen || !!editingPub} onOpenChange={(open) => {
          if (!open) handleCancel();
          else if (!editingPub) setIsAddDialogOpen(open);
        }}>
          <DialogContent className="max-w-lg border-0 shadow-2xl">
            <DialogHeader className="space-y-4">
              <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                {editingPub ? 'Modifier la publicité' : 'Ajouter une nouvelle publicité'}
              </DialogTitle>
              <DialogDescription className="text-gray-600">
                {editingPub ? 'Modifiez les détails de la publicité existante.' : 'Remplissez le formulaire pour ajouter une nouvelle publicité.'}
              </DialogDescription>
            </DialogHeader>

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="icon"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-700 font-medium">Icône</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger className="border-2 border-gray-200 focus:border-purple-500 transition-colors">
                            <SelectValue placeholder="Sélectionnez une icône" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="max-h-60">
                          {availableIcons.map((iconName) => (
                            <SelectItem key={iconName} value={iconName}>
                              <div className="flex items-center">
                                <DynamicIcon name={iconName} className="mr-2" />
                                {iconName}
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="text"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-700 font-medium">Texte de la publicité</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="Ex: Livraison gratuite à partir de 50€ d'achat" 
                          {...field} 
                          className="border-2 border-gray-200 focus:border-purple-500 transition-colors"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex justify-end gap-3 pt-4">
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={handleCancel}
                    className="px-6 py-2 border-gray-300 text-gray-700 hover:bg-gray-50"
                  >
                    Annuler
                  </Button>
                  <Button 
                    type="submit" 
                    disabled={addMutation.isPending || updateMutation.isPending}
                    className="px-6 py-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-medium"
                  >
                    {(addMutation.isPending || updateMutation.isPending) && (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    )}
                    {editingPub ? 'Mettre à jour' : 'Ajouter'}
                  </Button>
                </div>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
};

export default AdminPubLayoutPage;
