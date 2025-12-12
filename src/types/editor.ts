/**
 * CMS Page Editor Types
 *
 * Comprehensive type definitions for the Elementor-style page builder
 * with support for nested containers, three-tab configuration, and advanced features.
 */

// ============================================
// Enums
// ============================================

export enum ContainerType {
  BLOCK = 'BLOCK',       // Regular block (no children)
  SECTION = 'SECTION',   // Full-width section container
  FLEXBOX = 'FLEXBOX',   // Flexbox container
  GRID = 'GRID',         // Grid container
}

export enum BlockCategory {
  HERO = 'HERO',
  CONTENT = 'CONTENT',
  FEATURES = 'FEATURES',
  CTA = 'CTA',
  TESTIMONIALS = 'TESTIMONIALS',
  PRICING = 'PRICING',
  TEAM = 'TEAM',
  STATS = 'STATS',
  LOGO_GRID = 'LOGO_GRID',
  FORM = 'FORM',
  FAQ = 'FAQ',
  GALLERY = 'GALLERY',
  VIDEO = 'VIDEO',
  NAVIGATION = 'NAVIGATION',
  HEADER = 'HEADER',
  FOOTER = 'FOOTER',
  SOCIAL = 'SOCIAL',
  BREADCRUMBS = 'BREADCRUMBS',
  DIVIDER = 'DIVIDER',
  SPACER = 'SPACER',
  CUSTOM = 'CUSTOM',
  PRODUCT = 'PRODUCT',
  BLOG = 'BLOG',
  CONTAINER = 'CONTAINER',
  LAYOUT = 'LAYOUT',
}

export enum DeviceMode {
  DESKTOP = 'DESKTOP',
  TABLET = 'TABLET',
  MOBILE = 'MOBILE',
}

// ============================================
// Block Template & Instance Types
// ============================================

export interface BlockTemplate {
  id: string;
  name: string;
  slug: string;
  description?: string;
  category: BlockCategory;
  thumbnail?: string;
  previewUrl?: string;
  defaultConfig: Record<string, any>;
  configSchema: ConfigSchema;
  componentCode: string;
  htmlTemplate?: string;
  cssStyles?: string;
  isSystem: boolean;
  isActive: boolean;
  isPro: boolean;
  usageCount: number;
}

// ============================================
// Three-Tab Configuration Types
// ============================================

export interface ContentConfig {
  [key: string]: any;
}

export interface StyleConfig {
  // Colors
  backgroundColor?: string;
  textColor?: string;
  borderColor?: string;

  // Typography
  fontSize?: string;
  fontFamily?: string;
  fontWeight?: string;
  lineHeight?: string;
  letterSpacing?: string;
  textAlign?: 'left' | 'center' | 'right' | 'justify';

  // Spacing
  padding?: {
    top?: number;
    right?: number;
    bottom?: number;
    left?: number;
  };
  margin?: {
    top?: number;
    right?: number;
    bottom?: number;
    left?: number;
  };

  // Border
  borderWidth?: number;
  borderStyle?: 'solid' | 'dashed' | 'dotted' | 'double' | 'none';
  borderRadius?: {
    topLeft?: number;
    topRight?: number;
    bottomRight?: number;
    bottomLeft?: number;
  };

  // Background
  backgroundImage?: string;
  backgroundSize?: 'cover' | 'contain' | 'auto';
  backgroundPosition?: string;
  backgroundRepeat?: 'repeat' | 'no-repeat' | 'repeat-x' | 'repeat-y';

  // Shadow
  boxShadow?: string;
  textShadow?: string;

  // Size
  width?: string;
  height?: string;
  maxWidth?: string;
  maxHeight?: string;
  minWidth?: string;
  minHeight?: string;

  [key: string]: any;
}

export interface AdvancedConfig {
  // Custom CSS & Classes
  customCss?: string;
  customClasses?: string;

  // Positioning
  position?: 'static' | 'relative' | 'absolute' | 'fixed' | 'sticky';
  top?: number;
  right?: number;
  bottom?: number;
  left?: number;
  zIndex?: number;

  // Display
  display?: 'block' | 'inline' | 'inline-block' | 'flex' | 'grid' | 'none';
  overflow?: 'visible' | 'hidden' | 'scroll' | 'auto';

  // Animation
  animationType?: string;
  animationDelay?: number;
  animationDuration?: number;
  animationEasing?: string;

  // Visibility Rules
  hideOnMobile?: boolean;
  hideOnTablet?: boolean;
  hideOnDesktop?: boolean;
  visibilityRules?: VisibilityRule[];

  // Advanced Features
  customAttributes?: Record<string, string>;
  customData?: Record<string, any>;

  [key: string]: any;
}

export interface VisibilityRule {
  type: 'user_role' | 'date_range' | 'time_range' | 'device' | 'custom';
  condition: Record<string, any>;
}

// ============================================
// Layout Settings (for containers)
// ============================================

export interface FlexboxSettings {
  direction: 'row' | 'column' | 'row-reverse' | 'column-reverse';
  wrap: 'nowrap' | 'wrap' | 'wrap-reverse';
  justifyContent: 'flex-start' | 'flex-end' | 'center' | 'space-between' | 'space-around' | 'space-evenly';
  alignItems: 'flex-start' | 'flex-end' | 'center' | 'baseline' | 'stretch';
  alignContent?: 'flex-start' | 'flex-end' | 'center' | 'space-between' | 'space-around' | 'stretch';
  gap?: number;
}

export interface GridSettings {
  columns: number | string;
  rows?: number | string;
  columnGap?: number;
  rowGap?: number;
  autoFlow?: 'row' | 'column' | 'row dense' | 'column dense';
  justifyItems?: 'start' | 'end' | 'center' | 'stretch';
  alignItems?: 'start' | 'end' | 'center' | 'stretch';
}

export type LayoutSettings = FlexboxSettings | GridSettings | Record<string, any>;

// ============================================
// Editor Block Type
// ============================================

export interface EditorBlock {
  id: string;
  templateId: string;

  // Container support
  containerType: ContainerType;
  parentId?: string | null;
  children?: EditorBlock[];

  // Three-tab configuration
  contentConfig: ContentConfig;
  styleConfig?: StyleConfig;
  advancedConfig?: AdvancedConfig;

  // Layout settings (for containers)
  layoutSettings?: LayoutSettings;

  // Legacy config (backwards compatibility)
  config?: Record<string, any>;

  // Position
  order: number;

  // Visibility
  isVisible: boolean;

  // Template reference (populated when loaded)
  template?: BlockTemplate;
}

// ============================================
// Config Schema Types
// ============================================

export interface ConfigField {
  type: 'text' | 'textarea' | 'number' | 'image' | 'color' | 'select' | 'toggle' | 'slider' | 'repeater' | 'rich_text' | 'date';
  name: string;
  label: string;
  placeholder?: string;
  defaultValue?: any;
  required?: boolean;
  description?: string;

  // Validation
  min?: number;
  max?: number;
  step?: number;
  minLength?: number;
  maxLength?: number;
  pattern?: string;

  // Select options
  options?: Array<{ label: string; value: any }>;

  // Repeater fields
  fields?: ConfigField[];
  minItems?: number;
  maxItems?: number;

  // Conditional visibility
  condition?: {
    field: string;
    operator: 'equals' | 'notEquals' | 'contains' | 'greaterThan' | 'lessThan' | 'empty' | 'notEmpty';
    value: any;
  };

  // Tab assignment
  tab?: 'content' | 'style' | 'advanced';

  [key: string]: any;
}

export interface ConfigSection {
  id: string;
  label: string;
  icon?: string;
  fields: ConfigField[];
  collapsible?: boolean;
  collapsed?: boolean;
}

export interface ConfigTab {
  id: 'content' | 'style' | 'advanced' | string;
  label: string;
  icon?: string;
  sections?: ConfigSection[];
  fields?: ConfigField[];
}

export interface ConfigSchema {
  // Can use tabs, sections, or flat fields
  tabs?: ConfigTab[];
  sections?: ConfigSection[];
  fields?: ConfigField[];
}

// ============================================
// Page Data Types
// ============================================

export interface PageData {
  id: string;
  title: string;
  slug: string;
  description?: string;
  status: 'DRAFT' | 'PUBLISHED' | 'SCHEDULED' | 'ARCHIVED';
  useBlockEditor: boolean;

  // SEO
  seoTitle?: string;
  seoDescription?: string;
  seoKeywords?: string;
  ogImage?: string;

  // Layout config
  layoutConfig?: Record<string, any>;
  customCss?: string;
  customJs?: string;

  // Publishing
  publishedAt?: string | Date;
  scheduledPublishAt?: string | Date;
}

// ============================================
// Editor State Types
// ============================================

export interface EditorState {
  blocks: EditorBlock[];
  selectedBlockId: string | null;
  hoveredBlockId: string | null;
  deviceMode: DeviceMode;
  isDirty: boolean;
  isSaving: boolean;
  pageData: PageData;
}

export interface EditorHistory {
  blocks: EditorBlock[];
  pageData: PageData;
  timestamp: number;
}

// ============================================
// Navigator Types
// ============================================

export interface NavigatorNode {
  id: string;
  label: string;
  type: ContainerType;
  isVisible: boolean;
  isSelected: boolean;
  isExpanded: boolean;
  children?: NavigatorNode[];
  depth: number;
}

// ============================================
// Context Menu Types
// ============================================

export interface ContextMenuItem {
  id: string;
  label: string;
  icon?: string;
  action: () => void;
  shortcut?: string;
  disabled?: boolean;
  separator?: boolean;
  submenu?: ContextMenuItem[];
}

// ============================================
// Clipboard Types
// ============================================

export interface ClipboardData {
  type: 'block' | 'style';
  data: EditorBlock | StyleConfig;
  timestamp: number;
}

// ============================================
// Export Types
// ============================================

export type {
  EditorBlock as default,
};
