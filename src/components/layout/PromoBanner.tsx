
import React from 'react';
import { Carousel, CarouselContent, CarouselItem } from '@/components/ui/carousel';
import { Skeleton } from "@/components/ui/skeleton";
import { DynamicIcon } from '@/utils/iconLoader';
import { PubLayout } from '@/services/pubLayoutAPI';

interface PromoBannerProps {
  pubLayoutItems: PubLayout[];
  isLoading: boolean;
}

const PromoBanner: React.FC<PromoBannerProps> = ({ pubLayoutItems, isLoading }) => {
  return (
    <div className="bg-red-600 text-white py-1.5 overflow-hidden">
      <Carousel
        opts={{
          align: "center",
          loop: true,
        }}
        autoPlay={true}
        interval={5000}
        className="w-full"
      >
        <CarouselContent className="mx-auto">
          {isLoading ? (
            <CarouselItem className="basis-full flex justify-center items-center">
              <Skeleton className="h-4 w-60" />
            </CarouselItem>
          ) : (
            pubLayoutItems.map((pub) => (
              <CarouselItem key={pub.id} className="basis-full flex justify-center items-center text-center text-sm">
                <DynamicIcon name={pub.icon} className="h-4 w-4 mr-2" /> {pub.text}
              </CarouselItem>
            ))
          )}
        </CarouselContent>
      </Carousel>
    </div>
  );
};

export default PromoBanner;
