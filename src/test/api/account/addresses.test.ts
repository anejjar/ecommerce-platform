import { describe, it, expect, vi, beforeEach } from 'vitest';
import { GET, POST } from '@/app/api/account/addresses/route';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';

// Mock Prisma
vi.mock('@/lib/prisma', () => ({
  prisma: {
    address: {
      findMany: vi.fn(),
      create: vi.fn(),
      updateMany: vi.fn(),
      count: vi.fn(),
    },
  },
}));

// Mock NextAuth
vi.mock('next-auth', () => ({
  getServerSession: vi.fn(),
}));

describe('Account Addresses API - GET', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return 401 if user is not authenticated', async () => {
    (getServerSession as any).mockResolvedValue(null);

    const res = await GET();
    const data = await res.json();

    expect(res.status).toBe(401);
    expect(data.error).toBe('Unauthorized');
  });

  it('should return all addresses for authenticated user', async () => {
    const mockSession = {
      user: {
        id: 'user-123',
        email: 'test@example.com',
      },
    };

    const mockAddresses = [
      {
        id: 'addr-1',
        firstName: 'John',
        lastName: 'Doe',
        address1: '123 Main St',
        city: 'New York',
        postalCode: '10001',
        country: 'USA',
        isDefault: true,
        createdAt: new Date(),
      },
      {
        id: 'addr-2',
        firstName: 'John',
        lastName: 'Doe',
        address1: '456 Oak Ave',
        city: 'Boston',
        postalCode: '02101',
        country: 'USA',
        isDefault: false,
        createdAt: new Date(),
      },
    ];

    (getServerSession as any).mockResolvedValue(mockSession);
    (prisma.address.findMany as any).mockResolvedValue(mockAddresses);

    const res = await GET();
    const data = await res.json();

    expect(res.status).toBe(200);
    expect(data).toHaveLength(2);
    expect(data[0].isDefault).toBe(true);

    expect(prisma.address.findMany).toHaveBeenCalledWith({
      where: { userId: 'user-123' },
      orderBy: [{ isDefault: 'desc' }, { createdAt: 'desc' }],
    });
  });

  it('should handle database errors', async () => {
    const mockSession = {
      user: {
        id: 'user-123',
        email: 'test@example.com',
      },
    };

    (getServerSession as any).mockResolvedValue(mockSession);
    (prisma.address.findMany as any).mockRejectedValue(new Error('Database error'));

    const res = await GET();
    const data = await res.json();

    expect(res.status).toBe(500);
    expect(data.error).toBe('Failed to fetch addresses');
  });
});

describe('Account Addresses API - POST', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return 401 if user is not authenticated', async () => {
    (getServerSession as any).mockResolvedValue(null);

    const req = new Request('http://localhost/api/account/addresses', {
      method: 'POST',
      body: JSON.stringify({}),
    });

    const res = await POST(req);
    const data = await res.json();

    expect(res.status).toBe(401);
    expect(data.error).toBe('Unauthorized');
  });

  it('should return 400 for missing required fields', async () => {
    const mockSession = {
      user: {
        id: 'user-123',
        email: 'test@example.com',
      },
    };

    (getServerSession as any).mockResolvedValue(mockSession);

    const req = new Request('http://localhost/api/account/addresses', {
      method: 'POST',
      body: JSON.stringify({
        firstName: 'John',
        // Missing other required fields
      }),
    });

    const res = await POST(req);
    const data = await res.json();

    expect(res.status).toBe(400);
    expect(data.error).toContain('required');
  });

  it('should create address successfully with all required fields', async () => {
    const mockSession = {
      user: {
        id: 'user-123',
        email: 'test@example.com',
      },
    };

    const addressData = {
      firstName: 'John',
      lastName: 'Doe',
      address1: '123 Main St',
      city: 'New York',
      postalCode: '10001',
      country: 'USA',
      phone: '555-0100',
    };

    const mockAddress = {
      id: 'addr-1',
      ...addressData,
      userId: 'user-123',
      isDefault: true,
      createdAt: new Date(),
    };

    (getServerSession as any).mockResolvedValue(mockSession);
    (prisma.address.count as any).mockResolvedValue(0);
    (prisma.address.create as any).mockResolvedValue(mockAddress);

    const req = new Request('http://localhost/api/account/addresses', {
      method: 'POST',
      body: JSON.stringify(addressData),
    });

    const res = await POST(req);
    const data = await res.json();

    expect(res.status).toBe(201);
    expect(data.id).toBe('addr-1');
    expect(data.firstName).toBe('John');
    expect(data.isDefault).toBe(true);

    expect(prisma.address.create).toHaveBeenCalledWith({
      data: expect.objectContaining({
        userId: 'user-123',
        firstName: 'John',
        lastName: 'Doe',
        address1: '123 Main St',
        city: 'New York',
        postalCode: '10001',
        country: 'USA',
      }),
    });
  });

  it('should unset other default addresses when isDefault is true', async () => {
    const mockSession = {
      user: {
        id: 'user-123',
        email: 'test@example.com',
      },
    };

    const addressData = {
      firstName: 'John',
      lastName: 'Doe',
      address1: '123 Main St',
      city: 'New York',
      postalCode: '10001',
      country: 'USA',
      isDefault: true,
    };

    const mockAddress = {
      id: 'addr-2',
      ...addressData,
      userId: 'user-123',
      createdAt: new Date(),
    };

    (getServerSession as any).mockResolvedValue(mockSession);
    (prisma.address.count as any).mockResolvedValue(1);
    (prisma.address.updateMany as any).mockResolvedValue({ count: 1 });
    (prisma.address.create as any).mockResolvedValue(mockAddress);

    const req = new Request('http://localhost/api/account/addresses', {
      method: 'POST',
      body: JSON.stringify(addressData),
    });

    const res = await POST(req);

    expect(res.status).toBe(201);
    expect(prisma.address.updateMany).toHaveBeenCalledWith({
      where: { userId: 'user-123', isDefault: true },
      data: { isDefault: false },
    });
  });

  it('should set first address as default automatically', async () => {
    const mockSession = {
      user: {
        id: 'user-123',
        email: 'test@example.com',
      },
    };

    const addressData = {
      firstName: 'John',
      lastName: 'Doe',
      address1: '123 Main St',
      city: 'New York',
      postalCode: '10001',
      country: 'USA',
    };

    const mockAddress = {
      id: 'addr-1',
      ...addressData,
      userId: 'user-123',
      isDefault: true,
      createdAt: new Date(),
    };

    (getServerSession as any).mockResolvedValue(mockSession);
    (prisma.address.count as any).mockResolvedValue(0);
    (prisma.address.create as any).mockResolvedValue(mockAddress);

    const req = new Request('http://localhost/api/account/addresses', {
      method: 'POST',
      body: JSON.stringify(addressData),
    });

    const res = await POST(req);
    const data = await res.json();

    expect(res.status).toBe(201);
    expect(data.isDefault).toBe(true);

    expect(prisma.address.create).toHaveBeenCalledWith({
      data: expect.objectContaining({
        isDefault: true,
      }),
    });
  });

  it('should handle optional fields correctly', async () => {
    const mockSession = {
      user: {
        id: 'user-123',
        email: 'test@example.com',
      },
    };

    const addressData = {
      firstName: 'John',
      lastName: 'Doe',
      company: 'Acme Corp',
      address1: '123 Main St',
      address2: 'Suite 100',
      city: 'New York',
      state: 'NY',
      postalCode: '10001',
      country: 'USA',
      phone: '555-0100',
    };

    const mockAddress = {
      id: 'addr-1',
      ...addressData,
      userId: 'user-123',
      isDefault: true,
      createdAt: new Date(),
    };

    (getServerSession as any).mockResolvedValue(mockSession);
    (prisma.address.count as any).mockResolvedValue(0);
    (prisma.address.create as any).mockResolvedValue(mockAddress);

    const req = new Request('http://localhost/api/account/addresses', {
      method: 'POST',
      body: JSON.stringify(addressData),
    });

    const res = await POST(req);
    const data = await res.json();

    expect(res.status).toBe(201);
    expect(data.company).toBe('Acme Corp');
    expect(data.address2).toBe('Suite 100');
    expect(data.state).toBe('NY');
  });
});
