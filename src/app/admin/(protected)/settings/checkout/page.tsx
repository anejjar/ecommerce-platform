import { requirePermission } from '@/lib/permission-guard';
import CheckoutClient from './CheckoutClient';

export default async function CheckoutSettingsPage() {
  await requirePermission('SETTINGS', 'VIEW');
  return <CheckoutClient />;
}
