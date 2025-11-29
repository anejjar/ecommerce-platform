'use client';

interface TextBlockProps {
  config: {
    content?: string;
    alignment?: 'left' | 'center' | 'right';
    textSize?: 'sm' | 'base' | 'lg' | 'xl';
  };
}

export function TextBlock({ config }: TextBlockProps) {
  const {
    content = 'Enter your text content here...',
    alignment = 'left',
    textSize = 'base',
  } = config;

  const alignmentClass = {
    left: 'text-left',
    center: 'text-center',
    right: 'text-right',
  }[alignment];

  const sizeClass = {
    sm: 'text-sm',
    base: 'text-base',
    lg: 'text-lg',
    xl: 'text-xl',
  }[textSize];

  return (
    <div className={`p-4 border-2 border-dashed border-gray-300 rounded-lg ${alignmentClass}`}>
      <p className={`${sizeClass} text-gray-700 whitespace-pre-wrap`}>
        {content || 'Enter your text content here...'}
      </p>
    </div>
  );
}

