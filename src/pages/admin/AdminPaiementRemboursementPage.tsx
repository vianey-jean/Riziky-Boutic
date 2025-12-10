
import React, { useState, useEffect, useCallback } from 'react';
import AdminLayout from './AdminLayout';
import PageDataLoader from '@/components/layout/PageDataLoader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
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
  AlertCircle,
  Search,
  X,
  Eye,
  Calendar
} from 'lucide-react';
import { io } from 'socket.io-client';

const AdminPaiementRemboursementPage: React.FC = () => {
  const [paiements, setPaiements] = useState<PaiementRemboursement[]>([]);
  const [allPaiements, setAllPaiements] = useState<PaiementRemboursement[]>([]);
  const [dataLoaded, setDataLoaded] = useState(false);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<PaiementRemboursement[]>([]);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [selectedPaiement, setSelectedPaiement] = useState<PaiementRemboursement | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);

  // Socket connection for real-time updates
  useEffect(() => {
    const socket = io(import.meta.env.VITE_API_BASE_URL || 'http://localhost:10000');
    
    socket.on('paiement-remboursement-created', (newPaiement: PaiementRemboursement) => {
      if (newPaiement.decision === 'accepté') {
        setAllPaiements(prev => [...prev, newPaiement]);
        if (!newPaiement.clientValidated) {
          setPaiements(prev => [...prev, newPaiement]);
        }
      }
    });
    
    socket.on('paiement-remboursement-updated', (updatedPaiement: PaiementRemboursement) => {
      setAllPaiements(prev => prev.map(p => 
        p.id === updatedPaiement.id ? updatedPaiement : p
      ));
      // Si client a validé, retirer de la liste active
      if (updatedPaiement.clientValidated) {
        setPaiements(prev => prev.filter(p => p.id !== updatedPaiement.id));
      } else {
        setPaiements(prev => prev.map(p => 
          p.id === updatedPaiement.id ? updatedPaiement : p
        ));
      }
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  // Recherche après 3 caractères
  useEffect(() => {
    if (searchQuery.length >= 3) {
      const results = allPaiements.filter(p => 
        p.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.orderId.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.remboursementId?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.userName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.userEmail?.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setSearchResults(results);
      setShowSearchResults(true);
    } else {
      setSearchResults([]);
      setShowSearchResults(false);
    }
  }, [searchQuery, allPaiements]);

  const fetchPaiements = useCallback(async () => {
    const response = await paiementRemboursementAPI.getAll();
    return response.data;
  }, []);

  const handleDataLoaded = useCallback((data: PaiementRemboursement[]) => {
    setAllPaiements(data);
    // Filtrer pour n'afficher que les paiements non validés par le client
    const activePaiements = data.filter((p: PaiementRemboursement) => !p.clientValidated);
    setPaiements(activePaiements);
    setDataLoaded(true);
  }, []);

  const loadPaiements = async () => {
    try {
      setDataLoaded(false);
      const response = await paiementRemboursementAPI.getAll();
      setAllPaiements(response.data);
      const activePaiements = response.data.filter((p: PaiementRemboursement) => !p.clientValidated);
      setPaiements(activePaiements);
      setDataLoaded(true);
    } catch (error) {
      console.error('Erreur chargement paiements:', error);
      toast.error('Erreur lors du chargement des paiements');
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

  const openDetailModal = (paiement: PaiementRemboursement) => {
    setSelectedPaiement(paiement);
    setShowDetailModal(true);
    setShowSearchResults(false);
    setSearchQuery('');
  };

  const getStatusBadge = (status: string, clientValidated?: boolean) => {
    if (clientValidated) {
      return (
        <Badge className="bg-gradient-to-r from-emerald-500 to-green-600 text-white border-0 shadow-lg shadow-emerald-500/30 px-4 py-1">
          <CheckCircle className="w-3 h-3 mr-1" />
          Confirmé par client
        </Badge>
      );
    }
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
          <Badge className="bg-gradient-to-r from-emerald-500 to-green-600 text-white border-0 shadow-lg shadow-emerald-500/30 px-4 py-1 animate-pulse">
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
  const confirmedCount = allPaiements.filter(p => p.clientValidated).length;

  // Show PageDataLoader until data is loaded
  if (!dataLoaded) {
    return (
      <AdminLayout>
        <PageDataLoader
          fetchFunction={fetchPaiements}
          onSuccess={handleDataLoaded}
          loadingMessage="Chargement des remboursements..."
          loadingSubmessage="Récupération des données administrateur..."
          errorMessage="Erreur lors du chargement des remboursements"
        />
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
            <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
              <div className="bg-white/15 backdrop-blur-md rounded-2xl p-4 border border-white/20">
                <div className="flex items-center gap-3">
                  <div className="bg-white/20 p-2 rounded-xl">
                    <Receipt className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <p className="text-white/70 text-sm">Actifs</p>
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
                    <CheckCircle className="h-5 w-5 text-emerald-200" />
                  </div>
                  <div>
                    <p className="text-white/70 text-sm">Confirmés</p>
                    <p className="text-2xl font-bold text-white">{confirmedCount}</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white/15 backdrop-blur-md rounded-2xl p-4 border border-white/20">
                <div className="flex items-center gap-3">
                  <div className="bg-emerald-500/30 p-2 rounded-xl">
                    <DollarSign className="h-5 w-5 text-emerald-200" />
                  </div>
                  <div>
                    <p className="text-white/70 text-sm">Montant</p>
                    <p className="text-xl font-bold text-white">{formatCurrency(totalAmount)}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Barre de recherche */}
        <div className="relative">
          <div className="flex items-center gap-3 bg-card rounded-2xl shadow-xl p-4 border border-border">
            <Search className="w-6 h-6 text-purple-500" />
            <Input
              type="text"
              placeholder="Rechercher par numéro de remboursement, commande, nom ou email... (min. 3 caractères)"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 border-0 bg-transparent text-lg focus-visible:ring-0 focus-visible:ring-offset-0"
            />
            {searchQuery && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setSearchQuery('');
                  setShowSearchResults(false);
                }}
              >
                <X className="w-5 h-5" />
              </Button>
            )}
          </div>

          {/* Résultats de recherche dropdown */}
          {showSearchResults && searchResults.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-card rounded-xl shadow-2xl border border-border max-h-96 overflow-y-auto z-50">
              <div className="p-3 border-b border-border bg-muted/50">
                <p className="text-sm text-muted-foreground">{searchResults.length} résultat(s) trouvé(s)</p>
              </div>
              {searchResults.map((result) => (
                <div
                  key={result.id}
                  onClick={() => openDetailModal(result)}
                  className="p-4 hover:bg-purple-50 dark:hover:bg-purple-900/20 cursor-pointer border-b border-border last:border-0 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold">
                        {result.id}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Commande: {result.orderId}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {result.userName} - {result.userEmail}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      {getStatusBadge(result.status, result.clientValidated)}
                      <Eye className="w-5 h-5 text-purple-500" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {showSearchResults && searchResults.length === 0 && searchQuery.length >= 3 && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-card rounded-xl shadow-2xl border border-border p-6 z-50">
              <p className="text-center text-muted-foreground">Aucun résultat trouvé pour "{searchQuery}"</p>
            </div>
          )}
        </div>

        {paiements.length === 0 ? (
          <Card className="overflow-hidden border-0 shadow-2xl">
            <div className="bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-12 text-center">
              <div className="bg-white/10 backdrop-blur-sm p-6 rounded-full w-fit mx-auto mb-6">
                <Receipt className="h-16 w-16 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-3">Aucun remboursement actif</h2>
              <p className="text-white/70">Tous les remboursements ont été traités et confirmés par les clients.</p>
              <p className="text-white/50 text-sm mt-4">Utilisez la barre de recherche pour consulter l'historique.</p>
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
                      {getStatusBadge(paiement.status, paiement.clientValidated)}
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
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => openDetailModal(paiement)}
                        className="border-purple-300 text-purple-600 hover:bg-purple-50"
                      >
                        <Eye className="w-4 h-4 mr-2" />
                        Détails
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent className="p-6 space-y-6">
                  {/* Alerte si payé en attente de confirmation */}
                  {paiement.status === 'payé' && !paiement.clientValidated && (
                    <div className="bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-950/30 dark:to-orange-950/30 border-2 border-amber-300 dark:border-amber-800 rounded-2xl p-5">
                      <div className="flex items-center gap-3">
                        <div className="bg-amber-500 p-2 rounded-full animate-pulse">
                          <Clock className="h-5 w-5 text-white" />
                        </div>
                        <div>
                          <p className="font-bold text-amber-700 dark:text-amber-400">
                            ⏳ En attente de confirmation client
                          </p>
                          <p className="text-sm text-amber-600 dark:text-amber-500">
                            Le client doit confirmer la réception du paiement.
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

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

                  {/* Financial Summary Premium */}
                  <div className="bg-gradient-to-br from-violet-500 via-purple-500 to-fuchsia-500 p-6 rounded-2xl text-white shadow-2xl shadow-purple-500/20">
                    <h3 className="font-semibold mb-4 flex items-center gap-2 text-white/90">
                      <BadgePercent className="h-5 w-5" />
                      Montant à rembourser
                    </h3>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="bg-white/10 rounded-xl p-3">
                        <p className="text-white/70 text-sm">Produits</p>
                        <p className="font-bold text-lg">{formatCurrency(paiement.order.subtotalProduits || paiement.order.originalAmount)}</p>
                      </div>
                      <div className="bg-white/10 rounded-xl p-3">
                        <p className="text-white/70 text-sm">TVA</p>
                        <p className="font-bold text-lg">{formatCurrency(paiement.order.taxAmount || 0)}</p>
                      </div>
                      <div className="bg-white/10 rounded-xl p-3">
                        <p className="text-white/70 text-sm">Livraison</p>
                        <p className="font-bold text-lg">{formatCurrency(paiement.order.deliveryPrice || 0)}</p>
                      </div>
                      <div className="bg-white/20 rounded-xl p-3 border-2 border-white/30">
                        <p className="text-white/90 text-sm font-semibold">TOTAL</p>
                        <p className="font-bold text-xl">{formatCurrency(paiement.order.totalAmount)}</p>
                      </div>
                    </div>
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

        {/* Modal de détails */}
        <Dialog open={showDetailModal} onOpenChange={setShowDetailModal}>
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                Détails du Remboursement
              </DialogTitle>
            </DialogHeader>
            
            {selectedPaiement && (
              <div className="space-y-6">
                {/* Informations générales */}
                <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white p-6 rounded-xl">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-purple-200 text-sm">ID Remboursement</p>
                      <p className="font-bold">{selectedPaiement.id}</p>
                    </div>
                    <div>
                      <p className="text-purple-200 text-sm">ID Commande</p>
                      <p className="font-bold">{selectedPaiement.orderId}</p>
                    </div>
                    <div>
                      <p className="text-purple-200 text-sm">Statut</p>
                      <div className="mt-1">{getStatusBadge(selectedPaiement.status, selectedPaiement.clientValidated)}</div>
                    </div>
                    <div>
                      <p className="text-purple-200 text-sm">Décision</p>
                      <p className="font-bold capitalize">{selectedPaiement.decision || 'N/A'}</p>
                    </div>
                  </div>
                </div>

                {/* Informations client */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <User className="w-5 h-5 text-purple-600" />
                      Informations Client
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4 text-muted-foreground" />
                      <span>{selectedPaiement.userName}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4 text-muted-foreground" />
                      <span>{selectedPaiement.userEmail}</span>
                    </div>
                    {selectedPaiement.order?.shippingAddress && (
                      <div className="flex items-start gap-2">
                        <MapPin className="w-4 h-4 text-muted-foreground mt-1" />
                        <div>
                          <p>{selectedPaiement.order.shippingAddress.adresse}</p>
                          <p>{selectedPaiement.order.shippingAddress.codePostal} {selectedPaiement.order.shippingAddress.ville}</p>
                          <p>{selectedPaiement.order.shippingAddress.pays}</p>
                          {selectedPaiement.order.shippingAddress.telephone && (
                            <p className="flex items-center gap-1 mt-1">
                              <Phone className="w-3 h-3" />
                              {selectedPaiement.order.shippingAddress.telephone}
                            </p>
                          )}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Produits */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Package className="w-5 h-5 text-purple-600" />
                      Produits remboursés
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {selectedPaiement.order?.items?.map((item, index) => (
                        <div key={index} className="flex items-center gap-4 bg-muted/50 p-3 rounded-xl">
                          <img 
                            src={`${import.meta.env.VITE_API_BASE_URL}${item.image}`} 
                            alt={item.name}
                            className="w-16 h-16 rounded-lg object-cover"
                          />
                          <div className="flex-1">
                            <p className="font-medium">{item.name}</p>
                            <p className="text-sm text-muted-foreground">Qté: {item.quantity} × {formatCurrency(item.price)}</p>
                          </div>
                          <p className="font-bold text-purple-600">{formatCurrency(item.subtotal)}</p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Détails financiers */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Receipt className="w-5 h-5 text-purple-600" />
                      Détails Financiers
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Sous-total produits:</span>
                        <span className="font-medium">{formatCurrency(selectedPaiement.order?.subtotalProduits || selectedPaiement.order?.originalAmount || 0)}</span>
                      </div>
                      {selectedPaiement.order?.discount && selectedPaiement.order.discount > 0 && (
                        <div className="flex justify-between text-green-600">
                          <span>Réduction:</span>
                          <span>-{formatCurrency(selectedPaiement.order.discount)}</span>
                        </div>
                      )}
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">TVA ({((selectedPaiement.order?.taxRate || 0) * 100).toFixed(0)}%):</span>
                        <span className="font-medium">{formatCurrency(selectedPaiement.order?.taxAmount || 0)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Frais de livraison:</span>
                        <span className="font-medium">{formatCurrency(selectedPaiement.order?.deliveryPrice || 0)}</span>
                      </div>
                      <Separator />
                      <div className="flex justify-between text-xl">
                        <span className="font-bold">TOTAL REMBOURSÉ:</span>
                        <span className="font-bold text-green-600">{formatCurrency(selectedPaiement.order?.totalAmount || 0)}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Raison du remboursement */}
                <Card>
                  <CardHeader>
                    <CardTitle>Raison du remboursement</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="font-medium">{selectedPaiement.reason}</p>
                    {selectedPaiement.customReason && (
                      <p className="text-muted-foreground mt-2 italic">"{selectedPaiement.customReason}"</p>
                    )}
                  </CardContent>
                </Card>

                {/* Historique des dates */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Calendar className="w-5 h-5 text-purple-600" />
                      Historique
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Créé le:</span>
                        <span>{formatDate(selectedPaiement.createdAt)}</span>
                      </div>
                      {selectedPaiement.updatedAt && (
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Dernière mise à jour:</span>
                          <span>{formatDate(selectedPaiement.updatedAt)}</span>
                        </div>
                      )}
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Confirmé par client:</span>
                        <span className={selectedPaiement.clientValidated ? 'text-green-600 font-semibold' : 'text-amber-600'}>
                          {selectedPaiement.clientValidated ? 'Oui ✓' : 'Non - En attente'}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
};

export default AdminPaiementRemboursementPage;
