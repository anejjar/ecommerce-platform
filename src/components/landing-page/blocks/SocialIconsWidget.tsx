'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import { Facebook, Twitter, Instagram, Linkedin, Youtube, Github } from 'lucide-react';

interface SocialIcon {
  platform: string;
  url: string;
}

interface SocialIconsConfig {
  icons?: SocialIcon[];
  size?: number;
  spacing?: number;
  alignment?: 'left' | 'center' | 'right';
}

interface SocialIconsWidgetProps {
  config: SocialIconsConfig;
}

// Custom TikTok icon component
const TikTokIcon: React.FC<{ size: number; className?: string }> = ({ size, className }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
  </svg>
);

const getPlatformIcon = (platform: string, size: number) => {
  const iconProps = { size, className: 'transition-transform hover:scale-110' };

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
    case 'tiktok':
      return <TikTokIcon size={size} className="transition-transform hover:scale-110" />;
    case 'github':
      return <Github {...iconProps} />;
    default:
      return <Facebook {...iconProps} />;
  }
};

export const SocialIconsWidget: React.FC<SocialIconsWidgetProps> = ({ config }) => {
  const {
    icons = [],
    size = 24,
    spacing = 10,
    alignment = 'center',
  } = config;

  const alignmentClasses = {
    left: 'justify-start',
    center: 'justify-center',
    right: 'justify-end',
  };

  if (!icons || icons.length === 0) {
    return (
      <div className="text-center py-8 text-gray-400">
        No social icons configured
      </div>
    );
  }

  return (
    <div className={cn('flex flex-wrap', alignmentClasses[alignment])} style={{ gap: `${spacing}px` }}>
      {icons.map((icon, index) => (
        <a
          key={index}
          href={icon.url}
          target="_blank"
          rel="noopener noreferrer"
          className="hover:opacity-70 transition-opacity"
        >
          {getPlatformIcon(icon.platform, size)}
        </a>
      ))}
    </div>
  );
};
