'use client';

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

  if (images.length === 0) return null;

  const gridCols = {
    2: 'md:grid-cols-2',
    3: 'md:grid-cols-3',
    4: 'md:grid-cols-4',
  }[columns] || 'md:grid-cols-3';

  return (
    <div className="my-8">
      {heading && (
        <h3 className="text-2xl md:text-3xl font-bold mb-6 text-center">{heading}</h3>
      )}
      <div className={`grid grid-cols-1 ${gridCols} gap-4`}>
        {images.map((image, index) => (
          <div key={index} className="aspect-square overflow-hidden rounded-lg">
            <img src={image} alt={`Gallery image ${index + 1}`} className="w-full h-full object-cover hover:scale-105 transition-transform duration-300" />
          </div>
        ))}
      </div>
    </div>
  );
}

