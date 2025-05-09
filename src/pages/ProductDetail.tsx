
import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { useStore } from '@/contexts/StoreContext';
import { Heart, ShoppingCart } from 'lucide-react';
import ProductGrid from '@/components/products/ProductGrid';

const ProductDetail = () => {
  const { productId } = useParams<{ productId: string }>();
  const { products, addToCart, toggleFavorite, isFavorite } = useStore();
  // 🔁 URL de base récupérée depuis le .env
  const AUTH_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  const product = products.find(p => p.id === productId);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  const relatedProducts = products
    .filter(p => p.category === product?.category && p.id !== product?.id)
    .slice(0, 4);

  if (!product) {
    return (
      <Layout>
        <div className="text-center py-20">
          <h1 className="text-2xl font-bold mb-4">Produit non trouvé</h1>
          <p className="mb-6">Le produit que vous recherchez n'existe pas ou a été supprimé.</p>
          <Button asChild>
            <a href="/">Retour à l'accueil</a>
          </Button>
        </div>
      </Layout>
    );
  }

  const isProductFavorite = isFavorite(product.id);

  const productImages =
    product.images && product.images.length > 0
      ? product.images
      : product.image
        ? [product.image]
        : [];

  return (
    <Layout>
      <div className="py-6">
        <div className="flex flex-col lg:flex-row gap-10">
          {/* Images produit */}
          <div className="flex-1">
            <div className="mb-4">
              <img
                src={`${AUTH_BASE_URL}${productImages[selectedImageIndex]}`}
                alt={product.name}
                className="w-full h-[400px] object-contain rounded-lg"
              />
            </div>

            {productImages.length > 1 && (
              <div className="flex justify-center space-x-2 mt-2 overflow-x-auto py-2">
                {productImages.map((image, index) => (
                  <div
                    key={index}
                    className={`w-20 h-20 overflow-hidden rounded cursor-pointer ${
                      index === selectedImageIndex ? 'ring-2 ring-blue-500' : 'opacity-70'
                    }`}
                    onClick={() => setSelectedImageIndex(index)}
                  >
                    <img
                      src={`${AUTH_BASE_URL}${image}`}
                      alt={`${product.name} - image ${index + 1}`}
                      className="w-full h-full object-contain"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Infos produit */}
          <div className="flex-1">
            <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
            <p className="text-xl font-bold mb-4">
              {Number(product.price).toFixed(2)} €
            </p>

            <div className="border-t border-b py-4 my-6">
              <p className="text-gray-700 mb-4">{product.description}</p>
              <p className="text-sm text-muted-foreground mb-2">
                Catégorie : {product.category}
              </p>

              <div className="mt-2">
                {product.stock !== undefined && (
                  <p className="text-sm mb-2">
                    Stock disponible : <span className="font-medium">{product.stock}</span>
                  </p>
                )}
                <span className={`px-2 py-1 rounded text-xs ${
                  product.isSold && (product.stock === undefined || product.stock > 0)
                    ? 'bg-green-100 text-green-800'
                    : 'bg-red-100 text-red-800'
                }`}>
                  {product.isSold && (product.stock === undefined || product.stock > 0)
                    ? 'En stock'
                    : 'Rupture de stock'}
                </span>
              </div>
            </div>

            <div className="flex space-x-4 mt-8">
              <Button
                size="lg"
                onClick={() => addToCart(product)}
                disabled={!product.isSold || (product.stock !== undefined && product.stock <= 0)}
                className="flex-1"
              >
                <ShoppingCart className="mr-2 h-5 w-5" />
                Ajouter au panier
              </Button>

              <Button
                variant="outline"
                size="icon"
                className="h-12 w-12"
                onClick={() => toggleFavorite(product)}
              >
                <Heart
                  className={`h-5 w-5 ${isProductFavorite ? 'fill-red-500 text-red-500' : ''}`}
                />
              </Button>
            </div>

            <div className="mt-6">
              <h3 className="font-medium mb-2">Informations de livraison</h3>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>Livraison gratuite à partir de 50€ d'achat</li>
                <li>Livraison en 3-5 jours ouvrés</li>
                <li>Retours gratuits sous 30 jours</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Produits similaires */}
        <div className="mt-12">
          <ProductGrid products={relatedProducts} title="Produits similaires" />
        </div>
      </div>
    </Layout>
  );
};

export default ProductDetail;
