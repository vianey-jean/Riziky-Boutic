
import React, { useState, useEffect } from 'react';
import AdminLayout from './AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
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
  User,
  Mail,
  RefreshCw,
  Sparkles,
  Shield,
  BadgePercent,
  Banknote,
  ArrowRight,
  TrendingUp,
  DollarSign,
  Users,
  AlertCircle
} from 'lucide-react';
import { io } from 'socket.io-client';

const AdminPaiementRemboursementPage: React.FC = () => {
  const [paiements, setPaiements] = useState<PaiementRemboursement[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  useEffect(() => {
    loadPaiements();
    
    const socket = io(import.meta.env.VITE_API_BASE_URL || 'http://localhost:10000');
    
    socket.on('paiement-remboursement-created', (newPaiement: PaiementRemboursement) => {
      if (newPaiement.decision === 'accepté') {
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
  }, []);

  const loadPaiements = async () => {
    try {
      setLoading(true);
      const response = await paiementRemboursementAPI.getAll();
      setPaiements(response.data);
    } catch (error) {
      console.error('Erreur chargement paiements:', error);
      toast.error('Erreur lors du chargement des paiements');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (id: string, newStatus: string) => {
    try {
      setUpdatingId(id);
      await paiementRemboursementAPI.updateStatus(id, newStatus);
      toast.success('Statut mis à jour avec succès');
    } catch (error) {
      console.error('Erreur mise à jour statut:', error);
      toast.error('Erreur lors de la mise à jour du statut');
    } finally {
      setUpdatingId(null);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'debut':
        return (
          <Badge className="bg-gradient-to-r from-amber-400 to-orange-500 text-white border-0 shadow-lg shadow-amber-500/30 px-4 py-1">
            <Clock className="w-3 h-3 mr-1" />
            Début
          </Badge>
        );
      case 'en cours':
        return (
          <Badge className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white border-0 shadow-lg shadow-blue-500/30 px-4 py-1">
            <ArrowRight className="w-3 h-3 mr-1" />
            En cours
          </Badge>
        );
      case 'payé':
        return (
          <Badge className="bg-gradient-to-r from-emerald-500 to-green-600 text-white border-0 shadow-lg shadow-emerald-500/30 px-4 py-1">
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

  // Calculs des statistiques
  const totalAmount = paiements.reduce((sum, p) => sum + (p.order?.totalAmount || 0), 0);
  const paidCount = paiements.filter(p => p.status === 'payé').length;
  const inProgressCount = paiements.filter(p => p.status === 'en cours').length;
  const pendingCount = paiements.filter(p => p.status === 'debut').length;

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
          <div className="relative">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-primary/20 border-t-primary"></div>
            <Sparkles className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-6 w-6 text-primary animate-pulse" />
          </div>
          <p className="text-muted-foreground animate-pulse">Chargement des remboursements...</p>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-8">
        {/* Premium Header */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-violet-600 via-purple-600 to-fuchsia-600 p-8 shadow-2xl">
          <div className="absolute inset-0 opacity-50 bg-gradient-to-br from-white/5 to-transparent"></div>
          
          <div className="relative z-10">
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 mb-8">
              <div className="flex items-center gap-4">
                <div className="bg-white/20 backdrop-blur-sm p-4 rounded-2xl">
                  <Banknote className="h-10 w-10 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
                    Gestion des Remboursements
                  </h1>
                  <p className="text-white/80 flex items-center gap-2">
                    <Shield className="w-4 h-4" />
                    Administration des paiements de remboursement
                  </p>
                </div>
              </div>
              <Button 
                onClick={loadPaiements} 
                variant="outline" 
                className="bg-white/10 border-white/30 text-white hover:bg-white/20 backdrop-blur-sm"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Actualiser
              </Button>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white/15 backdrop-blur-md rounded-2xl p-4 border border-white/20">
                <div className="flex items-center gap-3">
                  <div className="bg-white/20 p-2 rounded-xl">
                    <Receipt className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <p className="text-white/70 text-sm">Total</p>
                    <p className="text-2xl font-bold text-white">{paiements.length}</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white/15 backdrop-blur-md rounded-2xl p-4 border border-white/20">
                <div className="flex items-center gap-3">
                  <div className="bg-amber-500/30 p-2 rounded-xl">
                    <AlertCircle className="h-5 w-5 text-amber-200" />
                  </div>
                  <div>
                    <p className="text-white/70 text-sm">En attente</p>
                    <p className="text-2xl font-bold text-white">{pendingCount}</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white/15 backdrop-blur-md rounded-2xl p-4 border border-white/20">
                <div className="flex items-center gap-3">
                  <div className="bg-blue-500/30 p-2 rounded-xl">
                    <TrendingUp className="h-5 w-5 text-blue-200" />
                  </div>
                  <div>
                    <p className="text-white/70 text-sm">En cours</p>
                    <p className="text-2xl font-bold text-white">{inProgressCount}</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white/15 backdrop-blur-md rounded-2xl p-4 border border-white/20">
                <div className="flex items-center gap-3">
                  <div className="bg-emerald-500/30 p-2 rounded-xl">
                    <DollarSign className="h-5 w-5 text-emerald-200" />
                  </div>
                  <div>
                    <p className="text-white/70 text-sm">Montant total</p>
                    <p className="text-2xl font-bold text-white">{formatCurrency(totalAmount)}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {paiements.length === 0 ? (
          <Card className="overflow-hidden border-0 shadow-2xl">
            <div className="bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-12 text-center">
              <div className="bg-white/10 backdrop-blur-sm p-6 rounded-full w-fit mx-auto mb-6">
                <Receipt className="h-16 w-16 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-3">Aucun remboursement en attente</h2>
              <p className="text-white/70">Tous les remboursements ont été traités.</p>
            </div>
          </Card>
        ) : (
          <div className="space-y-6">
            {paiements.map((paiement) => (
              <Card key={paiement.id} className="overflow-hidden border-0 shadow-xl hover:shadow-2xl transition-all duration-500 bg-card/80 backdrop-blur-sm">
                <CardHeader className="bg-gradient-to-r from-slate-50 via-white to-slate-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 border-b">
                  <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <div className="bg-gradient-to-br from-violet-500 to-purple-600 p-3 rounded-xl shadow-lg">
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
                    <div className="flex flex-wrap items-center gap-4">
                      {getStatusBadge(paiement.status)}
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-muted-foreground">Statut:</span>
                        <Select
                          value={paiement.status}
                          onValueChange={(value) => handleStatusChange(paiement.id, value)}
                          disabled={updatingId === paiement.id}
                        >
                          <SelectTrigger className="w-[150px] bg-background border-2">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="debut">
                              <div className="flex items-center gap-2">
                                <Clock className="h-4 w-4 text-amber-500" />
                                Début
                              </div>
                            </SelectItem>
                            <SelectItem value="en cours">
                              <div className="flex items-center gap-2">
                                <ArrowRight className="h-4 w-4 text-blue-500" />
                                En cours
                              </div>
                            </SelectItem>
                            <SelectItem value="payé">
                              <div className="flex items-center gap-2">
                                <CheckCircle className="h-4 w-4 text-emerald-500" />
                                Payé
                              </div>
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      {paiement.clientValidated && (
                        <Badge className="bg-gradient-to-r from-emerald-500 to-green-600 text-white border-0 shadow-lg">
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Validé par client
                        </Badge>
                      )}
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent className="p-6 space-y-6">
                  {/* Client Info */}
                  <div className="bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-950/30 dark:to-purple-950/30 p-5 rounded-2xl border border-indigo-100 dark:border-indigo-900">
                    <h3 className="font-semibold mb-4 flex items-center gap-2 text-indigo-700 dark:text-indigo-300">
                      <Users className="h-5 w-5" />
                      Informations client
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="flex items-center gap-3 bg-white dark:bg-slate-800 p-3 rounded-xl shadow-sm">
                        <User className="h-5 w-5 text-indigo-500" />
                        <span className="font-medium">{paiement.userName}</span>
                      </div>
                      <div className="flex items-center gap-3 bg-white dark:bg-slate-800 p-3 rounded-xl shadow-sm">
                        <Mail className="h-5 w-5 text-indigo-500" />
                        <span className="text-muted-foreground">{paiement.userEmail}</span>
                      </div>
                    </div>
                  </div>

                  {/* Progress Bar */}
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
                  <div className="flex items-center gap-4 p-4 bg-blue-50 dark:bg-blue-950/30 rounded-xl border border-blue-100 dark:border-blue-900">
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
                  <div className="bg-gradient-to-br from-violet-500 via-purple-500 to-fuchsia-500 p-6 rounded-2xl text-white shadow-2xl shadow-purple-500/20">
                    <h3 className="font-semibold mb-4 flex items-center gap-2 text-white/90">
                      <BadgePercent className="h-5 w-5" />
                      Détail du remboursement à payer
                    </h3>
                    
                    <div className="space-y-3 mb-4">
                      {/* Sous-total produits */}
                      <div className="flex justify-between items-center text-white/90">
                        <span>Sous-total produits</span>
                        <span className="font-medium">{formatCurrency(paiement.order.subtotalProduits || paiement.order.originalAmount)}</span>
                      </div>
                      
                      {/* Remise */}
                      {paiement.order.discount > 0 && (
                        <div className="flex justify-between items-center text-fuchsia-200">
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
                      <span className="text-xl font-bold">TOTAL À REMBOURSER</span>
                      <span className="text-3xl font-bold">
                        {formatCurrency(paiement.order.totalAmount)}
                      </span>
                    </div>
                    
                    <p className="text-white/70 text-sm mt-2">
                      Montant incluant les produits, TVA et frais de livraison
                    </p>
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
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminPaiementRemboursementPage;
