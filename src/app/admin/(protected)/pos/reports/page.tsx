import { requirePermission } from '@/lib/permission-guard';
import ReportsClient from './ReportsClient';

export default async function PosReportsPage() {
  await requirePermission('POS', 'VIEW');
  return <ReportsClient />;
}
