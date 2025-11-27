import { describe, it, expect, vi, beforeEach } from 'vitest';
import { GET } from '@/app/api/account/orders/route';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';

// Mock Prisma
vi.mock('@/lib/prisma', () => ({
  prisma: {
    order: {
      findMany: vi.fn(),
      count: vi.fn(),
    },
  },
}));

// Mock NextAuth
vi.mock('next-auth', () => ({
  getServerSession: vi.fn(),
}));

describe('Account Orders API - GET', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return 401 if user is not authenticated', async () => {
    (getServerSession as any).mockResolvedValue(null);

    const req = new Request('http://localhost/api/account/orders');
    const res = await GET(req);
    const data = await res.json();

    expect(res.status).toBe(401);
    expect(data.error).toBe('Unauthorized');
  });

  it('should return paginated orders for authenticated user', async () => {
    const mockSession = {
      user: {
        id: 'user-123',
        email: 'test@example.com',
        role: 'CUSTOMER',
      },
    };

    const mockOrders = [
      {
        id: 'order-1',
        orderNumber: 'ORD-20241126-0001',
        status: 'COMPLETED',
        total: 100.0,
        items: [
          {
            id: 'item-1',
            quantity: 2,
            price: 50.0,
            product: {
              name: 'Test Product',
              slug: 'test-product',
              images: [],
            },
          },
        ],
        createdAt: new Date('2024-11-26'),
      },
    ];

    (getServerSession as any).mockResolvedValue(mockSession);
    (prisma.order.findMany as any).mockResolvedValue(mockOrders);
    (prisma.order.count as any).mockResolvedValue(1);

    const req = new Request('http://localhost/api/account/orders?page=1&limit=10');
    const res = await GET(req);
    const data = await res.json();

    expect(res.status).toBe(200);
    expect(data.orders).toHaveLength(1);
    expect(data.orders[0].orderNumber).toBe('ORD-20241126-0001');
    expect(data.pagination.total).toBe(1);
    expect(data.pagination.page).toBe(1);
    expect(data.pagination.limit).toBe(10);
    expect(data.pagination.pages).toBe(1);

    expect(prisma.order.findMany).toHaveBeenCalledWith({
      where: {
        userId: 'user-123',
      },
      include: {
        items: {
          include: {
            product: {
              select: {
                name: true,
                slug: true,
                images: true,
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
      skip: 0,
      take: 10,
    });
  });

  it('should handle pagination correctly', async () => {
    const mockSession = {
      user: {
        id: 'user-123',
        email: 'test@example.com',
        role: 'CUSTOMER',
      },
    };

    (getServerSession as any).mockResolvedValue(mockSession);
    (prisma.order.findMany as any).mockResolvedValue([]);
    (prisma.order.count as any).mockResolvedValue(25);

    const req = new Request('http://localhost/api/account/orders?page=2&limit=10');
    const res = await GET(req);
    const data = await res.json();

    expect(res.status).toBe(200);
    expect(data.pagination.page).toBe(2);
    expect(data.pagination.total).toBe(25);
    expect(data.pagination.pages).toBe(3);

    expect(prisma.order.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        skip: 10,
        take: 10,
      })
    );
  });

  it('should handle database errors gracefully', async () => {
    const mockSession = {
      user: {
        id: 'user-123',
        email: 'test@example.com',
        role: 'CUSTOMER',
      },
    };

    (getServerSession as any).mockResolvedValue(mockSession);
    (prisma.order.findMany as any).mockRejectedValue(new Error('Database error'));

    const req = new Request('http://localhost/api/account/orders');
    const res = await GET(req);
    const data = await res.json();

    expect(res.status).toBe(500);
    expect(data.error).toBe('Failed to fetch orders');
  });

  it('should return empty array when user has no orders', async () => {
    const mockSession = {
      user: {
        id: 'user-123',
        email: 'test@example.com',
        role: 'CUSTOMER',
      },
    };

    (getServerSession as any).mockResolvedValue(mockSession);
    (prisma.order.findMany as any).mockResolvedValue([]);
    (prisma.order.count as any).mockResolvedValue(0);

    const req = new Request('http://localhost/api/account/orders');
    const res = await GET(req);
    const data = await res.json();

    expect(res.status).toBe(200);
    expect(data.orders).toHaveLength(0);
    expect(data.pagination.total).toBe(0);
    expect(data.pagination.pages).toBe(0);
  });
});
