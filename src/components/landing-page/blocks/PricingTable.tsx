'use client';

import React from 'react';
import { Check } from 'lucide-react';

interface PricingTableProps {
    config: {
        heading?: string;
        subheading?: string;
        plans?: Array<{
            name: string;
            price: string;
            period?: string;
            description?: string;
            features?: string[];
            buttonText?: string;
            buttonUrl?: string;
            highlighted?: boolean;
        }>;
    };
}

export const PricingTable: React.FC<PricingTableProps> = ({ config }) => {
    const { heading, subheading, plans = [] } = config;

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

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
                    {plans.map((plan, index) => (
                        <div
                            key={index}
                            className={`bg-white rounded-2xl p-8 ${plan.highlighted
                                    ? 'ring-2 ring-primary shadow-2xl scale-105'
                                    : 'shadow-lg'
                                }`}
                        >
                            {plan.highlighted && (
                                <span className="bg-primary text-white text-xs font-bold px-3 py-1 rounded-full uppercase">
                                    Popular
                                </span>
                            )}
                            <h3 className="text-2xl font-bold text-gray-900 mt-4">
                                {plan.name}
                            </h3>
                            {plan.description && (
                                <p className="text-gray-600 mt-2">{plan.description}</p>
                            )}
                            <div className="mt-6 mb-8">
                                <span className="text-5xl font-bold text-gray-900">
                                    {plan.price}
                                </span>
                                {plan.period && (
                                    <span className="text-gray-600 ml-2">/{plan.period}</span>
                                )}
                            </div>
                            {plan.features && (
                                <ul className="space-y-4 mb-8">
                                    {plan.features.map((feature, idx) => (
                                        <li key={idx} className="flex items-start gap-3">
                                            <Check className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                                            <span className="text-gray-700">{feature}</span>
                                        </li>
                                    ))}
                                </ul>
                            )}
                            <a
                                href={plan.buttonUrl || '#'}
                                className={`block w-full text-center px-6 py-3 rounded-lg font-semibold transition-colors ${plan.highlighted
                                        ? 'bg-primary text-white hover:bg-primary/90'
                                        : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                                    }`}
                            >
                                {plan.buttonText || 'Get Started'}
                            </a>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};
