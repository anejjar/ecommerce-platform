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

        // Fetch shipping and tax settings from StoreSetting table
        const shippingSettings = await prisma.storeSetting.findMany({
            where: { category: 'shipping' },
        });

        // Convert shipping settings to key-value object
        const shippingSettingsObject = shippingSettings.reduce((acc, setting) => {
            acc[setting.key] = setting.value;
            return acc;
        }, {} as Record<string, string>);

        // Merge checkout settings with shipping settings
        const mergedSettings = {
            ...settings,
            shippingSettings: shippingSettingsObject,
        };

        return NextResponse.json(mergedSettings);
    } catch (error) {
        console.error('Error fetching checkout settings:', error);
        return NextResponse.json(
            { error: 'Failed to fetch checkout settings' },
            { status: 500 }
        );
    }
}
