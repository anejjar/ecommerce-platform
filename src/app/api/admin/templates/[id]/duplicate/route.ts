import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function POST(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await getServerSession(authOptions);

        if (!session || (session.user.role !== 'ADMIN' && session.user.role !== 'SUPERADMIN')) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { id } = await params;

        // Find the original template
        const originalTemplate = await prisma.template.findUnique({
            where: { id },
        });

        if (!originalTemplate) {
            return NextResponse.json({ error: 'Template not found' }, { status: 404 });
        }

        // Create duplicate with "(Copy)" appended to name
        const duplicateTemplate = await prisma.template.create({
            data: {
                name: `${originalTemplate.name} (Copy)`,
                type: originalTemplate.type,
                content: originalTemplate.content,
                variables: originalTemplate.variables,
                isActive: false, // Never activate duplicates by default
            },
        });

        return NextResponse.json({ template: duplicateTemplate });
    } catch (error) {
        console.error('Error duplicating template:', error);
        return NextResponse.json(
            { error: 'Failed to duplicate template' },
            { status: 500 }
        );
    }
}
