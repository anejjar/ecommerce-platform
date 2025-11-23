import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// Bulk delete posts
export async function DELETE(request: NextRequest) {
    const session = await getServerSession(authOptions);

    if (!session || (session.user.role !== 'ADMIN' && session.user.role !== 'SUPERADMIN')) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const body = await request.json();
        const { ids } = body;

        if (!ids || !Array.isArray(ids) || ids.length === 0) {
            return NextResponse.json({ error: 'Invalid post IDs' }, { status: 400 });
        }

        // Delete posts
        await prisma.blogPost.deleteMany({
            where: {
                id: {
                    in: ids,
                },
            },
        });

        return NextResponse.json({
            message: `${ids.length} post(s) deleted`,
            count: ids.length,
        });
    } catch (error) {
        console.error('Error deleting posts:', error);
        return NextResponse.json({ error: 'Failed to delete posts' }, { status: 500 });
    }
}

// Bulk update post status
export async function PATCH(request: NextRequest) {
    const session = await getServerSession(authOptions);

    if (!session || (session.user.role !== 'ADMIN' && session.user.role !== 'SUPERADMIN')) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const body = await request.json();
        const { ids, status } = body;

        if (!ids || !Array.isArray(ids) || ids.length === 0) {
            return NextResponse.json({ error: 'Invalid post IDs' }, { status: 400 });
        }

        if (!status || !['DRAFT', 'PUBLISHED', 'ARCHIVED'].includes(status)) {
            return NextResponse.json({ error: 'Invalid status' }, { status: 400 });
        }

        // Update posts status
        await prisma.blogPost.updateMany({
            where: {
                id: {
                    in: ids,
                },
            },
            data: {
                status,
                ...(status === 'PUBLISHED' && {
                    publishedAt: new Date(),
                }),
            },
        });

        return NextResponse.json({
            message: `${ids.length} post(s) updated`,
            count: ids.length,
        });
    } catch (error) {
        console.error('Error updating posts:', error);
        return NextResponse.json({ error: 'Failed to update posts' }, { status: 500 });
    }
}
