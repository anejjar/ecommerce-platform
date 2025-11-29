'use client';

import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';

interface FAQAccordionProps {
    config: {
        heading?: string;
        subheading?: string;
        faqs?: Array<{
            question: string;
            answer: string;
        }>;
    };
}

export const FAQAccordion: React.FC<FAQAccordionProps> = ({ config }) => {
    const { heading, subheading, faqs = [] } = config;
    const [openIndex, setOpenIndex] = useState<number | null>(0);

    return (
        <section className="py-24 bg-white">
            <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
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

                <div className="space-y-4">
                    {faqs.map((faq, index) => (
                        <div
                            key={index}
                            className="border border-gray-200 rounded-lg overflow-hidden"
                        >
                            <button
                                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                                className="w-full flex items-center justify-between p-6 text-left hover:bg-gray-50 transition-colors"
                            >
                                <span className="font-semibold text-gray-900 pr-8">
                                    {faq.question}
                                </span>
                                <ChevronDown
                                    className={`h-5 w-5 text-gray-500 shrink-0 transition-transform ${openIndex === index ? 'rotate-180' : ''
                                        }`}
                                />
                            </button>
                            {openIndex === index && (
                                <div className="px-6 pb-6 text-gray-600 leading-relaxed">
                                    {faq.answer}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};
