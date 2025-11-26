import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// GET all regions (public - for checkout)
export async function GET() {
    try {
        const regions = await prisma.region.findMany({
            where: { isActive: true },
            orderBy: { name: 'asc' },
            select: {
                id: true,
                name: true,
            },
        });

        return NextResponse.json(regions);
    } catch (error) {
        console.error('Error fetching regions:', error);
        return NextResponse.json(
            { error: 'Failed to fetch regions' },
            { status: 500 }
        );
    }
}
