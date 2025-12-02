import React from 'react';
import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { BlockRenderer } from '@/components/blocks/BlockRenderer';
import { Metadata } from 'next';
import { PageOverrideRenderer } from '@/components/public/PageOverrideRenderer';

interface PageProps {
    params: Promise<{
        locale: string;
        slug: string;
    }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { slug } = await params;

    const page = await prisma.page.findUnique({
        where: {
            slug,
            status: 'PUBLISHED'
        },
        select: {
            title: true,
            seoTitle: true,
            seoDescription: true,
            seoKeywords: true,
            ogImage: true,
            ogTitle: true,
            ogDescription: true,
        }
    });

    if (!page) {
        return {
            title: 'Page Not Found'
        };
    }

    return {
        title: page.seoTitle || page.title,
        description: page.seoDescription || undefined,
        keywords: page.seoKeywords || undefined,
        openGraph: {
            title: page.ogTitle || page.seoTitle || page.title,
            description: page.ogDescription || page.seoDescription || undefined,
            images: page.ogImage ? [page.ogImage] : undefined,
        }
    };
}

export default async function Page({ params }: PageProps) {
    const { slug } = await params;

    const page = await prisma.page.findUnique({
        where: {
            slug,
            status: 'PUBLISHED'
        },
        include: {
            blocks: {
                include: {
                    template: {
                        select: {
                            id: true,
                            name: true,
                            slug: true,
                            category: true,
                            componentCode: true,
                        }
                    }
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

    // Increment view count
    await prisma.page.update({
        where: { id: page.id },
        data: {
            viewCount: {
                increment: 1
            }
        }
    });

    return <PageOverrideRenderer page={page} />;
}
