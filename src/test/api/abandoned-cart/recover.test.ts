import { describe, it, expect, beforeEach } from 'vitest';
import { prisma } from '@/lib/prisma';

describe('/api/abandoned-cart/recover', () => {
  beforeEach(async () => {
    // Clean up test data
    await prisma.abandonedCartEmail.deleteMany();
    await prisma.abandonedCart.deleteMany();
    await prisma.cartItem.deleteMany();
    await prisma.cart.deleteMany();
    await prisma.product.deleteMany();
    await prisma.user.deleteMany();
  });

  describe('POST /api/abandoned-cart/recover/:token', () => {
    it('should recover abandoned cart and restore items to cart', async () => {
      // Given: An abandoned cart with recovery token
      const user = await prisma.user.create({
        data: {
          email: 'recover@example.com',
          name: 'Recover Test',
        },
      });

      const product = await prisma.product.create({
        data: {
          name: 'Recovery Product',
          slug: 'recovery-product',
          price: 79.99,
          stock: 10,
        },
      });

      const cartSnapshot = [
        {
          productId: product.id,
          quantity: 2,
          price: 79.99,
          name: 'Recovery Product',
        },
      ];

      const abandonedCart = await prisma.abandonedCart.create({
        data: {
          userId: user.id,
          cartSnapshot: JSON.stringify(cartSnapshot),
          totalValue: 159.98,
          status: 'ABANDONED',
          recoveryToken: 'test-recovery-token-123',
        },
      });

      // When: Recovery API is called with token
      const response = await fetch(
        `http://localhost:3000/api/abandoned-cart/recover/test-recovery-token-123`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      // Then: Cart is recovered
      expect(response.status).toBe(200);
      const data = await response.json();

      expect(data.status).toBe('RECOVERED');
      expect(data.recoveredAt).toBeDefined();

      // Verify cart was restored
      const cart = await prisma.cart.findUnique({
        where: { userId: user.id },
        include: { items: true },
      });

      expect(cart).not.toBeNull();
      expect(cart?.items).toHaveLength(1);
      expect(cart?.items[0].productId).toBe(product.id);
      expect(cart?.items[0].quantity).toBe(2);
    });

    it('should apply discount code if provided in abandoned cart', async () => {
      // Given: Abandoned cart with discount code
      const user = await prisma.user.create({
        data: {
          email: 'discount@example.com',
          name: 'Discount Test',
        },
      });

      const abandonedCart = await prisma.abandonedCart.create({
        data: {
          userId: user.id,
          cartSnapshot: JSON.stringify([]),
          totalValue: 100.00,
          status: 'ABANDONED',
          recoveryToken: 'discount-token-456',
          discountCode: 'COMEBACK10',
        },
      });

      // When: Recovery API is called
      const response = await fetch(
        `http://localhost:3000/api/abandoned-cart/recover/discount-token-456`,
        {
          method: 'POST',
        }
      );

      // Then: Response includes discount code
      expect(response.status).toBe(200);
      const data = await response.json();

      expect(data.discountCode).toBe('COMEBACK10');
    });

    it('should return 404 for invalid recovery token', async () => {
      const response = await fetch(
        `http://localhost:3000/api/abandoned-cart/recover/invalid-token`,
        {
          method: 'POST',
        }
      );

      expect(response.status).toBe(404);
      const data = await response.json();
      expect(data).toHaveProperty('error');
    });

    it('should return 400 if cart already recovered', async () => {
      // Given: Already recovered cart
      const abandonedCart = await prisma.abandonedCart.create({
        data: {
          guestEmail: 'already@recovered.com',
          cartSnapshot: JSON.stringify([]),
          totalValue: 50.00,
          status: 'RECOVERED',
          recoveryToken: 'already-recovered-token',
          recoveredAt: new Date(),
        },
      });

      // When: Attempting to recover again
      const response = await fetch(
        `http://localhost:3000/api/abandoned-cart/recover/already-recovered-token`,
        {
          method: 'POST',
        }
      );

      // Then: Returns error
      expect(response.status).toBe(400);
      const data = await response.json();
      expect(data.error).toContain('already recovered');
    });

    it('should return 400 if cart expired', async () => {
      // Given: Expired abandoned cart (more than 30 days old)
      const oldDate = new Date();
      oldDate.setDate(oldDate.getDate() - 31);

      const abandonedCart = await prisma.abandonedCart.create({
        data: {
          guestEmail: 'expired@example.com',
          cartSnapshot: JSON.stringify([]),
          totalValue: 50.00,
          status: 'EXPIRED',
          recoveryToken: 'expired-token',
          abandonedAt: oldDate,
        },
      });

      // When: Attempting to recover expired cart
      const response = await fetch(
        `http://localhost:3000/api/abandoned-cart/recover/expired-token`,
        {
          method: 'POST',
        }
      );

      // Then: Returns error
      expect(response.status).toBe(400);
      const data = await response.json();
      expect(data.error).toContain('expired');
    });
  });
});
