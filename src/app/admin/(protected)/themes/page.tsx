'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ThemeGrid } from '@/components/admin/themes/ThemeGrid';
import { ThemeImporter } from '@/components/admin/themes/ThemeImporter';
import { ThemePreview } from '@/components/admin/themes/ThemePreview';
import FeatureGateLayout from '@/components/admin/FeatureGateLayout';
import { Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';

interface Theme {
  id: string;
  name: string;
  displayName: string;
  description: string | null;
  version: string;
  author: string | null;
  previewImage: string | null;
  isBuiltIn: boolean;
  isActive: boolean;
}

export default function ThemesPage() {
  const [themes, setThemes] = useState<Theme[]>([]);
  const [loading, setLoading] = useState(true);
  const [previewThemeId, setPreviewThemeId] = useState<string | null>(null);
  const [previewOpen, setPreviewOpen] = useState(false);

  useEffect(() => {
    fetchThemes();
  }, []);

  const fetchThemes = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/admin/themes');
      if (!response.ok) {
        throw new Error('Failed to fetch themes');
      }
      const data = await response.json();
      setThemes(data.themes || []);
    } catch (error) {
      console.error('Error fetching themes:', error);
      toast.error('Failed to load themes');
    } finally {
      setLoading(false);
    }
  };

  const handleActivate = async (id: string) => {
    try {
      const response = await fetch(`/api/admin/themes/${id}/activate`, {
        method: 'PATCH',
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to activate theme');
      }

      // Refresh themes list
      await fetchThemes();
    } catch (error) {
      throw error;
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`/api/admin/themes/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to delete theme');
      }

      // Refresh themes list
      await fetchThemes();
    } catch (error) {
      throw error;
    }
  };

  const handleExport = (id: string) => {
    window.open(`/api/admin/themes/export/${id}`, '_blank');
  };

  const handlePreview = (id: string) => {
    setPreviewThemeId(id);
    setPreviewOpen(true);
  };

  const handleImport = async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch('/api/admin/themes/import', {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to import theme');
    }

    // Refresh themes list
    await fetchThemes();
  };

  return (
    <FeatureGateLayout
      featureName="storefront_themes"
      featureDisplayName="Storefront Themes"
    >
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Storefront Themes</h1>
            <p className="text-muted-foreground mt-1">
              Manage and customize your storefront appearance
            </p>
          </div>
          <ThemeImporter onImport={handleImport} />
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <ThemeGrid
            themes={themes}
            onActivate={handleActivate}
            onDelete={handleDelete}
            onExport={handleExport}
            onPreview={handlePreview}
          />
        )}

        <ThemePreview
          themeId={previewThemeId}
          open={previewOpen}
          onOpenChange={setPreviewOpen}
        />
      </div>
    </FeatureGateLayout>
  );
}

