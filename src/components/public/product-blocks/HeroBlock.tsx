'use client';

import Link from 'next/link';

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
    headline = '',
    subheadline = '',
    ctaText = '',
    ctaLink = '',
    backgroundColor = '#ffffff',
  } = config;

  if (!headline) return null;

  return (
    <div
      className="relative min-h-[400px] md:min-h-[500px] flex items-center justify-center rounded-lg overflow-hidden my-8"
      style={{ backgroundColor }}
    >
      {image && (
        <img src={image} alt={headline} className="absolute inset-0 w-full h-full object-cover" />
      )}
      <div className="relative z-10 text-center p-8 max-w-2xl mx-auto">
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4 drop-shadow-lg">
          {headline}
        </h2>
        {subheadline && (
          <p className="text-lg md:text-xl text-white mb-6 drop-shadow-md">
            {subheadline}
          </p>
        )}
        {ctaText && (
          <Link
            href={ctaLink || '#'}
            className="inline-block bg-white text-gray-900 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
          >
            {ctaText}
          </Link>
        )}
      </div>
    </div>
  );
}

