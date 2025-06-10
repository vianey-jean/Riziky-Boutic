
import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';

const LoadingFallback = () => (
  <div className="container mx-auto px-4 py-10">
    <div className="space-y-8 max-w-5xl mx-auto">
      <Skeleton className="h-12 w-3/4 mx-auto" />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="space-y-4">
            <Skeleton className="h-52 w-full" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
          </div>
        ))}
      </div>
    </div>
  </div>
);

export default LoadingFallback;
