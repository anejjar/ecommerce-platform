'use client';

import React from 'react';

interface SpacerConfig {
  height?: number;
}

interface SpacerWidgetProps {
  config: SpacerConfig;
}

export const SpacerWidget: React.FC<SpacerWidgetProps> = ({ config }) => {
  const { height = 50 } = config;

  return <div style={{ height: `${height}px` }} />;
};
