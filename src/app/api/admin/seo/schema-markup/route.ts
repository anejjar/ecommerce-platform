import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

const schemaMarkupSchema = z.object({
  name: z.string().min(1),
  type: z.enum([
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
  ]),
  isActive: z.boolean().optional(),
  schemaData: z.string().min(1), // JSON string
  applyToAll: z.boolean().optional(),
  targetPages: z.string().optional(), // JSON array string
  priority: z.number().optional(),
});

// GET - Fetch all schema markups
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !['ADMIN', 'SUPERADMIN'].includes(session.user.role)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const searchParams = request.nextUrl.searchParams;
    const isActive = searchParams.get('isActive');
    const type = searchParams.get('type');

    const where: any = {};
    if (isActive !== null) {
      where.isActive = isActive === 'true';
    }
    if (type) {
      where.type = type;
    }

    const schemaMarkups = await prisma.schemaMarkup.findMany({
      where,
      orderBy: [{ priority: 'desc' }, { createdAt: 'desc' }],
    });

    return NextResponse.json(schemaMarkups);
  } catch (error) {
    console.error('Error fetching schema markups:', error);
    return NextResponse.json(
      { error: 'Failed to fetch schema markups' },
      { status: 500 }
    );
  }
}

// POST - Create a new schema markup
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !['ADMIN', 'SUPERADMIN'].includes(session.user.role)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const validatedData = schemaMarkupSchema.parse(body);

    // Validate JSON structure
    try {
      JSON.parse(validatedData.schemaData);
    } catch {
      return NextResponse.json(
        { error: 'Invalid JSON in schemaData' },
        { status: 400 }
      );
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

    const schemaMarkup = await prisma.schemaMarkup.create({
      data: {
        name: validatedData.name,
        type: validatedData.type,
        isActive: validatedData.isActive ?? true,
        schemaData: validatedData.schemaData,
        applyToAll: validatedData.applyToAll ?? false,
        targetPages: validatedData.targetPages,
        priority: validatedData.priority ?? 0,
      },
    });

    return NextResponse.json(schemaMarkup, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid request data', details: error.issues },
        { status: 400 }
      );
    }

    console.error('Error creating schema markup:', error);
    return NextResponse.json(
      { error: 'Failed to create schema markup' },
      { status: 500 }
    );
  }
}
