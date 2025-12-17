import { requirePermission } from '@/lib/permission-guard';
import AccountsClient from './AccountsClient';

export default async function AccountsPage() {
  await requirePermission('LOYALTY', 'VIEW');
  return <AccountsClient />;
}
