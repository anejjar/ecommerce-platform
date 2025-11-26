# Enhanced Checkout Customization - Phase 1 & 2

## Overview
The enhanced checkout customization system provides comprehensive control over your checkout experience with live preview capabilities, branding options, and advanced field customization.

## Access
Navigate to: `/admin/settings/checkout-enhanced`

**Required Role:** ADMIN, SUPERADMIN, or MANAGER

## Features Implemented

### 🎨 Phase 1: Visual & Branding

#### **Brand Identity**
- **Logo Upload**: Add your store logo to the checkout header
  - Supports all image formats
  - Automatically optimized and stored in media library
  - Displays at the top of the checkout page

- **Color Customization**
  - **Primary Color**: Main color for buttons, links, and accents
  - **Secondary Color**: Color for secondary text and elements
  - Visual color picker with hex code input

- **Button Styles**
  - Rounded: Standard rounded corners (default)
  - Square: Sharp, modern edges
  - Pill: Fully rounded ends

- **Typography**
  - System Default: Uses browser default fonts
  - Inter: Clean, modern sans-serif
  - Roboto: Google's signature font
  - Open Sans: Friendly, open design

- **Page Width**
  - Narrow: Compact, focused layout
  - Normal: Balanced width (default)
  - Wide: Spacious, modern layout

#### **Layout Configuration**

- **Checkout Type**
  - Single Page: All fields on one page (faster checkout)
  - Multi-Step: Guided step-by-step process

- **Progress Indicators** (Multi-Step only)
  - Step Numbers: Numbered steps with labels
  - Progress Bar: Linear progress indicator
  - None: No indicator

- **Order Summary Position**
  - Right Sidebar: Traditional e-commerce layout
  - Above Form: Mobile-friendly top position
  - Collapsible: Expandable/collapsible summary

#### **Custom Messages**
- **Checkout Banner**
  - Display promotional or informational messages
  - Three style options: Info (Blue), Success (Green), Warning (Yellow)
  - Supports multi-line text

- **Thank You Message**
  - Custom message on order confirmation page
  - Personalize the post-purchase experience

### 🔧 Phase 2: Advanced Field Customization

#### **Field Visibility Controls**

**Standard Fields:**
- Phone Number (with required toggle)
- Company
- Address Line 2
- Order Notes (with custom label)

**Additional Fields:**
- Alternative Phone Number
- Delivery Instructions (with custom label)
- Gift Message (with custom label)
- Preferred Delivery Date

#### **Custom Fields System**

Add up to **5 custom fields** with:

**Field Types:**
- Text: Single-line text input
- Text Area: Multi-line text input
- Dropdown: Selection from predefined options
- Checkbox: Single checkbox field
- Date: Date picker

**Field Configuration:**
- Custom label
- Placeholder text
- Required/optional toggle
- Dropdown options (for select type)
- Drag-and-drop reordering

**Use Cases:**
- Business Tax ID
- Special instructions
- Gift wrapping options
- Custom product personalization
- Event-specific fields

### 👁️ Live Preview System

**Real-Time Updates:**
- See changes instantly as you configure
- No need to save first

**Responsive Preview Modes:**
- 🖥️ Desktop: Full-width preview
- 📱 Tablet: Medium-width view
- 📱 Mobile: Phone-sized preview

**Preview Features:**
- Branding visualization
- Layout preview
- Color scheme rendering
- Field order display
- Custom field rendering

### 🌍 Regions & Cities Management
(Existing feature retained)

- Manage Moroccan regions
- Add cities to regions
- Quick-add all 12 Moroccan regions

### ⚙️ Basic Settings
(Existing features retained)

- Default shipping cost
- Free shipping threshold
- Guest checkout toggle

## Usage Guide

### 1. Access the Enhanced Settings
```
/admin/settings/checkout-enhanced
```

### 2. Configure Branding
1. Click the **Branding** tab
2. Upload your logo
3. Set primary and secondary colors
4. Choose button style and font
5. Select page width
6. Watch preview update in real-time

### 3. Customize Layout
1. Click the **Layout** tab
2. Choose single-page or multi-step
3. Configure progress indicators
4. Set order summary position
5. Add custom messages

### 4. Manage Fields
1. Click the **Fields** tab
2. Toggle standard field visibility
3. Enable additional fields
4. Add custom fields (up to 5)
5. Configure field labels and placeholders
6. Drag to reorder fields

### 5. Configure Locations
1. Click the **Locations** tab
2. Manage regions and cities
3. Add/remove locations

### 6. Save Settings
- Click **Save All Settings** button (top right)
- Settings apply immediately to live checkout

## Technical Details

### Database Schema

**New Fields Added:**
```typescript
// Branding
logoUrl: string | null
primaryColor: string (default: "#000000")
secondaryColor: string (default: "#666666")
buttonStyle: "rounded" | "square" | "pill"
fontFamily: "system" | "inter" | "roboto" | "opensans"
pageWidth: "narrow" | "normal" | "wide"

// Layout
checkoutLayout: "single" | "multi-step"
progressStyle: "steps" | "bar" | "none"
orderSummaryPosition: "right" | "top" | "collapsible"

// Field Customization
fieldLabels: Json (custom labels for fields)
fieldPlaceholders: Json (custom placeholders)
fieldOrder: Json (field ordering)

// Additional Fields
showDeliveryInstructions: boolean
deliveryInstructionsLabel: string | null
showAlternativePhone: boolean
showGiftMessage: boolean
giftMessageLabel: string | null
showDeliveryDate: boolean

// Custom Fields
customFields: Json (array of custom field definitions)
```

### API Endpoints

**Get Settings:**
```
GET /api/admin/checkout-settings
```

**Update Settings:**
```
POST /api/admin/checkout-settings
Content-Type: application/json

Body: CheckoutSettings object with all fields
```

### Type Definitions

Located at: `src/types/checkout-settings.ts`

Key interfaces:
- `CheckoutSettings`: Main settings interface
- `CustomField`: Custom field definition
- `FieldLabels`: Custom labels map
- `FieldPlaceholders`: Custom placeholders map

### Components

**CheckoutPreview Component:**
- Location: `src/components/admin/CheckoutPreview.tsx`
- Props: `settings`, `viewMode`
- Features: Real-time rendering, responsive modes, style injection

**Enhanced Settings Page:**
- Location: `src/app/admin/(protected)/settings/checkout-enhanced/page.tsx`
- Features: Tabbed interface, live preview, comprehensive controls

## Best Practices

### Branding
- Use high-resolution logo (PNG with transparent background recommended)
- Ensure color contrast meets accessibility standards
- Test colors on both light and dark backgrounds
- Keep consistent with your main store branding

### Layout
- Single-page checkout typically has higher conversion rates
- Multi-step is better for complex checkouts with many fields
- Mobile users prefer collapsible order summary

### Custom Fields
- Only add fields that are absolutely necessary
- Use clear, concise labels
- Provide helpful placeholder text
- Mark only critical fields as required
- Keep total checkout fields under 15 for best conversion

### Field Order
- Place most important fields first
- Group related fields together
- Put optional fields at the end
- Test different orders with real users

## Migration from Basic Settings

If you were using the basic checkout settings:

1. All existing settings are preserved
2. New fields have sensible defaults
3. No data loss occurs
4. You can continue using the basic settings page at `/admin/settings/checkout`
5. Enhanced settings page has all basic features plus new ones

## Future Enhancements (Planned)

### Phase 3: Payment & Shipping (Coming Soon)
- Payment method icons
- Shipping method customization
- Express checkout buttons

### Phase 4: Trust & Security
- Trust badge uploads
- Security seals
- Customer testimonials

### Phase 5: Marketing & Conversion
- Upsell recommendations
- Countdown timers
- Scarcity messaging

### Phase 6: Analytics & Testing
- A/B testing capabilities
- Conversion funnel tracking
- Field abandonment analytics

## Troubleshooting

### Changes Not Appearing
1. Hard refresh your browser (Ctrl+F5)
2. Clear browser cache
3. Check browser console for errors
4. Verify settings were saved successfully

### Logo Not Displaying
1. Ensure image file is under 5MB
2. Use supported formats (PNG, JPG, GIF, WebP)
3. Check media upload permissions
4. Verify URL is accessible

### Custom Fields Not Showing
1. Ensure "Save All Settings" was clicked
2. Check that field is not hidden by conditional logic
3. Verify custom field has a label
4. Clear checkout form cache

### Preview Not Updating
1. Toggle preview off and back on
2. Refresh the page
3. Check browser console for JavaScript errors

## Support

For issues or questions:
1. Check this documentation
2. Review browser console for errors
3. Test with different browsers
4. Contact development team

## Changelog

### v2.0.0 - Enhanced Checkout (Current)
- ✅ Phase 1: Visual & Branding complete
- ✅ Phase 2: Field Customization complete
- ✅ Live preview system
- ✅ Responsive preview modes
- ✅ Custom fields (up to 5)
- ✅ Field reordering
- ✅ Additional standard fields

### v1.0.0 - Basic Checkout
- Basic field visibility toggles
- Custom messages
- Shipping settings
- Regions & cities management

---

**Built with:** Next.js, React, TypeScript, Prisma, Tailwind CSS
**Last Updated:** 2025
