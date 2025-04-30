
import React, { useState, useEffect } from 'react';
import Layout from '@/components/layout/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/components/ui/sonner';
import { UpdateProfileData } from '@/services/api';
import PersonalInfoForm from '@/components/profile/PersonalInfoForm';
import PasswordForm from '@/components/profile/PasswordForm';
import PreferencesForm from '@/components/profile/PreferencesForm';

const ProfilePage = () => {
  const { user, updateProfile } = useAuth();
  const [profileData, setProfileData] = useState<UpdateProfileData & { id?: string }>({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      const { nom, prenom, adresse, ville, codePostal, pays, telephone, genre } = user;
      setProfileData({ nom, prenom, adresse, ville, codePostal, pays, telephone, genre });
    }
  }, [user]);

  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfileData(prev => ({ ...prev, [name]: value }));
  };

  const handleGenreChange = (value: string) => {
    setProfileData(prev => ({ ...prev, genre: value as 'homme' | 'femme' | 'autre' }));
  };

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      await updateProfile(profileData);
    } catch (error) {
      console.error('Erreur lors de la mise à jour du profil:', error);
      // Error toast already shown in the auth context
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordUpdate = () => {
    // This function is called when the password is successfully updated
    setLoading(false);
  };

  if (!user) {
    return (
      <Layout>
        <div className="max-w-3xl mx-auto p-4">
          <Card>
            <CardHeader>
              <CardTitle>Profil utilisateur</CardTitle>
              <CardDescription>Vous devez être connecté pour accéder à cette page</CardDescription>
            </CardHeader>
          </Card>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-3xl mx-auto p-4">
        <h1 className="text-3xl font-bold mb-6">Profil utilisateur</h1>
        
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
    </Layout>
  );
};

export default ProfilePage;