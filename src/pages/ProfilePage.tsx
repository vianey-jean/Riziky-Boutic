
import React, { useState, useEffect } from 'react';
import Layout from '@/components/layout/Layout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import PersonalInfoForm from '@/components/profile/PersonalInfoForm';
import PasswordForm from '@/components/profile/PasswordForm';
import PreferencesForm from '@/components/profile/PreferencesForm';
import { UserCircle2, File, Bell, ShoppingBag } from 'lucide-react';
import { toast } from '@/components/ui/sonner';
import { Link } from 'react-router-dom';
import { useStore } from '@/contexts/StoreContext';
import { authAPI } from '@/services/api';

const ProfilePage = () => {
  const { user, isAuthenticated, logout, loading: authLoading } = useAuth();
  const { orders, fetchOrders } = useStore();
  const [activeTab, setActiveTab] = useState('info');
  const [loading, setLoading] = useState(false);
  const [profileData, setProfileData] = useState({
    nom: user?.nom || '',
    prenom: user?.prenom || '',
    email: user?.email || '',
    adresse: user?.adresse || '',
    ville: user?.ville || '',
    codePostal: user?.codePostal || '',
    pays: user?.pays || '',
    telephone: user?.telephone || '',
    genre: user?.genre || '',
  });
  
  const navigate = useNavigate();
  
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      navigate('/login');
    }
    
    if (user) {
      setProfileData({
        nom: user.nom || '',
        prenom: user.prenom || '',
        email: user.email || '',
        adresse: user.adresse || '',
        ville: user.ville || '',
        codePostal: user.codePostal || '',
        pays: user.pays || '',
        telephone: user.telephone || '',
        genre: user.genre || '',
      });
      
      fetchOrders();
    }
  }, [isAuthenticated, authLoading, user]);
  
  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfileData({ ...profileData, [name]: value });
  };
  
  const handleGenreChange = (value: string) => {
    setProfileData({ ...profileData, genre: value });
  };
  
  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    
    setLoading(true);
    try {
      await authAPI.updateProfile(user.id, {
        nom: profileData.nom,
        prenom: profileData.prenom,
        adresse: profileData.adresse,
        ville: profileData.ville,
        codePostal: profileData.codePostal,
        pays: profileData.pays,
        telephone: profileData.telephone,
        genre: profileData.genre as 'homme' | 'femme' | 'autre' | undefined,
      });
      
      toast.success('Profil mis à jour avec succès');
    } catch (error) {
      console.error('Erreur lors de la mise à jour du profil:', error);
      toast.error('Erreur lors de la mise à jour du profil');
    } finally {
      setLoading(false);
    }
  };
  
  const handlePasswordUpdate = async (currentPassword: string, newPassword: string) => {
    setLoading(true);
    try {
      await authAPI.updatePassword(currentPassword, newPassword);
      toast.success('Mot de passe mis à jour avec succès');
      return true;
    } catch (error) {
      console.error('Erreur lors de la mise à jour du mot de passe:', error);
      toast.error('Erreur lors de la mise à jour du mot de passe');
      return false;
    } finally {
      setLoading(false);
    }
  };
  
  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };
  
  return (
    <Layout>
      <div className="container px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Mon Compte</h1>
        
        <div className="grid gap-6 md:grid-cols-[250px_1fr]">
       
          
          <div className="md:col-span-2">
            <Tabs defaultValue="informations">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="informations">Informations personnelles</TabsTrigger>
                <TabsTrigger value="security">Sécurité</TabsTrigger>
                <TabsTrigger value="preferences">Préférences</TabsTrigger>
              </TabsList>
              
              <TabsContent value="informations" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Informations personnelles</CardTitle>
                    <CardDescription>Modifiez vos informations personnelles</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <PersonalInfoForm
                      profileData={profileData}
                      loading={loading}
                      handleProfileChange={handleProfileChange}
                      handleGenreChange={handleGenreChange}
                      handleProfileSubmit={handleProfileSubmit}
                    />
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="security" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Sécurité</CardTitle>
                    <CardDescription>Modifiez vos informations de sécurité</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <PasswordForm
                      loading={loading}
                      onPasswordChange={handlePasswordUpdate}
                    />
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="preferences" className="mt-6">
                <PreferencesForm />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ProfilePage;
