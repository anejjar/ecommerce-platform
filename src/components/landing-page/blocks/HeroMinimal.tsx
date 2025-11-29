'use client';

import React from 'react';

interface HeroMinimalConfig {
  badge?: string;
  heading?: string;
  subheading?: string;
  showEmailCapture?: boolean;
  emailPlaceholder?: string;
  ctaText?: string;
  trustIndicator?: string;
  backgroundColor?: string;
  textColor?: string;
}

interface HeroMinimalProps {
  config: HeroMinimalConfig;
}

export const HeroMinimal: React.FC<HeroMinimalProps> = ({ config }) => {
  const {
    badge = '🏆 Trusted by 10,000+ companies',
    heading = 'The Best Way to Manage Your Projects',
    subheading = 'Simple, powerful, and built for teams',
    showEmailCapture = true,
    emailPlaceholder = 'Enter your email',
    ctaText = 'Get Started Free',
    trustIndicator = '⭐⭐⭐⭐⭐ 4.9/5 from 2,000 reviews',
    backgroundColor = '#ffffff',
    textColor = '#111827',
  } = config;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle email capture
    const formData = new FormData(e.target as HTMLFormElement);
    const email = formData.get('email');
    console.log('Email captured:', email);
    // TODO: Implement email capture logic
  };

  return (
    <div
      className="w-full py-20 sm:py-28 lg:py-32"
      style={{ backgroundColor }}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge */}
          {badge && (
            <div className="inline-flex items-center justify-center px-4 py-2 mb-6 sm:mb-8 rounded-full bg-blue-50 text-blue-700 text-sm sm:text-base font-medium">
              {badge}
            </div>
          )}

          {/* Heading */}
          <h1
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-4 sm:mb-6 leading-tight"
            style={{ color: textColor }}
          >
            {heading}
          </h1>

          {/* Subheading */}
          {subheading && (
            <p
              className="text-lg sm:text-xl md:text-2xl mb-10 sm:mb-12 opacity-70"
              style={{ color: textColor }}
            >
              {subheading}
            </p>
          )}

          {/* Email Capture Form */}
          {showEmailCapture && (
            <form
              onSubmit={handleSubmit}
              className="max-w-2xl mx-auto mb-8 sm:mb-10"
            >
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                <input
                  type="email"
                  name="email"
                  placeholder={emailPlaceholder}
                  required
                  className="flex-1 px-4 py-3 sm:px-6 sm:py-4 text-base sm:text-lg rounded-lg border-2 border-gray-300 focus:border-blue-500 focus:outline-none"
                  style={{ color: textColor }}
                />
                <button
                  type="submit"
                  className="px-6 py-3 sm:px-8 sm:py-4 text-base sm:text-lg font-semibold rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors duration-200 shadow-lg whitespace-nowrap"
                >
                  {ctaText}
                </button>
              </div>
            </form>
          )}

          {/* Trust Indicator */}
          {trustIndicator && (
            <p
              className="text-sm sm:text-base opacity-60"
              style={{ color: textColor }}
            >
              {trustIndicator}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
