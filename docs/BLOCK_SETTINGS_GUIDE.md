# Block Settings System - Developer Guide

This guide explains how to use the enhanced block settings system to create blocks with many settings organized in tabs, sections, and conditional fields.

## Overview

The enhanced `ConfigForm` component supports:
- **Tabs** - Organize settings into multiple tabs
- **Sections** - Group related fields in collapsible or simple sections
- **Conditional Fields** - Show/hide fields based on other field values
- **Multiple Field Types** - Rich text, date, number, and more
- **Better Organization** - Headings, separators, and visual grouping

## Schema Structure

### Basic Structure (Flat Fields)

For simple blocks with a few settings:

```json
{
  "configSchema": {
    "fields": [
      {
        "name": "title",
        "type": "text",
        "label": "Title",
        "required": true,
        "placeholder": "Enter title"
      },
      {
        "name": "description",
        "type": "textarea",
        "label": "Description",
        "rows": 4
      }
    ]
  }
}
```

### Tabs Structure

For blocks with many settings organized into categories:

```json
{
  "configSchema": {
    "tabs": [
      {
        "id": "content",
        "label": "Content",
        "fields": [
          {
            "name": "title",
            "type": "text",
            "label": "Title",
            "required": true
          },
          {
            "name": "description",
            "type": "richtext",
            "label": "Description"
          }
        ]
      },
      {
        "id": "style",
        "label": "Style",
        "fields": [
          {
            "name": "backgroundColor",
            "type": "color",
            "label": "Background Color"
          },
          {
            "name": "textColor",
            "type": "color",
            "label": "Text Color"
          }
        ]
      },
      {
        "id": "advanced",
        "label": "Advanced",
        "fields": [
          {
            "name": "animation",
            "type": "select",
            "label": "Animation",
            "options": [
              { "value": "none", "label": "None" },
              { "value": "fade", "label": "Fade In" },
              { "value": "slide", "label": "Slide Up" }
            ]
          }
        ]
      }
    ]
  }
}
```

### Sections Structure

For blocks with grouped settings (collapsible or simple):

```json
{
  "configSchema": {
    "sections": [
      {
        "id": "basic",
        "label": "Basic Settings",
        "description": "Configure the main content",
        "collapsible": true,
        "defaultOpen": true,
        "fields": [
          {
            "name": "title",
            "type": "text",
            "label": "Title"
          }
        ]
      },
      {
        "id": "appearance",
        "label": "Appearance",
        "description": "Customize the visual style",
        "collapsible": true,
        "defaultOpen": false,
        "fields": [
          {
            "name": "backgroundColor",
            "type": "color",
            "label": "Background Color"
          }
        ]
      }
    ]
  }
}
```

### Mixed Structure

You can also use simple sections (non-collapsible) with visual separators:

```json
{
  "configSchema": {
    "sections": [
      {
        "id": "content",
        "label": "Content",
        "fields": [
          {
            "name": "title",
            "type": "text",
            "label": "Title"
          }
        ]
      },
      {
        "id": "style",
        "label": "Style",
        "fields": [
          {
            "name": "backgroundColor",
            "type": "color",
            "label": "Background Color"
          }
        ]
      }
    ]
  }
}
```

## Conditional Fields

Show or hide fields based on other field values:

```json
{
  "name": "layout",
  "type": "select",
  "label": "Layout",
  "options": [
    { "value": "grid", "label": "Grid" },
    { "value": "list", "label": "List" }
  ]
},
{
  "name": "columns",
  "type": "number",
  "label": "Number of Columns",
  "condition": {
    "field": "layout",
    "operator": "equals",
    "value": "grid"
  }
},
{
  "name": "showImages",
  "type": "checkbox",
  "label": "Show Images",
  "condition": {
    "field": "layout",
    "operator": "equals",
    "value": "list"
  }
}
```

### Supported Condition Operators

- `equals` - Field value equals condition value
- `notEquals` - Field value does not equal condition value
- `contains` - Field value contains condition value (string)
- `notContains` - Field value does not contain condition value
- `greaterThan` - Field value is greater than condition value (number)
- `lessThan` - Field value is less than condition value (number)
- `isEmpty` - Field value is empty or null
- `isNotEmpty` - Field value is not empty
- `in` - Field value is in condition array
- `notIn` - Field value is not in condition array

## Field Types

### Basic Fields

- `text` - Single line text input
- `email` - Email input
- `url` - URL input
- `number` - Number input (use `number` type or `NumberField` component)
- `textarea` - Multi-line text input
- `richtext` - Rich text editor (TipTap)
- `date` - Date picker
- `datetime` - Date and time picker
- `time` - Time picker

### Selection Fields

- `select` - Dropdown select
- `checkbox` - Toggle/switch
- `slider` - Range slider

### Media Fields

- `image` - Image picker with media manager
- `color` - Color picker

### Complex Fields

- `repeater` - Repeatable field group

### Layout Fields

- `heading` - Section heading with optional description
- `separator` - Visual separator line

## Field Properties

### Common Properties

```json
{
  "name": "fieldName",        // Required: unique field identifier
  "type": "text",              // Required: field type
  "label": "Field Label",      // Required: display label
  "description": "Help text",  // Optional: helper text
  "required": true,            // Optional: mark as required
  "placeholder": "Hint text",  // Optional: placeholder text
  "condition": { ... }         // Optional: conditional display
}
```

### Type-Specific Properties

**Text/Textarea:**
```json
{
  "maxLength": 100,
  "rows": 4  // Textarea only
}
```

**Number:**
```json
{
  "min": 0,
  "max": 100,
  "step": 1,
  "unit": "px"
}
```

**Slider:**
```json
{
  "min": 0,
  "max": 100,
  "step": 5,
  "unit": "%"
}
```

**Select:**
```json
{
  "options": [
    { "value": "option1", "label": "Option 1" },
    { "value": "option2", "label": "Option 2" }
  ]
}
```

**Repeater:**
```json
{
  "fields": [
    { "name": "item", "type": "text", "label": "Item" }
  ],
  "itemLabel": "Item {index}"
}
```

## Complete Example

Here's a complete example of a complex block with tabs, sections, and conditional fields:

```json
{
  "name": "Advanced Hero Block",
  "category": "hero",
  "configSchema": {
    "tabs": [
      {
        "id": "content",
        "label": "Content",
        "fields": [
          {
            "type": "heading",
            "label": "Main Content",
            "description": "Configure the hero section content"
          },
          {
            "name": "title",
            "type": "text",
            "label": "Title",
            "required": true,
            "placeholder": "Enter hero title"
          },
          {
            "name": "subtitle",
            "type": "textarea",
            "label": "Subtitle",
            "rows": 3
          },
          {
            "name": "description",
            "type": "richtext",
            "label": "Description"
          },
          {
            "type": "separator"
          },
          {
            "type": "heading",
            "label": "Call to Action"
          },
          {
            "name": "showCTA",
            "type": "checkbox",
            "label": "Show Call to Action Button"
          },
          {
            "name": "ctaText",
            "type": "text",
            "label": "Button Text",
            "condition": {
              "field": "showCTA",
              "operator": "equals",
              "value": true
            }
          },
          {
            "name": "ctaLink",
            "type": "url",
            "label": "Button Link",
            "condition": {
              "field": "showCTA",
              "operator": "equals",
              "value": true
            }
          }
        ]
      },
      {
        "id": "media",
        "label": "Media",
        "fields": [
          {
            "name": "backgroundType",
            "type": "select",
            "label": "Background Type",
            "options": [
              { "value": "image", "label": "Image" },
              { "value": "video", "label": "Video" },
              { "value": "color", "label": "Color" }
            ]
          },
          {
            "name": "backgroundImage",
            "type": "image",
            "label": "Background Image",
            "condition": {
              "field": "backgroundType",
              "operator": "equals",
              "value": "image"
            }
          },
          {
            "name": "backgroundVideo",
            "type": "url",
            "label": "Background Video URL",
            "condition": {
              "field": "backgroundType",
              "operator": "equals",
              "value": "video"
            }
          },
          {
            "name": "backgroundColor",
            "type": "color",
            "label": "Background Color",
            "condition": {
              "field": "backgroundType",
              "operator": "equals",
              "value": "color"
            }
          }
        ]
      },
      {
        "id": "style",
        "label": "Style",
        "fields": [
          {
            "name": "textAlign",
            "type": "select",
            "label": "Text Alignment",
            "options": [
              { "value": "left", "label": "Left" },
              { "value": "center", "label": "Center" },
              { "value": "right", "label": "Right" }
            ]
          },
          {
            "name": "padding",
            "type": "slider",
            "label": "Padding",
            "min": 0,
            "max": 100,
            "step": 5,
            "unit": "px"
          },
          {
            "name": "textColor",
            "type": "color",
            "label": "Text Color"
          }
        ]
      },
      {
        "id": "advanced",
        "label": "Advanced",
        "fields": [
          {
            "name": "animation",
            "type": "select",
            "label": "Animation",
            "options": [
              { "value": "none", "label": "None" },
              { "value": "fade", "label": "Fade In" },
              { "value": "slide", "label": "Slide Up" }
            ]
          },
          {
            "name": "customClass",
            "type": "text",
            "label": "Custom CSS Class"
          }
        ]
      }
    ]
  }
}
```

## Best Practices

1. **Use Tabs** for blocks with 10+ settings across different categories
2. **Use Sections** for blocks with 5-15 settings that can be grouped
3. **Use Flat Fields** for simple blocks with < 5 settings
4. **Use Conditional Fields** to reduce clutter and show only relevant options
5. **Add Descriptions** to help users understand what each setting does
6. **Group Related Fields** using headings and separators
7. **Set Default Values** in `defaultConfig` for better UX
8. **Mark Required Fields** with `required: true`

## Migration Guide

### From Old Schema to New Schema

**Old (Flat):**
```json
{
  "configSchema": {
    "fields": [...]
  }
}
```

**New (Tabs):**
```json
{
  "configSchema": {
    "tabs": [
      {
        "id": "main",
        "label": "Settings",
        "fields": [...]
      }
    ]
  }
}
```

The old format still works! The system automatically detects which structure you're using.

## Settings Panel Width

The settings panel is now responsive:
- **Default:** 320px (w-80)
- **XL screens:** 384px (w-96)
- Automatically adjusts for better visibility of complex forms

