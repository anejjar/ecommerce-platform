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
    text = 'Enter your text content here...',
    backgroundColor = '#ffffff',
  } = config;

  const isImageLeft = imagePosition === 'left';

  return (
    <div
      className="rounded-lg overflow-hidden"
      style={{ backgroundColor }}
    >
      <div className={`flex flex-col md:flex-row gap-6 p-6 ${isImageLeft ? 'md:flex-row' : 'md:flex-row-reverse'}`}>
        <div className="flex-shrink-0 w-full md:w-1/2">
          {image ? (
            <img src={image} alt={heading} className="w-full h-auto rounded-lg" />
          ) : (
            <div className="w-full aspect-video bg-gray-100 rounded-lg flex items-center justify-center">
              <p className="text-gray-400">No image selected</p>
            </div>
          )}
        </div>
        <div className="flex-1 w-full md:w-1/2">
          {heading && (
            <h3 className="text-2xl font-bold mb-4">{heading}</h3>
          )}
          <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: text || '' }} />
        </div>
      </div>
    </div>
  );
}

