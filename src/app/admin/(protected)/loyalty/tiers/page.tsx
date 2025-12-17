import { requirePermission } from '@/lib/permission-guard';
import TiersClient from './TiersClient';

export default async function TiersPage() {
  await requirePermission('LOYALTY', 'VIEW');
  return <TiersClient />;
}
