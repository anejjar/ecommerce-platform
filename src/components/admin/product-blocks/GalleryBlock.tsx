'use client';

import { handleNativeImageError } from '@/lib/image-utils';

interface GalleryBlockProps {
  config: {
    heading?: string;
    images?: string[];
    layout?: 'grid' | 'masonry';
    columns?: 2 | 3 | 4;
  };
}

export function GalleryBlock({ config }: GalleryBlockProps) {
  const {
    heading = '',
    images = [],
    layout = 'grid',
    columns = 3,
  } = config;

  const gridCols = {
    2: 'md:grid-cols-2',
    3: 'md:grid-cols-3',
    4: 'md:grid-cols-4',
  }[columns] || 'md:grid-cols-3';

  return (
    <div className="p-6">
      {heading && (
        <h3 className="text-2xl font-bold mb-6 text-center">{heading}</h3>
      )}
      {images.length > 0 ? (
        <div className={`grid grid-cols-1 ${gridCols} gap-4`}>
          {images.map((image, index) => (
            <div key={index} className="aspect-square overflow-hidden rounded-lg">
              <img
                src={image}
                alt={`Gallery image ${index + 1}`}
                className="w-full h-full object-cover"
                onError={handleNativeImageError}
              />
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center text-gray-400 py-12 border-2 border-dashed rounded-lg">
          No images added yet
        </div>
      )}
    </div>
  );
}

