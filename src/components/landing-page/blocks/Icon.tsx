'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import * as LucideIcons from 'lucide-react';

interface IconConfig {
  iconName?: string;
  link?: string;
  color?: string;
  size?: number;
  alignment?: 'left' | 'center' | 'right';
}

interface IconProps {
  config: IconConfig;
}

export const Icon: React.FC<IconProps> = ({ config }) => {
  const {
    iconName = 'Star',
    link = '',
    color = '#0066ff',
    size = 50,
    alignment = 'center',
  } = config;

  const alignmentClasses = {
    left: 'justify-start',
    center: 'justify-center',
    right: 'justify-end',
  };

  // Get the icon component from Lucide
  const IconComponent = (LucideIcons as any)[iconName] || LucideIcons.Star;

  const iconElement = (
    <IconComponent
      style={{ color, width: size, height: size }}
      className="transition-transform hover:scale-110"
    />
  );

  if (link) {
    return (
      <div className={cn('flex', alignmentClasses[alignment])}>
        <a href={link} className="hover:opacity-80 transition-opacity">
          {iconElement}
        </a>
      </div>
    );
  }

  return (
    <div className={cn('flex', alignmentClasses[alignment])}>
      {iconElement}
    </div>
  );
};
