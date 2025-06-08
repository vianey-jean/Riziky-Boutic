
import React from 'react';
import Layout from '@/components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { motion } from 'framer-motion';
import { 
  Users, 
  TrendingUp, 
  Heart, 
  Award, 
  Coffee, 
  MapPin, 
  Clock, 
  Send,
  Briefcase,
  Palette,
  Code,
  Package,
  Megaphone,
  Star,
  Globe,
  Target,
  Lightbulb,
  Leaf,
  Mail
} from 'lucide-react';

const CarriersPage = () => {
  const departments = [
    {
      id: 'vente',
      name: 'Vente',
      icon: Users,
      color: 'from-blue-500 to-cyan-500',
      jobs: [
        {
          title: "Responsable boutique",
          location: "Paris",
          type: "CDI",
          description: "Vous serez responsable de la gestion quotidienne de notre boutique phare à Paris.",
          salary: "35-45k€",
          experience: "3-5 ans"
        },
        {
          title: "Assistant(e) commercial(e)",
          location: "Lyon",
          type: "CDI",
          description: "Support à l'équipe commerciale et gestion des relations clients.",
          salary: "28-35k€",
          experience: "1-3 ans"
        },
        {
          title: "Conseiller(ère) de vente",
          location: "Marseille",
          type: "CDD",
          description: "Accueillir la clientèle et conseiller sur nos collections.",
          salary: "25-30k€",
          experience: "Débutant accepté"
        }
      ]
    },
    {
      id: 'marketing',
      name: 'Marketing',
      icon: Megaphone,
      color: 'from-purple-500 to-pink-500',
      jobs: [
        {
          title: "Chef de projet digital",
          location: "Paris",
          type: "CDI",
          description: "Vous piloterez notre stratégie digitale et nos campagnes en ligne.",
          salary: "40-55k€",
          experience: "3-5 ans"
        },
        {
          title: "Content Manager",
          location: "Télétravail",
          type: "CDD",
          description: "Production et gestion de contenu pour notre site web et réseaux sociaux.",
          salary: "30-40k€",
          experience: "2-4 ans"
        }
      ]
    },
    {
      id: 'logistique',
      name: 'Logistique',
      icon: Package,
      color: 'from-green-500 to-emerald-500',
      jobs: [
        {
          title: "Responsable entrepôt",
          location: "Lille",
          type: "CDI",
          description: "Gestion des opérations logistiques et supervision de l'équipe d'entrepôt.",
          salary: "35-45k€",
          experience: "3-5 ans"
        },
        {
          title: "Agent logistique",
          location: "Lille",
          type: "CDI",
          description: "Préparation des commandes et gestion des stocks.",
          salary: "22-28k€",
          experience: "Débutant accepté"
        }
      ]
    },
    {
      id: 'design',
      name: 'Design',
      icon: Palette,
      color: 'from-orange-500 to-red-500',
      jobs: [
        {
          title: "Designer textile",
          location: "Paris",
          type: "CDI",
          description: "Création de motifs et sélection de matières pour nos collections.",
          salary: "35-50k€",
          experience: "2-4 ans"
        }
      ]
    },
    {
      id: 'tech',
      name: 'Technologie',
      icon: Code,
      color: 'from-indigo-500 to-purple-500',
      jobs: [
        {
          title: "Développeur front-end",
          location: "Paris ou Télétravail",
          type: "CDI",
          description: "Développement et maintenance de notre boutique en ligne.",
          salary: "40-60k€",
          experience: "2-5 ans"
        },
        {
          title: "UX/UI Designer",
          location: "Paris",
          type: "CDI",
          description: "Conception d'interfaces utilisateur intuitives pour notre site web et application mobile.",
          salary: "38-55k€",
          experience: "3-5 ans"
        }
      ]
    }
  ];
  
  const values = [
    {
      title: "Innovation",
      description: "Nous sommes constamment à la recherche de nouvelles idées et approches créatives.",
      icon: Lightbulb,
      color: "text-yellow-600",
      bgColor: "from-yellow-100 to-amber-100"
    },
    {
      title: "Durabilité",
      description: "Nous nous engageons à minimiser notre impact environnemental à chaque étape.",
      icon: Leaf,
      color: "text-green-600",
      bgColor: "from-green-100 to-emerald-100"
    },
    {
      title: "Inclusion",
      description: "Nous valorisons la diversité et cultivons un environnement où chacun peut s'épanouir.",
      icon: Heart,
      color: "text-pink-600",
      bgColor: "from-pink-100 to-rose-100"
    },
    {
      title: "Excellence",
      description: "Nous visons l'excellence dans tout ce que nous faisons, des produits à l'expérience client.",
      icon: Award,
      color: "text-purple-600",
      bgColor: "from-purple-100 to-violet-100"
    },
    {
      title: "Collaboration",
      description: "Nous croyons au pouvoir du travail d'équipe et de la communication ouverte.",
      icon: Users,
      color: "text-blue-600",
      bgColor: "from-blue-100 to-cyan-100"
    }
  ];

  const benefits = [
    {
      title: "Une entreprise en croissance",
      description: "Rejoignez une entreprise en plein développement et participez à son expansion nationale et internationale.",
      icon: TrendingUp,
      color: "from-green-500 to-emerald-500"
    },
    {
      title: "Développement de carrière",
      description: "Bénéficiez d'opportunités de formation continue et d'un accompagnement personnalisé pour votre évolution professionnelle.",
      icon: Target,
      color: "from-blue-500 to-cyan-500"
    },
    {
      title: "Culture d'entreprise positive",
      description: "Évoluez dans un environnement bienveillant qui valorise l'équilibre entre vie professionnelle et personnelle.",
      icon: Coffee,
      color: "from-purple-500 to-pink-500"
    }
  ];

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-red-50">
        <div className="container mx-auto py-12">
          {/* En-tête héro avec animation */}
          <motion.div 
            className="text-center mb-20 relative"
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-red-500/10 to-pink-500/10 rounded-full blur-3xl scale-150"></div>
            <div className="relative">
              <motion.div
                className="inline-flex items-center bg-gradient-to-r from-red-500 to-pink-500 text-white px-6 py-2 rounded-full text-sm font-medium mb-6"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.3, type: "spring" }}
              >
                <Star className="h-4 w-4 mr-2" />
                Nous recrutons des talents exceptionnels
              </motion.div>
              <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-red-600 to-pink-600 bg-clip-text text-transparent mb-6">
                Rejoignez notre équipe
              </h1>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                Découvrez les opportunités qui vous permettront de développer votre potentiel au sein d'une entreprise dynamique et passionnée par l'innovation.
              </p>
            </div>
          </motion.div>

          {/* Section avantages avec design moderne */}
          <motion.section 
            className="mb-20"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Pourquoi nous rejoindre ?</h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Découvrez les avantages qui font de notre entreprise un lieu de travail exceptionnel
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {benefits.map((benefit, index) => (
                <motion.div
                  key={index}
                  className="group"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  whileHover={{ scale: 1.02 }}
                >
                  <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-200 h-full relative overflow-hidden group-hover:shadow-xl transition-all duration-300">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br opacity-10 rounded-full -translate-y-16 translate-x-16 group-hover:scale-150 transition-transform duration-500"></div>
                    <div className={`w-16 h-16 bg-gradient-to-r ${benefit.color} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                      <benefit.icon className="h-8 w-8 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-4">{benefit.title}</h3>
                    <p className="text-gray-600 leading-relaxed">{benefit.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.section>

          {/* Section valeurs avec grid responsive */}
          <motion.section 
            className="mb-20"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Nos valeurs</h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Les principes qui guident notre action au quotidien
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
              {values.map((value, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  whileHover={{ scale: 1.05 }}
                >
                  <Card className="h-full group hover:shadow-lg transition-all duration-300 border-gray-200">
                    <CardHeader className="text-center pb-4">
                      <div className={`w-16 h-16 bg-gradient-to-br ${value.bgColor} rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300`}>
                        <value.icon className={`h-8 w-8 ${value.color}`} />
                      </div>
                      <CardTitle className="text-lg text-gray-900">{value.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-600 text-sm leading-relaxed">{value.description}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.section>

          {/* Section offres d'emploi moderne */}
          <motion.section
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Nos offres d'emploi</h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Trouvez le poste qui correspond à vos ambitions et à vos compétences
              </p>
            </div>
            
            <Tabs defaultValue="vente" className="w-full">
              <TabsList className="grid grid-cols-2 md:grid-cols-5 mb-8 bg-gray-100 p-1 rounded-2xl">
                {departments.map(dept => {
                  const IconComponent = dept.icon;
                  return (
                    <TabsTrigger 
                      key={dept.id} 
                      value={dept.id}
                      className="flex items-center space-x-2 data-[state=active]:bg-white data-[state=active]:shadow-sm rounded-xl py-3"
                    >
                      <IconComponent className="h-4 w-4" />
                      <span className="hidden sm:inline">{dept.name}</span>
                    </TabsTrigger>
                  );
                })}
              </TabsList>
              
              {departments.map(dept => {
                const IconComponent = dept.icon;
                return (
                  <TabsContent key={dept.id} value={dept.id}>
                    <motion.div 
                      className="grid gap-6"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5 }}
                    >
                      {dept.jobs.map((job, index) => (
                        <motion.div
                          key={index}
                          whileHover={{ scale: 1.01 }}
                          transition={{ duration: 0.2 }}
                        >
                          <Card className="overflow-hidden hover:shadow-xl transition-all duration-300 border-gray-200">
                            <div className="p-8">
                              <div className="flex justify-between items-start mb-6">
                                <div className="flex items-start space-x-4">
                                  <div className={`w-16 h-16 bg-gradient-to-r ${dept.color} rounded-2xl flex items-center justify-center flex-shrink-0`}>
                                    <IconComponent className="h-8 w-8 text-white" />
                                  </div>
                                  <div>
                                    <h3 className="text-2xl font-bold text-gray-900 mb-2">{job.title}</h3>
                                    <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-4">
                                      <span className="flex items-center">
                                        <MapPin className="h-4 w-4 mr-1" />
                                        {job.location}
                                      </span>
                                      <span className="flex items-center">
                                        <Clock className="h-4 w-4 mr-1" />
                                        {job.type}
                                      </span>
                                      <span className="flex items-center">
                                        <Award className="h-4 w-4 mr-1" />
                                        {job.salary}
                                      </span>
                                      <span className="flex items-center">
                                        <Briefcase className="h-4 w-4 mr-1" />
                                        {job.experience}
                                      </span>
                                    </div>
                                  </div>
                                </div>
                                <Button className={`bg-gradient-to-r ${dept.color} hover:shadow-lg text-white px-6 py-2 rounded-xl transition-all duration-300`}>
                                  <Send className="h-4 w-4 mr-2" />
                                  Postuler
                                </Button>
                              </div>
                              <p className="text-gray-700 leading-relaxed">{job.description}</p>
                            </div>
                          </Card>
                        </motion.div>
                      ))}
                    </motion.div>
                  </TabsContent>
                );
              })}
            </Tabs>
          </motion.section>
          
          {/* Section candidature spontanée avec design attractif */}
          <motion.div 
            className="mt-20"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <div className="bg-gradient-to-r from-red-500 to-pink-500 p-12 rounded-3xl text-white text-center relative overflow-hidden">
              <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -translate-y-20 translate-x-20"></div>
              <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/10 rounded-full translate-y-16 -translate-x-16"></div>
              <div className="relative">
                <motion.div
                  className="w-20 h-20 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-6"
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  transition={{ duration: 0.3 }}
                >
                  <Mail className="h-10 w-10 text-white" />
                </motion.div>
                <h2 className="text-3xl font-bold mb-4">Candidature spontanée</h2>
                <p className="text-xl mb-8 max-w-2xl mx-auto leading-relaxed opacity-90">
                  Vous ne trouvez pas l'offre qui vous correspond mais souhaitez rejoindre notre équipe ? 
                  N'hésitez pas à nous envoyer une candidature spontanée.
                </p>
                <Button 
                  className="bg-white text-red-600 hover:bg-gray-100 px-8 py-4 text-lg rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 font-semibold"
                >
                  <Send className="h-5 w-5 mr-2" />
                  Envoyer ma candidature
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </Layout>
  );
};

export default CarriersPage;
