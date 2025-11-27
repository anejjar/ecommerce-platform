import React from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Check } from 'lucide-react';

interface PricingTier {
    name: string;
    price: string;
    period?: string;
    features: string[];
    ctaText?: string;
    ctaLink?: string;
    highlighted?: boolean;
}

interface PricingBlockProps {
    config: {
        heading?: string;
        subheading?: string;
        tiers: PricingTier[];
    };
}

export const PricingBlock: React.FC<PricingBlockProps> = ({ config }) => {
    const {
        heading = 'Pricing Plans',
        subheading,
        tiers = []
    } = config;

    return (
        <section className="py-16 bg-gray-50">
            <div className="container mx-auto px-4">
                <div className="text-center mb-12">
                    <h2 className="text-4xl font-bold mb-4">{heading}</h2>
                    {subheading && (
                        <p className="text-xl text-muted-foreground">{subheading}</p>
                    )}
                </div>

                <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
                    {tiers.map((tier, index) => (
                        <Card
                            key={index}
                            className={`p-8 ${tier.highlighted ? 'ring-2 ring-primary shadow-xl scale-105' : ''}`}
                        >
                            <h3 className="text-2xl font-bold mb-2">{tier.name}</h3>
                            <div className="mb-6">
                                <span className="text-4xl font-bold">{tier.price}</span>
                                {tier.period && (
                                    <span className="text-muted-foreground">/{tier.period}</span>
                                )}
                            </div>
                            <ul className="space-y-3 mb-8">
                                {tier.features.map((feature, i) => (
                                    <li key={i} className="flex items-start gap-2">
                                        <Check className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
                                        <span>{feature}</span>
                                    </li>
                                ))}
                            </ul>
                            <Button
                                className="w-full"
                                variant={tier.highlighted ? 'default' : 'outline'}
                                asChild
                            >
                                <a href={tier.ctaLink || '#'}>
                                    {tier.ctaText || 'Get Started'}
                                </a>
                            </Button>
                        </Card>
                    ))}
                </div>
            </div>
        </section>
    );
};
