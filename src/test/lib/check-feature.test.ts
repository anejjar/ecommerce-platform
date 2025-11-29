import { describe, it, expect, vi, beforeEach } from 'vitest';
import { isFeatureEnabled } from '@/lib/check-feature';
import { prisma } from '@/lib/prisma';

// Mock Prisma
vi.mock('@/lib/prisma', () => ({
  prisma: {
    featureFlag: {
      findUnique: vi.fn(),
    },
  },
}));

describe('check-feature', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  describe('isFeatureEnabled', () => {
    it('should return true when feature is enabled', async () => {
      vi.mocked(prisma.featureFlag.findUnique).mockResolvedValue({
        id: '1',
        name: 'test-feature',
        enabled: true,
        description: 'Test feature',
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      const result = await isFeatureEnabled('test-feature');

      expect(result).toBe(true);
      expect(prisma.featureFlag.findUnique).toHaveBeenCalledWith({
        where: { name: 'test-feature' },
        select: { enabled: true },
      });
    });

    it('should return false when feature is disabled', async () => {
      vi.mocked(prisma.featureFlag.findUnique).mockResolvedValue({
        id: '1',
        name: 'test-feature',
        enabled: false,
        description: 'Test feature',
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      const result = await isFeatureEnabled('test-feature');

      expect(result).toBe(false);
    });

    it('should return false when feature does not exist', async () => {
      vi.mocked(prisma.featureFlag.findUnique).mockResolvedValue(null);

      const result = await isFeatureEnabled('non-existent-feature');

      expect(result).toBe(false);
    });

    it('should return false and log error on database error', async () => {
      const error = new Error('Database connection failed');
      vi.mocked(prisma.featureFlag.findUnique).mockRejectedValue(error);

      const result = await isFeatureEnabled('test-feature');

      expect(result).toBe(false);
      expect(console.error).toHaveBeenCalledWith(
        'Error checking feature test-feature:',
        error
      );
    });

    it('should handle feature with null enabled field', async () => {
      vi.mocked(prisma.featureFlag.findUnique).mockResolvedValue({
        id: '1',
        name: 'test-feature',
        enabled: null as any,
        description: 'Test feature',
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      const result = await isFeatureEnabled('test-feature');

      expect(result).toBe(false);
    });

    it('should handle empty feature name', async () => {
      vi.mocked(prisma.featureFlag.findUnique).mockResolvedValue(null);

      const result = await isFeatureEnabled('');

      expect(result).toBe(false);
      expect(prisma.featureFlag.findUnique).toHaveBeenCalledWith({
        where: { name: '' },
        select: { enabled: true },
      });
    });
  });
});
