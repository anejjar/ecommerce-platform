import { requirePermission } from '@/lib/permission-guard';
import TemplatesClient from './TemplatesClient';

export default async function EmailTemplatesPage() {
  await requirePermission('EMAIL_CAMPAIGN', 'VIEW');
  return <TemplatesClient />;
}
