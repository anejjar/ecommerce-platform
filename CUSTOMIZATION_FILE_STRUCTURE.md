# Product Customization - File Structure

## Complete File Map

```
ecommerce-platform/
│
├── src/
│   ├── components/
│   │   ├── ProductCustomizationForm.tsx          ⭐ MAIN COMPONENT (741 lines)
│   │   │   └── Customer-facing form with all field types
│   │   │
│   │   ├── CustomizationFileUpload.tsx           ⭐ FILE UPLOAD COMPONENT (304 lines)
│   │   │   └── Drag-and-drop file upload with preview
│   │   │
│   │   ├── admin/
│   │   │   └── ProductCustomizationFields.tsx    ✅ Already exists (Admin UI)
│   │   │
│   │   ├── examples/
│   │   │   └── ProductWithCustomizationExample.tsx  📖 EXAMPLE (Complete implementation)
│   │   │
│   │   └── CUSTOMIZATION_INTEGRATION_GUIDE.md    📚 DOCUMENTATION (Detailed guide)
│   │
│   ├── types/
│   │   └── customization.ts                      🔧 TYPE DEFINITIONS (87 lines)
│   │       ├── CustomizationField
│   │       ├── CustomizationOption
│   │       ├── CustomizationValue
│   │       ├── ValidationError
│   │       └── FileUploadResponse
│   │
│   └── app/
│       └── api/
│           ├── products/
│           │   └── [id]/
│           │       └── customization-fields/
│           │           └── route.ts              ✅ Already exists (GET endpoint)
│           │
│           └── cart/
│               └── items/
│                   └── [id]/
│                       └── customizations/
│                           └── upload/
│                               └── route.ts      ✅ Already exists (POST endpoint)
│
├── PRODUCT_CUSTOMIZATION_QUICK_START.md          📖 QUICK START GUIDE
├── CUSTOMIZATION_IMPLEMENTATION_SUMMARY.md       📋 SUMMARY DOCUMENT
└── CUSTOMIZATION_FILE_STRUCTURE.md               📁 THIS FILE
```

---

## Component Hierarchy

```
ProductCustomizationForm (Main Component)
│
├── Card (shadcn/ui)
│   ├── CardHeader
│   │   ├── CardTitle
│   │   └── CardDescription
│   │
│   └── CardContent
│       ├── Field Renderers (9 types)
│       │   ├── TEXT → Input
│       │   ├── TEXTAREA → Textarea
│       │   ├── NUMBER → Input (type="number")
│       │   ├── DROPDOWN → Select
│       │   ├── RADIO → RadioGroup
│       │   ├── CHECKBOX → Checkbox
│       │   ├── COLOR → Input (type="color")
│       │   ├── FILE → CustomizationFileUpload ⬇
│       │   └── DATE → Input (type="date")
│       │
│       └── Price Summary
│           └── Total Modifier Display
│
└── CustomizationFileUpload (Sub-component)
    ├── Dropzone (react-dropzone)
    │   ├── Drag-and-drop zone
    │   ├── File validation
    │   └── Preview display
    │
    ├── Progress (shadcn/ui)
    │   └── Upload progress bar
    │
    └── Button (Remove file)
```

---

## Data Flow

```
┌─────────────────────────────────────────────────────────────┐
│                     Product Detail Page                      │
│  ┌───────────────────────────────────────────────────────┐  │
│  │         ProductCustomizationForm Component            │  │
│  │                                                       │  │
│  │  ┌─────────────────────────────────────────────┐    │  │
│  │  │  1. Fetch customization fields from API    │    │  │
│  │  │     GET /api/products/[id]/customization...│    │  │
│  │  └─────────────────────────────────────────────┘    │  │
│  │                        ↓                             │  │
│  │  ┌─────────────────────────────────────────────┐    │  │
│  │  │  2. Render appropriate field types         │    │  │
│  │  │     - TEXT, TEXTAREA, NUMBER, etc.         │    │  │
│  │  └─────────────────────────────────────────────┘    │  │
│  │                        ↓                             │  │
│  │  ┌─────────────────────────────────────────────┐    │  │
│  │  │  3. Customer fills in fields               │    │  │
│  │  │     - Real-time validation                 │    │  │
│  │  │     - Character counters                   │    │  │
│  │  │     - Error messages                       │    │  │
│  │  └─────────────────────────────────────────────┘    │  │
│  │                        ↓                             │  │
│  │  ┌─────────────────────────────────────────────┐    │  │
│  │  │  4. Calculate price modifiers              │    │  │
│  │  │     - Field-level prices                   │    │  │
│  │  │     - Option-level prices                  │    │  │
│  │  └─────────────────────────────────────────────┘    │  │
│  │                        ↓                             │  │
│  │  ┌─────────────────────────────────────────────┐    │  │
│  │  │  5. Call onCustomizationsChange callback   │    │  │
│  │  │     → (customizations, isValid, totalCost) │    │  │
│  │  └─────────────────────────────────────────────┘    │  │
│  │                                                       │  │
│  └───────────────────────────────────────────────────────┘  │
│                           ↓                                  │
│  ┌───────────────────────────────────────────────────────┐  │
│  │  Parent component receives:                          │  │
│  │  - customizations object                             │  │
│  │  - isValid boolean                                   │  │
│  │  - totalModifier number                              │  │
│  └───────────────────────────────────────────────────────┘  │
│                           ↓                                  │
│  ┌───────────────────────────────────────────────────────┐  │
│  │  Update UI:                                          │  │
│  │  - Display total price (base + modifiers)           │  │
│  │  - Enable/disable "Add to Cart" button              │  │
│  └───────────────────────────────────────────────────────┘  │
│                           ↓                                  │
│  ┌───────────────────────────────────────────────────────┐  │
│  │  Customer clicks "Add to Cart"                       │  │
│  │  → Send customizations to cart API                   │  │
│  └───────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

---

## File Upload Flow

```
┌──────────────────────────────────────────────────────────────┐
│            CustomizationFileUpload Component                  │
│                                                               │
│  ┌─────────────────────────────────────────────────┐         │
│  │  1. Customer drags/selects file                │         │
│  └─────────────────────────────────────────────────┘         │
│                        ↓                                      │
│  ┌─────────────────────────────────────────────────┐         │
│  │  2. Client-side validation                     │         │
│  │     - Check file size                          │         │
│  │     - Check file type                          │         │
│  │     - Show preview for images                  │         │
│  └─────────────────────────────────────────────────┘         │
│                        ↓                                      │
│           ┌────────────┴────────────┐                        │
│           │                         │                        │
│    No cartItemId              Has cartItemId                 │
│           │                         │                        │
│           ↓                         ↓                        │
│  ┌────────────────┐      ┌──────────────────────┐          │
│  │ Store locally  │      │ Upload to server     │          │
│  │ (temp preview) │      │ via FormData         │          │
│  └────────────────┘      └──────────────────────┘          │
│                                     ↓                        │
│                          ┌──────────────────────┐          │
│                          │ Server validates     │          │
│                          │ & uploads to         │          │
│                          │ Cloudinary           │          │
│                          └──────────────────────┘          │
│                                     ↓                        │
│                          ┌──────────────────────┐          │
│                          │ Return file URL      │          │
│                          │ and metadata         │          │
│                          └──────────────────────┘          │
│                                     ↓                        │
│  ┌─────────────────────────────────────────────────┐         │
│  │  3. Call onChange callback                     │         │
│  │     → { fileUrl, fileName }                    │         │
│  └─────────────────────────────────────────────────┘         │
│                                                               │
└──────────────────────────────────────────────────────────────┘
```

---

## State Management

```typescript
// Parent Component State
const [customizations, setCustomizations] = useState<Record<string, CustomizationValue>>({
  "field-1": { fieldId: "field-1", value: "Happy Birthday!" },
  "field-2": { fieldId: "field-2", selectedOptions: ["opt-1", "opt-2"] },
  "field-3": { fieldId: "field-3", fileUrl: "https://...", fileName: "design.png" }
});

const [isValid, setIsValid] = useState(false);
const [customizationCost, setCustomizationCost] = useState(15.00);

// ProductCustomizationForm Internal State
const [fields, setFields] = useState<CustomizationField[]>([]);
const [isLoading, setIsLoading] = useState(true);
const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
const [touchedFields, setTouchedFields] = useState<Set<string>>(new Set());
```

---

## API Endpoints Usage

### GET Customization Fields
```
URL: /api/products/[productId]/customization-fields
Method: GET
Auth: Public (no authentication required)
Response: { fields: [...], summary: {...} }

Used by: ProductCustomizationForm (on mount)
```

### POST Upload File
```
URL: /api/cart/items/[cartItemId]/customizations/upload
Method: POST
Auth: Required (session)
Body: FormData { file, fieldId }
Response: { success, customization, cloudinary }

Used by: CustomizationFileUpload (on file drop)
```

---

## Dependencies Map

```
ProductCustomizationForm
├── React (useState, useEffect, useCallback, useMemo)
├── shadcn/ui components
│   ├── Card, CardContent, CardHeader, CardTitle
│   ├── Input
│   ├── Textarea
│   ├── Label
│   ├── Checkbox
│   ├── RadioGroup, RadioGroupItem
│   └── Select, SelectContent, SelectItem, SelectTrigger, SelectValue
├── lucide-react (Loader2, DollarSign, AlertCircle)
├── react-hot-toast (toast)
├── @/lib/utils (cn)
└── CustomizationFileUpload ↓

CustomizationFileUpload
├── React (useState, useCallback)
├── react-dropzone (useDropzone)
├── shadcn/ui components
│   ├── Button
│   └── Progress
├── lucide-react (Upload, X, FileIcon, CheckCircle, AlertCircle)
├── next/image (Image)
└── @/lib/utils (cn)
```

---

## Integration Scenarios Map

```
Scenario 1: Product Detail Page
├── Product page component
└── ProductCustomizationForm
    ├── Render before "Add to Cart" button
    ├── Show total price with customizations
    └── Validate before allowing cart addition

Scenario 2: Cart Page (Editing)
├── Cart page component
└── Dialog/Modal
    └── ProductCustomizationForm
        ├── Load with initialValues
        ├── Show "Update" button
        └── Re-validate on changes

Scenario 3: Quick View Modal
├── Product card component
└── Dialog/Modal
    ├── Product images
    └── ProductCustomizationForm
        ├── Compact layout
        └── Quick add to cart
```

---

## Type Safety Map

```
customization.ts
├── CustomizationFieldType (union type)
│   └── 'TEXT' | 'TEXTAREA' | 'NUMBER' | ... (9 types)
│
├── CustomizationOption
│   ├── id: string
│   ├── label: string
│   ├── value: string
│   ├── position: number
│   └── priceModifier: number | null
│
├── CustomizationField
│   ├── id: string
│   ├── type: CustomizationFieldType
│   ├── label: string
│   ├── validation properties
│   └── options?: CustomizationOption[]
│
├── CustomizationValue
│   ├── fieldId: string
│   ├── value?: string | string[] | number | null
│   ├── fileUrl?: string | null
│   ├── fileName?: string | null
│   └── selectedOptions?: string[]
│
└── CustomizationFieldsResponse
    ├── fields: CustomizationField[]
    └── summary: CustomizationSummary
```

---

## Styling Structure

```
All components use Tailwind CSS classes

Color Palette:
├── Primary: Tailwind theme primary colors
├── Success/Green: Price modifiers, success states
├── Error/Red: Validation errors, required indicators
├── Gray: Neutral UI elements
└── Transparent overlays for loading states

Spacing:
├── Container padding: px-4, py-8
├── Component gaps: gap-2, gap-4, gap-6, gap-8
├── Card padding: p-4, p-6
└── Responsive: different spacing on mobile/desktop

Typography:
├── Headings: text-xl, text-2xl, text-3xl, text-4xl
├── Body: text-sm, text-base
├── Labels: text-sm font-medium
├── Prices: text-2xl, text-3xl font-bold
└── Errors: text-sm text-red-600

Responsive Breakpoints:
├── Mobile: < 768px
├── Tablet: 768px - 1023px
└── Desktop: >= 1024px
```

---

## Quick Reference

| File | Purpose | Size |
|------|---------|------|
| `ProductCustomizationForm.tsx` | Main form component | 741 lines |
| `CustomizationFileUpload.tsx` | File upload component | 304 lines |
| `customization.ts` | Type definitions | 87 lines |
| `ProductWithCustomizationExample.tsx` | Complete example | ~400 lines |
| `CUSTOMIZATION_INTEGRATION_GUIDE.md` | Detailed documentation | Comprehensive |
| `PRODUCT_CUSTOMIZATION_QUICK_START.md` | Quick start guide | Reference |
| `CUSTOMIZATION_IMPLEMENTATION_SUMMARY.md` | Implementation summary | Overview |

---

**Total Lines of Code:** 1,132+ (components only)
**Total Files:** 7 (3 components + 1 types + 3 docs)
**Status:** ✅ Production Ready
