'use client';

import React, { useEffect, useState, useRef } from 'react';
import { cn } from '@/lib/utils';

interface CounterConfig {
  endValue?: number;
  prefix?: string;
  suffix?: string;
  title?: string;
  numberColor?: string;
  numberSize?: number;
  titleColor?: string;
}

interface CounterProps {
  config: CounterConfig;
}

export const Counter: React.FC<CounterProps> = ({ config }) => {
  const {
    endValue = 100,
    prefix = '',
    suffix = '+',
    title = 'Happy Customers',
    numberColor = '#0066ff',
    numberSize = 48,
    titleColor = '#333333',
  } = config;

  const [count, setCount] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const counterRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (counterRef.current) {
      observer.observe(counterRef.current);
    }

    return () => {
      if (counterRef.current) {
        observer.unobserve(counterRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (!isVisible) return;

    const duration = 2000; // 2 seconds
    const steps = 60;
    const increment = endValue / steps;
    let currentStep = 0;

    const timer = setInterval(() => {
      currentStep++;
      if (currentStep >= steps) {
        setCount(endValue);
        clearInterval(timer);
      } else {
        setCount(Math.floor(increment * currentStep));
      }
    }, duration / steps);

    return () => clearInterval(timer);
  }, [isVisible, endValue]);

  return (
    <div ref={counterRef} className="text-center">
      <div
        style={{ color: numberColor, fontSize: `${numberSize}px` }}
        className="font-bold"
      >
        {prefix}
        {count}
        {suffix}
      </div>
      <div style={{ color: titleColor }} className="mt-2">
        {title}
      </div>
    </div>
  );
};
