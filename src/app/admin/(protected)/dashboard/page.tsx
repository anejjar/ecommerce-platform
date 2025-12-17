import { requirePermission } from '@/lib/permission-guard';
import { DashboardContent } from '@/components/admin/DashboardContent';

export default async function DashboardPage() {
  await requirePermission('ANALYTICS', 'VIEW');
  return <DashboardContent />;
}
