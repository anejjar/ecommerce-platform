import { requirePermission } from '@/lib/permission-guard';
import EditCategoryClient from './EditCategoryClient';

export default async function EditCategoryPage({ params }: { params: Promise<{ id: string }> }) {
  await requirePermission('CATEGORY', 'UPDATE');
  return <EditCategoryClient params={params} />;
}
