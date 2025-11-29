'use client';

import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Plus, Trash2 } from 'lucide-react';

interface BenefitsBlockEditorProps {
  config: Record<string, any>;
  onUpdate: (config: Record<string, any>) => void;
}

export function BenefitsBlockEditor({ config, onUpdate }: BenefitsBlockEditorProps) {
  const benefits = config.benefits || [{ icon: '', title: '', description: '' }];

  const handleChange = (field: string, value: any) => {
    onUpdate({ ...config, [field]: value });
  };

  const updateBenefit = (index: number, field: string, value: string) => {
    const newBenefits = [...benefits];
    newBenefits[index] = { ...newBenefits[index], [field]: value };
    handleChange('benefits', newBenefits);
  };

  const addBenefit = () => {
    handleChange('benefits', [...benefits, { icon: '', title: '', description: '' }]);
  };

  const removeBenefit = (index: number) => {
    if (benefits.length > 1) {
      handleChange('benefits', benefits.filter((_: any, i: number) => i !== index));
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

      {config.layout === 'grid' && (
        <div className="space-y-2">
          <Label>Columns</Label>
          <Select
            value={String(config.columns || 2)}
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
      )}

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Label>Benefits</Label>
          <Button type="button" size="sm" onClick={addBenefit}>
            <Plus className="w-4 h-4 mr-1" />
            Add Benefit
          </Button>
        </div>

        {benefits.map((benefit: any, index: number) => (
          <div key={index} className="p-4 border rounded-lg space-y-3">
            <div className="flex items-center justify-between">
              <Label className="text-sm">Benefit {index + 1}</Label>
              {benefits.length > 1 && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => removeBenefit(index)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              )}
            </div>

            <div className="space-y-2">
              <Label className="text-xs">Icon (Emoji or Unicode)</Label>
              <Input
                value={benefit.icon || ''}
                onChange={(e) => updateBenefit(index, 'icon', e.target.value)}
                placeholder="✨"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-xs">Title</Label>
              <Input
                value={benefit.title || ''}
                onChange={(e) => updateBenefit(index, 'title', e.target.value)}
                placeholder="Benefit title"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-xs">Description</Label>
              <Textarea
                value={benefit.description || ''}
                onChange={(e) => updateBenefit(index, 'description', e.target.value)}
                placeholder="Benefit description"
                rows={2}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

