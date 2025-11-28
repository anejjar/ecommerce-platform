# CMS Page Builder - Developer Guide

## Table of Contents
1. [Architecture Overview](#architecture-overview)
2. [Adding New Blocks](#adding-new-blocks)
3. [Block Schema Structure](#block-schema-structure)
4. [API Documentation](#api-documentation)
5. [Component Architecture](#component-architecture)
6. [Extending the CMS](#extending-the-cms)

---

## Architecture Overview

The CMS Page Builder consists of:

### Database Models
- `LandingPage`: Main page model
- `ContentBlock`: Block instances with configuration
- `BlockTemplate`: Block template definitions
- `LandingPageTemplate`: Pre-built page templates
- `LandingPageRevision`: Page version history

### Key Components
- `PageEditor`: Main editor component
- `EditorLayout`: 3-panel layout wrapper
- `Canvas`: Block canvas with drag-and-drop
- `BlockRenderer`: Renders blocks on frontend
- `ConfigForm`: Dynamic form generator from schema

### Hooks
- `usePageEditor`: Main editor state management
- `useLandingPages`: Landing page CRUD operations

---

## Adding New Blocks

### Step 1: Create Block Component

Create a new component in `src/components/landing-page/blocks/`:

```typescript
// src/components/landing-page/blocks/MyCustomBlock.tsx
'use client';

import React from 'react';

interface MyCustomBlockProps {
    config: {
        heading?: string;
        content?: string;
        backgroundColor?: string;
    };
}

export const MyCustomBlock: React.FC<MyCustomBlockProps> = ({ config }) => {
    const {
        heading = 'Default Heading',
        content = 'Default content',
        backgroundColor = '#ffffff',
    } = config;

    return (
        <section className="py-24" style={{ backgroundColor }}>
            <div className="container mx-auto px-4">
                <h2>{heading}</h2>
                <p>{content}</p>
            </div>
        </section>
    );
};
```

### Step 2: Add to BlockRenderer

Update `src/components/landing-page/BlockRenderer.tsx`:

```typescript
import { MyCustomBlock } from '@/components/landing-page/blocks/MyCustomBlock';

// In renderBlockContent():
case 'my-custom-block':
    return <MyCustomBlock config={block.config} />;
```

### Step 3: Add to BlockPreview

Update `src/components/admin/cms/block-editor/BlockPreview.tsx`:

```typescript
import { MyCustomBlock } from '@/components/landing-page/blocks/MyCustomBlock';

// In renderBlockContent():
case 'my-custom-block':
    return <MyCustomBlock config={config} />;
```

### Step 4: Create Block Template

Add to database via seed or admin:

```typescript
{
    name: 'My Custom Block',
    slug: 'my-custom-block',
    category: 'CONTENT',
    description: 'A custom block for special content',
    configSchema: {
        fields: [
            {
                name: 'heading',
                label: 'Heading',
                type: 'text',
                required: true,
                default: 'Default Heading'
            },
            {
                name: 'content',
                label: 'Content',
                type: 'textarea',
                required: true
            },
            {
                name: 'backgroundColor',
                label: 'Background Color',
                type: 'color',
                default: '#ffffff'
            }
        ]
    },
    defaultConfig: {
        heading: 'Default Heading',
        content: 'Default content',
        backgroundColor: '#ffffff'
    }
}
```

---

## Block Schema Structure

### Field Types

#### Text
```typescript
{
    name: 'title',
    label: 'Title',
    type: 'text',
    required: true,
    placeholder: 'Enter title',
    default: 'Default Title',
    maxLength: 100
}
```

#### Textarea
```typescript
{
    name: 'description',
    label: 'Description',
    type: 'textarea',
    required: false,
    rows: 5,
    maxLength: 500
}
```

#### Image
```typescript
{
    name: 'image',
    label: 'Image',
    type: 'image',
    required: true,
    recommended: '1920x1080px'
}
```

#### Color
```typescript
{
    name: 'backgroundColor',
    label: 'Background Color',
    type: 'color',
    default: '#ffffff'
}
```

#### Select
```typescript
{
    name: 'alignment',
    label: 'Alignment',
    type: 'select',
    options: [
        { value: 'left', label: 'Left' },
        { value: 'center', label: 'Center' },
        { value: 'right', label: 'Right' }
    ],
    default: 'center'
}
```

#### Toggle/Checkbox
```typescript
{
    name: 'showButton',
    label: 'Show Button',
    type: 'checkbox',
    default: true,
    description: 'Display the call-to-action button'
}
```

#### Slider
```typescript
{
    name: 'padding',
    label: 'Padding',
    type: 'slider',
    min: 0,
    max: 100,
    step: 5,
    unit: 'px',
    default: 20
}
```

#### Repeater
```typescript
{
    name: 'features',
    label: 'Features',
    type: 'repeater',
    fields: [
        {
            name: 'title',
            label: 'Feature Title',
            type: 'text',
            required: true
        },
        {
            name: 'description',
            label: 'Description',
            type: 'textarea'
        },
        {
            name: 'icon',
            label: 'Icon',
            type: 'image'
        }
    ],
    default: []
}
```

### Conditional Fields

Show fields based on other field values:

```typescript
{
    name: 'buttonText',
    label: 'Button Text',
    type: 'text',
    condition: {
        field: 'showButton',
        operator: 'equals',
        value: true
    }
}
```

---

## API Documentation

### Landing Pages

#### List Pages
```
GET /api/admin/landing-pages
Query params: search, status, page, limit
```

#### Get Page
```
GET /api/admin/landing-pages/:id
```

#### Create Page
```
POST /api/admin/landing-pages
Body: { title, slug, description, ... }
```

#### Update Page
```
PUT /api/admin/landing-pages/:id
Body: { title, slug, description, ... }
```

#### Delete Page
```
DELETE /api/admin/landing-pages/:id
```

#### Sync Blocks
```
POST /api/admin/landing-pages/:id/sync-blocks
Body: { blocks: [...] }
```

### Block Templates

#### List Templates
```
GET /api/admin/blocks/templates
Query params: category, search, page, limit
```

#### Get Template
```
GET /api/admin/blocks/templates/:id
```

#### Create Template
```
POST /api/admin/blocks/templates
Body: { name, slug, category, configSchema, ... }
```

### Revisions

#### List Revisions
```
GET /api/admin/landing-pages/:id/revisions
```

#### Create Revision
```
POST /api/admin/landing-pages/:id/revisions
Body: { note?: string }
```

#### Restore Revision
```
POST /api/admin/landing-pages/:id/revisions/:revisionId/restore
```

---

## Component Architecture

### Editor Components

```
PageEditor (page.tsx)
  └─ EditorLayout
      ├─ Block Library (left panel)
      │   └─ SidebarBlock[]
      ├─ Canvas (center)
      │   └─ SortableBlock[]
      │       └─ BlockPreview
      └─ Settings Panel (right)
          ├─ ConfigForm (block settings)
          └─ PageSettingsForm (page settings)
```

### Frontend Rendering

```
LandingPage (page.tsx)
  └─ BlockRenderer
      └─ [Block Components]
          ├─ HeroBackgroundImage
          ├─ FeaturesGrid
          ├─ ContactForm
          └─ ...
```

### State Management

`usePageEditor` hook manages:
- Blocks array
- Page data
- Selected block
- Save state
- Undo/redo history
- Auto-save

---

## Extending the CMS

### Custom Field Types

Add new field types to `ConfigForm.tsx`:

```typescript
case 'my-custom-field':
    return (
        <MyCustomField
            label={field.label}
            value={value}
            onChange={(val) => handleChange(field.name, val)}
        />
    );
```

### Custom Block Actions

Extend `SortableBlock` to add custom actions:

```typescript
<Button onClick={handleCustomAction}>
    Custom Action
</Button>
```

### Auto-Save Hooks

The editor auto-saves every 2 seconds. Customize in `usePageEditor`:

```typescript
autoSaveDelay={3000} // 3 seconds
```

### Revision System

Revisions are created manually via API. To auto-create on publish:

```typescript
// In publish endpoint
await createRevision(pageId, { note: 'Published' });
```

---

## Best Practices

1. **Component Structure**: Keep block components simple and focused
2. **Config Validation**: Always validate config in components
3. **Responsive Design**: Use Tailwind responsive classes
4. **Image Optimization**: Use Next.js Image component
5. **Error Handling**: Gracefully handle missing config
6. **Type Safety**: Use TypeScript interfaces for config
7. **Performance**: Lazy load heavy block components
8. **Accessibility**: Include proper ARIA labels

---

## Testing

### Unit Tests

Test block components:

```typescript
describe('MyCustomBlock', () => {
    it('renders with default config', () => {
        render(<MyCustomBlock config={{}} />);
        expect(screen.getByText('Default Heading')).toBeInTheDocument();
    });
});
```

### Integration Tests

Test editor workflow:

```typescript
describe('Page Editor', () => {
    it('adds block to canvas', async () => {
        // Test adding block
    });
    
    it('saves page changes', async () => {
        // Test save functionality
    });
});
```

---

## Troubleshooting

### Block Not Rendering
- Check block slug matches template slug
- Verify component is imported in BlockRenderer
- Check browser console for errors

### Config Not Saving
- Verify field names match schema
- Check ConfigForm onChange handler
- Review auto-save logs

### Type Errors
- Ensure config interfaces match schema
- Check TypeScript compilation
- Verify Prisma types are generated

---

## Resources

- [Block Catalog](./plans/04_BLOCK_TEMPLATES_CATALOG.md)
- [API Endpoints Spec](./plans/02_API_ENDPOINTS_SPEC.md)
- [Database Schema](./plans/01_DATABASE_SCHEMA_SPEC.md)
- [Status Document](./CMS_PAGE_BUILDER_STATUS.md)

