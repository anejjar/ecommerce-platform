import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { sendEmail } from '@/lib/email';
import { adminNewReviewEmail } from '@/lib/email-templates';

// Get all reviews for a product
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const reviews = await prisma.review.findMany({
      where: { productId: id },
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

    return NextResponse.json(reviews);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch reviews' },
      { status: 500 }
    );
  }
}

// Create a review
export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Find user by email
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const json = await request.json();
    const { rating, title, comment } = json;

    // Check if user has already reviewed this product
    const existingReview = await prisma.review.findUnique({
      where: {
        userId_productId: {
          userId: user.id,
          productId: id,
        },
      },
    });

    if (existingReview) {
      return NextResponse.json(
        { error: 'You have already reviewed this product' },
        { status: 400 }
      );
    }

    // Check if user has purchased this product (for verified badge)
    const hasPurchased = await prisma.orderItem.findFirst({
      where: {
        productId: id,
        order: {
          userId: user.id,
          paymentStatus: 'PAID',
        },
      },
    });

    const review = await prisma.review.create({
      data: {
        userId: user.id,
        productId: id,
        rating: parseInt(rating),
        title,
        comment,
        verified: !!hasPurchased,
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

    // Get product details for admin notification
    const product = await prisma.product.findUnique({
      where: { id },
      select: { name: true },
    });

    // Send admin notification email
    try {
      const adminEmail = process.env.ADMIN_EMAIL;
      if (adminEmail && product) {
        await sendEmail({
          to: adminEmail,
          subject: `New Product Review - ${product.name}`,
          html: adminNewReviewEmail(
            {
              rating: review.rating,
              title: review.title,
              comment: review.comment,
              verified: review.verified,
              createdAt: review.createdAt,
            },
            product.name,
            review.user.name || review.user.email || 'Anonymous',
            review.id
          ),
        });
      }
    } catch (emailError) {
      console.error('Failed to send admin review notification:', emailError);
      // Don't fail the review submission if email fails
    }

    return NextResponse.json(review);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to create review' },
      { status: 500 }
    );
  }
}
