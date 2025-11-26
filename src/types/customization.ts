/**
 * Type definitions for Product Customization Components
 * Used by customer-facing customization forms
 */

export interface CustomizationOption {
  id: string;
  label: string;
  value: string;
  position: number;
  priceModifier: number | null;
}

export interface CustomizationField {
  id: string;
  type: CustomizationFieldType;
  label: string;
  placeholder: string | null;
  helpText: string | null;
  required: boolean;
  position: number;
  minLength: number | null;
  maxLength: number | null;
  minValue: number | null;
  maxValue: number | null;
  pattern: string | null;
  maxFileSize: number | null;
  allowedTypes: string | null;
  priceModifier: number;
  priceModifierType: 'fixed' | 'percentage';
  options?: CustomizationOption[];
}

export type CustomizationFieldType =
  | 'TEXT'
  | 'TEXTAREA'
  | 'NUMBER'
  | 'DROPDOWN'
  | 'RADIO'
  | 'CHECKBOX'
  | 'COLOR'
  | 'FILE'
  | 'DATE';

export interface CustomizationValue {
  fieldId: string;
  value?: string | string[] | number | null;
  fileUrl?: string | null;
  fileName?: string | null;
  selectedOptions?: string[];
}

export interface ValidationError {
  fieldId: string;
  message: string;
}

export interface FileUploadResponse {
  success: boolean;
  customization: {
    id: string;
    fieldId: string;
    fileUrl: string;
    fileName: string;
    priceModifier: number;
  };
  cloudinary: {
    url: string;
    publicId: string;
    width: number;
    height: number;
    format: string;
  };
}

export interface CustomizationSummary {
  totalFields: number;
  requiredFields: number;
  optionalFields: number;
  hasFileUpload: boolean;
  baseAdditionalCost: number;
}

export interface CustomizationFieldsResponse {
  fields: CustomizationField[];
  summary: CustomizationSummary;
}
