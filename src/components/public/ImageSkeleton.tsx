'use client';

import { Skeleton } from '@/components/ui/skeleton';

interface ImageSkeletonProps {
  aspectRatio?: 'square' | 'video' | 'product' | 'banner';
  className?: string;
}

const aspectRatios = {
  square: 'aspect-square',
  video: 'aspect-video',
  product: 'aspect-[4/5]',
  banner: 'aspect-[21/9]',
};

export function ImageSkeleton({ aspectRatio = 'square', className = '' }: ImageSkeletonProps) {
  return (
    <div className={`${aspectRatios[aspectRatio]} bg-amber-50 rounded-lg overflow-hidden ${className}`}>
      <Skeleton className="w-full h-full" />
    </div>
  );
}

