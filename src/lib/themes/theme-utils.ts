/**
 * Theme Utilities
 * Helper functions for working with themes
 */

import { ThemeConfig } from './theme-schema';

/**
 * Converts theme config to CSS custom properties
 */
export function themeToCSSVariables(theme: ThemeConfig): string {
  const vars: string[] = [];

  // Colors
  vars.push(`--theme-color-primary: ${theme.colors.primary};`);
  vars.push(`--theme-color-secondary: ${theme.colors.secondary};`);
  vars.push(`--theme-color-accent: ${theme.colors.accent};`);
  vars.push(`--theme-color-background: ${theme.colors.background};`);
  vars.push(`--theme-color-surface: ${theme.colors.surface};`);
  vars.push(`--theme-color-border: ${theme.colors.border};`);
  vars.push(`--theme-color-text-primary: ${theme.colors.text.primary};`);
  vars.push(`--theme-color-text-secondary: ${theme.colors.text.secondary};`);
  vars.push(`--theme-color-text-muted: ${theme.colors.text.muted};`);
  
  if (theme.colors.success) vars.push(`--theme-color-success: ${theme.colors.success};`);
  if (theme.colors.warning) vars.push(`--theme-color-warning: ${theme.colors.warning};`);
  if (theme.colors.error) vars.push(`--theme-color-error: ${theme.colors.error};`);
  if (theme.colors.info) vars.push(`--theme-color-info: ${theme.colors.info};`);

  // Typography
  vars.push(`--theme-font-heading: ${theme.typography.fontFamily.heading};`);
  vars.push(`--theme-font-body: ${theme.typography.fontFamily.body};`);
  vars.push(`--theme-font-mono: ${theme.typography.fontFamily.mono || 'monospace'};`);
  
  Object.entries(theme.typography.fontSize).forEach(([key, value]) => {
    vars.push(`--theme-font-size-${key}: ${value};`);
  });

  Object.entries(theme.typography.fontWeight).forEach(([key, value]) => {
    vars.push(`--theme-font-weight-${key}: ${value};`);
  });

  Object.entries(theme.typography.lineHeight || {}).forEach(([key, value]) => {
    vars.push(`--theme-line-height-${key}: ${value};`);
  });

  // Spacing
  Object.entries(theme.spacing).forEach(([key, value]) => {
    vars.push(`--theme-spacing-${key}: ${value};`);
  });

  // Border Radius
  Object.entries(theme.borderRadius).forEach(([key, value]) => {
    vars.push(`--theme-radius-${key}: ${value};`);
  });

  // Layout
  vars.push(`--theme-container-max-width: ${theme.layout.containerMaxWidth};`);
  vars.push(`--theme-page-padding: ${theme.layout.pagePadding};`);
  vars.push(`--theme-section-spacing: ${theme.layout.sectionSpacing};`);

  // Component-specific variables
  if (theme.components.header) {
    vars.push(`--theme-header-bg: ${theme.components.header.backgroundColor};`);
    vars.push(`--theme-header-text: ${theme.components.header.textColor};`);
    vars.push(`--theme-header-height: ${theme.components.header.height};`);
  }

  if (theme.components.footer) {
    vars.push(`--theme-footer-bg: ${theme.components.footer.backgroundColor};`);
    vars.push(`--theme-footer-text: ${theme.components.footer.textColor};`);
  }

  if (theme.components.buttons) {
    vars.push(`--theme-button-primary: ${theme.components.buttons.primaryColor};`);
    vars.push(`--theme-button-hover: ${theme.components.buttons.hoverColor};`);
    vars.push(`--theme-button-text: ${theme.components.buttons.textColor};`);
    vars.push(`--theme-button-padding: ${theme.components.buttons.padding};`);
    vars.push(`--theme-button-radius: ${theme.components.buttons.borderRadius};`);
  }

  return `:root {\n  ${vars.join('\n  ')}\n}`;
}

/**
 * Merges two theme configs (useful for overrides)
 */
export function mergeThemeConfigs(base: ThemeConfig, overrides: Partial<ThemeConfig>): ThemeConfig {
  return {
    ...base,
    ...overrides,
    colors: {
      ...base.colors,
      ...overrides.colors,
      text: {
        ...base.colors.text,
        ...overrides.colors?.text,
      },
    },
    typography: {
      ...base.typography,
      ...overrides.typography,
      fontFamily: {
        ...base.typography.fontFamily,
        ...overrides.typography?.fontFamily,
      },
      fontSize: {
        ...base.typography.fontSize,
        ...overrides.typography?.fontSize,
      },
      fontWeight: {
        ...base.typography.fontWeight,
        ...overrides.typography?.fontWeight,
      },
    },
    spacing: {
      ...base.spacing,
      ...overrides.spacing,
    },
    borderRadius: {
      ...base.borderRadius,
      ...overrides.borderRadius,
    },
    components: {
      ...base.components,
      ...overrides.components,
      header: {
        ...base.components.header,
        ...overrides.components?.header,
      },
      footer: {
        ...base.components.footer,
        ...overrides.components?.footer,
      },
      productCard: {
        ...base.components.productCard,
        ...overrides.components?.productCard,
      },
      buttons: {
        ...base.components.buttons,
        ...overrides.components?.buttons,
      },
    },
    layout: {
      ...base.layout,
      ...overrides.layout,
    },
  };
}

/**
 * Gets a safe theme name for file system
 */
export function sanitizeThemeName(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

