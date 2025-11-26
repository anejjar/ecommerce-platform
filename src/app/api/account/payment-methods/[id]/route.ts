import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// DELETE remove payment method
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;

    // Verify payment method belongs to user
    const existingMethod = await prisma.paymentMethod.findFirst({
      where: { id, userId: session.user.id },
    });

    if (!existingMethod) {
      return NextResponse.json(
        { error: 'Payment method not found' },
        { status: 404 }
      );
    }

    await prisma.paymentMethod.delete({ where: { id } });

    // If this was the default, set another as default
    if (existingMethod.isDefault) {
      const firstMethod = await prisma.paymentMethod.findFirst({
        where: { userId: session.user.id },
      });

      if (firstMethod) {
        await prisma.paymentMethod.update({
          where: { id: firstMethod.id },
          data: { isDefault: true },
        });
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting payment method:', error);
    return NextResponse.json(
      { error: 'Failed to delete payment method' },
      { status: 500 }
    );
  }
}
