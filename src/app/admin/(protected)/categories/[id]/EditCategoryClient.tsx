'use client';

import { useState, useEffect, use } from 'react';
import { CategoryForm } from '@/components/admin/CategoryForm';
import { CategoryTranslationManager } from '@/components/admin/CategoryTranslationManager';

export default function EditCategoryClient({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [category, setCategory] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchCategory();
  }, []);

  const fetchCategory = async () => {
    try {
      const response = await fetch(`/api/categories/${id}`);
      if (response.ok) {
        const data = await response.json();
        setCategory(data);
      }
    } catch (error) {
      console.error('Failed to fetch category');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <div className="text-center py-12">Loading...</div>;
  }

  if (!category) {
    return <div className="text-center py-12">Category not found</div>;
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Edit Category</h1>
        <p className="text-gray-600 mt-2">Update category details</p>
      </div>

      <CategoryForm mode="edit" category={category} />

      {/* Category Translations */}
      <CategoryTranslationManager categoryId={id} categoryName={category.name} />
    </div>
  );
}
