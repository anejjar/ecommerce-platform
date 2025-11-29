# CMS Page Builder - Testing Strategy

## Overview

This document outlines the testing strategy for the CMS Page Builder feature. Tests should be implemented using a combination of unit tests, integration tests, and E2E tests.

## Test Framework Setup

### Recommended Tools
- **Unit/Integration**: Jest + React Testing Library
- **E2E**: Playwright or Cypress
- **API Testing**: Supertest

### Setup Commands

```bash
# Install dependencies
npm install --save-dev @testing-library/react @testing-library/jest-dom jest jest-environment-jsdom
npm install --save-dev @playwright/test  # or cypress

# Run tests
npm test              # Unit/Integration tests
npm run test:e2e      # E2E tests
```

## Unit Tests

### Hook Tests (`usePageEditor`)

**File**: `src/hooks/__tests__/usePageEditor.test.ts`

```typescript
describe('usePageEditor', () => {
    it('initializes with provided blocks', () => {
        // Test initial state
    });
    
    it('adds block to canvas', () => {
        // Test addBlock function
    });
    
    it('updates block config', () => {
        // Test updateBlockConfig
    });
    
    it('removes block', () => {
        // Test removeBlock
    });
    
    it('reorders blocks', () => {
        // Test reorderBlocks
    });
    
    it('saves page', async () => {
        // Test savePage
    });
    
    it('undo/redo functionality', () => {
        // Test undo/redo
    });
    
    it('auto-save triggers after delay', () => {
        // Test auto-save
    });
});
```

### Component Tests

**File**: `src/components/admin/cms/editor/__tests__/EditorLayout.test.tsx`

```typescript
describe('EditorLayout', () => {
    it('renders three panels', () => {
        // Test layout structure
    });
    
    it('opens settings panel on block select', () => {
        // Test panel interaction
    });
    
    it('handles keyboard shortcuts', () => {
        // Test Ctrl+S, Ctrl+Z, etc.
    });
});
```

**File**: `src/components/admin/cms/editor/__tests__/Canvas.test.tsx`

```typescript
describe('Canvas', () => {
    it('renders blocks', () => {
        // Test block rendering
    });
    
    it('handles drag and drop', () => {
        // Test dnd-kit integration
    });
    
    it('shows empty state', () => {
        // Test empty state
    });
});
```

### Block Component Tests

**File**: `src/components/landing-page/blocks/__tests__/HeroBackgroundImage.test.tsx`

```typescript
describe('HeroBackgroundImage', () => {
    it('renders with default config', () => {
        // Test default rendering
    });
    
    it('renders with custom config', () => {
        // Test custom props
    });
    
    it('handles missing config gracefully', () => {
        // Test error handling
    });
    
    it('is responsive', () => {
        // Test responsive behavior
    });
});
```

## Integration Tests

### API Route Tests

**File**: `src/app/api/admin/landing-pages/__tests__/route.test.ts`

```typescript
describe('Landing Pages API', () => {
    it('creates landing page', async () => {
        // Test POST /api/admin/landing-pages
    });
    
    it('lists landing pages', async () => {
        // Test GET /api/admin/landing-pages
    });
    
    it('updates landing page', async () => {
        // Test PUT /api/admin/landing-pages/:id
    });
    
    it('deletes landing page', async () => {
        // Test DELETE /api/admin/landing-pages/:id
    });
    
    it('syncs blocks', async () => {
        // Test POST /api/admin/landing-pages/:id/sync-blocks
    });
});
```

### Form Integration Tests

**File**: `src/components/landing-page/blocks/__tests__/ContactForm.integration.test.tsx`

```typescript
describe('ContactForm Integration', () => {
    it('submits form data', async () => {
        // Test form submission
    });
    
    it('validates required fields', async () => {
        // Test validation
    });
    
    it('shows success message', async () => {
        // Test success state
    });
    
    it('handles errors', async () => {
        // Test error handling
    });
});
```

## E2E Tests

### Complete Workflow Tests

**File**: `e2e/cms-page-builder.spec.ts`

```typescript
import { test, expect } from '@playwright/test';

test.describe('CMS Page Builder', () => {
    test.beforeEach(async ({ page }) => {
        // Login as admin
        await page.goto('/admin/login');
        // ... login steps
    });
    
    test('creates and publishes landing page', async ({ page }) => {
        // 1. Navigate to landing pages
        await page.goto('/admin/cms/landing-pages');
        
        // 2. Create new page
        await page.click('text=Create New Page');
        await page.fill('input[name="title"]', 'Test Page');
        await page.click('button:has-text("Create")');
        
        // 3. Add blocks
        await page.click('[data-block="hero-background-image"]');
        await page.click('[data-block="features-grid"]');
        
        // 4. Configure blocks
        await page.click('[data-block-id]').first();
        await page.fill('input[name="heading"]', 'Test Heading');
        
        // 5. Save page
        await page.click('button:has-text("Save Changes")');
        await expect(page.locator('text=Page saved successfully')).toBeVisible();
        
        // 6. Publish page
        await page.click('button:has-text("Page Settings")');
        await page.selectOption('select[name="status"]', 'PUBLISHED');
        await page.click('button:has-text("Save Changes")');
        
        // 7. Verify published page
        await page.goto('/landing/test-page');
        await expect(page.locator('h1')).toContainText('Test Heading');
    });
    
    test('undo/redo functionality', async ({ page }) => {
        // Test undo/redo workflow
    });
    
    test('block duplication', async ({ page }) => {
        // Test block duplication
    });
    
    test('drag and drop reordering', async ({ page }) => {
        // Test drag and drop
    });
    
    test('auto-save functionality', async ({ page }) => {
        // Test auto-save
    });
    
    test('form submission', async ({ page }) => {
        // Test contact form submission
    });
});
```

## Test Coverage Goals

- **Unit Tests**: 80%+ coverage
- **Integration Tests**: All API routes
- **E2E Tests**: Critical user workflows

## Running Tests

```bash
# Unit tests with coverage
npm test -- --coverage

# Watch mode
npm test -- --watch

# E2E tests
npm run test:e2e

# All tests
npm run test:all
```

## Continuous Integration

Add to CI/CD pipeline:

```yaml
# .github/workflows/test.yml
- name: Run tests
  run: |
    npm test
    npm run test:e2e
```

## Notes

- Tests should be isolated and not depend on external services
- Mock API calls in unit tests
- Use test database for integration tests
- Clean up test data after each test
- Use fixtures for common test data

