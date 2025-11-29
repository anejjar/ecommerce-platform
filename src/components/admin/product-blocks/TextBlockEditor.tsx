'use client';

import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface TextBlockEditorProps {
  config: {
    content?: string;
    alignment?: 'left' | 'center' | 'right';
    textSize?: 'sm' | 'base' | 'lg' | 'xl';
  };
  onUpdate: (config: any) => void;
}

export function TextBlockEditor({ config, onUpdate }: TextBlockEditorProps) {
  const {
    content = '',
    alignment = 'left',
    textSize = 'base',
  } = config;

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label>Text Content</Label>
        <Textarea
          value={content}
          onChange={(e) => onUpdate({ ...config, content: e.target.value })}
          placeholder="Enter your text content..."
          rows={6}
          className="font-normal"
        />
      </div>

      <div className="space-y-2">
        <Label>Text Alignment</Label>
        <Select
          value={alignment}
          onValueChange={(value: 'left' | 'center' | 'right') => onUpdate({ ...config, alignment: value })}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="left">Left</SelectItem>
            <SelectItem value="center">Center</SelectItem>
            <SelectItem value="right">Right</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label>Text Size</Label>
        <Select
          value={textSize}
          onValueChange={(value: 'sm' | 'base' | 'lg' | 'xl') => onUpdate({ ...config, textSize: value })}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="sm">Small</SelectItem>
            <SelectItem value="base">Base</SelectItem>
            <SelectItem value="lg">Large</SelectItem>
            <SelectItem value="xl">Extra Large</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}

