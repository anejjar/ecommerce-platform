import { requirePermission } from '@/lib/permission-guard';
import ReviewsClient from './ReviewsClient';

export default async function ReviewsPage() {
    await requirePermission('REVIEW', 'VIEW');
    return <ReviewsClient />;
}
