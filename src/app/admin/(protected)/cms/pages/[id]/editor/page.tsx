import React from 'react';
import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { PageEditor } from '@/components/admin/cms/editor/PageEditor';

interface EditorPageProps {
    params: Promise<{
        id: string;
    }>;
}

export default async function EditorPage({ params }: EditorPageProps) {
    const { id } = await params;

    // Debug logging
    console.log('----------------------------------------');
    console.log('[EditorPage] Debugging 404 error');
    console.log('[EditorPage] Route params id:', id);
    console.log('----------------------------------------');

    const page = await prisma.page.findUnique({
        where: { id },
        include: {
            blocks: {
                include: {
                    template: true
                },
                orderBy: {
                    order: 'asc'
                }
            }
        }
    });

    console.log('[EditorPage] Page query result:', page ? 'Found' : 'Null');

    if (!page) {
        console.log('[EditorPage] Triggering notFound()');
        notFound();
    }

    const templates = await prisma.blockTemplate.findMany({
        where: {
            isActive: true
        },
        orderBy: {
            name: 'asc'
        }
    });

    return (
        <PageEditor
            page={{
                ...page,
                overridesStorefrontPage: page.overridesStorefrontPage ?? false,
                overriddenPageType: page.overriddenPageType || null,
            }}
            templates={templates}
        />
    );
}

