'use client';

import React from 'react';

interface DividerConfig {
  style?: string;
  color?: string;
  width?: string;
  thickness?: string;
  spacing?: string;
  alignment?: string;
}

export const Divider: React.FC<{ config: DividerConfig }> = ({ config }) => {
  const {
    style = 'solid',
    color = '#e5e7eb',
    width = '100%',
    thickness = '1px',
    spacing = '40px',
    alignment = 'center',
  } = config;

  const borderStyle = {
    solid: 'solid',
    dashed: 'dashed',
    dotted: 'dotted',
    double: 'double',
    gradient: 'solid',
  }[style] || 'solid';

  const alignmentClass = {
    left: 'mr-auto',
    center: 'mx-auto',
    right: 'ml-auto',
  }[alignment] || 'mx-auto';

  const isGradient = style === 'gradient';

  return (
    <div className="w-full" style={{ paddingTop: spacing, paddingBottom: spacing }}>
      <div
        className={alignmentClass}
        style={{
          width,
          height: thickness,
          borderTop: isGradient
            ? 'none'
            : `${thickness} ${borderStyle} ${color}`,
          background: isGradient
            ? `linear-gradient(to right, transparent, ${color}, transparent)`
            : 'none',
        }}
      />
    </div>
  );
};

