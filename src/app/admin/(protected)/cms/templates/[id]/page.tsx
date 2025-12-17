import { requirePermission } from '@/lib/permission-guard';
import TemplateDetailClient from './TemplateDetailClient';

export default async function TemplateDetailPage({ params }: { params: Promise<{ id: string }> }) {
  await requirePermission('TEMPLATE', 'VIEW');
  return <TemplateDetailClient params={params} />;
}
