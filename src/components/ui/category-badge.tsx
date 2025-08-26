
import React from 'react';
import { cn } from '@/lib/utils';

interface CategoryBadgeProps {
  category: 'wigs' | 'weaves' | 'ponytails' | 'tools' | 'adhesives' | 'tech';
  children: React.ReactNode;
  className?: string;
}

const CategoryBadge: React.FC<CategoryBadgeProps> = ({ category, children, className }) => {
  const categoryColors = {
    wigs: 'bg-categories-wigs/20 text-categories-wigs border-categories-wigs/30',
    weaves: 'bg-categories-weaves/20 text-categories-weaves border-categories-weaves/30',
    ponytails: 'bg-categories-ponytails/20 text-categories-ponytails border-categories-ponytails/30',
    tools: 'bg-categories-tools/20 text-categories-tools border-categories-tools/30',
    adhesives: 'bg-categories-adhesives/20 text-categories-adhesives border-categories-adhesives/30',
    tech: 'bg-categories-tech/20 text-categories-tech border-categories-tech/30',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border',
        categoryColors[category],
        className
      )}
    >
      {children}
    </span>
  );
};

export { CategoryBadge };
