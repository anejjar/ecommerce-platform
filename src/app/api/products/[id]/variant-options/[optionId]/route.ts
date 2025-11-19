import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// Update a variant option
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string; optionId: string }> }
) {
  try {
    const { optionId } = await params;
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const json = await request.json();
    const { name, values } = json;

    // Delete existing values and create new ones
    await prisma.variantOptionValue.deleteMany({
      where: { optionId },
    });

    const option = await prisma.variantOption.update({
      where: { id: optionId },
      data: {
        name,
        values: {
          create: values.map((value: string, index: number) => ({
            value,
            position: index,
          })),
        },
      },
      include: {
        values: true,
      },
    });

    return NextResponse.json(option);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to update variant option' },
      { status: 500 }
    );
  }
}

// Delete a variant option
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string; optionId: string }> }
) {
  try {
    const { optionId } = await params;
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await prisma.variantOption.delete({
      where: { id: optionId },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to delete variant option' },
      { status: 500 }
    );
  }
}
