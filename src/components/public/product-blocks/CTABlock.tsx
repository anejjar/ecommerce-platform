'use client';

import Link from 'next/link';

interface CTABlockProps {
  config: {
    heading?: string;
    text?: string;
    buttonText?: string;
    buttonLink?: string;
    backgroundColor?: string;
    backgroundImage?: string;
  };
}

export function CTABlock({ config }: CTABlockProps) {
  const {
    heading = '',
    text = '',
    buttonText = '',
    buttonLink = '',
    backgroundColor = '#f3f4f6',
    backgroundImage = '',
  } = config;

  if (!heading && !text && !buttonText) return null;

  return (
    <div
      className="relative rounded-lg overflow-hidden p-8 md:p-12 text-center my-8"
      style={{
        backgroundColor: backgroundImage ? 'transparent' : backgroundColor,
        backgroundImage: backgroundImage ? `url(${backgroundImage})` : undefined,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      {backgroundImage && (
        <div className="absolute inset-0 bg-black bg-opacity-40" />
      )}
      <div className="relative z-10 max-w-2xl mx-auto">
        {heading && (
          <h3 className="text-2xl md:text-3xl font-bold mb-4 text-white drop-shadow-lg">
            {heading}
          </h3>
        )}
        {text && (
          <p className="text-lg mb-6 text-white drop-shadow-md">
            {text}
          </p>
        )}
        {buttonText && (
          <Link
            href={buttonLink || '#'}
            className="inline-block bg-white text-gray-900 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
          >
            {buttonText}
          </Link>
        )}
      </div>
    </div>
  );
}

