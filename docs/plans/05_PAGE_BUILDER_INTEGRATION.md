# Page Builder Integration - Technical Specification

## Overview
This document specifies how to integrate a visual page builder (GrapeJS recommended) into the CMS for drag-and-drop landing page creation.

---

## 1. Technology Selection: GrapeJS

### Why GrapeJS?

**Pros:**
- ✅ Production-ready, mature (7+ years)
- ✅ 17k+ GitHub stars, active community
- ✅ Block-based architecture (perfect for our system)
- ✅ Fully customizable
- ✅ Built-in responsive design tools
- ✅ Component/block system
- ✅ Storage manager for assets
- ✅ Style manager for visual editing
- ✅ Layer manager for block hierarchy
- ✅ Device manager (desktop/tablet/mobile)
- ✅ Undo/redo history
- ✅ Export to HTML/CSS
- ✅ Plugin ecosystem
- ✅ MIT License (free)

**Cons:**
- ❌ jQuery dependency (can be worked around)
- ❌ Not React-native (we'll wrap it)
- ❌ Styling customization needed

**Alternative Considered:** Craft.js
- More React-friendly
- Less features out-of-box
- More work to build UI
- **Verdict:** GrapeJS is better for faster launch

---

## 2. Installation & Setup

### 2.1 Dependencies

```json
{
  "dependencies": {
    "grapesjs": "^0.21.7",
    "grapesjs-blocks-basic": "^1.0.2",
    "grapesjs-plugin-forms": "^2.0.6",
    "grapesjs-component-countdown": "^1.0.1",
    "grapesjs-navbar": "^1.0.7",
    "grapesjs-preset-webpage": "^1.0.3"
  }
}
```

### 2.2 React Wrapper Component

```typescript
// components/page-builder/GrapeJSEditor.tsx
import { useEffect, useRef, useState } from 'react'
import grapesjs from 'grapesjs'
import 'grapesjs/dist/css/grapes.min.css'

interface GrapeJSEditorProps {
  landingPageId: string
  initialBlocks?: ContentBlock[]
  onSave: (html: string, css: string, blocks: any[]) => Promise<void>
  onBlocksChange: (blocks: any[]) => void
}

export function GrapeJSEditor({ landingPageId, initialBlocks, onSave, onBlocksChange }: GrapeJSEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null)
  const [editor, setEditor] = useState<any>(null)

  useEffect(() => {
    if (!editorRef.current) return

    const editorInstance = grapesjs.init({
      container: editorRef.current,
      height: '100vh',
      width: 'auto',

      // Storage
      storageManager: {
        type: 'remote',
        autosave: true,
        autoload: true,
        stepsBeforeSave: 3,
        urlStore: `/api/admin/landing-pages/${landingPageId}/save`,
        urlLoad: `/api/admin/landing-pages/${landingPageId}/load`,
        headers: {
          'Content-Type': 'application/json',
        },
        onStore: (data) => ({ data }),
        onLoad: (result) => result.data,
      },

      // Block Manager
      blockManager: {
        appendTo: '#blocks-container',
        blocks: [], // We'll add custom blocks
      },

      // Style Manager
      styleManager: {
        appendTo: '#styles-container',
        sectors: [
          {
            name: 'General',
            properties: [
              'display',
              'position',
              'top',
              'right',
              'left',
              'bottom',
            ]
          },
          {
            name: 'Typography',
            properties: [
              'font-family',
              'font-size',
              'font-weight',
              'letter-spacing',
              'color',
              'line-height',
              'text-align',
              'text-decoration',
              'text-shadow'
            ]
          },
          {
            name: 'Decorations',
            properties: [
              'background-color',
              'background',
              'border-radius',
              'border',
              'box-shadow',
              'background'
            ]
          },
          {
            name: 'Dimension',
            properties: [
              'width',
              'height',
              'max-width',
              'min-height',
              'margin',
              'padding'
            ]
          }
        ]
      },

      // Layer Manager
      layerManager: {
        appendTo: '#layers-container',
      },

      // Device Manager (Responsive)
      deviceManager: {
        devices: [
          {
            id: 'desktop',
            name: 'Desktop',
            width: '',
          },
          {
            id: 'tablet',
            name: 'Tablet',
            width: '768px',
            widthMedia: '992px',
          },
          {
            id: 'mobile',
            name: 'Mobile',
            width: '375px',
            widthMedia: '768px',
          },
        ]
      },

      // Plugins
      plugins: [
        'gjs-blocks-basic',
        'gjs-plugin-forms',
        'gjs-component-countdown',
        'gjs-navbar',
        'gjs-preset-webpage',
      ],

      // Plugin Options
      pluginsOpts: {
        'gjs-blocks-basic': {},
        'gjs-plugin-forms': {},
        'gjs-preset-webpage': {
          modalImportTitle: 'Import Template',
          modalImportLabel: '<div>Paste HTML/CSS</div>',
          modalImportContent: (editor: any) => {
            return editor.getHtml() + '<style>' + editor.getCss() + '</style>'
          },
        }
      },

      // Canvas
      canvas: {
        styles: [
          // Add Tailwind/global styles
          'https://cdn.tailwindcss.com',
        ],
        scripts: [
          // Add any required scripts
        ],
      },

      // Panels
      panels: {
        defaults: [
          {
            id: 'layers',
            el: '.panel__right',
            resizable: {
              maxDim: 350,
              minDim: 200,
              tc: 0,
              cl: 1,
              cr: 0,
              bc: 0,
            },
          },
          {
            id: 'panel-switcher',
            el: '.panel__switcher',
            buttons: [
              {
                id: 'show-layers',
                active: true,
                label: 'Layers',
                command: 'show-layers',
                togglable: false,
              },
              {
                id: 'show-style',
                active: true,
                label: 'Styles',
                command: 'show-styles',
                togglable: false,
              },
            ],
          },
          {
            id: 'panel-devices',
            el: '.panel__devices',
            buttons: [
              {
                id: 'device-desktop',
                label: '🖥',
                command: 'set-device-desktop',
                active: true,
                togglable: false,
              },
              {
                id: 'device-tablet',
                label: '📱',
                command: 'set-device-tablet',
                togglable: false,
              },
              {
                id: 'device-mobile',
                label: '📱',
                command: 'set-device-mobile',
                togglable: false,
              },
            ],
          },
        ],
      },
    })

    // Custom commands
    editorInstance.Commands.add('set-device-desktop', {
      run: (editor: any) => editor.setDevice('Desktop'),
    })
    editorInstance.Commands.add('set-device-tablet', {
      run: (editor: any) => editor.setDevice('Tablet'),
    })
    editorInstance.Commands.add('set-device-mobile', {
      run: (editor: any) => editor.setDevice('Mobile'),
    })

    // Load our custom blocks from BlockTemplate database
    loadCustomBlocks(editorInstance)

    // Set initial content if provided
    if (initialBlocks && initialBlocks.length > 0) {
      const html = blocksToHTML(initialBlocks)
      editorInstance.setComponents(html)
    }

    // Listen to changes
    editorInstance.on('component:add component:remove component:update', () => {
      const blocks = editorInstance.getComponents()
      onBlocksChange(blocks)
    })

    setEditor(editorInstance)

    return () => {
      editorInstance.destroy()
    }
  }, [landingPageId])

  // Save function
  const handleSave = async () => {
    if (!editor) return

    const html = editor.getHtml()
    const css = editor.getCss()
    const components = editor.getComponents()

    await onSave(html, css, components)
  }

  return (
    <div className="grapesjs-editor">
      <div id="blocks-container" />
      <div ref={editorRef} id="gjs" />
      <div id="layers-container" />
      <div id="styles-container" />

      <button onClick={handleSave}>
        Save Page
      </button>
    </div>
  )
}
```

---

## 3. Custom Block Integration

### 3.1 Load Blocks from Database

```typescript
async function loadCustomBlocks(editor: any) {
  // Fetch our block templates from database
  const response = await fetch('/api/admin/blocks/templates?isActive=true')
  const { templates } = await response.json()

  // Register each template as a GrapeJS block
  templates.forEach((template: BlockTemplate) => {
    editor.BlockManager.add(template.slug, {
      label: template.name,
      category: template.category,
      media: template.thumbnail || getDefaultIcon(template.category),
      content: {
        type: `custom-${template.slug}`,
        components: template.componentCode,
        style: template.cssStyles,
      },
      attributes: {
        class: 'gjs-block-custom',
        'data-template-id': template.id,
      },
    })

    // Register component type
    editor.DomComponents.addType(`custom-${template.slug}`, {
      model: {
        defaults: {
          traits: convertSchemaToTraits(template.configSchema),
          ...template.defaultConfig,
        },
      },
      view: {
        // Custom view logic if needed
      },
    })
  })
}
```

### 3.2 Convert Config Schema to GrapeJS Traits

```typescript
function convertSchemaToTraits(schema: any) {
  return schema.fields.map((field: any) => {
    const trait: any = {
      name: field.name,
      label: field.label,
    }

    switch (field.type) {
      case 'text':
        trait.type = 'text'
        trait.placeholder = field.placeholder
        break
      case 'textarea':
        trait.type = 'textarea'
        trait.rows = field.rows || 3
        break
      case 'color':
        trait.type = 'color'
        break
      case 'select':
        trait.type = 'select'
        trait.options = field.options
        break
      case 'checkbox':
        trait.type = 'checkbox'
        break
      case 'number':
        trait.type = 'number'
        trait.min = field.min
        trait.max = field.max
        trait.step = field.step
        break
      case 'image':
        // Custom image picker trait
        trait.type = 'button'
        trait.text = 'Select Image'
        trait.command = (editor: any) => {
          // Open media picker
          openMediaPicker((imageUrl: string) => {
            editor.getSelected().set(field.name, imageUrl)
          })
        }
        break
    }

    return trait
  })
}
```

---

## 4. Custom UI Layout

### 4.1 Editor Layout Structure

```tsx
<div className="page-builder-layout">
  {/* Top Bar */}
  <div className="builder-toolbar">
    <button onClick={handleUndo}>↶ Undo</button>
    <button onClick={handleRedo}>↷ Redo</button>
    <select onChange={handleDeviceChange}>
      <option value="desktop">🖥 Desktop</option>
      <option value="tablet">📱 Tablet</option>
      <option value="mobile">📱 Mobile</option>
    </select>
    <button onClick={handlePreview}>👁 Preview</button>
    <button onClick={handleSave}>💾 Save</button>
    <button onClick={handlePublish}>🚀 Publish</button>
  </div>

  {/* Main Layout */}
  <div className="builder-main">
    {/* Left Sidebar - Blocks */}
    <div className="builder-sidebar-left">
      <div className="sidebar-tabs">
        <button className="active">Blocks</button>
        <button>Templates</button>
      </div>
      <div id="blocks-container" className="blocks-list" />
    </div>

    {/* Center - Canvas */}
    <div className="builder-canvas">
      <div id="gjs-editor" />
    </div>

    {/* Right Sidebar - Settings */}
    <div className="builder-sidebar-right">
      <div className="sidebar-tabs">
        <button className="active">Layers</button>
        <button>Styles</button>
        <button>Settings</button>
      </div>
      <div id="layers-container" />
      <div id="styles-container" />
    </div>
  </div>
</div>
```

---

## 5. Saving & Loading Strategy

### 5.1 Save Format

When saving, we store TWO representations:

**1. GrapeJS Native Format (for editing):**
```json
{
  "gjs": {
    "html": "<div>...</div>",
    "css": ".hero { ... }",
    "components": [...],
    "styles": [...]
  }
}
```

**2. Our Block System Format (for rendering):**
```json
{
  "blocks": [
    {
      "templateId": "hero-background-image",
      "config": { ... },
      "order": 0
    }
  ]
}
```

### 5.2 Save Flow

```
1. User edits in GrapeJS
2. On save:
   a. Get HTML/CSS from GrapeJS
   b. Parse components to extract our block data
   c. Save both formats
3. Store:
   a. GrapeJS data → LandingPage.customCss/customJs
   b. Block data → ContentBlock records
```

### 5.3 Load Flow

```
1. Load landing page
2. Load associated ContentBlock records
3. Convert blocks to GrapeJS format
4. Initialize editor with converted data
```

---

## 6. Media Library Integration

### 6.1 Custom Asset Manager

```typescript
editor.AssetManager.add([
  // Load from our existing media library
  {
    type: 'image',
    src: '/uploads/image1.jpg',
    height: 350,
    width: 250,
  },
])

// Custom upload handler
editor.on('asset:upload:start', () => {
  // Show upload progress
})

editor.on('asset:upload:end', () => {
  // Refresh asset list
})

// Open our existing MediaPicker
editor.Commands.add('open-assets', {
  run: (editor: any) => {
    // Open your existing MediaPicker component
    openMediaPicker((selectedAssets: string[]) => {
      selectedAssets.forEach((url) => {
        editor.AssetManager.add({ type: 'image', src: url })
      })
    })
  },
})
```

---

## 7. Export & Preview

### 7.1 Preview Mode

```typescript
function PreviewMode({ landingPageId }: { landingPageId: string }) {
  const [html, setHtml] = useState('')
  const [css, setCss] = useState('')

  useEffect(() => {
    loadPreview()
  }, [landingPageId])

  async function loadPreview() {
    const response = await fetch(`/api/admin/landing-pages/${landingPageId}`)
    const page = await response.json()

    // Render blocks to HTML
    const renderedHtml = renderBlocksToHTML(page.blocks)
    setHtml(renderedHtml)
    setCss(page.customCss || '')
  }

  return (
    <div className="preview-mode">
      <style>{css}</style>
      <div dangerouslySetInnerHTML={{ __html: html }} />
    </div>
  )
}
```

---

## 8. Performance Optimizations

### 8.1 Lazy Load GrapeJS

```typescript
// Load GrapeJS only when needed
const GrapeJSEditor = lazy(() => import('./GrapeJSEditor'))

function PageBuilderPage() {
  return (
    <Suspense fallback={<BuilderSkeleton />}>
      <GrapeJSEditor {...props} />
    </Suspense>
  )
}
```

### 8.2 Debounced Auto-Save

```typescript
const debouncedSave = useMemo(
  () => debounce(async (html: string, css: string) => {
    await saveToDatabase(html, css)
  }, 2000),
  []
)

editor.on('component:update', () => {
  debouncedSave(editor.getHtml(), editor.getCss())
})
```

---

## 9. Custom Plugins

### 9.1 Our Custom Plugin

```typescript
// plugins/grapesjs-ecommerce-blocks.ts
export default (editor: any, opts = {}) => {
  const blockManager = editor.BlockManager

  // Add e-commerce specific blocks
  blockManager.add('product-card', {
    label: 'Product Card',
    category: 'E-commerce',
    content: '<div class="product-card">...</div>',
  })

  blockManager.add('cart-button', {
    label: 'Add to Cart',
    category: 'E-commerce',
    content: '<button class="add-to-cart">Add to Cart</button>',
  })
}
```

---

## 10. Keyboard Shortcuts

```typescript
editor.Commands.add('core:undo', {
  run: () => editor.UndoManager.undo(),
})

editor.Commands.add('core:redo', {
  run: () => editor.UndoManager.redo(),
})

// Bind keyboard shortcuts
editor.Keymaps.add('ns:undo', 'ctrl+z', 'core:undo')
editor.Keymaps.add('ns:redo', 'ctrl+shift+z', 'core:redo')
editor.Keymaps.add('ns:save', 'ctrl+s', 'save-page')
editor.Keymaps.add('ns:preview', 'ctrl+p', 'preview-page')
```

---

## 11. Responsive Design Tools

GrapeJS includes:
- Device switcher (desktop/tablet/mobile)
- CSS media queries
- Device-specific styles
- Responsive visibility toggles

We'll expose these through our UI:
```tsx
<div className="device-controls">
  <button onClick={() => editor.setDevice('Desktop')}>
    🖥 Desktop
  </button>
  <button onClick={() => editor.setDevice('Tablet')}>
    📱 Tablet
  </button>
  <button onClick={() => editor.setDevice('Mobile')}>
    📱 Mobile (375px)
  </button>
</div>
```

---

## 12. Undo/Redo System

GrapeJS has built-in UndoManager:
```typescript
editor.UndoManager.undo() // Ctrl+Z
editor.UndoManager.redo() // Ctrl+Shift+Z
editor.UndoManager.clear() // Clear history
editor.UndoManager.getStack() // Get history
```

---

## 13. Component Nesting

GrapeJS supports nested components:
```html
<section>  <!-- Block -->
  <div>    <!-- Container -->
    <h1>Title</h1>  <!-- Element -->
    <p>Text</p>     <!-- Element -->
  </div>
</section>
```

We map this to our block system:
- Section = ContentBlock
- Children = part of block config

---

## 14. Custom CSS Injection

Allow advanced users to add custom CSS:
```typescript
// Page-level custom CSS
landingPage.customCss = `
  .my-custom-class {
    color: red;
  }
`

// Block-level custom CSS
contentBlock.customCss = `
  .hero-custom {
    background: linear-gradient(...);
  }
`
```

---

## 15. Export HTML

For external use:
```typescript
function exportHTML() {
  const html = editor.getHtml()
  const css = `<style>${editor.getCss()}</style>`
  const fullPage = `
    <!DOCTYPE html>
    <html>
      <head>
        ${css}
      </head>
      <body>
        ${html}
      </body>
    </html>
  `

  downloadFile('landing-page.html', fullPage)
}
```

---

## Summary

**Integration Points:**
1. Wrap GrapeJS in React component
2. Load custom blocks from database
3. Convert config schemas to GrapeJS traits
4. Custom UI layout (3-panel design)
5. Integrate media library
6. Save in dual format (GrapeJS + our blocks)
7. Preview mode
8. Export functionality

**Libraries:**
- `grapesjs`: Core editor
- `grapesjs-blocks-basic`: Basic blocks plugin
- `grapesjs-plugin-forms`: Form elements
- `grapesjs-preset-webpage`: Common web components

**Estimated Integration Time:** 1-2 weeks

**Next:** Testing Strategy →
