import React from 'react';
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from '@/components/ui/accordion';

interface FAQItem {
    question: string;
    answer: string;
}

interface FAQBlockProps {
    config: {
        heading?: string;
        faqs: FAQItem[];
    };
}

export const FAQBlock: React.FC<FAQBlockProps> = ({ config }) => {
    const {
        heading = 'Frequently Asked Questions',
        faqs = []
    } = config;

    return (
        <section className="py-16">
            <div className="container mx-auto px-4 max-w-3xl">
                <h2 className="text-4xl font-bold text-center mb-12">{heading}</h2>

                <Accordion type="single" collapsible className="w-full">
                    {faqs.map((faq, index) => (
                        <AccordionItem key={index} value={`item-${index}`}>
                            <AccordionTrigger className="text-left">
                                {faq.question}
                            </AccordionTrigger>
                            <AccordionContent>
                                {faq.answer}
                            </AccordionContent>
                        </AccordionItem>
                    ))}
                </Accordion>
            </div>
        </section>
    );
};
