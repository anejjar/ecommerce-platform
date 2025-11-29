# API Endpoints Specification - CMS Page Builder

## Overview
Complete API specification for all endpoints needed for Dynamic Content Blocks and Visual Landing Page Builder.

**Base URL:** `/api/admin`
**Authentication:** Required for all endpoints (ADMIN, MANAGER, SUPERADMIN roles)

---

## 1. Block Templates API

### 1.1 GET /api/admin/blocks/templates

**Purpose:** List all block templates

**Query Parameters:**
```typescript
{
  category?: BlockCategory    // Filter by category
  isActive?: boolean          // Filter active/inactive
  isPro?: boolean            // Filter PRO templates
  search?: string            // Search by name/description
  page?: number              // Pagination (default: 1)
  limit?: number             // Items per page (default: 20)
  sortBy?: 'name' | 'createdAt' | 'usageCount'
  sortOrder?: 'asc' | 'desc'
}
```

**Response 200:**
```typescript
{
  templates: [
    {
      id: string
      name: string
      slug: string
      description: string | null
      category: BlockCategory
      thumbnail: string | null
      previewUrl: string | null
      isSystem: boolean
      isActive: boolean
      isPro: boolean
      usageCount: number
      createdAt: string
      updatedAt: string
    }
  ],
  pagination: {
    total: number
    page: number
    limit: number
    totalPages: number
  }
}
```

**Response 401:** Unauthorized
**Response 403:** Forbidden (insufficient permissions)

---

### 1.2 GET /api/admin/blocks/templates/:id

**Purpose:** Get single block template with full details

**Response 200:**
```typescript
{
  id: string
  name: string
  slug: string
  description: string | null
  category: BlockCategory
  thumbnail: string | null
  previewUrl: string | null
  defaultConfig: object        // Default configuration values
  configSchema: object         // Field definitions
  componentCode: string        // React component code
  htmlTemplate: string | null  // Fallback HTML
  cssStyles: string | null     // Scoped CSS
  isSystem: boolean
  isActive: boolean
  isPro: boolean
  usageCount: number
  createdAt: string
  updatedAt: string
}
```

**Response 404:** Template not found

---

### 1.3 POST /api/admin/blocks/templates

**Purpose:** Create new block template

**Request Body:**
```typescript
{
  name: string              // Required, 3-100 chars
  slug: string              // Required, unique, URL-safe
  description?: string
  category: BlockCategory   // Required
  thumbnail?: string
  previewUrl?: string
  defaultConfig: object     // Required
  configSchema: object      // Required
  componentCode: string     // Required
  htmlTemplate?: string
  cssStyles?: string
  isSystem?: boolean        // Default: false
  isActive?: boolean        // Default: true
  isPro?: boolean           // Default: false
}
```

**Response 201:**
```typescript
{
  id: string
  name: string
  slug: string
  // ... (same as GET /:id response)
}
```

**Response 400:** Validation errors
**Response 409:** Slug already exists

---

### 1.4 PUT /api/admin/blocks/templates/:id

**Purpose:** Update block template

**Request Body:** (Same as POST, all fields optional except those being updated)

**Response 200:** Updated template (same structure as GET /:id)
**Response 400:** Validation errors
**Response 403:** Cannot update system templates (unless SUPERADMIN)
**Response 404:** Template not found

---

### 1.5 DELETE /api/admin/blocks/templates/:id

**Purpose:** Delete block template

**Response 200:**
```typescript
{
  message: "Template deleted successfully"
  deletedId: string
}
```

**Response 403:** Cannot delete system templates
**Response 404:** Template not found
**Response 409:** Template is in use (has instances)

---

### 1.6 POST /api/admin/blocks/templates/:id/duplicate

**Purpose:** Duplicate existing template

**Request Body:**
```typescript
{
  name: string        // New name for duplicated template
  slug: string        // New slug
}
```

**Response 201:** Created template (same structure as GET /:id)

---

## 2. Content Blocks API

### 2.1 GET /api/admin/blocks

**Purpose:** List all content block instances

**Query Parameters:**
```typescript
{
  pageId?: string          // Filter by page
  postId?: string          // Filter by post
  landingPageId?: string   // Filter by landing page
  templateId?: string      // Filter by template
  isVisible?: boolean      // Filter visible/hidden
}
```

**Response 200:**
```typescript
{
  blocks: [
    {
      id: string
      templateId: string
      template: {
        id: string
        name: string
        category: BlockCategory
        thumbnail: string | null
      }
      pageId: string | null
      postId: string | null
      landingPageId: string | null
      config: object
      customCss: string | null
      customClasses: string | null
      order: number
      isVisible: boolean
      hideOnMobile: boolean
      hideOnTablet: boolean
      hideOnDesktop: boolean
      createdAt: string
      updatedAt: string
    }
  ]
}
```

---

### 2.2 GET /api/admin/blocks/:id

**Purpose:** Get single block instance

**Response 200:** (Same structure as list item above, with full details)
**Response 404:** Block not found

---

### 2.3 POST /api/admin/blocks

**Purpose:** Create new content block

**Request Body:**
```typescript
{
  templateId: string     // Required
  pageId?: string        // One of these 3 is required
  postId?: string
  landingPageId?: string
  config: object         // Required, must match template schema
  customCss?: string
  customClasses?: string
  order?: number         // Default: 0 (prepend) or max+1 (append)
  isVisible?: boolean    // Default: true
  hideOnMobile?: boolean
  hideOnTablet?: boolean
  hideOnDesktop?: boolean
}
```

**Response 201:** Created block (same structure as GET /:id)
**Response 400:** Validation errors, config doesn't match schema
**Response 404:** Template not found

---

### 2.4 PUT /api/admin/blocks/:id

**Purpose:** Update content block

**Request Body:** (All fields optional except those being updated)
```typescript
{
  config?: object
  customCss?: string
  customClasses?: string
  order?: number
  isVisible?: boolean
  hideOnMobile?: boolean
  hideOnTablet?: boolean
  hideOnDesktop?: boolean
}
```

**Response 200:** Updated block
**Response 400:** Validation errors
**Response 404:** Block not found

---

### 2.5 DELETE /api/admin/blocks/:id

**Purpose:** Delete content block

**Response 200:**
```typescript
{
  message: "Block deleted successfully"
  deletedId: string
}
```

**Response 404:** Block not found

---

### 2.6 POST /api/admin/blocks/:id/duplicate

**Purpose:** Duplicate block instance

**Request Body:**
```typescript
{
  insertAfter?: boolean  // Insert after original? Default: true
}
```

**Response 201:** Created block (copy of original)

---

### 2.7 POST /api/admin/blocks/reorder

**Purpose:** Reorder blocks (drag-and-drop support)

**Request Body:**
```typescript
{
  pageId?: string          // One of these 3 is required
  postId?: string
  landingPageId?: string
  blockOrders: [
    {
      blockId: string
      order: number
    }
  ]
}
```

**Response 200:**
```typescript
{
  message: "Blocks reordered successfully"
  updatedCount: number
}
```

**Response 400:** Validation errors

---

## 3. Landing Pages API

### 3.1 GET /api/admin/landing-pages

**Purpose:** List all landing pages

**Query Parameters:**
```typescript
{
  status?: PageStatus
  authorId?: string
  search?: string        // Search title, description
  page?: number
  limit?: number
  sortBy?: 'title' | 'createdAt' | 'publishedAt' | 'viewCount'
  sortOrder?: 'asc' | 'desc'
}
```

**Response 200:**
```typescript
{
  pages: [
    {
      id: string
      title: string
      slug: string
      description: string | null
      status: PageStatus
      publishedAt: string | null
      thumbnail: string | null  // First block thumbnail or custom
      author: {
        id: string
        name: string
        email: string
      }
      blockCount: number
      viewCount: number
      createdAt: string
      updatedAt: string
    }
  ],
  pagination: {
    total: number
    page: number
    limit: number
    totalPages: number
  }
}
```

---

### 3.2 GET /api/admin/landing-pages/:id

**Purpose:** Get single landing page with all blocks

**Query Parameters:**
```typescript
{
  includeBlocks?: boolean  // Default: true
}
```

**Response 200:**
```typescript
{
  id: string
  title: string
  slug: string
  description: string | null
  seoTitle: string | null
  seoDescription: string | null
  seoKeywords: string | null
  ogImage: string | null
  ogTitle: string | null
  ogDescription: string | null
  status: PageStatus
  publishedAt: string | null
  scheduledPublishAt: string | null
  layoutConfig: object | null
  customCss: string | null
  customJs: string | null
  templateId: string | null
  authorId: string
  author: {
    id: string
    name: string
    email: string
  }
  blocks: [
    {
      id: string
      templateId: string
      template: {
        id: string
        name: string
        category: BlockCategory
      }
      config: object
      order: number
      isVisible: boolean
      hideOnMobile: boolean
      hideOnTablet: boolean
      hideOnDesktop: boolean
    }
  ],
  viewCount: number
  createdAt: string
  updatedAt: string
}
```

**Response 404:** Page not found

---

### 3.3 POST /api/admin/landing-pages

**Purpose:** Create new landing page

**Request Body:**
```typescript
{
  title: string                // Required, 3-200 chars
  slug: string                 // Required, unique, URL-safe
  description?: string
  seoTitle?: string
  seoDescription?: string
  seoKeywords?: string
  ogImage?: string
  ogTitle?: string
  ogDescription?: string
  status?: PageStatus          // Default: DRAFT
  layoutConfig?: object
  customCss?: string
  customJs?: string
  templateId?: string          // Create from template
}
```

**Response 201:** Created page (same structure as GET /:id)
**Response 400:** Validation errors
**Response 409:** Slug already exists

---

### 3.4 PUT /api/admin/landing-pages/:id

**Purpose:** Update landing page

**Request Body:** (All fields optional except those being updated)

**Response 200:** Updated page
**Response 400:** Validation errors
**Response 404:** Page not found

---

### 3.5 DELETE /api/admin/landing-pages/:id

**Purpose:** Delete landing page

**Response 200:**
```typescript
{
  message: "Landing page deleted successfully"
  deletedId: string
  deletedBlocksCount: number  // Cascade deleted blocks
}
```

**Response 404:** Page not found

---

### 3.6 POST /api/admin/landing-pages/:id/publish

**Purpose:** Publish landing page (change status to PUBLISHED)

**Request Body:**
```typescript
{
  scheduledPublishAt?: string  // ISO date, publish in future
}
```

**Response 200:**
```typescript
{
  id: string
  status: PageStatus
  publishedAt: string
}
```

**Response 400:** Page has no blocks (can't publish empty page)
**Response 404:** Page not found

---

### 3.7 POST /api/admin/landing-pages/:id/unpublish

**Purpose:** Unpublish landing page (change status to DRAFT)

**Response 200:**
```typescript
{
  id: string
  status: "DRAFT"
  publishedAt: null
}
```

---

### 3.8 POST /api/admin/landing-pages/:id/duplicate

**Purpose:** Duplicate landing page

**Request Body:**
```typescript
{
  title: string      // New title
  slug: string       // New slug
}
```

**Response 201:** Created page (copy of original with all blocks)

---

### 3.9 POST /api/admin/landing-pages/:id/save-as-template

**Purpose:** Save landing page as reusable template

**Request Body:**
```typescript
{
  name: string          // Template name
  slug: string          // Template slug
  description?: string
  category?: string
  thumbnail?: string
}
```

**Response 201:**
```typescript
{
  id: string
  name: string
  slug: string
  // ... LandingPageTemplate structure
}
```

---

## 4. Landing Page Templates API

### 4.1 GET /api/admin/landing-page-templates

**Purpose:** List all landing page templates

**Query Parameters:**
```typescript
{
  category?: string
  isActive?: boolean
  isPro?: boolean
  search?: string
  page?: number
  limit?: number
}
```

**Response 200:**
```typescript
{
  templates: [
    {
      id: string
      name: string
      slug: string
      description: string | null
      category: string | null
      thumbnail: string | null
      previewUrl: string | null
      isSystem: boolean
      isActive: boolean
      isPro: boolean
      usageCount: number
      createdAt: string
      updatedAt: string
    }
  ],
  pagination: { ... }
}
```

---

### 4.2 GET /api/admin/landing-page-templates/:id

**Purpose:** Get template details

**Response 200:**
```typescript
{
  id: string
  name: string
  slug: string
  description: string | null
  category: string | null
  thumbnail: string | null
  previewUrl: string | null
  templateData: {
    layoutConfig: object
    blocks: [
      {
        templateId: string
        config: object
        order: number
      }
    ]
  }
  isSystem: boolean
  isActive: boolean
  isPro: boolean
  usageCount: number
  createdBy: {
    id: string
    name: string
  } | null
  createdAt: string
  updatedAt: string
}
```

---

### 4.3 POST /api/admin/landing-page-templates/:id/use

**Purpose:** Create new landing page from template

**Request Body:**
```typescript
{
  title: string
  slug: string
}
```

**Response 201:** Created landing page (with all blocks from template)

---

## 5. Page/Post Blocks Integration API

### 5.1 GET /api/admin/pages/:pageId/blocks

**Purpose:** Get all blocks for a specific page

**Response 200:**
```typescript
{
  blocks: [ /* ContentBlock[] */ ]
}
```

---

### 5.2 POST /api/admin/pages/:pageId/blocks

**Purpose:** Add block to page

**Request Body:** (Same as POST /api/admin/blocks, but pageId is in URL)

**Response 201:** Created block

---

### 5.3 GET /api/admin/posts/:postId/blocks

**Purpose:** Get all blocks for a specific post

**Response 200:** (Same structure as pages)

---

### 5.4 POST /api/admin/posts/:postId/blocks

**Purpose:** Add block to blog post

**Request Body:** (Same as pages)

**Response 201:** Created block

---

## 6. Public Frontend API

### 6.1 GET /api/landing-pages/:slug

**Purpose:** Get published landing page for frontend display

**Response 200:**
```typescript
{
  id: string
  title: string
  description: string | null
  seoTitle: string | null
  seoDescription: string | null
  ogImage: string | null
  layoutConfig: object | null
  blocks: [
    {
      id: string
      templateId: string
      template: {
        name: string
        category: BlockCategory
        componentCode: string
        htmlTemplate: string | null
        cssStyles: string | null
      }
      config: object
      order: number
      hideOnMobile: boolean
      hideOnTablet: boolean
      hideOnDesktop: boolean
    }
  ]
}
```

**Response 404:** Page not found or not published

---

## 7. Analytics API (Future)

### 7.1 POST /api/landing-pages/:id/track-view

**Purpose:** Track page view

**Response 200:** { viewCount: number }

---

### 7.2 GET /api/admin/landing-pages/:id/analytics

**Purpose:** Get page analytics

**Response 200:**
```typescript
{
  viewCount: number
  uniqueVisitors: number
  averageTimeOnPage: number
  bounceRate: number
  conversionRate: number
}
```

---

## 8. Error Response Format

All errors follow this structure:

```typescript
{
  error: string            // Error message
  code?: string           // Error code (VALIDATION_ERROR, NOT_FOUND, etc.)
  field?: string          // Field that caused error (for validation)
  details?: object        // Additional error details
}
```

### Error Codes
- `VALIDATION_ERROR` - Invalid input
- `NOT_FOUND` - Resource not found
- `UNAUTHORIZED` - Not authenticated
- `FORBIDDEN` - Insufficient permissions
- `CONFLICT` - Resource conflict (duplicate slug, etc.)
- `IN_USE` - Resource is being used (can't delete)

---

## 9. Rate Limiting

- **Admin endpoints:** 100 requests/minute per user
- **Public endpoints:** 1000 requests/minute per IP

---

## 10. Caching Strategy

### Cache Headers
```
Cache-Control: public, max-age=300  // Public endpoints (5 min)
Cache-Control: private, no-cache    // Admin endpoints
```

### Redis Caching (Future)
- Published landing pages: 5 minutes
- Block templates: 1 hour
- Landing page templates: 1 hour

---

## Summary

**Total Endpoints:** 35+

**By Category:**
- Block Templates: 6 endpoints
- Content Blocks: 7 endpoints
- Landing Pages: 9 endpoints
- Landing Page Templates: 3 endpoints
- Page/Post Integration: 4 endpoints
- Public Frontend: 1 endpoint
- Analytics: 2 endpoints (future)

**Authentication:** All admin endpoints require authentication
**Authorization:** Role-based (ADMIN, MANAGER, SUPERADMIN)

**Next:** UI Components & Flows Specification →
