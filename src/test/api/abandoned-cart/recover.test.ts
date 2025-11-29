import { describe, it, expect, beforeEach, vi } from 'vitest';
import { NextRequest } from 'next/server';
import { POST } from '@/app/api/abandoned-cart/recover/[token]/route';
import { mockPrisma, resetAllMocks } from '@/test/helpers/mocks';
import { isFeatureEnabled } from '@/lib/features';

vi.mock('@/lib/features');
vi.mock('@/lib/prisma', () => ({ prisma: mockPrisma }));

const mockIsFeatureEnabled = isFeatureEnabled as any;

describe('/api/abandoned-cart/recover', () => {
  beforeEach(() => {
    resetAllMocks();
    mockIsFeatureEnabled.mockResolvedValue(true);
  });

  describe('POST /api/abandoned-cart/recover/:token', () => {
    it('should recover abandoned cart and restore items to cart', async () => {
      // Given: An abandoned cart with recovery token
      const userId = 'user-123';
      const productId = 'product-123';
      const recoveryToken = 'test-recovery-token-123';

      const cartSnapshot = [
        {
          productId,
          quantity: 2,
          price: 79.99,
          name: 'Recovery Product',
        },
      ];

      const abandonedCart = {
        id: 'abandoned-123',
        userId,
        cartSnapshot: JSON.stringify(cartSnapshot),
        totalValue: 159.98,
        status: 'ABANDONED',
        recoveryToken,
        abandonedAt: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
        guestEmail: null,
        guestName: null,
        discountCode: null,
        recoveredAt: null,
        user: {
          id: userId,
          email: 'recover@example.com',
          name: 'Recover Test',
        },
      };

      mockPrisma.abandonedCart.findUnique.mockResolvedValue(abandonedCart);
      mockPrisma.cart.findUnique.mockResolvedValue({
        id: 'cart-123',
        userId,
        items: [],
      });
      mockPrisma.cartItem.create.mockResolvedValue({
        id: 'item-123',
        cartId: 'cart-123',
        productId,
        quantity: 2,
        variantId: null,
      });
      mockPrisma.abandonedCart.update.mockResolvedValue({
        ...abandonedCart,
        status: 'RECOVERED',
        recoveredAt: new Date(),
      });

      // When: Recovery API is called with token
      const request = new NextRequest(
        `http://localhost:3000/api/abandoned-cart/recover/${recoveryToken}`,
        {
          method: 'POST',
        }
      );

      const response = await POST(request, {
        params: Promise.resolve({ token: recoveryToken }),
      });
      const data = await response.json();

      // Then: Cart is recovered
      expect(response.status).toBe(200);
      expect(data.status).toBe('RECOVERED');
      expect(data.recoveredAt).toBeDefined();
      expect(mockPrisma.abandonedCart.update).toHaveBeenCalled();
      expect(mockPrisma.cartItem.create).toHaveBeenCalled();
    });

    it('should apply discount code if provided in abandoned cart', async () => {
      // Given: Abandoned cart with discount code
      const userId = 'user-456';
      const recoveryToken = 'discount-token-456';

      const abandonedCart = {
        id: 'abandoned-456',
        userId,
        cartSnapshot: JSON.stringify([]),
        totalValue: 100.0,
        status: 'ABANDONED',
        recoveryToken,
        abandonedAt: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
        guestEmail: null,
        guestName: null,
        discountCode: 'COMEBACK10',
        recoveredAt: null,
        user: {
          id: userId,
          email: 'discount@example.com',
          name: 'Discount Test',
        },
      };

      mockPrisma.abandonedCart.findUnique.mockResolvedValue(abandonedCart);
      mockPrisma.cart.findUnique.mockResolvedValue({
        id: 'cart-456',
        userId,
        items: [],
      });
      mockPrisma.abandonedCart.update.mockResolvedValue({
        ...abandonedCart,
        status: 'RECOVERED',
        recoveredAt: new Date(),
      });

      // When: Recovery API is called
      const request = new NextRequest(
        `http://localhost:3000/api/abandoned-cart/recover/${recoveryToken}`,
        {
          method: 'POST',
        }
      );

      const response = await POST(request, {
        params: Promise.resolve({ token: recoveryToken }),
      });
      const data = await response.json();

      // Then: Response includes discount code
      expect(response.status).toBe(200);
      expect(data.discountCode).toBe('COMEBACK10');
    });

    it('should return 404 for invalid recovery token', async () => {
      mockPrisma.abandonedCart.findUnique.mockResolvedValue(null);

      const request = new NextRequest(
        `http://localhost:3000/api/abandoned-cart/recover/invalid-token`,
        {
          method: 'POST',
        }
      );

      const response = await POST(request, {
        params: Promise.resolve({ token: 'invalid-token' }),
      });
      const data = await response.json();

      expect(response.status).toBe(404);
      expect(data).toHaveProperty('error');
      expect(data.error).toBe('Invalid recovery token');
    });

    it('should return 400 if cart already recovered', async () => {
      // Given: Already recovered cart
      const recoveryToken = 'already-recovered-token';
      const abandonedCart = {
        id: 'abandoned-789',
        userId: null,
        guestEmail: 'already@recovered.com',
        cartSnapshot: JSON.stringify([]),
        totalValue: 50.0,
        status: 'RECOVERED',
        recoveryToken,
        abandonedAt: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
        guestName: null,
        discountCode: null,
        recoveredAt: new Date(),
        user: null,
      };

      mockPrisma.abandonedCart.findUnique.mockResolvedValue(abandonedCart);

      // When: Attempting to recover again
      const request = new NextRequest(
        `http://localhost:3000/api/abandoned-cart/recover/${recoveryToken}`,
        {
          method: 'POST',
        }
      );

      const response = await POST(request, {
        params: Promise.resolve({ token: recoveryToken }),
      });
      const data = await response.json();

      // Then: Returns error
      expect(response.status).toBe(400);
      expect(data.error).toContain('already been recovered');
    });

    it('should return 400 if cart expired', async () => {
      // Given: Expired abandoned cart
      const recoveryToken = 'expired-token';
      const abandonedCart = {
        id: 'abandoned-expired',
        userId: null,
        guestEmail: 'expired@example.com',
        cartSnapshot: JSON.stringify([]),
        totalValue: 50.0,
        status: 'EXPIRED',
        recoveryToken,
        abandonedAt: new Date(Date.now() - 31 * 24 * 60 * 60 * 1000),
        createdAt: new Date(),
        updatedAt: new Date(),
        guestName: null,
        discountCode: null,
        recoveredAt: null,
        user: null,
      };

      mockPrisma.abandonedCart.findUnique.mockResolvedValue(abandonedCart);

      // When: Attempting to recover expired cart
      const request = new NextRequest(
        `http://localhost:3000/api/abandoned-cart/recover/${recoveryToken}`,
        {
          method: 'POST',
        }
      );

      const response = await POST(request, {
        params: Promise.resolve({ token: recoveryToken }),
      });
      const data = await response.json();

      // Then: Returns error
      expect(response.status).toBe(400);
      expect(data.error).toContain('expired');
    });

    it('should return 404 if feature is disabled', async () => {
      mockIsFeatureEnabled.mockResolvedValue(false);

      const request = new NextRequest(
        `http://localhost:3000/api/abandoned-cart/recover/test-token`,
        {
          method: 'POST',
        }
      );

      const response = await POST(request, {
        params: Promise.resolve({ token: 'test-token' }),
      });
      const data = await response.json();

      expect(response.status).toBe(404);
      expect(data.error).toBe('Feature not available');
    });
  });
});
