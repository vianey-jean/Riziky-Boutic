
import React from 'react';
import { motion } from 'framer-motion';
import Layout from '@/components/layout/Layout';
import { EnhancedCard, EnhancedCardContent } from '@/components/ui/enhanced-card';
import { Separator } from '@/components/ui/separator';
import { FileText, Scale, Shield } from 'lucide-react';

const TermsPage = () => {
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
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-zinc-50">
        {/* Hero Section */}
        <div className="relative overflow-hidden bg-gradient-to-r from-slate-600 via-gray-600 to-zinc-600 text-white py-24">
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
                  <Scale className="w-12 h-12 text-white" />
                </div>
              </div>
              <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-white to-slate-100 bg-clip-text text-transparent">
                Conditions Générales d'Utilisation
              </h1>
              <p className="text-xl text-slate-100 leading-relaxed max-w-2xl mx-auto">
                Découvrez les termes et conditions qui régissent l'utilisation de notre service
              </p>
              <div className="mt-8 inline-flex items-center space-x-2 bg-white/20 backdrop-blur-sm rounded-lg px-4 py-2">
                <FileText className="w-5 h-5" />
                <span>Dernière mise à jour : Mai 2025</span>
              </div>
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
              <EnhancedCard className="border-0 shadow-xl">
                <EnhancedCardContent className="p-8 md:p-12">
                  <div className="prose max-w-none">
                    <section className="mb-8">
                      <div className="flex items-center space-x-3 mb-6">
                        <div className="p-2 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg">
                          <FileText className="w-5 h-5 text-white" />
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900 m-0">1. Introduction</h2>
                      </div>
                      <p className="text-gray-700 mb-4 leading-relaxed">
                        Bienvenue sur Riziky Boutique. Les présentes Conditions Générales d'Utilisation régissent l'utilisation de notre site web et de tous les services associés. En accédant à notre site, vous acceptez de vous conformer à ces conditions et de les respecter. Si vous n'acceptez pas ces conditions, veuillez ne pas utiliser notre site.
                      </p>
                      <p className="text-gray-700 leading-relaxed">
                        Riziky Boutique se réserve le droit de modifier ces conditions à tout moment. Vous serez informé des changements importants, mais il est de votre responsabilité de consulter régulièrement cette page pour vous tenir informé des mises à jour.
                      </p>
                    </section>

                    <Separator className="my-8" />

                    <section className="mb-8">
                      <div className="flex items-center space-x-3 mb-6">
                        <div className="p-2 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg">
                          <Shield className="w-5 h-5 text-white" />
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900 m-0">2. Utilisation du Site</h2>
                      </div>
                      <p className="text-gray-700 mb-4 leading-relaxed">
                        En utilisant notre site, vous vous engagez à :
                      </p>
                      <div className="bg-gradient-to-r from-gray-50 to-slate-50 p-6 rounded-xl border border-gray-200 mb-4">
                        <ul className="list-disc pl-5 space-y-3 text-gray-700">
                          <li>Fournir des informations exactes et complètes lors de la création d'un compte ou lors d'une commande</li>
                          <li>Maintenir la confidentialité de votre mot de passe et assumer l'entière responsabilité de toutes les activités effectuées sous votre compte</li>
                          <li>Ne pas utiliser le site d'une manière qui pourrait l'endommager ou compromettre sa sécurité</li>
                          <li>Ne pas tenter d'accéder à des sections restreintes du site sans autorisation</li>
                          <li>Ne pas utiliser le site pour des activités illégales ou non autorisées</li>
                        </ul>
                      </div>
                      <p className="text-gray-700 leading-relaxed">
                        Nous nous réservons le droit de refuser le service, de fermer des comptes ou de supprimer ou modifier du contenu à notre seule discrétion.
                      </p>
                    </section>

                    <Separator className="my-8" />

                    {/* Additional sections with similar enhanced styling */}
                    <section className="mb-8">
                      <h2 className="text-xl font-bold mb-4 text-gray-900">3. Comptes Utilisateur</h2>
                      <p className="text-gray-700 mb-4 leading-relaxed">
                        Lorsque vous créez un compte sur notre site, vous devez fournir des informations exactes, complètes et à jour. Le non-respect de cette obligation constitue une violation des Conditions Générales d'Utilisation et peut entraîner la résiliation immédiate de votre compte.
                      </p>
                      <p className="text-gray-700 leading-relaxed">
                        Vous êtes responsable de la protection de votre mot de passe et de votre compte. Vous acceptez de ne pas révéler votre mot de passe à des tiers. Vous devez nous informer immédiatement de toute utilisation non autorisée de votre compte ou de toute autre violation de sécurité.
                      </p>
                    </section>

                    <Separator className="my-8" />

                    <section className="mb-8">
                      <h2 className="text-xl font-bold mb-4 text-gray-900">4. Produits et Services</h2>
                      <p className="text-gray-700 mb-4 leading-relaxed">
                        Tous les produits et services sont soumis à disponibilité. Les descriptions des produits et leurs prix sont susceptibles d'être modifiés à tout moment sans préavis, à notre seule discrétion.
                      </p>
                      <p className="text-gray-700 mb-4 leading-relaxed">
                        Nous nous réservons le droit de limiter les quantités de produits commandés. Nous nous réservons également le droit de refuser une commande à notre seule discrétion.
                      </p>
                      <p className="text-gray-700 leading-relaxed">
                        Les couleurs des produits affichés sur le site peuvent varier légèrement des couleurs réelles en raison des paramètres d'affichage de votre écran.
                      </p>
                    </section>

                    <Separator className="my-8" />

                    {/* Continue with remaining sections... */}
                    <section className="mb-8">
                      <h2 className="text-xl font-bold mb-4 text-gray-900">5. Commandes et Paiements</h2>
                      <p className="text-gray-700 mb-4 leading-relaxed">
                        Lorsque vous passez une commande, vous vous engagez à fournir des informations actuelles, complètes et exactes pour toutes les commandes passées sur notre site.
                      </p>
                      <p className="text-gray-700 mb-4 leading-relaxed">
                        Tous les paiements sont traités de manière sécurisée par nos prestataires de services de paiement. En passant une commande, vous acceptez les conditions générales de ces prestataires.
                      </p>
                      <p className="text-gray-700 leading-relaxed">
                        Nous nous réservons le droit d'annuler une commande en cas de problème de paiement ou si nous soupçonnons une fraude.
                      </p>
                    </section>

                    <Separator className="my-8" />

                    <section className="mb-8">
                      <h2 className="text-xl font-bold mb-4 text-gray-900">6. Livraison</h2>
                      <p className="text-gray-700 mb-4 leading-relaxed">
                        Les délais de livraison sont donnés à titre indicatif et ne constituent pas une garantie. Nous ne sommes pas responsables des retards de livraison causés par des événements indépendants de notre contrôle.
                      </p>
                      <p className="text-gray-700 leading-relaxed">
                        Les risques liés aux produits sont transférés à l'acheteur au moment de la livraison. Il est de la responsabilité de l'acheteur de vérifier l'état des produits à la réception et de signaler tout problème dans les délais spécifiés dans notre politique de retour.
                      </p>
                    </section>

                    <Separator className="my-8" />

                    <section className="mb-8">
                      <h2 className="text-xl font-bold mb-4 text-gray-900">7. Propriété Intellectuelle</h2>
                      <p className="text-gray-700 mb-4 leading-relaxed">
                        Le contenu du site, y compris mais sans s'y limiter, les textes, graphiques, images, logos, icônes, logiciels et tout autre matériel, est la propriété de Riziky Boutique ou de ses fournisseurs et est protégé par les lois nationales et internationales sur le droit d'auteur.
                      </p>
                      <p className="text-gray-700 leading-relaxed">
                        Vous ne pouvez pas reproduire, modifier, distribuer ou afficher publiquement tout contenu du site sans notre autorisation écrite préalable.
                      </p>
                    </section>

                    <Separator className="my-8" />

                    <section className="mb-8">
                      <h2 className="text-xl font-bold mb-4 text-gray-900">8. Limitation de Responsabilité</h2>
                      <p className="text-gray-700 mb-4 leading-relaxed">
                        Riziky Boutique ne sera pas responsable des dommages indirects, spéciaux, consécutifs ou punitifs résultant de l'utilisation ou de l'incapacité d'utiliser nos services ou produits.
                      </p>
                      <p className="text-gray-700 leading-relaxed">
                        Notre responsabilité totale pour toutes réclamations liées à nos produits et services ne dépassera en aucun cas le montant que vous avez payé pour l'achat spécifique qui a donné lieu à la réclamation.
                      </p>
                    </section>

                    <Separator className="my-8" />

                    <section>
                      <h2 className="text-xl font-bold mb-4 text-gray-900">9. Contact</h2>
                      <div className="bg-gradient-to-r from-blue-50 to-cyan-50 p-6 rounded-xl border border-blue-200">
                        <p className="text-gray-700 leading-relaxed">
                          Pour toute question ou préoccupation concernant ces Conditions Générales d'Utilisation, veuillez nous contacter à <a href="mailto:contact@rizikyboutique.fr" className="text-blue-600 hover:underline font-medium">contact@rizikyboutique.fr</a>.
                        </p>
                      </div>
                    </section>
                  </div>
                </EnhancedCardContent>
              </EnhancedCard>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </Layout>
  );
};

export default TermsPage;
