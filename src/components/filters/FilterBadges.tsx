
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';

interface FilterBadge {
  label: string;
  onRemove: () => void;
}

interface FilterBadgesProps {
  badges: FilterBadge[];
  onClearAll?: () => void;
  showClearAll?: boolean;
}

const FilterBadges: React.FC<FilterBadgesProps> = ({ 
  badges, 
  onClearAll, 
  showClearAll = true 
}) => {
  if (badges.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-2 mb-6">
      {badges.map((badge, index) => (
        <Badge key={index} variant="outline" className="flex items-center gap-1 py-1 px-3 bg-white">
          {badge.label}
          <button onClick={badge.onRemove} className="ml-1 hover:text-red-500">
            <X className="h-3 w-3" />
          </button>
        </Badge>
      ))}
      
      {showClearAll && badges.length > 1 && onClearAll && (
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={onClearAll} 
          className="text-sm h-8"
        >
          Effacer tous les filtres
        </Button>
      )}
    </div>
  );
};

export default FilterBadges;
