import { requirePermission } from '@/lib/permission-guard';
import PostDetailClient from './PostDetailClient';

export default async function PostDetailPage({ params }: { params: Promise<{ id: string }> }) {
  await requirePermission('BLOG', 'VIEW');
  return <PostDetailClient params={params} />;
}
