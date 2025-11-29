'use client';

import React from 'react';
import { Link } from '@/navigation';

interface HeroGradientConfig {
  heading?: string;
  subheading?: string;
  gradientFrom?: string;
  gradientTo?: string;
  gradientDirection?: string;
  ctaPrimaryText?: string;
  ctaPrimaryLink?: string;
  ctaSecondaryText?: string;
  ctaSecondaryLink?: string;
  textColor?: string;
  minHeight?: string;
}

interface HeroGradientProps {
  config: HeroGradientConfig;
}

export const HeroGradient: React.FC<HeroGradientProps> = ({ config }) => {
  const {
    heading = 'Build Something Amazing',
    subheading = 'The modern platform for modern teams',
    gradientFrom = '#3b82f6',
    gradientTo = '#8b5cf6',
    gradientDirection = '135deg',
    ctaPrimaryText = 'Start Building',
    ctaPrimaryLink = '/signup',
    ctaSecondaryText = 'See Demo',
    ctaSecondaryLink = '/demo',
    textColor = '#ffffff',
    minHeight = '600px',
  } = config;

  return (
    <div
      className="w-full flex items-center justify-center"
      style={{
        minHeight,
        background: `linear-gradient(${gradientDirection}, ${gradientFrom}, ${gradientTo})`,
      }}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-24">
        <div className="max-w-4xl mx-auto text-center">
          {/* Heading */}
          <h1
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-6 sm:mb-8 leading-tight"
            style={{ color: textColor }}
          >
            {heading}
          </h1>

          {/* Subheading */}
          {subheading && (
            <p
              className="text-lg sm:text-xl md:text-2xl mb-10 sm:mb-12 opacity-90"
              style={{ color: textColor }}
            >
              {subheading}
            </p>
          )}

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            {ctaPrimaryText && ctaPrimaryLink && (
              <Link
                href={ctaPrimaryLink}
                className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-4 text-lg font-semibold rounded-lg transition-all duration-200 hover:opacity-90 shadow-lg bg-white"
                style={{ color: gradientFrom }}
              >
                {ctaPrimaryText}
              </Link>
            )}

            {ctaSecondaryText && ctaSecondaryLink && (
              <Link
                href={ctaSecondaryLink}
                className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-4 text-lg font-semibold rounded-lg border-2 transition-all duration-200 hover:bg-white hover:bg-opacity-10"
                style={{
                  borderColor: textColor,
                  color: textColor,
                }}
              >
                {ctaSecondaryText}
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
