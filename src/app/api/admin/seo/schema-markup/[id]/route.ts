import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

const schemaMarkupUpdateSchema = z.object({
  name: z.string().min(1).optional(),
  type: z
    .enum([
      'ORGANIZATION',
      'PRODUCT',
      'BREADCRUMB',
      'FAQ',
      'ARTICLE',
      'REVIEW',
      'LOCAL_BUSINESS',
      'EVENT',
      'RECIPE',
      'VIDEO',
    ])
    .optional(),
  isActive: z.boolean().optional(),
  schemaData: z.string().optional(),
  applyToAll: z.boolean().optional(),
  targetPages: z.string().optional(),
  priority: z.number().optional(),
});

// GET - Fetch a single schema markup
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const session = await getServerSession(authOptions);

    if (!session || !['ADMIN', 'SUPERADMIN'].includes(session.user.role)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const schemaMarkup = await prisma.schemaMarkup.findUnique({
      where: { id },
    });

    if (!schemaMarkup) {
      return NextResponse.json(
        { error: 'Schema markup not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(schemaMarkup);
  } catch (error) {
    console.error('Error fetching schema markup:', error);
    return NextResponse.json(
      { error: 'Failed to fetch schema markup' },
      { status: 500 }
    );
  }
}

// PATCH - Update a schema markup
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const session = await getServerSession(authOptions);

    if (!session || !['ADMIN', 'SUPERADMIN'].includes(session.user.role)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const validatedData = schemaMarkupUpdateSchema.parse(body);

    // Validate JSON structure if schemaData is provided
    if (validatedData.schemaData) {
      try {
        JSON.parse(validatedData.schemaData);
      } catch {
        return NextResponse.json(
          { error: 'Invalid JSON in schemaData' },
          { status: 400 }
        );
      }
    }

    // Validate targetPages if provided
    if (validatedData.targetPages) {
      try {
        JSON.parse(validatedData.targetPages);
      } catch {
        return NextResponse.json(
          { error: 'Invalid JSON in targetPages' },
          { status: 400 }
        );
      }
    }

    const schemaMarkup = await prisma.schemaMarkup.update({
      where: { id },
      data: validatedData,
    });

    return NextResponse.json(schemaMarkup);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid request data', details: error.issues },
        { status: 400 }
      );
    }

    console.error('Error updating schema markup:', error);
    return NextResponse.json(
      { error: 'Failed to update schema markup' },
      { status: 500 }
    );
  }
}

// DELETE - Delete a schema markup
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const session = await getServerSession(authOptions);

    if (!session || !['ADMIN', 'SUPERADMIN'].includes(session.user.role)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await prisma.schemaMarkup.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting schema markup:', error);
    return NextResponse.json(
      { error: 'Failed to delete schema markup' },
      { status: 500 }
    );
  }
}
