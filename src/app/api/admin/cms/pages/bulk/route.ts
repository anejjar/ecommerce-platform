import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// Bulk delete pages
export async function DELETE(request: NextRequest) {
    const session = await getServerSession(authOptions);

    if (!session || (session.user.role !== 'ADMIN' && session.user.role !== 'SUPERADMIN')) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const body = await request.json();
        const { ids } = body;

        if (!ids || !Array.isArray(ids) || ids.length === 0) {
            return NextResponse.json({ error: 'Invalid page IDs' }, { status: 400 });
        }

        // Delete pages
        await prisma.page.deleteMany({
            where: {
                id: {
                    in: ids,
                },
            },
        });

        return NextResponse.json({
            message: `${ids.length} page(s) deleted`,
            count: ids.length,
        });
    } catch (error) {
        console.error('Error deleting pages:', error);
        return NextResponse.json({ error: 'Failed to delete pages' }, { status: 500 });
    }
}

// Bulk update page status
export async function PATCH(request: NextRequest) {
    const session = await getServerSession(authOptions);

    if (!session || (session.user.role !== 'ADMIN' && session.user.role !== 'SUPERADMIN')) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const body = await request.json();
        const { ids, status } = body;

        if (!ids || !Array.isArray(ids) || ids.length === 0) {
            return NextResponse.json({ error: 'Invalid page IDs' }, { status: 400 });
        }

        if (!status || !['DRAFT', 'PUBLISHED'].includes(status)) {
            return NextResponse.json({ error: 'Invalid status' }, { status: 400 });
        }

        // Update pages status
        await prisma.page.updateMany({
            where: {
                id: {
                    in: ids,
                },
            },
            data: {
                status,
            },
        });

        return NextResponse.json({
            message: `${ids.length} page(s) updated`,
            count: ids.length,
        });
    } catch (error) {
        console.error('Error updating pages:', error);
        return NextResponse.json({ error: 'Failed to update pages' }, { status: 500 });
    }
}
