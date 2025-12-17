import { requirePermission } from '@/lib/permission-guard';
import CashiersClient from './CashiersClient';

export default async function CashiersPage() {
  await requirePermission('POS', 'VIEW');
  return <CashiersClient />;
}
