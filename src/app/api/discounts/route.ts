import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);

        if (!session || session.user.role !== 'ADMIN') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await req.json();
        const {
            code,
            type,
            value,
            minOrderAmount,
            maxUses,
            startDate,
            endDate,
            isActive,
        } = body;

        if (!code || !type || !value || !startDate) {
            return NextResponse.json(
                { error: 'Missing required fields' },
                { status: 400 }
            );
        }

        const existingDiscount = await prisma.discountCode.findUnique({
            where: { code },
        });

        if (existingDiscount) {
            return NextResponse.json(
                { error: 'Discount code already exists' },
                { status: 400 }
            );
        }

        const discount = await prisma.discountCode.create({
            data: {
                code,
                type,
                value,
                minOrderAmount: minOrderAmount ? parseFloat(minOrderAmount) : null,
                maxUses: maxUses ? parseInt(maxUses) : null,
                startDate: new Date(startDate),
                endDate: endDate ? new Date(endDate) : null,
                isActive,
            },
        });

        return NextResponse.json(discount);
    } catch (error) {
        console.error('Error creating discount:', error);
        return NextResponse.json(
            { error: 'Failed to create discount' },
            { status: 500 }
        );
    }
}

export async function GET(req: Request) {
    try {
        const session = await getServerSession(authOptions);

        if (!session || session.user.role !== 'ADMIN') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const discounts = await prisma.discountCode.findMany({
            orderBy: { createdAt: 'desc' },
        });

        return NextResponse.json(discounts);
    } catch (error) {
        console.error('Error fetching discounts:', error);
        return NextResponse.json(
            { error: 'Failed to fetch discounts' },
            { status: 500 }
        );
    }
}
