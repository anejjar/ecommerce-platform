'use client';

import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Trash2 } from 'lucide-react';

interface StatsBlockEditorProps {
  config: Record<string, any>;
  onUpdate: (config: Record<string, any>) => void;
}

export function StatsBlockEditor({ config, onUpdate }: StatsBlockEditorProps) {
  const stats = config.stats || [{ value: '', label: '', icon: '' }];

  const handleChange = (field: string, value: any) => {
    onUpdate({ ...config, [field]: value });
  };

  const updateStat = (index: number, field: string, value: string) => {
    const newStats = [...stats];
    newStats[index] = { ...newStats[index], [field]: value };
    handleChange('stats', newStats);
  };

  const addStat = () => {
    handleChange('stats', [...stats, { value: '', label: '', icon: '' }]);
  };

  const removeStat = (index: number) => {
    if (stats.length > 1) {
      handleChange('stats', stats.filter((_: any, i: number) => i !== index));
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
            value={String(config.columns || 4)}
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
          <Label>Statistics</Label>
          <Button type="button" size="sm" onClick={addStat}>
            <Plus className="w-4 h-4 mr-1" />
            Add Stat
          </Button>
        </div>

        {stats.map((stat: any, index: number) => (
          <div key={index} className="p-4 border rounded-lg space-y-3">
            <div className="flex items-center justify-between">
              <Label className="text-sm">Stat {index + 1}</Label>
              {stats.length > 1 && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => removeStat(index)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              )}
            </div>

            <div className="space-y-2">
              <Label className="text-xs">Icon (Emoji or Unicode)</Label>
              <Input
                value={stat.icon || ''}
                onChange={(e) => updateStat(index, 'icon', e.target.value)}
                placeholder="📊"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-xs">Value</Label>
              <Input
                value={stat.value || ''}
                onChange={(e) => updateStat(index, 'value', e.target.value)}
                placeholder="100%"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-xs">Label</Label>
              <Input
                value={stat.label || ''}
                onChange={(e) => updateStat(index, 'label', e.target.value)}
                placeholder="Satisfaction Rate"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

