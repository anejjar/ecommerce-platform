import { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { prisma } from '@/lib/prisma';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import { Header } from '@/components/public/Header';
import { Footer } from '@/components/public/Footer';

export const metadata: Metadata = {
    title: 'Blog | Our Store',
    description: 'Read our latest news and articles.',
};

async function getPosts(page: number, search: string) {
    const limit = 9;
    const skip = (page - 1) * limit;

    const where: any = {
        status: 'PUBLISHED',
    };

    if (search) {
        where.OR = [
            { title: { contains: search } },
            { content: { contains: search } },
        ];
    }

    const [posts, total] = await Promise.all([
        prisma.blogPost.findMany({
            where,
            skip,
            take: limit,
            orderBy: { publishedAt: 'desc' },
            include: {
                author: {
                    select: { name: true },
                },
                category: true,
            },
        }),
        prisma.blogPost.count({ where }),
    ]);

    return {
        posts,
        pagination: {
            total,
            pages: Math.ceil(total / limit),
            page,
            limit,
        },
    };
}

export default async function BlogPage({
    searchParams,
}: {
    searchParams: Promise<{ page?: string; search?: string }>;
}) {
    const { page: pageParam, search: searchParam } = await searchParams;
    const page = parseInt(pageParam || '1');
    const search = searchParam || '';
    const { posts, pagination } = await getPosts(page, search);

    return (
        <div className="flex flex-col min-h-screen">
            <Header />
            <main className="flex-1">
                <div className="container mx-auto px-4 py-12">
                    <div className="max-w-4xl mx-auto space-y-8">
                        <div className="text-center space-y-4">
                            <h1 className="text-4xl font-bold tracking-tight">Our Blog</h1>
                            <p className="text-lg text-muted-foreground">
                                Latest news, updates, and stories from our team.
                            </p>
                        </div>

                        <form className="flex gap-2 max-w-md mx-auto">
                            <div className="relative flex-1">
                                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                <Input
                                    name="search"
                                    defaultValue={search}
                                    placeholder="Search articles..."
                                    className="pl-9"
                                />
                            </div>
                            <Button type="submit">Search</Button>
                        </form>

                        {posts.length === 0 ? (
                            <div className="text-center py-12">
                                <p className="text-muted-foreground">No posts found.</p>
                            </div>
                        ) : (
                            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                                {posts.map((post) => (
                                    <Link
                                        key={post.id}
                                        href={`/blog/${post.slug}`}
                                        className="group flex flex-col border rounded-lg overflow-hidden hover:shadow-lg transition-shadow"
                                    >
                                        {post.featuredImage ? (
                                            <div className="relative aspect-video">
                                                <Image
                                                    src={post.featuredImage}
                                                    alt={post.title}
                                                    fill
                                                    className="object-cover transition-transform group-hover:scale-105"
                                                />
                                            </div>
                                        ) : (
                                            <div className="aspect-video bg-muted flex items-center justify-center">
                                                <span className="text-muted-foreground">No Image</span>
                                            </div>
                                        )}
                                        <div className="flex-1 p-6 space-y-4">
                                            <div className="space-y-2">
                                                {post.category && (
                                                    <span className="text-xs font-medium text-primary uppercase tracking-wider">
                                                        {post.category.name}
                                                    </span>
                                                )}
                                                <h2 className="text-xl font-bold group-hover:text-primary transition-colors line-clamp-2">
                                                    {post.title}
                                                </h2>
                                            </div>
                                            <p className="text-muted-foreground line-clamp-3 text-sm">
                                                {post.excerpt || post.content.substring(0, 150) + '...'}
                                            </p>
                                            <div className="flex items-center justify-between text-xs text-muted-foreground pt-4 mt-auto border-t">
                                                <span>{post.author.name || 'Admin'}</span>
                                                <span>
                                                    {post.publishedAt
                                                        ? format(new Date(post.publishedAt), 'MMM d, yyyy')
                                                        : ''}
                                                </span>
                                            </div>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        )}

                        {pagination.pages > 1 && (
                            <div className="flex justify-center gap-2 pt-8">
                                {page > 1 && (
                                    <Link href={`/blog?page=${page - 1}${search ? `&search=${search}` : ''}`}>
                                        <Button variant="outline">Previous</Button>
                                    </Link>
                                )}
                                <span className="flex items-center px-4 text-sm text-muted-foreground">
                                    Page {page} of {pagination.pages}
                                </span>
                                {page < pagination.pages && (
                                    <Link href={`/blog?page=${page + 1}${search ? `&search=${search}` : ''}`}>
                                        <Button variant="outline">Next</Button>
                                    </Link>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
}
