import React from 'react';
import { Card } from '@/components/ui/card';
import Image from 'next/image';

interface Testimonial {
    quote: string;
    author: string;
    role?: string;
    avatar?: string;
}

interface TestimonialBlockProps {
    config: {
        heading?: string;
        testimonials: Testimonial[];
    };
}

export const TestimonialBlock: React.FC<TestimonialBlockProps> = ({ config }) => {
    const {
        heading = 'What Our Customers Say',
        testimonials = []
    } = config;

    return (
        <section className="py-16">
            <div className="container mx-auto px-4">
                <h2 className="text-4xl font-bold text-center mb-12">{heading}</h2>

                <div className="grid md:grid-cols-3 gap-8">
                    {testimonials.map((testimonial, index) => (
                        <Card key={index} className="p-6">
                            <p className="text-lg mb-6 italic">"{testimonial.quote}"</p>
                            <div className="flex items-center gap-4">
                                {testimonial.avatar && (
                                    <div className="relative w-12 h-12 rounded-full overflow-hidden">
                                        <Image
                                            src={testimonial.avatar}
                                            alt={testimonial.author}
                                            fill
                                            className="object-cover"
                                        />
                                    </div>
                                )}
                                <div>
                                    <p className="font-semibold">{testimonial.author}</p>
                                    {testimonial.role && (
                                        <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                                    )}
                                </div>
                            </div>
                        </Card>
                    ))}
                </div>
            </div>
        </section>
    );
};
