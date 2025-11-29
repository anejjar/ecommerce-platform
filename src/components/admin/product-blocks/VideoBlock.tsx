'use client';

interface VideoBlockProps {
  config: {
    videoUrl?: string;
    heading?: string;
    description?: string;
    autoplay?: boolean;
    loop?: boolean;
  };
}

export function VideoBlock({ config }: VideoBlockProps) {
  const {
    videoUrl = '',
    heading = 'Video Heading',
    description = 'Video description',
    autoplay = false,
    loop = false,
  } = config;

  const getEmbedUrl = (url: string) => {
    if (!url) return null;
    
    // YouTube
    const youtubeRegex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
    const youtubeMatch = url.match(youtubeRegex);
    if (youtubeMatch) {
      return `https://www.youtube.com/embed/${youtubeMatch[1]}${autoplay ? '?autoplay=1' : ''}${loop ? '&loop=1&playlist=' + youtubeMatch[1] : ''}`;
    }
    
    // Vimeo
    const vimeoRegex = /vimeo\.com\/(?:.*\/)?(\d+)/;
    const vimeoMatch = url.match(vimeoRegex);
    if (vimeoMatch) {
      return `https://player.vimeo.com/video/${vimeoMatch[1]}${autoplay ? '?autoplay=1' : ''}${loop ? '&loop=1' : ''}`;
    }
    
    // Direct video URL
    if (url.match(/\.(mp4|webm|ogg)$/i)) {
      return url;
    }
    
    return null;
  };

  const embedUrl = getEmbedUrl(videoUrl);

  return (
    <div className="p-4 border-2 border-dashed border-gray-300 rounded-lg">
      {heading && (
        <h3 className="text-xl font-semibold mb-2">{heading}</h3>
      )}
      {description && (
        <p className="text-gray-600 mb-4">{description}</p>
      )}
      {embedUrl ? (
        <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
          {embedUrl.includes('youtube.com') || embedUrl.includes('vimeo.com') ? (
            <iframe
              src={embedUrl}
              className="absolute top-0 left-0 w-full h-full rounded-lg"
              allow="autoplay; encrypted-media"
              allowFullScreen
            />
          ) : (
            <video
              src={embedUrl}
              controls
              autoPlay={autoplay}
              loop={loop}
              className="absolute top-0 left-0 w-full h-full rounded-lg"
            />
          )}
        </div>
      ) : (
        <div className="bg-gray-100 rounded-lg p-8 text-center">
          <p className="text-gray-400">No video URL provided</p>
        </div>
      )}
    </div>
  );
}

