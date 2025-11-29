import React from 'react';
import { Button } from '@/components/ui/button';

interface CTABlockProps {
    config: {
        heading?: string;
        description?: string;
        ctaText?: string;
        ctaLink?: string;
        backgroundColor?: string;
        textColor?: string;
    };
}

export const CTABlock: React.FC<CTABlockProps> = ({ config }) => {
    const {
        heading = 'Ready to get started?',
        description,
        ctaText = 'Get Started',
        ctaLink = '#',
        backgroundColor = '#1a1a1a',
        textColor = '#ffffff'
    } = config;

    return (
        <section
            className="py-20"
            style={{ backgroundColor, color: textColor }}
        >
            <div className="container mx-auto px-4 text-center">
                <h2 className="text-4xl md:text-5xl font-bold mb-6">
                    {heading}
                </h2>
                {description && (
                    <p className="text-xl mb-8 max-w-2xl mx-auto opacity-90">
                        {description}
                    </p>
                )}
                <Button
                    size="lg"
                    variant="secondary"
                    className="text-lg px-8 py-6"
                    asChild
                >
                    <a href={ctaLink}>{ctaText}</a>
                </Button>
            </div>
        </section>
    );
};
