/**
 * Container Component
 *
 * Renders different types of container blocks (Section, Flexbox, Grid)
 * with support for nested children and layout customization.
 */

import React from 'react';
import { cn } from '@/lib/utils';
import { ContainerType, EditorBlock, FlexboxSettings, GridSettings } from '@/types/editor';
import { Plus } from 'lucide-react';

interface ContainerProps {
  block: EditorBlock;
  children?: React.ReactNode;
  isSelected?: boolean;
  isHovered?: boolean;
  className?: string;
  onAddBlockToContainer?: (containerId: string) => void;
}

export const Container: React.FC<ContainerProps> = ({
  block,
  children,
  isSelected = false,
  isHovered = false,
  className,
  onAddBlockToContainer,
}) => {
  const { containerType, layoutSettings, styleConfig, advancedConfig } = block;

  // Get container-specific styles
  const getContainerStyles = (): React.CSSProperties => {
    const styles: React.CSSProperties = {};

    // Apply style config
    if (styleConfig) {
      if (styleConfig.backgroundColor) styles.backgroundColor = styleConfig.backgroundColor;
      if (styleConfig.padding) {
        const p = styleConfig.padding;
        styles.padding = `${p.top || 0}px ${p.right || 0}px ${p.bottom || 0}px ${p.left || 0}px`;
      }
      if (styleConfig.margin) {
        const m = styleConfig.margin;
        styles.margin = `${m.top || 0}px ${m.right || 0}px ${m.bottom || 0}px ${m.left || 0}px`;
      }
      if (styleConfig.borderRadius) {
        const br = styleConfig.borderRadius;
        styles.borderRadius = `${br.topLeft || 0}px ${br.topRight || 0}px ${br.bottomRight || 0}px ${br.bottomLeft || 0}px`;
      }
      if (styleConfig.borderWidth && styleConfig.borderStyle && styleConfig.borderColor) {
        styles.border = `${styleConfig.borderWidth}px ${styleConfig.borderStyle} ${styleConfig.borderColor}`;
      }
      if (styleConfig.boxShadow) styles.boxShadow = styleConfig.boxShadow;
      if (styleConfig.backgroundImage) {
        styles.backgroundImage = `url(${styleConfig.backgroundImage})`;
        if (styleConfig.backgroundSize) styles.backgroundSize = styleConfig.backgroundSize;
        if (styleConfig.backgroundPosition) styles.backgroundPosition = styleConfig.backgroundPosition;
        if (styleConfig.backgroundRepeat) styles.backgroundRepeat = styleConfig.backgroundRepeat;
      }
      if (styleConfig.width) styles.width = styleConfig.width;
      if (styleConfig.height) styles.height = styleConfig.height;
      if (styleConfig.maxWidth) styles.maxWidth = styleConfig.maxWidth;
      if (styleConfig.minHeight) styles.minHeight = styleConfig.minHeight;
    }

    // Apply advanced config
    if (advancedConfig) {
      if (advancedConfig.position) styles.position = advancedConfig.position;
      if (advancedConfig.zIndex !== undefined) styles.zIndex = advancedConfig.zIndex;
      if (advancedConfig.overflow) styles.overflow = advancedConfig.overflow;
    }

    return styles;
  };

  // Get layout-specific styles and classes
  const getLayoutConfig = () => {
    if (!layoutSettings) {
      return { styles: {}, classes: '' };
    }

    const styles: React.CSSProperties = {};
    let classes = '';

    switch (containerType) {
      case ContainerType.FLEXBOX: {
        const flexSettings = layoutSettings as FlexboxSettings;
        styles.display = 'flex';
        styles.flexDirection = flexSettings.direction || 'row';
        styles.flexWrap = flexSettings.wrap || 'nowrap';
        styles.justifyContent = flexSettings.justifyContent || 'flex-start';
        styles.alignItems = flexSettings.alignItems || 'stretch';
        if (flexSettings.alignContent) styles.alignContent = flexSettings.alignContent;
        if (flexSettings.gap) styles.gap = `${flexSettings.gap}px`;
        break;
      }

      case ContainerType.GRID: {
        const gridSettings = layoutSettings as GridSettings;
        styles.display = 'grid';

        // Handle grid columns
        if (typeof gridSettings.columns === 'number') {
          styles.gridTemplateColumns = `repeat(${gridSettings.columns}, 1fr)`;
        } else if (gridSettings.columns) {
          styles.gridTemplateColumns = gridSettings.columns;
        }

        // Handle grid rows
        if (typeof gridSettings.rows === 'number') {
          styles.gridTemplateRows = `repeat(${gridSettings.rows}, 1fr)`;
        } else if (gridSettings.rows) {
          styles.gridTemplateRows = gridSettings.rows;
        }

        if (gridSettings.columnGap) styles.columnGap = `${gridSettings.columnGap}px`;
        if (gridSettings.rowGap) styles.rowGap = `${gridSettings.rowGap}px`;
        if (gridSettings.autoFlow) styles.gridAutoFlow = gridSettings.autoFlow;
        if (gridSettings.justifyItems) styles.justifyItems = gridSettings.justifyItems;
        if (gridSettings.alignItems) styles.alignItems = gridSettings.alignItems;
        break;
      }

      case ContainerType.SECTION: {
        // Section is full-width container
        classes = 'w-full';
        const flexSettings = layoutSettings as FlexboxSettings;
        if (flexSettings) {
          styles.display = 'flex';
          styles.flexDirection = flexSettings.direction || 'column';
          styles.alignItems = flexSettings.alignItems || 'stretch';
          if (flexSettings.gap) styles.gap = `${flexSettings.gap}px`;
        }
        break;
      }

      default:
        break;
    }

    return { styles, classes };
  };

  const containerStyles = getContainerStyles();
  const layoutConfig = getLayoutConfig();
  const combinedStyles = { ...layoutConfig.styles, ...containerStyles };

  // Visibility classes based on responsive settings
  const getVisibilityClasses = () => {
    const classes: string[] = [];

    if (advancedConfig?.hideOnMobile) classes.push('hidden md:block');
    else if (advancedConfig?.hideOnTablet) classes.push('block md:hidden lg:block');
    else if (advancedConfig?.hideOnDesktop) classes.push('block lg:hidden');

    return classes.join(' ');
  };

  const visibilityClasses = getVisibilityClasses();

  return (
    <div
      data-block-id={block.id}
      data-container-type={containerType}
      className={cn(
        'transition-all duration-200',
        layoutConfig.classes,
        visibilityClasses,
        advancedConfig?.customClasses,
        // Selection and hover states
        isSelected && 'ring-2 ring-primary ring-offset-2',
        isHovered && !isSelected && 'ring-1 ring-gray-300',
        className
      )}
      style={combinedStyles}
    >
      {/* Custom CSS via style tag */}
      {advancedConfig?.customCss && (
        <style
          dangerouslySetInnerHTML={{
            __html: `[data-block-id="${block.id}"] { ${advancedConfig.customCss} }`,
          }}
        />
      )}

      {/* Container children */}
      {children}

      {/* Empty container placeholder */}
      {(!children || React.Children.count(children) === 0) && containerType !== ContainerType.BLOCK && (
        <div className="min-h-[120px] border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center bg-gray-50/50 hover:bg-gray-100/50 hover:border-primary/50 transition-all group/empty">
          <div className="text-center p-4">
            <button
              onClick={(e) => {
                e.stopPropagation();
                if (onAddBlockToContainer) {
                  onAddBlockToContainer(block.id);
                }
              }}
              className="inline-flex items-center gap-2 px-4 py-2 bg-white hover:bg-primary hover:text-white border-2 border-dashed border-gray-300 hover:border-primary rounded-lg text-gray-500 hover:text-white transition-all group-hover/empty:border-primary/50"
            >
              <Plus className="h-4 w-4" />
              <span className="text-sm font-medium">Add Block to {containerType}</span>
            </button>
            <div className="text-xs text-gray-400 mt-2">or drag blocks here</div>
          </div>
        </div>
      )}
    </div>
  );
};

/**
 * Container Label Component
 * Shows the container type label in the editor
 */
interface ContainerLabelProps {
  containerType: ContainerType;
  blockName?: string;
}

export const ContainerLabel: React.FC<ContainerLabelProps> = ({ containerType, blockName }) => {
  const getIcon = () => {
    switch (containerType) {
      case ContainerType.SECTION:
        return (
          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5h16M4 12h16M4 19h16" />
          </svg>
        );
      case ContainerType.FLEXBOX:
        return (
          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7" />
          </svg>
        );
      case ContainerType.GRID:
        return (
          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM14 5a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1V5zM4 15a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1H5a1 1 0 01-1-1v-4zM14 15a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1v-4z" />
          </svg>
        );
      default:
        return null;
    }
  };

  if (containerType === ContainerType.BLOCK) {
    return null;
  }

  return (
    <div className="inline-flex items-center gap-1.5 bg-purple-600 text-white text-[10px] font-semibold px-2 py-0.5 rounded-full shadow-sm uppercase tracking-wider">
      {getIcon()}
      <span>{containerType}</span>
    </div>
  );
};
