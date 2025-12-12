'use client';

import { handleNativeImageError } from '@/lib/image-utils';

interface TestimonialsBlockProps {
  config: {
    heading?: string;
    testimonials?: Array<{
      name?: string;
      role?: string;
      image?: string;
      text?: string;
      rating?: number;
    }>;
    layout?: 'grid' | 'carousel';
  };
}

export function TestimonialsBlock({ config }: TestimonialsBlockProps) {
  const {
    heading = 'What Our Customers Say',
    testimonials = [],
    layout = 'grid',
  } = config;

  return (
    <div className="p-6">
      {heading && (
        <h3 className="text-2xl font-bold mb-6 text-center">{heading}</h3>
      )}
      {testimonials.length > 0 ? (
        <div className={layout === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' : 'space-y-6'}>
          {testimonials.map((testimonial, index) => (
            <div key={index} className="bg-gray-50 p-6 rounded-lg">
              <div className="flex items-center gap-4 mb-4">
                {testimonial.image ? (
                  <img
                    src={testimonial.image}
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full object-cover"
                    onError={handleNativeImageError}
                  />
                ) : (
                  <div className="w-12 h-12 rounded-full bg-gray-300 flex items-center justify-center">
                    <span className="text-gray-600">{testimonial.name?.[0] || '?'}</span>
                  </div>
                )}
                <div>
                  <div className="font-semibold">{testimonial.name || 'Customer Name'}</div>
                  {testimonial.role && (
                    <div className="text-sm text-gray-600">{testimonial.role}</div>
                  )}
                </div>
              </div>
              {testimonial.rating && (
                <div className="mb-2">
                  {'★'.repeat(testimonial.rating)}{'☆'.repeat(5 - testimonial.rating)}
                </div>
              )}
              <p className="text-gray-700">{testimonial.text || 'Testimonial text...'}</p>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center text-gray-400 py-12 border-2 border-dashed rounded-lg">
          No testimonials added yet
        </div>
      )}
    </div>
  );
}

