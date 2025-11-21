import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { email } = body;

        if (!email) {
            return NextResponse.json({ error: 'Email is required' }, { status: 400 });
        }

        // Find subscription
        const subscriber = await prisma.newsletterSubscriber.findUnique({
            where: { email },
        });

        if (!subscriber) {
            return NextResponse.json(
                { error: 'Email not found in our newsletter list' },
                { status: 404 }
            );
        }

        if (!subscriber.isActive) {
            return NextResponse.json(
                { error: 'Email is already unsubscribed' },
                { status: 400 }
            );
        }

        // Unsubscribe
        await prisma.newsletterSubscriber.update({
            where: { email },
            data: {
                isActive: false,
                unsubscribedAt: new Date(),
            },
        });

        return NextResponse.json({
            message: 'Successfully unsubscribed from newsletter',
        });
    } catch (error) {
        console.error('Newsletter unsubscribe error:', error);
        return NextResponse.json(
            { error: 'Failed to unsubscribe from newsletter' },
            { status: 500 }
        );
    }
}
