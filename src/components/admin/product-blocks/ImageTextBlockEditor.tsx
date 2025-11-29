'use client';

import { useState } from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { MediaPicker } from '@/components/media-manager/MediaPicker/MediaPicker';
import { Image as ImageIcon } from 'lucide-react';

interface ImageTextBlockEditorProps {
  config: Record<string, any>;
  onUpdate: (config: Record<string, any>) => void;
}

export function ImageTextBlockEditor({ config, onUpdate }: ImageTextBlockEditorProps) {
  const [isMediaPickerOpen, setIsMediaPickerOpen] = useState(false);

  const handleChange = (field: string, value: any) => {
    onUpdate({ ...config, [field]: value });
  };

  const handleMediaSelect = (media: any[]) => {
    if (media.length > 0) {
      handleChange('image', media[0].url);
    }
    setIsMediaPickerOpen(false);
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label>Image</Label>
        {config.image ? (
          <div className="relative">
            <img src={config.image} alt="Preview" className="w-full h-48 object-cover rounded-lg" />
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="absolute top-2 right-2"
              onClick={() => handleChange('image', '')}
            >
              Remove
            </Button>
          </div>
        ) : (
          <Button
            type="button"
            variant="outline"
            onClick={() => setIsMediaPickerOpen(true)}
            className="w-full"
          >
            <ImageIcon className="w-4 h-4 mr-2" />
            Select Image
          </Button>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="imagePosition">Image Position</Label>
        <Select
          value={config.imagePosition || 'left'}
          onValueChange={(value) => handleChange('imagePosition', value)}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="left">Left</SelectItem>
            <SelectItem value="right">Right</SelectItem>
          </SelectContent>
        </Select>
      </div>

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
        <Label htmlFor="text">Text Content</Label>
        <Textarea
          id="text"
          value={config.text || ''}
          onChange={(e) => handleChange('text', e.target.value)}
          placeholder="Enter text content..."
          rows={6}
        />
        <p className="text-xs text-gray-500">You can use basic HTML formatting</p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="backgroundColor">Background Color</Label>
        <Input
          id="backgroundColor"
          type="color"
          value={config.backgroundColor || '#ffffff'}
          onChange={(e) => handleChange('backgroundColor', e.target.value)}
        />
      </div>

      <MediaPicker
        open={isMediaPickerOpen}
        onOpenChange={setIsMediaPickerOpen}
        onSelect={handleMediaSelect}
        type="IMAGE"
        multiple={false}
      />
    </div>
  );
}

