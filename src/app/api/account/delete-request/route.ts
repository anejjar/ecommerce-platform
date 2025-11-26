import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { sendEmail } from '@/lib/email';

// GET current deletion request status
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const deletionRequest = await prisma.accountDeletionRequest.findUnique({
      where: { userId: session.user.id },
    });

    if (!deletionRequest) {
      return NextResponse.json({ exists: false });
    }

    return NextResponse.json({
      exists: true,
      ...deletionRequest,
    });
  } catch (error) {
    console.error('Error fetching deletion request:', error);
    return NextResponse.json(
      { error: 'Failed to fetch deletion request' },
      { status: 500 }
    );
  }
}

// POST create account deletion request
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const data = await request.json();

    // Check if request already exists
    const existingRequest = await prisma.accountDeletionRequest.findUnique({
      where: { userId: session.user.id },
    });

    if (existingRequest && existingRequest.status !== 'cancelled') {
      return NextResponse.json(
        { error: 'Deletion request already exists' },
        { status: 400 }
      );
    }

    // Check for pending orders
    const pendingOrders = await prisma.order.count({
      where: {
        userId: session.user.id,
        status: { in: ['PENDING', 'PROCESSING', 'SHIPPED'] },
      },
    });

    if (pendingOrders > 0) {
      return NextResponse.json(
        {
          error: `Cannot delete account with ${pendingOrders} pending order(s). Please wait for orders to be delivered or cancelled.`,
        },
        { status: 400 }
      );
    }

    // Schedule deletion for 30 days from now (GDPR grace period)
    const scheduledAt = new Date();
    scheduledAt.setDate(scheduledAt.getDate() + 30);

    const deletionRequest = await prisma.accountDeletionRequest.create({
      data: {
        userId: session.user.id,
        reason: data.reason || null,
        status: 'pending',
        scheduledAt,
      },
      include: {
        user: true,
      },
    });

    // Notify Admin
    try {
      const adminEmail = process.env.ADMIN_EMAIL || 'admin@example.com';
      await sendEmail({
        to: adminEmail,
        subject: `[ACTION REQUIRED] Account Deletion Request: ${session.user.email}`,
        html: `
          <h2>New Account Deletion Request</h2>
          <p><strong>User:</strong> ${session.user.name || 'Unknown'} (${session.user.email})</p>
          <p><strong>Reason:</strong> ${data.reason || 'No reason provided'}</p>
          <p><strong>Requested At:</strong> ${new Date().toLocaleString()}</p>
          <p><strong>Scheduled Deletion:</strong> ${scheduledAt.toLocaleDateString()}</p>
          <br/>
          <p>
            <a href="${process.env.NEXT_PUBLIC_APP_URL}/admin/customers/deletion-requests" style="background-color: #ef4444; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">
              Manage Request
            </a>
          </p>
        `,
      });
    } catch (emailError) {
      console.error('Failed to send admin notification:', emailError);
      // Don't fail the request if email fails
    }

    return NextResponse.json(deletionRequest, { status: 201 });
  } catch (error) {
    console.error('Error creating deletion request:', error);
    return NextResponse.json(
      { error: 'Failed to create deletion request' },
      { status: 500 }
    );
  }
}

// DELETE cancel account deletion request
export async function DELETE() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const deletionRequest = await prisma.accountDeletionRequest.findUnique({
      where: { userId: session.user.id },
    });

    if (!deletionRequest) {
      return NextResponse.json(
        { error: 'No deletion request found' },
        { status: 404 }
      );
    }

    if (deletionRequest.status === 'completed') {
      return NextResponse.json(
        { error: 'Cannot cancel completed deletion' },
        { status: 400 }
      );
    }

    await prisma.accountDeletionRequest.update({
      where: { userId: session.user.id },
      data: { status: 'cancelled' },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error cancelling deletion request:', error);
    return NextResponse.json(
      { error: 'Failed to cancel deletion request' },
      { status: 500 }
    );
  }
}
