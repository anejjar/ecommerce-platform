'use client';

import React from 'react';
import { cn } from '@/lib/utils';

interface TextEditorConfig {
  content?: string;
  textColor?: string;
  fontSize?: number;
  textAlign?: 'left' | 'center' | 'right' | 'justify';
}

interface TextEditorProps {
  config: TextEditorConfig;
}

export const TextEditor: React.FC<TextEditorProps> = ({ config }) => {
  const {
    content = '<p>Add your text here...</p>',
    textColor = '#333333',
    fontSize = 16,
    textAlign = 'left',
  } = config;

  const style = {
    color: textColor,
    fontSize: `${fontSize}px`,
    textAlign,
  };

  return (
    <div
      style={style}
      className="prose prose-sm max-w-none"
      dangerouslySetInnerHTML={{ __html: content }}
    />
  );
};
