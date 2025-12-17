import { requirePermission } from '@/lib/permission-guard';
import BulkUpdateClient from './BulkUpdateClient';

export default async function BulkUpdatePage() {
  await requirePermission('INVENTORY', 'UPDATE');
  return <BulkUpdateClient />;
}
