'use client';

import React from 'react';

interface FeaturesScreenshotsProps {
    config: {
        heading?: string;
        subheading?: string;
        description?: string;
        screenshots?: Array<{
            image: string;
            title?: string;
            caption?: string;
        }>;
    };
}

export const FeaturesScreenshots: React.FC<FeaturesScreenshotsProps> = ({ config }) => {
    const { heading, subheading, description, screenshots = [] } = config;

    return (
        <section className="py-24 bg-gradient-to-b from-white to-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="text-center mb-16 max-w-3xl mx-auto">
                    {subheading && (
                        <p className="text-primary font-semibold mb-2">{subheading}</p>
                    )}
                    {heading && (
                        <h2 className="text-4xl font-bold text-gray-900 mb-4">{heading}</h2>
                    )}
                    {description && (
                        <p className="text-lg text-gray-600">{description}</p>
                    )}
                </div>

                {/* Screenshots Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {screenshots.map((screenshot, index) => (
                        <div key={index} className="group">
                            <div className="relative overflow-hidden rounded-2xl shadow-2xl">
                                {screenshot.image ? (
                                    <img
                                        src={screenshot.image}
                                        alt={screenshot.title || `Screenshot ${index + 1}`}
                                        className="w-full h-auto transform group-hover:scale-105 transition-transform duration-500"
                                    />
                                ) : (
                                    <div className="bg-gray-200 aspect-video flex items-center justify-center">
                                        <span className="text-gray-400">Screenshot</span>
                                    </div>
                                )}
                            </div>
                            {(screenshot.title || screenshot.caption) && (
                                <div className="mt-4 text-center">
                                    {screenshot.title && (
                                        <h3 className="font-semibold text-gray-900 mb-1">
                                            {screenshot.title}
                                        </h3>
                                    )}
                                    {screenshot.caption && (
                                        <p className="text-sm text-gray-600">{screenshot.caption}</p>
                                    )}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};
