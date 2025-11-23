import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || !['ADMIN', 'SUPERADMIN', 'MANAGER', 'EDITOR', 'VIEWER'].includes(session.user.role)) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const tags = await prisma.mediaTag.findMany({
            orderBy: { name: 'asc' },
            include: {
                _count: {
                    select: { media: true },
                },
            },
        });

        return NextResponse.json(tags);
    } catch (error) {
        console.error('Get tags error:', error);
        return NextResponse.json({ error: 'Failed to fetch tags' }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || !['ADMIN', 'SUPERADMIN', 'MANAGER', 'EDITOR'].includes(session.user.role)) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const data = await req.json();

        if (!data.name) {
            return NextResponse.json({ error: 'Name is required' }, { status: 400 });
        }

        const slug = data.name.toLowerCase().replace(/\s+/g, '-');

        const tag = await prisma.mediaTag.upsert({
            where: { name: data.name },
            update: {},
            create: {
                name: data.name,
                slug,
            },
        });

        return NextResponse.json(tag);
    } catch (error) {
        console.error('Create tag error:', error);
        return NextResponse.json({ error: 'Failed to create tag' }, { status: 500 });
    }
}
