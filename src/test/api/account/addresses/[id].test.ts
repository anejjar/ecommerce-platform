import { describe, it, expect, vi, beforeEach } from 'vitest';
import { PATCH, DELETE } from '@/app/api/account/addresses/[id]/route';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';

// Mock Prisma
vi.mock('@/lib/prisma', () => ({
  prisma: {
    address: {
      findFirst: vi.fn(),
      update: vi.fn(),
      updateMany: vi.fn(),
      delete: vi.fn(),
    },
    order: {
      count: vi.fn(),
    },
  },
}));

// Mock NextAuth
vi.mock('next-auth', () => ({
  getServerSession: vi.fn(),
}));

describe('Account Address by ID API - PATCH', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return 401 if user is not authenticated', async () => {
    (getServerSession as any).mockResolvedValue(null);

    const req = new Request('http://localhost/api/account/addresses/addr-1', {
      method: 'PATCH',
      body: JSON.stringify({}),
    });

    const params = Promise.resolve({ id: 'addr-1' });
    const res = await PATCH(req, { params });
    const data = await res.json();

    expect(res.status).toBe(401);
    expect(data.error).toBe('Unauthorized');
  });

  it('should return 404 if address does not exist', async () => {
    const mockSession = {
      user: {
        id: 'user-123',
        email: 'test@example.com',
      },
    };

    (getServerSession as any).mockResolvedValue(mockSession);
    (prisma.address.findFirst as any).mockResolvedValue(null);

    const req = new Request('http://localhost/api/account/addresses/addr-999', {
      method: 'PATCH',
      body: JSON.stringify({ firstName: 'John' }),
    });

    const params = Promise.resolve({ id: 'addr-999' });
    const res = await PATCH(req, { params });
    const data = await res.json();

    expect(res.status).toBe(404);
    expect(data.error).toBe('Address not found');
  });

  it('should update address successfully', async () => {
    const mockSession = {
      user: {
        id: 'user-123',
        email: 'test@example.com',
      },
    };

    const existingAddress = {
      id: 'addr-1',
      userId: 'user-123',
      firstName: 'John',
      lastName: 'Doe',
      address1: '123 Main St',
      city: 'New York',
      postalCode: '10001',
      country: 'USA',
      isDefault: false,
    };

    const updatedAddress = {
      ...existingAddress,
      firstName: 'Jane',
      city: 'Boston',
    };

    (getServerSession as any).mockResolvedValue(mockSession);
    (prisma.address.findFirst as any).mockResolvedValue(existingAddress);
    (prisma.address.update as any).mockResolvedValue(updatedAddress);

    const req = new Request('http://localhost/api/account/addresses/addr-1', {
      method: 'PATCH',
      body: JSON.stringify({
        firstName: 'Jane',
        lastName: 'Doe',
        address1: '123 Main St',
        city: 'Boston',
        postalCode: '10001',
        country: 'USA',
      }),
    });

    const params = Promise.resolve({ id: 'addr-1' });
    const res = await PATCH(req, { params });
    const data = await res.json();

    expect(res.status).toBe(200);
    expect(data.firstName).toBe('Jane');
    expect(data.city).toBe('Boston');

    expect(prisma.address.update).toHaveBeenCalledWith({
      where: { id: 'addr-1' },
      data: expect.objectContaining({
        firstName: 'Jane',
        city: 'Boston',
      }),
    });
  });

  it('should unset other default addresses when setting one as default', async () => {
    const mockSession = {
      user: {
        id: 'user-123',
        email: 'test@example.com',
      },
    };

    const existingAddress = {
      id: 'addr-1',
      userId: 'user-123',
      firstName: 'John',
      lastName: 'Doe',
      address1: '123 Main St',
      city: 'New York',
      postalCode: '10001',
      country: 'USA',
      isDefault: false,
    };

    const updatedAddress = {
      ...existingAddress,
      isDefault: true,
    };

    (getServerSession as any).mockResolvedValue(mockSession);
    (prisma.address.findFirst as any).mockResolvedValue(existingAddress);
    (prisma.address.updateMany as any).mockResolvedValue({ count: 1 });
    (prisma.address.update as any).mockResolvedValue(updatedAddress);

    const req = new Request('http://localhost/api/account/addresses/addr-1', {
      method: 'PATCH',
      body: JSON.stringify({
        firstName: 'John',
        lastName: 'Doe',
        address1: '123 Main St',
        city: 'New York',
        postalCode: '10001',
        country: 'USA',
        isDefault: true,
      }),
    });

    const params = Promise.resolve({ id: 'addr-1' });
    const res = await PATCH(req, { params });
    const data = await res.json();

    expect(res.status).toBe(200);
    expect(data.isDefault).toBe(true);

    expect(prisma.address.updateMany).toHaveBeenCalledWith({
      where: { userId: 'user-123', isDefault: true, id: { not: 'addr-1' } },
      data: { isDefault: false },
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
    (prisma.address.findFirst as any).mockRejectedValue(new Error('Database error'));

    const req = new Request('http://localhost/api/account/addresses/addr-1', {
      method: 'PATCH',
      body: JSON.stringify({ firstName: 'John' }),
    });

    const params = Promise.resolve({ id: 'addr-1' });
    const res = await PATCH(req, { params });
    const data = await res.json();

    expect(res.status).toBe(500);
    expect(data.error).toBe('Failed to update address');
  });
});

describe('Account Address by ID API - DELETE', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return 401 if user is not authenticated', async () => {
    (getServerSession as any).mockResolvedValue(null);

    const req = new Request('http://localhost/api/account/addresses/addr-1', {
      method: 'DELETE',
    });

    const params = Promise.resolve({ id: 'addr-1' });
    const res = await DELETE(req, { params });
    const data = await res.json();

    expect(res.status).toBe(401);
    expect(data.error).toBe('Unauthorized');
  });

  it('should return 404 if address does not exist', async () => {
    const mockSession = {
      user: {
        id: 'user-123',
        email: 'test@example.com',
      },
    };

    (getServerSession as any).mockResolvedValue(mockSession);
    (prisma.address.findFirst as any).mockResolvedValue(null);

    const req = new Request('http://localhost/api/account/addresses/addr-999', {
      method: 'DELETE',
    });

    const params = Promise.resolve({ id: 'addr-999' });
    const res = await DELETE(req, { params });
    const data = await res.json();

    expect(res.status).toBe(404);
    expect(data.error).toBe('Address not found');
  });

  it('should return 400 if address is used in orders', async () => {
    const mockSession = {
      user: {
        id: 'user-123',
        email: 'test@example.com',
      },
    };

    const existingAddress = {
      id: 'addr-1',
      userId: 'user-123',
      firstName: 'John',
      lastName: 'Doe',
      address1: '123 Main St',
      city: 'New York',
      postalCode: '10001',
      country: 'USA',
      isDefault: false,
    };

    (getServerSession as any).mockResolvedValue(mockSession);
    (prisma.address.findFirst as any).mockResolvedValue(existingAddress);
    (prisma.order.count as any).mockResolvedValue(2);

    const req = new Request('http://localhost/api/account/addresses/addr-1', {
      method: 'DELETE',
    });

    const params = Promise.resolve({ id: 'addr-1' });
    const res = await DELETE(req, { params });
    const data = await res.json();

    expect(res.status).toBe(400);
    expect(data.error).toBe('Cannot delete address used in orders');

    expect(prisma.order.count).toHaveBeenCalledWith({
      where: {
        OR: [{ shippingAddressId: 'addr-1' }, { billingAddressId: 'addr-1' }],
      },
    });
  });

  it('should delete address successfully', async () => {
    const mockSession = {
      user: {
        id: 'user-123',
        email: 'test@example.com',
      },
    };

    const existingAddress = {
      id: 'addr-1',
      userId: 'user-123',
      firstName: 'John',
      lastName: 'Doe',
      address1: '123 Main St',
      city: 'New York',
      postalCode: '10001',
      country: 'USA',
      isDefault: false,
    };

    (getServerSession as any).mockResolvedValue(mockSession);
    (prisma.address.findFirst as any).mockResolvedValue(existingAddress);
    (prisma.order.count as any).mockResolvedValue(0);
    (prisma.address.delete as any).mockResolvedValue(existingAddress);

    const req = new Request('http://localhost/api/account/addresses/addr-1', {
      method: 'DELETE',
    });

    const params = Promise.resolve({ id: 'addr-1' });
    const res = await DELETE(req, { params });
    const data = await res.json();

    expect(res.status).toBe(200);
    expect(data.success).toBe(true);

    expect(prisma.address.delete).toHaveBeenCalledWith({ where: { id: 'addr-1' } });
  });

  it('should set another address as default when deleting default address', async () => {
    const mockSession = {
      user: {
        id: 'user-123',
        email: 'test@example.com',
      },
    };

    const existingAddress = {
      id: 'addr-1',
      userId: 'user-123',
      firstName: 'John',
      lastName: 'Doe',
      address1: '123 Main St',
      city: 'New York',
      postalCode: '10001',
      country: 'USA',
      isDefault: true,
    };

    const remainingAddress = {
      id: 'addr-2',
      userId: 'user-123',
      firstName: 'Jane',
      lastName: 'Doe',
      address1: '456 Oak Ave',
      city: 'Boston',
      postalCode: '02101',
      country: 'USA',
      isDefault: false,
    };

    (getServerSession as any).mockResolvedValue(mockSession);
    (prisma.address.findFirst as any)
      .mockResolvedValueOnce(existingAddress)
      .mockResolvedValueOnce(remainingAddress);
    (prisma.order.count as any).mockResolvedValue(0);
    (prisma.address.delete as any).mockResolvedValue(existingAddress);
    (prisma.address.update as any).mockResolvedValue({ ...remainingAddress, isDefault: true });

    const req = new Request('http://localhost/api/account/addresses/addr-1', {
      method: 'DELETE',
    });

    const params = Promise.resolve({ id: 'addr-1' });
    const res = await DELETE(req, { params });
    const data = await res.json();

    expect(res.status).toBe(200);
    expect(data.success).toBe(true);

    expect(prisma.address.update).toHaveBeenCalledWith({
      where: { id: 'addr-2' },
      data: { isDefault: true },
    });
  });
});
