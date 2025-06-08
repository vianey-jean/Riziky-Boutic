import React, { useState } from 'react';
import Layout from '@/components/layout/Layout';
import PageDataLoader from '@/components/layout/PageDataLoader';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Calendar, User, BookOpen, TrendingUp, Star, Mail } from 'lucide-react';

const BlogPage = () => {
  const [dataLoaded, setDataLoaded] = useState(false);

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

  const loadBlogData = async () => {
    // Simuler le chargement des articles
    await new Promise(resolve => setTimeout(resolve, 1000));
    return blogPosts;
  };

  const handleDataSuccess = () => {
    setDataLoaded(true);
  };

  const handleMaxRetriesReached = () => {
    setDataLoaded(true);
  };

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
      <div className="min-h-screen bg-gradient-to-br from-neutral-50 via-white to-neutral-50 dark:from-neutral-950 dark:via-neutral-900 dark:to-neutral-950">
        {/* Hero Section */}
        <div className="relative overflow-hidden bg-gradient-to-r from-purple-500/10 via-pink-500/10 to-rose-500/10 dark:from-purple-500/5 dark:via-pink-500/5 dark:to-rose-500/5">
          <div className="absolute inset-0 bg-grid-neutral-100/50 dark:bg-grid-neutral-800/50" />
          <div className="container mx-auto px-4 py-16 relative">
            <div className="text-center max-w-4xl mx-auto">
              <div className="flex items-center justify-center mb-6">
                <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-3 rounded-2xl shadow-lg">
                  <BookOpen className="h-8 w-8 text-white" />
                </div>
              </div>
              
              <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-rose-600 bg-clip-text text-transparent mb-6">
                Notre Blog
              </h1>
              
              <p className="text-lg md:text-xl text-neutral-600 dark:text-neutral-300 mb-8 leading-relaxed">
                Découvrez nos derniers articles sur la mode, les tendances et des conseils pour sublimer votre style au quotidien.
              </p>
              
              <div className="flex items-center justify-center space-x-8 text-sm text-neutral-500 dark:text-neutral-400">
                <div className="flex items-center space-x-2">
                  <TrendingUp className="h-5 w-5 text-purple-500" />
                  <span>Tendances mode</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Star className="h-5 w-5 text-pink-500" />
                  <span>Conseils style</span>
                </div>
                <div className="flex items-center space-x-2">
                  <BookOpen className="h-5 w-5 text-rose-500" />
                  <span>Guides pratiques</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-12">
          <PageDataLoader
            fetchFunction={loadBlogData}
            onSuccess={handleDataSuccess}
            onMaxRetriesReached={handleMaxRetriesReached}
            loadingMessage="Chargement des articles..."
            loadingSubmessage="Récupération de nos derniers contenus..."
            errorMessage="Erreur de chargement des articles"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {blogPosts.map((post) => (
                <Card key={post.id} className="overflow-hidden flex flex-col bg-white dark:bg-neutral-900 shadow-sm border border-neutral-200 dark:border-neutral-800 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                  <div className="relative overflow-hidden">
                    <img 
                      src={post.image} 
                      alt={post.title} 
                      className="h-48 w-full object-cover transition-transform duration-300 hover:scale-105"
                    />
                    <div className="absolute top-3 left-3">
                      <span className="bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs font-medium px-3 py-1 rounded-full">
                        {post.category}
                      </span>
                    </div>
                  </div>
                  
                  <CardHeader className="pb-3">
                    <div className="flex justify-between items-center mb-3">
                      <div className="flex items-center text-sm text-neutral-500 dark:text-neutral-400">
                        <Calendar className="h-4 w-4 mr-1" />
                        {formatDate(post.date)}
                      </div>
                    </div>
                    <CardTitle className="text-xl leading-tight hover:text-purple-600 dark:hover:text-purple-400 transition-colors">
                      {post.title}
                    </CardTitle>
                  </CardHeader>
                  
                  <CardContent className="flex-grow pb-4">
                    <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed">
                      {post.excerpt}
                    </p>
                  </CardContent>
                  
                  <CardFooter className="flex justify-between items-center pt-4 border-t border-neutral-200 dark:border-neutral-700">
                    <div className="flex items-center text-sm text-neutral-500 dark:text-neutral-400">
                      <User className="h-4 w-4 mr-2" />
                      Par {post.author}
                    </div>
                    <Button 
                      variant="outline" 
                      size="sm"
                      className="hover:bg-gradient-to-r hover:from-purple-50 hover:to-pink-50 hover:text-purple-700 hover:border-purple-300 dark:hover:from-purple-950/20 dark:hover:to-pink-950/20 dark:hover:text-purple-400 transition-all duration-300"
                    >
                      Lire l'article
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>

            {/* Newsletter Section */}
            <div className="mt-16 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-950/20 dark:to-pink-950/20 rounded-xl p-8 text-center border border-purple-200 dark:border-purple-800">
              <div className="flex items-center justify-center mb-6">
                <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-3 rounded-2xl">
                  <Mail className="h-8 w-8 text-white" />
                </div>
              </div>
              
              <h2 className="text-3xl font-bold mb-4 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                Inscrivez-vous à notre newsletter
              </h2>
              <p className="text-neutral-600 dark:text-neutral-400 mb-8 max-w-2xl mx-auto">
                Recevez nos derniers articles, conseils mode et offres exclusives directement dans votre boîte mail.
              </p>
              
              <div className="max-w-lg mx-auto flex flex-col md:flex-row gap-4">
                <input 
                  type="email" 
                  placeholder="Votre adresse email" 
                  className="flex-grow px-6 py-4 border border-neutral-300 dark:border-neutral-600 rounded-full focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 transition-all duration-300"
                />
                <Button className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-8 py-4 rounded-full shadow-lg transition-all duration-300">
                  <Mail className="h-5 w-5 mr-2" />
                  S'abonner
                </Button>
              </div>
            </div>
          </PageDataLoader>
        </div>
      </div>
    </Layout>
  );
};

export default BlogPage;
