'use client';

import React from 'react';

interface GalleryGridProps {
    config: {
        heading?: string;
        subheading?: string;
        images?: Array<{
            url: string;
            caption?: string;
            alt?: string;
        }>;
        columns?: number;
    };
}

export const GalleryGrid: React.FC<GalleryGridProps> = ({ config }) => {
    const { heading, subheading, images = [], columns = 3 } = config;

    const gridCols = {
        2: 'md:grid-cols-2',
        3: 'md:grid-cols-3',
        4: 'md:grid-cols-4',
    }[columns] || 'md:grid-cols-3';

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

                <div className={`grid grid-cols-1 ${gridCols} gap-6`}>
                    {images.map((image, index) => (
                        <div key={index} className="group relative overflow-hidden rounded-lg">
                            {image.url ? (
                                <img
                                    src={image.url}
                                    alt={image.alt || image.caption || `Gallery image ${index + 1}`}
                                    className="w-full h-64 object-cover transform group-hover:scale-110 transition-transform duration-500"
                                />
                            ) : (
                                <div className="w-full h-64 bg-gray-200 flex items-center justify-center">
                                    <span className="text-gray-400">Image {index + 1}</span>
                                </div>
                            )}
                            {image.caption && (
                                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                                    <p className="text-white text-sm">{image.caption}</p>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};
