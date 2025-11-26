import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// PATCH update address
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
    const data = await request.json();

    // Verify address belongs to user
    const existingAddress = await prisma.address.findFirst({
      where: { id, userId: session.user.id },
    });

    if (!existingAddress) {
      return NextResponse.json(
        { error: 'Address not found' },
        { status: 404 }
      );
    }

    // If setting as default, unset other defaults
    if (data.isDefault) {
      await prisma.address.updateMany({
        where: { userId: session.user.id, isDefault: true, id: { not: id } },
        data: { isDefault: false },
      });
    }

    const address = await prisma.address.update({
      where: { id },
      data: {
        firstName: data.firstName,
        lastName: data.lastName,
        company: data.company,
        address1: data.address1,
        address2: data.address2,
        city: data.city,
        state: data.state,
        postalCode: data.postalCode,
        country: data.country,
        phone: data.phone,
        isDefault: data.isDefault,
      },
    });

    return NextResponse.json(address);
  } catch (error) {
    console.error('Error updating address:', error);
    return NextResponse.json(
      { error: 'Failed to update address' },
      { status: 500 }
    );
  }
}

// DELETE remove address
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

    // Verify address belongs to user
    const existingAddress = await prisma.address.findFirst({
      where: { id, userId: session.user.id },
    });

    if (!existingAddress) {
      return NextResponse.json(
        { error: 'Address not found' },
        { status: 404 }
      );
    }

    // Check if address is being used by any orders
    const ordersUsingAddress = await prisma.order.count({
      where: {
        OR: [{ shippingAddressId: id }, { billingAddressId: id }],
      },
    });

    if (ordersUsingAddress > 0) {
      return NextResponse.json(
        { error: 'Cannot delete address used in orders' },
        { status: 400 }
      );
    }

    await prisma.address.delete({ where: { id } });

    // If this was the default address, set another as default
    if (existingAddress.isDefault) {
      const firstAddress = await prisma.address.findFirst({
        where: { userId: session.user.id },
      });

      if (firstAddress) {
        await prisma.address.update({
          where: { id: firstAddress.id },
          data: { isDefault: true },
        });
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting address:', error);
    return NextResponse.json(
      { error: 'Failed to delete address' },
      { status: 500 }
    );
  }
}
