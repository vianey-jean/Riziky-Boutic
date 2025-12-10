
import React, { useEffect, useState } from 'react';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Check, Clock, Search, CheckCircle, XCircle } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import { remboursementsAPI, Remboursement } from '@/services/api';
import { useQuery } from '@tanstack/react-query';

const RefundTracking = () => {
  const { refundId } = useParams<{ refundId: string }>();
  const AUTH_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  const { data: refund, isLoading } = useQuery({
    queryKey: ['refund', refundId],
    queryFn: async () => {
      if (!refundId) throw new Error('ID de remboursement manquant');
      const response = await remboursementsAPI.getById(refundId);
      return response.data;
    },
    enabled: !!refundId
  });

  if (isLoading) {
    return (
      <Layout>
        <div className="text-center py-10">Chargement...</div>
      </Layout>
    );
  }

  if (!refund) {
    return (
      <Layout>
        <div className="text-center py-20">
          <h1 className="text-2xl font-bold mb-4">Demande non trouvée</h1>
          <p className="mb-6">La demande de remboursement que vous recherchez n'existe pas.</p>
          <Button asChild>
            <Link to="/commandes">Retour aux commandes</Link>
          </Button>
        </div>
      </Layout>
    );
  }

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
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

  const steps = [
    { name: 'Vérification', icon: Search, completed: true },
    { name: 'En étude', icon: Clock, completed: refund.status !== 'vérification' },
    { name: 'Traité', icon: refund.decision === 'accepté' ? CheckCircle : refund.decision === 'refusé' ? XCircle : Check, completed: refund.status === 'traité' }
  ];

  return (
    <Layout>
      <div className="max-w-4xl mx-auto p-4">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold">Suivi de remboursement</h1>
            <p className="text-muted-foreground">Demande #{refund.id.split('-')[1]}</p>
          </div>
          {getStatusBadge(refund.status, refund.decision)}
        </div>

        {/* Étapes du remboursement */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Statut de la demande</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between">
              {steps.map((step, index) => (
                <div key={index} className="flex flex-col items-center relative">
                  {index > 0 && (
                    <div className={`absolute h-1 top-4 transform -translate-x-1/2 -left-1/2 w-full ${
                      step.completed ? 'bg-brand-blue' : 'bg-gray-200'
                    }`} />
                  )}
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center z-10 ${
                    step.completed ? 'bg-brand-blue text-white' : 'bg-gray-200 text-gray-400'
                  }`}>
                    <step.icon className="h-4 w-4" />
                  </div>
                  <span className="text-xs text-center mt-2 max-w-[70px]">{step.name}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Détails de la demande */}
          <Card>
            <CardHeader>
              <CardTitle>Détails de la demande</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-medium text-sm">Raison</h4>
                <p className="text-sm">{refund.reason}</p>
              </div>
              
              {(refund.customReason || refund.reasonDetails) && (
                <div>
                  <h4 className="font-medium text-sm">Détails</h4>
                  <p className="text-sm">{refund.customReason || refund.reasonDetails}</p>
                </div>
              )}

              <div>
                <h4 className="font-medium text-sm">Date de création</h4>
                <p className="text-sm">{formatDate(refund.createdAt)}</p>
              </div>

              {(refund.photo || (refund.photos && refund.photos.length > 0)) && (
                <div>
                  <h4 className="font-medium text-sm mb-2">Photos jointes</h4>
                  <div className="grid grid-cols-2 gap-2">
                    {refund.photo && (
                      <img
                        src={getImageUrl(refund.photo)}
                        alt="Photo justificative"
                        className="w-full h-20 object-cover rounded border cursor-pointer hover:opacity-80"
                        onClick={() => window.open(getImageUrl(refund.photo!), '_blank')}
                      />
                    )}
                    {refund.photos?.map((photo, index) => (
                      <img
                        key={index}
                        src={getImageUrl(photo)}
                        alt={`Photo ${index + 1}`}
                        className="w-full h-20 object-cover rounded border cursor-pointer hover:opacity-80"
                        onClick={() => window.open(getImageUrl(photo), '_blank')}
                      />
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Commentaires et historique */}
          <Card>
            <CardHeader>
              <CardTitle>Commentaires administrateur</CardTitle>
            </CardHeader>
            <CardContent>
              {((refund.adminComments && refund.adminComments.length > 0) || (refund.comments && refund.comments.length > 0)) ? (
                <div className="space-y-4">
                  {(refund.adminComments || refund.comments || []).map((comment) => (
                    <div key={comment.id} className="bg-gray-50 p-3 rounded">
                      <div className="flex justify-between items-start mb-2">
                        <span className="font-medium text-sm">{comment.adminName}</span>
                        <span className="text-xs text-muted-foreground">
                          {formatDate(comment.createdAt)}
                        </span>
                      </div>
                      <p className="text-sm">{comment.comment || comment.content}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">Aucun commentaire pour le moment.</p>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Informations sur la commande */}
        {refund.order && (
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Commande concernée</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-start mb-4">
                <div>
                  <p className="font-medium">Commande #{refund.order.id?.split('-')[1] || refund.orderId?.split('-')[1]}</p>
                  <p className="text-sm text-muted-foreground">
                    {formatDate(refund.order.createdAt)}
                  </p>
                </div>
              </div>

              <div className="space-y-2 mb-4">
                {refund.order.items?.map((item) => (
                  <div key={item.productId} className="flex items-center bg-muted/50 p-3 rounded-lg">
                    <div className="w-16 h-16 rounded-lg overflow-hidden mr-4">
                      {item.image ? (
                        <img
                          src={getImageUrl(item.image)}
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                          <span className="text-xs">N/A</span>
                        </div>
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">{item.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {item.quantity} × {(item.price || 0).toFixed(2)} €
                      </p>
                    </div>
                    <p className="font-bold">{(item.subtotal || item.price * item.quantity).toFixed(2)} €</p>
                  </div>
                ))}
              </div>

              {/* Détails financiers */}
              <div className="bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-950/30 dark:to-teal-950/30 p-4 rounded-xl border border-emerald-200 dark:border-emerald-800">
                <h4 className="font-semibold mb-3 text-emerald-700 dark:text-emerald-300">Détails financiers</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Sous-total produits:</span>
                    <span className="font-medium">{(refund.order.subtotalProduits || refund.order.originalAmount || 0).toFixed(2)} €</span>
                  </div>
                  {refund.order.discount > 0 && (
                    <div className="flex justify-between text-green-600">
                      <span>Réduction:</span>
                      <span>-{(refund.order.discount || 0).toFixed(2)} €</span>
                    </div>
                  )}
                  {refund.order.taxAmount > 0 && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">TVA ({((refund.order.taxRate || 0) * 100).toFixed(0)}%):</span>
                      <span className="font-medium">{(refund.order.taxAmount || 0).toFixed(2)} €</span>
                    </div>
                  )}
                  {refund.order.deliveryPrice > 0 && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Frais de livraison:</span>
                      <span className="font-medium">{(refund.order.deliveryPrice || 0).toFixed(2)} €</span>
                    </div>
                  )}
                  <div className="border-t pt-2 mt-2">
                    <div className="flex justify-between text-lg">
                      <span className="font-bold">Total:</span>
                      <span className="font-bold text-emerald-600">{(refund.order.totalAmount || 0).toFixed(2)} €</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        <div className="mt-6 text-center">
          <Button asChild>
            <Link to="/commandes">Retour aux commandes</Link>
          </Button>
        </div>
      </div>
    </Layout>
  );
};

export default RefundTracking;
