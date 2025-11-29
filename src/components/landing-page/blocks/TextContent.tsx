'use client';

import React from 'react';

interface TextContentConfig {
  content?: string;
  maxWidth?: string;
  textAlign?: string;
  textColor?: string;
  backgroundColor?: string;
  padding?: string;
}

export const TextContent: React.FC<{ config: TextContentConfig }> = ({ config }) => {
  const {
    content = '<p>Enter your text content here...</p>',
    maxWidth = '800px',
    textAlign = 'left',
    textColor = '#111827',
    backgroundColor = 'transparent',
    padding = '20px',
  } = config;

  const alignmentClass = {
    left: 'text-left',
    center: 'text-center',
    right: 'text-right',
    justify: 'text-justify',
  }[textAlign] || 'text-left';

  return (
    <div
      className={`w-full ${alignmentClass}`}
      style={{
        backgroundColor,
        color: textColor,
        padding,
      }}
    >
      <div
        className="mx-auto prose prose-lg max-w-none"
        style={{ maxWidth }}
        dangerouslySetInnerHTML={{ __html: content }}
      />
    </div>
  );
};

