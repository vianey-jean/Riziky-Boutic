
import { useState, useEffect } from 'react';

export const useScrollDetection = (threshold: number = 200, hidePrompts: boolean = false) => {
  const [hasScrolled, setHasScrolled] = useState(false);

  useEffect(() => {
    if (hidePrompts) return;

    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      setHasScrolled(scrollPosition > threshold);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [threshold, hidePrompts]);

  return hasScrolled;
};
