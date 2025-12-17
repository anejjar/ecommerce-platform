import { requirePermission } from '@/lib/permission-guard';
import FlashSaleDetailClient from './FlashSaleDetailClient';

export default async function FlashSaleDetailPage({ params }: { params: Promise<{ id: string }> }) {
  await requirePermission('FLASH_SALE', 'VIEW');
  return <FlashSaleDetailClient params={params} />;
}
