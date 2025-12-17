import { requirePermission } from '@/lib/permission-guard';
import PageDetailClient from './PageDetailClient';

export default async function PageDetailPage({ params }: { params: Promise<{ id: string }> }) {
  await requirePermission('PAGE', 'VIEW');
  return <PageDetailClient params={params} />;
}
