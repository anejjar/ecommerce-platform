'use client';

import React from 'react';

interface Feature {
  icon?: string;
  title?: string;
  description?: string;
}

interface FeaturesGridConfig {
  heading?: string;
  subheading?: string;
  features?: Feature[];
  columns?: number;
  iconSize?: string;
  backgroundColor?: string;
}

interface FeaturesGridProps {
  config: FeaturesGridConfig;
}

export const FeaturesGrid: React.FC<FeaturesGridProps> = ({ config }) => {
  const {
    heading = 'Why Choose Our Platform',
    subheading = 'Everything you need to succeed',
    features = [
      {
        icon: '⚡',
        title: 'Lightning Fast',
        description: 'Built for speed and performance',
      },
      {
        icon: '🔒',
        title: 'Secure',
        description: 'Bank-grade security',
      },
      {
        icon: '📈',
        title: 'Scalable',
        description: 'Grows with your business',
      },
      {
        icon: '💬',
        title: '24/7 Support',
        description: "We're always here to help",
      },
      {
        icon: '🎯',
        title: 'Easy Setup',
        description: 'Up and running in minutes',
      },
      {
        icon: '🔌',
        title: 'API Access',
        description: 'Integrate with anything',
      },
    ],
    columns = 3,
    iconSize = '48px',
    backgroundColor = '#ffffff',
  } = config;

  const gridCols = {
    2: 'sm:grid-cols-2',
    3: 'sm:grid-cols-2 lg:grid-cols-3',
    4: 'sm:grid-cols-2 lg:grid-cols-4',
  }[columns] || 'sm:grid-cols-2 lg:grid-cols-3';

  return (
    <div
      className="w-full py-16 sm:py-20 lg:py-24"
      style={{ backgroundColor }}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12 sm:mb-16">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 text-gray-900">
            {heading}
          </h2>
          {subheading && (
            <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto">
              {subheading}
            </p>
          )}
        </div>

        {/* Features Grid */}
        <div className={`grid grid-cols-1 ${gridCols} gap-8 lg:gap-10`}>
          {features.map((feature, index) => (
            <div
              key={index}
              className="flex flex-col items-center text-center p-6 rounded-lg hover:shadow-lg transition-shadow duration-200"
            >
              {/* Icon */}
              {feature.icon && (
                <div
                  className="mb-4 flex items-center justify-center"
                  style={{ fontSize: iconSize }}
                >
                  {feature.icon}
                </div>
              )}

              {/* Title */}
              <h3 className="text-xl sm:text-2xl font-semibold mb-3 text-gray-900">
                {feature.title}
              </h3>

              {/* Description */}
              {feature.description && (
                <p className="text-base text-gray-600">
                  {feature.description}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
