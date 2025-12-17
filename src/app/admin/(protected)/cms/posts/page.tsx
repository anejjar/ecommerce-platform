import { requirePermission } from '@/lib/permission-guard';
import PostsClient from './PostsClient';

export default async function BlogPostsPage() {
    await requirePermission('BLOG', 'VIEW');
    return <PostsClient />;
}
