'use client';

import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Mail, Loader2, CheckCircle2 } from 'lucide-react';
import { toast } from 'react-hot-toast';

interface NewsletterSignupProps {
    config: {
        heading?: string;
        subheading?: string;
        description?: string;
        buttonText?: string;
        placeholder?: string;
        backgroundColor?: string;
    };
    landingPageId?: string;
}

export const NewsletterSignup: React.FC<NewsletterSignupProps> = ({ config, landingPageId }) => {
    const {
        heading = 'Subscribe to our newsletter',
        subheading,
        description = 'Get the latest updates and news delivered to your inbox.',
        buttonText = 'Subscribe',
        placeholder = 'Enter your email',
        backgroundColor = '#f9fafb',
    } = config;

    const [email, setEmail] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSubscribed, setIsSubscribed] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!email) {
            toast.error('Please enter your email address');
            return;
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            toast.error('Please enter a valid email address');
            return;
        }

        setIsSubmitting(true);
        try {
            const response = await fetch('/api/newsletter/subscribe', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email,
                    source: 'landing-page',
                    landingPageId: landingPageId || undefined,
                }),
            });

            const data = await response.json();

            if (response.ok) {
                setIsSubscribed(true);
                setEmail('');
                toast.success('Successfully subscribed to newsletter!');
            } else {
                toast.error(data.error || 'Failed to subscribe. Please try again.');
            }
        } catch (error) {
            console.error('Newsletter signup error:', error);
            toast.error('An error occurred. Please try again later.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <section className="py-24" style={{ backgroundColor }}>
            <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                {subheading && (
                    <p className="text-primary font-semibold mb-2">{subheading}</p>
                )}
                <h2 className="text-4xl font-bold text-gray-900 mb-4">{heading}</h2>
                {description && (
                    <p className="text-lg text-gray-600 mb-8">{description}</p>
                )}

                {isSubscribed ? (
                    <div className="bg-green-50 border border-green-200 rounded-lg p-6 max-w-md mx-auto">
                        <div className="flex items-center gap-3">
                            <CheckCircle2 className="h-6 w-6 text-green-600 flex-shrink-0" />
                            <div>
                                <p className="font-semibold text-green-900">Successfully Subscribed!</p>
                                <p className="text-sm text-green-700">Check your email for a confirmation message.</p>
                            </div>
                        </div>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
                        <div className="flex-1 relative">
                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                            <Input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder={placeholder}
                                required
                                className="pl-10"
                                disabled={isSubmitting}
                            />
                        </div>
                        <Button type="submit" className="whitespace-nowrap" disabled={isSubmitting}>
                            {isSubmitting ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Subscribing...
                                </>
                            ) : (
                                buttonText
                            )}
                        </Button>
                    </form>
                )}
            </div>
        </section>
    );
};
