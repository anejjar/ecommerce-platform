import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { RecurringFrequency } from '@/types/invoice';

export async function GET(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || !['ADMIN', 'SUPERADMIN', 'MANAGER'].includes(session.user.role)) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { searchParams } = new URL(request.url);
        const isActive = searchParams.get('isActive');

        const where: any = {};
        if (isActive !== null) {
            where.isActive = isActive === 'true';
        }

        const recurringInvoices = await prisma.recurringInvoice.findMany({
            where,
            include: {
                customer: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                    },
                },
                template: {
                    select: {
                        id: true,
                        name: true,
                    },
                },
                generatedInvoices: {
                    select: {
                        id: true,
                        invoiceNumber: true,
                        status: true,
                        total: true,
                        createdAt: true,
                    },
                    orderBy: {
                        createdAt: 'desc',
                    },
                    take: 5,
                },
            },
            orderBy: {
                createdAt: 'desc',
            },
        });

        return NextResponse.json(recurringInvoices);
    } catch (error) {
        console.error('Error fetching recurring invoices:', error);
        return NextResponse.json(
            { error: 'Failed to fetch recurring invoices' },
            { status: 500 }
        );
    }
}

export async function POST(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || !['ADMIN', 'SUPERADMIN', 'MANAGER'].includes(session.user.role)) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await request.json();
        const {
            name,
            description,
            customerId,
            customerEmail,
            frequency,
            interval,
            customInterval,
            dayOfMonth,
            dayOfWeek,
            templateId,
            invoiceSettings,
            startDate,
            endDate,
            autoSend,
        } = body;

        // Calculate next run date based on frequency
        const calculateNextRunDate = (start: Date, freq: RecurringFrequency, interval: number): Date => {
            const next = new Date(start);
            
            switch (freq) {
                case 'DAILY':
                    next.setDate(next.getDate() + interval);
                    break;
                case 'WEEKLY':
                    next.setDate(next.getDate() + (interval * 7));
                    if (dayOfWeek !== undefined) {
                        const currentDay = next.getDay();
                        const daysUntilTarget = (dayOfWeek - currentDay + 7) % 7;
                        next.setDate(next.getDate() + daysUntilTarget);
                    }
                    break;
                case 'MONTHLY':
                    next.setMonth(next.getMonth() + interval);
                    if (dayOfMonth !== undefined) {
                        next.setDate(dayOfMonth);
                    }
                    break;
                case 'QUARTERLY':
                    next.setMonth(next.getMonth() + (interval * 3));
                    if (dayOfMonth !== undefined) {
                        next.setDate(dayOfMonth);
                    }
                    break;
                case 'YEARLY':
                    next.setFullYear(next.getFullYear() + interval);
                    if (dayOfMonth !== undefined) {
                        next.setMonth(0); // January
                        next.setDate(dayOfMonth);
                    }
                    break;
                case 'CUSTOM':
                    if (customInterval) {
                        next.setDate(next.getDate() + customInterval);
                    }
                    break;
            }
            
            return next;
        };

        const start = new Date(startDate);
        const nextRunDate = calculateNextRunDate(start, frequency, interval);

        const recurringInvoice = await prisma.recurringInvoice.create({
            data: {
                name,
                description,
                customerId: customerId || null,
                customerEmail,
                frequency: frequency as RecurringFrequency,
                interval,
                customInterval,
                dayOfMonth,
                dayOfWeek,
                templateId: templateId || null,
                invoiceSettings: invoiceSettings ? JSON.stringify(invoiceSettings) : null,
                startDate: start,
                endDate: endDate ? new Date(endDate) : null,
                nextRunDate,
                isActive: true,
                autoSend: autoSend !== false,
                createdById: session.user.id,
            },
        });

        return NextResponse.json(recurringInvoice, { status: 201 });
    } catch (error) {
        console.error('Error creating recurring invoice:', error);
        return NextResponse.json(
            { error: 'Failed to create recurring invoice' },
            { status: 500 }
        );
    }
}

