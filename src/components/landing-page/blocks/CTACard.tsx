'use client';

import React from 'react';
import { ArrowRight } from 'lucide-react';

interface CTACardProps {
    config: {
        heading?: string;
        description?: string;
        buttonText?: string;
        buttonUrl?: string;
        image?: string;
        backgroundColor?: string;
    };
}

export const CTACard: React.FC<CTACardProps> = ({ config }) => {
    const {
        heading = 'Ready to get started?',
        description = 'Join thousands of satisfied customers today.',
        buttonText = 'Get Started',
        buttonUrl = '#',
        image,
        backgroundColor = '#000000',
    } = config;

    return (
        <section className="py-24 bg-gray-50">
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                <div
                    className="rounded-3xl overflow-hidden shadow-2xl"
                    style={{ backgroundColor }}
                >
                    <div className="grid grid-cols-1 lg:grid-cols-2">
                        {/* Content */}
                        <div className="p-12 flex flex-col justify-center">
                            <h2 className="text-4xl font-bold text-white mb-4">
                                {heading}
                            </h2>
                            <p className="text-lg text-white/90 mb-8">
                                {description}
                            </p>
                            <div>
                                <a
                                    href={buttonUrl}
                                    className="inline-flex items-center gap-2 bg-white text-gray-900 px-8 py-4 rounded-full font-semibold hover:bg-gray-100 transition-colors"
                                >
                                    {buttonText}
                                    <ArrowRight className="h-5 w-5" />
                                </a>
                            </div>
                        </div>

                        {/* Image */}
                        <div className="relative h-64 lg:h-auto">
                            {image ? (
                                <img
                                    src={image}
                                    alt="CTA"
                                    className="absolute inset-0 w-full h-full object-cover"
                                />
                            ) : (
                                <div className="absolute inset-0 bg-white/10 flex items-center justify-center">
                                    <span className="text-white/50">Image</span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};
