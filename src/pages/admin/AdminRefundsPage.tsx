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
import { Eye, MessageSquare, CheckCircle, XCircle, Search, Clock } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { remboursementsAPI, Remboursement } from '@/services/api';
import { toast } from '@/components/ui/sonner';
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
        <div className="flex justify-center items-center h-screen">
          Chargement des remboursements...
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-6">Gestion des Remboursements</h1>

        {refunds.length === 0 ? (
          <div className="text-center py-10 border rounded-md">
            <p>Aucune demande de remboursement trouvée.</p>
          </div>
        ) : (
          <div className="grid gap-6">
            {refunds.map((refund: Remboursement) => (
              <Card key={refund.id}>
                <CardHeader>
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
                    <div>
                      <CardTitle>Remboursement #{refund.id.split('-')[1]}</CardTitle>
                      <p className="text-sm text-muted-foreground">
                        {formatDate(refund.createdAt)} par {refund.userName} ({refund.userEmail})
                      </p>
                      <p className="text-sm">
                        Commande: #{refund.orderId.split('-')[1]}
                      </p>
                    </div>
                    <div className="mt-2 sm:mt-0 flex flex-col items-end gap-2">
                      {getStatusBadge(refund.status, refund.decision)}
                      <p className="font-bold text-sm">Commande #{refund.orderId.split('-')[1]}</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Détails de la demande */}
                    <div>
                      <h3 className="text-sm font-medium mb-2">Détails de la demande</h3>
                      <div className="space-y-2 text-sm">
                        <div>
                          <span className="font-medium">Raison:</span> {refund.reason}
                        </div>
                        {(refund.customReason || refund.reasonDetails) && (
                          <div>
                            <span className="font-medium">Détails:</span> {refund.customReason || refund.reasonDetails}
                          </div>
                        )}
                      </div>

                      {(refund.photo || (refund.photos && refund.photos.length > 0)) && (
                        <div className="mt-4">
                          <h4 className="text-sm font-medium mb-2">Photos jointes</h4>
                          <div className="grid grid-cols-3 gap-2">
                            {refund.photo && (
                              <img
                                src={getImageUrl(refund.photo)}
                                alt="Photo justificative"
                                className="w-full h-16 object-cover rounded border cursor-pointer hover:opacity-80"
                                onClick={() => window.open(getImageUrl(refund.photo!), '_blank')}
                              />
                            )}
                            {refund.photos?.map((photo, index) => (
                              <img
                                key={index}
                                src={getImageUrl(photo)}
                                alt={`Photo ${index + 1}`}
                                className="w-full h-16 object-cover rounded border cursor-pointer hover:opacity-80"
                                onClick={() => window.open(getImageUrl(photo), '_blank')}
                              />
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Produits de la commande */}
                    <div>
                      <h3 className="text-sm font-medium mb-2">Commande concernée</h3>
                      <div className="space-y-2">
                        <p className="text-sm">ID: #{refund.orderId.split('-')[1]}</p>
                        <p className="text-sm text-muted-foreground">
                          Voir les détails dans la section commandes
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Commentaires */}
                  {((refund.adminComments && refund.adminComments.length > 0) || (refund.comments && refund.comments.length > 0)) && (
                    <div className="mt-4">
                      <h3 className="text-sm font-medium mb-2">Commentaires</h3>
                      <div className="space-y-2">
                        {(refund.adminComments || refund.comments || []).map((comment) => (
                          <div key={comment.id} className="bg-gray-50 p-2 rounded text-sm">
                            <div className="flex justify-between items-start">
                              <span className="font-medium">{comment.adminName}</span>
                              <span className="text-xs text-muted-foreground">
                                {formatDate(comment.createdAt)}
                              </span>
                            </div>
                            <p className="mt-1">{comment.comment || comment.content}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="mt-6 flex gap-3">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="outline" size="sm">
                          <Eye className="h-4 w-4 mr-2" />
                          Voir détails
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                        <DialogHeader>
                          <DialogTitle>Détails du remboursement #{refund.id.split('-')[1]}</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4">
                          <div>
                            <h4 className="font-medium">Informations client</h4>
                            <p className="text-sm">{refund.userName} - {refund.userEmail}</p>
                          </div>
                          <div>
                            <h4 className="font-medium">Commande</h4>
                            <p className="text-sm">#{refund.orderId.split('-')[1]}</p>
                          </div>
                          <div>
                            <h4 className="font-medium">Raison</h4>
                            <p className="text-sm">{refund.reason}</p>
                            {(refund.customReason || refund.reasonDetails) && (
                              <p className="text-sm text-muted-foreground mt-1">{refund.customReason || refund.reasonDetails}</p>
                            )}
                          </div>
                          {(refund.photo || (refund.photos && refund.photos.length > 0)) && (
                            <div>
                              <h4 className="font-medium">Photos</h4>
                              <div className="grid grid-cols-2 gap-2 mt-2">
                                {refund.photo && (
                                  <img
                                    src={getImageUrl(refund.photo)}
                                    alt="Photo justificative"
                                    className="w-full h-32 object-cover rounded border cursor-pointer"
                                    onClick={() => window.open(getImageUrl(refund.photo!), '_blank')}
                                  />
                                )}
                                {refund.photos?.map((photo, index) => (
                                  <img
                                    key={index}
                                    src={getImageUrl(photo)}
                                    alt={`Photo ${index + 1}`}
                                    className="w-full h-32 object-cover rounded border cursor-pointer"
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
                          >
                            <MessageSquare className="h-4 w-4 mr-2" />
                            Changer statut
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-md">
                          <DialogHeader>
                            <DialogTitle>Changer le statut</DialogTitle>
                          </DialogHeader>
                          <div className="space-y-4">
                            <div>
                              <Label>Nouveau statut</Label>
                              <Select value={newStatus} onValueChange={setNewStatus}>
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

                            {newStatus === 'traité' && (
                              <div>
                                <Label>Décision *</Label>
                                <Select value={decision} onValueChange={setDecision}>
                                  <SelectTrigger>
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
                              <Label>
                                Commentaire {newStatus === 'traité' ? '*' : '(optionnel)'}
                              </Label>
                              <Textarea
                                value={statusComment}
                                onChange={(e) => setStatusComment(e.target.value)}
                                placeholder="Ajouter un commentaire..."
                                rows={3}
                              />
                            </div>

                            <div className="flex gap-3">
                              <Button variant="outline" className="flex-1">
                                Annuler
                              </Button>
                              <Button 
                                className="flex-1"
                                onClick={() => {
                                  if (refund) {
                                    handleStatusUpdate(refund.id, newStatus);
                                  }
                                }}
                                disabled={!newStatus || (newStatus === 'traité' && (!statusComment || !decision))}
                              >
                                Valider
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
