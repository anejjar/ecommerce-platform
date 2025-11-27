# Implementation Checklist - CMS Page Builder

## Overview
Step-by-step implementation plan with time estimates and dependencies.

**Total Estimated Time:** 4-6 weeks (160-240 hours)
**Team Size:** 1-2 developers

---

## Phase 1: Foundation & Database (Week 1)

### 1.1 Database Schema - 8 hours

- [ ] Create `BlockTemplate` model migration
  - Fields: id, name, slug, category, defaultConfig, configSchema, etc.
  - Indexes: slug, category, isActive
  - **Time:** 2 hours

- [ ] Create `ContentBlock` model migration
  - Fields: id, templateId, pageId, postId, landingPageId, config, order, etc.
  - Relationships: template, page, post, landingPage
  - Indexes: templateId, pageId+order, postId+order, landingPageId+order
  - **Time:** 2 hours

- [ ] Create `LandingPage` model migration
  - Fields: id, title, slug, status, seoTitle, layoutConfig, etc.
  - Relationships: author, blocks
  - Indexes: slug, status, authorId
  - **Time:** 2 hours

- [ ] Create `LandingPageTemplate` model migration
  - Fields: id, name, slug, templateData, etc.
  - **Time:** 1 hour

- [ ] Update `Page` and `BlogPost` models
  - Add `useBlockEditor` boolean field
  - Add `blocks` relation
  - **Time:** 1 hour

- [ ] Run migrations and verify
  - Test all relationships
  - Verify indexes created
  - **Time:** <1 hour

**Deliverable:** All database models created and tested
**Checkpoint:** Run `npx prisma migrate dev` successfully

---

### 1.2 Seed Block Templates - 12 hours

- [ ] Create seed script structure
  - `prisma/seed-block-templates.ts`
  - Helper functions for creating templates
  - **Time:** 2 hours

- [ ] Create Hero block templates (5 templates)
  - Hero - Background Image
  - Hero - Video Background
  - Hero - Split Layout
  - Hero - Minimal with Badge
  - Hero - Gradient
  - **Time:** 4 hours

- [ ] Create Feature block templates (4 templates)
  - Features - 3-Column Grid
  - Features - Alternating Layout
  - Features - Icon Boxes
  - Features - Screenshots
  - **Time:** 3 hours

- [ ] Create CTA block templates (3 templates)
  - CTA - Full Width Banner
  - CTA - Card Style
  - CTA - Split
  - **Time:** 2 hours

- [ ] Create remaining block templates (11 templates)
  - Testimonials, Pricing, Forms, Content blocks
  - **Time:** 3 hours

- [ ] Test seed script
  - Run seed
  - Verify all templates created
  - Test template rendering
  - **Time:** 1 hour

**Deliverable:** 23 system block templates seeded
**Checkpoint:** Run `npx tsx prisma/seed-block-templates.ts` successfully

---

### 1.3 Base API Routes - 16 hours

**Block Templates API (6 hours)**

- [ ] GET `/api/admin/blocks/templates`
  - List all templates
  - Filtering, pagination, search
  - **Time:** 2 hours

- [ ] GET `/api/admin/blocks/templates/:id`
  - Get single template
  - **Time:** 1 hour

- [ ] POST `/api/admin/blocks/templates`
  - Create template
  - Validation with Zod
  - **Time:** 2 hours

- [ ] PUT `/api/admin/blocks/templates/:id`
  - Update template
  - **Time:** 1 hour

- [ ] DELETE `/api/admin/blocks/templates/:id`
  - Delete template (check usage first)
  - **Time:** 1 hour

- [ ] POST `/api/admin/blocks/templates/:id/duplicate`
  - Duplicate template
  - **Time:** 1 hour

**Content Blocks API (6 hours)**

- [ ] GET `/api/admin/blocks`
  - List blocks with filters
  - **Time:** 1 hour

- [ ] GET `/api/admin/blocks/:id`
  - Get single block
  - **Time:** 1 hour

- [ ] POST `/api/admin/blocks`
  - Create block instance
  - Validate config against schema
  - **Time:** 2 hours

- [ ] PUT `/api/admin/blocks/:id`
  - Update block config
  - **Time:** 1 hour

- [ ] DELETE `/api/admin/blocks/:id`
  - Delete block
  - **Time:** 30 min

- [ ] POST `/api/admin/blocks/:id/duplicate`
  - Duplicate block
  - **Time:** 30 min

- [ ] POST `/api/admin/blocks/reorder`
  - Batch reorder blocks
  - **Time:** 2 hours

**Landing Pages API (4 hours)**

- [ ] GET `/api/admin/landing-pages`
  - List pages with stats
  - **Time:** 1 hour

- [ ] GET `/api/admin/landing-pages/:id`
  - Get page with blocks
  - **Time:** 1 hour

- [ ] POST `/api/admin/landing-pages`
  - Create new page
  - **Time:** 1 hour

- [ ] PUT `/api/admin/landing-pages/:id`
  - Update page
  - **Time:** 30 min

- [ ] DELETE `/api/admin/landing-pages/:id`
  - Delete page (cascade blocks)
  - **Time:** 30 min

- [ ] POST `/api/admin/landing-pages/:id/publish`
  - Publish page
  - **Time:** 1 hour

**Deliverable:** All core API endpoints functional
**Checkpoint:** API tests passing

---

## Phase 2: Admin UI - Block Management (Week 2)

### 2.1 Block Templates UI - 12 hours

- [ ] Block Templates List Page
  - `/admin/blocks/templates`
  - Grid/list view
  - Search, filters
  - **Time:** 4 hours

- [ ] Block Template Editor
  - `/admin/blocks/templates/:id`
  - Form for all fields
  - Config schema editor
  - Code editor (Monaco)
  - Live preview
  - **Time:** 6 hours

- [ ] Template Actions
  - Duplicate template
  - Delete with confirmation
  - Active/inactive toggle
  - **Time:** 2 hours

**Deliverable:** Block template management UI
**Checkpoint:** Can create/edit block templates via UI

---

### 2.2 Shared Components - 8 hours

- [ ] BlockRenderer Component
  - Render block based on template + config
  - Handle variable substitution
  - Error boundaries
  - **Time:** 3 hours

- [ ] BlockConfigForm Component
  - Dynamic form from config schema
  - All field types (text, color, image, etc.)
  - Validation
  - **Time:** 3 hours

- [ ] MediaPicker Integration
  - Use existing MediaPicker for image fields
  - **Time:** 1 hour

- [ ] ResponsivePreview Component
  - Desktop/tablet/mobile switcher
  - **Time:** 1 hour

**Deliverable:** Reusable block components
**Checkpoint:** Components render correctly

---

### 2.3 Content Blocks UI - 8 hours

- [ ] Add Blocks to Pages/Posts
  - "Add Block" button on page editor
  - Block library modal
  - Insert block at position
  - **Time:** 4 hours

- [ ] Edit Block Configuration
  - Inline editor or modal
  - Save block config
  - **Time:** 2 hours

- [ ] Block Actions
  - Reorder (drag-and-drop)
  - Duplicate
  - Delete
  - Hide/show
  - **Time:** 2 hours

**Deliverable:** Block management in pages/posts
**Checkpoint:** Can add/edit/reorder blocks

---

## Phase 3: Landing Page Builder Basic (Week 3)

### 3.1 Landing Pages Management - 12 hours

- [ ] Landing Pages List
  - `/admin/landing-pages`
  - Grid view with thumbnails
  - Status badges
  - Quick actions
  - **Time:** 4 hours

- [ ] Create Landing Page Modal
  - Basic info form
  - Template selection (optional)
  - **Time:** 2 hours

- [ ] Landing Page Settings
  - Title, slug, SEO
  - Layout config
  - Custom CSS/JS
  - **Time:** 4 hours

- [ ] Publish/Unpublish Workflow
  - Status changes
  - Scheduled publishing (basic)
  - **Time:** 2 hours

**Deliverable:** Landing page CRUD
**Checkpoint:** Can create/manage landing pages

---

### 3.2 Manual Block Builder - 16 hours

**Before GrapeJS integration, build manual version:**

- [ ] Landing Page Editor Layout
  - 3-panel layout (blocks, canvas, settings)
  - **Time:** 3 hours

- [ ] Block Library Panel
  - Browse templates by category
  - Search blocks
  - Drag or click to add
  - **Time:** 4 hours

- [ ] Canvas Area
  - Render all blocks in order
  - Block controls (edit, delete, hide)
  - Drop zones between blocks
  - **Time:** 4 hours

- [ ] Settings Panel
  - Block config form (when block selected)
  - Page settings form
  - **Time:** 3 hours

- [ ] Drag-and-Drop Reordering
  - Drag blocks to reorder
  - Visual feedback
  - **Time:** 2 hours

**Deliverable:** Manual block editor (no GrapeJS yet)
**Checkpoint:** Can build landing pages by adding/arranging blocks

---

## Phase 4: GrapeJS Integration (Week 4)

### 4.1 GrapeJS Setup - 12 hours

- [ ] Install GrapeJS packages
  - Core + plugins
  - **Time:** 1 hour

- [ ] Create GrapeJSEditor Component
  - React wrapper
  - Initialization config
  - **Time:** 3 hours

- [ ] Configure Panels
  - Block manager
  - Style manager
  - Layer manager
  - Device manager
  - **Time:** 2 hours

- [ ] Custom UI Integration
  - Wrap GrapeJS with our UI
  - Custom toolbar
  - Custom panels
  - **Time:** 4 hours

- [ ] Storage Integration
  - Save/load from API
  - Auto-save (debounced)
  - **Time:** 2 hours

**Deliverable:** GrapeJS basic integration
**Checkpoint:** GrapeJS editor loads and saves

---

### 4.2 Custom Blocks Integration - 16 hours

- [ ] Load Block Templates into GrapeJS
  - Fetch from database
  - Register as GrapeJS blocks
  - **Time:** 3 hours

- [ ] Convert Config Schema to Traits
  - Map our schema to GrapeJS traits
  - Handle all field types
  - **Time:** 4 hours

- [ ] Block Component Types
  - Register custom component types
  - Rendering logic
  - **Time:** 4 hours

- [ ] Block-to-HTML Conversion
  - Convert GrapeJS components to our blocks
  - Save in both formats
  - **Time:** 3 hours

- [ ] Media Library Integration
  - Custom asset manager
  - Link to our media library
  - **Time:** 2 hours

**Deliverable:** Our blocks work in GrapeJS
**Checkpoint:** Can drag our blocks into GrapeJS editor

---

### 4.3 Advanced Features - 12 hours

- [ ] Undo/Redo
  - Wire up GrapeJS UndoManager
  - Keyboard shortcuts
  - **Time:** 2 hours

- [ ] Responsive Design Tools
  - Device switcher
  - Responsive styles
  - **Time:** 3 hours

- [ ] Preview Mode
  - Full-screen preview
  - Accurate rendering
  - **Time:** 2 hours

- [ ] Export Functionality
  - Export to HTML
  - Copy HTML/CSS
  - **Time:** 2 hours

- [ ] Custom CSS/JS Injection
  - Page-level custom code
  - Block-level custom code
  - **Time:** 3 hours

**Deliverable:** Full-featured page builder
**Checkpoint:** Can build complex pages visually

---

## Phase 5: Frontend Rendering (Week 5)

### 5.1 Public Pages - 12 hours

- [ ] Landing Page Public Route
  - `/landing/[slug]` dynamic route
  - **Time:** 2 hours

- [ ] Block Rendering Engine
  - Render blocks on server-side
  - Inject config values
  - **Time:** 4 hours

- [ ] SEO Optimization
  - Meta tags from landing page
  - Open Graph tags
  - Schema.org markup
  - **Time:** 3 hours

- [ ] Performance Optimization
  - Static generation (ISR)
  - Image optimization
  - CSS/JS minification
  - **Time:** 3 hours

**Deliverable:** Published landing pages load on frontend
**Checkpoint:** Visit `/landing/test-page` and see rendered page

---

### 5.2 Templates System - 8 hours

- [ ] Landing Page Templates API
  - CRUD endpoints
  - **Time:** 3 hours

- [ ] Template Library UI
  - Browse templates
  - Preview template
  - Use template
  - **Time:** 3 hours

- [ ] Save Page as Template
  - Snapshot page + blocks
  - **Time:** 2 hours

**Deliverable:** Template system functional
**Checkpoint:** Can create page from template

---

## Phase 6: Testing & Polish (Week 6)

### 6.1 Automated Testing - 20 hours

- [ ] Write unit tests
  - Models (20 tests)
  - API routes (50 tests)
  - Utils (30 tests)
  - **Time:** 8 hours

- [ ] Write integration tests
  - Workflows (20 tests)
  - **Time:** 6 hours

- [ ] Write E2E tests
  - User journeys (15 tests)
  - **Time:** 6 hours

**Deliverable:** 80%+ test coverage
**Checkpoint:** All tests passing

---

### 6.2 Documentation - 12 hours

- [ ] Admin User Guide
  - How to create landing pages
  - How to use blocks
  - Best practices
  - **Time:** 4 hours

- [ ] Developer Documentation
  - API reference
  - Creating custom block templates
  - Architecture overview
  - **Time:** 4 hours

- [ ] Video Tutorials
  - Screen recordings
  - Walkthrough
  - **Time:** 4 hours

**Deliverable:** Complete documentation
**Checkpoint:** Users can learn the system

---

### 6.3 Polish & Bug Fixes - 8 hours

- [ ] UI/UX improvements
  - Loading states
  - Error handling
  - Empty states
  - **Time:** 3 hours

- [ ] Accessibility improvements
  - Keyboard navigation
  - ARIA labels
  - Screen reader support
  - **Time:** 3 hours

- [ ] Bug fixes from testing
  - Fix reported issues
  - **Time:** 2 hours

**Deliverable:** Production-ready system
**Checkpoint:** No critical bugs

---

## Summary

### Time Breakdown

**Phase 1 (Week 1):** 36 hours
- Database: 8h
- Seed data: 12h
- API routes: 16h

**Phase 2 (Week 2):** 28 hours
- Block templates UI: 12h
- Shared components: 8h
- Content blocks UI: 8h

**Phase 3 (Week 3):** 28 hours
- Landing pages UI: 12h
- Manual builder: 16h

**Phase 4 (Week 4):** 40 hours
- GrapeJS setup: 12h
- Custom blocks: 16h
- Advanced features: 12h

**Phase 5 (Week 5):** 20 hours
- Public pages: 12h
- Templates: 8h

**Phase 6 (Week 6):** 40 hours
- Testing: 20h
- Documentation: 12h
- Polish: 8h

**Total: 192 hours (~5 weeks at 40h/week)**

---

## Critical Path

```
Database → API → Block Templates UI → Landing Pages UI →
  Manual Builder → GrapeJS Integration → Frontend →
    Testing → Launch
```

**Minimum Viable Product (MVP):**
- Phases 1-3 only (Manual builder, no GrapeJS)
- **Time:** ~3 weeks
- Can build landing pages with blocks
- No visual drag-and-drop yet

**Full Product:**
- All 6 phases
- **Time:** ~5-6 weeks
- Complete visual page builder

---

## Risk Mitigation

### High-Risk Items

1. **GrapeJS Integration Complexity**
   - Risk: Takes longer than estimated
   - Mitigation: Build manual version first (Phase 3)
   - Fallback: Ship manual version, add GrapeJS later

2. **Block Rendering Performance**
   - Risk: Slow page loads with many blocks
   - Mitigation: Implement caching, lazy loading
   - Testing: Load test with 20+ blocks

3. **Config Schema Validation**
   - Risk: Complex schemas break rendering
   - Mitigation: Extensive validation, error boundaries
   - Testing: Test all schema field types

---

## Dependencies

### External
- GrapeJS library
- Monaco editor (for code editing)
- Existing MediaPicker component
- Existing RichTextEditor component

### Internal
- User authentication system
- Media library
- Database (Prisma + PostgreSQL)

---

## Deployment Checklist

- [ ] Database migrations applied
- [ ] Seed data loaded
- [ ] Environment variables set
- [ ] Build succeeds
- [ ] All tests pass
- [ ] Performance benchmarks met
- [ ] Security audit passed
- [ ] Accessibility audit passed
- [ ] Documentation published
- [ ] User training completed

---

## Post-Launch Tasks

### Week 7-8: Monitoring & Iteration

- [ ] Monitor error logs
- [ ] Gather user feedback
- [ ] Fix urgent bugs
- [ ] Performance optimization
- [ ] Add requested features

### Future Enhancements

- [ ] A/B testing for landing pages
- [ ] Analytics integration
- [ ] More block templates (50+ total)
- [ ] Animation blocks
- [ ] Form builder blocks
- [ ] Advanced conditional logic
- [ ] Multi-language support
- [ ] Version history (time-travel)
- [ ] Collaboration (multiple editors)

---

## Success Metrics

After 1 month:
- [ ] 20+ landing pages created
- [ ] 100+ blocks added
- [ ] 5+ custom templates
- [ ] 80%+ user satisfaction
- [ ] < 2 second page load time
- [ ] Zero critical bugs

---

**Ready to Build!** 🚀

This checklist provides a clear path from start to finish. Each checkbox can be tracked, each time estimate can be refined, and each deliverable can be demonstrated.

**Next Step:** Get approval and start Phase 1!
