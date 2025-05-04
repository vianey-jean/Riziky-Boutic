
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
import { authAPI } from '@/services/api';

// Define the UpdateProfileData type here instead of importing it
type UpdateProfileData = {
  nom: string;
  prenom: string;
  email: string;
  adresse: string;
  ville: string;
  codePostal: string;
  pays: string;
  telephone: string;
  genre: "homme" | "femme" | "autre";
};

const ProfilePage = () => {
  const { user, isAuthenticated, loading: authLoading } = useAuth();
  const { orders, fetchOrders } = useStore();
  const [activeTab, setActiveTab] = useState('info');
  const [loading, setLoading] = useState(false);
  const [profileData, setProfileData] = useState<{
    nom: string;
    prenom: string;
    email: string;
    adresse: string;
    ville: string;
    codePostal: string;
    pays: string;
    telephone: string;
    genre: string;
  }>({
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
      // Ensure genre is of the correct type
      const genre = profileData.genre as "homme" | "femme" | "autre";
      if (!["homme", "femme", "autre"].includes(genre)) {
        throw new Error("Genre invalide");
      }
      
      const updatedProfile: UpdateProfileData = {
        nom: profileData.nom,
        prenom: profileData.prenom,
        email: profileData.email,
        adresse: profileData.adresse,
        ville: profileData.ville,
        codePostal: profileData.codePostal,
        pays: profileData.pays,
        telephone: profileData.telephone,
        genre: genre, // Properly typed now
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
                    profileData={profileData as UpdateProfileData & { id?: string }}
                    loading={loading}
                    handleProfileChange={handleProfileChange}
                    handleGenreChange={handleGenreChange}
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
