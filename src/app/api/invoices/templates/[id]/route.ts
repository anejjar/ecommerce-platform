import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { defaultInvoiceTemplates } from '@/lib/invoice-templates';

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { id } = await params;

        // Check if it's a system template
        const systemTemplate = defaultInvoiceTemplates.find(t => t.id === id);
        if (systemTemplate) {
            return NextResponse.json({
                id: systemTemplate.id,
                name: systemTemplate.name,
                description: systemTemplate.description,
                isDefault: false,
                isSystem: true,
                config: systemTemplate.config,
                previewImage: null,
                usageCount: 0,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
            });
        }

        // Get custom template from database
        const template = await prisma.invoiceTemplate.findUnique({
            where: { id },
        });

        if (!template) {
            return NextResponse.json({ error: 'Template not found' }, { status: 404 });
        }

        return NextResponse.json({
            ...template,
            config: typeof template.config === 'string' ? JSON.parse(template.config) : template.config,
        });
    } catch (error) {
        console.error('Error fetching template:', error);
        return NextResponse.json(
            { error: 'Failed to fetch template' },
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

        // System templates cannot be updated
        const systemTemplate = defaultInvoiceTemplates.find(t => t.id === id);
        if (systemTemplate) {
            return NextResponse.json(
                { error: 'System templates cannot be modified' },
                { status: 400 }
            );
        }

        const template = await prisma.invoiceTemplate.update({
            where: { id },
            data: {
                name: body.name,
                description: body.description,
                config: typeof body.config === 'string' ? body.config : JSON.stringify(body.config),
                previewImage: body.previewImage,
            },
        });

        return NextResponse.json({
            ...template,
            config: typeof template.config === 'string' ? JSON.parse(template.config) : template.config,
        });
    } catch (error) {
        console.error('Error updating template:', error);
        return NextResponse.json(
            { error: 'Failed to update template' },
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

        // System templates cannot be deleted
        const systemTemplate = defaultInvoiceTemplates.find(t => t.id === id);
        if (systemTemplate) {
            return NextResponse.json(
                { error: 'System templates cannot be deleted' },
                { status: 400 }
            );
        }

        await prisma.invoiceTemplate.delete({
            where: { id },
        });

        return NextResponse.json({ message: 'Template deleted successfully' });
    } catch (error) {
        console.error('Error deleting template:', error);
        return NextResponse.json(
            { error: 'Failed to delete template' },
            { status: 500 }
        );
    }
}

