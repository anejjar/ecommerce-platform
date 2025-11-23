import { describe, it, expect, beforeEach, vi } from 'vitest';
import { prisma } from '@/lib/prisma';

describe('/api/abandoned-cart/track', () => {
  beforeEach(async () => {
    // Clean up test data
    await prisma.abandonedCartEmail.deleteMany();
    await prisma.abandonedCart.deleteMany();
    await prisma.cartItem.deleteMany();
    await prisma.cart.deleteMany();
  });

  describe('POST /api/abandoned-cart/track', () => {
    it('should track abandoned cart for logged-in user', async () => {
      // Given: A user with items in cart
      const user = await prisma.user.create({
        data: {
          email: 'test@example.com',
          name: 'Test User',
        },
      });

      const product = await prisma.product.create({
        data: {
          name: 'Test Product',
          slug: 'test-product',
          price: 99.99,
          stock: 10,
        },
      });

      const cart = await prisma.cart.create({
        data: {
          userId: user.id,
          items: {
            create: [
              {
                productId: product.id,
                quantity: 2,
              },
            ],
          },
        },
        include: {
          items: {
            include: {
              product: true,
            },
          },
        },
      });

      // When: Cart is abandoned (API called)
      const response = await fetch('http://localhost:3000/api/abandoned-cart/track', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: user.id,
          cartId: cart.id,
        }),
      });

      // Then: Abandoned cart record is created
      expect(response.status).toBe(201);
      const data = await response.json();

      expect(data).toHaveProperty('id');
      expect(data).toHaveProperty('recoveryToken');
      expect(data.userId).toBe(user.id);
      expect(data.status).toBe('ABANDONED');
      expect(Number(data.totalValue)).toBe(199.98); // 99.99 * 2

      // Verify database record
      const abandonedCart = await prisma.abandonedCart.findUnique({
        where: { id: data.id },
      });

      expect(abandonedCart).not.toBeNull();
      expect(abandonedCart?.userId).toBe(user.id);
    });

    it('should track abandoned cart for guest user', async () => {
      // Given: A guest with items in cart
      const product = await prisma.product.create({
        data: {
          name: 'Test Product',
          slug: 'test-product-2',
          price: 49.99,
          stock: 5,
        },
      });

      // When: Guest cart is abandoned
      const response = await fetch('http://localhost:3000/api/abandoned-cart/track', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          guestEmail: 'guest@example.com',
          guestName: 'Guest User',
          cartItems: [
            {
              productId: product.id,
              quantity: 1,
              price: 49.99,
            },
          ],
        }),
      });

      // Then: Abandoned cart record is created
      expect(response.status).toBe(201);
      const data = await response.json();

      expect(data.guestEmail).toBe('guest@example.com');
      expect(data.userId).toBeNull();
      expect(Number(data.totalValue)).toBe(49.99);
    });

    it('should not create duplicate abandoned cart for same user', async () => {
      // Given: User already has an abandoned cart
      const user = await prisma.user.create({
        data: {
          email: 'duplicate@example.com',
          name: 'Duplicate Test',
        },
      });

      const existingAbandonedCart = await prisma.abandonedCart.create({
        data: {
          userId: user.id,
          cartSnapshot: JSON.stringify([]),
          totalValue: 100.00,
          recoveryToken: 'existing-token',
          status: 'ABANDONED',
        },
      });

      // When: Attempting to track another abandoned cart
      const response = await fetch('http://localhost:3000/api/abandoned-cart/track', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: user.id,
          cartItems: [
            {
              productId: 'test-product-id',
              quantity: 1,
              price: 50.00,
            },
          ],
        }),
      });

      // Then: Existing cart is updated, not duplicated
      expect(response.status).toBe(200);
      const data = await response.json();

      expect(data.id).toBe(existingAbandonedCart.id);

      // Verify only one abandoned cart exists
      const abandonedCarts = await prisma.abandonedCart.findMany({
        where: { userId: user.id, status: 'ABANDONED' },
      });

      expect(abandonedCarts).toHaveLength(1);
    });

    it('should return 400 if no cart data provided', async () => {
      const response = await fetch('http://localhost:3000/api/abandoned-cart/track', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({}),
      });

      expect(response.status).toBe(400);
      const data = await response.json();
      expect(data).toHaveProperty('error');
    });
  });
});
