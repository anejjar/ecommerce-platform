'use client';

import React from 'react';
import { Star } from 'lucide-react';

interface TestimonialsGridProps {
    config: {
        heading?: string;
        subheading?: string;
        testimonials?: Array<{
            name: string;
            role?: string;
            company?: string;
            content: string;
            rating?: number;
            avatar?: string;
        }>;
    };
}

export const TestimonialsGrid: React.FC<TestimonialsGridProps> = ({ config }) => {
    const { heading, subheading, testimonials = [] } = config;

    return (
        <section className="py-24 bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                {(heading || subheading) && (
                    <div className="text-center mb-16">
                        {subheading && (
                            <p className="text-primary font-semibold mb-2">{subheading}</p>
                        )}
                        {heading && (
                            <h2 className="text-4xl font-bold text-gray-900">{heading}</h2>
                        )}
                    </div>
                )}

                {/* Testimonials Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {testimonials.map((testimonial, index) => (
                        <div
                            key={index}
                            className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-lg transition-shadow"
                        >
                            {/* Rating */}
                            {testimonial.rating && (
                                <div className="flex gap-1 mb-4">
                                    {Array.from({ length: 5 }).map((_, i) => (
                                        <Star
                                            key={i}
                                            className={`h-5 w-5 ${i < testimonial.rating!
                                                    ? 'fill-yellow-400 text-yellow-400'
                                                    : 'text-gray-300'
                                                }`}
                                        />
                                    ))}
                                </div>
                            )}

                            {/* Content */}
                            <p className="text-gray-700 mb-6 leading-relaxed">
                                "{testimonial.content}"
                            </p>

                            {/* Author */}
                            <div className="flex items-center gap-4">
                                {testimonial.avatar ? (
                                    <img
                                        src={testimonial.avatar}
                                        alt={testimonial.name}
                                        className="w-12 h-12 rounded-full object-cover"
                                    />
                                ) : (
                                    <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center">
                                        <span className="text-gray-500 font-semibold">
                                            {testimonial.name.charAt(0)}
                                        </span>
                                    </div>
                                )}
                                <div>
                                    <p className="font-semibold text-gray-900">
                                        {testimonial.name}
                                    </p>
                                    {(testimonial.role || testimonial.company) && (
                                        <p className="text-sm text-gray-600">
                                            {testimonial.role}
                                            {testimonial.role && testimonial.company && ', '}
                                            {testimonial.company}
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};
