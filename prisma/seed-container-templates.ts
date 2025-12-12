/**
 * Seed Container Templates
 *
 * Creates special container block templates that can hold child blocks
 */

import { PrismaClient, BlockCategory, ContainerType } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding container templates...');

  // Create or update container template
  const containerTemplate = await prisma.blockTemplate.upsert({
    where: { slug: 'container' },
    update: {
      name: 'Container',
      description: 'A generic container that can hold child blocks',
      category: BlockCategory.LAYOUT,
      componentCode: '// Container component - renders children',
      isActive: true,
      configSchema: {
        tabs: [
          {
            id: 'style',
            label: 'Style',
            fields: [
              {
                type: 'color',
                name: 'backgroundColor',
                label: 'Background Color',
                defaultValue: '',
              },
              {
                type: 'number',
                name: 'padding',
                label: 'Padding (px)',
                defaultValue: 16,
                min: 0,
                max: 200,
              },
              {
                type: 'number',
                name: 'margin',
                label: 'Margin (px)',
                defaultValue: 0,
                min: 0,
                max: 200,
              },
            ],
          },
          {
            id: 'advanced',
            label: 'Advanced',
            fields: [
              {
                type: 'textarea',
                name: 'customCss',
                label: 'Custom CSS',
                placeholder: '/* Add custom CSS here */',
                defaultValue: '',
              },
            ],
          },
        ],
      },
      defaultConfig: {
        backgroundColor: '',
        padding: 16,
        margin: 0,
      },
    },
    create: {
      slug: 'container',
      name: 'Container',
      description: 'A generic container that can hold child blocks',
      category: BlockCategory.LAYOUT,
      componentCode: '// Container component - renders children',
      isActive: true,
      configSchema: {
        tabs: [
          {
            id: 'style',
            label: 'Style',
            fields: [
              {
                type: 'color',
                name: 'backgroundColor',
                label: 'Background Color',
                defaultValue: '',
              },
              {
                type: 'number',
                name: 'padding',
                label: 'Padding (px)',
                defaultValue: 16,
                min: 0,
                max: 200,
              },
              {
                type: 'number',
                name: 'margin',
                label: 'Margin (px)',
                defaultValue: 0,
                min: 0,
                max: 200,
              },
            ],
          },
          {
            id: 'advanced',
            label: 'Advanced',
            fields: [
              {
                type: 'textarea',
                name: 'customCss',
                label: 'Custom CSS',
                placeholder: '/* Add custom CSS here */',
                defaultValue: '',
              },
            ],
          },
        ],
      },
      defaultConfig: {
        backgroundColor: '',
        padding: 16,
        margin: 0,
      },
    },
  });

  console.log('✓ Created/Updated container template:', containerTemplate.id);

  // Create or update section template
  const sectionTemplate = await prisma.blockTemplate.upsert({
    where: { slug: 'section-container' },
    update: {
      name: 'Section Container',
      description: 'A full-width section container for organizing content',
      category: BlockCategory.LAYOUT,
      componentCode: '// Section container component',
      isActive: true,
      configSchema: {
        tabs: [
          {
            id: 'style',
            label: 'Style',
            fields: [
              {
                type: 'color',
                name: 'backgroundColor',
                label: 'Background Color',
                defaultValue: '',
              },
              {
                type: 'number',
                name: 'paddingY',
                label: 'Vertical Padding (px)',
                defaultValue: 40,
                min: 0,
                max: 200,
              },
            ],
          },
        ],
      },
      defaultConfig: {
        backgroundColor: '',
        paddingY: 40,
      },
    },
    create: {
      slug: 'section-container',
      name: 'Section Container',
      description: 'A full-width section container for organizing content',
      category: BlockCategory.LAYOUT,
      componentCode: '// Section container component',
      isActive: true,
      configSchema: {
        tabs: [
          {
            id: 'style',
            label: 'Style',
            fields: [
              {
                type: 'color',
                name: 'backgroundColor',
                label: 'Background Color',
                defaultValue: '',
              },
              {
                type: 'number',
                name: 'paddingY',
                label: 'Vertical Padding (px)',
                defaultValue: 40,
                min: 0,
                max: 200,
              },
            ],
          },
        ],
      },
      defaultConfig: {
        backgroundColor: '',
        paddingY: 40,
      },
    },
  });

  console.log('✓ Created/Updated section template:', sectionTemplate.id);

  // Create or update flexbox template
  const flexboxTemplate = await prisma.blockTemplate.upsert({
    where: { slug: 'flexbox-container' },
    update: {
      name: 'Flexbox Container',
      description: 'A flexbox container for flexible layouts',
      category: BlockCategory.LAYOUT,
      componentCode: '// Flexbox container component',
      isActive: true,
      configSchema: {
        tabs: [
          {
            id: 'content',
            label: 'Layout',
            fields: [
              {
                type: 'select',
                name: 'direction',
                label: 'Direction',
                options: [
                  { label: 'Row', value: 'row' },
                  { label: 'Column', value: 'column' },
                ],
                defaultValue: 'row',
              },
              {
                type: 'select',
                name: 'justifyContent',
                label: 'Justify Content',
                options: [
                  { label: 'Flex Start', value: 'flex-start' },
                  { label: 'Center', value: 'center' },
                  { label: 'Flex End', value: 'flex-end' },
                  { label: 'Space Between', value: 'space-between' },
                  { label: 'Space Around', value: 'space-around' },
                ],
                defaultValue: 'flex-start',
              },
              {
                type: 'number',
                name: 'gap',
                label: 'Gap (px)',
                defaultValue: 16,
                min: 0,
                max: 100,
              },
            ],
          },
        ],
      },
      defaultConfig: {
        direction: 'row',
        justifyContent: 'flex-start',
        gap: 16,
      },
    },
    create: {
      slug: 'flexbox-container',
      name: 'Flexbox Container',
      description: 'A flexbox container for flexible layouts',
      category: BlockCategory.LAYOUT,
      componentCode: '// Flexbox container component',
      isActive: true,
      configSchema: {
        tabs: [
          {
            id: 'content',
            label: 'Layout',
            fields: [
              {
                type: 'select',
                name: 'direction',
                label: 'Direction',
                options: [
                  { label: 'Row', value: 'row' },
                  { label: 'Column', value: 'column' },
                ],
                defaultValue: 'row',
              },
              {
                type: 'select',
                name: 'justifyContent',
                label: 'Justify Content',
                options: [
                  { label: 'Flex Start', value: 'flex-start' },
                  { label: 'Center', value: 'center' },
                  { label: 'Flex End', value: 'flex-end' },
                  { label: 'Space Between', value: 'space-between' },
                  { label: 'Space Around', value: 'space-around' },
                ],
                defaultValue: 'flex-start',
              },
              {
                type: 'number',
                name: 'gap',
                label: 'Gap (px)',
                defaultValue: 16,
                min: 0,
                max: 100,
              },
            ],
          },
        ],
      },
      defaultConfig: {
        direction: 'row',
        justifyContent: 'flex-start',
        gap: 16,
      },
    },
  });

  console.log('✓ Created/Updated flexbox template:', flexboxTemplate.id);

  // Create or update grid template
  const gridTemplate = await prisma.blockTemplate.upsert({
    where: { slug: 'grid-container' },
    update: {
      name: 'Grid Container',
      description: 'A CSS grid container for complex layouts',
      category: BlockCategory.LAYOUT,
      componentCode: '// Grid container component',
      isActive: true,
      configSchema: {
        tabs: [
          {
            id: 'content',
            label: 'Layout',
            fields: [
              {
                type: 'number',
                name: 'columns',
                label: 'Columns',
                defaultValue: 2,
                min: 1,
                max: 12,
              },
              {
                type: 'number',
                name: 'gap',
                label: 'Gap (px)',
                defaultValue: 16,
                min: 0,
                max: 100,
              },
            ],
          },
        ],
      },
      defaultConfig: {
        columns: 2,
        gap: 16,
      },
    },
    create: {
      slug: 'grid-container',
      name: 'Grid Container',
      description: 'A CSS grid container for complex layouts',
      category: BlockCategory.LAYOUT,
      componentCode: '// Grid container component',
      isActive: true,
      configSchema: {
        tabs: [
          {
            id: 'content',
            label: 'Layout',
            fields: [
              {
                type: 'number',
                name: 'columns',
                label: 'Columns',
                defaultValue: 2,
                min: 1,
                max: 12,
              },
              {
                type: 'number',
                name: 'gap',
                label: 'Gap (px)',
                defaultValue: 16,
                min: 0,
                max: 100,
              },
            ],
          },
        ],
      },
      defaultConfig: {
        columns: 2,
        gap: 16,
      },
    },
  });

  console.log('✓ Created/Updated grid template:', gridTemplate.id);

  console.log('\n✅ All container templates have been seeded!');
  console.log('\nTemplate IDs:');
  console.log('- Container:', containerTemplate.id);
  console.log('- Section:', sectionTemplate.id);
  console.log('- Flexbox:', flexboxTemplate.id);
  console.log('- Grid:', gridTemplate.id);
}

main()
  .catch((e) => {
    console.error('Error seeding container templates:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
