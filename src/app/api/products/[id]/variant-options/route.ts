import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// Get all variant options for a product
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const options = await prisma.variantOption.findMany({
      where: { productId: id },
      include: {
        values: {
          orderBy: { position: 'asc' },
        },
      },
      orderBy: { position: 'asc' },
    });

    return NextResponse.json(options);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch variant options' },
      { status: 500 }
    );
  }
}

// Create a new variant option
export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const json = await request.json();
    const { name, values } = json;

    // Get the next position
    const lastOption = await prisma.variantOption.findFirst({
      where: { productId: id },
      orderBy: { position: 'desc' },
    });

    const position = lastOption ? lastOption.position + 1 : 0;

    const option = await prisma.variantOption.create({
      data: {
        productId: id,
        name,
        position,
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
      { error: 'Failed to create variant option' },
      { status: 500 }
    );
  }
}
