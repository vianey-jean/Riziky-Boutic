
import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import Layout from '@/components/layout/Layout';
import PageDataLoader from '@/components/layout/PageDataLoader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';
import { paiementRemboursementAPI } from '@/services/paiementRemboursementAPI';
import { PaiementRemboursement } from '@/types/paiementRemboursement';
import { 
  CreditCard, 
  Truck, 
  CheckCircle, 
  Clock, 
  Package,
  MapPin,
  Phone,
  Receipt,
  Sparkles,
  Shield,
  BadgePercent,
  Banknote,
  ArrowRight
} from 'lucide-react';
import { io } from 'socket.io-client';

const PaiementRemboursementPage: React.FC = () => {
  const [paiements, setPaiements] = useState<PaiementRemboursement[]>([]);
  const [dataLoaded, setDataLoaded] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();

  // Socket connection for real-time updates
  useEffect(() => {
    const socket = io(import.meta.env.VITE_API_BASE_URL || 'http://localhost:10000');
    
    socket.on('paiement-remboursement-created', (newPaiement: PaiementRemboursement) => {
      if (user && newPaiement.userId === String(user.id) && newPaiement.decision === 'accepté') {
        setPaiements(prev => [...prev, newPaiement]);
      }
    });
    
    socket.on('paiement-remboursement-updated', (updatedPaiement: PaiementRemboursement) => {
      setPaiements(prev => prev.map(p => 
        p.id === updatedPaiement.id ? updatedPaiement : p
      ));
    });

    return () => {
      socket.disconnect();
    };
  }, [user]);

  const fetchPaiements = useCallback(async () => {
    const response = await paiementRemboursementAPI.getUserPaiements();
    return response.data;
  }, []);

  const handleDataLoaded = useCallback((data: PaiementRemboursement[]) => {
    console.log('Paiements chargés:', data);
    setPaiements(data);
    setDataLoaded(true);
  }, []);

  const handleValidate = async (id: string) => {
    try {
      await paiementRemboursementAPI.validatePayment(id);
      toast.success('Paiement validé avec succès');
      setPaiements(prev => prev.filter(p => p.id !== id));
    } catch (error) {
      console.error('Erreur validation:', error);
      toast.error('Erreur lors de la validation');
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'debut':
        return (
          <Badge className="bg-gradient-to-r from-amber-400 to-orange-500 text-white border-0 shadow-lg shadow-amber-500/30">
            <Clock className="w-3 h-3 mr-1" />
            Début
          </Badge>
        );
      case 'en cours':
        return (
          <Badge className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white border-0 shadow-lg shadow-blue-500/30">
            <ArrowRight className="w-3 h-3 mr-1" />
            En cours
          </Badge>
        );
      case 'payé':
        return (
          <Badge className="bg-gradient-to-r from-emerald-500 to-green-600 text-white border-0 shadow-lg shadow-emerald-500/30">
            <CheckCircle className="w-3 h-3 mr-1" />
            Payé
          </Badge>
        );
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getPaymentMethodLabel = (method: string) => {
    switch (method) {
      case 'cash': return 'Paiement à la livraison';
      case 'card': return 'Carte bancaire';
      case 'paypal': return 'PayPal';
      case 'apple_pay': return 'Apple Pay';
      default: return method;
    }
  };

  const getPaymentMethodIcon = (method: string) => {
    switch (method) {
      case 'cash':
        return <Banknote className="h-5 w-5 text-emerald-500" />;
      default:
        return <CreditCard className="h-5 w-5 text-indigo-500" />;
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR'
    }).format(amount || 0);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Show PageDataLoader until data is loaded
  if (!dataLoaded) {
    return (
      <Layout>
        <PageDataLoader
          fetchFunction={fetchPaiements}
          onSuccess={handleDataLoaded}
          loadingMessage="Chargement de vos remboursements..."
          loadingSubmessage="Récupération des données en cours..."
          errorMessage="Erreur lors du chargement des remboursements"
        />
      </Layout>
    );
  }

  if (paiements.length === 0) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-12">
          <Card className="max-w-2xl mx-auto overflow-hidden border-0 shadow-2xl">
            <div className="bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-12 text-center">
              <div className="bg-white/10 backdrop-blur-sm p-6 rounded-full w-fit mx-auto mb-6">
                <Receipt className="h-16 w-16 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-3">Aucun remboursement en attente</h2>
              <p className="text-white/70 mb-8">Vous n'avez pas de remboursement accepté en cours.</p>
              <Button 
                onClick={() => navigate('/commandes')}
                className="bg-white text-slate-900 hover:bg-white/90 shadow-xl"
              >
                <Package className="w-4 h-4 mr-2" />
                Voir mes commandes
              </Button>
            </div>
          </Card>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-b from-background via-background to-muted/30">
        <div className="container mx-auto px-4 py-8">
          {/* Premium Header */}
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 p-8 mb-10 shadow-2xl">
            <div className="absolute inset-0 opacity-50 bg-gradient-to-br from-white/5 to-transparent"></div>
            <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
              <div className="flex items-center gap-4">
                <div className="bg-white/20 backdrop-blur-sm p-4 rounded-2xl">
                  <Banknote className="h-10 w-10 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
                    Paiement Remboursement
                  </h1>
                  <p className="text-white/80 flex items-center gap-2">
                    <Shield className="w-4 h-4" />
                    Suivez l'état de vos remboursements en temps réel
                  </p>
                </div>
              </div>
              <div className="bg-white/20 backdrop-blur-sm px-6 py-4 rounded-2xl">
                <div className="text-white/80 text-sm">Total en cours</div>
                <div className="text-3xl font-bold text-white">
                  {paiements.length} remboursement{paiements.length > 1 ? 's' : ''}
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-8">
            {paiements.map((paiement) => (
              <Card key={paiement.id} className="overflow-hidden border-0 shadow-xl hover:shadow-2xl transition-all duration-500 bg-card/80 backdrop-blur-sm">
                {/* Card Header with Gradient */}
                <CardHeader className="bg-gradient-to-r from-slate-50 via-white to-slate-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 border-b">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <div className="bg-gradient-to-br from-emerald-500 to-teal-600 p-3 rounded-xl shadow-lg">
                        <Receipt className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <CardTitle className="text-lg font-bold">
                          Remboursement #{paiement.id.split('-')[1]}
                        </CardTitle>
                        <p className="text-sm text-muted-foreground mt-1">
                          Commande: {paiement.orderId}
                        </p>
                      </div>
                    </div>
                    <div className="flex flex-wrap items-center gap-3">
                      {getStatusBadge(paiement.status)}
                      {paiement.status === 'payé' && !paiement.clientValidated && (
                        <Button 
                          onClick={() => handleValidate(paiement.id)}
                          className="bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white shadow-lg shadow-emerald-500/30"
                        >
                          <CheckCircle className="h-4 w-4 mr-2" />
                          Confirmer réception
                        </Button>
                      )}
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent className="p-6 space-y-6">
                  {/* Progress Bar Premium */}
                  <div className="bg-gradient-to-r from-slate-50 to-slate-100 dark:from-slate-800/50 dark:to-slate-900/50 p-6 rounded-2xl">
                    <div className="flex justify-between items-center mb-4">
                      <span className="text-sm font-semibold flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-amber-500" />
                        Progression du remboursement
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <div className={`flex-1 h-3 rounded-l-full transition-all duration-500 ${
                        paiement.status === 'debut' || paiement.status === 'en cours' || paiement.status === 'payé' 
                          ? 'bg-gradient-to-r from-amber-400 to-amber-500 shadow-lg shadow-amber-500/30' : 'bg-muted'
                      }`} />
                      <div className={`flex-1 h-3 transition-all duration-500 ${
                        paiement.status === 'en cours' || paiement.status === 'payé' 
                          ? 'bg-gradient-to-r from-blue-400 to-blue-500 shadow-lg shadow-blue-500/30' : 'bg-muted'
                      }`} />
                      <div className={`flex-1 h-3 rounded-r-full transition-all duration-500 ${
                        paiement.status === 'payé' 
                          ? 'bg-gradient-to-r from-emerald-400 to-emerald-500 shadow-lg shadow-emerald-500/30' : 'bg-muted'
                      }`} />
                    </div>
                    <div className="flex justify-between text-xs text-muted-foreground mt-3 font-medium">
                      <span className={paiement.status === 'debut' || paiement.status === 'en cours' || paiement.status === 'payé' ? 'text-amber-600 dark:text-amber-400' : ''}>Début</span>
                      <span className={paiement.status === 'en cours' || paiement.status === 'payé' ? 'text-blue-600 dark:text-blue-400' : ''}>En cours</span>
                      <span className={paiement.status === 'payé' ? 'text-emerald-600 dark:text-emerald-400' : ''}>Payé</span>
                    </div>
                  </div>

                  <Separator />

                  {/* Payment Method */}
                  <div className="flex items-center gap-4 p-4 bg-indigo-50 dark:bg-indigo-950/30 rounded-xl border border-indigo-100 dark:border-indigo-900">
                    <div className="bg-white dark:bg-slate-800 p-3 rounded-xl shadow-md">
                      {getPaymentMethodIcon(paiement.order.paymentMethod)}
                    </div>
                    <div>
                      <h3 className="font-semibold">Mode de remboursement</h3>
                      <p className="text-muted-foreground text-sm">
                        {getPaymentMethodLabel(paiement.order.paymentMethod)}
                      </p>
                    </div>
                  </div>

                  {/* Order Details */}
                  <div>
                    <h3 className="font-semibold mb-4 flex items-center gap-2">
                      <Package className="h-5 w-5 text-purple-500" />
                      Produits commandés
                    </h3>
                    <div className="space-y-3">
                      {paiement.order.items.map((item, index) => (
                        <div key={index} className="flex items-center gap-4 p-4 bg-gradient-to-r from-slate-50 to-white dark:from-slate-800/50 dark:to-slate-900/50 rounded-xl border border-slate-100 dark:border-slate-800 hover:shadow-md transition-shadow">
                          {item.image && (
                            <img 
                              src={`${import.meta.env.VITE_API_BASE_URL}${item.image}`}
                              alt={item.name}
                              className="w-20 h-20 object-cover rounded-xl shadow-lg"
                            />
                          )}
                          <div className="flex-1 min-w-0">
                            <p className="font-semibold truncate">{item.name}</p>
                            <p className="text-sm text-muted-foreground">
                              {item.quantity} × {formatCurrency(item.price)}
                            </p>
                          </div>
                          <p className="font-bold text-lg">{formatCurrency(item.subtotal)}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <Separator />

                  {/* Shipping Address */}
                  <div>
                    <h3 className="font-semibold mb-4 flex items-center gap-2">
                      <MapPin className="h-5 w-5 text-rose-500" />
                      Adresse de livraison
                    </h3>
                    <div className="bg-gradient-to-br from-rose-50 to-pink-50 dark:from-rose-950/30 dark:to-pink-950/30 p-5 rounded-xl border border-rose-100 dark:border-rose-900">
                      <p className="font-semibold">{paiement.order.shippingAddress.prenom} {paiement.order.shippingAddress.nom}</p>
                      <p className="text-muted-foreground">{paiement.order.shippingAddress.adresse}</p>
                      <p className="text-muted-foreground">{paiement.order.shippingAddress.codePostal} {paiement.order.shippingAddress.ville}</p>
                      <p className="text-muted-foreground">{paiement.order.shippingAddress.pays}</p>
                      <p className="flex items-center gap-2 mt-3 text-rose-600 dark:text-rose-400 font-medium">
                        <Phone className="h-4 w-4" />
                        {paiement.order.shippingAddress.telephone}
                      </p>
                    </div>
                  </div>

                  <Separator />

                  {/* Financial Summary Premium */}
                  <div className="bg-gradient-to-br from-emerald-500 via-teal-500 to-cyan-500 p-6 rounded-2xl text-white shadow-2xl shadow-emerald-500/20">
                    <h3 className="font-semibold mb-4 flex items-center gap-2 text-white/90">
                      <BadgePercent className="h-5 w-5" />
                      Détail du remboursement
                    </h3>
                    
                    <div className="space-y-3 mb-4">
                      {/* Sous-total produits */}
                      <div className="flex justify-between items-center text-white/90">
                        <span>Sous-total produits</span>
                        <span className="font-medium">{formatCurrency(paiement.order.subtotalProduits || paiement.order.originalAmount)}</span>
                      </div>
                      
                      {/* Remise */}
                      {paiement.order.discount > 0 && (
                        <div className="flex justify-between items-center text-emerald-200">
                          <span>Remise appliquée</span>
                          <span className="font-medium">-{formatCurrency(paiement.order.discount)}</span>
                        </div>
                      )}
                      
                      {/* TVA */}
                      {paiement.order.taxAmount !== undefined && paiement.order.taxAmount > 0 && (
                        <div className="flex justify-between items-center text-white/90">
                          <span>TVA ({((paiement.order.taxRate || 0.2) * 100).toFixed(0)}%)</span>
                          <span className="font-medium">{formatCurrency(paiement.order.taxAmount)}</span>
                        </div>
                      )}
                      
                      {/* Frais de livraison */}
                      {paiement.order.deliveryPrice !== undefined && paiement.order.deliveryPrice > 0 && (
                        <div className="flex justify-between items-center text-white/90">
                          <span className="flex items-center gap-2">
                            <Truck className="w-4 h-4" />
                            Frais de livraison
                          </span>
                          <span className="font-medium">{formatCurrency(paiement.order.deliveryPrice)}</span>
                        </div>
                      )}
                    </div>

                    <Separator className="bg-white/20 my-4" />

                    <div className="flex justify-between items-center">
                      <span className="text-xl font-bold">Montant total à rembourser</span>
                      <span className="text-3xl font-bold">
                        {formatCurrency(paiement.order.totalAmount)}
                      </span>
                    </div>
                  </div>

                  {/* Reason */}
                  <div className="p-5 bg-amber-50 dark:bg-amber-950/30 rounded-xl border border-amber-200 dark:border-amber-900">
                    <h4 className="font-semibold mb-2 flex items-center gap-2 text-amber-700 dark:text-amber-400">
                      <Receipt className="w-4 h-4" />
                      Raison du remboursement
                    </h4>
                    <p className="text-amber-800 dark:text-amber-300">{paiement.reason}</p>
                    {paiement.customReason && (
                      <p className="text-amber-600 dark:text-amber-500 mt-2 text-sm italic">"{paiement.customReason}"</p>
                    )}
                  </div>

                  {/* Dates */}
                  <div className="flex flex-col md:flex-row gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2 bg-muted/50 px-4 py-2 rounded-lg">
                      <Clock className="h-4 w-4" />
                      Créé le: {formatDate(paiement.createdAt)}
                    </div>
                    <div className="flex items-center gap-2 bg-muted/50 px-4 py-2 rounded-lg">
                      <Clock className="h-4 w-4" />
                      Mis à jour: {formatDate(paiement.updatedAt)}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default PaiementRemboursementPage;
