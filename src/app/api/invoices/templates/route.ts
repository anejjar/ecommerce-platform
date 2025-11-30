import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { defaultInvoiceTemplates } from '@/lib/invoice-templates';

export async function GET(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // Get system templates
        const systemTemplates = defaultInvoiceTemplates.map(t => ({
            id: t.id,
            name: t.name,
            description: t.description,
            isDefault: false,
            isSystem: true,
            config: t.config,
            previewImage: null,
            usageCount: 0,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        }));

        // Get custom templates from database
        const customTemplates = await prisma.invoiceTemplate.findMany({
            where: {
                isSystem: false,
            },
            orderBy: {
                createdAt: 'desc',
            },
        });

        // Combine system and custom templates
        const allTemplates = [
            ...systemTemplates,
            ...customTemplates.map(t => ({
                ...t,
                config: typeof t.config === 'string' ? JSON.parse(t.config) : t.config,
            })),
        ];

        return NextResponse.json({
            templates: allTemplates,
        });
    } catch (error) {
        console.error('Error fetching templates:', error);
        return NextResponse.json(
            { error: 'Failed to fetch templates' },
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
        const { name, description, config, previewImage } = body;

        if (!name || !config) {
            return NextResponse.json(
                { error: 'Name and config are required' },
                { status: 400 }
            );
        }

        const template = await prisma.invoiceTemplate.create({
            data: {
                name,
                description,
                isDefault: false,
                isSystem: false,
                config: typeof config === 'string' ? config : JSON.stringify(config),
                previewImage,
            },
        });

        return NextResponse.json(template, { status: 201 });
    } catch (error) {
        console.error('Error creating template:', error);
        return NextResponse.json(
            { error: 'Failed to create template' },
            { status: 500 }
        );
    }
}

