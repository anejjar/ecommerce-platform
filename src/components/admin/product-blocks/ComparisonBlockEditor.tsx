'use client';

import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Plus, Trash2 } from 'lucide-react';

interface ComparisonBlockEditorProps {
  config: Record<string, any>;
  onUpdate: (config: Record<string, any>) => void;
}

export function ComparisonBlockEditor({ config, onUpdate }: ComparisonBlockEditorProps) {
  const columns = config.columns || [
    { title: 'Option 1', features: [] },
    { title: 'Option 2', features: [] },
  ];

  const handleChange = (field: string, value: any) => {
    onUpdate({ ...config, [field]: value });
  };

  const updateColumn = (index: number, field: string, value: any) => {
    const newColumns = [...columns];
    newColumns[index] = { ...newColumns[index], [field]: value };
    handleChange('columns', newColumns);
  };

  const addColumn = () => {
    handleChange('columns', [...columns, { title: '', features: [] }]);
  };

  const removeColumn = (index: number) => {
    if (columns.length > 1) {
      handleChange('columns', columns.filter((_: any, i: number) => i !== index));
    }
  };

  const addFeature = (colIndex: number) => {
    const newColumns = [...columns];
    if (!newColumns[colIndex].features) {
      newColumns[colIndex].features = [];
    }
    newColumns[colIndex].features.push('');
    handleChange('columns', newColumns);
  };

  const updateFeature = (colIndex: number, featureIndex: number, value: string) => {
    const newColumns = [...columns];
    newColumns[colIndex].features[featureIndex] = value;
    handleChange('columns', newColumns);
  };

  const removeFeature = (colIndex: number, featureIndex: number) => {
    const newColumns = [...columns];
    newColumns[colIndex].features = newColumns[colIndex].features.filter((_: any, i: number) => i !== featureIndex);
    handleChange('columns', newColumns);
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

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Label>Comparison Columns</Label>
          <Button type="button" size="sm" onClick={addColumn}>
            <Plus className="w-4 h-4 mr-1" />
            Add Column
          </Button>
        </div>

        {columns.map((column: any, colIndex: number) => (
          <div key={colIndex} className="p-4 border rounded-lg space-y-3">
            <div className="flex items-center justify-between">
              <Label className="text-sm">Column {colIndex + 1}</Label>
              {columns.length > 1 && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => removeColumn(colIndex)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              )}
            </div>

            <div className="space-y-2">
              <Label className="text-xs">Column Title</Label>
              <Input
                value={column.title || ''}
                onChange={(e) => updateColumn(colIndex, 'title', e.target.value)}
                placeholder="Column title"
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label className="text-xs">Features</Label>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => addFeature(colIndex)}
                >
                  <Plus className="w-3 h-3 mr-1" />
                  Add Feature
                </Button>
              </div>

              {(column.features || []).map((feature: string, featureIndex: number) => (
                <div key={featureIndex} className="flex gap-2">
                  <Input
                    value={feature}
                    onChange={(e) => updateFeature(colIndex, featureIndex, e.target.value)}
                    placeholder={`Feature ${featureIndex + 1}`}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeFeature(colIndex, featureIndex)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

