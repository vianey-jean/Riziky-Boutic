
import { useEffect } from 'react';

export const useCarouselAutoplay = (isActive: boolean, dataLoaded: boolean, itemsLength: number) => {
  useEffect(() => {
    if (!isActive || !dataLoaded || itemsLength === 0) return;
    
    const carouselInterval = setInterval(() => {
      const nextButton = document.querySelector('[data-carousel-next]') as HTMLElement;
      if (nextButton) nextButton.click();
    }, 3000);
    
    return () => clearInterval(carouselInterval);
  }, [isActive, dataLoaded, itemsLength]);
};
