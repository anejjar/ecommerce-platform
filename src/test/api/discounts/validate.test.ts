import { describe, it, expect, vi, beforeEach } from 'vitest';
import { POST } from '@/app/api/discounts/validate/route';
import { prisma } from '@/lib/prisma';

// Mock Prisma
vi.mock('@/lib/prisma', () => ({
    prisma: {
        discountCode: {
            findUnique: vi.fn(),
        },
    },
}));

describe('Discount Validation API', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('should return error if code is missing', async () => {
        const req = new Request('http://localhost/api/discounts/validate', {
            method: 'POST',
            body: JSON.stringify({ cartTotal: 100 }),
        });
        const res = await POST(req);
        const data = await res.json();

        expect(res.status).toBe(400);
        expect(data.error).toBe('Code is required');
    });

    it('should return error if discount code not found', async () => {
        (prisma.discountCode.findUnique as any).mockResolvedValue(null);

        const req = new Request('http://localhost/api/discounts/validate', {
            method: 'POST',
            body: JSON.stringify({ code: 'INVALID', cartTotal: 100 }),
        });
        const res = await POST(req);
        const data = await res.json();

        expect(res.status).toBe(404);
        expect(data.error).toBe('Invalid discount code');
    });

    it('should return error if discount is inactive', async () => {
        (prisma.discountCode.findUnique as any).mockResolvedValue({
            code: 'INACTIVE',
            isActive: false,
        });

        const req = new Request('http://localhost/api/discounts/validate', {
            method: 'POST',
            body: JSON.stringify({ code: 'INACTIVE', cartTotal: 100 }),
        });
        const res = await POST(req);
        const data = await res.json();

        expect(res.status).toBe(400);
        expect(data.error).toBe('Discount code is inactive');
    });

    it('should validate percentage discount correctly', async () => {
        (prisma.discountCode.findUnique as any).mockResolvedValue({
            id: '1',
            code: 'SAVE10',
            type: 'PERCENTAGE',
            value: 10, // 10%
            isActive: true,
            startDate: new Date(Date.now() - 10000), // Started in past
            endDate: null,
            minOrderAmount: null,
            maxUses: null,
            usedCount: 0,
        });

        const req = new Request('http://localhost/api/discounts/validate', {
            method: 'POST',
            body: JSON.stringify({ code: 'SAVE10', cartTotal: 100 }),
        });
        const res = await POST(req);
        const data = await res.json();

        expect(res.status).toBe(200);
        expect(data.discountAmount).toBe(10); // 10% of 100
        expect(data.value).toBe(10);
    });

    it('should validate fixed amount discount correctly', async () => {
        (prisma.discountCode.findUnique as any).mockResolvedValue({
            id: '2',
            code: 'MINUS5',
            type: 'FIXED_AMOUNT',
            value: 5,
            isActive: true,
            startDate: new Date(Date.now() - 10000),
            endDate: null,
            minOrderAmount: null,
            maxUses: null,
            usedCount: 0,
        });

        const req = new Request('http://localhost/api/discounts/validate', {
            method: 'POST',
            body: JSON.stringify({ code: 'MINUS5', cartTotal: 100 }),
        });
        const res = await POST(req);
        const data = await res.json();

        expect(res.status).toBe(200);
        expect(data.discountAmount).toBe(5);
    });

    it('should enforce minimum order amount', async () => {
        (prisma.discountCode.findUnique as any).mockResolvedValue({
            id: '3',
            code: 'MIN100',
            type: 'FIXED_AMOUNT',
            value: 10,
            isActive: true,
            startDate: new Date(Date.now() - 10000),
            minOrderAmount: 100,
        });

        // Test with insufficient total
        const req1 = new Request('http://localhost/api/discounts/validate', {
            method: 'POST',
            body: JSON.stringify({ code: 'MIN100', cartTotal: 50 }),
        });
        const res1 = await POST(req1);
        const data1 = await res1.json();

        expect(res1.status).toBe(400);
        expect(data1.error).toContain('Minimum order amount');

        // Test with sufficient total
        const req2 = new Request('http://localhost/api/discounts/validate', {
            method: 'POST',
            body: JSON.stringify({ code: 'MIN100', cartTotal: 150 }),
        });
        const res2 = await POST(req2);
        expect(res2.status).toBe(200);
    });
});
