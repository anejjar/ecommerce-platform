import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// Check if a feature is enabled (public endpoint)
export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ name: string }> }
) {
    try {
        const { name } = await params;
        const featureName = name;

        const feature = await prisma.featureFlag.findUnique({
            where: { name: featureName },
            select: {
                enabled: true,
            },
        });

        if (!feature) {
            return NextResponse.json({ enabled: false });
        }

        return NextResponse.json({ enabled: feature.enabled });
    } catch (error) {
        console.error('Error checking feature flag:', error);
        return NextResponse.json({ enabled: false });
    }
}
