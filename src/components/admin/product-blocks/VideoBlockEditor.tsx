'use client';

import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';

interface VideoBlockEditorProps {
  config: {
    videoUrl?: string;
    heading?: string;
    description?: string;
    autoplay?: boolean;
    loop?: boolean;
  };
  onUpdate: (config: any) => void;
}

export function VideoBlockEditor({ config, onUpdate }: VideoBlockEditorProps) {
  const {
    videoUrl = '',
    heading = '',
    description = '',
    autoplay = false,
    loop = false,
  } = config;

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label>Video URL</Label>
        <Input
          value={videoUrl}
          onChange={(e) => onUpdate({ ...config, videoUrl: e.target.value })}
          placeholder="YouTube, Vimeo, or direct video URL"
        />
        <p className="text-xs text-gray-500">
          Supports YouTube, Vimeo, or direct video URLs (mp4, webm, ogg)
        </p>
      </div>

      <div className="space-y-2">
        <Label>Heading (Optional)</Label>
        <Input
          value={heading}
          onChange={(e) => onUpdate({ ...config, heading: e.target.value })}
          placeholder="Video heading"
        />
      </div>

      <div className="space-y-2">
        <Label>Description (Optional)</Label>
        <Textarea
          value={description}
          onChange={(e) => onUpdate({ ...config, description: e.target.value })}
          placeholder="Video description"
          rows={3}
        />
      </div>

      <div className="flex items-center justify-between">
        <Label htmlFor="autoplay">Autoplay</Label>
        <Switch
          id="autoplay"
          checked={autoplay}
          onCheckedChange={(checked) => onUpdate({ ...config, autoplay: checked })}
        />
      </div>

      <div className="flex items-center justify-between">
        <Label htmlFor="loop">Loop</Label>
        <Switch
          id="loop"
          checked={loop}
          onCheckedChange={(checked) => onUpdate({ ...config, loop: checked })}
        />
      </div>
    </div>
  );
}

