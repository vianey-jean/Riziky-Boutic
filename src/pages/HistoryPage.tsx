
import React from 'react';
import { motion } from 'framer-motion';
import Layout from '@/components/layout/Layout';
import { EnhancedCard, EnhancedCardContent } from '@/components/ui/enhanced-card';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { History, Heart, Users, Award, Globe, Sparkles } from 'lucide-react';

const HistoryPage = () => {
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

  const timelineEvents = [
    {
      year: "2010",
      title: "Création de l'entreprise",
      description: "Riziky Boutique est fondée par un groupe d'amis passionnés de mode avec un petit showroom à Paris.",
      gradient: "from-blue-500 to-cyan-500"
    },
    {
      year: "2012",
      title: "Première boutique physique",
      description: "Ouverture de notre première boutique dans le Marais à Paris, spécialisée dans les accessoires de mode artisanaux.",
      gradient: "from-purple-500 to-pink-500"
    },
    {
      year: "2014",
      title: "Lancement de notre première collection",
      description: "Création de notre première ligne de vêtements 'Élégance Parisienne', un succès immédiat auprès de notre clientèle.",
      gradient: "from-green-500 to-emerald-500"
    },
    {
      year: "2016",
      title: "Expansion nationale",
      description: "Ouverture de trois nouvelles boutiques à Lyon, Marseille et Bordeaux, marquant notre expansion sur le territoire français.",
      gradient: "from-orange-500 to-red-500"
    },
    {
      year: "2018",
      title: "Lancement de la boutique en ligne",
      description: "Développement de notre plateforme e-commerce pour atteindre une clientèle plus large à travers toute la France.",
      gradient: "from-indigo-500 to-purple-500"
    },
    {
      year: "2020",
      title: "Engagement pour la durabilité",
      description: "Introduction de notre première collection éco-responsable et mise en place d'une charte de développement durable.",
      gradient: "from-teal-500 to-green-500"
    },
    {
      year: "2022",
      title: "Expansion internationale",
      description: "Ouverture de notre première boutique à l'international à Bruxelles, marquant le début de notre présence européenne.",
      gradient: "from-pink-500 to-rose-500"
    },
    {
      year: "2024",
      title: "Innovation technologique",
      description: "Lancement de notre application mobile avec des fonctionnalités de réalité augmentée pour essayer virtuellement nos vêtements.",
      gradient: "from-cyan-500 to-blue-500"
    },
    {
      year: "2025",
      title: "Aujourd'hui",
      description: "Riziky Boutique compte désormais 15 boutiques en France et en Europe, une équipe de plus de 100 passionnés, et poursuit son développement avec de nouveaux projets innovants.",
      gradient: "from-yellow-500 to-orange-500"
    }
  ];

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-violet-50 via-purple-50 to-fuchsia-50">
        {/* Hero Section */}
        <div className="relative overflow-hidden bg-gradient-to-r from-violet-600 via-purple-600 to-fuchsia-600 text-white py-24">
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
                  <History className="w-12 h-12 text-white" />
                </div>
              </div>
              <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-white to-violet-100 bg-clip-text text-transparent">
                Notre Histoire
              </h1>
              <p className="text-xl text-violet-100 leading-relaxed max-w-2xl mx-auto">
                Découvrez comment Riziky Boutique est devenue une référence dans l'univers de la mode, de ses humbles débuts à aujourd'hui.
              </p>
            </div>
          </motion.div>
        </div>

        <div className="container mx-auto px-4 py-16">
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="max-w-6xl mx-auto space-y-16"
          >
            {/* Nos débuts */}
            <motion.div variants={itemVariants}>
              <EnhancedCard className="border-0 shadow-xl overflow-hidden">
                <EnhancedCardContent className="p-0">
                  <div className="flex flex-col md:flex-row">
                    <div className="md:w-1/2 p-8 md:p-12">
                      <div className="flex items-center space-x-3 mb-6">
                        <div className="p-3 bg-gradient-to-r from-violet-500 to-purple-500 rounded-xl">
                          <Heart className="w-6 h-6 text-white" />
                        </div>
                        <h2 className="text-3xl font-bold text-gray-900">Nos débuts</h2>
                      </div>
                      <p className="text-gray-700 mb-6 leading-relaxed text-lg">
                        L'aventure de Riziky Boutique a commencé en 2010 lorsqu'un groupe d'amis passionnés de mode a décidé de transformer leur passion en entreprise. Avec un petit capital et beaucoup d'ambition, ils ont ouvert un showroom modeste dans le cœur de Paris.
                      </p>
                      <p className="text-gray-700 leading-relaxed">
                        Ce qui n'était au départ qu'une collection d'accessoires soigneusement sélectionnés est rapidement devenu une référence pour les amateurs de mode à la recherche de pièces uniques et de qualité.
                      </p>
                    </div>
                    <div className="md:w-1/2 bg-gradient-to-br from-violet-100 to-purple-100 flex items-center justify-center p-8">
                      <div className="w-64 h-64 bg-white rounded-2xl shadow-lg flex items-center justify-center">
                        <Sparkles className="w-24 h-24 text-violet-500" />
                      </div>
                    </div>
                  </div>
                </EnhancedCardContent>
              </EnhancedCard>
            </motion.div>

            {/* Timeline */}
            <motion.div variants={itemVariants}>
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">Notre parcours</h2>
                <p className="text-gray-600 text-lg">Une histoire riche en innovations et en réussites</p>
              </div>
              
              <div className="space-y-8">
                {timelineEvents.map((event, index) => (
                  <motion.div 
                    key={index}
                    variants={itemVariants}
                    whileHover={{ scale: 1.02 }}
                    className="relative"
                  >
                    <div className={`flex flex-col md:flex-row gap-6 items-center ${index % 2 === 0 ? '' : 'md:flex-row-reverse'}`}>
                      <div className="md:w-1/6 flex justify-center">
                        <div className={`bg-gradient-to-r ${event.gradient} text-white font-bold py-4 px-6 rounded-2xl shadow-lg`}>
                          <span className="text-xl">{event.year}</span>
                        </div>
                      </div>
                      <div className="hidden md:block md:w-1/12 relative">
                        <div className="absolute left-1/2 transform -translate-x-1/2 h-full">
                          <div className="h-full w-1 bg-gradient-to-b from-violet-200 to-purple-200"></div>
                        </div>
                        <div className={`absolute left-1/2 top-8 transform -translate-x-1/2 w-6 h-6 rounded-full bg-gradient-to-r ${event.gradient} border-4 border-white shadow-lg`}></div>
                      </div>
                      <div className="md:w-5/6">
                        <EnhancedCard className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
                          <EnhancedCardContent className="p-8">
                            <h3 className="text-xl font-semibold mb-3 text-gray-900">{event.title}</h3>
                            <p className="text-gray-700 leading-relaxed">{event.description}</p>
                          </EnhancedCardContent>
                        </EnhancedCard>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Notre vision */}
            <motion.div variants={itemVariants}>
              <EnhancedCard className="bg-gradient-to-r from-violet-50 to-purple-50 border-violet-200 shadow-xl">
                <EnhancedCardContent className="p-12 text-center">
                  <div className="flex justify-center mb-8">
                    <div className="p-4 bg-gradient-to-r from-violet-500 to-purple-500 rounded-2xl">
                      <Globe className="w-12 h-12 text-white" />
                    </div>
                  </div>
                  <h2 className="text-3xl font-bold mb-8 text-gray-900">Notre vision</h2>
                  <blockquote className="text-2xl italic text-gray-700 mb-6 leading-relaxed">
                    "Notre ambition est de créer une mode accessible, éthique et inspirante, qui permet à chacun d'exprimer sa personnalité tout en respectant notre planète."
                  </blockquote>
                  <p className="text-gray-600 text-lg">
                    - L'équipe fondatrice de Riziky Boutique
                  </p>
                </EnhancedCardContent>
              </EnhancedCard>
            </motion.div>

            {/* Notre équipe dirigeante */}
            <motion.div variants={itemVariants}>
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">Notre équipe dirigeante</h2>
                <p className="text-gray-600 text-lg">Les visionnaires derrière notre succès</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {[1, 2, 3].map((person) => (
                  <motion.div 
                    key={person}
                    whileHover={{ y: -5 }}
                    className="text-center"
                  >
                    <EnhancedCard className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
                      <EnhancedCardContent className="p-8">
                        <div className="w-32 h-32 bg-gradient-to-r from-violet-200 to-purple-200 rounded-full mx-auto mb-6 flex items-center justify-center">
                          <Users className="w-16 h-16 text-violet-600" />
                        </div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">Nom Prénom</h3>
                        <p className="text-violet-600 mb-4 font-medium">Titre / Position</p>
                        <p className="text-gray-600 text-sm leading-relaxed">
                          Court descriptif de l'expérience et du rôle dans l'entreprise, parcours professionnel et vision pour l'avenir.
                        </p>
                      </EnhancedCardContent>
                    </EnhancedCard>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </Layout>
  );
};

export default HistoryPage;
