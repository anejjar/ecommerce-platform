'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { FileText, Mail, Package, Sparkles, Zap } from 'lucide-react';
import toast from 'react-hot-toast';
import { getTemplatesForType } from '@/lib/template-library';

interface TemplateCreationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onTemplateCreated: (templateId: string) => void;
  initialType?: string;
}

const templateTypes = [
  {
    value: 'INVOICE',
    label: 'Invoice',
    icon: FileText,
    description: 'Generate professional invoices for orders',
  },
  {
    value: 'PACKING_SLIP',
    label: 'Packing Slip',
    icon: Package,
    description: 'Create packing slips for shipments',
  },
  {
    value: 'EMAIL_TRANSACTIONAL',
    label: 'Transactional Email',
    icon: Mail,
    description: 'Order confirmations, shipping notifications',
  },
  {
    value: 'EMAIL_MARKETING',
    label: 'Marketing Email',
    icon: Mail,
    description: 'Newsletters, promotions, announcements',
  },
];


export function TemplateCreationDialog({
  open,
  onOpenChange,
  onTemplateCreated,
  initialType = 'INVOICE',
}: TemplateCreationDialogProps) {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    type: initialType,
    description: '',
    selectedTemplateId: '',
  });
  const [isCreating, setIsCreating] = useState(false);

  const availableTemplates = getTemplatesForType(formData.type);

  const handleCreate = async () => {
    if (!formData.name.trim()) {
      toast.error('Please enter a template name');
      return;
    }

    if (!formData.selectedTemplateId) {
      toast.error('Please select a template');
      return;
    }

    setIsCreating(true);
    try {
      const selectedTemplate = availableTemplates.find((t) => t.id === formData.selectedTemplateId);

      const response = await fetch('/api/admin/templates', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          type: formData.type,
          description: formData.description,
          content: selectedTemplate?.content || '',
          isActive: false,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        toast.success('Template created successfully!');
        onTemplateCreated(data.template.id);
        handleClose();
      } else {
        toast.error('Failed to create template');
      }
    } catch (error) {
      toast.error('An error occurred');
    } finally {
      setIsCreating(false);
    }
  };

  const handleClose = () => {
    setStep(1);
    setFormData({
      name: '',
      type: initialType,
      description: '',
      selectedTemplateId: '',
    });
    onOpenChange(false);
  };

  const selectedTypeInfo = templateTypes.find((t) => t.value === formData.type);
  const Icon = selectedTypeInfo?.icon || FileText;

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-primary" />
            Create New Template
          </DialogTitle>
          <DialogDescription>
            Step {step} of 2: {step === 1 ? 'Basic Information' : 'Choose Starter Template'}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {step === 1 && (
            <>
              {/* Template Name */}
              <div className="space-y-2">
                <Label htmlFor="name">
                  Template Name <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="name"
                  placeholder="e.g., Modern Invoice Template"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  autoFocus
                />
              </div>

              {/* Template Type */}
              <div className="space-y-3">
                <Label>Template Type</Label>
                <RadioGroup
                  value={formData.type}
                  onValueChange={(value) => setFormData({ ...formData, type: value })}
                  className="grid grid-cols-2 gap-3"
                >
                  {templateTypes.map((type) => {
                    const TypeIcon = type.icon;
                    return (
                      <div key={type.value}>
                        <RadioGroupItem
                          value={type.value}
                          id={type.value}
                          className="peer sr-only"
                        />
                        <Label
                          htmlFor={type.value}
                          className="flex flex-col items-start gap-2 rounded-lg border-2 border-muted p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary cursor-pointer"
                        >
                          <TypeIcon className="w-5 h-5" />
                          <div>
                            <div className="font-semibold">{type.label}</div>
                            <div className="text-xs text-muted-foreground mt-1">
                              {type.description}
                            </div>
                          </div>
                        </Label>
                      </div>
                    );
                  })}
                </RadioGroup>
              </div>

              {/* Description */}
              <div className="space-y-2">
                <Label htmlFor="description">Description (Optional)</Label>
                <Textarea
                  id="description"
                  placeholder="What is this template used for?"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                />
              </div>
            </>
          )}

          {step === 2 && (
            <>
              {/* Review */}
              <div className="space-y-3 bg-muted p-4 rounded-lg">
                <div className="flex items-center gap-2">
                  <Icon className="w-5 h-5 text-primary" />
                  <div>
                    <div className="font-semibold">{formData.name}</div>
                    <div className="text-sm text-muted-foreground">
                      {selectedTypeInfo?.label}
                    </div>
                  </div>
                </div>
                {formData.description && (
                  <p className="text-sm text-muted-foreground">{formData.description}</p>
                )}
              </div>

              {/* Starter Template Selection */}
              <div className="space-y-3">
                <Label>Choose a Professional Template</Label>
                <p className="text-sm text-muted-foreground">
                  Select from our professionally designed templates
                </p>
                <RadioGroup
                  value={formData.selectedTemplateId}
                  onValueChange={(value) => setFormData({ ...formData, selectedTemplateId: value })}
                  className="space-y-3 max-h-[400px] overflow-y-auto pr-2"
                >
                  {availableTemplates.map((template) => (
                    <div key={template.id}>
                      <RadioGroupItem value={template.id} id={template.id} className="peer sr-only" />
                      <Label
                        htmlFor={template.id}
                        className="flex items-start gap-3 rounded-lg border-2 border-muted p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/5 cursor-pointer transition-all"
                      >
                        <div className="flex-shrink-0 mt-1">
                          <Zap className="w-5 h-5 text-primary" />
                        </div>
                        <div className="flex-1 space-y-2">
                          <div className="font-semibold text-base">{template.name}</div>
                          <p className="text-sm text-muted-foreground leading-relaxed">
                            {template.description}
                          </p>
                          <div className="flex items-center gap-2">
                            <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded">
                              {template.preview}
                            </span>
                          </div>
                        </div>
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>
            </>
          )}
        </div>

        <DialogFooter>
          <div className="flex items-center justify-between w-full">
            <div>
              {step === 2 && (
                <Button variant="ghost" onClick={() => setStep(1)}>
                  Back
                </Button>
              )}
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={handleClose}>
                Cancel
              </Button>
              {step === 1 ? (
                <Button
                  onClick={() => setStep(2)}
                  disabled={!formData.name.trim()}
                >
                  Next
                </Button>
              ) : (
                <Button onClick={handleCreate} disabled={isCreating}>
                  {isCreating ? 'Creating...' : 'Create Template'}
                </Button>
              )}
            </div>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
