import React from 'react';
import { Button } from '@/components/ui/button';
import Image from 'next/image';

interface HeroBlockProps {
    config: {
        heading?: string;
        subheading?: string;
        heroImage?: string;
        ctaText?: string;
        ctaLink?: string;
        overlayColor?: string;
        overlayOpacity?: number;
        alignment?: 'left' | 'center' | 'right';
    };
}

export const HeroBlock: React.FC<HeroBlockProps> = ({ config }) => {
    const {
        heading = 'Welcome',
        subheading = '',
        heroImage,
        ctaText,
        ctaLink,
        overlayColor = '#000000',
        overlayOpacity = 0.4,
        alignment = 'center'
    } = config;

    const alignmentClass = {
        left: 'text-left items-start',
        center: 'text-center items-center',
        right: 'text-right items-end'
    }[alignment];

    return (
        <section className="relative min-h-[600px] flex items-center justify-center overflow-hidden">
            {/* Background Image */}
            {heroImage && (
                <>
                    <Image
                        src={heroImage}
                        alt={heading}
                        fill
                        className="object-cover"
                        priority
                    />
                    <div
                        className="absolute inset-0"
                        style={{
                            backgroundColor: overlayColor,
                            opacity: overlayOpacity
                        }}
                    />
                </>
            )}

            {/* Content */}
            <div className={`relative z-10 container mx-auto px-4 flex flex-col ${alignmentClass} gap-6 max-w-4xl`}>
                <h1 className="text-5xl md:text-7xl font-bold text-white drop-shadow-lg">
                    {heading}
                </h1>
                {subheading && (
                    <p className="text-xl md:text-2xl text-white/90 drop-shadow max-w-2xl">
                        {subheading}
                    </p>
                )}
                {ctaText && ctaLink && (
                    <Button
                        size="lg"
                        className="mt-4 text-lg px-8 py-6"
                        asChild
                    >
                        <a href={ctaLink}>{ctaText}</a>
                    </Button>
                )}
            </div>
        </section>
    );
};
