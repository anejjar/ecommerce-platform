import { describe, it, expect, vi, beforeEach } from 'vitest';
import { POST } from '@/app/api/newsletter/subscribe/route';
import { prisma } from '@/lib/prisma';
import { sendEmail } from '@/lib/email';

// Mock Prisma
vi.mock('@/lib/prisma', () => ({
    prisma: {
        newsletterSubscriber: {
            findUnique: vi.fn(),
            create: vi.fn(),
            update: vi.fn(),
        },
    },
}));

// Mock sendEmail
vi.mock('@/lib/email', () => ({
    sendEmail: vi.fn(),
}));

describe('Newsletter Subscribe API', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('should return error if email is missing', async () => {
        const req = new Request('http://localhost/api/newsletter/subscribe', {
            method: 'POST',
            body: JSON.stringify({}),
        });

        const res = await POST(req);
        const data = await res.json();

        expect(res.status).toBe(400);
        expect(data.error).toBe('Email is required');
    });

    it('should return error for invalid email format', async () => {
        const req = new Request('http://localhost/api/newsletter/subscribe', {
            method: 'POST',
            body: JSON.stringify({ email: 'invalid-email' }),
        });

        const res = await POST(req);
        const data = await res.json();

        expect(res.status).toBe(400);
        expect(data.error).toBe('Invalid email format');
    });

    it('should return error if email is already subscribed', async () => {
        (prisma.newsletterSubscriber.findUnique as any).mockResolvedValue({
            id: '1',
            email: 'test@example.com',
            isActive: true,
        });

        const req = new Request('http://localhost/api/newsletter/subscribe', {
            method: 'POST',
            body: JSON.stringify({ email: 'test@example.com' }),
        });

        const res = await POST(req);
        const data = await res.json();

        expect(res.status).toBe(400);
        expect(data.error).toBe('Email is already subscribed');
    });

    it('should reactivate inactive subscription', async () => {
        (prisma.newsletterSubscriber.findUnique as any).mockResolvedValue({
            id: '1',
            email: 'test@example.com',
            name: 'Test User',
            isActive: false,
            source: 'footer',
        });

        (prisma.newsletterSubscriber.update as any).mockResolvedValue({
            id: '1',
            email: 'test@example.com',
            name: 'Test User',
            isActive: true,
        });

        const req = new Request('http://localhost/api/newsletter/subscribe', {
            method: 'POST',
            body: JSON.stringify({ email: 'test@example.com', name: 'Test User' }),
        });

        const res = await POST(req);
        const data = await res.json();

        expect(res.status).toBe(200);
        expect(data.message).toBe('Successfully resubscribed to newsletter');
        expect(prisma.newsletterSubscriber.update).toHaveBeenCalledWith({
            where: { email: 'test@example.com' },
            data: expect.objectContaining({
                isActive: true,
                unsubscribedAt: null,
            }),
        });
    });

    it('should create new subscription successfully', async () => {
        (prisma.newsletterSubscriber.findUnique as any).mockResolvedValue(null);
        (prisma.newsletterSubscriber.create as any).mockResolvedValue({
            id: '1',
            email: 'new@example.com',
            name: 'New User',
            isActive: true,
        });

        const req = new Request('http://localhost/api/newsletter/subscribe', {
            method: 'POST',
            body: JSON.stringify({
                email: 'new@example.com',
                name: 'New User',
                source: 'footer',
            }),
        });

        const res = await POST(req);
        const data = await res.json();

        expect(res.status).toBe(200);
        expect(data.message).toBe('Successfully subscribed to newsletter');
        expect(data.subscriber.email).toBe('new@example.com');
        expect(prisma.newsletterSubscriber.create).toHaveBeenCalledWith({
            data: {
                email: 'new@example.com',
                name: 'New User',
                source: 'footer',
                isActive: true,
            },
        });
        expect(sendEmail).toHaveBeenCalled();
    });
});
