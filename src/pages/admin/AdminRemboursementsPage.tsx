import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
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
} from '@/components/ui/dialog';
import { toast } from '@/components/ui/sonner';
import PageDataLoader from '@/components/layout/PageDataLoader';
import { remboursementsAPI, ordersAPI, type Remboursement } from '@/services/api';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Eye, MessageCircle, Check, X, AlertTriangle, CreditCard, TrendingUp, Clock, DollarSign } from 'lucide-react';
import AdminLayout from './AdminLayout';

const AdminRemboursementsPage = () => {
  const queryClient = useQueryClient();
  const AUTH_BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const [selectedRemboursement, setSelectedRemboursement] = useState<Remboursement | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [statusUpdateData, setStatusUpdateData] = useState({
    status: '',
    comment: '',
    decision: ''
  });

  const { data: remboursements = [], isLoading } = useQuery({
    queryKey: ['admin-remboursements'],
    queryFn: async () => {
      const response = await remboursementsAPI.getAll();
      return response.data;
    }
  });

  const updateStatusMutation = useMutation({
    mutationFn: async ({ id, status, comment, decision }: { 
      id: string; 
      status: string; 
      comment?: string; 
      decision?: string; 
    }) => {
      return await remboursementsAPI.updateStatus(id, status, comment, decision);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-remboursements'] });
      toast.success('Statut mis à jour avec succès');
      setDialogOpen(false);
      setSelectedRemboursement(null);
      setStatusUpdateData({ status: '', comment: '', decision: '' });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Erreur lors de la mise à jour');
    }
  });

  const formatDate = (dateString: string) => {
    return format(new Date(dateString), 'dd MMMM yyyy à HH:mm', { locale: fr });
  };

  const getStatusBadgeClass = (status: string, decision?: string) => {
    switch (status) {
      case 'vérification':
        return 'bg-yellow-100 text-yellow-800';
      case 'en étude':
        return 'bg-blue-100 text-blue-800';
      case 'traité':
        return decision === 'accepté' ? 
          'bg-green-100 text-green-800' : 
          'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getImageUrl = (imagePath: string) => {
    if (!imagePath) return '';
    if (imagePath.startsWith('http')) return imagePath;
    return `${AUTH_BASE_URL}${imagePath}`;
  };

  const handleViewDetails = (remboursement: Remboursement) => {
    setSelectedRemboursement(remboursement);
    setStatusUpdateData({
      status: remboursement.status,
      comment: '',
      decision: remboursement.decision || ''
    });
    setDialogOpen(true);
  };

  const handleStatusUpdate = () => {
    if (!selectedRemboursement) return;

    if (!statusUpdateData.status) {
      toast.error('Veuillez sélectionner un statut');
      return;
    }

    if (statusUpdateData.status === 'traité' && !statusUpdateData.comment) {
      toast.error('Un commentaire est obligatoire pour le statut traité');
      return;
    }

    if (statusUpdateData.status === 'traité' && !statusUpdateData.decision) {
      toast.error('Veuillez choisir accepter ou refuser');
      return;
    }

    updateStatusMutation.mutate({
      id: selectedRemboursement.id,
      status: statusUpdateData.status,
      comment: statusUpdateData.comment || undefined,
      decision: statusUpdateData.decision || undefined
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

  const pendingRefunds = remboursements.filter((r: Remboursement) => r.status !== 'traité').length;
  const acceptedRefunds = remboursements.filter((r: Remboursement) => r.status === 'traité' && r.decision === 'accepté').length;
  const rejectedRefunds = remboursements.filter((r: Remboursement) => r.status === 'traité' && r.decision === 'refusé').length;

  return (
    <AdminLayout>
      <div className="space-y-8 p-6">
        {/* Enhanced Header Section */}
        <div className="bg-gradient-to-br from-red-600 via-pink-600 to-purple-700 rounded-3xl p-8 text-white shadow-2xl relative overflow-hidden">
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
                <p className="text-pink-100 text-lg">
                  Gérez les demandes de remboursement des clients ({remboursements.length})
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
                  <Check className="h-8 w-8 text-white" />
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
                  <X className="h-8 w-8 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="group hover:shadow-2xl transition-all duration-300 border-0 bg-gradient-to-br from-blue-50 to-indigo-100 hover:scale-105">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-600 text-sm font-medium">Total</p>
                  <p className="text-3xl font-bold text-blue-800 mt-1">{remboursements.length}</p>
                </div>
                <div className="bg-gradient-to-br from-blue-500 to-indigo-600 p-3 rounded-2xl shadow-lg group-hover:shadow-xl transition-shadow">
                  <TrendingUp className="h-8 w-8 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Enhanced Remboursements List */}
        {remboursements.length === 0 ? (
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
            {remboursements.map((remboursement: Remboursement) => (
              <Card key={remboursement.id} className="group border-0 shadow-xl bg-gradient-to-r from-white to-gray-50 hover:shadow-2xl transition-all duration-300 hover:scale-[1.02]">
                <CardHeader className="bg-gradient-to-r from-gray-50 to-white border-b border-gray-200 pb-4">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-3 sm:space-y-0">
                    <div>
                      <CardTitle className="text-xl font-bold text-gray-900">
                        Remboursement #{remboursement.id.split('-')[1]}
                      </CardTitle>
                      <div className="space-y-1 mt-2">
                        <p className="text-sm text-gray-600">
                          <span className="font-medium">Client:</span> {remboursement.userName} ({remboursement.userEmail})
                        </p>
                        <p className="text-sm text-gray-600">
                          <span className="font-medium">Commande:</span> #{remboursement.orderId.split('-')[1]}
                        </p>
                        <p className="text-xs text-gray-500">
                          Demandé le {formatDate(remboursement.createdAt)}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Badge className={`${getStatusBadgeClass(remboursement.status, remboursement.decision)} px-3 py-1 font-medium`}>
                        {remboursement.status === 'traité' && remboursement.decision 
                          ? `${remboursement.status} - ${remboursement.decision}`
                          : remboursement.status
                        }
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-sm font-bold text-gray-800 mb-2">Raison du remboursement:</h3>
                      <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded-lg">{remboursement.reason}</p>
                      {remboursement.customReason && (
                        <p className="text-sm text-gray-600 mt-2 italic">
                          "{remboursement.customReason}"
                        </p>
                      )}
                    </div>

                    {remboursement.photo && (
                      <div>
                        <h3 className="text-sm font-bold text-gray-800 mb-2">Photo justificative:</h3>
                        <img
                          src={getImageUrl(remboursement.photo)}
                          alt="Photo justificative"
                          className="w-24 h-24 object-cover rounded-xl border-2 border-gray-200 shadow-lg hover:shadow-xl transition-shadow cursor-pointer"
                          onClick={() => window.open(getImageUrl(remboursement.photo!), '_blank')}
                        />
                      </div>
                    )}

                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-4">
                      <div className="flex items-center gap-3">
                        {remboursement.status === 'vérification' && (
                          <div className="flex items-center gap-2 text-yellow-600">
                            <AlertTriangle className="h-4 w-4" />
                            <span className="text-sm font-medium">En vérification</span>
                          </div>
                        )}
                        {remboursement.status === 'en étude' && (
                          <div className="flex items-center gap-2 text-blue-600">
                            <MessageCircle className="h-4 w-4" />
                            <span className="text-sm font-medium">En étude</span>
                          </div>
                        )}
                        {remboursement.status === 'traité' && remboursement.decision === 'accepté' && (
                          <div className="flex items-center gap-2 text-green-600">
                            <Check className="h-4 w-4" />
                            <span className="text-sm font-medium">Accepté</span>
                          </div>
                        )}
                        {remboursement.status === 'traité' && remboursement.decision === 'refusé' && (
                          <div className="flex items-center gap-2 text-red-600">
                            <X className="h-4 w-4" />
                            <span className="text-sm font-medium">Refusé</span>
                          </div>
                        )}
                      </div>
                      
                      <Button 
                        size="sm" 
                        onClick={() => handleViewDetails(remboursement)}
                        className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium px-6 py-2 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
                      >
                        <Eye className="h-4 w-4 mr-2" />
                        Gérer
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Enhanced Dialog */}
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto border-0 shadow-2xl">
            <DialogHeader className="space-y-4">
              <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-red-600 to-purple-600 bg-clip-text text-transparent">
                Gestion du remboursement #{selectedRemboursement?.id.split('-')[1]}
              </DialogTitle>
            </DialogHeader>
            
            {selectedRemboursement && (
              <div className="space-y-6">
                {/* Informations de la demande */}
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-2xl border border-blue-100">
                  <h3 className="font-bold text-blue-800 mb-4 text-lg">Détails de la demande</h3>
                  <div className="space-y-3">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <p><span className="font-medium text-gray-700">Client:</span> <span className="text-gray-900">{selectedRemboursement.userName}</span></p>
                      <p><span className="font-medium text-gray-700">Email:</span> <span className="text-gray-900">{selectedRemboursement.userEmail}</span></p>
                      <p><span className="font-medium text-gray-700">Commande:</span> <span className="text-gray-900">#{selectedRemboursement.orderId.split('-')[1]}</span></p>
                      <p><span className="font-medium text-gray-700">Date:</span> <span className="text-gray-900">{formatDate(selectedRemboursement.createdAt)}</span></p>
                    </div>
                    <div>
                      <p><span className="font-medium text-gray-700">Raison:</span> <span className="text-gray-900">{selectedRemboursement.reason}</span></p>
                      {selectedRemboursement.customReason && (
                        <p className="mt-2"><span className="font-medium text-gray-700">Description:</span> <span className="text-gray-900">"{selectedRemboursement.customReason}"</span></p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Photo justificative */}
                {selectedRemboursement.photo && (
                  <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-6 rounded-2xl border border-green-100">
                    <h3 className="font-bold text-green-800 mb-4 text-lg">Photo justificative</h3>
                    <img
                      src={getImageUrl(selectedRemboursement.photo)}
                      alt="Photo justificative"
                      className="w-full max-w-md h-60 object-cover rounded-xl border-2 border-green-200 shadow-lg cursor-pointer hover:shadow-xl transition-shadow"
                      onClick={() => window.open(getImageUrl(selectedRemboursement.photo!), '_blank')}
                    />
                  </div>
                )}

                {/* Commentaires précédents */}
                {selectedRemboursement.adminComments && selectedRemboursement.adminComments.length > 0 && (
                  <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-6 rounded-2xl border border-purple-100">
                    <h3 className="font-bold text-purple-800 mb-4 text-lg">Commentaires précédents</h3>
                    <div className="space-y-3">
                      {selectedRemboursement.adminComments.map((comment) => (
                        <div key={comment.id} className="bg-white p-4 rounded-xl shadow-sm border border-purple-100">
                          <div className="flex justify-between text-sm mb-2">
                            <span className="font-medium text-purple-700">{comment.adminName}</span>
                            <span className="text-gray-500">{formatDate(comment.createdAt)}</span>
                          </div>
                          <p className="text-gray-700 mb-2">{comment.comment}</p>
                          <Badge variant="secondary" className="text-xs bg-purple-100 text-purple-700">
                            {comment.status}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Mise à jour du statut */}
                <div className="bg-gradient-to-r from-gray-50 to-white p-6 rounded-2xl border border-gray-200">
                  <h3 className="font-bold text-gray-800 mb-6 text-lg">Mettre à jour le statut</h3>
                  <div className="space-y-6">
                    <div>
                      <Label htmlFor="status" className="text-gray-700 font-medium">Nouveau statut</Label>
                      <Select 
                        value={statusUpdateData.status} 
                        onValueChange={(value) => 
                          setStatusUpdateData(prev => ({ ...prev, status: value, decision: value !== 'traité' ? '' : prev.decision }))
                        }
                      >
                        <SelectTrigger className="mt-2 border-2 border-gray-200 focus:border-blue-500 transition-colors">
                          <SelectValue placeholder="Sélectionner un statut" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="vérification">Vérification</SelectItem>
                          <SelectItem value="en étude">En étude</SelectItem>
                          <SelectItem value="traité">Traité</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {statusUpdateData.status === 'traité' && (
                      <div>
                        <Label htmlFor="decision" className="text-gray-700 font-medium">Décision</Label>
                        <Select 
                          value={statusUpdateData.decision} 
                          onValueChange={(value) => 
                            setStatusUpdateData(prev => ({ ...prev, decision: value }))
                          }
                        >
                          <SelectTrigger className="mt-2 border-2 border-gray-200 focus:border-blue-500 transition-colors">
                            <SelectValue placeholder="Accepter ou refuser" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="accepté">Accepter le remboursement</SelectItem>
                            <SelectItem value="refusé">Refuser le remboursement</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    )}

                    <div>
                      <Label htmlFor="comment" className="text-gray-700 font-medium">
                        Commentaire {statusUpdateData.status === 'traité' && <span className="text-red-500">*</span>}
                      </Label>
                      <Textarea
                        id="comment"
                        placeholder="Ajouter un commentaire..."
                        value={statusUpdateData.comment}
                        onChange={(e) => 
                          setStatusUpdateData(prev => ({ ...prev, comment: e.target.value }))
                        }
                        rows={4}
                        className="mt-2 border-2 border-gray-200 focus:border-blue-500 transition-colors"
                      />
                      {statusUpdateData.status === 'traité' && (
                        <p className="text-xs text-red-500 mt-1">
                          Un commentaire est obligatoire pour le statut traité
                        </p>
                      )}
                    </div>

                    <div className="flex gap-4 pt-4">
                      <Button 
                        variant="outline" 
                        onClick={() => setDialogOpen(false)}
                        className="flex-1 border-gray-300 text-gray-700 hover:bg-gray-50"
                      >
                        Annuler
                      </Button>
                      <Button 
                        onClick={handleStatusUpdate}
                        disabled={updateStatusMutation.isPending}
                        className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 font-medium"
                      >
                        {updateStatusMutation.isPending ? 'Mise à jour...' : 'Mettre à jour'}
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
};

export default AdminRemboursementsPage;
