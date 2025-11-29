'use client';

import React from 'react';
import { Link } from '@/navigation';
import Image from 'next/image';

interface HeroSplitLayoutConfig {
  heading?: string;
  description?: string;
  features?: string[];
  image?: string;
  imagePosition?: string;
  imageWidth?: string;
  ctaText?: string;
  ctaLink?: string;
  backgroundColor?: string;
  textColor?: string;
}

interface HeroSplitLayoutProps {
  config: HeroSplitLayoutConfig;
}

export const HeroSplitLayout: React.FC<HeroSplitLayoutProps> = ({ config }) => {
  const {
    heading = 'Transform Your Business',
    description = 'Our platform helps you achieve more with less effort.',
    features = [
      'Automated workflows',
      'Real-time analytics',
      '24/7 support',
    ],
    image = '/defaults/product-screenshot.png',
    imagePosition = 'left',
    imageWidth = '50%',
    ctaText = 'Get Started',
    ctaLink = '/signup',
    backgroundColor = '#f9fafb',
    textColor = '#111827',
  } = config;

  const isImageLeft = imagePosition === 'left';

  return (
    <div
      className="w-full py-16 sm:py-20 lg:py-24"
      style={{ backgroundColor }}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className={`flex flex-col ${isImageLeft ? 'lg:flex-row' : 'lg:flex-row-reverse'} items-center gap-8 lg:gap-12`}>
          {/* Image Side */}
          <div className="w-full lg:w-1/2">
            <div className="relative w-full aspect-[4/3] rounded-lg overflow-hidden shadow-2xl">
              <Image
                src={image}
                alt={heading}
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </div>
          </div>

          {/* Content Side */}
          <div className="w-full lg:w-1/2">
            <h2
              className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 sm:mb-6"
              style={{ color: textColor }}
            >
              {heading}
            </h2>

            <p
              className="text-lg sm:text-xl mb-6 sm:mb-8 opacity-80"
              style={{ color: textColor }}
            >
              {description}
            </p>

            {/* Features List */}
            {features && features.length > 0 && (
              <ul className="space-y-3 sm:space-y-4 mb-8 sm:mb-10">
                {features.map((feature, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <svg
                      className="w-6 h-6 flex-shrink-0 mt-0.5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      style={{ color: '#10b981' }}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    <span
                      className="text-base sm:text-lg"
                      style={{ color: textColor }}
                    >
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>
            )}

            {/* CTA */}
            {ctaText && ctaLink && (
              <Link
                href={ctaLink}
                className="inline-flex items-center justify-center px-6 py-3 sm:px-8 sm:py-4 text-base sm:text-lg font-semibold rounded-lg transition-all duration-200 hover:opacity-90 shadow-lg bg-blue-600 text-white"
              >
                {ctaText}
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
