
import React from 'react';
import Layout from '@/components/layout/Layout';
import { Separator } from '@/components/ui/separator';
import { Calendar, Users, Building, Target, Award, Rocket, Globe, Smartphone, TrendingUp } from 'lucide-react';

const HistoryPage = () => {
  const timelineEvents = [
    {
      year: "2010",
      title: "Création de l'entreprise",
      description: "Riziky Boutique est fondée par un groupe d'amis passionnés de mode avec un petit showroom à Paris.",
      icon: <Rocket className="h-5 w-5" />,
      color: "from-blue-500 to-blue-600"
    },
    {
      year: "2012",
      title: "Première boutique physique",
      description: "Ouverture de notre première boutique dans le Marais à Paris, spécialisée dans les accessoires de mode artisanaux.",
      icon: <Building className="h-5 w-5" />,
      color: "from-green-500 to-green-600"
    },
    {
      year: "2014",
      title: "Première collection signature",
      description: "Création de notre première ligne de vêtements 'Élégance Parisienne', un succès immédiat auprès de notre clientèle.",
      icon: <Award className="h-5 w-5" />,
      color: "from-purple-500 to-purple-600"
    },
    {
      year: "2016",
      title: "Expansion nationale",
      description: "Ouverture de trois nouvelles boutiques à Lyon, Marseille et Bordeaux, marquant notre expansion sur le territoire français.",
      icon: <TrendingUp className="h-5 w-5" />,
      color: "from-red-500 to-red-600"
    },
    {
      year: "2018",
      title: "Révolution numérique",
      description: "Développement de notre plateforme e-commerce pour atteindre une clientèle plus large à travers toute la France.",
      icon: <Globe className="h-5 w-5" />,
      color: "from-cyan-500 to-cyan-600"
    },
    {
      year: "2020",
      title: "Engagement durable",
      description: "Introduction de notre première collection éco-responsable et mise en place d'une charte de développement durable.",
      icon: <Target className="h-5 w-5" />,
      color: "from-emerald-500 to-emerald-600"
    },
    {
      year: "2022",
      title: "Rayonnement européen",
      description: "Ouverture de notre première boutique à l'international à Bruxelles, marquant le début de notre présence européenne.",
      icon: <Building className="h-5 w-5" />,
      color: "from-indigo-500 to-indigo-600"
    },
    {
      year: "2024",
      title: "Innovation technologique",
      description: "Lancement de notre application mobile avec des fonctionnalités de réalité augmentée pour essayer virtuellement nos vêtements.",
      icon: <Smartphone className="h-5 w-5" />,
      color: "from-pink-500 to-pink-600"
    },
    {
      year: "2025",
      title: "Excellence et croissance",
      description: "Riziky Boutique compte désormais 15 boutiques en France et en Europe, une équipe de plus de 100 passionnés, et poursuit son développement avec de nouveaux projets innovants.",
      icon: <Users className="h-5 w-5" />,
      color: "from-orange-500 to-orange-600"
    }
  ];

  const teamMembers = [
    {
      name: "Sophie Dubois",
      title: "Fondatrice & CEO",
      description: "Visionnaire passionnée de mode, Sophie a transformé sa passion en empire fashion avec plus de 15 ans d'expérience."
    },
    {
      name: "Marc Laurent",
      title: "Directeur Créatif",
      description: "Designer reconnu avec une expertise internationale, Marc dirige nos collections avec créativité et innovation."
    },
    {
      name: "Emma Martin",
      title: "Directrice Marketing",
      description: "Stratège marketing digitale, Emma développe notre présence en ligne et nos campagnes créatives."
    }
  ];

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <div className="container mx-auto px-4 py-12">
          {/* En-tête moderne */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-red-500 to-pink-500 rounded-full mb-6 shadow-lg">
              <Calendar className="h-10 w-10 text-white" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-red-600 via-pink-600 to-purple-600 bg-clip-text text-transparent mb-4">
              Notre Histoire
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-4xl mx-auto leading-relaxed">
              Découvrez comment Riziky Boutique est devenue une référence dans l'univers de la mode, 
              de ses humbles débuts à aujourd'hui, à travers 15 années d'innovation et de passion.
            </p>
          </div>

          {/* Section débuts avec design moderne */}
          <div className="mb-20">
            <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
              <div className="flex flex-col lg:flex-row">
                <div className="lg:w-1/2 p-8 lg:p-12">
                  <div className="flex items-center mb-6">
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center mr-4">
                      <Rocket className="h-6 w-6 text-white" />
                    </div>
                    <h2 className="text-3xl font-bold text-red-800 dark:text-red-400">Nos débuts</h2>
                  </div>
                  <div className="space-y-6">
                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                      L'aventure de <span className="font-semibold text-red-600">Riziky Boutique</span> a commencé en 2010 lorsqu'un groupe d'amis passionnés de mode a décidé de transformer leur passion en entreprise. Avec un petit capital et beaucoup d'ambition, ils ont ouvert un showroom modeste dans le cœur de Paris.
                    </p>
                    <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-2xl p-6 border border-blue-200 dark:border-blue-800">
                      <p className="text-gray-700 dark:text-gray-300">
                        Ce qui n'était au départ qu'une collection d'accessoires soigneusement sélectionnés est rapidement devenu une référence pour les amateurs de mode à la recherche de pièces uniques et de qualité.
                      </p>
                    </div>
                  </div>
                </div>
                <div className="lg:w-1/2 relative">
                  <div className="h-64 lg:h-full bg-gradient-to-br from-red-100 to-pink-100 dark:from-red-900/20 dark:to-pink-900/20 flex items-center justify-center">
                    <div className="text-center p-8">
                      <div className="w-24 h-24 bg-gradient-to-r from-red-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Building className="h-12 w-12 text-white" />
                      </div>
                      <p className="text-gray-600 dark:text-gray-400 font-medium">
                        Premier showroom à Paris
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Timeline moderne */}
          <div className="mb-20">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
                Notre parcours
              </h2>
              <p className="text-gray-600 dark:text-gray-400">15 années d'innovation et de croissance</p>
            </div>
            
            <div className="relative">
              {/* Ligne centrale */}
              <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-gradient-to-b from-red-500 via-purple-500 to-blue-500 hidden lg:block"></div>
              
              <div className="space-y-12">
                {timelineEvents.map((event, index) => (
                  <div key={index} className={`relative flex items-center ${index % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'}`}>
                    {/* Point central sur desktop */}
                    <div className="hidden lg:block absolute left-1/2 transform -translate-x-1/2 z-10">
                      <div className={`w-16 h-16 bg-gradient-to-r ${event.color} rounded-full flex items-center justify-center shadow-xl border-4 border-white dark:border-gray-800`}>
                        {event.icon}
                      </div>
                    </div>
                    
                    {/* Contenu */}
                    <div className={`w-full lg:w-5/12 ${index % 2 === 0 ? '' : 'lg:ml-auto'}`}>
                      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 p-6 hover:shadow-2xl transition-all duration-300 hover:scale-105">
                        <div className="flex items-center mb-4 lg:hidden">
                          <div className={`w-12 h-12 bg-gradient-to-r ${event.color} rounded-full flex items-center justify-center mr-4`}>
                            {event.icon}
                          </div>
                          <div className={`px-4 py-2 bg-gradient-to-r ${event.color} text-white font-bold rounded-full text-lg`}>
                            {event.year}
                          </div>
                        </div>
                        
                        <div className="hidden lg:block mb-4">
                          <div className={`inline-block px-4 py-2 bg-gradient-to-r ${event.color} text-white font-bold rounded-full text-lg`}>
                            {event.year}
                          </div>
                        </div>
                        
                        <h3 className="text-xl font-bold mb-3 text-gray-900 dark:text-white">{event.title}</h3>
                        <p className="text-gray-600 dark:text-gray-300 leading-relaxed">{event.description}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Vision moderne */}
          <div className="mb-20">
            <div className="bg-gradient-to-r from-red-500 to-pink-500 rounded-3xl shadow-2xl overflow-hidden">
              <div className="p-8 lg:p-16 text-center text-white relative">
                <div className="absolute top-0 left-0 w-32 h-32 bg-white/10 rounded-full -translate-x-16 -translate-y-16"></div>
                <div className="absolute bottom-0 right-0 w-40 h-40 bg-white/10 rounded-full translate-x-20 translate-y-20"></div>
                <div className="relative">
                  <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Target className="h-8 w-8 text-white" />
                  </div>
                  <h2 className="text-3xl font-bold mb-8">Notre vision</h2>
                  <blockquote className="text-xl lg:text-2xl italic mb-6 leading-relaxed max-w-4xl mx-auto">
                    "Notre ambition est de créer une mode accessible, éthique et inspirante, qui permet à chacun d'exprimer sa personnalité tout en respectant notre planète."
                  </blockquote>
                  <p className="text-white/80 text-lg">
                    - L'équipe fondatrice de Riziky Boutique
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Équipe dirigeante moderne */}
          <div>
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-4">
                Notre équipe dirigeante
              </h2>
              <p className="text-gray-600 dark:text-gray-400">Les visionnaires derrière Riziky Boutique</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {teamMembers.map((person, index) => (
                <div key={index} className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 p-6 text-center hover:shadow-2xl transition-all duration-300 hover:scale-105">
                  <div className="w-24 h-24 bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-600 dark:to-gray-700 rounded-full mx-auto mb-6 flex items-center justify-center">
                    <Users className="h-12 w-12 text-gray-500 dark:text-gray-400" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{person.name}</h3>
                  <p className="text-red-600 dark:text-red-400 font-semibold mb-4">{person.title}</p>
                  <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
                    {person.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default HistoryPage;
