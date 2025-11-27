'use client';

import React from 'react';
import Link from 'next/link';

interface HeroBackgroundImageConfig {
  heading?: string;
  subheading?: string;
  backgroundImage?: string;
  backgroundPosition?: string;
  backgroundSize?: string;
  ctaPrimaryText?: string;
  ctaPrimaryLink?: string;
  ctaSecondaryText?: string;
  ctaSecondaryLink?: string;
  textColor?: string;
  overlayColor?: string;
  overlayOpacity?: number;
  contentAlignment?: string;
  contentVerticalAlign?: string;
  minHeight?: string;
  maxWidth?: string;
  paddingTop?: string;
  paddingBottom?: string;
}

interface HeroBackgroundImageProps {
  config: HeroBackgroundImageConfig;
}

export const HeroBackgroundImage: React.FC<HeroBackgroundImageProps> = ({ config }) => {
  const {
    heading = 'Welcome to Our Platform',
    subheading = 'Build amazing things with our tools',
    backgroundImage = '/defaults/hero-bg-1.jpg',
    backgroundPosition = 'center',
    backgroundSize = 'cover',
    ctaPrimaryText = 'Get Started',
    ctaPrimaryLink = '/signup',
    ctaSecondaryText = '',
    ctaSecondaryLink = '',
    textColor = '#ffffff',
    overlayColor = '#000000',
    overlayOpacity = 0.5,
    contentAlignment = 'center',
    contentVerticalAlign = 'center',
    minHeight = '600px',
    maxWidth = '800px',
    paddingTop = '80px',
    paddingBottom = '80px',
  } = config;

  const alignmentClass = {
    left: 'items-start text-left',
    center: 'items-center text-center',
    right: 'items-end text-right',
  }[contentAlignment] || 'items-center text-center';

  const verticalAlignClass = {
    top: 'justify-start',
    center: 'justify-center',
    bottom: 'justify-end',
  }[contentVerticalAlign] || 'justify-center';

  return (
    <div
      className={`relative w-full flex ${verticalAlignClass} ${alignmentClass}`}
      style={{
        minHeight,
        backgroundImage: `url(${backgroundImage})`,
        backgroundPosition,
        backgroundSize,
        backgroundRepeat: 'no-repeat',
        paddingTop,
        paddingBottom,
      }}
    >
      {/* Overlay */}
      <div
        className="absolute inset-0"
        style={{
          backgroundColor: overlayColor,
          opacity: overlayOpacity,
        }}
      />

      {/* Content */}
      <div className="relative z-10 w-full px-4 sm:px-6 lg:px-8">
        <div className="mx-auto" style={{ maxWidth }}>
          {/* Heading */}
          <h1
            className="text-4xl sm:text-5xl md:text-6xl font-bold mb-4 sm:mb-6"
            style={{ color: textColor }}
          >
            {heading}
          </h1>

          {/* Subheading */}
          {subheading && (
            <p
              className="text-lg sm:text-xl md:text-2xl mb-8 sm:mb-10 opacity-90"
              style={{ color: textColor }}
            >
              {subheading}
            </p>
          )}

          {/* CTAs */}
          <div className={`flex flex-wrap gap-4 ${contentAlignment === 'center' ? 'justify-center' : contentAlignment === 'right' ? 'justify-end' : 'justify-start'}`}>
            {ctaPrimaryText && ctaPrimaryLink && (
              <Link
                href={ctaPrimaryLink}
                className="inline-flex items-center justify-center px-6 py-3 sm:px-8 sm:py-4 text-base sm:text-lg font-semibold rounded-lg transition-all duration-200 hover:opacity-90 shadow-lg"
                style={{
                  backgroundColor: textColor,
                  color: overlayColor,
                }}
              >
                {ctaPrimaryText}
              </Link>
            )}

            {ctaSecondaryText && ctaSecondaryLink && (
              <Link
                href={ctaSecondaryLink}
                className="inline-flex items-center justify-center px-6 py-3 sm:px-8 sm:py-4 text-base sm:text-lg font-semibold rounded-lg border-2 transition-all duration-200 hover:bg-white hover:bg-opacity-10"
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
