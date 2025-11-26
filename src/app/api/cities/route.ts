import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET cities filtered by region (public - for checkout)
export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const regionId = searchParams.get('regionId');

        if (!regionId) {
            return NextResponse.json(
                { error: 'regionId parameter is required' },
                { status: 400 }
            );
        }

        const cities = await prisma.city.findMany({
            where: {
                regionId,
                isActive: true,
            },
            orderBy: { name: 'asc' },
            select: {
                id: true,
                name: true,
                regionId: true,
            },
        });

        return NextResponse.json(cities);
    } catch (error) {
        console.error('Error fetching cities:', error);
        return NextResponse.json(
            { error: 'Failed to fetch cities' },
            { status: 500 }
        );
    }
}
