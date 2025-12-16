import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { sendEmail } from '@/lib/email';
import { adminNewReviewEmail } from '@/lib/email-templates';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    const reviews = await prisma.review.findMany({
      where: {
        productId: id,
      },
      include: {
        user: {
          select: {
            name: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    // Format reviews for frontend
    const formattedReviews = reviews.map(review => ({
      id: review.id,
      rating: review.rating,
      title: review.title,
      comment: review.comment,
      authorName: review.user?.name || 'Anonymous',
      createdAt: review.createdAt.toISOString(),
      verifiedPurchase: review.verifiedPurchase,
    }));

    return NextResponse.json(formattedReviews);
  } catch (error) {
    console.error('Error fetching product reviews:', error);
    return NextResponse.json(
      { error: 'Failed to fetch product reviews' },
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

    if (!session || !session.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id: productId } = await params;
    const body = await request.json();
    const { rating, title, comment } = body;

    // Validation
    if (!rating || rating < 1 || rating > 5) {
      return NextResponse.json(
        { error: 'Rating must be between 1 and 5' },
        { status: 400 }
      );
    }

    // Get user
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Get product
    const product = await prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    // Check if user has already reviewed this product
    const existingReview = await prisma.review.findFirst({
      where: {
        productId,
        userId: user.id,
      },
    });

    if (existingReview) {
      return NextResponse.json(
        { error: 'You have already reviewed this product' },
        { status: 400 }
      );
    }

    // Check if user has purchased this product (for verified purchase badge)
    const hasPurchased = await prisma.orderItem.findFirst({
      where: {
        productId,
        order: {
          userId: user.id,
          status: 'DELIVERED',
        },
      },
    });

    // Create review
    const review = await prisma.review.create({
      data: {
        rating,
        title: title || null,
        comment: comment || null,
        productId,
        userId: user.id,
        verifiedPurchase: !!hasPurchased,
      },
    });

    // Award loyalty points for the review
    try {
      const loyaltyAccount = await prisma.customerLoyaltyAccount.findUnique({
        where: { userId: user.id },
      });

      if (loyaltyAccount) {
        const settings = await prisma.loyaltySettings.findFirst();
        if (settings && settings.pointsPerReview > 0) {
          const { calculateExpirationDate } = await import('@/lib/loyalty/points-expiration');
          const expiresAt = calculateExpirationDate(settings.pointsExpirationDays);

          // Create transaction and update balance
          await prisma.$transaction([
            prisma.loyaltyPointsTransaction.create({
              data: {
                accountId: loyaltyAccount.id,
                type: 'REVIEW',
                points: settings.pointsPerReview,
                description: `Product review: ${product.name}`,
                referenceType: 'review',
                referenceId: review.id,
                expiresAt,
              },
            }),
            prisma.customerLoyaltyAccount.update({
              where: { id: loyaltyAccount.id },
              data: {
                pointsBalance: {
                  increment: settings.pointsPerReview,
                },
                lifetimePoints: {
                  increment: settings.pointsPerReview,
                },
                lastActivityAt: new Date(),
              },
            }),
          ]);

          // Check for tier upgrade
          const { checkTierUpgrade } = await import('@/lib/loyalty/tier-manager');
          await checkTierUpgrade(loyaltyAccount.id);

          console.log(
            `Awarded ${settings.pointsPerReview} loyalty points to user ${user.id} for review on product ${productId}`
          );
        }
      }
    } catch (loyaltyError) {
      console.error('Failed to award loyalty points for review:', loyaltyError);
      // Don't fail the review submission if loyalty points fail
    }

    // Send admin notification
    try {
      const adminEmail = process.env.ADMIN_EMAIL;
      if (adminEmail) {
        await sendEmail({
          to: adminEmail,
          subject: `New Review: ${product.name}`,
          html: adminNewReviewEmail(
            {
              rating: review.rating,
              title: review.title,
              comment: review.comment,
              verified: review.verifiedPurchase,
              createdAt: review.createdAt,
            },
            product.name,
            user.name || user.email
          ),
        });
      }
    } catch (emailError) {
      console.error('Failed to send admin review notification:', emailError);
    }

    return NextResponse.json(
      {
        message: 'Review submitted successfully',
        review: {
          id: review.id,
          rating: review.rating,
          title: review.title,
          comment: review.comment,
          verifiedPurchase: review.verifiedPurchase,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating product review:', error);
    return NextResponse.json(
      { error: 'Failed to create product review' },
      { status: 500 }
    );
  }
}
