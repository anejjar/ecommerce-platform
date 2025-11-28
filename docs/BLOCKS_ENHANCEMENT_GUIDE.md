# Page Builder Blocks Enhancement Guide

This guide explains the new essential blocks and enhanced settings system for the page builder.

## 🎉 What's New

### New Block Categories Added
- **NAVIGATION** - Navigation bars and menus
- **HEADER** - Page headers with breadcrumbs
- **FOOTER** - Site footers with columns and links
- **SOCIAL** - Social media links
- **BREADCRUMBS** - Navigation breadcrumbs
- **DIVIDER** - Visual separators
- **SPACER** - Whitespace/spacing blocks

### Enhanced Settings System
All blocks now support:
- **Tabs** - Organize settings into multiple tabs (Content, Style, Layout, etc.)
- **Sections** - Group related fields in collapsible sections
- **Conditional Fields** - Show/hide fields based on other field values
- **Rich Text Editor** - For formatted content
- **More Field Types** - Date, number, rich text, and more

## 📦 New Essential Blocks

### 1. Navigation Bar
**Slug:** `navigation-bar`  
**Category:** NAVIGATION

A responsive navigation bar with:
- Logo (image or text)
- Menu items (links, dropdowns, buttons)
- CTA button
- Sticky navigation option
- Mobile menu styles (hamburger, fullscreen, sidebar)

**Settings Tabs:**
- Content (logo, menu items, CTA)
- Style (colors, sticky option)
- Mobile (menu style, breakpoint)

### 2. Page Header
**Slug:** `page-header`  
**Category:** HEADER

Page header with:
- Title and subtitle
- Optional breadcrumbs
- Background image/color
- Customizable padding and alignment

**Settings Tabs:**
- Content (title, subtitle, breadcrumbs)
- Style (background, colors, alignment)
- Layout (padding)

### 3. Footer
**Slug:** `footer`  
**Category:** FOOTER

Site footer with:
- Multiple columns with links
- Social media links
- Copyright text
- Customizable colors

**Settings Tabs:**
- Content (columns, social links, copyright)
- Style (colors)

### 4. Social Media Links
**Slug:** `social-links`  
**Category:** SOCIAL

Social media icon links with:
- Multiple platforms (Facebook, Twitter, Instagram, LinkedIn, YouTube, GitHub, TikTok, Pinterest, Snapchat)
- Horizontal, vertical, or grid layouts
- Customizable icon size and colors
- Optional labels

**Settings Tabs:**
- Content (social links)
- Style (layout, colors, spacing)

### 5. Breadcrumbs
**Slug:** `breadcrumbs`  
**Category:** BREADCRUMBS

Navigation breadcrumbs with:
- Custom breadcrumb items
- Multiple separator styles (/, >, •, →, |)
- Home icon option
- Customizable colors

**Settings Tabs:**
- Content (breadcrumb items)
- Style (separator, colors)

### 6. Divider / Separator
**Slug:** `divider`  
**Category:** DIVIDER

Visual divider line with:
- Multiple line styles (solid, dashed, dotted, double, gradient)
- Customizable color, width, and thickness
- Alignment options
- Vertical spacing control

**Settings Tabs:**
- Style (line style, colors, dimensions, alignment)

### 7. Spacer / Whitespace
**Slug:** `spacer`  
**Category:** SPACER

Vertical spacing block with:
- Customizable height
- Separate mobile height
- Optional background color

**Settings Tabs:**
- Layout (heights, background)

### 8. Video Player
**Slug:** `video-player`  
**Category:** VIDEO

Video embed block with:
- YouTube, Vimeo, direct URL, or self-hosted videos
- Autoplay, loop, muted, controls options
- Custom aspect ratios
- Poster image support

**Settings Tabs:**
- Content (video URL, type, poster)
- Settings (autoplay, loop, controls)
- Style (aspect ratio, dimensions, border radius)

### 9. Text Content
**Slug:** `text-content`  
**Category:** CONTENT

Rich text content block with:
- Full rich text editor
- Customizable max width
- Text alignment options
- Custom colors and padding

**Settings Tabs:**
- Content (rich text editor)
- Style (layout, colors, padding)

## 🔧 Enhanced Existing Blocks

All existing blocks have been enhanced with:

### Hero Blocks
- **Tabs:** Content, Media, Style, Layout
- **New Fields:** Rich text description, overlay controls, advanced layout options
- **Conditional Fields:** Secondary CTA shows/hides based on text input

### Features Blocks
- **Tabs:** Content, Layout, Style
- **New Fields:** Icon images, feature links, card styling options
- **Enhanced:** Better column control, gap spacing, card customization

### CTA Blocks
- **Tabs:** Content, Style, Layout
- **New Fields:** Background images, overlay controls, secondary CTA
- **Enhanced:** Better button styling, alignment options

### Testimonials Blocks
- **Tabs:** Content, Carousel, Style
- **New Fields:** Ratings, carousel controls, autoplay settings
- **Enhanced:** Better testimonial management, carousel customization

### Pricing Blocks
- **Tabs:** Content, Style, Layout
- **New Fields:** Plan features with included/excluded toggle
- **Enhanced:** Better plan management, highlighted plan styling

### FAQ Blocks
- **Tabs:** Content, Settings, Style
- **New Fields:** Rich text answers, categories, styling options
- **Enhanced:** Better FAQ management, accordion controls

### Gallery Blocks
- **Tabs:** Content, Layout, Settings, Style
- **New Fields:** Image links, aspect ratios, hover effects
- **Enhanced:** Better gallery management, lightbox options

## 🚀 How to Use

### Step 1: Update Database Schema

First, add the new block categories to your Prisma schema:

```bash
npx prisma migrate dev --name add_new_block_categories
```

### Step 2: Run Seed Files

Run the seed files in order:

```bash
# 1. Add new essential blocks
npx tsx prisma/seed-enhanced-blocks.ts

# 2. Enhance existing blocks
npx tsx prisma/seed-enhance-existing-blocks.ts
```

### Step 3: Verify Blocks

Check that all blocks are available in the page builder:
- Navigate to any landing page editor
- Check the Block Library sidebar
- You should see all new blocks organized by category

## 📝 Block Schema Examples

### Using Tabs

```json
{
  "configSchema": {
    "tabs": [
      {
        "id": "content",
        "label": "Content",
        "fields": [
          { "name": "title", "type": "text", "label": "Title" }
        ]
      },
      {
        "id": "style",
        "label": "Style",
        "fields": [
          { "name": "color", "type": "color", "label": "Color" }
        ]
      }
    ]
  }
}
```

### Using Conditional Fields

```json
{
  "name": "showButton",
  "type": "checkbox",
  "label": "Show Button"
},
{
  "name": "buttonText",
  "type": "text",
  "label": "Button Text",
  "condition": {
    "field": "showButton",
    "operator": "equals",
    "value": true
  }
}
```

### Using Sections

```json
{
  "configSchema": {
    "sections": [
      {
        "id": "basic",
        "label": "Basic Settings",
        "collapsible": true,
        "defaultOpen": true,
        "fields": [
          { "name": "title", "type": "text", "label": "Title" }
        ]
      }
    ]
  }
}
```

## 🎨 UI Updates

The `SidebarBlock` component has been updated to:
- Show icons for new block categories
- Display color-coded categories
- Support all new block types

## 📊 Block Statistics

After running the seed files, you'll have:
- **31+ total blocks** (23 existing + 8 new)
- **All blocks** with enhanced settings
- **8 new categories** for better organization
- **100% tab-based** settings for complex blocks

## 🔄 Migration Notes

- **Backward Compatible:** Old block schemas still work
- **Auto-Detection:** System automatically detects tab/section/flat structure
- **No Breaking Changes:** Existing blocks continue to function

## 🐛 Troubleshooting

### Blocks Not Showing
1. Check that seed files ran successfully
2. Verify database connection
3. Clear Next.js cache: `rm -rf .next`

### Settings Not Loading
1. Check browser console for errors
2. Verify `configSchema` is valid JSON
3. Ensure field types are supported

### Conditional Fields Not Working
1. Check condition syntax matches examples
2. Verify field names match exactly
3. Check operator is supported

## 📚 Related Documentation

- [Block Settings Guide](./BLOCK_SETTINGS_GUIDE.md) - Complete guide to block settings
- [CMS Page Builder Status](./CMS_PAGE_BUILDER_STATUS.md) - Overall system status
- [Implementation Plan](./CMS_PAGE_BUILDER_IMPLEMENTATION_PLAN.md) - Original plan

## 🎯 Next Steps

1. **Create Block Components** - Implement React components for new blocks
2. **Add More Blocks** - Create industry-specific blocks (e-commerce, SaaS, etc.)
3. **Block Templates** - Create pre-built page templates using these blocks
4. **Block Marketplace** - Allow users to create and share custom blocks

---

**Last Updated:** 2025-01-27  
**Version:** 2.0.0

