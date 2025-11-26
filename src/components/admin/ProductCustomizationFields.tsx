'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import toast from 'react-hot-toast';
import {
  Type,
  AlignLeft,
  Hash,
  ChevronDown,
  Circle,
  CheckSquare,
  Palette,
  Upload,
  Calendar,
  Edit2,
  Trash2,
  Plus,
  X,
  DollarSign,
  GripVertical,
} from 'lucide-react';

interface CustomizationOption {
  id?: string;
  label: string;
  value: string;
  position?: number;
  priceModifier?: number | null;
}

interface CustomizationField {
  id: string;
  type: string;
  label: string;
  placeholder?: string | null;
  helpText?: string | null;
  required: boolean;
  position: number;
  minLength?: number | null;
  maxLength?: number | null;
  minValue?: number | null;
  maxValue?: number | null;
  pattern?: string | null;
  maxFileSize?: number | null;
  allowedTypes?: string | null;
  priceModifier: number;
  priceModifierType: string;
  options?: CustomizationOption[];
}

interface ProductCustomizationFieldsProps {
  productId: string;
}

const FIELD_TYPES = [
  { value: 'TEXT', label: 'Text Input', icon: Type },
  { value: 'TEXTAREA', label: 'Text Area', icon: AlignLeft },
  { value: 'NUMBER', label: 'Number', icon: Hash },
  { value: 'DROPDOWN', label: 'Dropdown', icon: ChevronDown },
  { value: 'RADIO', label: 'Radio Buttons', icon: Circle },
  { value: 'CHECKBOX', label: 'Checkboxes', icon: CheckSquare },
  { value: 'COLOR', label: 'Color Picker', icon: Palette },
  { value: 'FILE', label: 'File Upload', icon: Upload },
  { value: 'DATE', label: 'Date Picker', icon: Calendar },
];

const PRICE_MODIFIER_TYPES = [
  { value: 'fixed', label: 'Fixed Amount ($)' },
  { value: 'percentage', label: 'Percentage (%)' },
];

export function ProductCustomizationFields({ productId }: ProductCustomizationFieldsProps) {
  const [fields, setFields] = useState<CustomizationField[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingField, setEditingField] = useState<CustomizationField | null>(null);
  const [deleteFieldId, setDeleteFieldId] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    type: 'TEXT',
    label: '',
    placeholder: '',
    helpText: '',
    required: false,
    minLength: '',
    maxLength: '',
    minValue: '',
    maxValue: '',
    pattern: '',
    maxFileSize: '',
    allowedTypes: '',
    priceModifier: '',
    priceModifierType: 'fixed',
    options: [] as CustomizationOption[],
  });

  useEffect(() => {
    fetchFields();
  }, [productId]);

  const fetchFields = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/admin/products/${productId}/customization-fields`);
      if (response.ok) {
        const data = await response.json();
        setFields(data.fields || []);
      } else {
        toast.error('Failed to load customization fields');
      }
    } catch (error) {
      console.error('Error fetching fields:', error);
      toast.error('An error occurred while loading fields');
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      type: 'TEXT',
      label: '',
      placeholder: '',
      helpText: '',
      required: false,
      minLength: '',
      maxLength: '',
      minValue: '',
      maxValue: '',
      pattern: '',
      maxFileSize: '',
      allowedTypes: '',
      priceModifier: '',
      priceModifierType: 'fixed',
      options: [],
    });
    setEditingField(null);
  };

  const openDialog = (field?: CustomizationField) => {
    if (field) {
      setEditingField(field);
      setFormData({
        type: field.type,
        label: field.label,
        placeholder: field.placeholder || '',
        helpText: field.helpText || '',
        required: field.required,
        minLength: field.minLength?.toString() || '',
        maxLength: field.maxLength?.toString() || '',
        minValue: field.minValue?.toString() || '',
        maxValue: field.maxValue?.toString() || '',
        pattern: field.pattern || '',
        maxFileSize: field.maxFileSize?.toString() || '',
        allowedTypes: field.allowedTypes || '',
        priceModifier: field.priceModifier.toString(),
        priceModifierType: field.priceModifierType,
        options: field.options || [],
      });
    } else {
      resetForm();
    }
    setIsDialogOpen(true);
  };

  const closeDialog = () => {
    setIsDialogOpen(false);
    resetForm();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      // Validate required fields
      if (!formData.label.trim()) {
        toast.error('Label is required');
        setIsSaving(false);
        return;
      }

      // Validate options for dropdown/radio/checkbox
      if (['DROPDOWN', 'RADIO', 'CHECKBOX'].includes(formData.type)) {
        if (formData.options.length === 0) {
          toast.error(`Please add at least one option for ${formData.type} field`);
          setIsSaving(false);
          return;
        }
      }

      const payload = {
        type: formData.type,
        label: formData.label,
        placeholder: formData.placeholder || null,
        helpText: formData.helpText || null,
        required: formData.required,
        minLength: formData.minLength ? parseInt(formData.minLength) : null,
        maxLength: formData.maxLength ? parseInt(formData.maxLength) : null,
        minValue: formData.minValue ? parseFloat(formData.minValue) : null,
        maxValue: formData.maxValue ? parseFloat(formData.maxValue) : null,
        pattern: formData.pattern || null,
        maxFileSize: formData.maxFileSize ? parseInt(formData.maxFileSize) : null,
        allowedTypes: formData.allowedTypes || null,
        priceModifier: formData.priceModifier ? parseFloat(formData.priceModifier) : 0,
        priceModifierType: formData.priceModifierType,
        options: ['DROPDOWN', 'RADIO', 'CHECKBOX'].includes(formData.type)
          ? formData.options.map((opt, idx) => ({
              label: opt.label,
              value: opt.value,
              position: idx,
              priceModifier: opt.priceModifier || null,
            }))
          : undefined,
      };

      const url = editingField
        ? `/api/admin/products/${productId}/customization-fields/${editingField.id}`
        : `/api/admin/products/${productId}/customization-fields`;

      const method = editingField ? 'PATCH' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        toast.success(editingField ? 'Field updated successfully' : 'Field created successfully');
        await fetchFields();
        closeDialog();
      } else {
        const error = await response.json();
        toast.error(error.error || 'Failed to save field');
      }
    } catch (error) {
      console.error('Error saving field:', error);
      toast.error('An error occurred while saving');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteFieldId) return;

    try {
      const response = await fetch(
        `/api/admin/products/${productId}/customization-fields/${deleteFieldId}`,
        { method: 'DELETE' }
      );

      if (response.ok) {
        toast.success('Field deleted successfully');
        await fetchFields();
      } else {
        toast.error('Failed to delete field');
      }
    } catch (error) {
      console.error('Error deleting field:', error);
      toast.error('An error occurred while deleting');
    } finally {
      setDeleteFieldId(null);
    }
  };

  const addOption = () => {
    setFormData({
      ...formData,
      options: [...formData.options, { label: '', value: '', priceModifier: null }],
    });
  };

  const updateOption = (index: number, field: keyof CustomizationOption, value: any) => {
    const newOptions = [...formData.options];
    newOptions[index] = { ...newOptions[index], [field]: value };
    setFormData({ ...formData, options: newOptions });
  };

  const removeOption = (index: number) => {
    const newOptions = formData.options.filter((_, i) => i !== index);
    setFormData({ ...formData, options: newOptions });
  };

  const getFieldIcon = (type: string) => {
    const fieldType = FIELD_TYPES.find((ft) => ft.value === type);
    return fieldType ? fieldType.icon : Type;
  };

  const requiresOptions = (type: string) =>
    ['DROPDOWN', 'RADIO', 'CHECKBOX'].includes(type);

  if (isLoading) {
    return (
      <Card>
        <CardContent className="py-12">
          <div className="text-center text-gray-500">Loading customization fields...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Product Customization Fields</CardTitle>
              <p className="text-sm text-gray-500 mt-1">
                Add custom fields for customers to personalize this product
              </p>
            </div>
            <Button onClick={() => openDialog()} size="sm">
              <Plus className="w-4 h-4 mr-2" />
              Add Field
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {fields.length === 0 ? (
            <div className="text-center py-12 border-2 border-dashed rounded-lg">
              <div className="flex flex-col items-center gap-3">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
                  <Type className="w-8 h-8 text-gray-400" />
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">No customization fields</h3>
                  <p className="text-sm text-gray-500 mt-1">
                    Add fields to allow customers to customize this product
                  </p>
                </div>
                <Button onClick={() => openDialog()} className="mt-2">
                  <Plus className="w-4 h-4 mr-2" />
                  Add First Field
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              {fields.map((field) => {
                const Icon = getFieldIcon(field.type);
                return (
                  <Card key={field.id} className="border border-gray-200">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-3 flex-1">
                          <div className="mt-1">
                            <GripVertical className="w-5 h-5 text-gray-400" />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <Icon className="w-4 h-4 text-gray-600" />
                              <h4 className="font-medium text-gray-900">{field.label}</h4>
                              {field.required && (
                                <Badge variant="outline" className="text-xs bg-red-50 text-red-700 border-red-200">
                                  Required
                                </Badge>
                              )}
                              <Badge variant="outline" className="text-xs">
                                {FIELD_TYPES.find((ft) => ft.value === field.type)?.label || field.type}
                              </Badge>
                            </div>

                            {field.helpText && (
                              <p className="text-sm text-gray-500 mb-2">{field.helpText}</p>
                            )}

                            <div className="flex flex-wrap gap-2 text-xs text-gray-600">
                              {field.placeholder && (
                                <span className="bg-gray-100 px-2 py-1 rounded">
                                  Placeholder: {field.placeholder}
                                </span>
                              )}
                              {field.priceModifier !== 0 && (
                                <span className="bg-green-100 text-green-700 px-2 py-1 rounded flex items-center gap-1">
                                  <DollarSign className="w-3 h-3" />
                                  {field.priceModifierType === 'percentage' ? `${field.priceModifier}%` : `$${field.priceModifier}`}
                                </span>
                              )}
                              {field.minLength && (
                                <span className="bg-gray-100 px-2 py-1 rounded">
                                  Min Length: {field.minLength}
                                </span>
                              )}
                              {field.maxLength && (
                                <span className="bg-gray-100 px-2 py-1 rounded">
                                  Max Length: {field.maxLength}
                                </span>
                              )}
                              {field.minValue && (
                                <span className="bg-gray-100 px-2 py-1 rounded">
                                  Min: {field.minValue}
                                </span>
                              )}
                              {field.maxValue && (
                                <span className="bg-gray-100 px-2 py-1 rounded">
                                  Max: {field.maxValue}
                                </span>
                              )}
                            </div>

                            {field.options && field.options.length > 0 && (
                              <div className="mt-3">
                                <p className="text-xs text-gray-500 mb-2">Options:</p>
                                <div className="flex flex-wrap gap-2">
                                  {field.options.map((opt) => (
                                    <Badge key={opt.id} variant="outline" className="text-xs">
                                      {opt.label}
                                      {opt.priceModifier && (
                                        <span className="ml-1 text-green-600">
                                          (+${opt.priceModifier})
                                        </span>
                                      )}
                                    </Badge>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center gap-2 ml-4">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => openDialog(field)}
                          >
                            <Edit2 className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setDeleteFieldId(field.id)}
                          >
                            <Trash2 className="w-4 h-4 text-red-600" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Add/Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingField ? 'Edit Customization Field' : 'Add Customization Field'}
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Field Type */}
            <div className="space-y-2">
              <Label htmlFor="type">Field Type *</Label>
              <Select
                value={formData.type}
                onValueChange={(value) => setFormData({ ...formData, type: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {FIELD_TYPES.map((type) => {
                    const Icon = type.icon;
                    return (
                      <SelectItem key={type.value} value={type.value}>
                        <div className="flex items-center gap-2">
                          <Icon className="w-4 h-4" />
                          <span>{type.label}</span>
                        </div>
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
            </div>

            {/* Label */}
            <div className="space-y-2">
              <Label htmlFor="label">Label *</Label>
              <Input
                id="label"
                value={formData.label}
                onChange={(e) => setFormData({ ...formData, label: e.target.value })}
                placeholder="e.g., Engraving Text"
                required
              />
            </div>

            {/* Placeholder */}
            {['TEXT', 'TEXTAREA', 'NUMBER'].includes(formData.type) && (
              <div className="space-y-2">
                <Label htmlFor="placeholder">Placeholder</Label>
                <Input
                  id="placeholder"
                  value={formData.placeholder}
                  onChange={(e) => setFormData({ ...formData, placeholder: e.target.value })}
                  placeholder="e.g., Enter your text here..."
                />
              </div>
            )}

            {/* Help Text */}
            <div className="space-y-2">
              <Label htmlFor="helpText">Help Text</Label>
              <Textarea
                id="helpText"
                value={formData.helpText}
                onChange={(e) => setFormData({ ...formData, helpText: e.target.value })}
                placeholder="Additional instructions for customers"
                rows={2}
              />
            </div>

            {/* Required Checkbox */}
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="required"
                checked={formData.required}
                onChange={(e) => setFormData({ ...formData, required: e.target.checked })}
                className="rounded"
              />
              <Label htmlFor="required" className="cursor-pointer">
                Required field
              </Label>
            </div>

            {/* Price Modifier */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="priceModifier">Price Modifier</Label>
                <Input
                  id="priceModifier"
                  type="number"
                  step="0.01"
                  value={formData.priceModifier}
                  onChange={(e) => setFormData({ ...formData, priceModifier: e.target.value })}
                  placeholder="0.00"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="priceModifierType">Modifier Type</Label>
                <Select
                  value={formData.priceModifierType}
                  onValueChange={(value) => setFormData({ ...formData, priceModifierType: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {PRICE_MODIFIER_TYPES.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Type-specific fields */}
            {['TEXT', 'TEXTAREA'].includes(formData.type) && (
              <div className="space-y-4 border-t pt-4">
                <h4 className="font-medium text-sm">Text Validation</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="minLength">Min Length</Label>
                    <Input
                      id="minLength"
                      type="number"
                      value={formData.minLength}
                      onChange={(e) => setFormData({ ...formData, minLength: e.target.value })}
                      placeholder="0"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="maxLength">Max Length</Label>
                    <Input
                      id="maxLength"
                      type="number"
                      value={formData.maxLength}
                      onChange={(e) => setFormData({ ...formData, maxLength: e.target.value })}
                      placeholder="Unlimited"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="pattern">Pattern (Regex)</Label>
                  <Input
                    id="pattern"
                    value={formData.pattern}
                    onChange={(e) => setFormData({ ...formData, pattern: e.target.value })}
                    placeholder="e.g., ^[A-Za-z0-9]+$"
                  />
                  <p className="text-xs text-gray-500">
                    Regular expression pattern for validation
                  </p>
                </div>
              </div>
            )}

            {formData.type === 'NUMBER' && (
              <div className="space-y-4 border-t pt-4">
                <h4 className="font-medium text-sm">Number Validation</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="minValue">Min Value</Label>
                    <Input
                      id="minValue"
                      type="number"
                      step="0.01"
                      value={formData.minValue}
                      onChange={(e) => setFormData({ ...formData, minValue: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="maxValue">Max Value</Label>
                    <Input
                      id="maxValue"
                      type="number"
                      step="0.01"
                      value={formData.maxValue}
                      onChange={(e) => setFormData({ ...formData, maxValue: e.target.value })}
                    />
                  </div>
                </div>
              </div>
            )}

            {formData.type === 'FILE' && (
              <div className="space-y-4 border-t pt-4">
                <h4 className="font-medium text-sm">File Upload Settings</h4>
                <div className="space-y-2">
                  <Label htmlFor="maxFileSize">Max File Size (KB)</Label>
                  <Input
                    id="maxFileSize"
                    type="number"
                    value={formData.maxFileSize}
                    onChange={(e) => setFormData({ ...formData, maxFileSize: e.target.value })}
                    placeholder="5120"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="allowedTypes">Allowed MIME Types</Label>
                  <Input
                    id="allowedTypes"
                    value={formData.allowedTypes}
                    onChange={(e) => setFormData({ ...formData, allowedTypes: e.target.value })}
                    placeholder="e.g., image/jpeg,image/png,application/pdf"
                  />
                  <p className="text-xs text-gray-500">
                    Comma-separated list of allowed MIME types
                  </p>
                </div>
              </div>
            )}

            {/* Options Management */}
            {requiresOptions(formData.type) && (
              <div className="space-y-4 border-t pt-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium text-sm">Options *</h4>
                  <Button type="button" onClick={addOption} size="sm" variant="outline">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Option
                  </Button>
                </div>

                {formData.options.length === 0 ? (
                  <div className="text-center py-4 border-2 border-dashed rounded-lg">
                    <p className="text-sm text-gray-500">No options added yet</p>
                    <Button type="button" onClick={addOption} size="sm" className="mt-2">
                      Add First Option
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {formData.options.map((option, index) => (
                      <div key={index} className="flex gap-2 items-start p-3 border rounded-lg">
                        <div className="flex-1 grid grid-cols-3 gap-2">
                          <div className="space-y-1">
                            <Label className="text-xs">Label *</Label>
                            <Input
                              value={option.label}
                              onChange={(e) => updateOption(index, 'label', e.target.value)}
                              placeholder="Small"
                              required
                            />
                          </div>
                          <div className="space-y-1">
                            <Label className="text-xs">Value *</Label>
                            <Input
                              value={option.value}
                              onChange={(e) => updateOption(index, 'value', e.target.value)}
                              placeholder="small"
                              required
                            />
                          </div>
                          <div className="space-y-1">
                            <Label className="text-xs">Price (+$)</Label>
                            <Input
                              type="number"
                              step="0.01"
                              value={option.priceModifier || ''}
                              onChange={(e) =>
                                updateOption(
                                  index,
                                  'priceModifier',
                                  e.target.value ? parseFloat(e.target.value) : null
                                )
                              }
                              placeholder="0.00"
                            />
                          </div>
                        </div>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => removeOption(index)}
                          className="mt-6"
                        >
                          <X className="w-4 h-4 text-red-600" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            <DialogFooter>
              <Button type="button" variant="outline" onClick={closeDialog} disabled={isSaving}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSaving}>
                {isSaving ? 'Saving...' : editingField ? 'Update Field' : 'Create Field'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deleteFieldId} onOpenChange={() => setDeleteFieldId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Customization Field</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this field? This action cannot be undone.
              Customers will no longer be able to customize this product using this field.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-red-600 hover:bg-red-700">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
