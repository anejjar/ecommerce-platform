import React from 'react';
import { Card } from '@/components/ui/card';

interface Feature {
    icon?: string;
    title: string;
    description: string;
}

interface FeaturesBlockProps {
    config: {
        heading?: string;
        subheading?: string;
        features: Feature[];
        columns?: number;
    };
}

export const FeaturesBlock: React.FC<FeaturesBlockProps> = ({ config }) => {
    const {
        heading = 'Features',
        subheading,
        features = [],
        columns = 3
    } = config;

    const gridClass = {
        2: 'md:grid-cols-2',
        3: 'md:grid-cols-3',
        4: 'md:grid-cols-4'
    }[columns] || 'md:grid-cols-3';

    return (
        <section className="py-16 bg-gray-50">
            <div className="container mx-auto px-4">
                <div className="text-center mb-12">
                    <h2 className="text-4xl font-bold mb-4">{heading}</h2>
                    {subheading && (
                        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                            {subheading}
                        </p>
                    )}
                </div>

                <div className={`grid grid-cols-1 ${gridClass} gap-8`}>
                    {features.map((feature, index) => (
                        <Card key={index} className="p-6 text-center hover:shadow-lg transition-shadow">
                            {feature.icon && (
                                <div className="text-4xl mb-4">{feature.icon}</div>
                            )}
                            <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                            <p className="text-muted-foreground">{feature.description}</p>
                        </Card>
                    ))}
                </div>
            </div>
        </section>
    );
};
