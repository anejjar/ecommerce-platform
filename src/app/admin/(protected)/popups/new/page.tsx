'use client';

import { PopupForm } from '@/components/admin/PopupForm';

export default function NewPopupPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Create Popup</h1>
        <p className="text-muted-foreground mt-2">
          Design a popup to capture leads and promote offers
        </p>
      </div>

      <PopupForm mode="create" />
    </div>
  );
}
