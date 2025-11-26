# Checkout Settings Refactoring Plan

## Current State
- `/admin/settings/checkout` - Basic version (12 features)
- `/admin/settings/checkout-enhanced` - Premium version (49 features)
- Preview is side-by-side

## Desired State
- Single page: `/admin/settings/checkout`
- Basic settings always visible
- Premium sections shown with feature flag check
- Preview opens in a modal dialog

## Implementation Steps

###  1. Create Unified Page Structure
- Copy checkout-enhanced to checkout
- Remove redirect logic (lines 87-91, 95-97)
- Change featureEnabled check to just set state (no redirect)
- Keep data fetching for all users

### 2. Convert Preview to Modal
- Import Dialog components from '@/components/ui/dialog'
- Replace side-by-side grid with single column
- Wrap CheckoutPreview in Dialog component
- Preview button opens modal

### 3. Make Premium Sections Conditional
- Wrap premium tabs with feature flag check
- Show "PRO" badge on locked sections
- Basic tabs always visible: Customization, Locations
- Premium tabs conditional: Branding, Layout, Fields, Trust, Marketing

### 4. Update Navigation
- Settings page always links to `/admin/settings/checkout`
- Remove conditional routing logic

### 5. Cleanup
- Delete `/admin/settings/checkout-enhanced` folder
- Update any imports/references

## Key Changes to Make

### File: checkout/page.tsx (new unified version)

```typescript
// Remove this redirect logic:
if (!isEnabled) {
  toast.error('Premium checkout customization is not enabled');
  router.push('/admin/settings/checkout');
}

// Keep feature flag check but don't redirect:
const isEnabled = data.features?.includes('checkout_customization');
setFeatureEnabled(isEnabled);

// Change preview from side-by-side to modal:
<Dialog open={showPreview} onOpenChange={setShowPreview}>
  <DialogContent className="max-w-[90vw] h-[90vh]">
    <CheckoutPreview settings={settings} previewMode={previewMode} />
  </DialogContent>
</Dialog>

// Make premium tabs conditional:
{featureEnabled && (
  <>
    <TabsTrigger value="branding">Branding <Badge>PRO</Badge></TabsTrigger>
    <TabsTrigger value="trust">Trust</TabsTrigger>
    <TabsTrigger value="marketing">Marketing</TabsTrigger>
  </>
)}
```

Would you like me to proceed with this refactoring?
