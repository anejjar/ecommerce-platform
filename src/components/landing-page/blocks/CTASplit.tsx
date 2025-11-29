'use client';

import React from 'react';

interface CTASplitProps {
    config: {
        heading?: string;
        description?: string;
        primaryButtonText?: string;
        primaryButtonUrl?: string;
        secondaryButtonText?: string;
        secondaryButtonUrl?: string;
        image?: string;
    };
}

export const CTASplit: React.FC<CTASplitProps> = ({ config }) => {
    const {
        heading = 'Ready to transform your business?',
        description = 'Get started today and see results in days, not months.',
        primaryButtonText = 'Start Free Trial',
        primaryButtonUrl = '#',
        secondaryButtonText = 'Schedule Demo',
        secondaryButtonUrl = '#',
        image,
    } = config;

    return (
        <section className="py-24 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                    {/* Content */}
                    <div>
                        <h2 className="text-5xl font-bold text-gray-900 mb-6">
                            {heading}
                        </h2>
                        <p className="text-xl text-gray-600 mb-8">
                            {description}
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4">
                            <a
                                href={primaryButtonUrl}
                                className="inline-flex items-center justify-center px-8 py-4 bg-primary text-white rounded-lg font-semibold hover:bg-primary/90 transition-colors"
                            >
                                {primaryButtonText}
                            </a>
                            <a
                                href={secondaryButtonUrl}
                                className="inline-flex items-center justify-center px-8 py-4 bg-gray-100 text-gray-900 rounded-lg font-semibold hover:bg-gray-200 transition-colors"
                            >
                                {secondaryButtonText}
                            </a>
                        </div>
                    </div>

                    {/* Image */}
                    <div>
                        {image ? (
                            <img
                                src={image}
                                alt="CTA"
                                className="rounded-2xl shadow-2xl w-full h-auto"
                            />
                        ) : (
                            <div className="bg-gray-100 rounded-2xl aspect-square flex items-center justify-center">
                                <span className="text-gray-400">Image</span>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
};
