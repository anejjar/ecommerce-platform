import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import { Link } from '@/navigation';
import { prisma } from '@/lib/prisma';
import { PLACEHOLDER_PRODUCT_IMAGE } from '@/lib/image-utils';
import { format } from 'date-fns';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Header } from '@/components/public/Header';
import { Footer } from '@/components/public/Footer';

// Force dynamic rendering to avoid build-time database calls
export const dynamic = 'force-dynamic';

interface Props {
    params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { slug } = await params;
    const post = await prisma.blogPost.findUnique({
        where: { slug },
    });

    if (!post) {
        return {
            title: 'Post Not Found',
        };
    }

    return {
        title: post.seoTitle || post.title,
        description: post.seoDescription || post.excerpt,
    };
}

export default async function BlogPostPage({ params }: Props) {
    const { slug } = await params;
    const post = await prisma.blogPost.findUnique({
        where: { slug },
        include: {
            author: {
                select: { name: true },
            },
            category: true,
            tags: true,
        },
    });

    if (!post || post.status !== 'PUBLISHED') {
        notFound();
    }

    return (
        <div className="flex flex-col min-h-screen">
            <Header />
            <main className="flex-1">
                <article className="container mx-auto px-4 py-12">
                    <div className="max-w-3xl mx-auto space-y-8">
                        <Link href="/blog">
                            <Button variant="ghost" className="pl-0 hover:pl-0 hover:bg-transparent text-muted-foreground hover:text-foreground">
                                <ArrowLeft className="w-4 h-4 mr-2" />
                                Back to Blog
                            </Button>
                        </Link>

                        <div className="space-y-4 text-center">
                            {post.category && (
                                <span className="text-sm font-medium text-primary uppercase tracking-wider">
                                    {post.category.name}
                                </span>
                            )}
                            <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-balance">
                                {post.title}
                            </h1>
                            <div className="flex items-center justify-center gap-4 text-muted-foreground">
                                <span>{post.author.name || 'Admin'}</span>
                                <span>•</span>
                                <span>
                                    {post.publishedAt
                                        ? format(new Date(post.publishedAt), 'MMMM d, yyyy')
                                        : ''}
                                </span>
                            </div>
                        </div>

                        {post.featuredImage && (
                            <div className="relative aspect-video rounded-xl overflow-hidden shadow-lg">
                                <Image
                                    src={post.featuredImage || PLACEHOLDER_PRODUCT_IMAGE}
                                    alt={post.title}
                                    fill
                                    sizes="(max-width: 768px) 100vw, 800px"
                                    className="object-cover"
                                    priority
                                    onError={(e) => {
                                        const target = e.currentTarget;
                                        target.onerror = null;
                                        target.src = PLACEHOLDER_PRODUCT_IMAGE;
                                    }}
                                    unoptimized={post.featuredImage?.startsWith('data:') || false}
                                />
                            </div>
                        )}

                        <div
                            className="prose prose-lg dark:prose-invert mx-auto max-w-none"
                            dangerouslySetInnerHTML={{ __html: post.content }}
                        />

                        {post.tags.length > 0 && (
                            <div className="pt-8 border-t">
                                <div className="flex flex-wrap gap-2">
                                    {post.tags.map((tag) => (
                                        <span
                                            key={tag.id}
                                            className="px-3 py-1 bg-muted rounded-full text-sm text-muted-foreground"
                                        >
                                            #{tag.name}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </article>
            </main>
            <Footer />
        </div>
    );
}
