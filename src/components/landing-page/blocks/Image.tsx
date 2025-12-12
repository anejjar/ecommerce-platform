'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import Image from 'next/image';

interface ImageConfig {
  image?: string;
  alt?: string;
  link?: string;
  width?: string;
  alignment?: 'left' | 'center' | 'right';
  borderRadius?: number;
}

interface ImageBlockProps {
  config: ImageConfig;
}

export const ImageBlock: React.FC<ImageBlockProps> = ({ config }) => {
  const {
    image = '',
    alt = '',
    link = '',
    width = '100%',
    alignment = 'center',
    borderRadius = 0,
  } = config;

  const alignmentClasses = {
    left: 'justify-start',
    center: 'justify-center',
    right: 'justify-end',
  };

  if (!image) {
    return (
      <div className={cn('flex', alignmentClasses[alignment])}>
        <div
          className="bg-gray-200 flex items-center justify-center text-gray-400"
          style={{
            width: width === 'custom' ? '300px' : width,
            height: '200px',
            borderRadius: `${borderRadius}px`,
          }}
        >
          No Image
        </div>
      </div>
    );
  }

  const imageElement = (
    <div style={{ width: width === 'custom' ? '300px' : width }}>
      <img
        src={image}
        alt={alt}
        style={{ borderRadius: `${borderRadius}px` }}
        className="w-full h-auto"
      />
    </div>
  );

  if (link) {
    return (
      <div className={cn('flex', alignmentClasses[alignment])}>
        <a href={link} className="hover:opacity-90 transition-opacity">
          {imageElement}
        </a>
      </div>
    );
  }

  return (
    <div className={cn('flex', alignmentClasses[alignment])}>
      {imageElement}
    </div>
  );
};
