'use client';

import { useState } from 'react';
import { ChevronLeft, ChevronRight, Star, Quote } from 'lucide-react';
import { Testimonial } from '@/types/checkout-settings';
import { Button } from '@/components/ui/button';

interface TestimonialsCarouselProps {
  testimonials: Testimonial[];
}

export function TestimonialsCarousel({ testimonials }: TestimonialsCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  if (!testimonials || testimonials.length === 0) {
    return null;
  }

  const current = testimonials[currentIndex];

  const goToPrevious = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? testimonials.length - 1 : prevIndex - 1
    );
  };

  const goToNext = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === testimonials.length - 1 ? 0 : prevIndex + 1
    );
  };

  return (
    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-6 relative">
      <Quote className="absolute top-4 left-4 h-8 w-8 text-blue-300 opacity-50" />

      <div className="text-center mb-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-1">What Our Customers Say</h3>
        <div className="flex justify-center gap-1 mb-3">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              className={`h-4 w-4 ${
                i < current.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'
              }`}
            />
          ))}
        </div>
      </div>

      <div className="min-h-[120px] flex flex-col justify-center">
        <p className="text-gray-700 italic mb-4 text-center px-8">
          "{current.text}"
        </p>

        <div className="flex items-center justify-center gap-3">
          {current.image && (
            <img
              src={current.image}
              alt={current.name}
              className="w-12 h-12 rounded-full object-cover"
            />
          )}
          <div className="text-center">
            <p className="font-semibold text-gray-900">{current.name}</p>
            {current.location && (
              <p className="text-sm text-gray-600">{current.location}</p>
            )}
            {current.date && (
              <p className="text-xs text-gray-500">{current.date}</p>
            )}
          </div>
        </div>
      </div>

      {testimonials.length > 1 && (
        <>
          <div className="flex justify-center gap-2 mt-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={goToPrevious}
              className="h-8 w-8 p-0 rounded-full"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <div className="flex items-center gap-1">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className={`h-2 rounded-full transition-all ${
                    index === currentIndex ? 'w-6 bg-blue-600' : 'w-2 bg-blue-300'
                  }`}
                />
              ))}
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={goToNext}
              className="h-8 w-8 p-0 rounded-full"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </>
      )}
    </div>
  );
}
