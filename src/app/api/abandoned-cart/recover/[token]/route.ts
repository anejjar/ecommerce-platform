import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { isFeatureEnabled } from '@/lib/features';

interface CartItem {
  productId: string;
  variantId?: string | null;
  quantity: number;
  price: number;
  name?: string;
}

// Recover abandoned cart using recovery token
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ token: string }> }
) {
  try {
    // Check if feature is enabled
    const enabled = await isFeatureEnabled('abandoned_cart');
    if (!enabled) {
      return NextResponse.json(
        { error: 'Feature not available' },
        { status: 404 }
      );
    }

    const { token } = await params;

    // Find abandoned cart by recovery token
    const abandonedCart = await prisma.abandonedCart.findUnique({
      where: { recoveryToken: token },
      include: {
        user: true,
      },
    });

    if (!abandonedCart) {
      return NextResponse.json(
        { error: 'Invalid recovery token' },
        { status: 404 }
      );
    }

    // Check if already recovered
    if (abandonedCart.status === 'RECOVERED') {
      return NextResponse.json(
        { error: 'This cart has already been recovered' },
        { status: 400 }
      );
    }

    // Check if expired
    if (abandonedCart.status === 'EXPIRED') {
      return NextResponse.json(
        { error: 'This recovery link has expired' },
        { status: 400 }
      );
    }

    // Parse cart snapshot
    const cartItems: CartItem[] = JSON.parse(abandonedCart.cartSnapshot);

    // If user is logged in, restore items to their cart
    if (abandonedCart.userId) {
      // Get or create cart
      let cart = await prisma.cart.findUnique({
        where: { userId: abandonedCart.userId },
        include: { items: true },
      });

      if (!cart) {
        cart = await prisma.cart.create({
          data: {
            userId: abandonedCart.userId,
          },
          include: { items: true },
        });
      }

      // Add items back to cart (or update quantities if they already exist)
      for (const item of cartItems) {
        const existingCartItem = cart.items.find(
          (ci) =>
            ci.productId === item.productId &&
            ci.variantId === item.variantId
        );

        if (existingCartItem) {
          // Update quantity
          await prisma.cartItem.update({
            where: { id: existingCartItem.id },
            data: {
              quantity: existingCartItem.quantity + item.quantity,
            },
          });
        } else {
          // Create new cart item
          await prisma.cartItem.create({
            data: {
              cartId: cart.id,
              productId: item.productId,
              variantId: item.variantId,
              quantity: item.quantity,
            },
          });
        }
      }
    }

    // Mark abandoned cart as recovered
    const recoveredCart = await prisma.abandonedCart.update({
      where: { id: abandonedCart.id },
      data: {
        status: 'RECOVERED',
        recoveredAt: new Date(),
      },
    });

    return NextResponse.json({
      ...recoveredCart,
      message: 'Cart recovered successfully',
      redirectUrl: abandonedCart.userId ? '/cart' : '/checkout',
    });
  } catch (error) {
    console.error('Error recovering abandoned cart:', error);
    return NextResponse.json(
      { error: 'Failed to recover cart' },
      { status: 500 }
    );
  }
}
