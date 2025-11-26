import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// GET current user's communication preferences
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { communicationPreferences: true },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Parse JSON preferences or return defaults
    const preferences = user.communicationPreferences
      ? JSON.parse(user.communicationPreferences)
      : {
          emailMarketing: true,
          smsMarketing: false,
          orderUpdates: true,
          promotions: true,
          newsletter: true,
          productUpdates: false,
        };

    return NextResponse.json(preferences);
  } catch (error) {
    console.error('Error fetching preferences:', error);
    return NextResponse.json(
      { error: 'Failed to fetch preferences' },
      { status: 500 }
    );
  }
}

// PATCH update communication preferences
export async function PATCH(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const preferences = await request.json();

    // Validate preferences structure
    const validKeys = [
      'emailMarketing',
      'smsMarketing',
      'orderUpdates',
      'promotions',
      'newsletter',
      'productUpdates',
    ];

    const invalidKeys = Object.keys(preferences).filter(
      (key) => !validKeys.includes(key)
    );

    if (invalidKeys.length > 0) {
      return NextResponse.json(
        { error: `Invalid preference keys: ${invalidKeys.join(', ')}` },
        { status: 400 }
      );
    }

    // Validate all values are boolean
    const nonBooleanKeys = Object.entries(preferences)
      .filter(([_, value]) => typeof value !== 'boolean')
      .map(([key]) => key);

    if (nonBooleanKeys.length > 0) {
      return NextResponse.json(
        {
          error: `Preference values must be boolean: ${nonBooleanKeys.join(', ')}`,
        },
        { status: 400 }
      );
    }

    // Update user preferences
    await prisma.user.update({
      where: { id: session.user.id },
      data: {
        communicationPreferences: JSON.stringify(preferences),
      },
    });

    return NextResponse.json({
      success: true,
      preferences,
    });
  } catch (error) {
    console.error('Error updating preferences:', error);
    return NextResponse.json(
      { error: 'Failed to update preferences' },
      { status: 500 }
    );
  }
}
