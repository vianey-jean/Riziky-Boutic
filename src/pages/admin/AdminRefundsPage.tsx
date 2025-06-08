import React, { useState } from 'react';
import AdminLayout from './AdminLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Eye, MessageSquare, CheckCircle, XCircle, Search, Clock, CreditCard, TrendingUp, DollarSign, Users } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { remboursementsAPI, Remboursement } from '@/services/api';
import { toast } from '@/components/ui/sonner';
import PageDataLoader from '@/components/layout/PageDataLoader';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

const AdminRefundsPage = () => {
  const queryClient = useQueryClient();
  const AUTH_BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const [selectedRefund, setSelectedRefund] = useState<Remboursement | null>(null);
  const [statusComment, setStatusComment] = useState('');
  const [newStatus, setNewStatus] = useState('');
  const [decision, setDecision] = useState('');

  const { data: refunds = [], isLoading } = useQuery({
    queryKey: ['admin-refunds'],
    queryFn: async () => {
      const response = await remboursementsAPI.getAll();
      return response.data;
    }
  });

  const updateStatusMutation = useMutation({
    mutationFn: async ({ id, status, comment, decision }: { 
      id: string, 
      status: string, 
      comment?: string, 
      decision?: string 
    }) => {
      await remboursementsAPI.updateStatus(id, status, comment, decision);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-refunds'] });
      toast.success('Statut mis à jour avec succès');
      setStatusComment('');
      setNewStatus('');
      setDecision('');
    },
    onError: () => {
      toast.error('Erreur lors de la mise à jour du statut');
    }
  });

  const formatDate = (dateString: string) => {
    return format(new Date(dateString), 'dd MMMM yyyy à HH:mm', { locale: fr });
  };

  const getImageUrl = (imagePath: string) => {
    if (!imagePath) return '';
    if (imagePath.startsWith('http')) return imagePath;
    return `${AUTH_BASE_URL}${imagePath}`;
  };

  const getStatusBadge = (status: string, decision?: string) => {
    if (status === 'traité') {
      if (decision === 'accepté') {
        return <Badge className="bg-green-500 text-white">Accepté</Badge>;
      } else if (decision === 'refusé') {
        return <Badge className="bg-red-500 text-white">Refusé</Badge>;
      }
    }
    
    switch (status) {
      case 'vérification':
        return <Badge className="bg-blue-500 text-white">En vérification</Badge>;
      case 'en étude':
        return <Badge className="bg-yellow-500 text-white">En étude</Badge>;
      case 'traité':
        return <Badge className="bg-green-500 text-white">Traité</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'vérification':
        return <Search className="h-4 w-4" />;
      case 'en étude':
        return <Clock className="h-4 w-4" />;
      case 'traité':
        return <CheckCircle className="h-4 w-4" />;
      default:
        return <Search className="h-4 w-4" />;
    }
  };

  const handleStatusUpdate = (refundId: string, status: string) => {
    if (status === 'traité' && (!statusComment || !decision)) {
      toast.error('Commentaire et décision requis pour le statut traité');
      return;
    }

    updateStatusMutation.mutate({
      id: refundId,
      status,
      comment: statusComment || undefined,
      decision: status === 'traité' ? decision : undefined
    });
  };

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
                      
        {/* <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50">
          <div className="text-center space-y-6">
            <div className="relative">
              <div className="animate-spin rounded-full h-20 w-20 border-4 border-blue-500 border-t-transparent mx-auto"></div>
              <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-blue-400 to-purple-500 opacity-20 animate-pulse"></div>
            </div>
            <div className="space-y-2">
              <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Chargement des remboursements
              </h2>
              <p className="text-gray-600">Veuillez patienter...</p>
            </div>
          </div>
        </div> */}
      </AdminLayout>
    );
  }

  const pendingRefunds = refunds.filter((r: Remboursement) => r.status !== 'traité').length;
  const acceptedRefunds = refunds.filter((r: Remboursement) => r.status === 'traité' && r.decision === 'accepté').length;
  const rejectedRefunds = refunds.filter((r: Remboursement) => r.status === 'traité' && r.decision === 'refusé').length;

  return (
    <AdminLayout>
      <div className="space-y-8 p-6">
        {/* Enhanced Header Section */}
        <div className="bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-700 rounded-3xl p-8 text-white shadow-2xl relative overflow-hidden">
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-32 translate-x-32"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-24 -translate-x-24"></div>
          
          <div className="relative z-10">
            <div className="flex items-center space-x-6">
              <div className="bg-white/20 backdrop-blur-sm p-4 rounded-2xl">
                <CreditCard className="h-12 w-12 text-white" />
              </div>
              <div>
                <h1 className="text-4xl font-bold mb-2">Gestion des Remboursements</h1>
                <p className="text-purple-100 text-lg">
                  Gérez et traitez toutes les demandes de remboursement clients
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="group hover:shadow-2xl transition-all duration-300 border-0 bg-gradient-to-br from-yellow-50 to-orange-100 hover:scale-105">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-yellow-600 text-sm font-medium">En Attente</p>
                  <p className="text-3xl font-bold text-yellow-800 mt-1">{pendingRefunds}</p>
                </div>
                <div className="bg-gradient-to-br from-yellow-500 to-orange-600 p-3 rounded-2xl shadow-lg group-hover:shadow-xl transition-shadow">
                  <Clock className="h-8 w-8 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="group hover:shadow-2xl transition-all duration-300 border-0 bg-gradient-to-br from-green-50 to-emerald-100 hover:scale-105">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-600 text-sm font-medium">Acceptés</p>
                  <p className="text-3xl font-bold text-green-800 mt-1">{acceptedRefunds}</p>
                </div>
                <div className="bg-gradient-to-br from-green-500 to-emerald-600 p-3 rounded-2xl shadow-lg group-hover:shadow-xl transition-shadow">
                  <CheckCircle className="h-8 w-8 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="group hover:shadow-2xl transition-all duration-300 border-0 bg-gradient-to-br from-red-50 to-pink-100 hover:scale-105">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-red-600 text-sm font-medium">Refusés</p>
                  <p className="text-3xl font-bold text-red-800 mt-1">{rejectedRefunds}</p>
                </div>
                <div className="bg-gradient-to-br from-red-500 to-pink-600 p-3 rounded-2xl shadow-lg group-hover:shadow-xl transition-shadow">
                  <XCircle className="h-8 w-8 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="group hover:shadow-2xl transition-all duration-300 border-0 bg-gradient-to-br from-blue-50 to-indigo-100 hover:scale-105">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-600 text-sm font-medium">Total</p>
                  <p className="text-3xl font-bold text-blue-800 mt-1">{refunds.length}</p>
                </div>
                <div className="bg-gradient-to-br from-blue-500 to-indigo-600 p-3 rounded-2xl shadow-lg group-hover:shadow-xl transition-shadow">
                  <TrendingUp className="h-8 w-8 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Enhanced Refunds List */}
        {refunds.length === 0 ? (
          <Card className="border-0 shadow-2xl bg-white">
            <CardContent className="text-center py-16">
              <div className="bg-gradient-to-br from-gray-100 to-gray-200 p-8 rounded-3xl w-fit mx-auto mb-6">
                <CreditCard className="h-20 w-20 text-gray-400 mx-auto" />
              </div>
              <h3 className="text-3xl font-bold text-gray-800 mb-4">Aucune demande de remboursement</h3>
              <p className="text-gray-600 text-lg">
                Il n'y a actuellement aucune demande de remboursement à traiter.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6">
            {refunds.map((refund: Remboursement) => (
              <Card key={refund.id} className="group border-0 shadow-xl bg-gradient-to-r from-white to-gray-50 hover:shadow-2xl transition-all duration-300 hover:scale-[1.02]">
                <CardHeader className="bg-gradient-to-r from-gray-50 to-white border-b border-gray-200">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-3 sm:space-y-0">
                    <div>
                      <CardTitle className="text-xl font-bold text-gray-900">
                        Remboursement #{refund.id.split('-')[1]}
                      </CardTitle>
                      <div className="space-y-1 mt-2">
                        <p className="text-sm text-gray-600">
                          <span className="font-medium">Client:</span> {refund.userName} ({refund.userEmail})
                        </p>
                        <p className="text-sm text-gray-600">
                          <span className="font-medium">Date:</span> {formatDate(refund.createdAt)}
                        </p>
                        <p className="text-sm text-gray-600">
                          <span className="font-medium">Commande:</span> #{refund.orderId.split('-')[1]}
                        </p>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      {getStatusBadge(refund.status, refund.decision)}
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Détails de la demande */}
                    <div className="space-y-4">
                      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-xl border border-blue-100">
                        <h3 className="text-sm font-bold text-blue-800 mb-2">Détails de la demande</h3>
                        <div className="space-y-2 text-sm">
                          <div>
                            <span className="font-medium text-gray-700">Raison:</span> 
                            <span className="text-gray-900 ml-1">{refund.reason}</span>
                          </div>
                          {(refund.customReason || refund.reasonDetails) && (
                            <div>
                              <span className="font-medium text-gray-700">Détails:</span> 
                              <span className="text-gray-900 ml-1">{refund.customReason || refund.reasonDetails}</span>
                            </div>
                          )}
                        </div>
                      </div>

                      {(refund.photo || (refund.photos && refund.photos.length > 0)) && (
                        <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-4 rounded-xl border border-green-100">
                          <h4 className="text-sm font-bold text-green-800 mb-3">Photos jointes</h4>
                          <div className="grid grid-cols-3 gap-2">
                            {refund.photo && (
                              <img
                                src={getImageUrl(refund.photo)}
                                alt="Photo justificative"
                                className="w-full h-16 object-cover rounded-lg border border-green-200 cursor-pointer hover:opacity-80 transition-opacity shadow-lg"
                                onClick={() => window.open(getImageUrl(refund.photo!), '_blank')}
                              />
                            )}
                            {refund.photos?.map((photo, index) => (
                              <img
                                key={index}
                                src={getImageUrl(photo)}
                                alt={`Photo ${index + 1}`}
                                className="w-full h-16 object-cover rounded-lg border border-green-200 cursor-pointer hover:opacity-80 transition-opacity shadow-lg"
                                onClick={() => window.open(getImageUrl(photo), '_blank')}
                              />
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Informations commande */}
                    <div className="space-y-4">
                      <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-4 rounded-xl border border-purple-100">
                        <h3 className="text-sm font-bold text-purple-800 mb-2">Commande concernée</h3>
                        <div className="space-y-2">
                          <p className="text-sm">
                            <span className="font-medium text-gray-700">ID:</span> 
                            <span className="text-gray-900 ml-1">#{refund.orderId.split('-')[1]}</span>
                          </p>
                          <p className="text-xs text-gray-500">
                            Voir les détails dans la section commandes
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Commentaires */}
                  {((refund.adminComments && refund.adminComments.length > 0) || (refund.comments && refund.comments.length > 0)) && (
                    <div className="mt-6 bg-gradient-to-r from-gray-50 to-white p-4 rounded-xl border border-gray-200">
                      <h3 className="text-sm font-bold text-gray-800 mb-3">Commentaires</h3>
                      <div className="space-y-2">
                        {(refund.adminComments || refund.comments || []).map((comment) => (
                          <div key={comment.id} className="bg-white p-3 rounded-lg shadow-sm border border-gray-100">
                            <div className="flex justify-between items-start mb-1">
                              <span className="font-medium text-gray-700 text-sm">{comment.adminName}</span>
                              <span className="text-xs text-gray-500">
                                {formatDate(comment.createdAt)}
                              </span>
                            </div>
                            <p className="text-sm text-gray-600">{comment.comment || comment.content}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="mt-6 flex flex-wrap gap-3">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button 
                          variant="outline" 
                          size="sm"
                          className="border-blue-200 text-blue-600 hover:bg-blue-50 transition-colors"
                        >
                          <Eye className="h-4 w-4 mr-2" />
                          Voir détails
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto border-0 shadow-2xl">
                        <DialogHeader>
                          <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                            Détails du remboursement #{refund.id.split('-')[1]}
                          </DialogTitle>
                        </DialogHeader>
                        <div className="space-y-6">
                          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-2xl">
                            <h4 className="font-bold text-blue-800 mb-4">Informations client</h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                              <p><span className="font-medium">Nom:</span> {refund.userName}</p>
                              <p><span className="font-medium">Email:</span> {refund.userEmail}</p>
                              <p><span className="font-medium">Commande:</span> #{refund.orderId.split('-')[1]}</p>
                              <p><span className="font-medium">Date:</span> {formatDate(refund.createdAt)}</p>
                            </div>
                          </div>
                          <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-6 rounded-2xl">
                            <h4 className="font-bold text-green-800 mb-4">Raison du remboursement</h4>
                            <p className="text-sm text-gray-700">{refund.reason}</p>
                            {(refund.customReason || refund.reasonDetails) && (
                              <p className="text-sm text-gray-600 mt-2 italic">"{refund.customReason || refund.reasonDetails}"</p>
                            )}
                          </div>
                          {(refund.photo || (refund.photos && refund.photos.length > 0)) && (
                            <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-6 rounded-2xl">
                              <h4 className="font-bold text-purple-800 mb-4">Photos justificatives</h4>
                              <div className="grid grid-cols-2 gap-4">
                                {refund.photo && (
                                  <img
                                    src={getImageUrl(refund.photo)}
                                    alt="Photo justificative"
                                    className="w-full h-32 object-cover rounded-xl border-2 border-purple-200 cursor-pointer shadow-lg hover:shadow-xl transition-shadow"
                                    onClick={() => window.open(getImageUrl(refund.photo!), '_blank')}
                                  />
                                )}
                                {refund.photos?.map((photo, index) => (
                                  <img
                                    key={index}
                                    src={getImageUrl(photo)}
                                    alt={`Photo ${index + 1}`}
                                    className="w-full h-32 object-cover rounded-xl border-2 border-purple-200 cursor-pointer shadow-lg hover:shadow-xl transition-shadow"
                                    onClick={() => window.open(getImageUrl(photo), '_blank')}
                                  />
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </DialogContent>
                    </Dialog>

                    {refund.status !== 'traité' && (
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button 
                            size="sm"
                            onClick={() => setSelectedRefund(refund)}
                            className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-medium"
                          >
                            <MessageSquare className="h-4 w-4 mr-2" />
                            Changer statut
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-lg border-0 shadow-2xl">
                          <DialogHeader>
                            <DialogTitle className="text-xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                              Changer le statut
                            </DialogTitle>
                          </DialogHeader>
                          <div className="space-y-6">
                            <div>
                              <Label className="text-gray-700 font-medium">Nouveau statut</Label>
                              <Select value={newStatus} onValueChange={setNewStatus}>
                                <SelectTrigger className="mt-2 border-2 border-gray-200 focus:border-purple-500 transition-colors">
                                  <SelectValue placeholder="Sélectionner un statut" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="vérification">Vérification</SelectItem>
                                  <SelectItem value="en étude">En étude</SelectItem>
                                  <SelectItem value="traité">Traité</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>

                            {newStatus === 'traité' && (
                              <div>
                                <Label className="text-gray-700 font-medium">Décision *</Label>
                                <Select value={decision} onValueChange={setDecision}>
                                  <SelectTrigger className="mt-2 border-2 border-gray-200 focus:border-purple-500 transition-colors">
                                    <SelectValue placeholder="Sélectionner une décision" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="accepté">Accepté</SelectItem>
                                    <SelectItem value="refusé">Refusé</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                            )}

                            <div>
                              <Label className="text-gray-700 font-medium">
                                Commentaire {newStatus === 'traité' ? '*' : '(optionnel)'}
                              </Label>
                              <Textarea
                                value={statusComment}
                                onChange={(e) => setStatusComment(e.target.value)}
                                placeholder="Ajouter un commentaire..."
                                rows={4}
                                className="mt-2 border-2 border-gray-200 focus:border-purple-500 transition-colors"
                              />
                            </div>

                            <div className="flex gap-3 pt-4">
                              <Button 
                                variant="outline" 
                                className="flex-1 border-gray-300 text-gray-700 hover:bg-gray-50"
                                onClick={() => {
                                  setStatusComment('');
                                  setNewStatus('');
                                  setDecision('');
                                }}
                              >
                                Annuler
                              </Button>
                              <Button
                                onClick={() => handleStatusUpdate(refund.id, newStatus)}
                                disabled={updateStatusMutation.isPending}
                                className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 font-medium"
                              >
                                {updateStatusMutation.isPending ? 'Mise à jour...' : 'Mettre à jour'}
                              </Button>
                            </div>
                          </div>
                        </DialogContent>
                      </Dialog>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminRefundsPage;
