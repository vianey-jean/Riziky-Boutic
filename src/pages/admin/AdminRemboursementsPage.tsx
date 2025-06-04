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
import { remboursementsAPI, ordersAPI, type Remboursement } from '@/services/api';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Eye, MessageCircle, Check, X, AlertTriangle } from 'lucide-react';
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
      return await remboursementsAPI.getAll();
    }
  });

  const updateStatusMutation = useMutation({
    mutationFn: async ({ id, status, comment }: { 
      id: string; 
      status: string; 
      comment?: string; 
    }) => {
      return await remboursementsAPI.updateStatus(id, status, comment);
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

    const comment = statusUpdateData.comment + (statusUpdateData.decision ? ` - ${statusUpdateData.decision}` : '');

    updateStatusMutation.mutate({
      id: selectedRemboursement.id,
      status: statusUpdateData.status,
      comment: comment || undefined
    });
  };

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="flex justify-center items-center h-screen">
          Chargement des demandes de remboursement...
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-6">Gestion des Remboursements</h1>

        {remboursements.length === 0 ? (
          <div className="text-center py-10 border rounded-md">
            <p>Aucune demande de remboursement trouvée.</p>
          </div>
        ) : (
          <div className="grid gap-6">
            {remboursements.map((remboursement: Remboursement) => (
              <Card key={remboursement.id}>
                <CardHeader className="pb-2">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
                    <div>
                      <CardTitle>Remboursement #{remboursement.id.split('-')[1]}</CardTitle>
                      <p className="text-sm text-muted-foreground">
                        Commande #{remboursement.orderId.split('-')[1]} - {remboursement.userName} ({remboursement.userEmail})
                      </p>
                      <p className="text-xs text-gray-500">
                        Demandé le {formatDate(remboursement.createdAt)}
                      </p>
                    </div>
                    <div className="mt-2 sm:mt-0">
                      <Badge className={getStatusBadgeClass(remboursement.status, remboursement.decision)}>
                        {remboursement.status === 'traité' && remboursement.decision 
                          ? `${remboursement.status} - ${remboursement.decision}`
                          : remboursement.status
                        }
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="mb-4">
                    <h3 className="text-sm font-medium mb-2">Raison:</h3>
                    <p className="text-sm">{remboursement.reason}</p>
                    {remboursement.customReason && (
                      <p className="text-sm mt-1 text-muted-foreground">
                        "{remboursement.customReason}"
                      </p>
                    )}
                  </div>

                  {remboursement.photo && (
                    <div className="mb-4">
                      <h3 className="text-sm font-medium mb-2">Photo justificative:</h3>
                      <img
                        src={getImageUrl(remboursement.photo)}
                        alt="Photo justificative"
                        className="w-20 h-20 object-cover rounded border"
                      />
                    </div>
                  )}

                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-2">
                      {remboursement.status === 'vérification' && (
                        <AlertTriangle className="h-4 w-4 text-yellow-500" />
                      )}
                      {remboursement.status === 'en étude' && (
                        <MessageCircle className="h-4 w-4 text-blue-500" />
                      )}
                      {remboursement.status === 'traité' && remboursement.decision === 'accepté' && (
                        <Check className="h-4 w-4 text-green-500" />
                      )}
                      {remboursement.status === 'traité' && remboursement.decision === 'refusé' && (
                        <X className="h-4 w-4 text-red-500" />
                      )}
                      <span className="text-sm">
                        Statut: {remboursement.status}
                        {remboursement.decision && ` - ${remboursement.decision}`}
                      </span>
                    </div>
                    
                    <Button 
                      size="sm" 
                      onClick={() => handleViewDetails(remboursement)}
                    >
                      <Eye className="h-4 w-4 mr-2" />
                      Gérer
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Dialog pour gestion du remboursement */}
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                Gestion du remboursement #{selectedRemboursement?.id.split('-')[1]}
              </DialogTitle>
            </DialogHeader>
            
            {selectedRemboursement && (
              <div className="space-y-6">
                {/* Informations de la demande */}
                <div>
                  <h3 className="font-medium mb-2">Détails de la demande</h3>
                  <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                    <p><strong>Client:</strong> {selectedRemboursement.userName} ({selectedRemboursement.userEmail})</p>
                    <p><strong>Commande:</strong> #{selectedRemboursement.orderId.split('-')[1]}</p>
                    <p><strong>Raison:</strong> {selectedRemboursement.reason}</p>
                    {selectedRemboursement.customReason && (
                      <p><strong>Description:</strong> {selectedRemboursement.customReason}</p>
                    )}
                    <p><strong>Date de demande:</strong> {formatDate(selectedRemboursement.createdAt)}</p>
                  </div>
                </div>

                {/* Photo justificative */}
                {selectedRemboursement.photo && (
                  <div>
                    <h3 className="font-medium mb-2">Photo justificative</h3>
                    <img
                      src={getImageUrl(selectedRemboursement.photo)}
                      alt="Photo justificative"
                      className="w-full max-w-md h-60 object-cover rounded-lg border"
                    />
                  </div>
                )}

                {/* Commentaires précédents */}
                {selectedRemboursement.adminComments && selectedRemboursement.adminComments.length > 0 && (
                  <div>
                    <h3 className="font-medium mb-2">Commentaires précédents</h3>
                    <div className="space-y-2">
                      {selectedRemboursement.adminComments.map((comment) => (
                        <div key={comment.id} className="bg-blue-50 p-3 rounded">
                          <div className="flex justify-between text-sm">
                            <span className="font-medium">{comment.adminName}</span>
                            <span className="text-muted-foreground">{formatDate(comment.createdAt)}</span>
                          </div>
                          <p className="text-sm mt-1">{comment.comment}</p>
                          <Badge variant="secondary" className="mt-1 text-xs">
                            {comment.status}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Mise à jour du statut */}
                <div>
                  <h3 className="font-medium mb-4">Mettre à jour le statut</h3>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="status">Nouveau statut</Label>
                      <Select 
                        value={statusUpdateData.status} 
                        onValueChange={(value) => 
                          setStatusUpdateData(prev => ({ ...prev, status: value, decision: value !== 'traité' ? '' : prev.decision }))
                        }
                      >
                        <SelectTrigger>
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
                        <Label htmlFor="decision">Décision</Label>
                        <Select 
                          value={statusUpdateData.decision} 
                          onValueChange={(value) => 
                            setStatusUpdateData(prev => ({ ...prev, decision: value }))
                          }
                        >
                          <SelectTrigger>
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
                      <Label htmlFor="comment">
                        Commentaire {statusUpdateData.status === 'traité' && <span className="text-red-500">*</span>}
                      </Label>
                      <Textarea
                        id="comment"
                        placeholder="Ajouter un commentaire..."
                        value={statusUpdateData.comment}
                        onChange={(e) => 
                          setStatusUpdateData(prev => ({ ...prev, comment: e.target.value }))
                        }
                        rows={3}
                      />
                      {statusUpdateData.status === 'traité' && (
                        <p className="text-xs text-muted-foreground mt-1">
                          Un commentaire est obligatoire pour le statut traité
                        </p>
                      )}
                    </div>

                    <div className="flex gap-3 pt-4">
                      <Button 
                        variant="outline" 
                        onClick={() => setDialogOpen(false)}
                        className="flex-1"
                      >
                        Annuler
                      </Button>
                      <Button 
                        onClick={handleStatusUpdate}
                        disabled={updateStatusMutation.isPending}
                        className="flex-1"
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
