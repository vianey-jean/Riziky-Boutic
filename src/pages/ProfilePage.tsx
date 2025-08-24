/**
 * ✅ ProfilePage.tsx
 *
 * - Page de gestion du profil utilisateur.
 * - Intègre désormais `PageDataLoader` pour gérer le chargement initial (user + commandes).
 * - Contient 3 onglets : Informations personnelles, Sécurité et Préférences.
 */

import React, { useState, useEffect } from "react";
import Layout from "@/components/layout/Layout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import PersonalInfoForm from "@/components/profile/PersonalInfoForm";
import PasswordForm from "@/components/profile/PasswordForm";
import PreferencesForm from "@/components/profile/PreferencesForm";
import ProfilePhotoUpload from "@/components/profile/ProfilePhotoUpload";
import UserAvatar from "@/components/user/UserAvatar";
import { toast } from "@/components/ui/sonner";
import { useStore } from "@/contexts/StoreContext";
import { authAPI } from "@/services/api";
import { UpdateProfileData } from "@/types/auth";
import { User, Shield, Settings } from "lucide-react";

import PageDataLoader from '@/components/layout/PageDataLoader';

const ProfilePage = () => {
  const { user, isAuthenticated, loading: authLoading } = useAuth();
  const { fetchOrders } = useStore();

  const [activeTab, setActiveTab] = useState("info");
  const [loading, setLoading] = useState(false); // 🔹 conserve pour update profil/mdp
  const [profileData, setProfileData] = useState<UpdateProfileData>({
    nom: user?.nom || "",
    prenom: user?.prenom || "",
    adresse: user?.adresse || "",
    ville: user?.ville || "",
    codePostal: user?.codePostal || "",
    pays: user?.pays || "",
    telephone: user?.telephone || "",
    genre: (user?.genre as "homme" | "femme" | "autre") || "autre",
  });

  const navigate = useNavigate();

  /** 🔹 Gestion auth/redirection */
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      navigate("/login");
    }
    if (user) {
      setProfileData({
        nom: user.nom || "",
        prenom: user.prenom || "",
        adresse: user.adresse || "",
        ville: user.ville || "",
        codePostal: user.codePostal || "",
        pays: user.pays || "",
        telephone: user.telephone || "",
        genre: (user.genre || "autre") as "homme" | "femme" | "autre",
      });
    }
  }, [isAuthenticated, authLoading, user]);

  /** 🔹 Handlers pour PageDataLoader */
  const handleDataSuccess = () => {
    console.log("Profil et commandes chargés avec succès");
  };

  const handleMaxRetriesReached = () => {
    toast.error(
      "Impossible de charger vos informations après plusieurs tentatives."
    );
  };

  const handlePhotoUpdated = () => {
    // Recharger les données utilisateur pour mettre à jour l'affichage
    window.location.reload();
  };

  /** 🔹 Handlers de formulaire */
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    if (name === "genre") {
      const genreValue = value as "homme" | "femme" | "autre";
      setProfileData((prev) => ({ ...prev, [name]: genreValue }));
    } else {
      setProfileData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleGenreChange = (value: string) => {
    const genreValue = value as "homme" | "femme" | "autre";
    setProfileData((prev) => ({ ...prev, genre: genreValue }));
  };

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setLoading(true);
    try {
      const updatedProfile: UpdateProfileData = {
        nom: profileData.nom,
        prenom: profileData.prenom,
        adresse: profileData.adresse,
        ville: profileData.ville,
        codePostal: profileData.codePostal,
        pays: profileData.pays,
        telephone: profileData.telephone,
        genre: profileData.genre as "homme" | "femme" | "autre",
      };

      await authAPI.updateProfile(user.id, updatedProfile);

      toast.success("Profil mis à jour avec succès");
    } catch (error) {
      console.error("Erreur lors de la mise à jour du profil:", error);
      toast.error("Erreur lors de la mise à jour du profil");
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordUpdate = async (
    currentPassword: string,
    newPassword: string
  ): Promise<boolean> => {
    setLoading(true);
    try {
      if (!user) throw new Error("Utilisateur non connecté");

      await authAPI.updatePassword(user.id, currentPassword, newPassword);
      toast.success("Mot de passe mis à jour avec succès");
      return true;
    } catch (error) {
      console.error("Erreur lors de la mise à jour du mot de passe:", error);
      toast.error("Erreur lors de la mise à jour du mot de passe");
      return false;
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
        {/* ✅ PageDataLoader gère le chargement initial */}
        <PageDataLoader
          fetchFunction={fetchOrders}
          onSuccess={handleDataSuccess}
          onMaxRetriesReached={handleMaxRetriesReached}
          loadingMessage="Chargement de vos informations..."
          loadingSubmessage="Veuillez patienter pendant la récupération de vos données..."
          errorMessage="Erreur lors du chargement du profil"
        >
          {/* ----- HEADER ----- */}
          <div className="bg-gradient-to-br from-slate-600 via-gray-700 to-blue-800 rounded-none lg:rounded-3xl lg:mx-8 lg:mt-8 p-8 text-white shadow-2xl relative overflow-hidden">
            <div className="absolute inset-0 bg-black/10"></div>
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-32 translate-x-32"></div>
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-24 -translate-x-24"></div>

            <div className="relative z-10">
              <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between">
                <div className="space-y-4 mb-6 lg:mb-0">
                  <div className="flex items-center space-x-4">
                    <div className="relative bg-white/20 backdrop-blur-sm p-4 rounded-2xl">
                      {user ? (
                        <UserAvatar user={user} size="xl" showBorder />
                      ) : (
                        <User className="h-16 w-16 text-white" />
                      )}
                      {user && <ProfilePhotoUpload onPhotoUpdated={handlePhotoUpdated} />}
                    </div>
                    <div>
                      <h1 className="text-4xl font-bold mb-2">Mon Compte</h1>
                      <p className="text-slate-200 text-lg">
                        Gérez vos informations personnelles
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ----- CONTENT ----- */}
          <div className="container px-4 py-12">
            <div className="max-w-6xl mx-auto">
              <Tabs defaultValue="informations" className="space-y-8">
                {/* Onglets */}
                <TabsList className="grid w-full grid-cols-3 bg-white shadow-xl border-0 p-2 rounded-2xl">
                  <TabsTrigger
                    value="informations"
                    className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-indigo-600 data-[state=active]:text-white rounded-xl font-medium py-3 px-6 transition-all duration-300"
                  >
                    <User className="h-5 w-5 mr-2" />
                    Informations personnelles
                  </TabsTrigger>
                  <TabsTrigger
                    value="security"
                    className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-red-600 data-[state=active]:to-pink-600 data-[state=active]:text-white rounded-xl font-medium py-3 px-6 transition-all duration-300"
                  >
                    <Shield className="h-5 w-5 mr-2" />
                    Sécurité
                  </TabsTrigger>
                  <TabsTrigger
                    value="preferences"
                    className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-green-600 data-[state=active]:to-emerald-600 data-[state=active]:text-white rounded-xl font-medium py-3 px-6 transition-all duration-300"
                  >
                    <Settings className="h-5 w-5 mr-2" />
                    Préférences
                  </TabsTrigger>
                </TabsList>

                {/* Informations personnelles */}
                <TabsContent value="informations" className="mt-8">
                  <Card className="border-0 shadow-2xl bg-gradient-to-br from-white to-blue-50">
                    <div className="p-8">
                      <div className="flex items-center mb-8">
                        <div className="bg-gradient-to-br from-blue-500 to-indigo-600 p-4 rounded-2xl mr-4 shadow-lg">
                          <User className="h-8 w-8 text-white" />
                        </div>
                        <div>
                          <h2 className="text-3xl font-bold text-gray-800">
                            Informations personnelles
                          </h2>
                          <p className="text-gray-600 text-lg mt-2">
                            Gérez vos données personnelles et coordonnées
                          </p>
                        </div>
                      </div>
                      <PersonalInfoForm
                        profileData={profileData}
                        loading={loading}
                        handleProfileChange={handleChange}
                        handleGenreChange={handleGenreChange}
                        handleProfileSubmit={handleProfileSubmit}
                      />
                    </div>
                  </Card>
                </TabsContent>

                {/* Sécurité */}
                <TabsContent value="security" className="mt-8">
                  <Card className="border-0 shadow-2xl bg-gradient-to-br from-white to-red-50">
                    <div className="p-8">
                      <div className="flex items-center mb-8">
                        <div className="bg-gradient-to-br from-red-500 to-pink-600 p-4 rounded-2xl mr-4 shadow-lg">
                          <Shield className="h-8 w-8 text-white" />
                        </div>
                        <div>
                          <h2 className="text-3xl font-bold text-gray-800">
                            Sécurité du compte
                          </h2>
                          <p className="text-gray-600 text-lg mt-2">
                            Modifiez votre mot de passe et sécurisez votre
                            compte
                          </p>
                        </div>
                      </div>
                      <PasswordForm
                        loading={loading}
                        onPasswordChange={handlePasswordUpdate}
                      />
                    </div>
                  </Card>
                </TabsContent>

                {/* Préférences */}
                <TabsContent value="preferences" className="mt-8">
                  <Card className="border-0 shadow-2xl bg-gradient-to-br from-white to-green-50">
                    <div className="p-8">
                      <div className="flex items-center mb-8">
                        <div className="bg-gradient-to-br from-green-500 to-emerald-600 p-4 rounded-2xl mr-4 shadow-lg">
                          <Settings className="h-8 w-8 text-white" />
                        </div>
                        <div>
                          <h2 className="text-3xl font-bold text-gray-800">
                            Préférences
                          </h2>
                          <p className="text-gray-600 text-lg mt-2">
                            Personnalisez votre expérience d'achat
                          </p>
                        </div>
                      </div>
                      <PreferencesForm />
                    </div>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </PageDataLoader>
      </div>
    </Layout>
  );
};

export default ProfilePage;
