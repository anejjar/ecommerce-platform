'use client';

import React, { useEffect, useState, useRef } from 'react';

interface ProgressBarConfig {
  title?: string;
  percentage?: number;
  barColor?: string;
  backgroundColor?: string;
  height?: number;
}

interface ProgressBarProps {
  config: ProgressBarConfig;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({ config }) => {
  const {
    title = 'Skill',
    percentage = 80,
    barColor = '#0066ff',
    backgroundColor = '#e0e0e0',
    height = 10,
  } = config;

  const [progress, setProgress] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const barRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (barRef.current) {
      observer.observe(barRef.current);
    }

    return () => {
      if (barRef.current) {
        observer.unobserve(barRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (!isVisible) return;

    const timer = setTimeout(() => {
      setProgress(percentage);
    }, 100);

    return () => clearTimeout(timer);
  }, [isVisible, percentage]);

  return (
    <div ref={barRef} className="w-full">
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm font-medium">{title}</span>
        <span className="text-sm font-medium">{percentage}%</span>
      </div>
      <div
        style={{
          backgroundColor,
          height: `${height}px`,
          borderRadius: `${height / 2}px`,
        }}
        className="w-full overflow-hidden"
      >
        <div
          style={{
            backgroundColor: barColor,
            width: `${progress}%`,
            height: '100%',
            transition: 'width 1s ease-out',
          }}
        />
      </div>
    </div>
  );
};
