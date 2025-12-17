import { requirePermission } from '@/lib/permission-guard';
import SupplierDetailClient from './SupplierDetailClient';

export default async function SupplierDetailPage({ params }: { params: Promise<{ id: string }> }) {
  await requirePermission('SUPPLIER', 'VIEW');
  return <SupplierDetailClient params={params} />;
}
