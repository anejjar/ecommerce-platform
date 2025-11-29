'use client';

import { useState } from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { MediaPicker } from '@/components/media-manager/MediaPicker/MediaPicker';
import { Plus, Trash2, Image as ImageIcon } from 'lucide-react';

interface TestimonialsBlockEditorProps {
  config: Record<string, any>;
  onUpdate: (config: Record<string, any>) => void;
}

export function TestimonialsBlockEditor({ config, onUpdate }: TestimonialsBlockEditorProps) {
  const [isMediaPickerOpen, setIsMediaPickerOpen] = useState<number | null>(null);
  const testimonials = config.testimonials || [{ name: '', role: '', image: '', text: '', rating: 5 }];

  const handleChange = (field: string, value: any) => {
    onUpdate({ ...config, [field]: value });
  };

  const updateTestimonial = (index: number, field: string, value: any) => {
    const newTestimonials = [...testimonials];
    newTestimonials[index] = { ...newTestimonials[index], [field]: value };
    handleChange('testimonials', newTestimonials);
  };

  const addTestimonial = () => {
    handleChange('testimonials', [...testimonials, { name: '', role: '', image: '', text: '', rating: 5 }]);
  };

  const removeTestimonial = (index: number) => {
    if (testimonials.length > 1) {
      handleChange('testimonials', testimonials.filter((_: any, i: number) => i !== index));
    }
  };

  const handleMediaSelect = (media: any[], index: number) => {
    if (media.length > 0) {
      updateTestimonial(index, 'image', media[0].url);
    }
    setIsMediaPickerOpen(null);
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
            <SelectItem value="carousel">Carousel</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Label>Testimonials</Label>
          <Button type="button" variant="outline" size="sm" onClick={addTestimonial}>
            <Plus className="w-4 h-4 mr-1" />
            Add Testimonial
          </Button>
        </div>

        {testimonials.map((testimonial: any, index: number) => (
          <div key={index} className="border rounded-lg p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Testimonial {index + 1}</span>
              {testimonials.length > 1 && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => removeTestimonial(index)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              )}
            </div>
            <div className="space-y-2">
              <div className="flex gap-2">
                {testimonial.image ? (
                  <div className="relative">
                    <img src={testimonial.image} alt="Avatar" className="w-16 h-16 rounded-full object-cover" />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute -top-1 -right-1 h-5 w-5 p-0"
                      onClick={() => updateTestimonial(index, 'image', '')}
                    >
                      <X className="w-3 h-3" />
                    </Button>
                  </div>
                ) : (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setIsMediaPickerOpen(index)}
                  >
                    <ImageIcon className="w-4 h-4" />
                  </Button>
                )}
                <div className="flex-1 space-y-2">
                  <Input
                    placeholder="Name"
                    value={testimonial.name || ''}
                    onChange={(e) => updateTestimonial(index, 'name', e.target.value)}
                  />
                  <Input
                    placeholder="Role"
                    value={testimonial.role || ''}
                    onChange={(e) => updateTestimonial(index, 'role', e.target.value)}
                  />
                </div>
              </div>
              <Input
                type="number"
                min="1"
                max="5"
                placeholder="Rating (1-5)"
                value={testimonial.rating || 5}
                onChange={(e) => updateTestimonial(index, 'rating', parseInt(e.target.value) || 5)}
              />
              <Textarea
                placeholder="Testimonial text"
                value={testimonial.text || ''}
                onChange={(e) => updateTestimonial(index, 'text', e.target.value)}
                rows={3}
              />
            </div>
          </div>
        ))}
      </div>

      {isMediaPickerOpen !== null && (
        <MediaPicker
          open={true}
          onOpenChange={(open) => !open && setIsMediaPickerOpen(null)}
          onSelect={(media) => handleMediaSelect(media, isMediaPickerOpen)}
          type="IMAGE"
          multiple={false}
        />
      )}
    </div>
  );
}

