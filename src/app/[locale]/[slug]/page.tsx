import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { Header } from '@/components/public/Header';
import { Footer } from '@/components/public/Footer';

interface Props {
    params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { slug } = await params;
    const page = await prisma.page.findUnique({
        where: { slug },
    });

    if (!page) {
        return {
            title: 'Page Not Found',
        };
    }

    return {
        title: page.seoTitle || page.title,
        description: page.seoDescription,
    };
}

export default async function DynamicPage({ params }: Props) {
    const { slug } = await params;

    // Skip if slug is reserved (e.g. 'blog', 'admin', etc)
    if (['blog', 'admin', 'api'].includes(slug)) {
        notFound();
    }

    const page = await prisma.page.findUnique({
        where: { slug },
    });

    if (!page || page.status !== 'PUBLISHED') {
        notFound();
    }

    const Content = () => (
        <div className="container mx-auto px-4 py-12">
            <div className="max-w-4xl mx-auto space-y-8">
                <div className="text-center space-y-4">
                    <h1 className="text-4xl font-bold tracking-tight">{page.title}</h1>
                </div>

                <div
                    className="prose prose-lg dark:prose-invert mx-auto max-w-none"
                    dangerouslySetInnerHTML={{ __html: page.content }}
                />
            </div>
        </div>
    );

    if (page.useStorefrontLayout) {
        return (
            <div className="flex flex-col min-h-screen">
                <Header />
                <main className="flex-1">
                    <Content />
                </main>
                <Footer />
            </div>
        );
    }

    return <Content />;
}
