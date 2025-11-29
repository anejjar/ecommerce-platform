import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// PATCH update region
export async function PATCH(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user || !['ADMIN', 'SUPERADMIN', 'MANAGER'].includes(session.user.role)) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const data = await request.json();
        const regionId = id;

        const region = await prisma.region.update({
            where: { id: regionId },
            data: {
                name: data.name,
                isActive: data.isActive,
            },
        });

        return NextResponse.json(region);
    } catch (error) {
        console.error('Error updating region:', error);
        return NextResponse.json(
            { error: 'Failed to update region' },
            { status: 500 }
        );
    }
}

// DELETE region
export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user || !['ADMIN', 'SUPERADMIN', 'MANAGER'].includes(session.user.role)) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const regionId = id;

        // Delete region (cities will be cascaded)
        await prisma.region.delete({
            where: { id: regionId },
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error deleting region:', error);
        return NextResponse.json(
            { error: 'Failed to delete region' },
            { status: 500 }
        );
    }
}
