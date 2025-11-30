/**
 * Default Built-in Themes
 * Pre-loaded themes that come with the platform
 */

import { ThemeConfig } from './theme-schema';
import minimalTheme from './built-in/minimal.json';
import modernTheme from './built-in/modern.json';
import classicTheme from './built-in/classic.json';
import boldTheme from './built-in/bold.json';
import darkTheme from './built-in/dark.json';

export const defaultThemes: Array<{
  name: string;
  displayName: string;
  description: string;
  config: ThemeConfig;
}> = [
  {
    name: 'minimal',
    displayName: 'Minimal',
    description: 'Clean, minimal design with plenty of white space',
    config: minimalTheme as ThemeConfig,
  },
  {
    name: 'modern',
    displayName: 'Modern',
    description: 'Modern design with gradients and vibrant colors',
    config: modernTheme as ThemeConfig,
  },
  {
    name: 'classic',
    displayName: 'Classic',
    description: 'Traditional ecommerce design with timeless appeal',
    config: classicTheme as ThemeConfig,
  },
  {
    name: 'bold',
    displayName: 'Bold',
    description: 'Bold colors and typography for maximum impact',
    config: boldTheme as ThemeConfig,
  },
  {
    name: 'dark',
    displayName: 'Dark',
    description: 'Dark mode theme with modern aesthetics',
    config: darkTheme as ThemeConfig,
  },
];

