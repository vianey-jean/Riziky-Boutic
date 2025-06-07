
import React from 'react';
import Layout from '@/components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const CarriersPage = () => {
  const departments = [
    {
      id: 'vente',
      name: 'Vente',
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
      description: "Nous sommes constamment à la recherche de nouvelles idées et approches créatives."
    },
    {
      title: "Durabilité",
      description: "Nous nous engageons à minimiser notre impact environnemental à chaque étape."
    },
    {
      title: "Inclusion",
      description: "Nous valorisons la diversité et cultivons un environnement où chacun peut s'épanouir."
    },
    {
      title: "Excellence",
      description: "Nous visons l'excellence dans tout ce que nous faisons, des produits à l'expérience client."
    },
    {
      title: "Collaboration",
      description: "Nous croyons au pouvoir du travail d'équipe et de la communication ouverte."
    }
  ];

  return (
    <Layout>
      <div className="container mx-auto py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-red-800 mb-4">Rejoignez notre équipe</h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Découvrez les opportunités qui vous permettront de développer votre potentiel au sein d'une entreprise dynamique et passionnée.
          </p>
        </div>

        {/* Section pourquoi nous rejoindre */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold mb-8 text-center">Pourquoi nous rejoindre ?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-red-50 p-6 rounded-lg">
              <h3 className="text-xl font-semibold mb-3 text-red-800">Une entreprise en croissance</h3>
              <p className="text-gray-700">
                Rejoignez une entreprise en plein développement et participez à son expansion nationale et internationale.
              </p>
            </div>
            <div className="bg-red-50 p-6 rounded-lg">
              <h3 className="text-xl font-semibold mb-3 text-red-800">Développement de carrière</h3>
              <p className="text-gray-700">
                Bénéficiez d'opportunités de formation continue et d'un accompagnement personnalisé pour votre évolution professionnelle.
              </p>
            </div>
            <div className="bg-red-50 p-6 rounded-lg">
              <h3 className="text-xl font-semibold mb-3 text-red-800">Culture d'entreprise positive</h3>
              <p className="text-gray-700">
                Évoluez dans un environnement bienveillant qui valorise l'équilibre entre vie professionnelle et personnelle.
              </p>
            </div>
          </div>
        </section>

        {/* Section nos valeurs */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold mb-8 text-center">Nos valeurs</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {values.map((value, index) => (
              <Card key={index} className="h-full">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg text-red-800">{value.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 text-sm">{value.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Section offres d'emploi */}
        <section>
          <h2 className="text-2xl font-bold mb-8 text-center">Nos offres d'emploi</h2>
          
          <Tabs defaultValue="vente" className="w-full">
            <TabsList className="grid grid-cols-2 md:grid-cols-5 mb-8">
              {departments.map(dept => (
                <TabsTrigger key={dept.id} value={dept.id}>
                  {dept.name}
                </TabsTrigger>
              ))}
            </TabsList>
            
            {departments.map(dept => (
              <TabsContent key={dept.id} value={dept.id}>
                <div className="grid gap-6">
                  {dept.jobs.map((job, index) => (
                    <Card key={index} className="overflow-hidden">
                      <div className="p-6">
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <h3 className="text-xl font-semibold">{job.title}</h3>
                            <div className="flex items-center mt-2 text-gray-600 text-sm">
                              <span className="mr-4">{job.location}</span>
                              <span>{job.type}</span>
                            </div>
                          </div>
                          <Button className="bg-red-800 hover:bg-red-700">
                            Postuler
                          </Button>
                        </div>
                        <p className="text-gray-700">{job.description}</p>
                      </div>
                    </Card>
                  ))}
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </section>
        
        {/* Section candidature spontanée */}
        <div className="mt-16 bg-gray-50 p-8 rounded-lg text-center">
          <h2 className="text-2xl font-bold mb-4">Candidature spontanée</h2>
          <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
            Vous ne trouvez pas l'offre qui vous correspond mais souhaitez rejoindre notre équipe ? N'hésitez pas à nous envoyer une candidature spontanée.
          </p>
          <Button className="bg-red-800 hover:bg-red-700">
            Envoyer ma candidature
          </Button>
        </div>
      </div>
    </Layout>
  );
};

export default CarriersPage;
