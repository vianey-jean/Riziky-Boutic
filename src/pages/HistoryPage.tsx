
import React from 'react';
import Layout from '@/components/layout/Layout';
import { Separator } from '@/components/ui/separator';

const HistoryPage = () => {
  const timelineEvents = [
    {
      year: "2010",
      title: "Création de l'entreprise",
      description: "Riziky Boutique est fondée par un groupe d'amis passionnés de mode avec un petit showroom à Paris."
    },
    {
      year: "2012",
      title: "Première boutique physique",
      description: "Ouverture de notre première boutique dans le Marais à Paris, spécialisée dans les accessoires de mode artisanaux."
    },
    {
      year: "2014",
      title: "Lancement de notre première collection",
      description: "Création de notre première ligne de vêtements 'Élégance Parisienne', un succès immédiat auprès de notre clientèle."
    },
    {
      year: "2016",
      title: "Expansion nationale",
      description: "Ouverture de trois nouvelles boutiques à Lyon, Marseille et Bordeaux, marquant notre expansion sur le territoire français."
    },
    {
      year: "2018",
      title: "Lancement de la boutique en ligne",
      description: "Développement de notre plateforme e-commerce pour atteindre une clientèle plus large à travers toute la France."
    },
    {
      year: "2020",
      title: "Engagement pour la durabilité",
      description: "Introduction de notre première collection éco-responsable et mise en place d'une charte de développement durable."
    },
    {
      year: "2022",
      title: "Expansion internationale",
      description: "Ouverture de notre première boutique à l'international à Bruxelles, marquant le début de notre présence européenne."
    },
    {
      year: "2024",
      title: "Innovation technologique",
      description: "Lancement de notre application mobile avec des fonctionnalités de réalité augmentée pour essayer virtuellement nos vêtements."
    },
    {
      year: "2025",
      title: "Aujourd'hui",
      description: "Riziky Boutique compte désormais 15 boutiques en France et en Europe, une équipe de plus de 100 passionnés, et poursuit son développement avec de nouveaux projets innovants."
    }
  ];

  return (
    <Layout>
      <div className="container mx-auto py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-red-800 mb-4">Notre Histoire</h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Découvrez comment Riziky Boutique est devenue une référence dans l'univers de la mode, de ses humbles débuts à aujourd'hui.
          </p>
        </div>

        <div className="mb-16 flex flex-col md:flex-row gap-8 items-center">
          <div className="md:w-1/2">
            <h2 className="text-2xl font-bold mb-4 text-red-800">Nos débuts</h2>
            <p className="text-gray-700 mb-4">
              L'aventure de Riziky Boutique a commencé en 2010 lorsqu'un groupe d'amis passionnés de mode a décidé de transformer leur passion en entreprise. Avec un petit capital et beaucoup d'ambition, ils ont ouvert un showroom modeste dans le cœur de Paris.
            </p>
            <p className="text-gray-700">
              Ce qui n'était au départ qu'une collection d'accessoires soigneusement sélectionnés est rapidement devenu une référence pour les amateurs de mode à la recherche de pièces uniques et de qualité.
            </p>
          </div>
          <div className="md:w-1/2">
            <img 
              src="/placeholder.svg" 
              alt="Les fondateurs de Riziky Boutique" 
              className="rounded-lg shadow-md w-full h-auto"
            />
          </div>
        </div>

        {/* Timeline */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold mb-8 text-center">Notre parcours</h2>
          <div className="space-y-8">
            {timelineEvents.map((event, index) => (
              <div key={index} className="relative">
                <div className={`flex flex-col md:flex-row gap-4 ${index % 2 === 0 ? '' : 'md:flex-row-reverse'}`}>
                  <div className="md:w-1/6 flex justify-center">
                    <div className="bg-red-800 text-white font-bold py-2 px-4 rounded-lg">
                      {event.year}
                    </div>
                  </div>
                  <div className="hidden md:block md:w-1/12 relative">
                    <div className="absolute left-1/2 transform -translate-x-1/2 h-full">
                      <div className="h-full w-1 bg-red-200"></div>
                    </div>
                    <div className="absolute left-1/2 top-6 transform -translate-x-1/2 w-4 h-4 rounded-full bg-red-800 border-4 border-red-100"></div>
                  </div>
                  <div className="md:w-5/6">
                    <div className="bg-white p-6 rounded-lg shadow-sm">
                      <h3 className="text-xl font-semibold mb-2">{event.title}</h3>
                      <p className="text-gray-700">{event.description}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mb-16">
          <h2 className="text-2xl font-bold mb-8 text-center">Notre vision</h2>
          <div className="bg-red-50 p-8 rounded-lg">
            <p className="text-xl text-center italic text-gray-700 mb-4">
              "Notre ambition est de créer une mode accessible, éthique et inspirante, qui permet à chacun d'exprimer sa personnalité tout en respectant notre planète."
            </p>
            <p className="text-center text-gray-600">
              - L'équipe fondatrice de Riziky Boutique
            </p>
          </div>
        </div>

        <div>
          <h2 className="text-2xl font-bold mb-8 text-center">Notre équipe dirigeante</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[1, 2, 3].map((person) => (
              <div key={person} className="text-center">
                <div className="w-32 h-32 bg-gray-200 rounded-full mx-auto mb-4">
                  <img 
                    src="/placeholder.svg" 
                    alt="Photo du dirigeant" 
                    className="w-full h-full object-cover rounded-full"
                  />
                </div>
                <h3 className="text-xl font-semibold">Nom Prénom</h3>
                <p className="text-red-800 mb-2">Titre / Position</p>
                <p className="text-gray-600 text-sm">
                  Court descriptif de l'expérience et du rôle dans l'entreprise, parcours professionnel.
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default HistoryPage;
