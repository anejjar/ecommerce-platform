import { CategoryForm } from '@/components/admin/CategoryForm';

export default function NewCategoryPage() {
  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Add New Category</h1>
        <p className="text-gray-600 mt-2">Create a new product category</p>
      </div>

      <CategoryForm mode="create" />
    </div>
  );
}
