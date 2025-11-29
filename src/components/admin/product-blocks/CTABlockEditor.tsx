'use client';

import { useState } from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { MediaPicker } from '@/components/media-manager/MediaPicker/MediaPicker';
import { Image as ImageIcon } from 'lucide-react';

interface CTABlockEditorProps {
  config: Record<string, any>;
  onUpdate: (config: Record<string, any>) => void;
}

export function CTABlockEditor({ config, onUpdate }: CTABlockEditorProps) {
  const [isMediaPickerOpen, setIsMediaPickerOpen] = useState(false);

  const handleChange = (field: string, value: any) => {
    onUpdate({ ...config, [field]: value });
  };

  const handleMediaSelect = (media: any[]) => {
    if (media.length > 0) {
      handleChange('backgroundImage', media[0].url);
    }
    setIsMediaPickerOpen(false);
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="heading">Heading</Label>
        <Input
          id="heading"
          value={config.heading || ''}
          onChange={(e) => handleChange('heading', e.target.value)}
          placeholder="Enter heading"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="text">Text</Label>
        <Textarea
          id="text"
          value={config.text || ''}
          onChange={(e) => handleChange('text', e.target.value)}
          placeholder="Enter compelling text"
          rows={3}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="buttonText">Button Text</Label>
        <Input
          id="buttonText"
          value={config.buttonText || ''}
          onChange={(e) => handleChange('buttonText', e.target.value)}
          placeholder="Get Started"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="buttonLink">Button Link</Label>
        <Input
          id="buttonLink"
          value={config.buttonLink || ''}
          onChange={(e) => handleChange('buttonLink', e.target.value)}
          placeholder="/shop"
        />
      </div>

      <div className="space-y-2">
        <Label>Background Image (optional)</Label>
        {config.backgroundImage ? (
          <div className="relative">
            <img src={config.backgroundImage} alt="Background" className="w-full h-48 object-cover rounded-lg" />
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="absolute top-2 right-2"
              onClick={() => handleChange('backgroundImage', '')}
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
            Select Background Image
          </Button>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="backgroundColor">Background Color</Label>
        <Input
          id="backgroundColor"
          type="color"
          value={config.backgroundColor || '#f3f4f6'}
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

