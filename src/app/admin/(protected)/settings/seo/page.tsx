import { requirePermission } from '@/lib/permission-guard';
import SeoClient from './SeoClient';

export default async function SeoSettingsPage() {
  await requirePermission('SEO', 'VIEW');
  return <SeoClient />;
}
