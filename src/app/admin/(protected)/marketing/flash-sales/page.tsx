import { requirePermission } from '@/lib/permission-guard';
import FlashSalesClient from './FlashSalesClient';

export default async function FlashSalesPage() {
    await requirePermission('FLASH_SALE', 'VIEW');
    return <FlashSalesClient />;
}
