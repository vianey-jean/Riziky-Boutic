
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import Layout from '@/components/layout/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar, 
  Shield, 
  Edit, 
  Save, 
  X,
  Settings,
  Bell,
  Lock,
  CreditCard,
  Heart,
  ShoppingBag,
  Star
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const ProfilPage: React.FC = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    nom: user?.nom || '',
    prenom: user?.prenom || '',
    email: user?.email || '',
    telephone: user?.telephone || '',
    adresse: user?.adresse || '',
    ville: user?.ville || '',
    codePostal: user?.codePostal || '',
    pays: user?.pays || 'France'
  });

  const handleSave = async () => {
    try {
      // TODO: Implement user update logic
      setIsEditing(false);
      toast({
        title: "Profil mis à jour",
        description: "Vos informations ont été sauvegardées avec succès.",
      });
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour le profil.",
        variant: "destructive",
      });
    }
  };

  const handleCancel = () => {
    setFormData({
      nom: user?.nom || '',
      prenom: user?.prenom || '',
      email: user?.email || '',
      telephone: user?.telephone || '',
      adresse: user?.adresse || '',
      ville: user?.ville || '',
      codePostal: user?.codePostal || '',
      pays: user?.pays || 'France'
    });
    setIsEditing(false);
  };

  if (!user) {
    return (
      <Layout>
        <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-orange-50 py-12">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-center min-h-[400px]">
              <div className="text-center space-y-6">
                <div className="bg-gradient-to-br from-red-100 to-orange-200 p-8 rounded-3xl w-fit mx-auto">
                  <User className="h-16 w-16 text-red-500 mx-auto" />
                </div>
                <div className="space-y-2">
                  <h2 className="text-2xl font-bold text-red-600">Accès refusé</h2>
                  <p className="text-gray-600">Vous devez être connecté pour accéder à cette page</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-12">
        <div className="container mx-auto px-4 space-y-8">
          {/* Enhanced Header */}
          <div className="bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700 rounded-3xl p-8 text-white shadow-2xl relative overflow-hidden">
            <div className="absolute inset-0 bg-black/10"></div>
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-32 translate-x-32"></div>
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-24 -translate-x-24"></div>
            
            <div className="relative z-10">
              <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between">
                <div className="flex items-center space-x-6 mb-6 lg:mb-0">
                  <div className="bg-white/20 backdrop-blur-sm p-6 rounded-3xl">
                    <User className="h-16 w-16 text-white" />
                  </div>
                  <div>
                    <h1 className="text-4xl font-bold mb-2">Mon Profil</h1>
                    <p className="text-blue-100 text-lg">
                      Gérez vos informations personnelles
                    </p>
                    <div className="flex items-center space-x-3 mt-3">
                      <Badge className="bg-white/20 backdrop-blur-sm text-white border-white/30">
                        <Shield className="h-4 w-4 mr-1" />
                        {user.role === 'admin' ? 'Administrateur' : 'Client'}
                      </Badge>
                      <Badge className="bg-green-500/80 backdrop-blur-sm text-white border-green-400/30">
                        <Calendar className="h-4 w-4 mr-1" />
                        Membre depuis {new Date(user.dateCreation).getFullYear()}
                      </Badge>
                    </div>
                  </div>
                </div>
                
                {!isEditing ? (
                  <Button 
                    onClick={() => setIsEditing(true)}
                    size="lg"
                    className="bg-white text-blue-600 hover:bg-blue-50 border-0 shadow-xl font-semibold px-8 py-3 rounded-xl transition-all duration-300 hover:scale-105"
                  >
                    <Edit className="h-5 w-5 mr-2" />
                    Modifier le profil
                  </Button>
                ) : (
                  <div className="flex space-x-3">
                    <Button 
                      onClick={handleSave}
                      size="lg"
                      className="bg-green-500 hover:bg-green-600 text-white border-0 shadow-xl font-semibold px-6 py-3 rounded-xl transition-all duration-300 hover:scale-105"
                    >
                      <Save className="h-5 w-5 mr-2" />
                      Sauvegarder
                    </Button>
                    <Button 
                      onClick={handleCancel}
                      variant="outline"
                      size="lg"
                      className="bg-white/20 backdrop-blur-sm border-white/30 text-white hover:bg-white/30 font-semibold px-6 py-3 rounded-xl transition-all duration-300"
                    >
                      <X className="h-5 w-5 mr-2" />
                      Annuler
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Profile Card */}
            <div className="lg:col-span-2">
              <Card className="border-0 shadow-2xl bg-white overflow-hidden">
                <CardHeader className="bg-gradient-to-r from-gray-50 to-white border-b border-gray-200 pb-6">
                  <CardTitle className="text-2xl text-gray-900 flex items-center">
                    <User className="h-6 w-6 mr-3 text-blue-600" />
                    Informations personnelles
                  </CardTitle>
                  <CardDescription className="text-gray-600">
                    Vos données personnelles et coordonnées
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="prenom" className="text-sm font-semibold text-gray-700">
                        Prénom
                      </Label>
                      {isEditing ? (
                        <Input
                          id="prenom"
                          value={formData.prenom}
                          onChange={(e) => setFormData({...formData, prenom: e.target.value})}
                          className="h-12 border-2 focus:border-blue-500 transition-colors"
                        />
                      ) : (
                        <div className="h-12 flex items-center px-4 bg-gray-50 rounded-lg border border-gray-200">
                          <span className="text-gray-900 font-medium">{user.prenom}</span>
                        </div>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="nom" className="text-sm font-semibold text-gray-700">
                        Nom
                      </Label>
                      {isEditing ? (
                        <Input
                          id="nom"
                          value={formData.nom}
                          onChange={(e) => setFormData({...formData, nom: e.target.value})}
                          className="h-12 border-2 focus:border-blue-500 transition-colors"
                        />
                      ) : (
                        <div className="h-12 flex items-center px-4 bg-gray-50 rounded-lg border border-gray-200">
                          <span className="text-gray-900 font-medium">{user.nom}</span>
                        </div>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-sm font-semibold text-gray-700 flex items-center">
                        <Mail className="h-4 w-4 mr-1" />
                        Email
                      </Label>
                      {isEditing ? (
                        <Input
                          id="email"
                          type="email"
                          value={formData.email}
                          onChange={(e) => setFormData({...formData, email: e.target.value})}
                          className="h-12 border-2 focus:border-blue-500 transition-colors"
                        />
                      ) : (
                        <div className="h-12 flex items-center px-4 bg-gray-50 rounded-lg border border-gray-200">
                          <span className="text-gray-900 font-medium">{user.email}</span>
                        </div>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="telephone" className="text-sm font-semibold text-gray-700 flex items-center">
                        <Phone className="h-4 w-4 mr-1" />
                        Téléphone
                      </Label>
                      {isEditing ? (
                        <Input
                          id="telephone"
                          value={formData.telephone}
                          onChange={(e) => setFormData({...formData, telephone: e.target.value})}
                          className="h-12 border-2 focus:border-blue-500 transition-colors"
                        />
                      ) : (
                        <div className="h-12 flex items-center px-4 bg-gray-50 rounded-lg border border-gray-200">
                          <span className="text-gray-900 font-medium">{user.telephone || 'Non renseigné'}</span>
                        </div>
                      )}
                    </div>

                    <div className="md:col-span-2 space-y-2">
                      <Label htmlFor="adresse" className="text-sm font-semibold text-gray-700 flex items-center">
                        <MapPin className="h-4 w-4 mr-1" />
                        Adresse
                      </Label>
                      {isEditing ? (
                        <Input
                          id="adresse"
                          value={formData.adresse}
                          onChange={(e) => setFormData({...formData, adresse: e.target.value})}
                          className="h-12 border-2 focus:border-blue-500 transition-colors"
                        />
                      ) : (
                        <div className="h-12 flex items-center px-4 bg-gray-50 rounded-lg border border-gray-200">
                          <span className="text-gray-900 font-medium">{user.adresse || 'Non renseignée'}</span>
                        </div>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="ville" className="text-sm font-semibold text-gray-700">
                        Ville
                      </Label>
                      {isEditing ? (
                        <Input
                          id="ville"
                          value={formData.ville}
                          onChange={(e) => setFormData({...formData, ville: e.target.value})}
                          className="h-12 border-2 focus:border-blue-500 transition-colors"
                        />
                      ) : (
                        <div className="h-12 flex items-center px-4 bg-gray-50 rounded-lg border border-gray-200">
                          <span className="text-gray-900 font-medium">{user.ville || 'Non renseignée'}</span>
                        </div>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="codePostal" className="text-sm font-semibold text-gray-700">
                        Code postal
                      </Label>
                      {isEditing ? (
                        <Input
                          id="codePostal"
                          value={formData.codePostal}
                          onChange={(e) => setFormData({...formData, codePostal: e.target.value})}
                          className="h-12 border-2 focus:border-blue-500 transition-colors"
                        />
                      ) : (
                        <div className="h-12 flex items-center px-4 bg-gray-50 rounded-lg border border-gray-200">
                          <span className="text-gray-900 font-medium">{user.codePostal || 'Non renseigné'}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Account Stats */}
              <Card className="border-0 shadow-xl bg-gradient-to-br from-green-50 to-emerald-100">
                <CardHeader className="pb-4">
                  <CardTitle className="text-lg text-green-800 flex items-center">
                    <Star className="h-5 w-5 mr-2" />
                    Statistiques du compte
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <ShoppingBag className="h-5 w-5 text-green-600 mr-2" />
                      <span className="text-green-700">Commandes</span>
                    </div>
                    <Badge className="bg-green-500 text-white">12</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Heart className="h-5 w-5 text-green-600 mr-2" />
                      <span className="text-green-700">Favoris</span>
                    </div>
                    <Badge className="bg-green-500 text-white">5</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Star className="h-5 w-5 text-green-600 mr-2" />
                      <span className="text-green-700">Avis laissés</span>
                    </div>
                    <Badge className="bg-green-500 text-white">8</Badge>
                  </div>
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <Card className="border-0 shadow-xl bg-gradient-to-br from-blue-50 to-purple-100">
                <CardHeader className="pb-4">
                  <CardTitle className="text-lg text-blue-800 flex items-center">
                    <Settings className="h-5 w-5 mr-2" />
                    Actions rapides
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button variant="outline" className="w-full justify-start border-blue-200 text-blue-700 hover:bg-blue-50">
                    <Lock className="h-4 w-4 mr-2" />
                    Changer le mot de passe
                  </Button>
                  <Button variant="outline" className="w-full justify-start border-purple-200 text-purple-700 hover:bg-purple-50">
                    <Bell className="h-4 w-4 mr-2" />
                    Notifications
                  </Button>
                  <Button variant="outline" className="w-full justify-start border-green-200 text-green-700 hover:bg-green-50">
                    <CreditCard className="h-4 w-4 mr-2" />
                    Moyens de paiement
                  </Button>
                </CardContent>
              </Card>

              {/* Security Info */}
              <Card className="border-0 shadow-xl bg-gradient-to-br from-yellow-50 to-orange-100">
                <CardHeader className="pb-4">
                  <CardTitle className="text-lg text-orange-800 flex items-center">
                    <Shield className="h-5 w-5 mr-2" />
                    Sécurité
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="text-sm text-orange-700">
                    <p>Dernière connexion :</p>
                    <p className="font-semibold">Aujourd'hui, 14:30</p>
                  </div>
                  <div className="text-sm text-orange-700">
                    <p>Compte créé le :</p>
                    <p className="font-semibold">
                      {new Date(user.dateCreation).toLocaleDateString('fr-FR')}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ProfilPage;
