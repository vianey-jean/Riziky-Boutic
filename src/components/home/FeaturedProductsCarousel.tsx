
import React from 'react';
import { Link } from 'react-router-dom';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { Card, CardContent } from '@/components/ui/card';
import { Product } from '@/contexts/StoreContext';
import { getSecureProductId } from '@/services/secureIds';

interface FeaturedProductsCarouselProps {
  products: Product[];
}

const FeaturedProductsCarousel: React.FC<FeaturedProductsCarouselProps> = ({ products }) => {
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const PRODUCT_PLACEHOLDER_IMAGE = '/placeholder.svg';

  const getSecureImageUrl = (imagePath: string) => {
    if (!imagePath) return PRODUCT_PLACEHOLDER_IMAGE;
    if (imagePath.startsWith('http')) return imagePath;
    return `${API_BASE_URL}${imagePath}`;
  };

  const getSecureProductUrl = (productId: string) => {
    return `/${getSecureProductId(productId, 'product')}`;
  };

  if (products.length === 0) return null;

  return (
    <div className="mb-12">
      <h2 className="text-2xl font-semibold mb-6 text-red-800">Nos Produits Vedettes</h2>
      <Carousel>
        <CarouselContent>
          {products.map(product => (
            <CarouselItem key={product.id} className="md:basis-1/2 lg:basis-1/4">
              <div className="p-1">
                <Card>
                  <CardContent className="flex aspect-square items-center justify-center p-0">
                    <div className="w-full">
                      <Link to={getSecureProductUrl(product.id)} className="block">
                        <img
                          src={getSecureImageUrl(product.image)}
                          alt={`${product.name} - Produit capillaire premium`}
                          className="w-full h-48 object-contain"
                          onError={e => {
                            const target = e.target as HTMLImageElement;
                            target.src = PRODUCT_PLACEHOLDER_IMAGE;
                          }}
                        />
                        <div className="p-4">
                          <h3 className="font-medium">{product.name}</h3>
                          {product.promotion ? (
                            <div className="flex items-center gap-2 px-[19px]">
                              <p className="mt-1 text-sm text-gray-500 line-through">
                                {typeof product.originalPrice === 'number'
                                  ? product.originalPrice.toFixed(2)
                                  : product.price.toFixed(2)}{' '}
                                €
                              </p>
                              <span className="inline-block px-2 py-1 bg-red-100 text-red-800 rounded text-xs font-medium">
                                -{product.promotion}%
                              </span>
                              <p className="mt-1 font-bold">
                                {product.price.toFixed(2)} €
                              </p>
                            </div>
                          ) : (
                            <p className="mt-1 font-bold">
                              {product.price.toFixed(2)} €
                            </p>
                          )}
                        </div>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious data-carousel-previous />
        <CarouselNext data-carousel-next />
      </Carousel>
    </div>
  );
};

export default FeaturedProductsCarousel;
