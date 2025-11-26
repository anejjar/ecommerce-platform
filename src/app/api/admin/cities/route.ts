import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// GET all cities (admin)
export async function GET(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user || !['ADMIN', 'SUPERADMIN', 'MANAGER'].includes(session.user.role)) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { searchParams } = new URL(request.url);
        const regionId = searchParams.get('regionId');
        const search = searchParams.get('search') || '';

        const cities = await prisma.city.findMany({
            where: {
                ...(regionId && { regionId }),
                ...(search && {
                    name: {
                        contains: search,
                    },
                }),
            },
            include: {
                region: {
                    select: {
                        id: true,
                        name: true,
                    },
                },
            },
            orderBy: [{ region: { name: 'asc' } }, { name: 'asc' }],
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

// POST create new city
export async function POST(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user || !['ADMIN', 'SUPERADMIN', 'MANAGER'].includes(session.user.role)) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const data = await request.json();

        if (!data.name || !data.regionId) {
            return NextResponse.json(
                { error: 'City name and region are required' },
                { status: 400 }
            );
        }

        // Check if city already exists in this region
        const existing = await prisma.city.findUnique({
            where: {
                name_regionId: {
                    name: data.name,
                    regionId: data.regionId,
                },
            },
        });

        if (existing) {
            return NextResponse.json(
                { error: 'City already exists in this region' },
                { status: 400 }
            );
        }

        const city = await prisma.city.create({
            data: {
                name: data.name,
                regionId: data.regionId,
                isActive: data.isActive ?? true,
            },
            include: {
                region: {
                    select: {
                        id: true,
                        name: true,
                    },
                },
            },
        });

        return NextResponse.json(city, { status: 201 });
    } catch (error) {
        console.error('Error creating city:', error);
        return NextResponse.json(
            { error: 'Failed to create city' },
            { status: 500 }
        );
    }
}
