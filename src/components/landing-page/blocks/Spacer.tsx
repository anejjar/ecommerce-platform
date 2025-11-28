'use client';

import React from 'react';

interface SpacerConfig {
  height?: string;
  mobileHeight?: string;
  backgroundColor?: string;
}

export const Spacer: React.FC<{ config: SpacerConfig }> = ({ config }) => {
  const {
    height = '60px',
    mobileHeight,
    backgroundColor = 'transparent',
  } = config;

  const spacerId = `spacer-${Math.random().toString(36).substr(2, 9)}`;

  return (
    <>
      {mobileHeight && (
        <style dangerouslySetInnerHTML={{
          __html: `
            #${spacerId} {
              height: ${mobileHeight};
              min-height: ${mobileHeight};
            }
            @media (min-width: 768px) {
              #${spacerId} {
                height: ${height};
                min-height: ${height};
              }
            }
          `
        }} />
      )}
      <div
        id={spacerId}
        className="w-full"
        style={{
          height: mobileHeight ? undefined : height,
          minHeight: mobileHeight ? undefined : height,
          backgroundColor,
        }}
      />
    </>
  );
};

