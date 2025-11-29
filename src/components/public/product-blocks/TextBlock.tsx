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
    content = '',
    alignment = 'left',
    textSize = 'base',
  } = config;

  if (!content) return null;

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
    <div className={`prose prose-amber max-w-none ${alignmentClass}`}>
      <p className={`${sizeClass} text-gray-700 leading-relaxed whitespace-pre-wrap`}>
        {content}
      </p>
    </div>
  );
}

