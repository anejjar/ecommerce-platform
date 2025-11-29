# UI Components & User Flows - CMS Page Builder

## Overview
Complete specification of all UI components, user interfaces, and user flows for the CMS Page Builder system.

---

## 1. Admin Navigation Updates

### 1.1 Sidebar Menu

Add new menu items under "Marketing" or create new "Landing Pages" section:

```
Marketing
├── Blog Posts
├── Pages
├── Landing Pages ⭐ NEW
│   ├── All Landing Pages
│   ├── Create New
│   └── Templates
├── Categories
├── Popups
└── Email Campaigns

Content Blocks ⭐ NEW
├── Block Templates
└── Block Library
```

---

## 2. Block Templates Management

### 2.1 Block Templates List Page
**Route:** `/admin/blocks/templates`

**Layout:**
```
┌────────────────────────────────────────────────────────┐
│  Block Templates                    [+ New Template]   │
├────────────────────────────────────────────────────────┤
│  [Search...] [Category ▼] [Status ▼] [Type ▼]        │
├────────────────────────────────────────────────────────┤
│                                                        │
│  ┌──────┐  ┌──────┐  ┌──────┐  ┌──────┐            │
│  │ Hero │  │Features│ │  CTA │  │Testi-│            │
│  │      │  │  Grid  │  │Banner│  │monial│            │
│  │[img] │  │ [img]  │  │[img] │  │[img] │            │
│  │      │  │        │  │      │  │      │            │
│  │ Used │  │ Used   │  │ Used │  │ Used │            │
│  │ 234× │  │  89×   │  │ 156× │  │  67× │            │
│  │      │  │        │  │      │  │      │            │
│  │[Edit]│  │ [Edit] │  │[Edit]│  │[Edit]│            │
│  │[Dupe]│  │ [Dupe] │  │[Dupe]│  │[Dupe]│            │
│  └──────┘  └──────┘  └──────┘  └──────┘            │
│                                                        │
│  [Load More]                                           │
└────────────────────────────────────────────────────────┘
```

**Features:**
- Grid/list view toggle
- Search by name/description
- Filter by category
- Filter by status (active/inactive)
- Filter by type (system/custom)
- Sort options
- Bulk actions
- Preview on hover
- Usage count badge

### 2.2 Block Template Editor
**Route:** `/admin/blocks/templates/:id` or `/admin/blocks/templates/new`

**Layout:**
```
┌────────────────────────────────────────────────────────┐
│  ← Back to Templates          [Save] [Save & Close]   │
├────────────────────────────────────────────────────────┤
│                                                        │
│  ┌────────────────┐  ┌──────────────────────────────┐ │
│  │ Basic Info     │  │  Preview                     │ │
│  ├────────────────┤  │                              │ │
│  │ Name: _______  │  │  ┌────────────────────────┐  │ │
│  │ Slug: _______  │  │  │                        │  │ │
│  │ Category: [▼]  │  │  │   Block Preview Here   │  │ │
│  │ Description:   │  │  │                        │  │ │
│  │ ______________ │  │  │   [Rendered based on   │  │ │
│  │                │  │  │    default config]     │  │ │
│  │ Thumbnail:     │  │  │                        │  │ │
│  │ [Upload]       │  │  └────────────────────────┘  │ │
│  │                │  │                              │ │
│  │ ☐ System       │  │  [Desktop] [Tablet] [Mobile]│ │
│  │ ☑ Active       │  │                              │ │
│  │ ☐ PRO Only     │  │  [Refresh Preview]          │ │
│  └────────────────┘  └──────────────────────────────┘ │
│                                                        │
│  ┌──────────────────────────────────────────────────┐ │
│  │ Configuration Schema               │  │          │ │
│  ├──────────────────────────────────────────────────┤ │
│  │ Fields:                                          │ │
│  │ ┌────────────────────────────────────────────┐   │ │
│  │ │ 1. Heading (text)                   [Edit]│   │ │
│  │ │ 2. Subheading (textarea)            [Edit]│   │ │
│  │ │ 3. Background Image (image)         [Edit]│   │ │
│  │ │ 4. CTA Text (text)                  [Edit]│   │ │
│  │ │ 5. CTA Link (text)                  [Edit]│   │ │
│  │ │ 6. Text Color (color)               [Edit]│   │ │
│  │ │                                            │   │ │
│  │ │ [+ Add Field]                              │   │ │
│  │ └────────────────────────────────────────────┘   │ │
│  └──────────────────────────────────────────────────┘ │
│                                                        │
│  ┌──────────────────────────────────────────────────┐ │
│  │ Component Code                  [React] [HTML▼] │ │
│  ├──────────────────────────────────────────────────┤ │
│  │  1  export function HeroBlock({ config }) {     │ │
│  │  2    return (                                   │ │
│  │  3      <section className="hero">              │ │
│  │  4        <h1>{config.heading}</h1>             │ │
│  │  5        ...                                    │ │
│  │                                                  │ │
│  │ [Monaco Editor with syntax highlighting]        │ │
│  └──────────────────────────────────────────────────┘ │
│                                                        │
│  ┌──────────────────────────────────────────────────┐ │
│  │ CSS Styles (Optional)                           │ │
│  ├──────────────────────────────────────────────────┤ │
│  │  .hero {                                         │ │
│  │    /* Scoped styles */                           │ │
│  │  }                                               │ │
│  └──────────────────────────────────────────────────┘ │
│                                                        │
└────────────────────────────────────────────────────────┘
```

**Components Needed:**
- `BlockTemplateForm` - Main form component
- `ConfigSchemaEditor` - Edit field definitions
- `FieldEditor` - Add/edit individual fields
- `CodeEditor` - Monaco editor for component code
- `BlockPreview` - Live preview component
- `ResponsivePreview` - Desktop/tablet/mobile switcher

---

## 3. Landing Page Builder

### 3.1 Landing Pages List
**Route:** `/admin/landing-pages`

**Layout:**
```
┌────────────────────────────────────────────────────────┐
│  Landing Pages                   [+ New Landing Page]  │
├────────────────────────────────────────────────────────┤
│  [Search...] [Status ▼] [Author ▼] [Sort ▼]  [Grid/List]│
├────────────────────────────────────────────────────────┤
│                                                        │
│  ┌─────────────────────────────────────────────────┐  │
│  │ 🟢 SaaS Product Launch Page                     │  │
│  │ /landing/saas-launch                            │  │
│  │ Published 2 days ago • 1,234 views • 45% conv. │  │
│  │                                                 │  │
│  │ [Preview] [Edit] [Analytics] [•••]             │  │
│  └─────────────────────────────────────────────────┘  │
│                                                        │
│  ┌─────────────────────────────────────────────────┐  │
│  │ 🟡 Coming Soon - New Feature                    │  │
│  │ /landing/coming-soon                            │  │
│  │ Draft • Last edited 5 hours ago                 │  │
│  │                                                 │  │
│  │ [Edit] [Publish] [•••]                          │  │
│  └─────────────────────────────────────────────────┘  │
│                                                        │
│  [1] [2] [3] ... [10]                                 │
└────────────────────────────────────────────────────────┘
```

**Features:**
- Status indicators (draft/published/scheduled)
- Quick stats (views, conversion rate)
- Quick actions (preview, edit, duplicate, delete)
- Bulk actions
- Templates filter
- Search by title/slug

### 3.2 Landing Page Builder - Main Editor
**Route:** `/admin/landing-pages/:id/edit`

**Layout: Three-Panel Layout**
```
┌──────────────────────────────────────────────────────────────────┐
│  My Landing Page                [Draft]         [Preview] [Publish]│
├──────┬────────────────────────────────────────────┬────────────────┤
│      │                                            │                │
│Block │           Canvas (Page Builder)            │   Settings     │
│Lib.  │                                            │                │
│      │  ┌──────────────────────────────────────┐  │  Block Config  │
│Search│  │                                      │  │  ┌───────────┐ │
│____  │  │  ╔════════════════════════════════╗  │  │  │ Heading:  │ │
│      │  │  ║ HERO SECTION                   ║  │  │  │ _________ │ │
│☐Hero │  │  ║ Welcome to Our Product         ║  │  │  │           │ │
│☐Feat │  │  ║ [Get Started]                  ║  │  │  │ Subhead:  │ │
│☐CTA  │  │  ╚════════════════════════════════╝  │  │  │ _________ │ │
│☐Test │  │  [⋮] [✏️] [👁] [🗑]                   │  │  │           │ │
│☐Pric │  │                                      │  │  │ BG Image: │ │
│☐Form │  │  ┌────────────────────────────────┐  │  │  │ [Upload]  │ │
│☐FAQ  │  │  │ Features Grid (3-col)          │  │  │  │           │ │
│      │  │  │ • Feature 1  • Feature 2       │  │  │  │ Text      │ │
│[+]   │  │  │ • Feature 3                    │  │  │  │ Color: ⬛ │ │
│More  │  │  └────────────────────────────────┘  │  │  │           │ │
│      │  │  [⋮] [✏️] [👁] [🗑]                   │  │  │ [Update]  │ │
│      │  │                                      │  │  └───────────┘ │
│      │  │  [+ Add Block Here]                 │  │                │
│      │  │                                      │  │  Page Settings │
│      │  │  ┌────────────────────────────────┐  │  │  ┌───────────┐ │
│      │  │  │ CTA Banner                     │  │  │  │ Title:    │ │
│      │  │  │ Ready to get started?          │  │  │  │ _________ │ │
│      │  │  │ [Start Free Trial]             │  │  │  │           │ │
│      │  │  └────────────────────────────────┘  │  │  │ Slug:     │ │
│      │  │  [⋮] [✏️] [👁] [🗑]                   │  │  │ _________ │ │
│      │  │                                      │  │  │           │ │
│      │  │  [+ Add Block Here]                 │  │  │ SEO...    │ │
│      │  │                                      │  │  └───────────┘ │
│      │  └──────────────────────────────────────┘  │                │
│      │                                            │  [🖥] [📱] [⚙️]│
│      │  [Desktop] [Tablet] [Mobile]              │                │
└──────┴────────────────────────────────────────────┴────────────────┘
```

**Left Panel - Block Library (250px)**
- Search blocks
- Category filters
- Block templates grid
- Drag blocks to canvas
- Collapsible

**Center Panel - Canvas (Flex 1)**
- Scrollable page preview
- Block containers with controls:
  - Drag handle (⋮)
  - Edit (✏️)
  - Hide (👁)
  - Delete (🗑)
- Drop zones between blocks
- Add block buttons
- Responsive preview modes
- Zoom controls

**Right Panel - Settings (350px)**
- Two tabs:
  - **Block Config:** Edit selected block
  - **Page Settings:** Global page settings
- Live form based on config schema
- Save/Cancel buttons
- Collapsible

**Components Needed:**
- `LandingPageBuilder` - Main builder component
- `BlockLibraryPanel` - Left sidebar
- `BuilderCanvas` - Center canvas
- `BlockContainer` - Individual block wrapper with controls
- `DropZone` - Drop target between blocks
- `SettingsPanel` - Right sidebar
- `BlockConfigForm` - Dynamic form based on schema
- `PageSettingsForm` - Global settings
- `ResponsivePreview` - Device preview switcher

### 3.3 Block Configuration Modal

When editing a block, show inline editor or modal:

```
┌────────────────────────────────────┐
│  Edit Hero Section          [Save] │
├────────────────────────────────────┤
│                                    │
│  Heading                           │
│  _________________________________ │
│                                    │
│  Subheading                        │
│  _________________________________ │
│  _________________________________ │
│                                    │
│  Background Image                  │
│  ┌─────────────┐                  │
│  │   [image]   │  [Change] [Remove]│
│  └─────────────┘                  │
│                                    │
│  CTA Button Text                   │
│  _________________________________ │
│                                    │
│  CTA Button Link                   │
│  _________________________________ │
│                                    │
│  Text Color        Overlay Opacity │
│  ⬛ #ffffff        ───○────── 50%  │
│                                    │
│  Alignment                         │
│  ⭘ Left  ⦿ Center  ⭘ Right        │
│                                    │
│  [Advanced ▼]                      │
│                                    │
│         [Cancel]        [Save]     │
└────────────────────────────────────┘
```

---

## 4. User Flows

### 4.1 Create Landing Page from Scratch

```
User Flow:
1. Click "New Landing Page"
2. Choose:
   - Start from blank
   - Start from template
3. If template:
   - Browse template library
   - Preview template
   - Click "Use Template"
4. If blank:
   - Enter title, slug
   - Click "Create"
5. Redirect to Page Builder
6. Add blocks from library (drag or click)
7. Configure each block
8. Arrange blocks (drag to reorder)
9. Preview (desktop/tablet/mobile)
10. Save as draft
11. Publish when ready
```

### 4.2 Edit Existing Landing Page

```
User Flow:
1. Click "Edit" on landing page
2. Page Builder opens
3. Click block to edit
4. Settings panel shows config form
5. Make changes
6. Changes preview live in canvas
7. Click "Update" or "Save"
8. Continue editing other blocks
9. Preview full page
10. Save or Publish
```

### 4.3 Add Block to Page

```
User Flow:
1. In Page Builder canvas
2. See [+ Add Block Here] button
3. Click button OR drag from library
4. If clicked:
   - Block picker modal opens
   - Search/filter blocks
   - Click block to add
5. If dragged:
   - Drag block from library
   - Drop zones highlight
   - Drop at desired position
6. Block added with default config
7. Edit block immediately (optional)
```

### 4.4 Reorder Blocks

```
User Flow:
1. Hover over block
2. Drag handle (⋮) appears
3. Click and drag
4. Other blocks shift to make space
5. Drop zones highlight valid positions
6. Release to drop
7. Blocks reorder with smooth animation
8. Order saved automatically
```

### 4.5 Save Page as Template

```
User Flow:
1. Open landing page
2. Click "•••" menu
3. Select "Save as Template"
4. Modal opens:
   - Template Name
   - Template Category
   - Thumbnail upload
   - Description
5. Click "Save Template"
6. Success message
7. Template now in library
```

---

## 5. Component Specifications

### 5.1 BlockLibraryPanel Component

**Props:**
```typescript
interface BlockLibraryPanelProps {
  onBlockSelect: (templateId: string) => void
  searchQuery?: string
  selectedCategory?: BlockCategory
  isCollapsed?: boolean
}
```

**Features:**
- Search input with debounce
- Category filter dropdown
- Block grid (2 columns)
- Block preview on hover
- Drag and drop support
- Lazy loading

### 5.2 BuilderCanvas Component

**Props:**
```typescript
interface BuilderCanvasProps {
  landingPageId: string
  blocks: ContentBlock[]
  onBlockAdd: (templateId: string, position: number) => Promise<void>
  onBlockUpdate: (blockId: string, config: any) => Promise<void>
  onBlockDelete: (blockId: string) => Promise<void>
  onBlockReorder: (blockId: string, newPosition: number) => Promise<void>
  onBlockSelect: (blockId: string) => void
  selectedBlockId?: string
  viewMode: 'desktop' | 'tablet' | 'mobile'
}
```

**Features:**
- Render all blocks in order
- Drop zones between blocks
- Block controls overlay
- Auto-scroll on drag
- Keyboard shortcuts (delete, duplicate, etc.)
- Undo/redo support

### 5.3 BlockRenderer Component

**Props:**
```typescript
interface BlockRendererProps {
  block: ContentBlock
  isEditing?: boolean
  isSelected?: boolean
  onEdit?: () => void
  onDelete?: () => void
  onDuplicate?: () => void
  onToggleVisibility?: () => void
}
```

**Features:**
- Render block based on template
- Apply config values
- Handle responsive hiding
- Custom CSS injection
- Error boundary

### 5.4 SettingsPanel Component

**Props:**
```typescript
interface SettingsPanelProps {
  selectedBlock?: ContentBlock
  landingPage: LandingPage
  onBlockUpdate: (blockId: string, config: any) => Promise<void>
  onPageUpdate: (updates: Partial<LandingPage>) => Promise<void>
  isCollapsed?: boolean
}
```

**Features:**
- Two tabs: Block Config, Page Settings
- Dynamic form generation
- Field validation
- Auto-save (debounced)
- Reset to defaults

### 5.5 ResponsivePreview Component

**Props:**
```typescript
interface ResponsivePreviewProps {
  mode: 'desktop' | 'tablet' | 'mobile'
  onModeChange: (mode: 'desktop' | 'tablet' | 'mobile') => void
}
```

**Features:**
- Device preview buttons
- Width indicators
- Keyboard shortcuts (D, T, M)

---

## 6. Keyboard Shortcuts

```
Global:
- Ctrl/Cmd + S: Save
- Ctrl/Cmd + P: Publish
- Ctrl/Cmd + Z: Undo
- Ctrl/Cmd + Shift + Z: Redo
- Escape: Deselect block

Preview:
- D: Desktop preview
- T: Tablet preview
- M: Mobile preview

Block Actions:
- Delete: Delete selected block
- Ctrl/Cmd + D: Duplicate selected block
- Ctrl/Cmd + Up/Down: Move block up/down
- H: Toggle visibility
```

---

## 7. Responsive Breakpoints

```
Desktop: > 1024px (default)
Tablet: 768px - 1024px
Mobile: < 768px
```

Canvas scales to show device size:
- Desktop: 100% width
- Tablet: 768px width (centered)
- Mobile: 375px width (centered)

---

## 8. Loading States

### Page Loading
```
┌────────────────────────────────┐
│ ┌─┐                            │
│ └─┘ Loading landing page...   │
│ [████████────────] 60%         │
└────────────────────────────────┘
```

### Block Loading
```
┌────────────────────────────────┐
│ ╔═══════════════════════════╗  │
│ ║ [skeleton shimmer effect] ║  │
│ ╚═══════════════════════════╝  │
└────────────────────────────────┘
```

### Saving
```
[Saving...] → [Saved ✓] (fades out after 2s)
```

---

## 9. Error States

### Block Failed to Load
```
┌────────────────────────────────┐
│ ⚠️ Failed to load block        │
│ This block template may have    │
│ been deleted.                   │
│ [Remove Block] [Retry]          │
└────────────────────────────────┘
```

### Save Failed
```
❌ Failed to save changes
   Please try again or contact support.
   [Retry] [Dismiss]
```

---

## 10. Success States

### Block Added
```
✅ Block added successfully
```

### Page Published
```
🎉 Landing page published!
   View page: [yoursite.com/landing/page-slug]
   [Copy Link] [View Page]
```

---

## 11. Empty States

### No Blocks Yet
```
┌────────────────────────────────┐
│        📦                       │
│  No blocks added yet            │
│                                 │
│  Drag blocks from the sidebar   │
│  or click [+ Add Block]        │
│                                 │
│  [Browse Block Library]         │
└────────────────────────────────┘
```

### No Landing Pages
```
┌────────────────────────────────┐
│        🚀                       │
│  Create your first landing page │
│                                 │
│  Build beautiful, high-converting│
│  landing pages with our visual   │
│  page builder.                   │
│                                 │
│  [+ Create Landing Page]         │
│  [Browse Templates]              │
└────────────────────────────────┘
```

---

## Summary

**Total UI Screens:** 8
- Block Templates List
- Block Template Editor
- Landing Pages List
- Landing Page Builder (main)
- Block Configuration Modal
- Page Settings Panel
- Template Library
- Preview Mode

**Total Components:** 20+
**Total User Flows:** 5 main flows

**Next:** Block Templates Catalog Specification →
