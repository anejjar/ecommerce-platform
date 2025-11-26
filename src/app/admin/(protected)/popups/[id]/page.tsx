'use client';

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import { PopupForm } from '@/components/admin/PopupForm';
import toast from 'react-hot-toast';

export default function EditPopupPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const [popup, setPopup] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPopup();
  }, [id]);

  const fetchPopup = async () => {
    try {
      const response = await fetch(`/api/admin/popups/${id}`);
      if (!response.ok) throw new Error('Failed to fetch popup');
      const data = await response.json();
      setPopup(data);
    } catch (error) {
      console.error('Error fetching popup:', error);
      toast.error('Failed to load popup');
      router.push('/admin/popups');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="p-8">Loading...</div>;
  }

  if (!popup) {
    return null;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Edit Popup</h1>
        <p className="text-muted-foreground mt-2">
          Update your popup configuration and design
        </p>
      </div>

      <PopupForm mode="edit" popup={popup} />
    </div>
  );
}
