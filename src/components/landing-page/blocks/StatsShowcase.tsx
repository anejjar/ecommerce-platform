'use client';

import React from 'react';

interface StatsShowcaseProps {
    config: {
        heading?: string;
        subheading?: string;
        stats?: Array<{
            value: string;
            label: string;
            description?: string;
        }>;
        backgroundColor?: string;
    };
}

export const StatsShowcase: React.FC<StatsShowcaseProps> = ({ config }) => {
    const { heading, subheading, stats = [], backgroundColor = '#000000' } = config;

    return (
        <section className="py-24" style={{ backgroundColor }}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {(heading || subheading) && (
                    <div className="text-center mb-16">
                        {subheading && (
                            <p className="text-white/80 font-semibold mb-2">{subheading}</p>
                        )}
                        {heading && (
                            <h2 className="text-4xl font-bold text-white">{heading}</h2>
                        )}
                    </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {stats.map((stat, index) => (
                        <div key={index} className="text-center">
                            <div className="text-5xl font-bold text-white mb-2">
                                {stat.value}
                            </div>
                            <div className="text-xl font-semibold text-white/90 mb-2">
                                {stat.label}
                            </div>
                            {stat.description && (
                                <p className="text-sm text-white/70">{stat.description}</p>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};
