'use client';

interface ImageTextBlockProps {
  config: {
    image?: string;
    imagePosition?: 'left' | 'right';
    heading?: string;
    text?: string;
    backgroundColor?: string;
  };
}

export function ImageTextBlock({ config }: ImageTextBlockProps) {
  const {
    image = '',
    imagePosition = 'left',
    heading = '',
    text = '',
    backgroundColor = '#ffffff',
  } = config;

  if (!text) return null;

  const isImageLeft = imagePosition === 'left';

  return (
    <div
      className="rounded-lg overflow-hidden my-8"
      style={{ backgroundColor }}
    >
      <div className={`flex flex-col md:flex-row gap-6 p-6 ${isImageLeft ? 'md:flex-row' : 'md:flex-row-reverse'}`}>
        {image && (
          <div className="flex-shrink-0 w-full md:w-1/2">
            <img src={image} alt={heading} className="w-full h-auto rounded-lg" />
          </div>
        )}
        <div className={`flex-1 w-full ${image ? 'md:w-1/2' : 'w-full'}`}>
          {heading && (
            <h3 className="text-2xl font-bold mb-4">{heading}</h3>
          )}
          <div className="prose prose-lg max-w-none" dangerouslySetInnerHTML={{ __html: text }} />
        </div>
      </div>
    </div>
  );
}

