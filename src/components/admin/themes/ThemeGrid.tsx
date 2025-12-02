'use client';

import { ThemeCard } from './ThemeCard';

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

interface ThemeGridProps {
  themes: Theme[];
  onActivate: (id: string) => Promise<void>;
  onDeactivate: () => Promise<void>;
  onDelete: (id: string) => Promise<void>;
  onExport: (id: string) => void;
  onPreview: (id: string) => void;
}

export function ThemeGrid({
  themes,
  onActivate,
  onDeactivate,
  onDelete,
  onExport,
  onPreview,
}: ThemeGridProps) {
  if (themes.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">No themes found. Import a theme to get started.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {themes.map((theme) => (
        <ThemeCard
          key={theme.id}
          theme={theme}
          onActivate={onActivate}
          onDeactivate={onDeactivate}
          onDelete={onDelete}
          onExport={onExport}
          onPreview={onPreview}
        />
      ))}
    </div>
  );
}

