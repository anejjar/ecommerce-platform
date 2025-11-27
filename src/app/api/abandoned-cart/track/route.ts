import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { isFeatureEnabled } from '@/lib/features';
import { randomBytes } from 'crypto';

interface CartItem {
  productId: string;
  variantId?: string | null;
  quantity: number;
  price: number;
  name?: string;
}

interface TrackAbandonedCartRequest {
  userId?: string;
  cartId?: string;
  guestEmail?: string;
  guestName?: string;
  cartItems?: CartItem[];
}

// Generate unique recovery token
function generateRecoveryToken(): string {
  return randomBytes(32).toString('hex');
}

// Track abandoned cart
export async function POST(request: NextRequest) {
  try {
    // Check if feature is enabled
    const enabled = await isFeatureEnabled('abandoned_cart');
    if (!enabled) {
      return NextResponse.json(
        { error: 'Feature not available' },
        { status: 404 }
      );
    }

    const body: TrackAbandonedCartRequest = await request.json();
    const { userId, cartId, guestEmail, guestName, cartItems } = body;

    // Validate request
    if (!userId && !guestEmail) {
      return NextResponse.json(
        { error: 'Either userId or guestEmail is required' },
        { status: 400 }
      );
    }

    let cartSnapshot: CartItem[] = [];
    let totalValue = 0;

    // Get cart data
    if (cartId) {
      // Fetch cart from database
      const cart = await prisma.cart.findUnique({
        where: { id: cartId },
        include: {
          items: {
            include: {
              product: true,
              variant: true,
            },
          },
        },
      });

      if (cart) {
        cartSnapshot = cart.items.map((item) => ({
          productId: item.productId,
          variantId: item.variantId,
          quantity: item.quantity,
          price: Number(item.variant?.price || item.product.price),
          name: item.product.name,
        }));

        totalValue = cartSnapshot.reduce(
          (sum, item) => sum + item.price * item.quantity,
          0
        );
      }
    } else if (cartItems) {
      // Use provided cart items (for guest users)
      cartSnapshot = cartItems;
      totalValue = cartItems.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
      );
    } else {
      return NextResponse.json(
        { error: 'Either cartId or cartItems is required' },
        { status: 400 }
      );
    }

    // Check for existing abandoned cart
    const existingAbandoned = await prisma.abandonedCart.findFirst({
      where: {
        OR: [
          userId ? { userId, status: 'ABANDONED' as const } : {},
          guestEmail ? { guestEmail, status: 'ABANDONED' as const } : {},
        ].filter(obj => Object.keys(obj).length > 0) as any,
      },
    });

    let abandonedCart;

    if (existingAbandoned) {
      // Update existing abandoned cart
      abandonedCart = await prisma.abandonedCart.update({
        where: { id: existingAbandoned.id },
        data: {
          cartSnapshot: JSON.stringify(cartSnapshot),
          totalValue,
          abandonedAt: new Date(),
          updatedAt: new Date(),
        },
      });
    } else {
      // Create new abandoned cart
      const recoveryToken = generateRecoveryToken();

      abandonedCart = await prisma.abandonedCart.create({
        data: {
          userId: userId || null,
          guestEmail: guestEmail || null,
          guestName: guestName || null,
          cartSnapshot: JSON.stringify(cartSnapshot),
          totalValue,
          status: 'ABANDONED',
          recoveryToken,
          abandonedAt: new Date(),
        },
      });
    }

    return NextResponse.json(abandonedCart, {
      status: existingAbandoned ? 200 : 201,
    });
  } catch (error) {
    console.error('Error tracking abandoned cart:', error);
    return NextResponse.json(
      { error: 'Failed to track abandoned cart' },
      { status: 500 }
    );
  }
}
