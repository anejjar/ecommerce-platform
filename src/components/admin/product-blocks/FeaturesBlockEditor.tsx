'use client';

import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Plus, Trash2 } from 'lucide-react';

interface FeaturesBlockEditorProps {
  config: Record<string, any>;
  onUpdate: (config: Record<string, any>) => void;
}

export function FeaturesBlockEditor({ config, onUpdate }: FeaturesBlockEditorProps) {
  const features = config.features || [{ icon: '', title: '', description: '' }];

  const handleChange = (field: string, value: any) => {
    onUpdate({ ...config, [field]: value });
  };

  const updateFeature = (index: number, field: string, value: string) => {
    const newFeatures = [...features];
    newFeatures[index] = { ...newFeatures[index], [field]: value };
    handleChange('features', newFeatures);
  };

  const addFeature = () => {
    handleChange('features', [...features, { icon: '', title: '', description: '' }]);
  };

  const removeFeature = (index: number) => {
    if (features.length > 1) {
      handleChange('features', features.filter((_: any, i: number) => i !== index));
    }
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
            <SelectItem value="list">List</SelectItem>
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

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Label>Features</Label>
          <Button type="button" variant="outline" size="sm" onClick={addFeature}>
            <Plus className="w-4 h-4 mr-1" />
            Add Feature
          </Button>
        </div>

        {features.map((feature: any, index: number) => (
          <div key={index} className="border rounded-lg p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Feature {index + 1}</span>
              {features.length > 1 && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => removeFeature(index)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              )}
            </div>
            <div className="space-y-2">
              <Input
                placeholder="Icon (emoji or text)"
                value={feature.icon || ''}
                onChange={(e) => updateFeature(index, 'icon', e.target.value)}
              />
              <Input
                placeholder="Title"
                value={feature.title || ''}
                onChange={(e) => updateFeature(index, 'title', e.target.value)}
              />
              <Textarea
                placeholder="Description"
                value={feature.description || ''}
                onChange={(e) => updateFeature(index, 'description', e.target.value)}
                rows={2}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

