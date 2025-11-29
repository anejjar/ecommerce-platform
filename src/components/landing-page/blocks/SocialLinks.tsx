'use client';

import React from 'react';
import { Link } from '@/navigation';
import { Facebook, Twitter, Instagram, Linkedin, Youtube, Github, Share2 } from 'lucide-react';

interface SocialLink {
  platform: string;
  url: string;
  label?: string;
}

interface SocialLinksConfig {
  socialLinks?: SocialLink[];
  layout?: string;
  iconSize?: string;
  showLabels?: boolean;
  spacing?: string;
  iconColor?: string;
  hoverColor?: string;
}

const getIcon = (platform: string, size: number = 24) => {
  const iconProps = { size, className: 'transition-colors' };
  switch (platform.toLowerCase()) {
    case 'facebook':
      return <Facebook {...iconProps} />;
    case 'twitter':
      return <Twitter {...iconProps} />;
    case 'instagram':
      return <Instagram {...iconProps} />;
    case 'linkedin':
      return <Linkedin {...iconProps} />;
    case 'youtube':
      return <Youtube {...iconProps} />;
    case 'github':
      return <Github {...iconProps} />;
    default:
      return <Share2 {...iconProps} />;
  }
};

export const SocialLinks: React.FC<{ config: SocialLinksConfig }> = ({ config }) => {
  const {
    socialLinks = [],
    layout = 'horizontal',
    iconSize = '24px',
    showLabels = false,
    spacing = '16px',
    iconColor = '#6b7280',
    hoverColor = '#3b82f6',
  } = config;

  const size = parseInt(iconSize) || 24;

  const layoutClass = {
    horizontal: 'flex flex-row flex-wrap',
    vertical: 'flex flex-col',
    grid: 'grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-4',
  }[layout] || 'flex flex-row flex-wrap';

  if (socialLinks.length === 0) {
    return null;
  }

  return (
    <div className={`${layoutClass} items-center`} style={{ gap: spacing }}>
      {socialLinks.map((link, index) => (
        <Link
          key={index}
          href={link.url}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center space-x-2 transition-colors hover:opacity-80"
          style={{ color: iconColor }}
          onMouseEnter={(e) => {
            e.currentTarget.style.color = hoverColor;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color = iconColor;
          }}
        >
          {getIcon(link.platform, size)}
          {showLabels && link.label && (
            <span className="text-sm">{link.label}</span>
          )}
        </Link>
      ))}
    </div>
  );
};

