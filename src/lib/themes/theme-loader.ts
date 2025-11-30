/**
 * Theme Loader
 * Loads and processes themes from various sources
 */

import { ThemeConfig } from './theme-schema';
import { validateThemeConfig } from './theme-validator';

export interface LoadedTheme {
  id?: string;
  name: string;
  displayName: string;
  description?: string;
  version: string;
  author?: string;
  previewImage?: string;
  isBuiltIn: boolean;
  isActive: boolean;
  config: ThemeConfig;
}

/**
 * Loads a theme from a JSON object
 */
export function loadThemeFromJSON(
  json: any,
  options: {
    id?: string;
    displayName?: string;
    description?: string;
    isBuiltIn?: boolean;
    isActive?: boolean;
    previewImage?: string;
  } = {}
): LoadedTheme {
  const validation = validateThemeConfig(json);
  
  if (!validation.valid) {
    throw new Error(`Invalid theme configuration: ${validation.errors.map(e => `${e.path}: ${e.message}`).join(', ')}`);
  }

  const config = json as ThemeConfig;

  return {
    id: options.id,
    name: config.metadata.name,
    displayName: options.displayName || config.metadata.name,
    description: options.description || config.metadata.description,
    version: config.metadata.version,
    author: options.previewImage || config.metadata.author,
    previewImage: options.previewImage,
    isBuiltIn: options.isBuiltIn ?? false,
    isActive: options.isActive ?? false,
    config,
  };
}

/**
 * Loads a theme from a JSON string
 */
export function loadThemeFromJSONString(
  jsonString: string,
  options?: Parameters<typeof loadThemeFromJSON>[1]
): LoadedTheme {
  try {
    const json = JSON.parse(jsonString);
    return loadThemeFromJSON(json, options);
  } catch (error) {
    throw new Error(`Failed to parse theme JSON: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Converts a database theme record to LoadedTheme
 */
export function loadThemeFromDB(theme: any): LoadedTheme {
  const config = theme.themeConfig as ThemeConfig;
  
  return {
    id: theme.id,
    name: theme.name,
    displayName: theme.displayName,
    description: theme.description,
    version: theme.version,
    author: theme.author,
    previewImage: theme.previewImage,
    isBuiltIn: theme.isBuiltIn,
    isActive: theme.isActive,
    config,
  };
}

