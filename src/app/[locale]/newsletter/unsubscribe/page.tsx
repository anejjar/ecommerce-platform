'use client';

import { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import toast from 'react-hot-toast';

export default function UnsubscribePage() {
    const searchParams = useSearchParams();
    const emailParam = searchParams.get('email');

    const [email, setEmail] = useState(emailParam || '');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isUnsubscribed, setIsUnsubscribed] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!email) {
            toast.error('Please enter your email address');
            return;
        }

        setIsSubmitting(true);

        try {
            const response = await fetch('/api/newsletter/unsubscribe', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email }),
            });

            const data = await response.json();

            if (response.ok) {
                setIsUnsubscribed(true);
            } else {
                toast.error(data.error || 'Failed to unsubscribe');
            }
        } catch (error) {
            toast.error('An error occurred. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isUnsubscribed) {
        return (
            <div className="container mx-auto px-4 py-16 max-w-md">
                <Card>
                    <CardHeader>
                        <CardTitle className="text-center">Successfully Unsubscribed</CardTitle>
                    </CardHeader>
                    <CardContent className="text-center">
                        <p className="text-gray-600 mb-4">
                            You have been unsubscribed from our newsletter.
                        </p>
                        <p className="text-sm text-gray-500 mb-6">
                            We're sorry to see you go! You can always resubscribe at any time.
                        </p>
                        <a href="/" className="text-blue-600 hover:underline">
                            Return to homepage
                        </a>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-16 max-w-md">
            <Card>
                <CardHeader>
                    <CardTitle>Unsubscribe from Newsletter</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-gray-600 mb-6">
                        We're sorry to see you go. Enter your email address to unsubscribe from our newsletter.
                    </p>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <Label htmlFor="email">Email Address</Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="your@email.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                disabled={isSubmitting}
                            />
                        </div>

                        <Button type="submit" className="w-full" disabled={isSubmitting}>
                            {isSubmitting ? 'Unsubscribing...' : 'Unsubscribe'}
                        </Button>
                    </form>

                    <p className="text-xs text-gray-500 mt-4 text-center">
                        Changed your mind?{' '}
                        <a href="/" className="text-blue-600 hover:underline">
                            Go back to homepage
                        </a>
                    </p>
                </CardContent>
            </Card>
        </div>
    );
}
