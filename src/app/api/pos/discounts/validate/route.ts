import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !['ADMIN', 'SUPERADMIN', 'MANAGER'].includes(session.user.role)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { code, subtotal } = body;

    if (!code) {
      return NextResponse.json({ error: 'Code is required' }, { status: 400 });
    }

    const discount = await prisma.discountCode.findUnique({
      where: { code: code.toUpperCase() },
    });

    if (!discount) {
      return NextResponse.json({ error: 'Invalid discount code' }, { status: 404 });
    }

    if (!discount.isActive) {
      return NextResponse.json({ error: 'Discount code is inactive' }, { status: 400 });
    }

    const now = new Date();
    if (discount.startDate > now) {
      return NextResponse.json({ error: 'Discount code is not yet active' }, { status: 400 });
    }

    if (discount.endDate && discount.endDate < now) {
      return NextResponse.json({ error: 'Discount code has expired' }, { status: 400 });
    }

    if (discount.maxUses && discount.usedCount >= discount.maxUses) {
      return NextResponse.json({ error: 'Discount code usage limit reached' }, { status: 400 });
    }

    const total = parseFloat(subtotal.toString());
    if (discount.minOrderAmount && total < parseFloat(discount.minOrderAmount.toString())) {
      return NextResponse.json(
        { error: `Minimum order amount of $${discount.minOrderAmount} required` },
        { status: 400 }
      );
    }

    // Calculate discount amount
    let discountAmount = 0;
    if (discount.type === 'PERCENTAGE') {
      discountAmount = (total * parseFloat(discount.value.toString())) / 100;
    } else {
      discountAmount = parseFloat(discount.value.toString());
    }

    // Ensure discount doesn't exceed total
    discountAmount = Math.min(discountAmount, total);

    return NextResponse.json({
      id: discount.id,
      code: discount.code,
      type: discount.type,
      value: discount.value.toString(),
      discountAmount: discountAmount.toFixed(2),
      minOrderAmount: discount.minOrderAmount?.toString() || null,
    });
  } catch (error) {
    console.error('Error validating discount:', error);
    return NextResponse.json(
      { error: 'Failed to validate discount' },
      { status: 500 }
    );
  }
}

