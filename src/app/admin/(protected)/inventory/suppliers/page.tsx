import { requirePermission } from '@/lib/permission-guard';
import SuppliersClient from './SuppliersClient';

export default async function SuppliersPage() {
  await requirePermission('SUPPLIER', 'VIEW');
  return <SuppliersClient />;
}
