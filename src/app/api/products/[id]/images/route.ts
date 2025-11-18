import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const images = await prisma.productImage.findMany({
      where: {
        productId: id,
      },
      orderBy: {
        position: 'asc',
      },
    });

    return NextResponse.json(images);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch images' },
      { status: 500 }
    );
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();
    const { url, alt } = body;

    // Get the highest position
    const lastImage = await prisma.productImage.findFirst({
      where: { productId: id },
      orderBy: { position: 'desc' },
    });

    const position = lastImage ? lastImage.position + 1 : 0;

    const image = await prisma.productImage.create({
      data: {
        url,
        alt: alt || '',
        position,
        productId: id,
      },
    });

    return NextResponse.json(image);
  } catch (error) {
    console.error('Error adding image:', error);
    return NextResponse.json(
      { error: 'Failed to add image' },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { images } = body; // Array of { id, position }

    // Update positions
    await Promise.all(
      images.map((img: { id: string; position: number }) =>
        prisma.productImage.update({
          where: { id: img.id },
          data: { position: img.position },
        })
      )
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating image positions:', error);
    return NextResponse.json(
      { error: 'Failed to update image positions' },
      { status: 500 }
    );
  }
}
