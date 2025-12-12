'use client';

import React from 'react';
import { cn } from '@/lib/utils';

interface DividerConfig {
  style?: 'solid' | 'dashed' | 'dotted' | 'double';
  color?: string;
  weight?: number;
  width?: number;
  alignment?: 'left' | 'center' | 'right';
}

interface DividerWidgetProps {
  config: DividerConfig;
}

export const DividerWidget: React.FC<DividerWidgetProps> = ({ config }) => {
  const {
    style = 'solid',
    color = '#e0e0e0',
    weight = 1,
    width = 100,
    alignment = 'center',
  } = config;

  const alignmentClasses = {
    left: 'justify-start',
    center: 'justify-center',
    right: 'justify-end',
  };

  const dividerStyle = {
    borderTopStyle: style,
    borderTopColor: color,
    borderTopWidth: `${weight}px`,
    width: `${width}%`,
  };

  return (
    <div className={cn('flex', alignmentClasses[alignment])}>
      <div style={dividerStyle} />
    </div>
  );
};
