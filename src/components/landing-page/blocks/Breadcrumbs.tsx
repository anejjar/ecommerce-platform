'use client';

import React from 'react';
import { Link } from '@/navigation';
import { Home, ChevronRight } from 'lucide-react';

interface BreadcrumbItem {
  label: string;
  link?: string;
  current?: boolean;
}

interface BreadcrumbsConfig {
  items?: BreadcrumbItem[];
  separator?: string;
  showHomeIcon?: boolean;
  textColor?: string;
  activeColor?: string;
  hoverColor?: string;
}

const getSeparator = (separator: string) => {
  switch (separator) {
    case '>':
      return <ChevronRight size={16} className="opacity-50" />;
    case '→':
      return <span className="opacity-50">→</span>;
    case '|':
      return <span className="opacity-50">|</span>;
    case '•':
      return <span className="opacity-50">•</span>;
    default:
      return <span className="opacity-50">/</span>;
  }
};

export const Breadcrumbs: React.FC<{ config: BreadcrumbsConfig }> = ({ config }) => {
  const {
    items = [],
    separator = '/',
    showHomeIcon = true,
    textColor = '#6b7280',
    activeColor = '#111827',
    hoverColor = '#3b82f6',
  } = config;

  if (items.length === 0) {
    return null;
  }

  return (
    <nav className="flex items-center space-x-2 text-sm" style={{ color: textColor }}>
      {items.map((item, index) => (
        <React.Fragment key={index}>
          {index === 0 && item.link === '/' && showHomeIcon ? (
            <Link href="/" className="hover:opacity-70">
              <Home size={16} />
            </Link>
          ) : item.link && !item.current ? (
            <Link
              href={item.link}
              className="hover:opacity-70 transition-colors"
              style={{ color: textColor }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = hoverColor;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = textColor;
              }}
            >
              {item.label}
            </Link>
          ) : (
            <span style={{ color: activeColor, fontWeight: item.current ? 600 : 400 }}>
              {item.label}
            </span>
          )}
          {index < items.length - 1 && getSeparator(separator)}
        </React.Fragment>
      ))}
    </nav>
  );
};

