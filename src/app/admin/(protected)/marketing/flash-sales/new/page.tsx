import { requirePermission } from '@/lib/permission-guard';
import NewFlashSaleClient from './NewFlashSaleClient';

export default async function NewFlashSalePage() {
  await requirePermission('FLASH_SALE', 'CREATE');
  return <NewFlashSaleClient />;
}
