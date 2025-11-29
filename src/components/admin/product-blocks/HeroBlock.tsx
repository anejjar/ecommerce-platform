'use client';

interface HeroBlockProps {
  config: {
    image?: string;
    headline?: string;
    subheadline?: string;
    ctaText?: string;
    ctaLink?: string;
    backgroundColor?: string;
  };
}

export function HeroBlock({ config }: HeroBlockProps) {
  const {
    image = '',
    headline = 'Enter headline',
    subheadline = 'Enter subheadline',
    ctaText = 'Shop Now',
    ctaLink = '',
    backgroundColor = '#ffffff',
  } = config;

  return (
    <div
      className="relative min-h-[300px] flex items-center justify-center rounded-lg overflow-hidden"
      style={{ backgroundColor }}
    >
      {image ? (
        <img src={image} alt={headline} className="absolute inset-0 w-full h-full object-cover" />
      ) : (
        <div className="absolute inset-0 bg-gray-100 flex items-center justify-center">
          <p className="text-gray-400">No image selected</p>
        </div>
      )}
      <div className="relative z-10 text-center p-8 max-w-2xl">
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 drop-shadow-lg">
          {headline}
        </h2>
        {subheadline && (
          <p className="text-lg md:text-xl text-white mb-6 drop-shadow-md">
            {subheadline}
          </p>
        )}
        {ctaText && (
          <a
            href={ctaLink || '#'}
            className="inline-block bg-white text-gray-900 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
          >
            {ctaText}
          </a>
        )}
      </div>
    </div>
  );
}

