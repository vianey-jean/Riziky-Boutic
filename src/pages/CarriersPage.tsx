
import React from 'react';
import { motion } from 'framer-motion';
import Layout from '@/components/layout/Layout';
import { EnhancedCard, EnhancedCardContent, EnhancedCardDescription, EnhancedCardHeader, EnhancedCardTitle } from '@/components/ui/enhanced-card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Briefcase, Users, TrendingUp, Heart, Lightbulb, Leaf, Globe, Award, Star } from 'lucide-react';

const CarriersPage = () => {
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

  const departments = [
    {
      id: 'vente',
      name: 'Vente',
      icon: Users,
      jobs: [
        {
          title: "Responsable boutique",
          location: "Paris",
          type: "CDI",
          description: "Vous serez responsable de la gestion quotidienne de notre boutique phare à Paris."
        },
        {
          title: "Assistant(e) commercial(e)",
          location: "Lyon",
          type: "CDI",
          description: "Support à l'équipe commerciale et gestion des relations clients."
        },
        {
          title: "Conseiller(ère) de vente",
          location: "Marseille",
          type: "CDD",
          description: "Accueillir la clientèle et conseiller sur nos collections."
        }
      ]
    },
    {
      id: 'marketing',
      name: 'Marketing',
      icon: TrendingUp,
      jobs: [
        {
          title: "Chef de projet digital",
          location: "Paris",
          type: "CDI",
          description: "Vous piloterez notre stratégie digitale et nos campagnes en ligne."
        },
        {
          title: "Content Manager",
          location: "Télétravail",
          type: "CDD",
          description: "Production et gestion de contenu pour notre site web et réseaux sociaux."
        }
      ]
    },
    {
      id: 'logistique',
      name: 'Logistique',
      icon: Briefcase,
      jobs: [
        {
          title: "Responsable entrepôt",
          location: "Lille",
          type: "CDI",
          description: "Gestion des opérations logistiques et supervision de l'équipe d'entrepôt."
        },
        {
          title: "Agent logistique",
          location: "Lille",
          type: "CDI",
          description: "Préparation des commandes et gestion des stocks."
        }
      ]
    },
    {
      id: 'design',
      name: 'Design',
      icon: Star,
      jobs: [
        {
          title: "Designer textile",
          location: "Paris",
          type: "CDI",
          description: "Création de motifs et sélection de matières pour nos collections."
        }
      ]
    },
    {
      id: 'tech',
      name: 'Technologie',
      icon: Globe,
      jobs: [
        {
          title: "Développeur front-end",
          location: "Paris ou Télétravail",
          type: "CDI",
          description: "Développement et maintenance de notre boutique en ligne."
        },
        {
          title: "UX/UI Designer",
          location: "Paris",
          type: "CDI",
          description: "Conception d'interfaces utilisateur intuitives pour notre site web et application mobile."
        }
      ]
    }
  ];
  
  const values = [
    {
      title: "Innovation",
      description: "Nous sommes constamment à la recherche de nouvelles idées et approches créatives.",
      icon: Lightbulb,
      gradient: "from-yellow-500 to-orange-500"
    },
    {
      title: "Durabilité",
      description: "Nous nous engageons à minimiser notre impact environnemental à chaque étape.",
      icon: Leaf,
      gradient: "from-green-500 to-emerald-500"
    },
    {
      title: "Inclusion",
      description: "Nous valorisons la diversité et cultivons un environnement où chacun peut s'épanouir.",
      icon: Heart,
      gradient: "from-pink-500 to-red-500"
    },
    {
      title: "Excellence",
      description: "Nous visons l'excellence dans tout ce que nous faisons, des produits à l'expérience client.",
      icon: Award,
      gradient: "from-purple-500 to-indigo-500"
    },
    {
      title: "Collaboration",
      description: "Nous croyons au pouvoir du travail d'équipe et de la communication ouverte.",
      icon: Users,
      gradient: "from-blue-500 to-cyan-500"
    }
  ];

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-blue-50 to-cyan-50">
        {/* Hero Section */}
        <div className="relative overflow-hidden bg-gradient-to-r from-indigo-600 via-blue-600 to-cyan-600 text-white py-24">
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
                  <Briefcase className="w-12 h-12 text-white" />
                </div>
              </div>
              <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-white to-indigo-100 bg-clip-text text-transparent">
                Rejoignez notre équipe
              </h1>
              <p className="text-xl text-indigo-100 leading-relaxed max-w-2xl mx-auto">
                Découvrez les opportunités qui vous permettront de développer votre potentiel au sein d'une entreprise dynamique et passionnée.
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
            {/* Section pourquoi nous rejoindre */}
            <motion.div variants={itemVariants}>
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">Pourquoi nous rejoindre ?</h2>
                <p className="text-gray-600 text-lg">Les avantages de faire partie de l'aventure Riziky Boutique</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {[
                  {
                    icon: TrendingUp,
                    title: "Une entreprise en croissance",
                    description: "Rejoignez une entreprise en plein développement et participez à son expansion nationale et internationale.",
                    gradient: "from-green-500 to-emerald-500"
                  },
                  {
                    icon: Award,
                    title: "Développement de carrière",
                    description: "Bénéficiez d'opportunités de formation continue et d'un accompagnement personnalisé pour votre évolution professionnelle.",
                    gradient: "from-blue-500 to-cyan-500"
                  },
                  {
                    icon: Heart,
                    title: "Culture d'entreprise positive",
                    description: "Évoluez dans un environnement bienveillant qui valorise l'équilibre entre vie professionnelle et personnelle.",
                    gradient: "from-purple-500 to-pink-500"
                  }
                ].map((benefit, index) => (
                  <motion.div
                    key={index}
                    whileHover={{ y: -5, scale: 1.02 }}
                    transition={{ duration: 0.2 }}
                  >
                    <EnhancedCard className="h-full border-0 shadow-xl">
                      <EnhancedCardContent className="p-8 text-center">
                        <div className={`w-16 h-16 mx-auto mb-6 rounded-2xl bg-gradient-to-r ${benefit.gradient} flex items-center justify-center shadow-lg`}>
                          <benefit.icon className="w-8 h-8 text-white" />
                        </div>
                        <h3 className="text-xl font-semibold mb-4 text-gray-900">{benefit.title}</h3>
                        <p className="text-gray-600 leading-relaxed">{benefit.description}</p>
                      </EnhancedCardContent>
                    </EnhancedCard>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Section nos valeurs */}
            <motion.div variants={itemVariants}>
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">Nos valeurs</h2>
                <p className="text-gray-600 text-lg">Les principes qui guident notre action au quotidien</p>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
                {values.map((value, index) => (
                  <motion.div
                    key={index}
                    whileHover={{ y: -3 }}
                    transition={{ duration: 0.2 }}
                  >
                    <EnhancedCard className="h-full border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
                      <EnhancedCardHeader className="text-center pb-2">
                        <div className={`w-12 h-12 mx-auto mb-4 rounded-xl bg-gradient-to-r ${value.gradient} flex items-center justify-center shadow-lg`}>
                          <value.icon className="w-6 h-6 text-white" />
                        </div>
                        <EnhancedCardTitle className="text-lg">{value.title}</EnhancedCardTitle>
                      </EnhancedCardHeader>
                      <EnhancedCardContent>
                        <p className="text-gray-600 text-sm leading-relaxed">{value.description}</p>
                      </EnhancedCardContent>
                    </EnhancedCard>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Section offres d'emploi */}
            <motion.div variants={itemVariants}>
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">Nos offres d'emploi</h2>
                <p className="text-gray-600 text-lg">Trouvez le poste qui correspond à vos aspirations</p>
              </div>
              
              <EnhancedCard className="border-0 shadow-xl">
                <EnhancedCardContent className="p-8">
                  <Tabs defaultValue="vente" className="w-full">
                    <TabsList className="grid grid-cols-2 md:grid-cols-5 mb-8 h-14 bg-gray-100">
                      {departments.map(dept => (
                        <TabsTrigger 
                          key={dept.id} 
                          value={dept.id}
                          className="flex items-center space-x-2 text-sm font-medium data-[state=active]:bg-gradient-to-r data-[state=active]:from-indigo-500 data-[state=active]:to-blue-500 data-[state=active]:text-white"
                        >
                          <dept.icon className="w-4 h-4" />
                          <span className="hidden sm:inline">{dept.name}</span>
                        </TabsTrigger>
                      ))}
                    </TabsList>
                    
                    {departments.map(dept => (
                      <TabsContent key={dept.id} value={dept.id}>
                        <div className="grid gap-6">
                          {dept.jobs.map((job, index) => (
                            <motion.div
                              key={index}
                              whileHover={{ x: 5 }}
                              transition={{ duration: 0.2 }}
                            >
                              <EnhancedCard className="border border-gray-200 hover:border-indigo-300 hover:shadow-lg transition-all duration-300">
                                <EnhancedCardContent className="p-6">
                                  <div className="flex justify-between items-start mb-4">
                                    <div className="flex-1">
                                      <h3 className="text-xl font-semibold mb-2 text-gray-900">{job.title}</h3>
                                      <div className="flex items-center space-x-4 text-gray-600 text-sm mb-3">
                                        <span className="flex items-center space-x-1">
                                          <Globe className="w-4 h-4" />
                                          <span>{job.location}</span>
                                        </span>
                                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                                          job.type === 'CDI' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
                                        }`}>
                                          {job.type}
                                        </span>
                                      </div>
                                      <p className="text-gray-700 leading-relaxed">{job.description}</p>
                                    </div>
                                    <Button className="ml-6 bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 whitespace-nowrap">
                                      Postuler
                                    </Button>
                                  </div>
                                </EnhancedCardContent>
                              </EnhancedCard>
                            </motion.div>
                          ))}
                        </div>
                      </TabsContent>
                    ))}
                  </Tabs>
                </EnhancedCardContent>
              </EnhancedCard>
            </motion.div>
            
            {/* Section candidature spontanée */}
            <motion.div variants={itemVariants}>
              <EnhancedCard className="bg-gradient-to-r from-indigo-50 to-blue-50 border-indigo-200 shadow-xl">
                <EnhancedCardContent className="p-12 text-center">
                  <div className="flex justify-center mb-8">
                    <div className="p-4 bg-gradient-to-r from-indigo-500 to-blue-500 rounded-2xl">
                      <Users className="w-12 h-12 text-white" />
                    </div>
                  </div>
                  <h2 className="text-3xl font-bold mb-6 text-gray-900">Candidature spontanée</h2>
                  <p className="text-gray-600 mb-8 max-w-2xl mx-auto text-lg leading-relaxed">
                    Vous ne trouvez pas l'offre qui vous correspond mais souhaitez rejoindre notre équipe ? N'hésitez pas à nous envoyer une candidature spontanée.
                  </p>
                  <Button className="bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 px-8 py-6 text-lg font-semibold rounded-xl">
                    Envoyer ma candidature
                  </Button>
                </EnhancedCardContent>
              </EnhancedCard>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </Layout>
  );
};

export default CarriersPage;
