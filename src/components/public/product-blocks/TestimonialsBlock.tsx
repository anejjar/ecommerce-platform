'use client';

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
    heading = '',
    testimonials = [],
    layout = 'grid',
  } = config;

  if (testimonials.length === 0) return null;

  return (
    <div className="my-8">
      {heading && (
        <h3 className="text-2xl md:text-3xl font-bold mb-6 text-center">{heading}</h3>
      )}
      <div className={layout === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' : 'space-y-6'}>
        {testimonials.map((testimonial, index) => (
          <div key={index} className="bg-gray-50 p-6 rounded-lg">
            <div className="flex items-center gap-4 mb-4">
              {testimonial.image ? (
                <img src={testimonial.image} alt={testimonial.name} className="w-12 h-12 rounded-full object-cover" />
              ) : (
                <div className="w-12 h-12 rounded-full bg-gray-300 flex items-center justify-center">
                  <span className="text-gray-600">{testimonial.name?.[0] || '?'}</span>
                </div>
              )}
              <div>
                <div className="font-semibold">{testimonial.name || 'Customer'}</div>
                {testimonial.role && (
                  <div className="text-sm text-gray-600">{testimonial.role}</div>
                )}
              </div>
            </div>
            {testimonial.rating && (
              <div className="mb-2 text-amber-500">
                {'★'.repeat(testimonial.rating)}{'☆'.repeat(5 - testimonial.rating)}
              </div>
            )}
            {testimonial.text && (
              <p className="text-gray-700">{testimonial.text}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

