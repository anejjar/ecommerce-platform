'use client';

import React from 'react';
import Link from 'next/link';
import { Home, ChevronRight } from 'lucide-react';

interface BreadcrumbItem {
  label: string;
  link?: string;
  current?: boolean;
}

interface PageHeaderConfig {
  title?: string;
  subtitle?: string;
  showBreadcrumbs?: boolean;
  breadcrumbs?: BreadcrumbItem[];
  backgroundImage?: string;
  backgroundColor?: string;
  textColor?: string;
  alignment?: string;
  paddingTop?: string;
  paddingBottom?: string;
}

export const PageHeader: React.FC<{ config: PageHeaderConfig }> = ({ config }) => {
  const {
    title = 'Page Title',
    subtitle,
    showBreadcrumbs = true,
    breadcrumbs = [],
    backgroundImage,
    backgroundColor = '#f9fafb',
    textColor = '#111827',
    alignment = 'left',
    paddingTop = '60px',
    paddingBottom = '60px',
  } = config;

  const alignmentClass = {
    left: 'text-left',
    center: 'text-center',
    right: 'text-right',
  }[alignment] || 'text-left';

  return (
    <div
      className={`w-full ${alignmentClass}`}
      style={{
        backgroundImage: backgroundImage ? `url(${backgroundImage})` : undefined,
        backgroundColor: !backgroundImage ? backgroundColor : undefined,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        paddingTop,
        paddingBottom,
        color: textColor,
      }}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumbs */}
        {showBreadcrumbs && breadcrumbs.length > 0 && (
          <nav className="mb-4 flex items-center space-x-2 text-sm opacity-80">
            {breadcrumbs.map((item, index) => (
              <React.Fragment key={index}>
                {index === 0 && item.link === '/' ? (
                  <Link href="/" className="hover:opacity-70">
                    <Home size={16} />
                  </Link>
                ) : item.link && !item.current ? (
                  <Link href={item.link} className="hover:opacity-70">
                    {item.label}
                  </Link>
                ) : (
                  <span className={item.current ? 'font-semibold' : ''}>
                    {item.label}
                  </span>
                )}
                {index < breadcrumbs.length - 1 && (
                  <ChevronRight size={16} className="opacity-50" />
                )}
              </React.Fragment>
            ))}
          </nav>
        )}

        {/* Title */}
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-4">
          {title}
        </h1>

        {/* Subtitle */}
        {subtitle && (
          <p className="text-lg sm:text-xl md:text-2xl opacity-90 max-w-3xl">
            {subtitle}
          </p>
        )}
      </div>
    </div>
  );
};

