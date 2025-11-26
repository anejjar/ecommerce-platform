import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

const redirectSchema = z.object({
  fromPath: z.string().min(1),
  toPath: z.string().min(1),
  type: z.enum(['PERMANENT_301', 'TEMPORARY_302']),
  isActive: z.boolean().optional(),
  notes: z.string().optional(),
});

// GET - Fetch all redirects
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !['ADMIN', 'SUPERADMIN'].includes(session.user.role)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const redirects = await prisma.urlRedirect.findMany({
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(redirects);
  } catch (error) {
    console.error('Error fetching redirects:', error);
    return NextResponse.json(
      { error: 'Failed to fetch redirects' },
      { status: 500 }
    );
  }
}

// POST - Create a new redirect
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !['ADMIN', 'SUPERADMIN'].includes(session.user.role)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const validatedData = redirectSchema.parse(body);

    // Ensure fromPath starts with /
    const fromPath = validatedData.fromPath.startsWith('/')
      ? validatedData.fromPath
      : `/${validatedData.fromPath}`;

    // Ensure toPath starts with / or is a full URL
    const toPath = validatedData.toPath.startsWith('http')
      ? validatedData.toPath
      : validatedData.toPath.startsWith('/')
      ? validatedData.toPath
      : `/${validatedData.toPath}`;

    // Check if redirect already exists
    const existing = await prisma.urlRedirect.findUnique({
      where: { fromPath },
    });

    if (existing) {
      return NextResponse.json(
        { error: 'Redirect already exists for this path' },
        { status: 400 }
      );
    }

    const redirect = await prisma.urlRedirect.create({
      data: {
        fromPath,
        toPath,
        type: validatedData.type,
        isActive: validatedData.isActive ?? true,
        notes: validatedData.notes,
        createdById: session.user.id,
      },
    });

    return NextResponse.json(redirect, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid request data', details: error.errors },
        { status: 400 }
      );
    }

    console.error('Error creating redirect:', error);
    return NextResponse.json(
      { error: 'Failed to create redirect' },
      { status: 500 }
    );
  }
}
