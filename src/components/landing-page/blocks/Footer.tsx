'use client';

import React from 'react';
import { Link } from '@/navigation';
import { SocialLinks } from './SocialLinks';

interface FooterLink {
  label: string;
  link: string;
  openInNewTab?: boolean;
}

interface FooterColumn {
  title: string;
  links: FooterLink[];
}

interface SocialLink {
  platform: string;
  url: string;
}

interface FooterConfig {
  columns?: FooterColumn[];
  showSocialLinks?: boolean;
  socialLinks?: SocialLink[];
  copyrightText?: string;
  backgroundColor?: string;
  textColor?: string;
  linkColor?: string;
  linkHoverColor?: string;
}

export const Footer: React.FC<{ config: FooterConfig }> = ({ config }) => {
  const {
    columns = [],
    showSocialLinks = true,
    socialLinks = [],
    copyrightText = '© 2024 Your Company. All rights reserved.',
    backgroundColor = '#111827',
    textColor = '#ffffff',
    linkColor = '#9ca3af',
    linkHoverColor = '#ffffff',
  } = config;

  return (
    <footer
      className="w-full"
      style={{ backgroundColor, color: textColor }}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        {/* Footer Columns */}
        {columns.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
            {columns.map((column, index) => (
              <div key={index}>
                <h3 className="text-sm font-semibold mb-4 uppercase tracking-wider">
                  {column.title}
                </h3>
                <ul className="space-y-2">
                  {column.links.map((link, linkIndex) => (
                    <li key={linkIndex}>
                      <Link
                        href={link.link}
                        target={link.openInNewTab ? '_blank' : undefined}
                        rel={link.openInNewTab ? 'noopener noreferrer' : undefined}
                        className="text-sm transition-colors"
                        style={{ color: linkColor }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.color = linkHoverColor;
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.color = linkColor;
                        }}
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        )}

        {/* Social Links */}
        {showSocialLinks && socialLinks.length > 0 && (
          <div className="mb-8">
            <SocialLinks
              config={{
                socialLinks,
                layout: 'horizontal',
                iconColor: linkColor,
                hoverColor: linkHoverColor,
              }}
            />
          </div>
        )}

        {/* Copyright */}
        {copyrightText && (
          <div className="pt-8 border-t" style={{ borderColor: linkColor, opacity: 0.3 }}>
            <p className="text-sm text-center" style={{ color: linkColor }}>
              {copyrightText}
            </p>
          </div>
        )}
      </div>
    </footer>
  );
};

