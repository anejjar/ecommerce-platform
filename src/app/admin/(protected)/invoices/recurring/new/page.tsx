import { requirePermission } from '@/lib/permission-guard';
import NewRecurringInvoiceClient from './NewRecurringInvoiceClient';

export default async function NewRecurringInvoicePage() {
  await requirePermission('INVOICE', 'CREATE');
  return <NewRecurringInvoiceClient />;
}
