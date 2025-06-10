
import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Layout from '@/components/layout/Layout';
import { ShoppingBag, UserX, Clock, Home } from 'lucide-react';

const RegisterBlockPage = () => {
  return (
    <Layout>
      <div className="min-h-[90vh] bg-gradient-to-br from-red-50 via-white to-red-50 dark:from-red-950/20 dark:via-neutral-950 dark:to-red-950/20 flex items-center justify-center p-4">
        <div className="w-full max-w-lg">
          {/* Header with Logo */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-red-600 to-red-700 rounded-2xl shadow-lg mb-4">
              <ShoppingBag className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Riziky Boutique
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Votre boutique beauté de luxe
            </p>
          </div>

          <Card className="shadow-2xl border-0 bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm">
            <CardHeader className="space-y-1 pb-6 text-center">
              <div className="flex items-center justify-center mb-4">
                <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-orange-500 to-red-500 rounded-full shadow-lg">
                  <UserX className="h-10 w-10 text-white" />
                </div>
              </div>
              <CardTitle className="text-2xl font-bold bg-gradient-to-r from-red-600 to-red-700 bg-clip-text text-transparent">
                Inscription Temporairement Fermée
              </CardTitle>
            </CardHeader>

            <CardContent className="space-y-6">
              {/* Message principal */}
              <div className="text-center space-y-4">
                <div className="bg-gradient-to-r from-red-50 to-orange-50 dark:from-red-900/20 dark:to-orange-900/20 rounded-xl p-6 border border-red-200 dark:border-red-800">
                  <div className="flex items-center justify-center gap-2 text-red-700 dark:text-red-300 mb-3">
                    <Clock className="h-5 w-5" />
                    <span className="font-semibold">Inscription interrompue</span>
                  </div>
                  <p className="text-red-600 dark:text-red-400 leading-relaxed">
                    L'inscription sur ce site est temporairement interrompue. 
                    Nous travaillons à améliorer notre plateforme pour vous offrir 
                    une expérience encore plus exceptionnelle.
                  </p>
                </div>

                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl p-6 border border-blue-200 dark:border-blue-800">
                  <h3 className="font-bold text-blue-800 dark:text-blue-200 mb-2">
                    Pourquoi cette interruption ?
                  </h3>
                  <ul className="text-blue-700 dark:text-blue-300 text-sm space-y-1 text-left">
                    <li>• Amélioration de nos services</li>
                    <li>• Mise à jour de notre système de sécurité</li>
                    <li>• Optimisation de l'expérience utilisateur</li>
                    <li>• Ajout de nouvelles fonctionnalités premium</li>
                  </ul>
                </div>

                <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-xl p-6 border border-green-200 dark:border-green-800">
                  <h3 className="font-bold text-green-800 dark:text-green-200 mb-2">
                    📧 Restez informé(e)
                  </h3>
                  <p className="text-green-700 dark:text-green-300 text-sm">
                    L'ouverture des inscriptions sera annoncée sur nos réseaux sociaux 
                    et par email. Suivez-nous pour ne rien manquer !
                  </p>
                </div>
              </div>

              {/* Informations complémentaires */}
              <div className="text-center">
                <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
                  Vous avez déjà un compte ? La connexion reste disponible.
                </p>
                
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <Link to="/login">
                    <Button 
                      variant="outline" 
                      className="w-full sm:w-auto border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700 dark:border-red-800 dark:text-red-400 dark:hover:bg-red-900/20"
                    >
                      Se connecter
                    </Button>
                  </Link>
                </div>
              </div>
            </CardContent>

            <CardFooter className="pt-6 border-t border-gray-200 dark:border-gray-700">
              <div className="w-full text-center">
                <Link to="/">
                  <Button 
                    className="w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02]"
                  >
                    <Home className="h-4 w-4 mr-2" />
                    Retour à l'accueil
                  </Button>
                </Link>
              </div>
            </CardFooter>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default RegisterBlockPage;
