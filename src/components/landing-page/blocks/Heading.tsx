'use client';

import React from 'react';
import { cn } from '@/lib/utils';

interface HeadingConfig {
  title?: string;
  tag?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
  link?: string;
  color?: string;
  fontSize?: number;
  fontWeight?: string;
  fontFamily?: string;
  textAlign?: 'left' | 'center' | 'right' | 'justify';
}

interface HeadingProps {
  config: HeadingConfig;
}

export const Heading: React.FC<HeadingProps> = ({ config }) => {
  const {
    title = 'Your Heading',
    tag = 'h2',
    link = '',
    color = '#000000',
    fontSize = 32,
    fontWeight = '700',
    fontFamily = 'inherit',
    textAlign = 'left',
  } = config;

  const Tag = tag;

  const headingStyle = {
    color,
    fontSize: `${fontSize}px`,
    fontWeight,
    fontFamily,
    textAlign,
  };

  const content = (
    <Tag style={headingStyle} className={cn('leading-tight')}>
      {title}
    </Tag>
  );

  if (link) {
    return (
      <a href={link} className="hover:opacity-80 transition-opacity">
        {content}
      </a>
    );
  }

  return content;
};
