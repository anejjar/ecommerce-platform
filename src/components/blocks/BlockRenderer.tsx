import React from 'react';
import { HeroBlock } from './HeroBlock';
import { FeaturesBlock } from './FeaturesBlock';
import { CTABlock } from './CTABlock';
import { ContentBlock } from './ContentBlock';
import { FormBlock } from './FormBlock';
import { TestimonialBlock } from './TestimonialBlock';
import { PricingBlock } from './PricingBlock';
import { FAQBlock } from './FAQBlock';

interface BlockData {
    id: string;
    template: {
        name: string;
        category: string;
    };
    config: any;
}

interface BlockRendererProps {
    block: BlockData;
}

export const BlockRenderer: React.FC<BlockRendererProps> = ({ block }) => {
    const { template, config } = block;

    // Map template names/categories to components
    const componentMap: Record<string, React.ComponentType<any>> = {
        // By category
        'HERO': HeroBlock,
        'FEATURES': FeaturesBlock,
        'CTA': CTABlock,
        'CONTENT': ContentBlock,
        'FORM': FormBlock,
        'TESTIMONIAL': TestimonialBlock,
        'PRICING': PricingBlock,
        'FAQ': FAQBlock,

        // By specific template names (for more granular control)
        'Hero Section': HeroBlock,
        'Features Grid': FeaturesBlock,
        'Call to Action': CTABlock,
        'Text Content': ContentBlock,
        'Contact Form': FormBlock,
        'Newsletter Form': FormBlock,
        'Customer Testimonials': TestimonialBlock,
        'Pricing Table': PricingBlock,
        'FAQ Accordion': FAQBlock,
    };

    // Try to find component by template name first, then by category
    const Component = componentMap[template.name] || componentMap[template.category];

    if (!Component) {
        console.warn(`No component found for template: ${template.name} (${template.category})`);
        return (
            <div className="py-8 bg-yellow-50 border-l-4 border-yellow-400">
                <div className="container mx-auto px-4">
                    <p className="text-yellow-800">
                        <strong>Unknown Block Type:</strong> {template.name} ({template.category})
                    </p>
                </div>
            </div>
        );
    }

    return <Component config={config} />;
};
