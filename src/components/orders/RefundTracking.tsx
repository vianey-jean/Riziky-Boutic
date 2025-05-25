
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Clock, MessageCircle, CheckCircle, AlertCircle } from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { type Remboursement } from '@/services/api';

interface RefundTrackingProps {
  remboursement: Remboursement;
  order: any;
}

const RefundTracking: React.FC<RefundTrackingProps> = ({ remboursement, order }) => {
  const AUTH_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'vérification':
        return <Clock className="h-4 w-4" />;
      case 'en étude':
        return <MessageCircle className="h-4 w-4" />;
      case 'traité':
        return remboursement.decision === 'accepté' ? 
          <CheckCircle className="h-4 w-4" /> : 
          <AlertCircle className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'vérification':
        return 'bg-yellow-100 text-yellow-800';
      case 'en étude':
        return 'bg-blue-100 text-blue-800';
      case 'traité':
        return remboursement.decision === 'accepté' ? 
          'bg-green-100 text-green-800' : 
          'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString: string) => {
    return format(new Date(dateString), 'dd MMMM yyyy à HH:mm', { locale: fr });
  };

  const getImageUrl = (imagePath: string) => {
    if (!imagePath) return '';
    if (imagePath.startsWith('http')) return imagePath;
    return `${AUTH_BASE_URL}${imagePath}`;
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle>Suivi de remboursement #{remboursement.id.split('-')[1]}</CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                Commande #{order.id.split('-')[1]}
              </p>
            </div>
            <Badge className={getStatusColor(remboursement.status)}>
              <div className="flex items-center gap-1">
                {getStatusIcon(remboursement.status)}
                {remboursement.status === 'traité' && remboursement.decision 
                  ? `${remboursement.status} - ${remboursement.decision}`
                  : remboursement.status
                }
              </div>
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Informations de la demande */}
          <div>
            <h3 className="font-medium mb-2">Raison du remboursement</h3>
            <p className="text-sm text-muted-foreground">
              {remboursement.reason.charAt(0).toUpperCase() + remboursement.reason.slice(1)}
            </p>
            {remboursement.customReason && (
              <p className="text-sm mt-2">{remboursement.customReason}</p>
            )}
          </div>

          {/* Photo justificative */}
          {remboursement.photo && (
            <div>
              <h3 className="font-medium mb-2">Photo justificative</h3>
              <img
                src={getImageUrl(remboursement.photo)}
                alt="Photo justificative"
                className="w-full max-w-sm h-40 object-cover rounded-lg border"
              />
            </div>
          )}

          <Separator />

          {/* Progression du statut */}
          <div>
            <h3 className="font-medium mb-4">Progression</h3>
            <div className="space-y-4">
              {/* Étape 1: Vérification */}
              <div className="flex items-center space-x-4">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  remboursement.status === 'vérification' || 
                  remboursement.status === 'en étude' || 
                  remboursement.status === 'traité'
                    ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-500'
                }`}>
                  <Clock className="h-4 w-4" />
                </div>
                <div>
                  <p className="font-medium">Vérification</p>
                  <p className="text-sm text-muted-foreground">
                    Votre demande est en cours de vérification
                  </p>
                </div>
              </div>

              {/* Étape 2: En étude */}
              <div className="flex items-center space-x-4">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  remboursement.status === 'en étude' || remboursement.status === 'traité'
                    ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-500'
                }`}>
                  <MessageCircle className="h-4 w-4" />
                </div>
                <div>
                  <p className="font-medium">En étude</p>
                  <p className="text-sm text-muted-foreground">
                    Votre demande est à l'étude par notre équipe
                  </p>
                </div>
              </div>

              {/* Étape 3: Traité */}
              <div className="flex items-center space-x-4">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  remboursement.status === 'traité'
                    ? remboursement.decision === 'accepté'
                      ? 'bg-green-500 text-white'
                      : 'bg-red-500 text-white'
                    : 'bg-gray-200 text-gray-500'
                }`}>
                  {remboursement.status === 'traité' ? (
                    remboursement.decision === 'accepté' ? 
                      <CheckCircle className="h-4 w-4" /> : 
                      <AlertCircle className="h-4 w-4" />
                  ) : (
                    <CheckCircle className="h-4 w-4" />
                  )}
                </div>
                <div>
                  <p className="font-medium">
                    {remboursement.status === 'traité' && remboursement.decision
                      ? remboursement.decision === 'accepté' ? 'Accepté' : 'Refusé'
                      : 'Traité'
                    }
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {remboursement.status === 'traité' && remboursement.decision
                      ? remboursement.decision === 'accepté' 
                        ? 'Votre remboursement a été accepté'
                        : 'Votre demande de remboursement a été refusée'
                      : 'Décision finale sur votre demande'
                    }
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Commentaires admin */}
          {remboursement.adminComments && remboursement.adminComments.length > 0 && (
            <>
              <Separator />
              <div>
                <h3 className="font-medium mb-4">Commentaires de l'équipe</h3>
                <div className="space-y-3">
                  {remboursement.adminComments.map((comment) => (
                    <div key={comment.id} className="bg-gray-50 p-3 rounded-lg">
                      <div className="flex justify-between items-start mb-2">
                        <p className="font-medium text-sm">{comment.adminName}</p>
                        <p className="text-xs text-muted-foreground">
                          {formatDate(comment.createdAt)}
                        </p>
                      </div>
                      <p className="text-sm">{comment.comment}</p>
                      <Badge variant="secondary" className="mt-2 text-xs">
                        {comment.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}

          {/* Informations de la commande */}
          <Separator />
          <div>
            <h3 className="font-medium mb-2">Détails de la commande</h3>
            <div className="text-sm text-muted-foreground space-y-1">
              <p>Commande du {formatDate(order.createdAt)}</p>
              <p>Montant: {order.totalAmount.toFixed(2)} €</p>
              <p>Statut: {order.status}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default RefundTracking;
