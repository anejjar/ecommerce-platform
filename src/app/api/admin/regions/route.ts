import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// GET all regions (admin)
export async function GET(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user || !['ADMIN', 'SUPERADMIN', 'MANAGER'].includes(session.user.role)) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { searchParams } = new URL(request.url);
        const search = searchParams.get('search') || '';

        const regions = await prisma.region.findMany({
            where: search
                ? {
                    name: {
                        contains: search,
                    },
                }
                : undefined,
            include: {
                _count: {
                    select: { cities: true },
                },
            },
            orderBy: { name: 'asc' },
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

// POST create new region
export async function POST(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user || !['ADMIN', 'SUPERADMIN', 'MANAGER'].includes(session.user.role)) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const data = await request.json();

        if (!data.name) {
            return NextResponse.json(
                { error: 'Region name is required' },
                { status: 400 }
            );
        }

        // Check if region already exists
        const existing = await prisma.region.findUnique({
            where: { name: data.name },
        });

        if (existing) {
            return NextResponse.json(
                { error: 'Region already exists' },
                { status: 400 }
            );
        }

        const region = await prisma.region.create({
            data: {
                name: data.name,
                isActive: data.isActive ?? true,
            },
        });

        return NextResponse.json(region, { status: 201 });
    } catch (error) {
        console.error('Error creating region:', error);
        return NextResponse.json(
            { error: 'Failed to create region' },
            { status: 500 }
        );
    }
}
