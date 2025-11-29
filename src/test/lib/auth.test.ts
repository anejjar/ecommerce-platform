import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { authOptions } from '@/lib/auth';
import { mockPrisma, resetAllMocks } from '@/test/helpers/mocks';
import { compare } from 'bcryptjs';

// Mock dependencies
vi.mock('@/lib/prisma', () => ({ prisma: mockPrisma }));

vi.mock('bcryptjs', () => ({
  compare: vi.fn(),
}));

describe('Auth Configuration', () => {
  beforeEach(() => {
    resetAllMocks();
  });

  describe('authOptions', () => {
    it('should have correct configuration', () => {
      expect(authOptions.session.strategy).toBe('jwt');
      expect(authOptions.pages?.signIn).toBe('/admin/login');
      expect(authOptions.providers).toHaveLength(1);
    });

    it('should use PrismaAdapter', () => {
      expect(authOptions.adapter).toBeDefined();
    });
  });

  describe('CredentialsProvider authorize', () => {
    const authorizeFunction = authOptions.providers[0].authorize;

    it('should return null if email is missing', async () => {
      const result = await authorizeFunction(
        { password: 'test123' } as any,
        {} as any
      );
      expect(result).toBeNull();
    });

    it('should return null if password is missing', async () => {
      const result = await authorizeFunction(
        { email: 'test@example.com' } as any,
        {} as any
      );
      expect(result).toBeNull();
    });

    it('should return null if user not found', async () => {
      mockPrisma.user.findUnique.mockResolvedValue(null);

      const result = await authorizeFunction(
        {
          email: 'test@example.com',
          password: 'test123',
        } as any,
        {} as any
      );

      expect(result).toBeNull();
      expect(mockPrisma.user.findUnique).toHaveBeenCalledWith({
        where: { email: 'test@example.com' },
      });
    });

    it('should return null if user has no password', async () => {
      mockPrisma.user.findUnique.mockResolvedValue({
        id: '1',
        email: 'test@example.com',
        password: null,
        name: 'Test User',
        role: 'CUSTOMER',
        createdAt: new Date(),
        updatedAt: new Date(),
        emailVerified: null,
        image: null,
        firstName: null,
        lastName: null,
        phone: null,
        sessionsInvalidatedAt: null,
      });

      const result = await authorizeFunction(
        {
          email: 'test@example.com',
          password: 'test123',
        } as any,
        {} as any
      );

      expect(result).toBeNull();
    });

    it('should return null if password is invalid', async () => {
      mockPrisma.user.findUnique.mockResolvedValue({
        id: '1',
        email: 'test@example.com',
        password: 'hashedpassword',
        name: 'Test User',
        role: 'CUSTOMER',
        createdAt: new Date(),
        updatedAt: new Date(),
        emailVerified: null,
        image: null,
        firstName: null,
        lastName: null,
        phone: null,
        sessionsInvalidatedAt: null,
      });

      vi.mocked(compare).mockResolvedValue(false);

      const result = await authorizeFunction(
        {
          email: 'test@example.com',
          password: 'wrongpassword',
        } as any,
        {} as any
      );

      expect(result).toBeNull();
      expect(compare).toHaveBeenCalledWith('wrongpassword', 'hashedpassword');
    });

    it('should return user object if credentials are valid', async () => {
      const mockUser = {
        id: '1',
        email: 'test@example.com',
        password: 'hashedpassword',
        name: 'Test User',
        role: 'ADMIN' as const,
        createdAt: new Date(),
        updatedAt: new Date(),
        emailVerified: null,
        image: null,
        firstName: null,
        lastName: null,
        phone: null,
        sessionsInvalidatedAt: null,
      };

      mockPrisma.user.findUnique.mockResolvedValue(mockUser);
      vi.mocked(compare).mockResolvedValue(true);

      const result = await authorizeFunction(
        {
          email: 'test@example.com',
          password: 'test123',
        } as any,
        {} as any
      );

      expect(result).toEqual({
        id: '1',
        email: 'test@example.com',
        name: 'Test User',
        role: 'ADMIN',
      });
    });
  });

  describe('JWT Callback', () => {
    const jwtCallback = authOptions.callbacks?.jwt!;

    it('should add user id and role to token on sign in', async () => {
      const token = { sub: '1' };
      const user = { id: '1', role: 'ADMIN' };

      const result = await jwtCallback({
        token,
        user,
        trigger: 'signIn',
      } as any);

      expect(result).toEqual({
        sub: '1',
        id: '1',
        role: 'ADMIN',
      });
    });

    it('should return null if user no longer exists', async () => {
      const token = { id: '1', sub: '1', iat: 1000000 };

      mockPrisma.user.findUnique.mockResolvedValue(null);

      const result = await jwtCallback({
        token,
        trigger: 'update',
      } as any);

      expect(result).toBeNull();
    });

    it('should return null if session was invalidated', async () => {
      const token = { id: '1', sub: '1', iat: 1000 }; // JWT issued at timestamp 1000

      const invalidatedAt = new Date(2000 * 1000); // Invalidated at timestamp 2000

      mockPrisma.user.findUnique.mockResolvedValue({
        id: '1',
        email: 'test@example.com',
        password: 'hashedpassword',
        name: 'Test User',
        role: 'ADMIN',
        createdAt: new Date(),
        updatedAt: new Date(),
        emailVerified: null,
        image: null,
        firstName: null,
        lastName: null,
        phone: null,
        sessionsInvalidatedAt: invalidatedAt,
      });

      const result = await jwtCallback({
        token,
        trigger: 'update',
      } as any);

      expect(result).toBeNull();
    });

    it('should update role in token if changed', async () => {
      const token = { id: '1', sub: '1', role: 'CUSTOMER', iat: 2000 };

      mockPrisma.user.findUnique.mockResolvedValue({
        id: '1',
        email: 'test@example.com',
        password: 'hashedpassword',
        name: 'Test User',
        role: 'ADMIN',
        createdAt: new Date(),
        updatedAt: new Date(),
        emailVerified: null,
        image: null,
        firstName: null,
        lastName: null,
        phone: null,
        sessionsInvalidatedAt: new Date(1000 * 1000), // Before JWT was issued
      });

      const result = await jwtCallback({
        token,
        trigger: 'update',
      } as any);

      expect(result).toEqual({
        id: '1',
        sub: '1',
        role: 'ADMIN',
        iat: 2000,
      });
    });

    it('should return token as-is if no user id in token', async () => {
      const token = { sub: '1' };

      const result = await jwtCallback({
        token,
        trigger: 'update',
      } as any);

      expect(result).toEqual(token);
    });
  });

  describe('Session Callback', () => {
    const sessionCallback = authOptions.callbacks?.session!;

    it('should return null if token is null', async () => {
      const result = await sessionCallback({
        session: {
          user: { email: 'test@example.com' },
          expires: '2024-12-31',
        } as any,
        token: null as any,
      });

      expect(result).toBeNull();
    });

    it('should add user id and role to session', async () => {
      const session = {
        user: { email: 'test@example.com', name: 'Test' },
        expires: '2024-12-31',
      };

      const token = { id: '1', role: 'ADMIN', sub: '1' };

      const result = await sessionCallback({
        session: session as any,
        token: token as any,
      });

      expect(result).toEqual({
        user: {
          email: 'test@example.com',
          name: 'Test',
          id: '1',
          role: 'ADMIN',
        },
        expires: '2024-12-31',
      });
    });
  });
});
