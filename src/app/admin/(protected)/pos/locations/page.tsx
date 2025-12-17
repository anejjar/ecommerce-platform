import { requirePermission } from '@/lib/permission-guard';
import LocationsClient from './LocationsClient';

export default async function LocationsPage() {
  await requirePermission('POS', 'VIEW');
  return <LocationsClient />;
}
