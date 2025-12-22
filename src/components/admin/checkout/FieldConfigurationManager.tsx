'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  AlertTriangle,
  Eye,
  EyeOff,
  Check,
  X,
  RotateCcw,
} from 'lucide-react';
import {
  FieldVisibilityConfig,
  DEFAULT_FIELD_VISIBILITY,
  FIELD_DISPLAY_NAMES,
} from '@/types/checkout-settings';

interface FieldConfigurationManagerProps {
  fieldVisibility: FieldVisibilityConfig | null;
  onChange: (config: FieldVisibilityConfig) => void;
}

interface ValidationResult {
  isValid: boolean;
  errors: {
    email: string | null;
    name: string | null;
    address: string | null;
  };
}

export function FieldConfigurationManager({
  fieldVisibility,
  onChange,
}: FieldConfigurationManagerProps) {
  const [config, setConfig] = useState<FieldVisibilityConfig>(
    fieldVisibility || DEFAULT_FIELD_VISIBILITY
  );
  const [validation, setValidation] = useState<ValidationResult>({
    isValid: true,
    errors: { email: null, name: null, address: null },
  });

  // Sync with parent when fieldVisibility changes
  useEffect(() => {
    if (fieldVisibility) {
      setConfig(fieldVisibility);
    }
  }, [fieldVisibility]);

  // Validate configuration
  useEffect(() => {
    const result = validateFieldConfiguration(config);
    setValidation(result);
  }, [config]);

  const validateFieldConfiguration = (
    fieldConfig: FieldVisibilityConfig
  ): ValidationResult => {
    const minimumRequired = {
      hasEmail: false,
      hasName: false,
      hasAddress: false,
    };

    for (const [field, fieldSettings] of Object.entries(fieldConfig)) {
      if (fieldSettings.visible && fieldSettings.required) {
        if (field === 'email') minimumRequired.hasEmail = true;
        if (['firstName', 'lastName'].includes(field))
          minimumRequired.hasName = true;
        if (['address', 'city'].includes(field))
          minimumRequired.hasAddress = true;
      }
    }

    return {
      isValid:
        minimumRequired.hasEmail &&
        minimumRequired.hasName &&
        minimumRequired.hasAddress,
      errors: {
        email: !minimumRequired.hasEmail
          ? 'Email must be visible and required'
          : null,
        name: !minimumRequired.hasName
          ? 'At least one name field (firstName or lastName) must be visible and required'
          : null,
        address: !minimumRequired.hasAddress
          ? 'At least one address field (address or city) must be visible and required'
          : null,
      },
    };
  };

  const handleVisibilityChange = (field: string, visible: boolean) => {
    const newConfig = {
      ...config,
      [field]: {
        ...config[field],
        visible,
        required: visible ? config[field].required : false, // Can't require hidden field
      },
    };
    setConfig(newConfig);
    onChange(newConfig);
  };

  const handleRequiredChange = (field: string, required: boolean) => {
    const newConfig = {
      ...config,
      [field]: {
        ...config[field],
        required,
      },
    };
    setConfig(newConfig);
    onChange(newConfig);
  };

  const handleShowAll = () => {
    const newConfig: FieldVisibilityConfig = {};
    Object.keys(config).forEach((field) => {
      newConfig[field] = { visible: true, required: config[field].required };
    });
    setConfig(newConfig);
    onChange(newConfig);
  };

  const handleHideOptional = () => {
    const newConfig: FieldVisibilityConfig = {};
    Object.keys(config).forEach((field) => {
      if (config[field].required) {
        newConfig[field] = config[field];
      } else {
        newConfig[field] = { visible: false, required: false };
      }
    });
    setConfig(newConfig);
    onChange(newConfig);
  };

  const handleResetDefaults = () => {
    setConfig(DEFAULT_FIELD_VISIBILITY);
    onChange(DEFAULT_FIELD_VISIBILITY);
  };

  const fieldGroups = {
    'Contact Information': ['email', 'phone', 'alternativePhone'],
    'Name Fields': ['firstName', 'lastName', 'company'],
    'Address Fields': ['address', 'address2', 'city', 'state', 'postalCode'],
    'Additional Information': [
      'deliveryDate',
      'deliveryInstructions',
      'giftMessage',
      'orderNotes',
    ],
  };

  return (
    <div className="space-y-6">
      {/* Validation Warnings */}
      {!validation.isValid && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            <div className="space-y-1">
              <p className="font-semibold">
                Invalid configuration - minimum required fields missing:
              </p>
              {validation.errors.email && <p>• {validation.errors.email}</p>}
              {validation.errors.name && <p>• {validation.errors.name}</p>}
              {validation.errors.address && (
                <p>• {validation.errors.address}</p>
              )}
            </div>
          </AlertDescription>
        </Alert>
      )}

      {/* Bulk Actions */}
      <div className="flex flex-wrap gap-2">
        <Button variant="outline" size="sm" onClick={handleShowAll}>
          <Eye className="w-4 h-4 mr-2" />
          Show All Fields
        </Button>
        <Button variant="outline" size="sm" onClick={handleHideOptional}>
          <EyeOff className="w-4 h-4 mr-2" />
          Hide Optional Fields
        </Button>
        <Button variant="outline" size="sm" onClick={handleResetDefaults}>
          <RotateCcw className="w-4 h-4 mr-2" />
          Reset to Defaults
        </Button>
      </div>

      {/* Field Configuration Table */}
      {Object.entries(fieldGroups).map(([groupName, fields]) => (
        <div key={groupName} className="space-y-3">
          <h3 className="text-lg font-semibold">{groupName}</h3>
          <div className="border rounded-lg overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Field</TableHead>
                  <TableHead className="text-center">Visible</TableHead>
                  <TableHead className="text-center">Required</TableHead>
                  <TableHead className="text-center">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {fields.map((field) => {
                  const fieldConfig = config[field];
                  if (!fieldConfig) return null;

                  return (
                    <TableRow key={field}>
                      <TableCell className="font-medium">
                        {FIELD_DISPLAY_NAMES[field] || field}
                      </TableCell>
                      <TableCell className="text-center">
                        <div className="flex items-center justify-center">
                          <Switch
                            checked={fieldConfig.visible}
                            onCheckedChange={(checked) =>
                              handleVisibilityChange(field, checked)
                            }
                          />
                        </div>
                      </TableCell>
                      <TableCell className="text-center">
                        <div className="flex items-center justify-center">
                          <Switch
                            checked={fieldConfig.required}
                            onCheckedChange={(checked) =>
                              handleRequiredChange(field, checked)
                            }
                            disabled={!fieldConfig.visible}
                          />
                        </div>
                      </TableCell>
                      <TableCell className="text-center">
                        {fieldConfig.visible ? (
                          fieldConfig.required ? (
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                              <Check className="w-3 h-3 mr-1" />
                              Required
                            </span>
                          ) : (
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                              <Check className="w-3 h-3 mr-1" />
                              Optional
                            </span>
                          )
                        ) : (
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                            <X className="w-3 h-3 mr-1" />
                            Hidden
                          </span>
                        )}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </div>
      ))}

      {/* Info Box */}
      <Alert>
        <AlertDescription>
          <p className="text-sm">
            <strong>Note:</strong> At least one email field, one name field
            (firstName or lastName), and one address field (address or city)
            must be visible and required for the checkout to function properly.
          </p>
        </AlertDescription>
      </Alert>
    </div>
  );
}
