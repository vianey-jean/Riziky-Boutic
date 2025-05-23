
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
import { AlertCircle, Edit, Loader2, Plus, Trash2 } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';

// Schéma de validation pour le formulaire
const pubLayoutSchema = z.object({
  icon: z.string().min(1, 'Veuillez sélectionner une icône'),
  text: z.string().min(5, 'Le texte doit contenir au moins 5 caractères').max(100, 'Le texte ne doit pas dépasser 100 caractères')
});

// Utiliser le type inféré à partir du schéma zod pour garantir la cohérence des types
type PubLayoutFormValues = z.infer<typeof pubLayoutSchema>;

const AdminPubLayoutPage: React.FC = () => {
  const queryClient = useQueryClient();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingPub, setEditingPub] = useState<PubLayout | null>(null);
  
  // Récupérer les données des publicités avec intervalle de rafraîchissement
  const { data: pubLayoutItems = [], isLoading, error } = useQuery({
    queryKey: ['pub-layout'],
    queryFn: pubLayoutAPI.getAll,
    refetchInterval: 30 * 1000, // Rafraîchir toutes les 30 secondes
    refetchOnWindowFocus: true  // Rafraîchir quand la fenêtre reprend le focus
  });

  // Formulaire pour ajouter/modifier une publicité
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

  // Mutation pour mettre à jour une publicité
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

  // Mutation pour supprimer une publicité
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

  // Gestionnaire pour soumettre le formulaire
  const onSubmit = (values: PubLayoutFormValues) => {
    // Cast to PubLayoutInput to ensure type consistency
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

  // Gestionnaire pour modifier une publicité
  const handleEdit = (pub: PubLayout) => {
    setEditingPub(pub);
    form.reset({
      icon: pub.icon,
      text: pub.text
    });
  };

  // Gestionnaire pour supprimer une publicité
  const handleDelete = (id: string) => {
    if (pubLayoutItems.length <= 2) {
      toast.error('Il faut conserver au moins 2 publicités');
      return;
    }
    
    if (confirm('Êtes-vous sûr de vouloir supprimer cette publicité ?')) {
      deleteMutation.mutate(id);
    }
  };

  // Gestionnaire pour ouvrir le formulaire d'ajout
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

  // Gestionnaire pour annuler l'édition
  const handleCancel = () => {
    setEditingPub(null);
    setIsAddDialogOpen(false);
    form.reset();
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Gestion des Publicités</h1>
            <p className="text-muted-foreground">
              Gérez les annonces promotionnelles qui s'affichent dans la barre rotative en haut du site
            </p>
          </div>
          <Button onClick={handleAdd} disabled={pubLayoutItems.length >= 6}>
            <Plus className="mr-2 h-4 w-4" /> Ajouter une publicité
          </Button>
        </div>

        {/* Informations sur les limites */}
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Limites</AlertTitle>
          <AlertDescription>
            Vous devez avoir au minimum 2 publicités et vous pouvez en ajouter jusqu'à 6 maximum.
          </AlertDescription>
        </Alert>

        {isLoading ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <Card key={i}>
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
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Erreur</AlertTitle>
            <AlertDescription>
              Une erreur est survenue lors du chargement des publicités. Veuillez réessayer plus tard.
            </AlertDescription>
          </Alert>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {pubLayoutItems.map((pub) => (
              <Card key={pub.id}>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <DynamicIcon name={pub.icon} className="mr-2 h-5 w-5" />
                    {pub.icon}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p>{pub.text}</p>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button variant="outline" onClick={() => handleEdit(pub)}>
                    <Edit className="mr-2 h-4 w-4" /> Modifier
                  </Button>
                  <Button variant="destructive" onClick={() => handleDelete(pub.id)}>
                    <Trash2 className="mr-2 h-4 w-4" /> Supprimer
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}

        {/* Dialogue pour ajouter/modifier une publicité */}
        <Dialog open={isAddDialogOpen || !!editingPub} onOpenChange={(open) => {
          if (!open) handleCancel();
          else if (!editingPub) setIsAddDialogOpen(open);
        }}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingPub ? 'Modifier une publicité' : 'Ajouter une nouvelle publicité'}</DialogTitle>
              <DialogDescription>
                {editingPub ? 'Modifiez les détails de la publicité existante.' : 'Remplissez le formulaire pour ajouter une nouvelle publicité.'}
              </DialogDescription>
            </DialogHeader>

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="icon"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Icône</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Sélectionnez une icône" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
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
                      <FormLabel>Texte de la publicité</FormLabel>
                      <FormControl>
                        <Input placeholder="Ex: Livraison gratuite à partir de 50€ d'achat" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex justify-end gap-2">
                  <Button type="button" variant="outline" onClick={handleCancel}>
                    Annuler
                  </Button>
                  <Button type="submit" disabled={addMutation.isPending || updateMutation.isPending}>
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
