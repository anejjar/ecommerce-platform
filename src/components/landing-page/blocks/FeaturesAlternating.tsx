'use client';

import React from 'react';
import { Check } from 'lucide-react';

interface FeaturesAlternatingProps {
    config: {
        heading?: string;
        subheading?: string;
        features?: Array<{
            title: string;
            description: string;
            image?: string;
            benefits?: string[];
        }>;
    };
}

export const FeaturesAlternating: React.FC<FeaturesAlternatingProps> = ({ config }) => {
    const { heading, subheading, features = [] } = config;

    return (
        <section className="py-24 bg-white">
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

                {/* Alternating Features */}
                <div className="space-y-24">
                    {features.map((feature, index) => (
                        <div
                            key={index}
                            className={`flex flex-col lg:flex-row gap-12 items-center ${index % 2 === 1 ? 'lg:flex-row-reverse' : ''
                                }`}
                        >
                            {/* Image */}
                            <div className="flex-1">
                                {feature.image ? (
                                    <img
                                        src={feature.image}
                                        alt={feature.title}
                                        className="rounded-2xl shadow-xl w-full h-auto"
                                    />
                                ) : (
                                    <div className="bg-gray-100 rounded-2xl aspect-video flex items-center justify-center">
                                        <span className="text-gray-400">Image</span>
                                    </div>
                                )}
                            </div>

                            {/* Content */}
                            <div className="flex-1">
                                <h3 className="text-3xl font-bold text-gray-900 mb-4">
                                    {feature.title}
                                </h3>
                                <p className="text-lg text-gray-600 mb-6">
                                    {feature.description}
                                </p>
                                {feature.benefits && feature.benefits.length > 0 && (
                                    <ul className="space-y-3">
                                        {feature.benefits.map((benefit, idx) => (
                                            <li key={idx} className="flex items-start gap-3">
                                                <Check className="h-6 w-6 text-primary shrink-0 mt-0.5" />
                                                <span className="text-gray-700">{benefit}</span>
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};
