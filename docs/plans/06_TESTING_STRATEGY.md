# Testing Strategy - CMS Page Builder

## Overview
Comprehensive testing strategy for Dynamic Content Blocks and Visual Landing Page Builder system.

**Testing Pyramid:**
```
         /\
        /E2E\        ← Few (10-15 tests)
       /──────\
      /  INT   \     ← Some (30-40 tests)
     /──────────\
    /    UNIT    \   ← Many (100+ tests)
   /──────────────\
```

---

## 1. Unit Tests

### 1.1 Database Models

**Test File:** `__tests__/models/blockTemplate.test.ts`

```typescript
describe('BlockTemplate Model', () => {
  test('should create valid block template', async () => {
    const template = await prisma.blockTemplate.create({
      data: {
        name: 'Test Hero',
        slug: 'test-hero',
        category: 'HERO',
        defaultConfig: {},
        configSchema: {},
        componentCode: '<div>...</div>',
      },
    })

    expect(template.id).toBeDefined()
    expect(template.slug).toBe('test-hero')
  })

  test('should enforce unique slug', async () => {
    await expect(
      prisma.blockTemplate.create({
        data: {
          name: 'Duplicate',
          slug: 'test-hero', // Already exists
          // ...
        },
      })
    ).rejects.toThrow()
  })

  test('should validate required fields', async () => {
    await expect(
      prisma.blockTemplate.create({
        data: {
          name: 'Invalid',
          // Missing slug, category, etc.
        } as any,
      })
    ).rejects.toThrow()
  })

  test('should cascade delete block instances', async () => {
    const template = await createTestTemplate()
    const block = await createTestBlock({ templateId: template.id })

    await prisma.blockTemplate.delete({ where: { id: template.id } })

    const deletedBlock = await prisma.contentBlock.findUnique({
      where: { id: block.id },
    })
    expect(deletedBlock).toBeNull()
  })
})
```

**Similar tests for:**
- `ContentBlock` model
- `LandingPage` model
- `LandingPageTemplate` model

**Total: ~20 unit tests for models**

---

### 1.2 API Route Handlers

**Test File:** `__tests__/api/blocks/templates.test.ts`

```typescript
describe('GET /api/admin/blocks/templates', () => {
  test('should list all active templates', async () => {
    await createTestTemplate({ isActive: true })
    await createTestTemplate({ isActive: false })

    const response = await testRequest
      .get('/api/admin/blocks/templates')
      .set('Authorization', `Bearer ${adminToken}`)

    expect(response.status).toBe(200)
    expect(response.body.templates).toHaveLength(1)
  })

  test('should filter by category', async () => {
    await createTestTemplate({ category: 'HERO' })
    await createTestTemplate({ category: 'CTA' })

    const response = await testRequest
      .get('/api/admin/blocks/templates?category=HERO')
      .set('Authorization', `Bearer ${adminToken}`)

    expect(response.body.templates).toHaveLength(1)
    expect(response.body.templates[0].category).toBe('HERO')
  })

  test('should require authentication', async () => {
    const response = await testRequest.get('/api/admin/blocks/templates')
    expect(response.status).toBe(401)
  })

  test('should require admin role', async () => {
    const response = await testRequest
      .get('/api/admin/blocks/templates')
      .set('Authorization', `Bearer ${viewerToken}`)

    expect(response.status).toBe(403)
  })

  test('should paginate results', async () => {
    // Create 25 templates
    for (let i = 0; i < 25; i++) {
      await createTestTemplate({ name: `Template ${i}` })
    }

    const response = await testRequest
      .get('/api/admin/blocks/templates?page=1&limit=20')
      .set('Authorization', `Bearer ${adminToken}`)

    expect(response.body.templates).toHaveLength(20)
    expect(response.body.pagination.totalPages).toBe(2)
  })
})

describe('POST /api/admin/blocks/templates', () => {
  test('should create new template', async () => {
    const response = await testRequest
      .post('/api/admin/blocks/templates')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        name: 'New Hero',
        slug: 'new-hero',
        category: 'HERO',
        defaultConfig: { heading: 'Test' },
        configSchema: { fields: [] },
        componentCode: '<div>Test</div>',
      })

    expect(response.status).toBe(201)
    expect(response.body.slug).toBe('new-hero')
  })

  test('should validate required fields', async () => {
    const response = await testRequest
      .post('/api/admin/blocks/templates')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        name: 'Invalid',
        // Missing required fields
      })

    expect(response.status).toBe(400)
    expect(response.body.error).toContain('validation')
  })

  test('should reject duplicate slug', async () => {
    await createTestTemplate({ slug: 'existing' })

    const response = await testRequest
      .post('/api/admin/blocks/templates')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        name: 'Duplicate',
        slug: 'existing',
        // ...
      })

    expect(response.status).toBe(409)
  })
})
```

**Test all endpoints:**
- Block Templates: GET, POST, PUT, DELETE (x5 operations)
- Content Blocks: GET, POST, PUT, DELETE, Reorder (x7)
- Landing Pages: GET, POST, PUT, DELETE, Publish, Duplicate (x10)
- Landing Page Templates: GET, POST, Use (x3)

**Total: ~50 API unit tests**

---

### 1.3 Utility Functions

**Test File:** `__tests__/utils/blockRenderer.test.ts`

```typescript
describe('renderBlockToHTML', () => {
  test('should render block with config values', () => {
    const block = {
      template: {
        componentCode: '<h1>{{heading}}</h1>',
      },
      config: {
        heading: 'Test Heading',
      },
    }

    const html = renderBlockToHTML(block)
    expect(html).toBe('<h1>Test Heading</h1>')
  })

  test('should handle missing config values', () => {
    const block = {
      template: {
        componentCode: '<h1>{{heading}}</h1>',
        defaultConfig: { heading: 'Default' },
      },
      config: {},
    }

    const html = renderBlockToHTML(block)
    expect(html).toBe('<h1>Default</h1>')
  })

  test('should escape HTML in user input', () => {
    const block = {
      template: {
        componentCode: '<p>{{text}}</p>',
      },
      config: {
        text: '<script>alert("xss")</script>',
      },
    }

    const html = renderBlockToHTML(block)
    expect(html).not.toContain('<script>')
    expect(html).toContain('&lt;script&gt;')
  })
})

describe('convertConfigSchemaToGrapesJSTraits', () => {
  test('should convert text field', () => {
    const schema = {
      fields: [
        {
          name: 'heading',
          type: 'text',
          label: 'Heading',
        },
      ],
    }

    const traits = convertConfigSchemaToGrapesJSTraits(schema)
    expect(traits[0]).toMatchObject({
      name: 'heading',
      type: 'text',
      label: 'Heading',
    })
  })

  test('should convert select field', () => {
    const schema = {
      fields: [
        {
          name: 'alignment',
          type: 'select',
          options: [
            { value: 'left', label: 'Left' },
            { value: 'right', label: 'Right' },
          ],
        },
      ],
    }

    const traits = convertConfigSchemaToGrapesJSTraits(schema)
    expect(traits[0].type).toBe('select')
    expect(traits[0].options).toHaveLength(2)
  })
})
```

**Test Files:**
- `blockRenderer.test.ts`
- `configValidator.test.ts`
- `slugGenerator.test.ts`
- `blockConverter.test.ts`

**Total: ~30 utility tests**

---

## 2. Integration Tests

### 2.1 Full Workflow Tests

**Test File:** `__tests__/integration/landingPageWorkflow.test.ts`

```typescript
describe('Landing Page Creation Workflow', () => {
  test('should create landing page with blocks', async () => {
    // 1. Create landing page
    const pageResponse = await testRequest
      .post('/api/admin/landing-pages')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        title: 'Test Page',
        slug: 'test-page',
        status: 'DRAFT',
      })

    const pageId = pageResponse.body.id

    // 2. Add hero block
    const heroTemplate = await createTestTemplate({ category: 'HERO' })
    const block1Response = await testRequest
      .post('/api/admin/blocks')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        templateId: heroTemplate.id,
        landingPageId: pageId,
        config: { heading: 'Hero Title' },
        order: 0,
      })

    // 3. Add CTA block
    const ctaTemplate = await createTestTemplate({ category: 'CTA' })
    const block2Response = await testRequest
      .post('/api/admin/blocks')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        templateId: ctaTemplate.id,
        landingPageId: pageId,
        config: { heading: 'CTA Title' },
        order: 1,
      })

    // 4. Reorder blocks
    await testRequest
      .post('/api/admin/blocks/reorder')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        landingPageId: pageId,
        blockOrders: [
          { blockId: block2Response.body.id, order: 0 },
          { blockId: block1Response.body.id, order: 1 },
        ],
      })

    // 5. Publish page
    await testRequest
      .post(`/api/admin/landing-pages/${pageId}/publish`)
      .set('Authorization', `Bearer ${adminToken}`)

    // 6. Verify published page
    const publishedResponse = await testRequest.get(
      `/api/landing-pages/test-page`
    )

    expect(publishedResponse.status).toBe(200)
    expect(publishedResponse.body.blocks).toHaveLength(2)
    expect(publishedResponse.body.blocks[0].order).toBe(0)
  })
})
```

**More Integration Tests:**
- Block template duplication
- Page duplication
- Save page as template
- Use template to create page
- Block visibility toggling
- Responsive hiding (mobile/tablet/desktop)
- Landing page scheduling

**Total: ~20 integration tests**

---

### 2.2 Database Transaction Tests

```typescript
describe('Database Transactions', () => {
  test('should rollback on error', async () => {
    const pageId = await createTestPage()

    // Try to add block with invalid template
    await expect(
      testRequest
        .post('/api/admin/blocks')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          templateId: 'invalid-id',
          landingPageId: pageId,
          config: {},
        })
    ).rejects.toThrow()

    // Verify no orphaned data
    const blocks = await prisma.contentBlock.findMany({
      where: { landingPageId: pageId },
    })
    expect(blocks).toHaveLength(0)
  })
})
```

---

## 3. End-to-End (E2E) Tests

### 3.1 User Journey Tests

**Test File:** `e2e/landing-page-builder.spec.ts` (Playwright)

```typescript
import { test, expect } from '@playwright/test'

test.describe('Landing Page Builder', () => {
  test.beforeEach(async ({ page }) => {
    // Login as admin
    await page.goto('/auth/signin')
    await page.fill('[name="email"]', 'admin@test.com')
    await page.fill('[name="password"]', 'password')
    await page.click('button[type="submit"]')
    await page.waitForURL('/admin')
  })

  test('should create landing page from scratch', async ({ page }) => {
    // Navigate to landing pages
    await page.click('text=Landing Pages')
    await page.waitForURL('/admin/landing-pages')

    // Click new page button
    await page.click('text=New Landing Page')

    // Fill in details
    await page.fill('[name="title"]', 'E2E Test Page')
    await page.fill('[name="slug"]', 'e2e-test-page')
    await page.click('text=Create')

    // Wait for builder to load
    await page.waitForURL(/\/admin\/landing-pages\/.*\/edit/)

    // Add hero block
    await page.click('text=Hero Section')
    await page.waitForSelector('.gjs-block')

    // Configure block
    await page.click('.gjs-block')
    await page.fill('[name="heading"]', 'Test Heading')
    await page.click('text=Update')

    // Add CTA block
    await page.click('text=CTA Banner')
    await page.waitForSelector('.gjs-block:nth-child(2)')

    // Save
    await page.click('text=Save')
    await page.waitForSelector('text=Saved')

    // Publish
    await page.click('text=Publish')
    await page.waitForSelector('text=Published')

    // Verify on frontend
    await page.goto('/landing/e2e-test-page')
    await expect(page.locator('h1')).toContainText('Test Heading')
  })

  test('should preview in different device sizes', async ({ page }) => {
    const pageId = await createTestPageViaAPI()
    await page.goto(`/admin/landing-pages/${pageId}/edit`)

    // Desktop preview (default)
    await expect(page.locator('#gjs-editor')).toHaveCSS('width', '100%')

    // Tablet preview
    await page.click('[data-device="tablet"]')
    await page.waitForTimeout(500)
    await expect(page.locator('#gjs-editor')).toHaveCSS('width', '768px')

    // Mobile preview
    await page.click('[data-device="mobile"]')
    await page.waitForTimeout(500)
    await expect(page.locator('#gjs-editor')).toHaveCSS('width', '375px')
  })

  test('should drag and reorder blocks', async ({ page }) => {
    const pageId = await createTestPageViaAPI()
    await addTestBlocksViaAPI(pageId, 3)
    await page.goto(`/admin/landing-pages/${pageId}/edit`)

    // Get initial order
    const firstBlock = page.locator('.gjs-block').first()
    const firstBlockText = await firstBlock.textContent()

    // Drag first block to last position
    const lastBlock = page.locator('.gjs-block').last()
    await firstBlock.dragTo(lastBlock)

    // Verify new order
    const newFirstBlock = page.locator('.gjs-block').first()
    const newFirstBlockText = await newFirstBlock.textContent()
    expect(newFirstBlockText).not.toBe(firstBlockText)
  })

  test('should save and restore editor state', async ({ page }) => {
    const pageId = await createTestPageViaAPI()
    await page.goto(`/admin/landing-pages/${pageId}/edit`)

    // Add block and configure
    await page.click('text=Hero Section')
    await page.fill('[name="heading"]', 'Restored Heading')
    await page.click('text=Save')
    await page.waitForSelector('text=Saved')

    // Close and reopen
    await page.goto('/admin/landing-pages')
    await page.click(`[href="/admin/landing-pages/${pageId}/edit"]`)

    // Verify content restored
    await expect(page.locator('[name="heading"]')).toHaveValue(
      'Restored Heading'
    )
  })

  test('should handle undo/redo', async ({ page }) => {
    const pageId = await createTestPageViaAPI()
    await page.goto(`/admin/landing-pages/${pageId}/edit`)

    // Add block
    await page.click('text=Hero Section')

    // Delete block
    await page.click('.gjs-block')
    await page.keyboard.press('Delete')

    // Undo delete (Ctrl+Z)
    await page.keyboard.press('Control+Z')
    await expect(page.locator('.gjs-block')).toBeVisible()

    // Redo delete (Ctrl+Shift+Z)
    await page.keyboard.press('Control+Shift+Z')
    await expect(page.locator('.gjs-block')).not.toBeVisible()
  })
})
```

**More E2E Tests:**
- Create page from template
- Duplicate page
- Save page as template
- Publish/unpublish workflow
- SEO settings
- Custom CSS injection
- Media library integration
- Block visibility rules

**Total: ~15 E2E tests**

---

## 4. Performance Tests

### 4.1 Load Testing

```typescript
import autocannon from 'autocannon'

describe('Performance Tests', () => {
  test('should handle concurrent page loads', async () => {
    const result = await autocannon({
      url: 'http://localhost:3000/api/landing-pages/test-page',
      connections: 100,
      duration: 30, // 30 seconds
    })

    expect(result.requests.average).toBeGreaterThan(100) // 100 req/sec minimum
    expect(result.errors).toBe(0)
  })

  test('should load page builder in under 3 seconds', async () => {
    const start = Date.now()
    await page.goto('/admin/landing-pages/123/edit')
    await page.waitForSelector('#gjs-editor')
    const loadTime = Date.now() - start

    expect(loadTime).toBeLessThan(3000)
  })
})
```

---

## 5. Accessibility Tests

### 5.1 WCAG Compliance

```typescript
import { injectAxe, checkA11y } from 'axe-playwright'

test('should be accessible', async ({ page }) => {
  await page.goto('/admin/landing-pages')
  await injectAxe(page)

  const results = await checkA11y(page)
  expect(results.violations).toHaveLength(0)
})
```

---

## 6. Security Tests

### 6.1 Authorization Tests

```typescript
describe('Security Tests', () => {
  test('should prevent unauthorized access', async () => {
    const response = await testRequest
      .get('/api/admin/landing-pages')
      .set('Authorization', 'Bearer invalid-token')

    expect(response.status).toBe(401)
  })

  test('should prevent non-admin from creating pages', async () => {
    const response = await testRequest
      .post('/api/admin/landing-pages')
      .set('Authorization', `Bearer ${customerToken}`)
      .send({ title: 'Hack', slug: 'hack' })

    expect(response.status).toBe(403)
  })

  test('should sanitize HTML input', async () => {
    const response = await testRequest
      .post('/api/admin/blocks')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        templateId: templateId,
        landingPageId: pageId,
        config: {
          heading: '<script>alert("xss")</script>',
        },
      })

    const block = await prisma.contentBlock.findUnique({
      where: { id: response.body.id },
    })

    // Should be escaped
    expect(block.config.heading).not.toContain('<script>')
  })

  test('should prevent SQL injection', async () => {
    const response = await testRequest.get(
      `/api/landing-pages/'; DROP TABLE LandingPage; --`
    )

    expect(response.status).toBe(404) // Not found, not error
    // Verify table still exists
    const count = await prisma.landingPage.count()
    expect(count).toBeGreaterThanOrEqual(0)
  })
})
```

---

## 7. Visual Regression Tests

```typescript
test('should match screenshot', async ({ page }) => {
  await page.goto('/landing/test-page')
  await expect(page).toHaveScreenshot('landing-page.png')
})
```

---

## 8. Test Coverage Goals

```
Overall:        > 80%
API Routes:     > 90%
Models:         > 95%
Utils:          > 85%
Components:     > 75%
E2E:            Critical paths covered
```

---

## 9. Continuous Integration

### 9.1 GitHub Actions Workflow

```yaml
name: Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: 18

      - name: Install dependencies
        run: npm ci

      - name: Run unit tests
        run: npm test

      - name: Run integration tests
        run: npm run test:integration

      - name: Run E2E tests
        run: npm run test:e2e

      - name: Upload coverage
        uses: codecov/codecov-action@v3
```

---

## 10. Test Data Factories

```typescript
// test/factories/blockTemplate.factory.ts
export function createTestTemplate(overrides = {}) {
  return prisma.blockTemplate.create({
    data: {
      name: faker.lorem.words(3),
      slug: faker.helpers.slugify(faker.lorem.words(3)),
      category: 'HERO',
      defaultConfig: {},
      configSchema: { fields: [] },
      componentCode: '<div>Test</div>',
      isActive: true,
      ...overrides,
    },
  })
}
```

---

## Summary

**Total Tests:** ~200+

**Breakdown:**
- Unit Tests: ~100 tests
  - Models: 20
  - API Routes: 50
  - Utils: 30
- Integration Tests: ~20 tests
- E2E Tests: ~15 tests
- Performance: ~5 tests
- Security: ~10 tests
- Accessibility: ~5 tests
- Visual Regression: ~5 tests

**Tools:**
- Jest (unit/integration)
- Playwright (E2E)
- Axe (accessibility)
- Autocannon (load testing)
- Percy/Chromatic (visual regression)

**Coverage Target:** 80%+

**Next:** Implementation Checklist →
