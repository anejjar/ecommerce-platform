'use client';

import React from 'react';
import Link from 'next/link';

interface CTABannerConfig {
  heading?: string;
  description?: string;
  ctaText?: string;
  ctaLink?: string;
  showEmailCapture?: boolean;
  backgroundColor?: string;
  textColor?: string;
  pattern?: string;
}

interface CTABannerProps {
  config: CTABannerConfig;
}

export const CTABanner: React.FC<CTABannerProps> = ({ config }) => {
  const {
    heading = 'Ready to Get Started?',
    description = 'Start your free trial today. No credit card required.',
    ctaText = 'Start Free Trial',
    ctaLink = '/signup',
    showEmailCapture = false,
    backgroundColor = '#3b82f6',
    textColor = '#ffffff',
    pattern = 'none',
  } = config;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const email = formData.get('email');
    console.log('Email captured:', email);
    // TODO: Implement email capture logic
  };

  return (
    <div
      className="w-full py-16 sm:py-20 lg:py-24 relative overflow-hidden"
      style={{ backgroundColor }}
    >
      {/* Optional Pattern Background */}
      {pattern === 'dots' && (
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: 'radial-gradient(circle, currentColor 1px, transparent 1px)',
            backgroundSize: '20px 20px',
            color: textColor,
          }}
        />
      )}

      {pattern === 'grid' && (
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `linear-gradient(${textColor} 1px, transparent 1px), linear-gradient(90deg, ${textColor} 1px, transparent 1px)`,
            backgroundSize: '40px 40px',
          }}
        />
      )}

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          {/* Heading */}
          <h2
            className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 sm:mb-6"
            style={{ color: textColor }}
          >
            {heading}
          </h2>

          {/* Description */}
          {description && (
            <p
              className="text-lg sm:text-xl mb-8 sm:mb-10 opacity-90"
              style={{ color: textColor }}
            >
              {description}
            </p>
          )}

          {/* Email Capture Form */}
          {showEmailCapture ? (
            <form
              onSubmit={handleSubmit}
              className="max-w-2xl mx-auto"
            >
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                <input
                  type="email"
                  name="email"
                  placeholder="Enter your email"
                  required
                  className="flex-1 px-4 py-3 sm:px-6 sm:py-4 text-base sm:text-lg rounded-lg focus:outline-none focus:ring-2 focus:ring-white text-gray-900"
                />
                <button
                  type="submit"
                  className="px-6 py-3 sm:px-8 sm:py-4 text-base sm:text-lg font-semibold rounded-lg bg-white hover:bg-gray-100 transition-colors duration-200 shadow-lg whitespace-nowrap"
                  style={{ color: backgroundColor }}
                >
                  {ctaText}
                </button>
              </div>
            </form>
          ) : (
            /* Regular CTA Button */
            <Link
              href={ctaLink}
              className="inline-flex items-center justify-center px-8 py-4 text-lg font-semibold rounded-lg bg-white hover:bg-gray-100 transition-colors duration-200 shadow-lg"
              style={{ color: backgroundColor }}
            >
              {ctaText}
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};
