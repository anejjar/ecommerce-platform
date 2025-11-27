import React from 'react';
import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { BlockRenderer } from '@/components/blocks/BlockRenderer';
import { Metadata } from 'next';

interface LandingPageProps {
    params: Promise<{
        locale: string;
        slug: string;
    }>;
}

export async function generateMetadata({ params }: LandingPageProps): Promise<Metadata> {
    const { slug } = await params;

    const page = await prisma.landingPage.findUnique({
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

export default async function LandingPage({ params }: LandingPageProps) {
    const { slug } = await params;

    const page = await prisma.landingPage.findUnique({
        where: {
            slug,
            status: 'PUBLISHED'
        },
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

    // Increment view count
    await prisma.landingPage.update({
        where: { id: page.id },
        data: {
            viewCount: {
                increment: 1
            }
        }
    });

    return (
        <div className="min-h-screen">
            {/* Custom CSS */}
            {page.customCss && (
                <style dangerouslySetInnerHTML={{ __html: page.customCss }} />
            )}

            {/* Render blocks */}
            {page.blocks.map((block) => (
                <BlockRenderer key={block.id} block={block} />
            ))}

            {/* Custom JS */}
            {page.customJs && (
                <script dangerouslySetInnerHTML={{ __html: page.customJs }} />
            )}
        </div>
    );
}
