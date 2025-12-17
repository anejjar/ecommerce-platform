import { requirePermission } from '@/lib/permission-guard';
import InvoiceDetailClient from './InvoiceDetailClient';

export default async function InvoiceDetailPage({ params }: { params: Promise<{ id: string }> }) {
  await requirePermission('INVOICE', 'VIEW');
  return <InvoiceDetailClient params={params} />;
}
