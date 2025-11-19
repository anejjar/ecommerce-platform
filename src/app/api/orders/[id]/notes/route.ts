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

    const notes = await prisma.orderNote.findMany({
      where: { orderId: id },
      include: {
        user: {
          select: {
            name: true,
            email: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json(notes);
  } catch (error) {
    console.error('Failed to fetch notes:', error);
    return NextResponse.json(
      { error: 'Failed to fetch notes' },
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
    const { note, isInternal } = body;

    // Ensure the session user still exists in the database. Try lookup by
    // id first; if not found, fall back to email (helps if sessions carry
    // an out-of-date id but email is still available).
    let dbUser = await prisma.user.findUnique({ where: { id: session.user.id } });
    if (!dbUser && session.user?.email) {
      const fallback = await prisma.user.findUnique({ where: { email: session.user.email } });
      if (fallback) {
        console.warn(
          'Session user id not found; falling back to user found by email',
          { sessionId: session.user.id, email: session.user.email, fallbackId: fallback.id }
        );
        dbUser = fallback;
      }
    }

    if (!dbUser) {
      console.error('Session user not found in database:', session.user.id);
      return NextResponse.json({ error: 'Session user not found' }, { status: 400 });
    }

    if (!note || !note.trim()) {
      return NextResponse.json(
        { error: 'Note content is required' },
        { status: 400 }
      );
    }

    const orderNote = await prisma.orderNote.create({
      data: {
        note: note.trim(),
        isInternal: isInternal ?? true,
        orderId: id,
        userId: dbUser.id,
      },
      include: {
        user: {
          select: {
            name: true,
            email: true,
          },
        },
      },
    });

    return NextResponse.json(orderNote);
  } catch (error) {
    console.error('Failed to create note:', error);
    return NextResponse.json(
      { error: 'Failed to create note' },
      { status: 500 }
    );
  }
}
