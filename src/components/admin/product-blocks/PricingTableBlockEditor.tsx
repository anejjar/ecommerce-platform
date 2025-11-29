'use client';

import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Plus, Trash2 } from 'lucide-react';

interface PricingTableBlockEditorProps {
  config: Record<string, any>;
  onUpdate: (config: Record<string, any>) => void;
}

export function PricingTableBlockEditor({ config, onUpdate }: PricingTableBlockEditorProps) {
  const plans = config.plans || [
    { name: '', price: '', features: [], ctaText: '', ctaLink: '', highlighted: false },
  ];

  const handleChange = (field: string, value: any) => {
    onUpdate({ ...config, [field]: value });
  };

  const updatePlan = (index: number, field: string, value: any) => {
    const newPlans = [...plans];
    newPlans[index] = { ...newPlans[index], [field]: value };
    handleChange('plans', newPlans);
  };

  const addPlan = () => {
    handleChange('plans', [...plans, { name: '', price: '', features: [], ctaText: '', ctaLink: '', highlighted: false }]);
  };

  const removePlan = (index: number) => {
    if (plans.length > 1) {
      handleChange('plans', plans.filter((_: any, i: number) => i !== index));
    }
  };

  const addFeature = (planIndex: number) => {
    const newPlans = [...plans];
    if (!newPlans[planIndex].features) {
      newPlans[planIndex].features = [];
    }
    newPlans[planIndex].features.push('');
    handleChange('plans', newPlans);
  };

  const updateFeature = (planIndex: number, featureIndex: number, value: string) => {
    const newPlans = [...plans];
    newPlans[planIndex].features[featureIndex] = value;
    handleChange('plans', newPlans);
  };

  const removeFeature = (planIndex: number, featureIndex: number) => {
    const newPlans = [...plans];
    newPlans[planIndex].features = newPlans[planIndex].features.filter((_: any, i: number) => i !== featureIndex);
    handleChange('plans', newPlans);
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
          <Label>Pricing Plans</Label>
          <Button type="button" size="sm" onClick={addPlan}>
            <Plus className="w-4 h-4 mr-1" />
            Add Plan
          </Button>
        </div>

        {plans.map((plan: any, planIndex: number) => (
          <div key={planIndex} className="p-4 border rounded-lg space-y-3">
            <div className="flex items-center justify-between">
              <Label className="text-sm">Plan {planIndex + 1}</Label>
              {plans.length > 1 && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => removePlan(planIndex)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              )}
            </div>

            <div className="space-y-2">
              <Label className="text-xs">Plan Name</Label>
              <Input
                value={plan.name || ''}
                onChange={(e) => updatePlan(planIndex, 'name', e.target.value)}
                placeholder="Basic Plan"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-xs">Price</Label>
              <Input
                value={plan.price || ''}
                onChange={(e) => updatePlan(planIndex, 'price', e.target.value)}
                placeholder="$29/month"
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label className="text-xs">Features</Label>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => addFeature(planIndex)}
                >
                  <Plus className="w-3 h-3 mr-1" />
                  Add Feature
                </Button>
              </div>

              {(plan.features || []).map((feature: string, featureIndex: number) => (
                <div key={featureIndex} className="flex gap-2">
                  <Input
                    value={feature}
                    onChange={(e) => updateFeature(planIndex, featureIndex, e.target.value)}
                    placeholder={`Feature ${featureIndex + 1}`}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeFeature(planIndex, featureIndex)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>

            <div className="space-y-2">
              <Label className="text-xs">CTA Button Text</Label>
              <Input
                value={plan.ctaText || ''}
                onChange={(e) => updatePlan(planIndex, 'ctaText', e.target.value)}
                placeholder="Get Started"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-xs">CTA Button Link</Label>
              <Input
                value={plan.ctaLink || ''}
                onChange={(e) => updatePlan(planIndex, 'ctaLink', e.target.value)}
                placeholder="/checkout"
              />
            </div>

            <div className="flex items-center justify-between">
              <Label className="text-xs">Highlighted Plan</Label>
              <Switch
                checked={plan.highlighted || false}
                onCheckedChange={(checked) => updatePlan(planIndex, 'highlighted', checked)}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

