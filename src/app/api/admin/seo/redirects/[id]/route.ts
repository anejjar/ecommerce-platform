import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

const redirectUpdateSchema = z.object({
  fromPath: z.string().min(1).optional(),
  toPath: z.string().min(1).optional(),
  type: z.enum(['PERMANENT_301', 'TEMPORARY_302']).optional(),
  isActive: z.boolean().optional(),
  notes: z.string().optional(),
});

// GET - Fetch a single redirect
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !['ADMIN', 'SUPERADMIN'].includes(session.user.role)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;

    const redirect = await prisma.urlRedirect.findUnique({
      where: { id },
    });

    if (!redirect) {
      return NextResponse.json({ error: 'Redirect not found' }, { status: 404 });
    }

    return NextResponse.json(redirect);
  } catch (error) {
    console.error('Error fetching redirect:', error);
    return NextResponse.json(
      { error: 'Failed to fetch redirect' },
      { status: 500 }
    );
  }
}

// PATCH - Update a redirect
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !['ADMIN', 'SUPERADMIN'].includes(session.user.role)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;

    const body = await request.json();
    const validatedData = redirectUpdateSchema.parse(body);

    // If fromPath is being updated, check if it already exists
    if (validatedData.fromPath) {
      const fromPath = validatedData.fromPath.startsWith('/')
        ? validatedData.fromPath
        : `/${validatedData.fromPath}`;

      const existing = await prisma.urlRedirect.findFirst({
        where: {
          fromPath,
          id: { not: id },
        },
      });

      if (existing) {
        return NextResponse.json(
          { error: 'Another redirect already exists for this path' },
          { status: 400 }
        );
      }

      validatedData.fromPath = fromPath;
    }

    // Format toPath if provided
    if (validatedData.toPath) {
      validatedData.toPath = validatedData.toPath.startsWith('http')
        ? validatedData.toPath
        : validatedData.toPath.startsWith('/')
        ? validatedData.toPath
        : `/${validatedData.toPath}`;
    }

    const redirect = await prisma.urlRedirect.update({
      where: { id },
      data: validatedData,
    });

    return NextResponse.json(redirect);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid request data', details: error.errors },
        { status: 400 }
      );
    }

    console.error('Error updating redirect:', error);
    return NextResponse.json(
      { error: 'Failed to update redirect' },
      { status: 500 }
    );
  }
}

// DELETE - Delete a redirect
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !['ADMIN', 'SUPERADMIN'].includes(session.user.role)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;

    await prisma.urlRedirect.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting redirect:', error);
    return NextResponse.json(
      { error: 'Failed to delete redirect' },
      { status: 500 }
    );
  }
}
