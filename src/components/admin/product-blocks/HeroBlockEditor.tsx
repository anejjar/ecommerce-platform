'use client';

import { useState } from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { MediaPicker } from '@/components/media-manager/MediaPicker/MediaPicker';
import { Image as ImageIcon } from 'lucide-react';

interface HeroBlockEditorProps {
  config: Record<string, any>;
  onUpdate: (config: Record<string, any>) => void;
}

export function HeroBlockEditor({ config, onUpdate }: HeroBlockEditorProps) {
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
        <Label htmlFor="headline">Headline *</Label>
        <Input
          id="headline"
          value={config.headline || ''}
          onChange={(e) => handleChange('headline', e.target.value)}
          placeholder="Enter headline"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="subheadline">Subheadline</Label>
        <Input
          id="subheadline"
          value={config.subheadline || ''}
          onChange={(e) => handleChange('subheadline', e.target.value)}
          placeholder="Enter subheadline (optional)"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="ctaText">CTA Button Text</Label>
        <Input
          id="ctaText"
          value={config.ctaText || ''}
          onChange={(e) => handleChange('ctaText', e.target.value)}
          placeholder="Shop Now"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="ctaLink">CTA Button Link</Label>
        <Input
          id="ctaLink"
          value={config.ctaLink || ''}
          onChange={(e) => handleChange('ctaLink', e.target.value)}
          placeholder="/shop"
        />
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

