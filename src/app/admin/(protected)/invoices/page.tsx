import { requirePermission } from '@/lib/permission-guard';
import InvoicesClient from './InvoicesClient';

export default async function InvoicesPage() {
  await requirePermission('INVOICE', 'VIEW');
  return <InvoicesClient />;
}
