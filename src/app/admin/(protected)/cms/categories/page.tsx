import { requirePermission } from '@/lib/permission-guard';
import CategoriesClient from './CategoriesClient';

export default async function CmsCategoriesPage() {
  await requirePermission('CMS', 'VIEW');
  return <CategoriesClient />;
}
