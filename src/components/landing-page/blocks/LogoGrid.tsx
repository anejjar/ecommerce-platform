'use client';

import React from 'react';

interface LogoGridProps {
    config: {
        heading?: string;
        subheading?: string;
        logos?: Array<{
            name: string;
            image: string;
            url?: string;
        }>;
    };
}

export const LogoGrid: React.FC<LogoGridProps> = ({ config }) => {
    const { heading, subheading, logos = [] } = config;

    return (
        <section className="py-24 bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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

                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 items-center">
                    {logos.map((logo, index) => (
                        <div key={index} className="flex items-center justify-center">
                            {logo.url ? (
                                <a
                                    href={logo.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="grayscale hover:grayscale-0 transition-all opacity-60 hover:opacity-100"
                                >
                                    {logo.image ? (
                                        <img
                                            src={logo.image}
                                            alt={logo.name}
                                            className="h-12 w-auto object-contain"
                                        />
                                    ) : (
                                        <div className="h-12 w-24 bg-gray-300 rounded flex items-center justify-center text-xs text-gray-600">
                                            {logo.name}
                                        </div>
                                    )}
                                </a>
                            ) : (
                                <div className="grayscale opacity-60">
                                    {logo.image ? (
                                        <img
                                            src={logo.image}
                                            alt={logo.name}
                                            className="h-12 w-auto object-contain"
                                        />
                                    ) : (
                                        <div className="h-12 w-24 bg-gray-300 rounded flex items-center justify-center text-xs text-gray-600">
                                            {logo.name}
                                        </div>
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
