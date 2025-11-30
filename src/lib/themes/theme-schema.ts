/**
 * Theme Configuration Schema
 * Defines the structure for storefront theme JSON files
 */

export interface ThemeMetadata {
  name: string;
  version: string;
  author?: string;
  description?: string;
}

export interface ThemeColors {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  surface: string;
  text: {
    primary: string;
    secondary: string;
    muted: string;
  };
  border: string;
  success?: string;
  warning?: string;
  error?: string;
  info?: string;
}

export interface ThemeTypography {
  fontFamily: {
    heading: string;
    body: string;
    mono: string;
  };
  fontSize: {
    xs: string;
    sm: string;
    base: string;
    lg: string;
    xl: string;
    '2xl': string;
    '3xl': string;
    '4xl': string;
  };
  fontWeight: {
    normal: number;
    medium: number;
    semibold: number;
    bold: number;
  };
  lineHeight: {
    tight: string;
    normal: string;
    relaxed: string;
  };
}

export interface ThemeSpacing {
  xs: string;
  sm: string;
  md: string;
  lg: string;
  xl: string;
  '2xl': string;
  '3xl': string;
}

export interface ThemeBorderRadius {
  sm: string;
  md: string;
  lg: string;
  xl: string;
  full: string;
}

export interface HeaderConfig {
  style: 'minimal' | 'centered' | 'full-width' | 'sticky';
  backgroundColor: string;
  textColor: string;
  height: string;
  sticky: boolean;
  shadow?: boolean;
  borderBottom?: boolean;
}

export interface FooterConfig {
  style: 'minimal' | 'detailed' | 'newsletter';
  backgroundColor: string;
  textColor: string;
  columns: number;
  showNewsletter?: boolean;
}

export interface ProductCardConfig {
  style: 'default' | 'minimal' | 'bordered' | 'shadow';
  imageAspectRatio: string;
  showBadges: boolean;
  showQuickView: boolean;
  borderRadius: string;
  padding: string;
  hoverEffect?: 'scale' | 'lift' | 'glow' | 'none';
}

export interface ButtonConfig {
  style: 'rounded' | 'square' | 'pill';
  primaryColor: string;
  hoverColor: string;
  textColor: string;
  padding: string;
  borderRadius: string;
}

export interface ComponentConfigs {
  header: HeaderConfig;
  footer: FooterConfig;
  productCard: ProductCardConfig;
  buttons: ButtonConfig;
}

export interface LayoutConfig {
  containerMaxWidth: string;
  pagePadding: string;
  sectionSpacing: string;
}

export interface ThemeConfig {
  metadata: ThemeMetadata;
  colors: ThemeColors;
  typography: ThemeTypography;
  spacing: ThemeSpacing;
  borderRadius: ThemeBorderRadius;
  components: ComponentConfigs;
  layout: LayoutConfig;
  customCSS?: string;
}

export type ThemeConfigPartial = Partial<ThemeConfig>;

