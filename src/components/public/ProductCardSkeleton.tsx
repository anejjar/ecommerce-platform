'use client';

import { Skeleton } from '@/components/ui/skeleton';

export function ProductCardSkeleton() {
  return (
    <div className="group relative bg-white rounded-2xl overflow-hidden border border-amber-100 flex flex-col h-full">
      {/* Image Skeleton */}
      <div className="relative aspect-[4/5] bg-amber-50 overflow-hidden">
        <Skeleton className="w-full h-full" />
      </div>

      {/* Content Skeleton */}
      <div className="p-4 flex flex-col flex-grow space-y-3">
        {/* Category */}
        <Skeleton className="h-3 w-20" />
        
        {/* Title */}
        <Skeleton className="h-5 w-full" />
        <Skeleton className="h-5 w-3/4" />
        
        {/* Price */}
        <div className="mt-auto flex items-end justify-between">
          <Skeleton className="h-6 w-24" />
          <Skeleton className="h-10 w-10 rounded-full" />
        </div>
      </div>
    </div>
  );
}

export function ProductGridSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <ProductCardSkeleton key={i} />
      ))}
    </div>
  );
}

