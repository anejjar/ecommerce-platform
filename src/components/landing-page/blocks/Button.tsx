'use client';

import React from 'react';
import { cn } from '@/lib/utils';

interface ButtonConfig {
  text?: string;
  link?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  backgroundColor?: string;
  textColor?: string;
  borderRadius?: number;
  alignment?: 'left' | 'center' | 'right' | 'justify';
}

interface ButtonBlockProps {
  config: ButtonConfig;
}

export const ButtonBlock: React.FC<ButtonBlockProps> = ({ config }) => {
  const {
    text = 'Click Here',
    link = '#',
    size = 'md',
    backgroundColor = '#0066ff',
    textColor = '#ffffff',
    borderRadius = 4,
    alignment = 'left',
  } = config;

  const sizeClasses = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg',
    xl: 'px-10 py-5 text-xl',
  };

  const alignmentClasses = {
    left: 'justify-start',
    center: 'justify-center',
    right: 'justify-end',
    justify: 'justify-stretch',
  };

  const buttonStyle = {
    backgroundColor,
    color: textColor,
    borderRadius: `${borderRadius}px`,
  };

  return (
    <div className={cn('flex', alignmentClasses[alignment])}>
      <a
        href={link}
        style={buttonStyle}
        className={cn(
          'inline-flex items-center justify-center font-semibold transition-all hover:opacity-90 active:scale-95',
          sizeClasses[size]
        )}
      >
        {text}
      </a>
    </div>
  );
};
