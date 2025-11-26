import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET checkout settings (public - for checkout page)
export async function GET() {
    try {
        // Get the first (and should be only) checkout settings record
        let settings = await prisma.checkoutSettings.findFirst();

        // If no settings exist, create default settings
        if (!settings) {
            settings = await prisma.checkoutSettings.create({
                data: {},
            });
        }

        return NextResponse.json(settings);
    } catch (error) {
        console.error('Error fetching checkout settings:', error);
        return NextResponse.json(
            { error: 'Failed to fetch checkout settings' },
            { status: 500 }
        );
    }
}
