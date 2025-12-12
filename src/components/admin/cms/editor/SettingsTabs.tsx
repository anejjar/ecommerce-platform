/**
 * Settings Tabs Component
 *
 * Three-tab configuration panel matching Elementor's UX:
 * - Content Tab: Text, images, links, and content settings
 * - Style Tab: Colors, typography, spacing, backgrounds
 * - Advanced Tab: Custom CSS, animations, positioning, responsive visibility
 */

import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FileText, Palette, Settings2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ConfigForm } from '../block-editor/ConfigForm';
import { EditorBlock } from '@/types/editor';
import { ScrollArea } from '@/components/ui/scroll-area';

interface SettingsTabsProps {
  block: EditorBlock;
  onUpdateConfig: (tab: 'content' | 'style' | 'advanced', config: any) => void;
  className?: string;
}

export const SettingsTabs: React.FC<SettingsTabsProps> = ({
  block,
  onUpdateConfig,
  className,
}) => {
  const [activeTab, setActiveTab] = useState<'content' | 'style' | 'advanced'>('content');

  // Get schema for the block
  const schema = block.template?.configSchema;

  // If schema has tabs defined, use them
  if (schema?.tabs) {
    return (
      <div className={cn('h-full flex flex-col overflow-hidden', className)}>
        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as any)} className="flex-1 flex flex-col overflow-hidden">
          <TabsList className="grid w-full grid-cols-3 h-auto p-1 bg-gray-100 shrink-0">
            {schema.tabs.map((tab: any) => (
              <TabsTrigger
                key={tab.id}
                value={tab.id}
                className={cn(
                  'flex items-center gap-2 py-2.5 text-xs font-medium transition-all',
                  'data-[state=active]:bg-white data-[state=active]:shadow-sm'
                )}
              >
                {getTabIcon(tab.id)}
                <span>{tab.label}</span>
              </TabsTrigger>
            ))}
          </TabsList>

          <div className="flex-1 overflow-hidden min-h-0">
            {schema.tabs.map((tab: any) => (
              <TabsContent
                key={tab.id}
                value={tab.id}
                className="h-full mt-0 data-[state=inactive]:hidden"
              >
                <ScrollArea className="h-full">
                  <div className="p-4 pb-8">
                    {tab.sections ? (
                      // Render sections
                      <div className="space-y-4">
                        {tab.sections.map((section: any) => (
                          <div key={section.id} className="space-y-3">
                            <h3 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
                              {section.icon && <span>{section.icon}</span>}
                              {section.label}
                            </h3>
                            <ConfigForm
                              schema={{ fields: section.fields }}
                              config={getConfigForTab(block, tab.id)}
                              onChange={(newConfig) => onUpdateConfig(tab.id, newConfig)}
                            />
                          </div>
                        ))}
                      </div>
                    ) : tab.fields ? (
                      // Render fields directly
                      <ConfigForm
                        schema={{ fields: tab.fields }}
                        config={getConfigForTab(block, tab.id)}
                        onChange={(newConfig) => onUpdateConfig(tab.id, newConfig)}
                      />
                    ) : null}
                  </div>
                </ScrollArea>
              </TabsContent>
            ))}
          </div>
        </Tabs>
      </div>
    );
  }

  // Fallback: Auto-organize fields into tabs based on naming conventions
  const contentFields = schema?.fields?.filter((f: any) => !isStyleField(f) && !isAdvancedField(f)) || [];
  const styleFields = schema?.fields?.filter((f: any) => isStyleField(f)) || [];
  const advancedFields = schema?.fields?.filter((f: any) => isAdvancedField(f)) || [];

  return (
    <div className={cn('h-full flex flex-col overflow-hidden', className)}>
      <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as any)} className="flex-1 flex flex-col overflow-hidden">
        <TabsList className="grid w-full grid-cols-3 h-auto p-1 bg-gray-100 shrink-0">
          <TabsTrigger
            value="content"
            className="flex items-center gap-2 py-2.5 text-xs font-medium data-[state=active]:bg-white data-[state=active]:shadow-sm"
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Content</span>
          </TabsTrigger>
          <TabsTrigger
            value="style"
            className="flex items-center gap-2 py-2.5 text-xs font-medium data-[state=active]:bg-white data-[state=active]:shadow-sm"
          >
            <Palette className="w-3.5 h-3.5" />
            <span>Style</span>
          </TabsTrigger>
          <TabsTrigger
            value="advanced"
            className="flex items-center gap-2 py-2.5 text-xs font-medium data-[state=active]:bg-white data-[state=active]:shadow-sm"
          >
            <Settings2 className="w-3.5 h-3.5" />
            <span>Advanced</span>
          </TabsTrigger>
        </TabsList>

        <div className="flex-1 overflow-hidden min-h-0">
          <TabsContent value="content" className="h-full mt-0 data-[state=inactive]:hidden">
            <ScrollArea className="h-full">
              <div className="p-4 pb-8">
                {contentFields.length > 0 ? (
                  <ConfigForm
                    schema={{ fields: contentFields }}
                    config={block.contentConfig}
                    onChange={(newConfig) => onUpdateConfig('content', newConfig)}
                  />
                ) : (
                  <EmptyTabState
                    title="No Content Settings"
                    description="This block doesn't have any content settings to configure."
                  />
                )}
              </div>
            </ScrollArea>
          </TabsContent>

          <TabsContent value="style" className="h-full mt-0 data-[state=inactive]:hidden">
            <ScrollArea className="h-full">
              <div className="p-4 pb-8">
                {styleFields.length > 0 ? (
                  <ConfigForm
                    schema={{ fields: styleFields }}
                    config={block.styleConfig || {}}
                    onChange={(newConfig) => onUpdateConfig('style', newConfig)}
                  />
                ) : (
                  <>
                    <StyleTabDefaults
                      config={block.styleConfig || {}}
                      onChange={(newConfig) => onUpdateConfig('style', newConfig)}
                    />
                  </>
                )}
              </div>
            </ScrollArea>
          </TabsContent>

          <TabsContent value="advanced" className="h-full mt-0 data-[state=inactive]:hidden">
            <ScrollArea className="h-full">
              <div className="p-4 pb-8">
                {advancedFields.length > 0 ? (
                  <ConfigForm
                    schema={{ fields: advancedFields }}
                    config={block.advancedConfig || {}}
                    onChange={(newConfig) => onUpdateConfig('advanced', newConfig)}
                  />
                ) : (
                  <AdvancedTabDefaults
                    config={block.advancedConfig || {}}
                    onChange={(newConfig) => onUpdateConfig('advanced', newConfig)}
                  />
                )}
              </div>
            </ScrollArea>
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
};

/**
 * Get icon for tab
 */
function getTabIcon(tabId: string) {
  switch (tabId) {
    case 'content':
      return <FileText className="w-3.5 h-3.5" />;
    case 'style':
      return <Palette className="w-3.5 h-3.5" />;
    case 'advanced':
      return <Settings2 className="w-3.5 h-3.5" />;
    default:
      return null;
  }
}

/**
 * Get config for specific tab
 */
function getConfigForTab(block: EditorBlock, tabId: string): any {
  switch (tabId) {
    case 'content':
      return block.contentConfig;
    case 'style':
      return block.styleConfig || {};
    case 'advanced':
      return block.advancedConfig || {};
    default:
      return {};
  }
}

/**
 * Check if field belongs to style tab
 */
function isStyleField(field: any): boolean {
  const styleKeywords = [
    'color',
    'background',
    'font',
    'text',
    'padding',
    'margin',
    'border',
    'shadow',
    'size',
    'width',
    'height',
    'spacing',
    'typography',
    'align',
    'radius',
  ];

  return styleKeywords.some((keyword) =>
    field.name.toLowerCase().includes(keyword)
  );
}

/**
 * Check if field belongs to advanced tab
 */
function isAdvancedField(field: any): boolean {
  const advancedKeywords = [
    'animation',
    'custom',
    'css',
    'class',
    'position',
    'zindex',
    'overflow',
    'transform',
    'transition',
  ];

  return advancedKeywords.some((keyword) =>
    field.name.toLowerCase().includes(keyword)
  );
}

/**
 * Empty tab state component
 */
interface EmptyTabStateProps {
  title: string;
  description: string;
}

const EmptyTabState: React.FC<EmptyTabStateProps> = ({ title, description }) => (
  <div className="flex flex-col items-center justify-center py-12 text-center">
    <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mb-3">
      <Settings2 className="w-6 h-6 text-gray-400" />
    </div>
    <h3 className="text-sm font-medium text-gray-900 mb-1">{title}</h3>
    <p className="text-xs text-gray-500 max-w-xs">{description}</p>
  </div>
);

/**
 * Style tab with default controls
 */
interface StyleTabDefaultsProps {
  config: any;
  onChange: (config: any) => void;
}

const StyleTabDefaults: React.FC<StyleTabDefaultsProps> = ({ config, onChange }) => {
  const defaultStyleSchema = {
    fields: [
      {
        type: 'color',
        name: 'backgroundColor',
        label: 'Background Color',
        defaultValue: '',
      },
      {
        type: 'color',
        name: 'textColor',
        label: 'Text Color',
        defaultValue: '',
      },
      {
        type: 'number',
        name: 'padding',
        label: 'Padding (px)',
        min: 0,
        max: 200,
        defaultValue: 0,
      },
      {
        type: 'number',
        name: 'margin',
        label: 'Margin (px)',
        min: 0,
        max: 200,
        defaultValue: 0,
      },
    ],
  };

  return <ConfigForm schema={defaultStyleSchema} config={config} onChange={onChange} />;
};

/**
 * Advanced tab with default controls
 */
interface AdvancedTabDefaultsProps {
  config: any;
  onChange: (config: any) => void;
}

const AdvancedTabDefaults: React.FC<AdvancedTabDefaultsProps> = ({ config, onChange }) => {
  const defaultAdvancedSchema = {
    fields: [
      {
        type: 'textarea',
        name: 'customCss',
        label: 'Custom CSS',
        placeholder: '/* Add custom CSS here */',
        defaultValue: '',
      },
      {
        type: 'text',
        name: 'customClasses',
        label: 'CSS Classes',
        placeholder: 'class-1 class-2',
        defaultValue: '',
      },
      {
        type: 'toggle',
        name: 'hideOnMobile',
        label: 'Hide on Mobile',
        defaultValue: false,
      },
      {
        type: 'toggle',
        name: 'hideOnTablet',
        label: 'Hide on Tablet',
        defaultValue: false,
      },
      {
        type: 'toggle',
        name: 'hideOnDesktop',
        label: 'Hide on Desktop',
        defaultValue: false,
      },
    ],
  };

  return <ConfigForm schema={defaultAdvancedSchema} config={config} onChange={onChange} />;
};
