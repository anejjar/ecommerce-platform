'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { CustomizationFileUpload } from '@/components/CustomizationFileUpload';
import { Loader2, DollarSign, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import { cn } from '@/lib/utils';
import type {
  CustomizationField,
  CustomizationValue,
  ValidationError,
  CustomizationFieldsResponse,
} from '@/types/customization';

interface ProductCustomizationFormProps {
  productId: string;
  cartItemId?: string;
  initialValues?: Record<string, CustomizationValue>;
  onCustomizationsChange?: (
    customizations: Record<string, CustomizationValue>,
    isValid: boolean,
    totalModifier: number
  ) => void;
  disabled?: boolean;
}

export function ProductCustomizationForm({
  productId,
  cartItemId,
  initialValues = {},
  onCustomizationsChange,
  disabled = false,
}: ProductCustomizationFormProps) {
  const [fields, setFields] = useState<CustomizationField[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [customizations, setCustomizations] = useState<Record<string, CustomizationValue>>(
    initialValues
  );
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  const [touchedFields, setTouchedFields] = useState<Set<string>>(new Set());

  // Fetch customization fields
  useEffect(() => {
    const fetchFields = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(`/api/products/${productId}/customization-fields`);

        if (!response.ok) {
          throw new Error('Failed to load customization fields');
        }

        const data: CustomizationFieldsResponse = await response.json();
        setFields(data.fields);
      } catch (error) {
        console.error('Error fetching customization fields:', error);
        toast.error('Failed to load customization options');
      } finally {
        setIsLoading(false);
      }
    };

    fetchFields();
  }, [productId]);

  // Validate a single field
  const validateField = useCallback(
    (field: CustomizationField, value: CustomizationValue | undefined): string | null => {
      // Required field check
      if (field.required) {
        if (!value) {
          return `${field.label} is required`;
        }

        // Check for empty values
        if (field.type === 'TEXT' || field.type === 'TEXTAREA') {
          if (!value.value || String(value.value).trim() === '') {
            return `${field.label} is required`;
          }
        } else if (field.type === 'NUMBER') {
          if (value.value === null || value.value === undefined || value.value === '') {
            return `${field.label} is required`;
          }
        } else if (field.type === 'DROPDOWN' || field.type === 'RADIO') {
          if (!value.value) {
            return `Please select a ${field.label}`;
          }
        } else if (field.type === 'CHECKBOX') {
          if (!value.selectedOptions || value.selectedOptions.length === 0) {
            return `Please select at least one ${field.label}`;
          }
        } else if (field.type === 'FILE') {
          if (!value.fileUrl) {
            return `Please upload a file for ${field.label}`;
          }
        } else if (field.type === 'COLOR') {
          if (!value.value) {
            return `Please select a color for ${field.label}`;
          }
        } else if (field.type === 'DATE') {
          if (!value.value) {
            return `Please select a date for ${field.label}`;
          }
        }
      }

      // Type-specific validation (only if value exists)
      if (value?.value) {
        const stringValue = String(value.value);

        // Text length validation
        if (field.type === 'TEXT' || field.type === 'TEXTAREA') {
          if (field.minLength && stringValue.length < field.minLength) {
            return `${field.label} must be at least ${field.minLength} characters`;
          }
          if (field.maxLength && stringValue.length > field.maxLength) {
            return `${field.label} must not exceed ${field.maxLength} characters`;
          }

          // Pattern validation
          if (field.pattern) {
            try {
              const regex = new RegExp(field.pattern);
              if (!regex.test(stringValue)) {
                return `${field.label} format is invalid`;
              }
            } catch (e) {
              console.error('Invalid regex pattern:', field.pattern);
            }
          }
        }

        // Number validation
        if (field.type === 'NUMBER') {
          const numValue = Number(value.value);
          if (isNaN(numValue)) {
            return `${field.label} must be a valid number`;
          }
          if (field.minValue !== null && numValue < field.minValue) {
            return `${field.label} must be at least ${field.minValue}`;
          }
          if (field.maxValue !== null && numValue > field.maxValue) {
            return `${field.label} must not exceed ${field.maxValue}`;
          }
        }
      }

      return null;
    },
    []
  );

  // Validate all fields
  const validateAll = useCallback((): boolean => {
    const errors: Record<string, string> = {};

    fields.forEach((field) => {
      const value = customizations[field.id];
      const error = validateField(field, value);
      if (error) {
        errors[field.id] = error;
      }
    });

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  }, [fields, customizations, validateField]);

  // Calculate total price modifier
  const totalPriceModifier = useMemo(() => {
    let total = 0;

    fields.forEach((field) => {
      const value = customizations[field.id];
      if (!value) return;

      // Add field-level price modifier
      if (field.priceModifier && field.priceModifier > 0) {
        if (field.priceModifierType === 'fixed') {
          total += field.priceModifier;
        }
        // Note: Percentage modifiers need base price, handled by parent
      }

      // Add option-level price modifiers for dropdown/radio/checkbox
      if (field.type === 'DROPDOWN' || field.type === 'RADIO') {
        if (value.value && field.options) {
          const selectedOption = field.options.find((opt) => opt.value === value.value);
          if (selectedOption?.priceModifier) {
            total += selectedOption.priceModifier;
          }
        }
      } else if (field.type === 'CHECKBOX') {
        if (value.selectedOptions && field.options) {
          value.selectedOptions.forEach((optValue) => {
            const option = field.options!.find((opt) => opt.value === optValue);
            if (option?.priceModifier) {
              total += option.priceModifier;
            }
          });
        }
      }
    });

    return total;
  }, [fields, customizations]);

  // Notify parent of changes
  useEffect(() => {
    if (onCustomizationsChange) {
      const isValid = validateAll();
      onCustomizationsChange(customizations, isValid, totalPriceModifier);
    }
  }, [customizations, totalPriceModifier]);

  // Handle field value change
  const handleFieldChange = (fieldId: string, value: CustomizationValue) => {
    setCustomizations((prev) => ({
      ...prev,
      [fieldId]: value,
    }));

    // Mark as touched
    setTouchedFields((prev) => new Set(prev).add(fieldId));

    // Validate this field
    const field = fields.find((f) => f.id === fieldId);
    if (field) {
      const error = validateField(field, value);
      setValidationErrors((prev) => {
        const newErrors = { ...prev };
        if (error) {
          newErrors[fieldId] = error;
        } else {
          delete newErrors[fieldId];
        }
        return newErrors;
      });
    }
  };

  // Handle blur event (mark as touched)
  const handleBlur = (fieldId: string) => {
    setTouchedFields((prev) => new Set(prev).add(fieldId));

    // Re-validate on blur
    const field = fields.find((f) => f.id === fieldId);
    if (field) {
      const value = customizations[fieldId];
      const error = validateField(field, value);
      setValidationErrors((prev) => {
        const newErrors = { ...prev };
        if (error) {
          newErrors[fieldId] = error;
        } else {
          delete newErrors[fieldId];
        }
        return newErrors;
      });
    }
  };

  // Format price modifier for display
  const formatPriceModifier = (amount: number): string => {
    return `+$${amount.toFixed(2)}`;
  };

  // Render field based on type
  const renderField = (field: CustomizationField) => {
    const value = customizations[field.id];
    const error = touchedFields.has(field.id) ? validationErrors[field.id] : undefined;
    const hasError = Boolean(error);

    switch (field.type) {
      case 'TEXT':
        return (
          <div key={field.id} className="space-y-2">
            <Label htmlFor={field.id} className="flex items-center gap-2">
              {field.label}
              {field.required && <span className="text-red-500">*</span>}
              {field.priceModifier > 0 && (
                <span className="text-green-600 text-sm font-normal">
                  {formatPriceModifier(field.priceModifier)}
                </span>
              )}
            </Label>
            {field.helpText && <p className="text-sm text-gray-500">{field.helpText}</p>}
            <Input
              id={field.id}
              type="text"
              value={(value?.value as string) || ''}
              onChange={(e) =>
                handleFieldChange(field.id, { fieldId: field.id, value: e.target.value })
              }
              onBlur={() => handleBlur(field.id)}
              placeholder={field.placeholder || undefined}
              disabled={disabled}
              className={cn(hasError && 'border-red-500 focus-visible:ring-red-500')}
              maxLength={field.maxLength || undefined}
            />
            {field.maxLength && (
              <p className="text-xs text-gray-500 text-right">
                {String(value?.value || '').length} / {field.maxLength}
              </p>
            )}
            {hasError && (
              <div className="flex items-center gap-2 text-red-600 text-sm">
                <AlertCircle className="w-4 h-4" />
                <span>{error}</span>
              </div>
            )}
          </div>
        );

      case 'TEXTAREA':
        return (
          <div key={field.id} className="space-y-2">
            <Label htmlFor={field.id} className="flex items-center gap-2">
              {field.label}
              {field.required && <span className="text-red-500">*</span>}
              {field.priceModifier > 0 && (
                <span className="text-green-600 text-sm font-normal">
                  {formatPriceModifier(field.priceModifier)}
                </span>
              )}
            </Label>
            {field.helpText && <p className="text-sm text-gray-500">{field.helpText}</p>}
            <Textarea
              id={field.id}
              value={(value?.value as string) || ''}
              onChange={(e) =>
                handleFieldChange(field.id, { fieldId: field.id, value: e.target.value })
              }
              onBlur={() => handleBlur(field.id)}
              placeholder={field.placeholder || undefined}
              disabled={disabled}
              className={cn(hasError && 'border-red-500 focus-visible:ring-red-500')}
              rows={4}
              maxLength={field.maxLength || undefined}
            />
            {field.maxLength && (
              <p className="text-xs text-gray-500 text-right">
                {String(value?.value || '').length} / {field.maxLength}
              </p>
            )}
            {hasError && (
              <div className="flex items-center gap-2 text-red-600 text-sm">
                <AlertCircle className="w-4 h-4" />
                <span>{error}</span>
              </div>
            )}
          </div>
        );

      case 'NUMBER':
        return (
          <div key={field.id} className="space-y-2">
            <Label htmlFor={field.id} className="flex items-center gap-2">
              {field.label}
              {field.required && <span className="text-red-500">*</span>}
              {field.priceModifier > 0 && (
                <span className="text-green-600 text-sm font-normal">
                  {formatPriceModifier(field.priceModifier)}
                </span>
              )}
            </Label>
            {field.helpText && <p className="text-sm text-gray-500">{field.helpText}</p>}
            <Input
              id={field.id}
              type="number"
              value={(value?.value as number) || ''}
              onChange={(e) =>
                handleFieldChange(field.id, {
                  fieldId: field.id,
                  value: e.target.value ? Number(e.target.value) : null,
                })
              }
              onBlur={() => handleBlur(field.id)}
              placeholder={field.placeholder || undefined}
              disabled={disabled}
              className={cn(hasError && 'border-red-500 focus-visible:ring-red-500')}
              min={field.minValue || undefined}
              max={field.maxValue || undefined}
              step="any"
            />
            {hasError && (
              <div className="flex items-center gap-2 text-red-600 text-sm">
                <AlertCircle className="w-4 h-4" />
                <span>{error}</span>
              </div>
            )}
          </div>
        );

      case 'DROPDOWN':
        return (
          <div key={field.id} className="space-y-2">
            <Label htmlFor={field.id} className="flex items-center gap-2">
              {field.label}
              {field.required && <span className="text-red-500">*</span>}
              {field.priceModifier > 0 && (
                <span className="text-green-600 text-sm font-normal">
                  {formatPriceModifier(field.priceModifier)}
                </span>
              )}
            </Label>
            {field.helpText && <p className="text-sm text-gray-500">{field.helpText}</p>}
            <Select
              value={(value?.value as string) || ''}
              onValueChange={(val) =>
                handleFieldChange(field.id, { fieldId: field.id, value: val })
              }
              disabled={disabled}
            >
              <SelectTrigger
                className={cn(hasError && 'border-red-500 focus-visible:ring-red-500')}
              >
                <SelectValue placeholder={`Select ${field.label}`} />
              </SelectTrigger>
              <SelectContent>
                {field.options?.map((option) => (
                  <SelectItem key={option.id} value={option.value}>
                    <div className="flex items-center justify-between w-full">
                      <span>{option.label}</span>
                      {option.priceModifier && option.priceModifier > 0 && (
                        <span className="text-green-600 text-sm ml-2">
                          {formatPriceModifier(option.priceModifier)}
                        </span>
                      )}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {hasError && (
              <div className="flex items-center gap-2 text-red-600 text-sm">
                <AlertCircle className="w-4 h-4" />
                <span>{error}</span>
              </div>
            )}
          </div>
        );

      case 'RADIO':
        return (
          <div key={field.id} className="space-y-2">
            <Label className="flex items-center gap-2">
              {field.label}
              {field.required && <span className="text-red-500">*</span>}
              {field.priceModifier > 0 && (
                <span className="text-green-600 text-sm font-normal">
                  {formatPriceModifier(field.priceModifier)}
                </span>
              )}
            </Label>
            {field.helpText && <p className="text-sm text-gray-500 mb-2">{field.helpText}</p>}
            <RadioGroup
              value={(value?.value as string) || ''}
              onValueChange={(val) =>
                handleFieldChange(field.id, { fieldId: field.id, value: val })
              }
              disabled={disabled}
              className={cn('space-y-2', hasError && 'border-red-500 rounded-md p-2')}
            >
              {field.options?.map((option) => (
                <div key={option.id} className="flex items-center space-x-2">
                  <RadioGroupItem value={option.value} id={`${field.id}-${option.id}`} />
                  <Label
                    htmlFor={`${field.id}-${option.id}`}
                    className="flex items-center gap-2 cursor-pointer font-normal"
                  >
                    {option.label}
                    {option.priceModifier && option.priceModifier > 0 && (
                      <span className="text-green-600 text-sm">
                        {formatPriceModifier(option.priceModifier)}
                      </span>
                    )}
                  </Label>
                </div>
              ))}
            </RadioGroup>
            {hasError && (
              <div className="flex items-center gap-2 text-red-600 text-sm">
                <AlertCircle className="w-4 h-4" />
                <span>{error}</span>
              </div>
            )}
          </div>
        );

      case 'CHECKBOX':
        return (
          <div key={field.id} className="space-y-2">
            <Label className="flex items-center gap-2">
              {field.label}
              {field.required && <span className="text-red-500">*</span>}
              {field.priceModifier > 0 && (
                <span className="text-green-600 text-sm font-normal">
                  {formatPriceModifier(field.priceModifier)}
                </span>
              )}
            </Label>
            {field.helpText && <p className="text-sm text-gray-500 mb-2">{field.helpText}</p>}
            <div className={cn('space-y-2', hasError && 'border-red-500 rounded-md p-2')}>
              {field.options?.map((option) => {
                const isChecked = value?.selectedOptions?.includes(option.value) || false;
                return (
                  <div key={option.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={`${field.id}-${option.id}`}
                      checked={isChecked}
                      onCheckedChange={(checked) => {
                        const currentOptions = value?.selectedOptions || [];
                        const newOptions = checked
                          ? [...currentOptions, option.value]
                          : currentOptions.filter((v) => v !== option.value);
                        handleFieldChange(field.id, {
                          fieldId: field.id,
                          selectedOptions: newOptions,
                        });
                      }}
                      disabled={disabled}
                    />
                    <Label
                      htmlFor={`${field.id}-${option.id}`}
                      className="flex items-center gap-2 cursor-pointer font-normal"
                    >
                      {option.label}
                      {option.priceModifier && option.priceModifier > 0 && (
                        <span className="text-green-600 text-sm">
                          {formatPriceModifier(option.priceModifier)}
                        </span>
                      )}
                    </Label>
                  </div>
                );
              })}
            </div>
            {hasError && (
              <div className="flex items-center gap-2 text-red-600 text-sm">
                <AlertCircle className="w-4 h-4" />
                <span>{error}</span>
              </div>
            )}
          </div>
        );

      case 'COLOR':
        return (
          <div key={field.id} className="space-y-2">
            <Label htmlFor={field.id} className="flex items-center gap-2">
              {field.label}
              {field.required && <span className="text-red-500">*</span>}
              {field.priceModifier > 0 && (
                <span className="text-green-600 text-sm font-normal">
                  {formatPriceModifier(field.priceModifier)}
                </span>
              )}
            </Label>
            {field.helpText && <p className="text-sm text-gray-500">{field.helpText}</p>}
            <div className="flex items-center gap-3">
              <Input
                id={field.id}
                type="color"
                value={(value?.value as string) || '#000000'}
                onChange={(e) =>
                  handleFieldChange(field.id, { fieldId: field.id, value: e.target.value })
                }
                onBlur={() => handleBlur(field.id)}
                disabled={disabled}
                className={cn('w-20 h-10 cursor-pointer', hasError && 'border-red-500')}
              />
              <Input
                type="text"
                value={(value?.value as string) || '#000000'}
                onChange={(e) =>
                  handleFieldChange(field.id, { fieldId: field.id, value: e.target.value })
                }
                onBlur={() => handleBlur(field.id)}
                placeholder="#000000"
                disabled={disabled}
                className={cn('flex-1', hasError && 'border-red-500')}
              />
            </div>
            {hasError && (
              <div className="flex items-center gap-2 text-red-600 text-sm">
                <AlertCircle className="w-4 h-4" />
                <span>{error}</span>
              </div>
            )}
          </div>
        );

      case 'FILE':
        return (
          <div key={field.id} className="space-y-2">
            <Label className="flex items-center gap-2">
              {field.label}
              {field.required && <span className="text-red-500">*</span>}
              {field.priceModifier > 0 && (
                <span className="text-green-600 text-sm font-normal">
                  {formatPriceModifier(field.priceModifier)}
                </span>
              )}
            </Label>
            {field.helpText && <p className="text-sm text-gray-500">{field.helpText}</p>}
            <CustomizationFileUpload
              fieldId={field.id}
              fieldLabel={field.label}
              cartItemId={cartItemId}
              maxFileSize={field.maxFileSize || undefined}
              allowedTypes={field.allowedTypes || undefined}
              value={
                value?.fileUrl && value?.fileName
                  ? { fileUrl: value.fileUrl, fileName: value.fileName }
                  : undefined
              }
              onChange={(fileData) => {
                if (fileData) {
                  handleFieldChange(field.id, {
                    fieldId: field.id,
                    fileUrl: fileData.fileUrl,
                    fileName: fileData.fileName,
                  });
                } else {
                  handleFieldChange(field.id, { fieldId: field.id, fileUrl: null, fileName: null });
                }
              }}
              onError={(error) => {
                setValidationErrors((prev) => ({
                  ...prev,
                  [field.id]: error,
                }));
              }}
              disabled={disabled}
            />
            {hasError && (
              <div className="flex items-center gap-2 text-red-600 text-sm mt-2">
                <AlertCircle className="w-4 h-4" />
                <span>{error}</span>
              </div>
            )}
          </div>
        );

      case 'DATE':
        return (
          <div key={field.id} className="space-y-2">
            <Label htmlFor={field.id} className="flex items-center gap-2">
              {field.label}
              {field.required && <span className="text-red-500">*</span>}
              {field.priceModifier > 0 && (
                <span className="text-green-600 text-sm font-normal">
                  {formatPriceModifier(field.priceModifier)}
                </span>
              )}
            </Label>
            {field.helpText && <p className="text-sm text-gray-500">{field.helpText}</p>}
            <Input
              id={field.id}
              type="date"
              value={(value?.value as string) || ''}
              onChange={(e) =>
                handleFieldChange(field.id, { fieldId: field.id, value: e.target.value })
              }
              onBlur={() => handleBlur(field.id)}
              disabled={disabled}
              className={cn(hasError && 'border-red-500 focus-visible:ring-red-500')}
            />
            {hasError && (
              <div className="flex items-center gap-2 text-red-600 text-sm">
                <AlertCircle className="w-4 h-4" />
                <span>{error}</span>
              </div>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <Card>
        <CardContent className="py-12">
          <div className="flex flex-col items-center gap-3">
            <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
            <p className="text-sm text-gray-500">Loading customization options...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  // No fields state
  if (fields.length === 0) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Customize Your Product</CardTitle>
        <p className="text-sm text-gray-500">
          Personalize this product with the options below
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        {fields.map((field) => renderField(field))}

        {totalPriceModifier > 0 && (
          <div className="border-t pt-4 mt-6">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">Customization Cost:</span>
              <span className="font-semibold text-green-600 flex items-center gap-1">
                <DollarSign className="w-4 h-4" />
                {formatPriceModifier(totalPriceModifier)}
              </span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
