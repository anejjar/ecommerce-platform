import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { RecurringFrequency } from '@/types/invoice';

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || !['ADMIN', 'SUPERADMIN', 'MANAGER'].includes(session.user.role)) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { id } = await params;

        const recurringInvoice = await prisma.recurringInvoice.findUnique({
            where: { id },
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
                    orderBy: {
                        createdAt: 'desc',
                    },
                },
            },
        });

        if (!recurringInvoice) {
            return NextResponse.json({ error: 'Recurring invoice not found' }, { status: 404 });
        }

        return NextResponse.json(recurringInvoice);
    } catch (error) {
        console.error('Error fetching recurring invoice:', error);
        return NextResponse.json(
            { error: 'Failed to fetch recurring invoice' },
            { status: 500 }
        );
    }
}

export async function PUT(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || !['ADMIN', 'SUPERADMIN', 'MANAGER'].includes(session.user.role)) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { id } = await params;
        const body = await request.json();

        // Calculate next run date if frequency or dates changed
        let nextRunDate = body.nextRunDate;
        if (body.frequency && body.startDate) {
            const calculateNextRunDate = (start: Date, freq: RecurringFrequency, interval: number): Date => {
                const next = new Date(start);
                
                switch (freq) {
                    case 'DAILY':
                        next.setDate(next.getDate() + interval);
                        break;
                    case 'WEEKLY':
                        next.setDate(next.getDate() + (interval * 7));
                        if (body.dayOfWeek !== undefined) {
                            const currentDay = next.getDay();
                            const daysUntilTarget = (body.dayOfWeek - currentDay + 7) % 7;
                            next.setDate(next.getDate() + daysUntilTarget);
                        }
                        break;
                    case 'MONTHLY':
                        next.setMonth(next.getMonth() + interval);
                        if (body.dayOfMonth !== undefined) {
                            next.setDate(body.dayOfMonth);
                        }
                        break;
                    case 'QUARTERLY':
                        next.setMonth(next.getMonth() + (interval * 3));
                        if (body.dayOfMonth !== undefined) {
                            next.setDate(body.dayOfMonth);
                        }
                        break;
                    case 'YEARLY':
                        next.setFullYear(next.getFullYear() + interval);
                        if (body.dayOfMonth !== undefined) {
                            next.setMonth(0);
                            next.setDate(body.dayOfMonth);
                        }
                        break;
                    case 'CUSTOM':
                        if (body.customInterval) {
                            next.setDate(next.getDate() + body.customInterval);
                        }
                        break;
                }
                
                return next;
            };

            const start = new Date(body.startDate);
            nextRunDate = calculateNextRunDate(start, body.frequency, body.interval || 1);
        }

        const recurringInvoice = await prisma.recurringInvoice.update({
            where: { id },
            data: {
                ...body,
                nextRunDate: nextRunDate ? new Date(nextRunDate) : undefined,
                startDate: body.startDate ? new Date(body.startDate) : undefined,
                endDate: body.endDate ? new Date(body.endDate) : undefined,
                invoiceSettings: body.invoiceSettings ? JSON.stringify(body.invoiceSettings) : undefined,
            },
        });

        return NextResponse.json(recurringInvoice);
    } catch (error) {
        console.error('Error updating recurring invoice:', error);
        return NextResponse.json(
            { error: 'Failed to update recurring invoice' },
            { status: 500 }
        );
    }
}

export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || !['ADMIN', 'SUPERADMIN', 'MANAGER'].includes(session.user.role)) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { id } = await params;

        await prisma.recurringInvoice.delete({
            where: { id },
        });

        return NextResponse.json({ message: 'Recurring invoice deleted successfully' });
    } catch (error) {
        console.error('Error deleting recurring invoice:', error);
        return NextResponse.json(
            { error: 'Failed to delete recurring invoice' },
            { status: 500 }
        );
    }
}

