import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Layout from '@/components/layout/Layout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { EnhancedCard, EnhancedCardContent, EnhancedCardDescription, EnhancedCardHeader, EnhancedCardTitle } from '@/components/ui/enhanced-card';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import PersonalInfoForm from '@/components/profile/PersonalInfoForm';
import PasswordForm from '@/components/profile/PasswordForm';
import PreferencesForm from '@/components/profile/PreferencesForm';
import { toast } from '@/components/ui/sonner';
import { useStore } from '@/contexts/StoreContext';
import { authAPI } from '@/services/api';
import { UpdateProfileData } from '@/types/auth';
import { User, Shield, Settings } from 'lucide-react';

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
  
  const handleGenreChange = (value: string) => {
    // Ensure genre value is one of the allowed types
    const genreValue = value as "homme" | "femme" | "autre";
    setProfileData(prev => ({ ...prev, genre: genreValue }));
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

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  };
  
  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-red-50">
        {/* Hero Section */}
        <div className="relative overflow-hidden bg-gradient-to-r from-purple-600 via-pink-600 to-red-600 text-white py-24">
          <div className="absolute inset-0 bg-black/20"></div>
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="container mx-auto px-4 relative z-10"
          >
            <div className="max-w-4xl mx-auto text-center">
              <div className="flex justify-center mb-6">
                <div className="p-4 bg-white/20 rounded-2xl backdrop-blur-sm">
                  <User className="w-12 h-12 text-white" />
                </div>
              </div>
              <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-white to-purple-100 bg-clip-text text-transparent">
                Mon Compte
              </h1>
              <p className="text-xl text-purple-100 leading-relaxed max-w-2xl mx-auto">
                Gérez vos informations personnelles et personnalisez votre expérience
              </p>
            </div>
          </motion.div>
        </div>

        <div className="container mx-auto px-4 py-16">
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="max-w-4xl mx-auto"
          >
            <motion.div variants={itemVariants}>
              <Tabs defaultValue="informations" className="w-full">
                <TabsList className="grid w-full grid-cols-3 mb-8 h-14 bg-white/70 backdrop-blur-sm border border-purple-200 rounded-xl">
                  <TabsTrigger 
                    value="informations" 
                    className="flex items-center space-x-2 text-lg font-medium rounded-lg data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-pink-500 data-[state=active]:text-white"
                  >
                    <User className="w-5 h-5" />
                    <span>Informations personnelles</span>
                  </TabsTrigger>
                  <TabsTrigger 
                    value="security" 
                    className="flex items-center space-x-2 text-lg font-medium rounded-lg data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-pink-500 data-[state=active]:text-white"
                  >
                    <Shield className="w-5 h-5" />
                    <span>Sécurité</span>
                  </TabsTrigger>
                  <TabsTrigger 
                    value="preferences" 
                    className="flex items-center space-x-2 text-lg font-medium rounded-lg data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-pink-500 data-[state=active]:text-white"
                  >
                    <Settings className="w-5 h-5" />
                    <span>Préférences</span>
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="informations" className="mt-6">
                  <EnhancedCard className="border-0 shadow-xl">
                    <PersonalInfoForm
                      profileData={profileData}
                      loading={loading}
                      handleProfileChange={handleChange}
                      handleGenreChange={handleGenreChange}
                      handleProfileSubmit={handleProfileSubmit}
                    />
                  </EnhancedCard>
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
            </motion.div>
          </motion.div>
        </div>
      </div>
    </Layout>
  );
};

export default ProfilePage;
