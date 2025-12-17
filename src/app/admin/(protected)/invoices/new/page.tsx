import { requirePermission } from '@/lib/permission-guard';
import NewInvoiceClient from './NewInvoiceClient';

export default async function NewInvoicePage() {
  await requirePermission('INVOICE', 'CREATE');
  return <NewInvoiceClient />;
}
