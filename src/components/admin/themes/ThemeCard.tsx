'use client';

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Check, Download, Trash2, Eye, Sparkles } from 'lucide-react';
import Image from 'next/image';
import { useState } from 'react';
import toast from 'react-hot-toast';

interface ThemeCardProps {
  theme: {
    id: string;
    name: string;
    displayName: string;
    description: string | null;
    version: string;
    author: string | null;
    previewImage: string | null;
    isBuiltIn: boolean;
    isActive: boolean;
  };
  onActivate: (id: string) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
  onExport: (id: string) => void;
  onPreview: (id: string) => void;
}

export function ThemeCard({
  theme,
  onActivate,
  onDelete,
  onExport,
  onPreview,
}: ThemeCardProps) {
  const [activating, setActivating] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const handleActivate = async () => {
    try {
      setActivating(true);
      await onActivate(theme.id);
      toast.success(`Theme "${theme.displayName}" activated`);
    } catch (error) {
      toast.error('Failed to activate theme');
    } finally {
      setActivating(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm(`Are you sure you want to delete "${theme.displayName}"?`)) {
      return;
    }

    try {
      setDeleting(true);
      await onDelete(theme.id);
      toast.success('Theme deleted');
    } catch (error) {
      toast.error('Failed to delete theme');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <Card className={`relative overflow-hidden ${theme.isActive ? 'ring-2 ring-primary' : ''}`}>
      {theme.isActive && (
        <div className="absolute top-2 right-2 z-10">
          <Badge className="bg-primary text-primary-foreground">
            <Check className="w-3 h-3 mr-1" />
            Active
          </Badge>
        </div>
      )}
      
      {theme.isBuiltIn && (
        <div className="absolute top-2 left-2 z-10">
          <Badge variant="secondary">
            <Sparkles className="w-3 h-3 mr-1" />
            Built-in
          </Badge>
        </div>
      )}

      <div className="relative h-48 bg-muted overflow-hidden">
        {theme.previewImage ? (
          <Image
            src={theme.previewImage}
            alt={theme.displayName}
            fill
            className="object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/10 to-secondary/10">
            <div className="text-center">
              <div className="text-4xl mb-2">🎨</div>
              <p className="text-sm text-muted-foreground">{theme.displayName}</p>
            </div>
          </div>
        )}
      </div>

      <CardHeader>
        <CardTitle className="text-lg">{theme.displayName}</CardTitle>
        <CardDescription className="line-clamp-2">
          {theme.description || 'No description'}
        </CardDescription>
      </CardHeader>

      <CardContent>
        <div className="flex flex-col gap-2 text-sm text-muted-foreground">
          <div className="flex justify-between">
            <span>Version:</span>
            <span className="font-medium">{theme.version}</span>
          </div>
          {theme.author && (
            <div className="flex justify-between">
              <span>Author:</span>
              <span className="font-medium">{theme.author}</span>
            </div>
          )}
        </div>
      </CardContent>

      <CardFooter className="flex gap-2">
        {!theme.isActive && (
          <Button
            onClick={handleActivate}
            disabled={activating}
            className="flex-1"
            size="sm"
          >
            {activating ? 'Activating...' : 'Activate'}
          </Button>
        )}
        
        <Button
          onClick={() => onPreview(theme.id)}
          variant="outline"
          size="sm"
        >
          <Eye className="w-4 h-4" />
        </Button>

        <Button
          onClick={() => onExport(theme.id)}
          variant="outline"
          size="sm"
        >
          <Download className="w-4 h-4" />
        </Button>

        {!theme.isBuiltIn && (
          <Button
            onClick={handleDelete}
            disabled={deleting || theme.isActive}
            variant="destructive"
            size="sm"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}

