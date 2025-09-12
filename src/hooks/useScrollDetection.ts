
import { useState, useEffect } from 'react';

export const useScrollDetection = (threshold: number = 200, hidePrompts: boolean = false) => {
  const [hasScrolled, setHasScrolled] = useState(false);
  const [shouldShowTrendingPrompt, setShouldShowTrendingPrompt] = useState(false);

  useEffect(() => {
    if (hidePrompts) return;

    let lastScrollY = 0;
    
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      const scrollDirection = scrollPosition > lastScrollY ? 'down' : 'up';
      lastScrollY = scrollPosition;
      
      setHasScrolled(scrollPosition > threshold);

      // Détecter la TestimonialSection
      const testimonialSection = document.querySelector('[data-section="testimonials"]');
      if (testimonialSection) {
        const rect = testimonialSection.getBoundingClientRect();
        const testimonialTop = rect.top + window.scrollY;
        const testimonialBottom = rect.bottom + window.scrollY;
        
        // Si on descend et on franchit le haut de TestimonialSection, désactiver le prompt
        if (scrollDirection === 'down' && scrollPosition > testimonialTop && scrollPosition > threshold) {
          setShouldShowTrendingPrompt(false);
        }
        // Si on monte et on franchit le haut de TestimonialSection, activer le prompt
        else if (scrollDirection === 'up' && scrollPosition < testimonialTop && scrollPosition > threshold) {
          setShouldShowTrendingPrompt(true);
        }
        // Si on est au-dessus de TestimonialSection et on a scrollé assez, montrer le prompt
        else if (scrollPosition < testimonialTop && scrollPosition > threshold) {
          setShouldShowTrendingPrompt(true);
        }
        // Si on est en dessous de TestimonialSection, cacher le prompt
        else if (scrollPosition > testimonialTop) {
          setShouldShowTrendingPrompt(false);
        }
      } else {
        // Fallback: comportement normal si pas de TestimonialSection
        setShouldShowTrendingPrompt(scrollPosition > threshold);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [threshold, hidePrompts]);

  return { hasScrolled, shouldShowTrendingPrompt };
};
