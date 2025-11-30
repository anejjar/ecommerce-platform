import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

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
