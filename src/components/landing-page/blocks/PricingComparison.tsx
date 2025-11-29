'use client';

import React from 'react';
import { Check, X } from 'lucide-react';

interface PricingComparisonProps {
    config: {
        heading?: string;
        subheading?: string;
        plans?: Array<{
            name: string;
            price: string;
            period?: string;
        }>;
        features?: Array<{
            name: string;
            plans: boolean[]; // Array of booleans for each plan
        }>;
    };
}

export const PricingComparison: React.FC<PricingComparisonProps> = ({ config }) => {
    const { heading, subheading, plans = [], features = [] } = config;

    return (
        <section className="py-24 bg-white">
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

                <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                        <thead>
                            <tr className="border-b-2 border-gray-200">
                                <th className="text-left py-4 px-6 font-semibold text-gray-900">
                                    Features
                                </th>
                                {plans.map((plan, index) => (
                                    <th key={index} className="py-4 px-6 text-center">
                                        <div className="font-bold text-xl text-gray-900">
                                            {plan.name}
                                        </div>
                                        <div className="text-3xl font-bold text-primary mt-2">
                                            {plan.price}
                                        </div>
                                        {plan.period && (
                                            <div className="text-sm text-gray-600">/{plan.period}</div>
                                        )}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {features.map((feature, index) => (
                                <tr key={index} className="border-b border-gray-100">
                                    <td className="py-4 px-6 font-medium text-gray-900">
                                        {feature.name}
                                    </td>
                                    {feature.plans.map((included, planIndex) => (
                                        <td key={planIndex} className="py-4 px-6 text-center">
                                            {included ? (
                                                <Check className="h-6 w-6 text-primary mx-auto" />
                                            ) : (
                                                <X className="h-6 w-6 text-gray-300 mx-auto" />
                                            )}
                                        </td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </section>
    );
};
