'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import toast from 'react-hot-toast';

interface NewsletterFormProps {
    source?: string;
    showName?: boolean;
    className?: string;
}

export function NewsletterForm({ source = 'footer', showName = false, className = '' }: NewsletterFormProps) {
    const [email, setEmail] = useState('');
    const [name, setName] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSubscribed, setIsSubscribed] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!email) {
            toast.error('Please enter your email address');
            return;
        }

        setIsSubmitting(true);

        try {
            const response = await fetch('/api/newsletter/subscribe', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    email,
                    name: showName ? name : undefined,
                    source,
                }),
            });

            const data = await response.json();

            if (response.ok) {
                toast.success('Successfully subscribed to newsletter!');
                setIsSubscribed(true);
                setEmail('');
                setName('');
            } else {
                toast.error(data.error || 'Failed to subscribe');
            }
        } catch (error) {
            toast.error('An error occurred. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isSubscribed) {
        return (
            <div className={`bg-green-50 border border-green-200 rounded-lg p-4 ${className}`}>
                <p className="text-green-800 text-sm">
                    ✓ Thank you for subscribing! Check your email for confirmation.
                </p>
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit} className={className}>
            <div className="space-y-3">
                {showName && (
                    <div>
                        <Label htmlFor="newsletter-name" className="sr-only">
                            Name
                        </Label>
                        <Input
                            id="newsletter-name"
                            type="text"
                            placeholder="Your name (optional)"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            disabled={isSubmitting}
                        />
                    </div>
                )}
                <div>
                    <Label htmlFor="newsletter-email" className="sr-only">
                        Email
                    </Label>
                    <Input
                        id="newsletter-email"
                        type="email"
                        placeholder="Enter your email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        disabled={isSubmitting}
                    />
                </div>
                <Button type="submit" className="w-full" disabled={isSubmitting}>
                    {isSubmitting ? 'Subscribing...' : 'Subscribe'}
                </Button>
            </div>
            <p className="text-xs text-gray-500 mt-2">
                Get exclusive deals and updates. Unsubscribe anytime.
            </p>
        </form>
    );
}
