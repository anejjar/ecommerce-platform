import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { isFeatureEnabled } from '@/lib/features';
import { sendEmail } from '@/lib/email';
import {
  refundApprovedEmailCustomer,
  refundRejectedEmailCustomer,
  refundCompletedEmailCustomer,
} from '@/lib/email-templates';

// Update refund status (admin only)
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Check if feature is enabled
    const enabled = await isFeatureEnabled('refund_management');
    if (!enabled) {
      return NextResponse.json(
        { error: 'Feature not available' },
        { status: 404 }
      );
    }

    const session = await getServerSession(authOptions);

    if (!session || (session.user.role !== 'ADMIN' && session.user.role !== 'SUPERADMIN')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const { id } = await params;
    const body = await request.json();
    const { status, adminNotes } = body;

    const refund = await prisma.refund.findUnique({
      where: { id },
      include: {
        order: {
          include: {
            items: true,
          },
        },
        requestedBy: true,
        refundItems: true,
      },
    });

    if (!refund) {
      return NextResponse.json({ error: 'Refund not found' }, { status: 404 });
    }

    const previousStatus = refund.status;

    // Update refund
    const updatedRefund = await prisma.refund.update({
      where: { id },
      data: {
        status,
        adminNotes: adminNotes || refund.adminNotes,
        processedById: user.id,
        processedAt: status !== 'PENDING' ? new Date() : null,
      },
      include: {
        order: true,
        requestedBy: true,
        processedBy: true,
        refundItems: true,
      },
    });

    // Handle stock restoration if approved and restock is enabled
    if (status === 'APPROVED' && refund.restockItems && previousStatus === 'PENDING') {
      for (const refundItem of refund.refundItems) {
        if (refundItem.variantId) {
          // Restore variant stock
          await prisma.$transaction([
            prisma.productVariant.update({
              where: { id: refundItem.variantId },
              data: {
                stock: {
                  increment: refundItem.quantity,
                },
              },
            }),
            prisma.product.update({
              where: { id: refundItem.productId },
              data: {
                stock: {
                  increment: refundItem.quantity,
                },
              },
            }),
          ]);
        } else {
          // Restore product stock
          await prisma.product.update({
            where: { id: refundItem.productId },
            data: {
              stock: {
                increment: refundItem.quantity,
              },
            },
          });
        }
      }
    }

    // Update order payment status if refund is completed
    if (status === 'COMPLETED') {
      await prisma.order.update({
        where: { id: refund.orderId },
        data: {
          paymentStatus: 'REFUNDED',
        },
      });
    }

    // Send email notifications
    const customerEmail = refund.requestedBy.email;
    const orderNumber = refund.order.orderNumber;

    try {
      if (status === 'APPROVED' && previousStatus === 'PENDING') {
        await sendEmail({
          to: customerEmail,
          subject: `Refund Approved - ${refund.rmaNumber}`,
          html: refundApprovedEmailCustomer(
            orderNumber,
            refund.rmaNumber,
            refund.refundAmount.toString()
          ),
        });
      } else if (status === 'REJECTED') {
        await sendEmail({
          to: customerEmail,
          subject: `Refund Request Update - ${refund.rmaNumber}`,
          html: refundRejectedEmailCustomer(
            orderNumber,
            refund.rmaNumber,
            adminNotes || 'Your refund request has been reviewed.'
          ),
        });
      } else if (status === 'COMPLETED' && previousStatus !== 'COMPLETED') {
        await sendEmail({
          to: customerEmail,
          subject: `Refund Completed - ${refund.rmaNumber}`,
          html: refundCompletedEmailCustomer(
            orderNumber,
            refund.rmaNumber,
            refund.refundAmount.toString()
          ),
        });
      }
    } catch (emailError) {
      console.error('Failed to send refund status email:', emailError);
    }

    return NextResponse.json(updatedRefund);
  } catch (error) {
    console.error('Error updating refund:', error);
    return NextResponse.json(
      { error: 'Failed to update refund' },
      { status: 500 }
    );
  }
}

// Delete refund (admin only)
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Check if feature is enabled
    const enabled = await isFeatureEnabled('refund_management');
    if (!enabled) {
      return NextResponse.json(
        { error: 'Feature not available' },
        { status: 404 }
      );
    }

    const session = await getServerSession(authOptions);

    if (!session || (session.user.role !== 'ADMIN' && session.user.role !== 'SUPERADMIN')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;

    await prisma.refund.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting refund:', error);
    return NextResponse.json(
      { error: 'Failed to delete refund' },
      { status: 500 }
    );
  }
}
