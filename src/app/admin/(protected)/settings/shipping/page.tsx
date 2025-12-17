import { requirePermission } from '@/lib/permission-guard';
import ShippingClient from './ShippingClient';

export default async function ShippingSettingsPage() {
  await requirePermission('SETTINGS', 'VIEW');
  return <ShippingClient />;
}
