import { requirePermission } from '@/lib/permission-guard';
import ExportClient from './ExportClient';

export default async function ExportPage() {
  await requirePermission('EXPORT', 'VIEW');
  return <ExportClient />;
}
