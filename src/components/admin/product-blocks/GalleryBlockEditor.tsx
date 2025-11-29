'use client';

import { useState } from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { MediaPicker } from '@/components/media-manager/MediaPicker/MediaPicker';
import { Image as ImageIcon, X } from 'lucide-react';

interface GalleryBlockEditorProps {
  config: Record<string, any>;
  onUpdate: (config: Record<string, any>) => void;
}

export function GalleryBlockEditor({ config, onUpdate }: GalleryBlockEditorProps) {
  const [isMediaPickerOpen, setIsMediaPickerOpen] = useState(false);
  const images = config.images || [];

  const handleChange = (field: string, value: any) => {
    onUpdate({ ...config, [field]: value });
  };

  const handleMediaSelect = (media: any[]) => {
    const newImages = [...images, ...media.map(m => m.url)];
    handleChange('images', newImages);
    setIsMediaPickerOpen(false);
  };

  const removeImage = (index: number) => {
    handleChange('images', images.filter((_: any, i: number) => i !== index));
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="heading">Heading</Label>
        <Input
          id="heading"
          value={config.heading || ''}
          onChange={(e) => handleChange('heading', e.target.value)}
          placeholder="Enter heading (optional)"
        />
      </div>

      <div className="space-y-2">
        <Label>Layout</Label>
        <Select
          value={config.layout || 'grid'}
          onValueChange={(value) => handleChange('layout', value)}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="grid">Grid</SelectItem>
            <SelectItem value="masonry">Masonry</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label>Columns</Label>
        <Select
          value={String(config.columns || 3)}
          onValueChange={(value) => handleChange('columns', parseInt(value))}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="2">2 Columns</SelectItem>
            <SelectItem value="3">3 Columns</SelectItem>
            <SelectItem value="4">4 Columns</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label>Images</Label>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setIsMediaPickerOpen(true)}
          >
            <ImageIcon className="w-4 h-4 mr-1" />
            Add Images
          </Button>
        </div>
        {images.length > 0 ? (
          <div className="grid grid-cols-3 gap-2">
            {images.map((image: string, index: number) => (
              <div key={index} className="relative aspect-square">
                <img src={image} alt={`Gallery ${index + 1}`} className="w-full h-full object-cover rounded" />
                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  className="absolute top-1 right-1 h-6 w-6 p-0"
                  onClick={() => removeImage(index)}
                >
                  <X className="w-3 h-3" />
                </Button>
              </div>
            ))}
          </div>
        ) : (
          <div className="border-2 border-dashed rounded-lg p-8 text-center text-gray-400">
            No images added yet
          </div>
        )}
      </div>

      <MediaPicker
        open={isMediaPickerOpen}
        onOpenChange={setIsMediaPickerOpen}
        onSelect={handleMediaSelect}
        type="IMAGE"
        multiple={true}
      />
    </div>
  );
}

