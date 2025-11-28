'use client';

import React, { useRef, useEffect } from 'react';

interface VideoPlayerConfig {
  videoUrl?: string;
  videoType?: string;
  autoplay?: boolean;
  loop?: boolean;
  muted?: boolean;
  controls?: boolean;
  poster?: string;
  aspectRatio?: string;
  maxWidth?: string;
  borderRadius?: string;
}

const getAspectRatioPadding = (ratio: string) => {
  const ratios: Record<string, string> = {
    '16:9': '56.25%',
    '4:3': '75%',
    '1:1': '100%',
    '21:9': '42.85%',
  };
  return ratios[ratio] || ratios['16:9'];
};

export const VideoPlayer: React.FC<{ config: VideoPlayerConfig }> = ({ config }) => {
  const {
    videoUrl,
    videoType = 'youtube',
    autoplay = false,
    loop = false,
    muted = false,
    controls = true,
    poster,
    aspectRatio = '16:9',
    maxWidth = '100%',
    borderRadius = '8px',
  } = config;

  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current && autoplay) {
      videoRef.current.play().catch(() => {
        // Autoplay failed, user interaction required
      });
    }
  }, [autoplay]);

  if (!videoUrl) {
    return (
      <div className="w-full bg-gray-100 rounded-lg flex items-center justify-center p-8">
        <p className="text-gray-500">No video URL provided</p>
      </div>
    );
  }

  // YouTube embed
  if (videoType === 'youtube') {
    const videoId = videoUrl.includes('youtube.com/watch?v=')
      ? videoUrl.split('v=')[1]?.split('&')[0]
      : videoUrl.includes('youtu.be/')
      ? videoUrl.split('youtu.be/')[1]?.split('?')[0]
      : videoUrl;

    const embedUrl = `https://www.youtube.com/embed/${videoId}?${autoplay ? 'autoplay=1&' : ''}${loop ? 'loop=1&playlist=' + videoId + '&' : ''}${!controls ? 'controls=0&' : ''}`;

    return (
      <div
        className="w-full relative overflow-hidden rounded-lg"
        style={{ maxWidth, borderRadius, paddingBottom: getAspectRatioPadding(aspectRatio) }}
      >
        <iframe
          src={embedUrl}
          className="absolute top-0 left-0 w-full h-full"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>
    );
  }

  // Vimeo embed
  if (videoType === 'vimeo') {
    const videoId = videoUrl.split('vimeo.com/')[1]?.split('?')[0];
    const embedUrl = `https://player.vimeo.com/video/${videoId}?${autoplay ? 'autoplay=1&' : ''}${loop ? 'loop=1&' : ''}${!controls ? 'controls=0&' : ''}`;

    return (
      <div
        className="w-full relative overflow-hidden rounded-lg"
        style={{ maxWidth, borderRadius, paddingBottom: getAspectRatioPadding(aspectRatio) }}
      >
        <iframe
          src={embedUrl}
          className="absolute top-0 left-0 w-full h-full"
          allow="autoplay; fullscreen; picture-in-picture"
          allowFullScreen
        />
      </div>
    );
  }

  // Direct video or self-hosted
  return (
    <div
      className="w-full relative overflow-hidden rounded-lg"
      style={{ maxWidth, borderRadius }}
    >
      <div style={{ paddingBottom: getAspectRatioPadding(aspectRatio) }}>
        <video
          ref={videoRef}
          src={videoUrl}
          poster={poster}
          controls={controls}
          loop={loop}
          muted={muted}
          className="absolute top-0 left-0 w-full h-full object-cover"
          playsInline
        />
      </div>
    </div>
  );
};

