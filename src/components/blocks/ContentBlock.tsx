import React from 'react';
import Image from 'next/image';

interface ContentBlockProps {
    config: {
        heading?: string;
        content?: string;
        image?: string;
        imagePosition?: 'left' | 'right';
        backgroundColor?: string;
    };
}

export const ContentBlock: React.FC<ContentBlockProps> = ({ config }) => {
    const {
        heading,
        content,
        image,
        imagePosition = 'right',
        backgroundColor = '#ffffff'
    } = config;

    const isImageLeft = imagePosition === 'left';

    return (
        <section className="py-16" style={{ backgroundColor }}>
            <div className="container mx-auto px-4">
                <div className={`grid md:grid-cols-2 gap-12 items-center ${isImageLeft ? 'md:flex-row-reverse' : ''}`}>
                    <div className={isImageLeft ? 'md:order-2' : ''}>
                        {heading && (
                            <h2 className="text-3xl md:text-4xl font-bold mb-6">
                                {heading}
                            </h2>
                        )}
                        {content && (
                            <div
                                className="prose prose-lg max-w-none"
                                dangerouslySetInnerHTML={{ __html: content }}
                            />
                        )}
                    </div>
                    {image && (
                        <div className={`relative aspect-video rounded-lg overflow-hidden ${isImageLeft ? 'md:order-1' : ''}`}>
                            <Image
                                src={image}
                                alt={heading || 'Content image'}
                                fill
                                className="object-cover"
                            />
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
};
