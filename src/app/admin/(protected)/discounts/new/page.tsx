import { DiscountForm } from '@/components/admin/DiscountForm';
import { requirePermission } from '@/lib/permission-guard';

export default async function NewDiscountPage() {
    await requirePermission('DISCOUNT', 'CREATE');

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold">Create Discount Code</h1>
                <p className="text-gray-600 mt-2">Add a new discount code for your customers</p>
            </div>

            <DiscountForm />
        </div>
    );
}
