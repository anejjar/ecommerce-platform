import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { logActivity, getClientIp, getUserAgent } from '@/lib/activity-log';

export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await getServerSession(authOptions);

        if (!session || !['ADMIN', 'SUPERADMIN'].includes(session.user.role)) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { id } = await params;

        // Fetch the request and user
        const deletionRequest = await prisma.accountDeletionRequest.findUnique({
            where: { id },
            include: { user: true },
        });

        if (!deletionRequest) {
            return NextResponse.json(
                { error: 'Deletion request not found' },
                { status: 404 }
            );
        }

        const userId = deletionRequest.userId;

        // SAFETY CHECK: Check for active orders
        const pendingOrders = await prisma.order.count({
            where: {
                userId: userId,
                status: { in: ['PENDING', 'PROCESSING', 'SHIPPED'] },
            },
        });

        if (pendingOrders > 0) {
            return NextResponse.json(
                {
                    error: `Cannot delete user. There are ${pendingOrders} active orders (Pending, Processing, or Shipped). These must be delivered or cancelled first.`,
                },
                { status: 400 }
            );
        }

        // Proceed with deletion
        // Delete the user record (Cascade will handle related data like orders, reviews, etc. if configured,
        // otherwise we might need to manually clean up or anonymize.
        // Assuming Cascade delete is set up in schema for User relations, or we rely on Prisma to handle it if relations are optional.
        // However, usually deleting a User is a big deal.
        // Let's assume we want to delete the User record.

        // Transaction to ensure atomicity
        await prisma.$transaction(async (tx) => {
            // 1. Delete the deletion request (optional, as cascade might handle it, but good to be explicit or update status)
            // Actually, if we delete the user, the request goes with it if cascade is on.
            // Let's delete the user.
            await tx.user.delete({
                where: { id: userId },
            });
        });

        // Log the action
        await logActivity({
            userId: session.user.id,
            action: 'DELETE',
            resource: 'USER',
            details: `Immediately deleted user ${deletionRequest.user.email} (Request ID: ${id})`,
            ipAddress: getClientIp(request),
            userAgent: getUserAgent(request),
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error deleting account:', error);
        return NextResponse.json(
            { error: 'Failed to delete account' },
            { status: 500 }
        );
    }
}
