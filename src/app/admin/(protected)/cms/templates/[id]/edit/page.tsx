import { requirePermission } from '@/lib/permission-guard';
import EditTemplateClient from './EditTemplateClient';

export default async function EditTemplatePage({ params }: { params: Promise<{ id: string }> }) {
  await requirePermission('TEMPLATE', 'UPDATE');
  return <EditTemplateClient params={params} />;
}
