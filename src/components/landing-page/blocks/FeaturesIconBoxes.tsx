'use client';

import React from 'react';

interface FeaturesIconBoxesProps {
    config: {
        heading?: string;
        subheading?: string;
        features?: Array<{
            icon?: string;
            title: string;
            description: string;
        }>;
    };
}

export const FeaturesIconBoxes: React.FC<FeaturesIconBoxesProps> = ({ config }) => {
    const { heading, subheading, features = [] } = config;

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

                {/* Icon Boxes Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {features.map((feature, index) => (
                        <div
                            key={index}
                            className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-xl transition-shadow duration-300"
                        >
                            {/* Icon */}
                            {feature.icon && (
                                <div className="w-16 h-16 bg-primary/10 rounded-xl flex items-center justify-center mb-6">
                                    <span className="text-3xl">{feature.icon}</span>
                                </div>
                            )}

                            {/* Content */}
                            <h3 className="text-xl font-bold text-gray-900 mb-3">
                                {feature.title}
                            </h3>
                            <p className="text-gray-600 leading-relaxed">
                                {feature.description}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};
