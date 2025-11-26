import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// GET all payment methods for current user
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const paymentMethods = await prisma.paymentMethod.findMany({
      where: { userId: session.user.id },
      orderBy: [{ isDefault: 'desc' }, { createdAt: 'desc' }],
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
        // NEVER send providerToken to client
      },
    });

    return NextResponse.json(paymentMethods);
  } catch (error) {
    console.error('Error fetching payment methods:', error);
    return NextResponse.json(
      { error: 'Failed to fetch payment methods' },
      { status: 500 }
    );
  }
}

// POST create new payment method
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const data = await request.json();

    // Validate required fields
    if (!data.provider || !data.providerToken || !data.type) {
      return NextResponse.json(
        { error: 'Missing required fields: provider, providerToken, type' },
        { status: 400 }
      );
    }

    // If this is set as default, unset other defaults
    if (data.isDefault) {
      await prisma.paymentMethod.updateMany({
        where: { userId: session.user.id, isDefault: true },
        data: { isDefault: false },
      });
    }

    // If this is the first payment method, make it default
    const methodCount = await prisma.paymentMethod.count({
      where: { userId: session.user.id },
    });

    const paymentMethod = await prisma.paymentMethod.create({
      data: {
        userId: session.user.id,
        provider: data.provider,
        providerToken: data.providerToken, // Tokenized card data from Stripe/PayPal
        type: data.type,
        cardLast4: data.cardLast4 || null,
        cardBrand: data.cardBrand || null,
        cardExpMonth: data.cardExpMonth || null,
        cardExpYear: data.cardExpYear || null,
        email: data.email || null,
        bankName: data.bankName || null,
        isDefault: data.isDefault ?? (methodCount === 0),
      },
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
        // NEVER send providerToken to client
      },
    });

    return NextResponse.json(paymentMethod, { status: 201 });
  } catch (error) {
    console.error('Error creating payment method:', error);
    return NextResponse.json(
      { error: 'Failed to create payment method' },
      { status: 500 }
    );
  }
}
