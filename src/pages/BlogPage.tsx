
import React from 'react';
import Layout from '@/components/layout/Layout';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const BlogPage = () => {
  // Données fictives pour les articles de blog
  const blogPosts = [
    {
      id: 1,
      title: "Les tendances mode printemps-été 2025",
      excerpt: "Découvrez les couleurs, matières et coupes qui feront sensation cette saison.",
      date: "2025-04-15",
      author: "Sophie Martin",
      category: "Mode",
      image: "/placeholder.svg"
    },
    {
      id: 2,
      title: "Comment choisir des accessoires qui complètent votre garde-robe",
      excerpt: "Guide pratique pour sélectionner des accessoires versatiles et durables.",
      date: "2025-04-10",
      author: "Marc Dupont",
      category: "Style",
      image: "/placeholder.svg"
    },
    {
      id: 3,
      title: "L'importance de la mode éthique et durable",
      excerpt: "Comment nos choix vestimentaires peuvent avoir un impact positif sur l'environnement.",
      date: "2025-04-05",
      author: "Léa Rousseau",
      category: "Éco-responsabilité",
      image: "/placeholder.svg"
    },
    {
      id: 4,
      title: "Nos coups de cœur de la nouvelle collection",
      excerpt: "Sélection des pièces incontournables à ne pas manquer cette saison.",
      date: "2025-03-28",
      author: "Thomas Bernard",
      category: "Collections",
      image: "/placeholder.svg"
    },
    {
      id: 5,
      title: "Conseils pour entretenir vos vêtements plus longtemps",
      excerpt: "Astuces pratiques pour préserver la qualité de vos pièces préférées.",
      date: "2025-03-22",
      author: "Julie Moreau",
      category: "Entretien",
      image: "/placeholder.svg"
    },
    {
      id: 6,
      title: "Comment créer une garde-robe capsule efficace",
      excerpt: "Minimalisme et style : les clés pour une garde-robe fonctionnelle.",
      date: "2025-03-15",
      author: "Claire Dubois",
      category: "Style",
      image: "/placeholder.svg"
    }
  ];

  // Formater la date en français
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    };
    return new Date(dateString).toLocaleDateString('fr-FR', options);
  };

  return (
    <Layout>
      <div className="container mx-auto py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-red-800 mb-4">Notre Blog</h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Découvrez nos derniers articles sur la mode, les tendances et des conseils pour sublimer votre style au quotidien.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogPosts.map((post) => (
            <Card key={post.id} className="overflow-hidden flex flex-col">
              <img 
                src={post.image} 
                alt={post.title} 
                className="h-48 w-full object-cover"
              />
              <CardHeader>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-red-800 font-medium">{post.category}</span>
                  <span className="text-sm text-gray-500">{formatDate(post.date)}</span>
                </div>
                <CardTitle className="text-xl">{post.title}</CardTitle>
              </CardHeader>
              <CardContent className="flex-grow">
                <p className="text-gray-600">{post.excerpt}</p>
              </CardContent>
              <CardFooter className="flex justify-between items-center pt-2">
                <span className="text-sm text-gray-500">Par {post.author}</span>
                <Button variant="outline" className="hover:bg-red-50 hover:text-red-800">
                  Lire l'article
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>

        <div className="mt-12 text-center">
          <h2 className="text-2xl font-bold mb-6">Inscrivez-vous à notre newsletter</h2>
          <div className="max-w-lg mx-auto flex flex-col md:flex-row gap-4">
            <input 
              type="email" 
              placeholder="Votre adresse email" 
              className="flex-grow px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-800"
            />
            <Button className="bg-red-800 hover:bg-red-700">
              S'abonner
            </Button>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default BlogPage;
