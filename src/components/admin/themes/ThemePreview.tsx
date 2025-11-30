'use client';

import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Loader2 } from 'lucide-react';

interface ThemePreviewProps {
  themeId: string | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ThemePreview({ themeId, open, onOpenChange }: ThemePreviewProps) {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open && themeId) {
      // In a real implementation, you might want to generate a preview
      // For now, we'll just show a message
      setLoading(true);
      setTimeout(() => {
        setLoading(false);
        // Preview would be generated server-side or use a screenshot service
      }, 500);
    }
  }, [open, themeId]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>Theme Preview</DialogTitle>
          <DialogDescription>
            Preview how this theme will look on your storefront
          </DialogDescription>
        </DialogHeader>

        <div className="mt-4">
          {loading ? (
            <div className="flex items-center justify-center h-96">
              <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
            </div>
          ) : (
            <div className="border rounded-lg p-8 text-center text-muted-foreground">
              <p>Theme preview will be available here.</p>
              <p className="text-sm mt-2">
                Activate the theme to see it on your storefront.
              </p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

