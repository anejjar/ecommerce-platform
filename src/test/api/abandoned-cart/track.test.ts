import { describe, it, expect, beforeEach, vi } from 'vitest';
import { NextRequest } from 'next/server';
import { POST } from '@/app/api/abandoned-cart/track/route';
import { mockPrisma, resetAllMocks } from '@/test/helpers/mocks';
import { isFeatureEnabled } from '@/lib/features';

vi.mock('@/lib/features');
vi.mock('@/lib/prisma', () => ({ prisma: mockPrisma }));

const mockIsFeatureEnabled = isFeatureEnabled as any;

describe('/api/abandoned-cart/track', () => {
  beforeEach(() => {
    resetAllMocks();
    mockIsFeatureEnabled.mockResolvedValue(true);
  });

  describe('POST /api/abandoned-cart/track', () => {
    it('should track abandoned cart for logged-in user', async () => {
      // Given: A user with items in cart
      const userId = 'user-123';
      const cartId = 'cart-123';
      const productId = 'product-123';

      const mockCart = {
        id: cartId,
        userId,
        items: [
          {
            id: 'item-1',
            productId,
            quantity: 2,
            product: {
              id: productId,
              name: 'Test Product',
              price: 99.99,
            },
            variant: null,
          },
        ],
      };

      mockPrisma.cart.findUnique.mockResolvedValue(mockCart);
      mockPrisma.abandonedCart.findFirst.mockResolvedValue(null);
      mockPrisma.abandonedCart.create.mockResolvedValue({
        id: 'abandoned-123',
        userId,
        guestEmail: null,
        guestName: null,
        cartSnapshot: JSON.stringify([
          {
            productId,
            quantity: 2,
            price: 99.99,
            name: 'Test Product',
          },
        ]),
        totalValue: 199.98,
        status: 'ABANDONED',
        recoveryToken: 'recovery-token-123',
        abandonedAt: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
        discountCode: null,
        recoveredAt: null,
      });

      // When: Cart is abandoned (API called)
      const request = new NextRequest('http://localhost:3000/api/abandoned-cart/track', {
        method: 'POST',
        body: JSON.stringify({
          userId,
          cartId,
        }),
      });

      const response = await POST(request);
      const data = await response.json();

      // Then: Abandoned cart record is created
      expect(response.status).toBe(201);
      expect(data).toHaveProperty('id');
      expect(data).toHaveProperty('recoveryToken');
      expect(data.userId).toBe(userId);
      expect(data.status).toBe('ABANDONED');
      expect(Number(data.totalValue)).toBe(199.98);

      expect(mockPrisma.cart.findUnique).toHaveBeenCalledWith({
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
      expect(mockPrisma.abandonedCart.create).toHaveBeenCalled();
    });

    it('should track abandoned cart for guest user', async () => {
      // Given: A guest with items in cart
      const productId = 'product-456';
      const cartItems = [
        {
          productId,
          quantity: 1,
          price: 49.99,
        },
      ];

      mockPrisma.abandonedCart.findFirst.mockResolvedValue(null);
      mockPrisma.abandonedCart.create.mockResolvedValue({
        id: 'abandoned-456',
        userId: null,
        guestEmail: 'guest@example.com',
        guestName: 'Guest User',
        cartSnapshot: JSON.stringify(cartItems),
        totalValue: 49.99,
        status: 'ABANDONED',
        recoveryToken: 'recovery-token-456',
        abandonedAt: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
        discountCode: null,
        recoveredAt: null,
      });

      // When: Guest cart is abandoned
      const request = new NextRequest('http://localhost:3000/api/abandoned-cart/track', {
        method: 'POST',
        body: JSON.stringify({
          guestEmail: 'guest@example.com',
          guestName: 'Guest User',
          cartItems,
        }),
      });

      const response = await POST(request);
      const data = await response.json();

      // Then: Abandoned cart record is created
      expect(response.status).toBe(201);
      expect(data.guestEmail).toBe('guest@example.com');
      expect(data.userId).toBeNull();
      expect(Number(data.totalValue)).toBe(49.99);
    });

    it('should not create duplicate abandoned cart for same user', async () => {
      // Given: User already has an abandoned cart
      const userId = 'user-789';
      const existingAbandonedCart = {
        id: 'existing-abandoned-123',
        userId,
        cartSnapshot: JSON.stringify([]),
        totalValue: 100.0,
        recoveryToken: 'existing-token',
        status: 'ABANDONED',
        abandonedAt: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
        guestEmail: null,
        guestName: null,
        discountCode: null,
        recoveredAt: null,
      };

      mockPrisma.abandonedCart.findFirst.mockResolvedValue(existingAbandonedCart);
      mockPrisma.abandonedCart.update.mockResolvedValue({
        ...existingAbandonedCart,
        cartSnapshot: JSON.stringify([
          {
            productId: 'test-product-id',
            quantity: 1,
            price: 50.0,
          },
        ]),
        totalValue: 50.0,
      });

      // When: Attempting to track another abandoned cart
      const request = new NextRequest('http://localhost:3000/api/abandoned-cart/track', {
        method: 'POST',
        body: JSON.stringify({
          userId,
          cartItems: [
            {
              productId: 'test-product-id',
              quantity: 1,
              price: 50.0,
            },
          ],
        }),
      });

      const response = await POST(request);
      const data = await response.json();

      // Then: Existing cart is updated, not duplicated
      expect(response.status).toBe(200);
      expect(data.id).toBe(existingAbandonedCart.id);
      expect(mockPrisma.abandonedCart.update).toHaveBeenCalled();
      expect(mockPrisma.abandonedCart.create).not.toHaveBeenCalled();
    });

    it('should return 400 if no cart data provided', async () => {
      const request = new NextRequest('http://localhost:3000/api/abandoned-cart/track', {
        method: 'POST',
        body: JSON.stringify({}),
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data).toHaveProperty('error');
    });

    it('should return 404 if feature is disabled', async () => {
      mockIsFeatureEnabled.mockResolvedValue(false);

      const request = new NextRequest('http://localhost:3000/api/abandoned-cart/track', {
        method: 'POST',
        body: JSON.stringify({
          userId: 'user-123',
          cartId: 'cart-123',
        }),
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(404);
      expect(data.error).toBe('Feature not available');
    });
  });
});
