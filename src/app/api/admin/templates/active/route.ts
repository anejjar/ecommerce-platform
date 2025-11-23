import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
    try {
        const searchParams = request.nextUrl.searchParams;
        const type = searchParams.get('type');

        if (!type) {
            return NextResponse.json({ error: 'Type is required' }, { status: 400 });
        }

        const template = await prisma.template.findFirst({
            where: {
                type: type as any,
                isActive: true,
            },
        });

        return NextResponse.json({ template });
    } catch (error) {
        console.error('Error fetching active template:', error);
        return NextResponse.json(
            { error: 'Failed to fetch active template' },
            { status: 500 }
        );
    }
}
