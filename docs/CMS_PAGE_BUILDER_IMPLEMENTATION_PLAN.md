# CMS Page Builder & Dynamic Blocks - Implementation Plan

## 🎯 Project Overview

**Goal:** Build a powerful, flexible CMS with Dynamic Content Blocks and Visual Landing Page Builder

**Why these work together:**
- **Dynamic Blocks** = The foundation (reusable content components)
- **Page Builder** = The interface (drag-and-drop to arrange blocks)

**Total Effort:** ~4-6 weeks
**Complexity:** High, but very high value

---

## 🏗️ Architecture Overview

### Phase 1: Dynamic Content Blocks (Foundation)
Build the block system that powers everything

### Phase 2: Visual Page Builder
Add drag-and-drop UI on top of blocks

```
┌─────────────────────────────────────────┐
│     Visual Landing Page Builder        │
│  (Drag & Drop Interface - Phase 2)     │
├─────────────────────────────────────────┤
│     Dynamic Content Blocks System      │
│        (Foundation - Phase 1)           │
├─────────────────────────────────────────┤
│     Existing CMS (Posts, Pages)        │
└─────────────────────────────────────────┘
```

---

## 📊 Database Schema

### New Models

```prisma
// Content Block Template (Pre-built blocks)
model BlockTemplate {
  id          String   @id @default(cuid())
  name        String   // "Hero Section", "Features Grid", "CTA Banner"
  slug        String   @unique
  category    String   // "hero", "features", "cta", "testimonials", "pricing"
  description String?  @db.Text
  thumbnail   String?  // Preview image

  // Default configuration (JSON)
  defaultConfig Json   // Colors, layout, default text, etc.

  // Schema definition (what fields can be customized)
  schema      Json     // Field definitions for customization

  // HTML/Component template
  template    String   @db.Text // React component code or HTML

  isActive    Boolean  @default(true)

  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}

// Content Block Instance (Used in pages)
model ContentBlock {
  id          String   @id @default(cuid())

  // What template is this based on?
  templateId  String
  template    BlockTemplate @relation(fields: [templateId], references: [id], onDelete: Cascade)

  // Where is this block used?
  pageId      String?
  page        Page?    @relation(fields: [pageId], references: [id], onDelete: Cascade)

  postId      String?
  post        BlogPost? @relation(fields: [postId], references: [id], onDelete: Cascade)

  landingPageId String?
  landingPage   LandingPage? @relation(fields: [landingPageId], references: [id], onDelete: Cascade)

  // Custom configuration for this instance
  config      Json     // User's customizations (text, colors, images, etc.)

  // Position on the page
  order       Int      @default(0)

  // Visibility
  isVisible   Boolean  @default(true)

  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  @@index([pageId])
  @@index([postId])
  @@index([landingPageId])
}

// Landing Page (Created with Page Builder)
model LandingPage {
  id              String   @id @default(cuid())
  title           String
  slug            String   @unique
  description     String?  @db.Text

  // SEO
  seoTitle        String?
  seoDescription  String?  @db.Text
  ogImage         String?

  // Status
  status          PageStatus @default(DRAFT)
  publishedAt     DateTime?

  // Layout settings
  layoutConfig    Json?    // Global page settings (width, spacing, etc.)

  // Relations
  blocks          ContentBlock[]

  // Author
  authorId        String
  author          User     @relation(fields: [authorId], references: [id])

  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt

  @@index([slug])
  @@index([status])
}

enum PageStatus {
  DRAFT
  PUBLISHED
  ARCHIVED
}
```

### Updates to Existing Models

```prisma
// Add to existing Page model
model Page {
  // ... existing fields
  blocks ContentBlock[] // Add this relation
}

// Add to existing BlogPost model
model BlogPost {
  // ... existing fields
  blocks ContentBlock[] // Add this relation
}
```

---

## 🧱 Phase 1: Dynamic Content Blocks (Weeks 1-3)

### Week 1: Core Infrastructure

#### Step 1.1: Database Setup
- [ ] Create migration for BlockTemplate, ContentBlock, LandingPage models
- [ ] Add blocks relation to Page and BlogPost models
- [ ] Run migration and test

#### Step 1.2: Block Template System
- [ ] Create `/api/admin/blocks/templates` endpoints (CRUD)
- [ ] Create admin UI for managing block templates
- [ ] Build block template editor

#### Step 1.3: Pre-built Block Templates
Create 10+ essential block templates:

**Hero Blocks:**
- Hero with background image + CTA
- Hero with video background
- Split hero (image left, text right)

**Content Blocks:**
- Feature grid (3-column, 4-column)
- Text + image (left/right variations)
- Stats/metrics showcase
- Logo grid (clients, partners)

**Conversion Blocks:**
- CTA banner
- Newsletter signup
- Contact form
- Pricing table

**Social Proof:**
- Testimonials carousel
- Review grid
- Case study highlight

### Week 2: Block Instance System

#### Step 2.1: Block Instance API
- [ ] Create `/api/admin/blocks` endpoints (CRUD)
- [ ] Create `/api/admin/pages/[id]/blocks` for managing blocks on pages
- [ ] Add block ordering (drag to reorder)
- [ ] Add block duplication
- [ ] Add block visibility toggle

#### Step 2.2: Block Configuration System
- [ ] Create block config editor component
- [ ] Field types: text, rich text, image, color, spacing, alignment
- [ ] Live preview of block changes
- [ ] Save/reset configuration

#### Step 2.3: Block Renderer
- [ ] Create `BlockRenderer` component
- [ ] Render blocks based on template + config
- [ ] Support all block types
- [ ] Mobile responsive rendering

### Week 3: Integration & Polish

#### Step 3.1: Page Integration
- [ ] Add "Blocks" tab to page editor
- [ ] Block library panel (browse and add blocks)
- [ ] Drag-and-drop to reorder blocks
- [ ] Edit block configuration inline

#### Step 3.2: Block Preview
- [ ] Desktop/tablet/mobile preview modes
- [ ] Side-by-side preview while editing
- [ ] Preview published page

#### Step 3.3: Block Library UI
- [ ] Block template categories
- [ ] Search blocks
- [ ] Block thumbnails
- [ ] "Add to page" functionality

---

## 🎨 Phase 2: Visual Landing Page Builder (Weeks 4-6)

### Week 4: Landing Page Foundation

#### Step 4.1: Landing Page Management
- [ ] Create `/api/admin/landing-pages` endpoints
- [ ] Create landing page list view
- [ ] Create landing page editor shell
- [ ] Basic metadata (title, slug, SEO)

#### Step 4.2: Page Builder UI Setup
- [ ] Choose page builder library (Options: GrapeJS, Craft.js, or custom)
- [ ] Install and configure
- [ ] Create page builder workspace
- [ ] Integrate with existing block system

#### Step 4.3: Block Integration
- [ ] Register all block templates with page builder
- [ ] Map block configs to builder controls
- [ ] Enable drag-and-drop from block library
- [ ] Enable inline editing

### Week 5: Page Builder Features

#### Step 5.1: Canvas & Editing
- [ ] Main editing canvas
- [ ] Drag blocks from sidebar
- [ ] Drop zones between blocks
- [ ] Reorder blocks by dragging
- [ ] Delete blocks
- [ ] Duplicate blocks

#### Step 5.2: Block Customization
- [ ] Right sidebar for block settings
- [ ] Real-time preview of changes
- [ ] Color pickers
- [ ] Image uploaders
- [ ] Text editors
- [ ] Spacing/padding controls

#### Step 5.3: Global Page Settings
- [ ] Page width settings
- [ ] Global colors/fonts
- [ ] Mobile breakpoints
- [ ] Custom CSS (advanced users)

### Week 6: Polish & Advanced Features

#### Step 6.1: Templates & Presets
- [ ] Save page as template
- [ ] Template library
- [ ] Quick-start templates (coming soon, pricing, contact, etc.)
- [ ] Import template to new page

#### Step 6.2: Preview & Publishing
- [ ] Desktop preview
- [ ] Tablet preview
- [ ] Mobile preview
- [ ] Preview mode (view without editing)
- [ ] Publish workflow
- [ ] Unpublish

#### Step 6.3: Advanced Features
- [ ] Undo/redo history
- [ ] Auto-save drafts
- [ ] Keyboard shortcuts
- [ ] Block search in editor
- [ ] Duplicate page

---

## 🎨 Page Builder Technology Options

### Option 1: GrapeJS (Recommended)
**Pros:**
- ✅ Fully-featured, production-ready
- ✅ Large community, good docs
- ✅ Block-based, drag-and-drop
- ✅ Mobile responsive
- ✅ Customizable components
- ✅ Open source

**Cons:**
- ❌ Learning curve
- ❌ Some styling needed

**Verdict:** Best balance of features and flexibility

### Option 2: Craft.js
**Pros:**
- ✅ React-first, modern
- ✅ Very flexible
- ✅ TypeScript support

**Cons:**
- ❌ More work to build UI
- ❌ Smaller community

### Option 3: Custom Builder
**Pros:**
- ✅ Total control
- ✅ Perfect integration

**Cons:**
- ❌ Much more work
- ❌ Longer timeline

**Recommendation:** Start with **GrapeJS**, it's production-ready and we can customize it.

---

## 📦 Block Template Examples

### Example: Hero Block Template

```typescript
{
  name: "Hero with Background Image",
  slug: "hero-background-image",
  category: "hero",
  defaultConfig: {
    backgroundImage: "https://example.com/default-hero.jpg",
    heading: "Welcome to Our Platform",
    subheading: "Build amazing things with our tools",
    ctaText: "Get Started",
    ctaLink: "/signup",
    textColor: "#ffffff",
    overlayOpacity: 0.5,
    alignment: "center",
    height: "600px"
  },
  schema: {
    backgroundImage: { type: "image", label: "Background Image" },
    heading: { type: "text", label: "Heading", maxLength: 100 },
    subheading: { type: "textarea", label: "Subheading", maxLength: 200 },
    ctaText: { type: "text", label: "Button Text" },
    ctaLink: { type: "text", label: "Button Link" },
    textColor: { type: "color", label: "Text Color" },
    overlayOpacity: { type: "slider", label: "Overlay Opacity", min: 0, max: 1, step: 0.1 },
    alignment: { type: "select", label: "Text Alignment", options: ["left", "center", "right"] },
    height: { type: "text", label: "Section Height" }
  },
  template: `
    <section class="hero-section" style="
      background-image: url({{backgroundImage}});
      background-size: cover;
      background-position: center;
      min-height: {{height}};
      position: relative;
      display: flex;
      align-items: center;
      justify-content: {{alignment}};
    ">
      <div class="overlay" style="
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0,0,0,{{overlayOpacity}});
      "></div>
      <div class="content" style="position: relative; z-index: 10; color: {{textColor}}; text-align: {{alignment}};">
        <h1>{{heading}}</h1>
        <p>{{subheading}}</p>
        <a href="{{ctaLink}}" class="cta-button">{{ctaText}}</a>
      </div>
    </section>
  `
}
```

---

## 🧪 Testing Strategy

### Unit Tests
- Block template CRUD operations
- Block instance creation/updates
- Block configuration validation
- Block rendering

### Integration Tests
- Add block to page
- Reorder blocks
- Update block configuration
- Publish landing page

### E2E Tests
- Create landing page from scratch
- Add multiple blocks
- Customize blocks
- Preview and publish
- View on frontend

---

## 🚀 Deployment Checklist

- [ ] Database migrations applied
- [ ] API endpoints tested
- [ ] Admin UI thoroughly tested
- [ ] Frontend rendering works
- [ ] Mobile responsive
- [ ] SEO metadata working
- [ ] Performance optimized (lazy load blocks)
- [ ] Documentation written
- [ ] User guide created
- [ ] Feature flag updated to 'completed'

---

## 📚 Documentation Needed

1. **Admin Guide**
   - How to create landing pages
   - How to use blocks
   - How to customize blocks
   - Best practices

2. **Developer Guide**
   - How to create custom block templates
   - Block schema reference
   - API documentation
   - Component architecture

3. **Block Library Reference**
   - All available blocks
   - Configuration options for each
   - Use cases and examples

---

## 🎯 Success Metrics

When complete, users can:
- ✅ Create landing pages without code
- ✅ Choose from 10+ pre-built block templates
- ✅ Drag and drop to arrange content
- ✅ Customize every block visually
- ✅ Preview on desktop/tablet/mobile
- ✅ Publish professional landing pages
- ✅ Reuse blocks across pages
- ✅ Save pages as templates

---

## ⏱️ Timeline Summary

**Phase 1: Dynamic Content Blocks**
- Week 1: Core infrastructure & templates
- Week 2: Block instances & configuration
- Week 3: Integration & polish

**Phase 2: Visual Page Builder**
- Week 4: Foundation & setup
- Week 5: Core builder features
- Week 6: Polish & advanced features

**Total: 6 weeks** (can be compressed with focused work)

---

## 💡 Quick Start Option

If you want to see results faster, we can:

1. **Week 1-2:** Build just the Dynamic Blocks system
2. **Test with manual JSON editing** (to validate architecture)
3. **Week 3-4:** Add visual page builder on proven foundation

This de-risks the project and gives you working blocks sooner.

---

## ❓ Next Steps

1. **Review this plan** - Any questions or changes?
2. **Choose approach:**
   - Full 6-week build
   - Phased approach (blocks first, then builder)
3. **I'll start implementation** - Begin with database schema

Ready to start building? 🚀
