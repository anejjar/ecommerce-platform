import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';

interface FormBlockProps {
    config: {
        heading?: string;
        description?: string;
        formType?: 'contact' | 'newsletter';
        submitText?: string;
    };
}

export const FormBlock: React.FC<FormBlockProps> = ({ config }) => {
    const {
        heading = 'Get in Touch',
        description,
        formType = 'contact',
        submitText = 'Submit'
    } = config;

    return (
        <section className="py-16 bg-gray-50">
            <div className="container mx-auto px-4 max-w-2xl">
                <div className="text-center mb-8">
                    <h2 className="text-3xl md:text-4xl font-bold mb-4">{heading}</h2>
                    {description && (
                        <p className="text-lg text-muted-foreground">{description}</p>
                    )}
                </div>

                <form className="space-y-6 bg-white p-8 rounded-lg shadow-sm">
                    {formType === 'contact' ? (
                        <>
                            <div className="space-y-2">
                                <Label htmlFor="name">Name</Label>
                                <Input id="name" placeholder="Your name" required />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="email">Email</Label>
                                <Input id="email" type="email" placeholder="your@email.com" required />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="message">Message</Label>
                                <Textarea id="message" placeholder="Your message" rows={5} required />
                            </div>
                        </>
                    ) : (
                        <div className="space-y-2">
                            <Label htmlFor="email">Email Address</Label>
                            <Input id="email" type="email" placeholder="your@email.com" required />
                        </div>
                    )}
                    <Button type="submit" size="lg" className="w-full">
                        {submitText}
                    </Button>
                </form>
            </div>
        </section>
    );
};
