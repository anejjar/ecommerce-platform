import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { sendEmail } from '@/lib/email';
import { newsletterWelcomeEmail } from '@/lib/email-templates';

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { email, name, source, landingPageId } = body;

        if (!email) {
            return NextResponse.json({ error: 'Email is required' }, { status: 400 });
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return NextResponse.json({ error: 'Invalid email format' }, { status: 400 });
        }

        // Check if already subscribed
        const existing = await prisma.newsletterSubscriber.findUnique({
            where: { email },
        });

        if (existing) {
            if (existing.isActive) {
                return NextResponse.json(
                    { error: 'Email is already subscribed' },
                    { status: 400 }
                );
            } else {
                // Reactivate subscription
                const updated = await prisma.newsletterSubscriber.update({
                    where: { email },
                    data: {
                        isActive: true,
                        unsubscribedAt: null,
                        name: name || existing.name,
                        source: source || existing.source,
                        landingPageId: landingPageId || existing.landingPageId,
                    },
                });

                // Send welcome email
                try {
                    await sendEmail({
                        to: email,
                        subject: 'Welcome Back to Our Newsletter!',
                        html: newsletterWelcomeEmail(name || existing.name || undefined),
                    });
                } catch (emailError) {
                    console.error('Failed to send welcome email:', emailError);
                }

                return NextResponse.json({
                    message: 'Successfully resubscribed to newsletter',
                    subscriber: {
                        email: updated.email,
                        name: updated.name,
                    },
                });
            }
        }

        // Create new subscription
        const subscriber = await prisma.newsletterSubscriber.create({
            data: {
                email,
                name: name || null,
                source: source || 'unknown',
                landingPageId: landingPageId || null,
                isActive: true,
            },
        });

        // Send welcome email
        try {
            await sendEmail({
                to: email,
                subject: 'Welcome to Our Newsletter!',
                html: newsletterWelcomeEmail(name || undefined),
            });
        } catch (emailError) {
            console.error('Failed to send welcome email:', emailError);
        }

        return NextResponse.json({
            message: 'Successfully subscribed to newsletter',
            subscriber: {
                email: subscriber.email,
                name: subscriber.name,
            },
        });
    } catch (error: any) {
        console.error('Newsletter subscription error:', error);
        console.error('Error details:', {
            message: error?.message,
            code: error?.code,
            meta: error?.meta,
        });
        return NextResponse.json(
            { 
                error: 'Failed to subscribe to newsletter',
                details: process.env.NODE_ENV === 'development' ? error?.message : undefined
            },
            { status: 500 }
        );
    }
}
