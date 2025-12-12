/**
 * Seed Elementor-Style Widgets
 *
 * Creates a comprehensive library of widgets similar to Elementor
 */

import { PrismaClient, BlockCategory } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding Elementor-style widgets...\n');

  // ============================================
  // BASIC WIDGETS
  // ============================================

  console.log('📝 Creating Basic Widgets...');

  // Heading Widget
  await prisma.blockTemplate.upsert({
    where: { slug: 'heading' },
    update: {},
    create: {
      slug: 'heading',
      name: 'Heading',
      description: 'Add eye-catching headlines',
      category: BlockCategory.CONTENT,
      componentCode: '// Heading component',
      isActive: true,
      configSchema: {
        tabs: [
          {
            id: 'content',
            label: 'Content',
            fields: [
              {
                type: 'text',
                name: 'title',
                label: 'Title',
                defaultValue: 'Your Heading',
              },
              {
                type: 'select',
                name: 'tag',
                label: 'HTML Tag',
                options: [
                  { label: 'H1', value: 'h1' },
                  { label: 'H2', value: 'h2' },
                  { label: 'H3', value: 'h3' },
                  { label: 'H4', value: 'h4' },
                  { label: 'H5', value: 'h5' },
                  { label: 'H6', value: 'h6' },
                ],
                defaultValue: 'h2',
              },
              {
                type: 'text',
                name: 'link',
                label: 'Link',
                defaultValue: '',
              },
            ],
          },
          {
            id: 'style',
            label: 'Style',
            fields: [
              {
                type: 'color',
                name: 'color',
                label: 'Text Color',
                defaultValue: '#000000',
              },
              {
                type: 'select',
                name: 'fontFamily',
                label: 'Font Family',
                options: [
                  { label: 'Default', value: 'inherit' },
                  { label: 'Arial', value: 'Arial, sans-serif' },
                  { label: 'Helvetica', value: 'Helvetica, sans-serif' },
                  { label: 'Times New Roman', value: 'Times New Roman, serif' },
                  { label: 'Georgia', value: 'Georgia, serif' },
                  { label: 'Inter', value: 'Inter, sans-serif' },
                ],
                defaultValue: 'inherit',
              },
              {
                type: 'number',
                name: 'fontSize',
                label: 'Font Size (px)',
                defaultValue: 32,
                min: 10,
                max: 100,
              },
              {
                type: 'select',
                name: 'fontWeight',
                label: 'Font Weight',
                options: [
                  { label: 'Normal', value: '400' },
                  { label: 'Medium', value: '500' },
                  { label: 'Semi Bold', value: '600' },
                  { label: 'Bold', value: '700' },
                  { label: 'Extra Bold', value: '800' },
                ],
                defaultValue: '700',
              },
              {
                type: 'select',
                name: 'textAlign',
                label: 'Alignment',
                options: [
                  { label: 'Left', value: 'left' },
                  { label: 'Center', value: 'center' },
                  { label: 'Right', value: 'right' },
                  { label: 'Justify', value: 'justify' },
                ],
                defaultValue: 'left',
              },
            ],
          },
        ],
      },
      defaultConfig: {
        title: 'Your Heading',
        tag: 'h2',
        color: '#000000',
        fontSize: 32,
        fontWeight: '700',
        textAlign: 'left',
      },
    },
  });

  // Text Editor Widget
  await prisma.blockTemplate.upsert({
    where: { slug: 'text-editor' },
    update: {},
    create: {
      slug: 'text-editor',
      name: 'Text Editor',
      description: 'Add rich text content',
      category: BlockCategory.CONTENT,
      componentCode: '// Text editor component',
      isActive: true,
      configSchema: {
        tabs: [
          {
            id: 'content',
            label: 'Content',
            fields: [
              {
                type: 'richtext',
                name: 'content',
                label: 'Content',
                defaultValue: '<p>Add your text here...</p>',
              },
            ],
          },
          {
            id: 'style',
            label: 'Style',
            fields: [
              {
                type: 'color',
                name: 'textColor',
                label: 'Text Color',
                defaultValue: '#333333',
              },
              {
                type: 'number',
                name: 'fontSize',
                label: 'Font Size (px)',
                defaultValue: 16,
                min: 10,
                max: 72,
              },
              {
                type: 'select',
                name: 'textAlign',
                label: 'Alignment',
                options: [
                  { label: 'Left', value: 'left' },
                  { label: 'Center', value: 'center' },
                  { label: 'Right', value: 'right' },
                  { label: 'Justify', value: 'justify' },
                ],
                defaultValue: 'left',
              },
            ],
          },
        ],
      },
      defaultConfig: {
        content: '<p>Add your text here...</p>',
        textColor: '#333333',
        fontSize: 16,
        textAlign: 'left',
      },
    },
  });

  // Button Widget
  await prisma.blockTemplate.upsert({
    where: { slug: 'button' },
    update: {},
    create: {
      slug: 'button',
      name: 'Button',
      description: 'Add customizable buttons',
      category: BlockCategory.CONTENT,
      componentCode: '// Button component',
      isActive: true,
      configSchema: {
        tabs: [
          {
            id: 'content',
            label: 'Content',
            fields: [
              {
                type: 'text',
                name: 'text',
                label: 'Button Text',
                defaultValue: 'Click Here',
              },
              {
                type: 'text',
                name: 'link',
                label: 'Link',
                defaultValue: '#',
              },
              {
                type: 'select',
                name: 'size',
                label: 'Size',
                options: [
                  { label: 'Small', value: 'sm' },
                  { label: 'Medium', value: 'md' },
                  { label: 'Large', value: 'lg' },
                  { label: 'Extra Large', value: 'xl' },
                ],
                defaultValue: 'md',
              },
            ],
          },
          {
            id: 'style',
            label: 'Style',
            fields: [
              {
                type: 'color',
                name: 'backgroundColor',
                label: 'Background Color',
                defaultValue: '#0066ff',
              },
              {
                type: 'color',
                name: 'textColor',
                label: 'Text Color',
                defaultValue: '#ffffff',
              },
              {
                type: 'number',
                name: 'borderRadius',
                label: 'Border Radius (px)',
                defaultValue: 4,
                min: 0,
                max: 50,
              },
              {
                type: 'select',
                name: 'alignment',
                label: 'Alignment',
                options: [
                  { label: 'Left', value: 'left' },
                  { label: 'Center', value: 'center' },
                  { label: 'Right', value: 'right' },
                  { label: 'Justify', value: 'justify' },
                ],
                defaultValue: 'left',
              },
            ],
          },
        ],
      },
      defaultConfig: {
        text: 'Click Here',
        link: '#',
        size: 'md',
        backgroundColor: '#0066ff',
        textColor: '#ffffff',
        borderRadius: 4,
        alignment: 'left',
      },
    },
  });

  // Image Widget
  await prisma.blockTemplate.upsert({
    where: { slug: 'image' },
    update: {},
    create: {
      slug: 'image',
      name: 'Image',
      description: 'Add images to your page',
      category: BlockCategory.CONTENT,
      componentCode: '// Image component',
      isActive: true,
      configSchema: {
        tabs: [
          {
            id: 'content',
            label: 'Content',
            fields: [
              {
                type: 'image',
                name: 'image',
                label: 'Choose Image',
                defaultValue: '',
              },
              {
                type: 'text',
                name: 'alt',
                label: 'Alt Text',
                defaultValue: '',
              },
              {
                type: 'text',
                name: 'link',
                label: 'Link',
                defaultValue: '',
              },
            ],
          },
          {
            id: 'style',
            label: 'Style',
            fields: [
              {
                type: 'select',
                name: 'width',
                label: 'Width',
                options: [
                  { label: 'Auto', value: 'auto' },
                  { label: '25%', value: '25%' },
                  { label: '50%', value: '50%' },
                  { label: '75%', value: '75%' },
                  { label: '100%', value: '100%' },
                  { label: 'Custom', value: 'custom' },
                ],
                defaultValue: '100%',
              },
              {
                type: 'select',
                name: 'alignment',
                label: 'Alignment',
                options: [
                  { label: 'Left', value: 'left' },
                  { label: 'Center', value: 'center' },
                  { label: 'Right', value: 'right' },
                ],
                defaultValue: 'center',
              },
              {
                type: 'number',
                name: 'borderRadius',
                label: 'Border Radius (px)',
                defaultValue: 0,
                min: 0,
                max: 500,
              },
            ],
          },
        ],
      },
      defaultConfig: {
        image: '',
        alt: '',
        width: '100%',
        alignment: 'center',
        borderRadius: 0,
      },
    },
  });

  // Icon Widget
  await prisma.blockTemplate.upsert({
    where: { slug: 'icon' },
    update: {},
    create: {
      slug: 'icon',
      name: 'Icon',
      description: 'Add icons from Lucide library',
      category: BlockCategory.CONTENT,
      componentCode: '// Icon component',
      isActive: true,
      configSchema: {
        tabs: [
          {
            id: 'content',
            label: 'Content',
            fields: [
              {
                type: 'text',
                name: 'iconName',
                label: 'Icon Name (Lucide)',
                defaultValue: 'Star',
              },
              {
                type: 'text',
                name: 'link',
                label: 'Link',
                defaultValue: '',
              },
            ],
          },
          {
            id: 'style',
            label: 'Style',
            fields: [
              {
                type: 'color',
                name: 'color',
                label: 'Icon Color',
                defaultValue: '#0066ff',
              },
              {
                type: 'number',
                name: 'size',
                label: 'Size (px)',
                defaultValue: 50,
                min: 10,
                max: 200,
              },
              {
                type: 'select',
                name: 'alignment',
                label: 'Alignment',
                options: [
                  { label: 'Left', value: 'left' },
                  { label: 'Center', value: 'center' },
                  { label: 'Right', value: 'right' },
                ],
                defaultValue: 'center',
              },
            ],
          },
        ],
      },
      defaultConfig: {
        iconName: 'Star',
        color: '#0066ff',
        size: 50,
        alignment: 'center',
      },
    },
  });

  // Divider Widget
  await prisma.blockTemplate.upsert({
    where: { slug: 'divider-widget' },
    update: {},
    create: {
      slug: 'divider-widget',
      name: 'Divider',
      description: 'Separate content with a divider line',
      category: BlockCategory.LAYOUT,
      componentCode: '// Divider component',
      isActive: true,
      configSchema: {
        tabs: [
          {
            id: 'style',
            label: 'Style',
            fields: [
              {
                type: 'select',
                name: 'style',
                label: 'Style',
                options: [
                  { label: 'Solid', value: 'solid' },
                  { label: 'Dashed', value: 'dashed' },
                  { label: 'Dotted', value: 'dotted' },
                  { label: 'Double', value: 'double' },
                ],
                defaultValue: 'solid',
              },
              {
                type: 'color',
                name: 'color',
                label: 'Color',
                defaultValue: '#e0e0e0',
              },
              {
                type: 'number',
                name: 'weight',
                label: 'Weight (px)',
                defaultValue: 1,
                min: 1,
                max: 10,
              },
              {
                type: 'number',
                name: 'width',
                label: 'Width (%)',
                defaultValue: 100,
                min: 1,
                max: 100,
              },
              {
                type: 'select',
                name: 'alignment',
                label: 'Alignment',
                options: [
                  { label: 'Left', value: 'left' },
                  { label: 'Center', value: 'center' },
                  { label: 'Right', value: 'right' },
                ],
                defaultValue: 'center',
              },
            ],
          },
        ],
      },
      defaultConfig: {
        style: 'solid',
        color: '#e0e0e0',
        weight: 1,
        width: 100,
        alignment: 'center',
      },
    },
  });

  // Spacer Widget
  await prisma.blockTemplate.upsert({
    where: { slug: 'spacer-widget' },
    update: {},
    create: {
      slug: 'spacer-widget',
      name: 'Spacer',
      description: 'Add vertical spacing',
      category: BlockCategory.LAYOUT,
      componentCode: '// Spacer component',
      isActive: true,
      configSchema: {
        tabs: [
          {
            id: 'content',
            label: 'Content',
            fields: [
              {
                type: 'number',
                name: 'height',
                label: 'Height (px)',
                defaultValue: 50,
                min: 0,
                max: 500,
              },
            ],
          },
        ],
      },
      defaultConfig: {
        height: 50,
      },
    },
  });

  console.log('✓ Basic widgets created\n');

  // ============================================
  // INTERACTIVE WIDGETS
  // ============================================

  console.log('🎮 Creating Interactive Widgets...');

  // Accordion Widget
  await prisma.blockTemplate.upsert({
    where: { slug: 'accordion' },
    update: {},
    create: {
      slug: 'accordion',
      name: 'Accordion',
      description: 'Create collapsible content sections',
      category: BlockCategory.CONTENT,
      componentCode: '// Accordion component',
      isActive: true,
      configSchema: {
        tabs: [
          {
            id: 'content',
            label: 'Content',
            fields: [
              {
                type: 'repeater',
                name: 'items',
                label: 'Accordion Items',
                itemLabel: 'Item',
                fields: [
                  {
                    type: 'text',
                    name: 'title',
                    label: 'Title',
                    defaultValue: 'Accordion Title',
                  },
                  {
                    type: 'textarea',
                    name: 'content',
                    label: 'Content',
                    defaultValue: 'Accordion content goes here...',
                  },
                ],
                defaultValue: [
                  {
                    title: 'Accordion Item 1',
                    content: 'Content for item 1',
                  },
                  {
                    title: 'Accordion Item 2',
                    content: 'Content for item 2',
                  },
                ],
              },
            ],
          },
          {
            id: 'style',
            label: 'Style',
            fields: [
              {
                type: 'color',
                name: 'titleColor',
                label: 'Title Color',
                defaultValue: '#000000',
              },
              {
                type: 'color',
                name: 'contentColor',
                label: 'Content Color',
                defaultValue: '#666666',
              },
              {
                type: 'color',
                name: 'borderColor',
                label: 'Border Color',
                defaultValue: '#e0e0e0',
              },
            ],
          },
        ],
      },
      defaultConfig: {
        items: [
          {
            title: 'Accordion Item 1',
            content: 'Content for item 1',
          },
          {
            title: 'Accordion Item 2',
            content: 'Content for item 2',
          },
        ],
        titleColor: '#000000',
        contentColor: '#666666',
        borderColor: '#e0e0e0',
      },
    },
  });

  // Tabs Widget
  await prisma.blockTemplate.upsert({
    where: { slug: 'tabs' },
    update: {},
    create: {
      slug: 'tabs',
      name: 'Tabs',
      description: 'Create tabbed content',
      category: BlockCategory.CONTENT,
      componentCode: '// Tabs component',
      isActive: true,
      configSchema: {
        tabs: [
          {
            id: 'content',
            label: 'Content',
            fields: [
              {
                type: 'repeater',
                name: 'tabs',
                label: 'Tabs',
                itemLabel: 'Tab',
                fields: [
                  {
                    type: 'text',
                    name: 'title',
                    label: 'Title',
                    defaultValue: 'Tab Title',
                  },
                  {
                    type: 'textarea',
                    name: 'content',
                    label: 'Content',
                    defaultValue: 'Tab content goes here...',
                  },
                ],
                defaultValue: [
                  {
                    title: 'Tab 1',
                    content: 'Content for tab 1',
                  },
                  {
                    title: 'Tab 2',
                    content: 'Content for tab 2',
                  },
                ],
              },
            ],
          },
          {
            id: 'style',
            label: 'Style',
            fields: [
              {
                type: 'color',
                name: 'activeTabColor',
                label: 'Active Tab Color',
                defaultValue: '#0066ff',
              },
              {
                type: 'color',
                name: 'tabTextColor',
                label: 'Tab Text Color',
                defaultValue: '#333333',
              },
            ],
          },
        ],
      },
      defaultConfig: {
        tabs: [
          {
            title: 'Tab 1',
            content: 'Content for tab 1',
          },
          {
            title: 'Tab 2',
            content: 'Content for tab 2',
          },
        ],
        activeTabColor: '#0066ff',
        tabTextColor: '#333333',
      },
    },
  });

  // Counter Widget
  await prisma.blockTemplate.upsert({
    where: { slug: 'counter' },
    update: {},
    create: {
      slug: 'counter',
      name: 'Counter',
      description: 'Animated number counter',
      category: BlockCategory.CONTENT,
      componentCode: '// Counter component',
      isActive: true,
      configSchema: {
        tabs: [
          {
            id: 'content',
            label: 'Content',
            fields: [
              {
                type: 'number',
                name: 'endValue',
                label: 'End Value',
                defaultValue: 100,
                min: 0,
                max: 1000000,
              },
              {
                type: 'text',
                name: 'prefix',
                label: 'Prefix',
                defaultValue: '',
              },
              {
                type: 'text',
                name: 'suffix',
                label: 'Suffix',
                defaultValue: '+',
              },
              {
                type: 'text',
                name: 'title',
                label: 'Title',
                defaultValue: 'Happy Customers',
              },
            ],
          },
          {
            id: 'style',
            label: 'Style',
            fields: [
              {
                type: 'color',
                name: 'numberColor',
                label: 'Number Color',
                defaultValue: '#0066ff',
              },
              {
                type: 'number',
                name: 'numberSize',
                label: 'Number Size (px)',
                defaultValue: 48,
                min: 20,
                max: 100,
              },
              {
                type: 'color',
                name: 'titleColor',
                label: 'Title Color',
                defaultValue: '#333333',
              },
            ],
          },
        ],
      },
      defaultConfig: {
        endValue: 100,
        prefix: '',
        suffix: '+',
        title: 'Happy Customers',
        numberColor: '#0066ff',
        numberSize: 48,
        titleColor: '#333333',
      },
    },
  });

  // Progress Bar Widget
  await prisma.blockTemplate.upsert({
    where: { slug: 'progress-bar' },
    update: {},
    create: {
      slug: 'progress-bar',
      name: 'Progress Bar',
      description: 'Show progress with a bar',
      category: BlockCategory.CONTENT,
      componentCode: '// Progress bar component',
      isActive: true,
      configSchema: {
        tabs: [
          {
            id: 'content',
            label: 'Content',
            fields: [
              {
                type: 'text',
                name: 'title',
                label: 'Title',
                defaultValue: 'Skill',
              },
              {
                type: 'number',
                name: 'percentage',
                label: 'Percentage',
                defaultValue: 80,
                min: 0,
                max: 100,
              },
            ],
          },
          {
            id: 'style',
            label: 'Style',
            fields: [
              {
                type: 'color',
                name: 'barColor',
                label: 'Bar Color',
                defaultValue: '#0066ff',
              },
              {
                type: 'color',
                name: 'backgroundColor',
                label: 'Background Color',
                defaultValue: '#e0e0e0',
              },
              {
                type: 'number',
                name: 'height',
                label: 'Height (px)',
                defaultValue: 10,
                min: 5,
                max: 50,
              },
            ],
          },
        ],
      },
      defaultConfig: {
        title: 'Skill',
        percentage: 80,
        barColor: '#0066ff',
        backgroundColor: '#e0e0e0',
        height: 10,
      },
    },
  });

  console.log('✓ Interactive widgets created\n');

  // ============================================
  // SOCIAL WIDGETS
  // ============================================

  console.log('📱 Creating Social Widgets...');

  // Social Icons Widget
  await prisma.blockTemplate.upsert({
    where: { slug: 'social-icons' },
    update: {},
    create: {
      slug: 'social-icons',
      name: 'Social Icons',
      description: 'Add social media icons',
      category: BlockCategory.CONTENT,
      componentCode: '// Social icons component',
      isActive: true,
      configSchema: {
        tabs: [
          {
            id: 'content',
            label: 'Content',
            fields: [
              {
                type: 'repeater',
                name: 'icons',
                label: 'Social Icons',
                itemLabel: 'Icon',
                fields: [
                  {
                    type: 'select',
                    name: 'platform',
                    label: 'Platform',
                    options: [
                      { label: 'Facebook', value: 'facebook' },
                      { label: 'Twitter', value: 'twitter' },
                      { label: 'Instagram', value: 'instagram' },
                      { label: 'LinkedIn', value: 'linkedin' },
                      { label: 'YouTube', value: 'youtube' },
                      { label: 'TikTok', value: 'tiktok' },
                      { label: 'GitHub', value: 'github' },
                    ],
                    defaultValue: 'facebook',
                  },
                  {
                    type: 'text',
                    name: 'url',
                    label: 'URL',
                    defaultValue: '#',
                  },
                ],
                defaultValue: [
                  {
                    platform: 'facebook',
                    url: '#',
                  },
                  {
                    platform: 'twitter',
                    url: '#',
                  },
                  {
                    platform: 'instagram',
                    url: '#',
                  },
                ],
              },
            ],
          },
          {
            id: 'style',
            label: 'Style',
            fields: [
              {
                type: 'number',
                name: 'size',
                label: 'Icon Size (px)',
                defaultValue: 24,
                min: 16,
                max: 64,
              },
              {
                type: 'number',
                name: 'spacing',
                label: 'Spacing (px)',
                defaultValue: 10,
                min: 0,
                max: 50,
              },
              {
                type: 'select',
                name: 'alignment',
                label: 'Alignment',
                options: [
                  { label: 'Left', value: 'left' },
                  { label: 'Center', value: 'center' },
                  { label: 'Right', value: 'right' },
                ],
                defaultValue: 'center',
              },
            ],
          },
        ],
      },
      defaultConfig: {
        icons: [
          {
            platform: 'facebook',
            url: '#',
          },
          {
            platform: 'twitter',
            url: '#',
          },
          {
            platform: 'instagram',
            url: '#',
          },
        ],
        size: 24,
        spacing: 10,
        alignment: 'center',
      },
    },
  });

  console.log('✓ Social widgets created\n');

  console.log('✅ All Elementor-style widgets have been seeded!\n');
  console.log('Total widgets created: 14');
  console.log('Categories: Basic, Interactive, Social, Layout');
}

main()
  .catch((e) => {
    console.error('Error seeding widgets:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
