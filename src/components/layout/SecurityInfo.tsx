
import React from 'react';
import { Shield } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

const SecurityInfo: React.FC = () => {
  return (
    <div className="bg-white dark:bg-neutral-900 py-4 border-t border-neutral-200 dark:border-neutral-800">
      <div className="container mx-auto px-4 flex flex-col md:flex-row items-center justify-center gap-6 text-sm text-neutral-600 dark:text-neutral-400">
        <div className="flex items-center gap-2">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <Shield className="h-5 w-5 text-green-600" />
              </TooltipTrigger>
              <TooltipContent>
                <p className="max-w-xs">Site sécurisé avec protection contre les attaques XSS, injections et force brute.</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <span>Site sécurisé</span>
        </div>
        <div>Paiements sécurisés et cryptés</div>
        <div>Protection des données personnelles</div>
      </div>
    </div>
  );
};

export default SecurityInfo;
