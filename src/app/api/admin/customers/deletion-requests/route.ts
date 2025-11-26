import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);

        if (!session || !['ADMIN', 'SUPERADMIN'].includes(session.user.role)) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const requests = await prisma.accountDeletionRequest.findMany({
            where: {
                status: 'pending', // Only show pending requests
            },
            include: {
                user: {
                    select: {
                        name: true,
                        email: true,
                        image: true,
                    },
                },
            },
            orderBy: {
                requestedAt: 'desc',
            },
        });

        return NextResponse.json({ requests });
    } catch (error) {
        console.error('Error fetching deletion requests:', error);
        return NextResponse.json(
            { error: 'Failed to fetch deletion requests' },
            { status: 500 }
        );
    }
}
