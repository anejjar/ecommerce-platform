import { requirePermission } from '@/lib/permission-guard';
import NewTemplateClient from './NewTemplateClient';

export default async function NewTemplatePage() {
  await requirePermission('TEMPLATE', 'CREATE');
  return <NewTemplateClient />;
}
