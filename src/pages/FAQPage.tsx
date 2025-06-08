import React, { useState } from 'react';
import Layout from '@/components/layout/Layout';
import PageDataLoader from '@/components/layout/PageDataLoader';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const FAQPage = () => {
  const [dataLoaded, setDataLoaded] = useState(false);

  const loadFAQData = async () => {
    // Simuler le chargement des données FAQ
    await new Promise(resolve => setTimeout(resolve, 800));
    return { loaded: true };
  };

  const handleDataSuccess = () => {
    setDataLoaded(true);
  };

  const handleMaxRetriesReached = () => {
    setDataLoaded(true);
  };

  const faqCategories = [
    {
      id: 'commandes',
      name: 'Commandes et livraisons',
      items: [
        {
          question: "Comment suivre ma commande ?",
          answer: "Une fois votre commande expédiée, vous recevrez un email contenant un numéro de suivi. Vous pourrez utiliser ce numéro pour suivre votre colis sur le site du transporteur ou dans la section 'Mes commandes' de votre compte client."
        },
        {
          question: "Quels sont les délais de livraison ?",
          answer: "Pour la France métropolitaine, nos délais de livraison standard sont de 2 à 4 jours ouvrables. Pour les livraisons internationales, les délais varient entre 5 et 10 jours ouvrables selon la destination."
        },
        {
          question: "Quels sont les frais de livraison ?",
          answer: "Les frais de livraison dépendent du pays de destination et du montant de votre commande. En France, la livraison est gratuite pour toute commande supérieure à 50€. Pour les commandes inférieures, les frais sont de 5,90€. Vous pouvez consulter les tarifs détaillés sur notre page Livraisons."
        },
        {
          question: "Puis-je modifier ma commande après l'avoir passée ?",
          answer: "Vous pouvez modifier ou annuler votre commande dans les 2 heures suivant sa passation en contactant notre service client. Au-delà, il est possible que votre commande soit déjà en cours de préparation et ne puisse plus être modifiée."
        },
        {
          question: "Puis-je me faire livrer à une autre adresse que mon domicile ?",
          answer: "Oui, vous pouvez vous faire livrer à l'adresse de votre choix (domicile, lieu de travail, point relais) en spécifiant l'adresse de livraison lors de la validation de votre commande."
        }
      ]
    },
    {
      id: 'retours',
      name: 'Retours et remboursements',
      items: [
        {
          question: "Comment retourner un article ?",
          answer: "Pour retourner un article, rendez-vous dans la section 'Mes commandes' de votre compte client et sélectionnez les articles que vous souhaitez retourner. Imprimez l'étiquette de retour et joignez-la à votre colis. Déposez ensuite votre colis au point de collecte le plus proche."
        },
        {
          question: "Quel est le délai pour effectuer un retour ?",
          answer: "Vous disposez de 30 jours à compter de la réception de votre commande pour retourner un article qui ne vous conviendrait pas."
        },
        {
          question: "Quand serai-je remboursé ?",
          answer: "Une fois votre retour reçu et validé par notre équipe, le remboursement est effectué sous 5 à 7 jours ouvrables. Le délai de réception du remboursement sur votre compte bancaire dépend ensuite de votre banque (généralement 3 à 5 jours ouvrables supplémentaires)."
        },
        {
          question: "Les frais de retour sont-ils gratuits ?",
          answer: "Les frais de retour sont gratuits pour les échanges ou en cas de défaut du produit. Pour les autres motifs de retour, les frais sont à votre charge, sauf mention contraire lors de promotions spécifiques."
        },
        {
          question: "Puis-je échanger un article plutôt que de le retourner ?",
          answer: "Oui, vous pouvez échanger un article contre une autre taille ou couleur si celle-ci est disponible. Précisez-le lors de votre demande de retour dans votre espace client."
        }
      ]
    },
    {
      id: 'produits',
      name: 'Produits',
      items: [
        {
          question: "Comment connaître les tailles disponibles ?",
          answer: "Sur chaque fiche produit, vous trouverez un guide des tailles disponibles. Vous pouvez également consulter notre guide général des tailles dans la section 'Aide' pour vous aider à choisir la taille qui vous convient le mieux."
        },
        {
          question: "Les couleurs des articles sont-elles fidèles aux photos ?",
          answer: "Nous faisons notre maximum pour que les photos soient les plus représentatives possible des produits. Cependant, les couleurs peuvent légèrement varier en fonction des paramètres d'affichage de votre écran."
        },
        {
          question: "Quels sont les matériaux utilisés pour vos vêtements ?",
          answer: "Les matériaux utilisés sont précisés sur chaque fiche produit. Nous privilégions des matières de qualité et travaillons de plus en plus avec des matériaux durables et éco-responsables."
        },
        {
          question: "Comment entretenir mes vêtements ?",
          answer: "Les instructions d'entretien spécifiques sont indiquées sur l'étiquette de chaque vêtement. De manière générale, nous recommandons un lavage à basse température et un séchage à l'air libre pour préserver la qualité et la durabilité de vos vêtements."
        },
        {
          question: "Proposez-vous des produits de tailles inclusives ?",
          answer: "Oui, nous nous efforçons de proposer une gamme de tailles inclusive pour la plupart de nos collections. Notre objectif est que chacun puisse trouver des vêtements qui lui conviennent, quelle que soit sa morphologie."
        }
      ]
    },
    {
      id: 'compte',
      name: 'Compte et paiement',
      items: [
        {
          question: "Comment créer un compte ?",
          answer: "Vous pouvez créer un compte en cliquant sur 'Mon compte' en haut à droite de notre site, puis en sélectionnant 'Créer un compte'. Remplissez ensuite le formulaire avec vos informations personnelles."
        },
        {
          question: "J'ai oublié mon mot de passe, que faire ?",
          answer: "Sur la page de connexion, cliquez sur 'Mot de passe oublié ?'. Vous recevrez un email contenant un lien pour réinitialiser votre mot de passe."
        },
        {
          question: "Quels moyens de paiement acceptez-vous ?",
          answer: "Nous acceptons les paiements par carte bancaire (Visa, Mastercard), PayPal, et Apple Pay. Tous les paiements sont sécurisés."
        },
        {
          question: "Ma carte bancaire a-t-elle été débitée immédiatement ?",
          answer: "Votre carte est débitée au moment de la validation de votre commande. Si nous ne pouvons pas honorer votre commande (article épuisé), vous serez remboursé intégralement."
        },
        {
          question: "Comment mettre à jour mes informations personnelles ?",
          answer: "Vous pouvez mettre à jour vos informations personnelles en vous connectant à votre compte client et en vous rendant dans la section 'Mon profil'."
        }
      ]
    },
    {
      id: 'divers',
      name: 'Questions diverses',
      items: [
        {
          question: "Comment contacter le service client ?",
          answer: "Vous pouvez contacter notre service client par email à contact@rizikyboutique.fr, par téléphone au 01 23 45 67 89 (du lundi au vendredi de 9h à 18h) ou via le formulaire de contact disponible sur notre site."
        },
        {
          question: "Proposez-vous des cartes cadeaux ?",
          answer: "Oui, nous proposons des cartes cadeaux d'une valeur de 25€, 50€, 75€ ou 100€, que vous pouvez offrir à vos proches. Elles sont valables un an à compter de la date d'achat."
        },
        {
          question: "Avez-vous un programme de fidélité ?",
          answer: "Oui, notre programme de fidélité vous permet de cumuler des points à chaque achat. Ces points peuvent ensuite être convertis en réductions sur vos prochaines commandes."
        },
        {
          question: "Où sont fabriqués vos produits ?",
          answer: "Nous travaillons avec divers fournisseurs et ateliers en France et en Europe, avec une attention particulière portée aux conditions de travail et au respect de l'environnement."
        },
        {
          question: "Êtes-vous engagés dans une démarche écologique ?",
          answer: "Absolument ! Nous sommes engagés dans une démarche de développement durable avec l'utilisation croissante de matières éco-responsables, d'emballages recyclables, et un effort constant pour réduire notre empreinte carbone."
        }
      ]
    }
  ];

  return (
    <Layout>
      <PageDataLoader
        fetchFunction={loadFAQData}
        onSuccess={handleDataSuccess}
        onMaxRetriesReached={handleMaxRetriesReached}
        loadingMessage="Chargement de la FAQ..."
        loadingSubmessage="Récupération des questions fréquentes..."
        errorMessage="Erreur de chargement de la FAQ"
      >
        <div className="container mx-auto py-8">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-red-800 mb-4">Foire aux questions</h1>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Trouvez rapidement des réponses à vos questions les plus fréquentes. Si vous ne trouvez pas l'information que vous recherchez, n'hésitez pas à contacter notre service client.
            </p>
          </div>

          <Tabs defaultValue="commandes" className="w-full">
            <TabsList className="w-full flex flex-wrap justify-center mb-8">
              {faqCategories.map(category => (
                <TabsTrigger key={category.id} value={category.id} className="text-sm sm:text-base">
                  {category.name}
                </TabsTrigger>
              ))}
            </TabsList>
            
            {faqCategories.map(category => (
              <TabsContent key={category.id} value={category.id} className="mt-0">
                <Accordion type="single" collapsible className="w-full">
                  {category.items.map((item, index) => (
                    <AccordionItem key={index} value={`item-${index}`}>
                      <AccordionTrigger className="text-lg font-medium">
                        {item.question}
                      </AccordionTrigger>
                      <AccordionContent className="text-gray-600">
                        {item.answer}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </TabsContent>
            ))}
          </Tabs>

          <Separator className="my-12" />
          
          <div className="bg-red-50 p-8 rounded-lg">
            <h2 className="text-2xl font-bold mb-4 text-center">Vous n'avez pas trouvé votre réponse ?</h2>
            <p className="text-center text-gray-600 mb-6">
              Notre équipe du service client est là pour vous aider avec toute question supplémentaire.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="flex flex-col items-center text-center">
                <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-red-800" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <h3 className="font-semibold mb-1">Email</h3>
                <p className="text-gray-600 text-sm mb-2">Réponse sous 24h</p>
                <Link to="/contact" className="text-red-800 hover:underline">Formulaire de contact</Link>
              </div>
              <div className="flex flex-col items-center text-center">
                <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-red-800" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                </div>
                <h3 className="font-semibold mb-1">Téléphone</h3>
                <p className="text-gray-600 text-sm mb-2">Lun-Ven, 9h-18h</p>
                <p className="text-red-800">01 23 45 67 89</p>
              </div>
              <div className="flex flex-col items-center text-center">
                <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-red-800" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                </div>
                <h3 className="font-semibold mb-1">Chat en ligne</h3>
                <p className="text-gray-600 text-sm mb-2">Assistance immédiate</p>
                <Button className="bg-red-800 hover:bg-red-700">
                  Démarrer un chat
                </Button>
              </div>
            </div>
          </div>
        </div>
      </PageDataLoader>
    </Layout>
  );
};

export default FAQPage;
