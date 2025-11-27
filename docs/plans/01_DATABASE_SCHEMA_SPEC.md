# Database Schema Specification - CMS Page Builder

## Overview
Complete database schema for Dynamic Content Blocks and Visual Landing Page Builder system.

---

## 1. BlockTemplate Model

**Purpose:** Store reusable block templates that users can add to pages

```prisma
model BlockTemplate {
  id              String   @id @default(cuid())

  // Basic Info
  name            String   // "Hero Section - Background Image"
  slug            String   @unique // "hero-background-image"
  description     String?  @db.Text
  category        BlockCategory // HERO, CONTENT, CTA, SOCIAL_PROOF, FORM, etc.

  // Visual
  thumbnail       String?  // Preview image URL
  previewUrl      String?  // Link to live demo

  // Configuration
  defaultConfig   Json     // Default values for all configurable fields
  configSchema    Json     // Field definitions (types, labels, validation)

  // Template Code
  componentCode   String   @db.Text // React/TSX component code
  htmlTemplate    String?  @db.Text // Fallback HTML template
  cssStyles       String?  @db.Text // Scoped CSS styles

  // Metadata
  isSystem        Boolean  @default(false) // System templates can't be deleted
  isActive        Boolean  @default(true)
  isPro           Boolean  @default(false) // PRO tier only

  // Usage tracking
  usageCount      Int      @default(0)

  // Relations
  instances       ContentBlock[]

  // Timestamps
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt

  @@index([category])
  @@index([isActive])
  @@index([slug])
}

enum BlockCategory {
  HERO           // Hero sections
  CONTENT        // Text, images, mixed content
  FEATURES       // Feature grids, icon boxes
  CTA            // Call-to-action sections
  TESTIMONIALS   // Reviews, testimonials
  PRICING        // Pricing tables
  TEAM           // Team member grids
  STATS          // Statistics, counters
  LOGO_GRID      // Client/partner logos
  FORM           // Contact, newsletter forms
  FAQ            // FAQ sections
  GALLERY        // Image galleries
  VIDEO          // Video sections
  CUSTOM         // User-created templates
}
```

### Default Config Example
```json
{
  "heading": "Welcome to Our Platform",
  "subheading": "Build amazing things",
  "backgroundImage": "/defaults/hero-bg.jpg",
  "ctaText": "Get Started",
  "ctaLink": "/signup",
  "textColor": "#ffffff",
  "overlayOpacity": 0.5,
  "alignment": "center",
  "minHeight": "600px"
}
```

### Config Schema Example
```json
{
  "fields": [
    {
      "name": "heading",
      "type": "text",
      "label": "Main Heading",
      "required": true,
      "maxLength": 100,
      "placeholder": "Enter heading..."
    },
    {
      "name": "backgroundImage",
      "type": "image",
      "label": "Background Image",
      "required": false,
      "accept": "image/*"
    },
    {
      "name": "textColor",
      "type": "color",
      "label": "Text Color",
      "default": "#ffffff"
    },
    {
      "name": "alignment",
      "type": "select",
      "label": "Content Alignment",
      "options": [
        { "value": "left", "label": "Left" },
        { "value": "center", "label": "Center" },
        { "value": "right", "label": "Right" }
      ]
    }
  ]
}
```

---

## 2. ContentBlock Model

**Purpose:** Individual block instances used in pages/posts/landing pages

```prisma
model ContentBlock {
  id              String   @id @default(cuid())

  // Template Reference
  templateId      String
  template        BlockTemplate @relation(fields: [templateId], references: [id], onDelete: Cascade)

  // Where is this block used? (polymorphic relationship)
  pageId          String?
  page            Page?         @relation(fields: [pageId], references: [id], onDelete: Cascade)

  postId          String?
  post            BlogPost?     @relation(fields: [postId], references: [id], onDelete: Cascade)

  landingPageId   String?
  landingPage     LandingPage?  @relation(fields: [landingPageId], references: [id], onDelete: Cascade)

  // Custom Configuration (overrides template defaults)
  config          Json     // User's custom values

  // Styling Overrides
  customCss       String?  @db.Text
  customClasses   String?  // Additional CSS classes

  // Layout
  order           Int      @default(0) // Position on page (0 = first)

  // Visibility
  isVisible       Boolean  @default(true)
  visibilityRules Json?    // Show/hide based on conditions (future)

  // Responsive Settings
  hideOnMobile    Boolean  @default(false)
  hideOnTablet    Boolean  @default(false)
  hideOnDesktop   Boolean  @default(false)

  // Animation (future)
  animationType   String?  // "fadeIn", "slideUp", etc.
  animationDelay  Int?     // Milliseconds

  // Timestamps
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt

  @@index([pageId, order])
  @@index([postId, order])
  @@index([landingPageId, order])
  @@index([templateId])
}
```

### Config Example
```json
{
  "heading": "Custom Heading for This Page",
  "subheading": "Different subheading",
  "backgroundImage": "/uploads/custom-hero.jpg",
  "ctaText": "Learn More",
  "ctaLink": "/about",
  "textColor": "#000000",
  "overlayOpacity": 0.3,
  "alignment": "left",
  "minHeight": "500px"
}
```

---

## 3. LandingPage Model

**Purpose:** Landing pages created with the page builder

```prisma
model LandingPage {
  id              String   @id @default(cuid())

  // Basic Info
  title           String
  slug            String   @unique
  description     String?  @db.Text

  // SEO
  seoTitle        String?
  seoDescription  String?  @db.Text
  seoKeywords     String?
  ogImage         String?  // Open Graph image
  ogTitle         String?
  ogDescription   String?

  // Status
  status          PageStatus @default(DRAFT)
  publishedAt     DateTime?
  scheduledPublishAt DateTime?    // Future: scheduled publishing

  // Layout Configuration
  layoutConfig    Json?    // Global page settings
  customCss       String?  @db.Text
  customJs        String?  @db.Text // For tracking codes, etc.

  // Template
  templateId      String?  // If created from template

  // Content
  blocks          ContentBlock[]

  // Author
  authorId        String
  author          User     @relation(fields: [authorId], references: [id])

  // Analytics (future)
  viewCount       Int      @default(0)
  conversionGoal  String?  // Track conversions

  // Timestamps
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt

  @@index([slug])
  @@index([status])
  @@index([authorId])
  @@index([publishedAt])
}

enum PageStatus {
  DRAFT
  PUBLISHED
  SCHEDULED
  ARCHIVED
}
```

### Layout Config Example
```json
{
  "maxWidth": "1200px",
  "containerPadding": "24px",
  "sectionSpacing": "80px",
  "mobileSpacing": "40px",
  "globalColors": {
    "primary": "#3B82F6",
    "secondary": "#10B981",
    "accent": "#F59E0B"
  },
  "globalFonts": {
    "heading": "Inter, sans-serif",
    "body": "Open Sans, sans-serif"
  }
}
```

---

## 4. LandingPageTemplate Model

**Purpose:** Save landing pages as reusable templates

```prisma
model LandingPageTemplate {
  id              String   @id @default(cuid())

  // Basic Info
  name            String
  slug            String   @unique
  description     String?  @db.Text
  category        String?  // "saas", "ecommerce", "portfolio", etc.

  // Visual
  thumbnail       String?
  previewUrl      String?

  // Template Data (snapshot of landing page)
  templateData    Json     // All blocks + layout config

  // Metadata
  isSystem        Boolean  @default(false)
  isActive        Boolean  @default(true)
  isPro           Boolean  @default(false)

  // Usage
  usageCount      Int      @default(0)

  // Creator
  createdById     String?
  createdBy       User?    @relation(fields: [createdById], references: [id])

  // Timestamps
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt

  @@index([slug])
  @@index([category])
}
```

---

## 5. Updates to Existing Models

### Page Model - Add Blocks Support

```prisma
model Page {
  id              String   @id @default(cuid())
  title           String
  slug            String   @unique
  content         String   @db.Text
  status          PostStatus @default(DRAFT)
  useStorefrontLayout Boolean @default(true)

  // NEW: Block-based content (alternative to rich text)
  useBlockEditor  Boolean  @default(false) // Toggle between rich text or blocks
  blocks          ContentBlock[] // Add this relation

  // SEO
  seoTitle        String?
  seoDescription  String?   @db.Text

  createdAt       DateTime   @default(now())
  updatedAt       DateTime   @updatedAt

  @@index([slug])
}
```

### BlogPost Model - Add Blocks Support

```prisma
model BlogPost {
  id              String      @id @default(cuid())
  title           String
  slug            String      @unique
  content         String      @db.Text
  excerpt         String?     @db.Text
  featuredImage   String?
  status          PostStatus  @default(DRAFT)
  publishedAt     DateTime?

  // NEW: Block-based content sections
  useBlockEditor  Boolean     @default(false)
  blocks          ContentBlock[] // Add this relation

  // SEO
  seoTitle        String?
  seoDescription  String?    @db.Text

  // Relations
  authorId        String
  author          User       @relation(fields: [authorId], references: [id])
  categoryId      String?
  category        BlogCategory? @relation(fields: [categoryId], references: [id])
  tags            BlogTag[]

  createdAt       DateTime   @default(now())
  updatedAt       DateTime   @updatedAt

  @@index([slug])
  @@index([status])
  @@index([authorId])
  @@index([categoryId])
}
```

---

## 6. Indexes Strategy

**Purpose:** Optimize query performance

### Critical Indexes
```prisma
// BlockTemplate
@@index([category])        // Filter by category
@@index([isActive])        // Filter active templates
@@index([slug])            // Lookup by slug

// ContentBlock
@@index([pageId, order])         // Page blocks ordered
@@index([postId, order])         // Post blocks ordered
@@index([landingPageId, order])  // Landing page blocks ordered
@@index([templateId])            // Find all instances of template

// LandingPage
@@index([slug])           // Frontend lookup
@@index([status])         // Filter by status
@@index([authorId])       // User's pages
@@index([publishedAt])    // Recently published
```

---

## 7. Relationships Diagram

```
BlockTemplate (1) ──────> (N) ContentBlock
                                   ↓
                    ┌──────────────┼──────────────┐
                    ↓              ↓              ↓
                  Page         BlogPost      LandingPage
                    ↓              ↓              ↓
                  User           User           User
```

---

## 8. Data Validation Rules

### BlockTemplate
- `name`: Required, 3-100 chars
- `slug`: Required, unique, lowercase, alphanumeric + hyphens
- `category`: Required, valid BlockCategory enum
- `defaultConfig`: Required, valid JSON
- `configSchema`: Required, valid JSON schema
- `componentCode`: Required for rendering

### ContentBlock
- `templateId`: Required, must reference existing BlockTemplate
- `config`: Required, valid JSON matching template schema
- Must have ONE of: pageId, postId, or landingPageId
- `order`: Must be >= 0

### LandingPage
- `title`: Required, 3-200 chars
- `slug`: Required, unique, URL-safe
- `status`: Required, valid PageStatus enum
- `authorId`: Required, must reference existing User
- If `status = PUBLISHED`, must have `publishedAt`

---

## 9. Migration Strategy

### Step 1: Create New Models
```bash
npx prisma migrate dev --name add_block_templates
npx prisma migrate dev --name add_content_blocks
npx prisma migrate dev --name add_landing_pages
npx prisma migrate dev --name add_landing_page_templates
```

### Step 2: Update Existing Models
```bash
npx prisma migrate dev --name add_blocks_to_pages_and_posts
```

### Step 3: Seed Default Block Templates
```bash
npx tsx prisma/seed-block-templates.ts
```

---

## 10. Seed Data Requirements

### System Block Templates to Create
1. **Hero Blocks** (5 templates)
2. **Feature Sections** (4 templates)
3. **CTA Blocks** (3 templates)
4. **Testimonial Sections** (2 templates)
5. **Pricing Tables** (2 templates)
6. **FAQ Sections** (1 template)
7. **Contact Forms** (2 templates)
8. **Stats Sections** (2 templates)
9. **Team Grids** (1 template)
10. **Logo Grids** (1 template)

**Total: 23 system block templates**

### System Landing Page Templates
1. **SaaS Product Page**
2. **Coming Soon**
3. **Pricing Page**
4. **Contact Us**
5. **About Us**
6. **Thank You Page**

**Total: 6 system landing page templates**

---

## 11. Storage Considerations

### Estimated Storage per Landing Page
- LandingPage record: ~2 KB
- ContentBlocks (avg 5 per page): ~5 KB
- Custom CSS/JS: ~5 KB
- Images (referenced, not stored): 0 KB

**Total per page: ~12 KB**

**1000 landing pages: ~12 MB** (very manageable)

### Database Indexes
- Adds ~15% overhead
- Total for 1000 pages: ~14 MB

---

## 12. Data Retention Policy

### Draft Pages
- Keep indefinitely until manually deleted
- Auto-save every 30 seconds

### Published Pages
- Keep forever (or until manually archived/deleted)

### Archived Pages
- Keep for 90 days
- Then move to cold storage or delete

### Templates
- System templates: Never delete
- User templates: Delete only by user request

---

## Summary

**New Models:** 4
- BlockTemplate
- ContentBlock
- LandingPage
- LandingPageTemplate

**Updated Models:** 2
- Page (add blocks support)
- BlogPost (add blocks support)

**New Enums:** 2
- BlockCategory
- PageStatus (updated)

**Total Database Impact:** ~30-40 MB for 1000 landing pages

**Next:** API Endpoints Specification →
