import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;

    // Get the original order
    const originalOrder = await prisma.order.findUnique({
      where: { id },
      include: {
        items: {
          include: {
            product: true,
            variant: true,
          },
        },
      },
    });

    if (!originalOrder) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    // Verify order belongs to user
    if (originalOrder.userId !== session.user.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Get or create cart
    let cart = await prisma.cart.findUnique({
      where: { userId: session.user.id },
      include: { items: true },
    });

    if (!cart) {
      cart = await prisma.cart.create({
        data: { userId: session.user.id },
        include: { items: true },
      });
    }

    // Add items to cart
    let addedCount = 0;
    let outOfStockItems = [];

    for (const item of originalOrder.items) {
      // Check stock availability
      const product = await prisma.product.findUnique({
        where: { id: item.productId },
        select: { stock: true, published: true },
      });

      if (!product || !product.published) {
        outOfStockItems.push(item.product.name);
        continue;
      }

      // Check variant stock if applicable
      if (item.variantId) {
        const variant = await prisma.productVariant.findUnique({
          where: { id: item.variantId },
          select: { stock: true },
        });

        if (!variant || variant.stock < item.quantity) {
          outOfStockItems.push(`${item.product.name} (variant)`);
          continue;
        }
      } else if (product.stock < item.quantity) {
        outOfStockItems.push(item.product.name);
        continue;
      }

      // Check if item already in cart
      const existingCartItem = cart.items.find(
        (cartItem) =>
          cartItem.productId === item.productId &&
          cartItem.variantId === item.variantId
      );

      if (existingCartItem) {
        // Update quantity
        await prisma.cartItem.update({
          where: { id: existingCartItem.id },
          data: { quantity: existingCartItem.quantity + item.quantity },
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

      addedCount++;
    }

    return NextResponse.json({
      success: true,
      addedCount,
      outOfStockItems,
      message: `${addedCount} item(s) added to cart${
        outOfStockItems.length > 0
          ? `. ${outOfStockItems.length} item(s) unavailable: ${outOfStockItems.join(', ')}`
          : ''
      }`,
    });
  } catch (error) {
    console.error('Error reordering:', error);
    return NextResponse.json(
      { error: 'Failed to reorder items' },
      { status: 500 }
    );
  }
}
