import { requirePermission } from '@/lib/permission-guard';
import TemplatesClient from './TemplatesClient';

export default async function CmsTemplatesPage() {
  await requirePermission('TEMPLATE', 'VIEW');
  return <TemplatesClient />;
}
