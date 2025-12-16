import { NextRequest, NextResponse } from 'next/server';
import { hash } from 'bcryptjs';
import { prisma } from '@/lib/prisma';
import { sendEmail } from '@/lib/email';
import { welcomeEmail } from '@/lib/email-templates';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, password } = body;

    // Validation
    if (!name || !email || !password) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: 'Password must be at least 6 characters' },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: 'User with this email already exists' },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await hash(password, 12);

    // Create user
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: 'CUSTOMER',
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
      },
    });

    // Create loyalty account for new user
    try {
      const { generateReferralCode } = await import('@/lib/loyalty/referral-service');
      const bronzeTier = await prisma.loyaltyTier.findUnique({
        where: { name: 'Bronze' },
      });

      if (bronzeTier) {
        await prisma.customerLoyaltyAccount.create({
          data: {
            userId: user.id,
            tierId: bronzeTier.id,
            referralCode: generateReferralCode(),
          },
        });
        console.log(`Created loyalty account for new user ${user.id}`);
      }
    } catch (loyaltyError) {
      console.error('Failed to create loyalty account:', loyaltyError);
      // Don't fail signup if loyalty account fails
    }

    // Send welcome email
    try {
      await sendEmail({
        to: email,
        subject: 'Welcome to Our Store!',
        html: welcomeEmail(name),
      });
    } catch (emailError) {
      console.error('Failed to send welcome email:', emailError);
      // Don't fail signup if email fails
    }

    return NextResponse.json(
      { message: 'User created successfully', user },
      { status: 201 }
    );
  } catch (error) {
    console.error('Signup error:', error);
    return NextResponse.json(
      { error: 'Failed to create user' },
      { status: 500 }
    );
  }
}
