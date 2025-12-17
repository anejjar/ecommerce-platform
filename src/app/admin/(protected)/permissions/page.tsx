import { requirePermission } from '@/lib/permission-guard';
import { isFeatureEnabled } from '@/lib/features';
import { notFound } from 'next/navigation';
import PermissionsClient from './PermissionsClient';

export default async function PermissionsPage() {
  // Check if feature is enabled
  const featureEnabled = await isFeatureEnabled('multi_admin');
  if (!featureEnabled) {
    notFound();
  }

  // Only SUPERADMIN and ADMIN can manage permissions
  await requirePermission('ADMIN_USER', 'MANAGE');
  return <PermissionsClient />;
}
