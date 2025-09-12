
import React, { Suspense } from 'react';
import CookieConsent from '../prompts/CookieConsent';
import WelcomePrompt from '../prompts/WelcomePrompt';
import { Product } from '@/contexts/StoreContext';

const LazyTrendingPrompt = React.lazy(() => import('../prompts/TrendingProductsPrompt'));

interface LayoutPromptsProps {
  hidePrompts?: boolean;
  trendingProducts?: Product[];
  hasScrolled: boolean;
  shouldShowTrendingPrompt?: boolean;
}

const LayoutPrompts: React.FC<LayoutPromptsProps> = ({ 
  hidePrompts = false, 
  trendingProducts, 
  hasScrolled,
  shouldShowTrendingPrompt = true
}) => {
  if (hidePrompts) return null;

  return (
    <>
      <CookieConsent />
      <WelcomePrompt />
      {trendingProducts && trendingProducts.length > 0 && hasScrolled && shouldShowTrendingPrompt && (
        <Suspense fallback={null}>
          <LazyTrendingPrompt products={trendingProducts} />
        </Suspense>
      )}
    </>
  );
};

export default LayoutPrompts;
