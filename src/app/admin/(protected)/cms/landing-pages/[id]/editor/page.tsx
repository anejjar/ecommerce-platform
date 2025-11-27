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
    const page = await prisma.landingPage.findUnique({
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

    if (!page) {
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
            page={page}
            templates={templates}
        />
    );
}
