import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// PATCH update city
export async function PATCH(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user || !['ADMIN', 'SUPERADMIN', 'MANAGER'].includes(session.user.role)) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const data = await request.json();
        const cityId = params.id;

        const city = await prisma.city.update({
            where: { id: cityId },
            data: {
                name: data.name,
                regionId: data.regionId,
                isActive: data.isActive,
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

        return NextResponse.json(city);
    } catch (error) {
        console.error('Error updating city:', error);
        return NextResponse.json(
            { error: 'Failed to update city' },
            { status: 500 }
        );
    }
}

// DELETE city
export async function DELETE(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user || !['ADMIN', 'SUPERADMIN', 'MANAGER'].includes(session.user.role)) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const cityId = params.id;

        await prisma.city.delete({
            where: { id: cityId },
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error deleting city:', error);
        return NextResponse.json(
            { error: 'Failed to delete city' },
            { status: 500 }
        );
    }
}
