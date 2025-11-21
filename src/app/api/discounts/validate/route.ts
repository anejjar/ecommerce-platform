import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { code, cartTotal } = body;

        if (!code) {
            return NextResponse.json({ error: 'Code is required' }, { status: 400 });
        }

        const discount = await prisma.discountCode.findUnique({
            where: { code },
        });

        if (!discount) {
            return NextResponse.json({ error: 'Invalid discount code' }, { status: 404 });
        }

        if (!discount.isActive) {
            return NextResponse.json({ error: 'Discount code is inactive' }, { status: 400 });
        }

        const now = new Date();
        if (discount.startDate > now) {
            return NextResponse.json({ error: 'Discount code is not yet active' }, { status: 400 });
        }

        if (discount.endDate && discount.endDate < now) {
            return NextResponse.json({ error: 'Discount code has expired' }, { status: 400 });
        }

        if (discount.maxUses && discount.usedCount >= discount.maxUses) {
            return NextResponse.json({ error: 'Discount code usage limit reached' }, { status: 400 });
        }

        const total = parseFloat(cartTotal);
        if (discount.minOrderAmount && total < parseFloat(discount.minOrderAmount.toString())) {
            return NextResponse.json(
                { error: `Minimum order amount of $${discount.minOrderAmount} required` },
                { status: 400 }
            );
        }

        // Calculate discount amount
        let discountAmount = 0;
        if (discount.type === 'PERCENTAGE') {
            discountAmount = (total * parseFloat(discount.value.toString())) / 100;
        } else {
            discountAmount = parseFloat(discount.value.toString());
        }

        // Ensure discount doesn't exceed total
        discountAmount = Math.min(discountAmount, total);

        return NextResponse.json({
            id: discount.id,
            code: discount.code,
            type: discount.type,
            value: parseFloat(discount.value.toString()),
            discountAmount,
        });
    } catch (error) {
        console.error('Error validating discount:', error);
        return NextResponse.json(
            { error: 'Failed to validate discount' },
            { status: 500 }
        );
    }
}
