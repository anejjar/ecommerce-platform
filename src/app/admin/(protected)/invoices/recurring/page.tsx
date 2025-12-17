import { requirePermission } from '@/lib/permission-guard';
import RecurringInvoicesClient from './RecurringInvoicesClient';

export default async function RecurringInvoicesPage() {
  await requirePermission('INVOICE', 'VIEW');
  return <RecurringInvoicesClient />;
}
