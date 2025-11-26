import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// PATCH set payment method as default
export async function PATCH(
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

    // Unset other defaults
    await prisma.paymentMethod.updateMany({
      where: { userId: session.user.id, isDefault: true },
      data: { isDefault: false },
    });

    // Set this as default
    const paymentMethod = await prisma.paymentMethod.update({
      where: { id },
      data: { isDefault: true },
      select: {
        id: true,
        type: true,
        cardLast4: true,
        cardBrand: true,
        cardExpMonth: true,
        cardExpYear: true,
        email: true,
        bankName: true,
        isDefault: true,
        createdAt: true,
      },
    });

    return NextResponse.json(paymentMethod);
  } catch (error) {
    console.error('Error setting default payment method:', error);
    return NextResponse.json(
      { error: 'Failed to set default payment method' },
      { status: 500 }
    );
  }
}
