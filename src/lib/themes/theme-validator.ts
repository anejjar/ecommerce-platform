/**
 * Theme Validator
 * Validates theme JSON against the schema
 */

import { ThemeConfig } from './theme-schema';

export interface ValidationError {
  path: string;
  message: string;
}

export interface ValidationResult {
  valid: boolean;
  errors: ValidationError[];
}

/**
 * Validates a theme configuration object
 */
export function validateThemeConfig(config: any): ValidationResult {
  const errors: ValidationError[] = [];

  // Validate metadata
  if (!config.metadata) {
    errors.push({ path: 'metadata', message: 'Metadata is required' });
  } else {
    if (!config.metadata.name || typeof config.metadata.name !== 'string') {
      errors.push({ path: 'metadata.name', message: 'Metadata name is required and must be a string' });
    }
    if (!config.metadata.version || typeof config.metadata.version !== 'string') {
      errors.push({ path: 'metadata.version', message: 'Metadata version is required and must be a string' });
    }
  }

  // Validate colors
  if (!config.colors) {
    errors.push({ path: 'colors', message: 'Colors configuration is required' });
  } else {
    const requiredColors = ['primary', 'secondary', 'accent', 'background', 'surface', 'border'];
    requiredColors.forEach(color => {
      if (!config.colors[color] || typeof config.colors[color] !== 'string') {
        errors.push({ path: `colors.${color}`, message: `Color ${color} is required and must be a string` });
      }
    });

    if (!config.colors.text) {
      errors.push({ path: 'colors.text', message: 'Colors.text configuration is required' });
    } else {
      const requiredTextColors = ['primary', 'secondary', 'muted'];
      requiredTextColors.forEach(color => {
        if (!config.colors.text[color] || typeof config.colors.text[color] !== 'string') {
          errors.push({ path: `colors.text.${color}`, message: `Text color ${color} is required and must be a string` });
        }
      });
    }
  }

  // Validate typography
  if (!config.typography) {
    errors.push({ path: 'typography', message: 'Typography configuration is required' });
  } else {
    if (!config.typography.fontFamily) {
      errors.push({ path: 'typography.fontFamily', message: 'Font family configuration is required' });
    } else {
      const requiredFonts = ['heading', 'body'];
      requiredFonts.forEach(font => {
        if (!config.typography.fontFamily[font] || typeof config.typography.fontFamily[font] !== 'string') {
          errors.push({ path: `typography.fontFamily.${font}`, message: `Font family ${font} is required` });
        }
      });
    }
  }

  // Validate spacing
  if (!config.spacing) {
    errors.push({ path: 'spacing', message: 'Spacing configuration is required' });
  } else {
    const requiredSpacing = ['xs', 'sm', 'md', 'lg', 'xl'];
    requiredSpacing.forEach(size => {
      if (!config.spacing[size] || typeof config.spacing[size] !== 'string') {
        errors.push({ path: `spacing.${size}`, message: `Spacing ${size} is required and must be a string` });
      }
    });
  }

  // Validate borderRadius
  if (!config.borderRadius) {
    errors.push({ path: 'borderRadius', message: 'Border radius configuration is required' });
  }

  // Validate components
  if (!config.components) {
    errors.push({ path: 'components', message: 'Components configuration is required' });
  } else {
    if (!config.components.header) {
      errors.push({ path: 'components.header', message: 'Header configuration is required' });
    }
    if (!config.components.footer) {
      errors.push({ path: 'components.footer', message: 'Footer configuration is required' });
    }
    if (!config.components.productCard) {
      errors.push({ path: 'components.productCard', message: 'Product card configuration is required' });
    }
    if (!config.components.buttons) {
      errors.push({ path: 'components.buttons', message: 'Buttons configuration is required' });
    }
  }

  // Validate layout
  if (!config.layout) {
    errors.push({ path: 'layout', message: 'Layout configuration is required' });
  } else {
    const requiredLayout = ['containerMaxWidth', 'pagePadding', 'sectionSpacing'];
    requiredLayout.forEach(prop => {
      if (!config.layout[prop] || typeof config.layout[prop] !== 'string') {
        errors.push({ path: `layout.${prop}`, message: `Layout ${prop} is required and must be a string` });
      }
    });
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Validates a theme JSON string
 */
export function validateThemeJSON(jsonString: string): ValidationResult {
  try {
    const config = JSON.parse(jsonString);
    return validateThemeConfig(config);
  } catch (error) {
    return {
      valid: false,
      errors: [{ path: 'root', message: `Invalid JSON: ${error instanceof Error ? error.message : 'Unknown error'}` }],
    };
  }
}

