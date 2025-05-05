
import React, { useState, useEffect } from 'react';
import Layout from '@/components/layout/Layout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import PersonalInfoForm from '@/components/profile/PersonalInfoForm';
import PasswordForm from '@/components/profile/PasswordForm';
import PreferencesForm from '@/components/profile/PreferencesForm';
import { toast } from '@/components/ui/sonner';
import { useStore } from '@/contexts/StoreContext';
import { authAPI, UpdateProfileData } from '@/services/api';

const ProfilePage = () => {
  const { user, isAuthenticated, loading: authLoading } = useAuth();
  const { orders, fetchOrders } = useStore();
  const [activeTab, setActiveTab] = useState('info');
  const [loading, setLoading] = useState(false);
  const [profileData, setProfileData] = useState<UpdateProfileData>({
    nom: user?.nom || '',
    prenom: user?.prenom || '',
    adresse: user?.adresse || '',
    ville: user?.ville || '',
    codePostal: user?.codePostal || '',
    pays: user?.pays || '',
    telephone: user?.telephone || '',
    genre: (user?.genre as "homme" | "femme" | "autre") || 'autre',
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
        adresse: user.adresse || '',
        ville: user.ville || '',
        codePostal: user.codePostal || '',
        pays: user.pays || '',
        telephone: user.telephone || '',
        genre: (user.genre || 'autre') as "homme" | "femme" | "autre",
      });
      
      fetchOrders();
    }
  }, [isAuthenticated, authLoading, user]);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    if (name === 'genre') {
      // Ensure genre value is one of the allowed types
      const genreValue = value as "homme" | "femme" | "autre";
      setProfileData(prev => ({ ...prev, [name]: genreValue }));
    } else {
      setProfileData(prev => ({ ...prev, [name]: value }));
    }
  };
  
  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    
    setLoading(true);
    try {
      // Type casting for genre to ensure it matches the expected type
      const updatedProfile: UpdateProfileData = {
        nom: profileData.nom,
        prenom: profileData.prenom,
        adresse: profileData.adresse,
        ville: profileData.ville,
        codePostal: profileData.codePostal,
        pays: profileData.pays,
        telephone: profileData.telephone,
        genre: profileData.genre as 'homme' | 'femme' | 'autre',
      };
      
      await authAPI.updateProfile(user.id, updatedProfile);
      
      toast.success('Profil mis à jour avec succès');
    } catch (error) {
      console.error('Erreur lors de la mise à jour du profil:', error);
      toast.error('Erreur lors de la mise à jour du profil');
    } finally {
      setLoading(false);
    }
  };
  
  const handlePasswordUpdate = async (currentPassword: string, newPassword: string): Promise<boolean> => {
    setLoading(true);
    try {
      if (!user) throw new Error('Utilisateur non connecté');
      
      await authAPI.updatePassword(user.id, currentPassword, newPassword);
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
                  
                  <PersonalInfoForm
                    profileData={profileData}
                    loading={loading}
                    handleProfileChange={handleChange}
                    handleProfileSubmit={handleProfileSubmit}
                  />
                </Card>
              </TabsContent>
              
              <TabsContent value="security" className="mt-6">
                <PasswordForm 
                  loading={loading}
                  onPasswordChange={handlePasswordUpdate}
                />
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
