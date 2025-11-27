'use client';

import React from 'react';
import Link from 'next/link';

interface HeroVideoBackgroundConfig {
  heading?: string;
  subheading?: string;
  videoUrl?: string;
  videoPoster?: string;
  videoMuted?: boolean;
  videoLoop?: boolean;
  videoAutoplay?: boolean;
  fallbackImage?: string;
  ctaPrimaryText?: string;
  ctaPrimaryLink?: string;
  ctaSecondaryText?: string;
  ctaSecondaryLink?: string;
  textColor?: string;
  overlayOpacity?: number;
  contentAlignment?: string;
  minHeight?: string;
}

interface HeroVideoBackgroundProps {
  config: HeroVideoBackgroundConfig;
}

export const HeroVideoBackground: React.FC<HeroVideoBackgroundProps> = ({ config }) => {
  const {
    heading = 'See Our Product in Action',
    subheading = '',
    videoUrl = '/defaults/hero-video.mp4',
    videoPoster = '/defaults/video-poster.jpg',
    videoMuted = true,
    videoLoop = true,
    videoAutoplay = true,
    fallbackImage = '/defaults/hero-bg-2.jpg',
    ctaPrimaryText = 'Watch Demo',
    ctaPrimaryLink = '#demo',
    ctaSecondaryText = 'Sign Up',
    ctaSecondaryLink = '/signup',
    textColor = '#ffffff',
    overlayOpacity = 0.3,
    contentAlignment = 'center',
    minHeight = '700px',
  } = config;

  const alignmentClass = {
    left: 'items-start text-left',
    center: 'items-center text-center',
    right: 'items-end text-right',
  }[contentAlignment] || 'items-center text-center';

  return (
    <div
      className={`relative w-full flex justify-center ${alignmentClass} overflow-hidden`}
      style={{ minHeight }}
    >
      {/* Video Background */}
      <video
        className="absolute inset-0 w-full h-full object-cover"
        autoPlay={videoAutoplay}
        muted={videoMuted}
        loop={videoLoop}
        playsInline
        poster={videoPoster}
        onError={(e) => {
          // Fallback to image if video fails to load
          const target = e.currentTarget;
          target.style.display = 'none';
        }}
      >
        <source src={videoUrl} type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      {/* Fallback Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${fallbackImage})` }}
      />

      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black"
        style={{ opacity: overlayOpacity }}
      />

      {/* Content */}
      <div className="relative z-10 w-full px-4 sm:px-6 lg:px-8 py-20 sm:py-32">
        <div className="mx-auto max-w-4xl">
          {/* Heading */}
          <h1
            className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6"
            style={{ color: textColor }}
          >
            {heading}
          </h1>

          {/* Subheading */}
          {subheading && (
            <p
              className="text-lg sm:text-xl md:text-2xl mb-10 opacity-90"
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
                className="inline-flex items-center justify-center px-8 py-4 text-lg font-semibold rounded-lg transition-all duration-200 hover:opacity-90 shadow-lg bg-white text-gray-900"
              >
                {ctaPrimaryText}
              </Link>
            )}

            {ctaSecondaryText && ctaSecondaryLink && (
              <Link
                href={ctaSecondaryLink}
                className="inline-flex items-center justify-center px-8 py-4 text-lg font-semibold rounded-lg border-2 transition-all duration-200 hover:bg-white hover:bg-opacity-10"
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
