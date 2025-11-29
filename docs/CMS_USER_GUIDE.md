# CMS Page Builder - User Guide

## Table of Contents
1. [Getting Started](#getting-started)
2. [Creating Landing Pages](#creating-landing-pages)
3. [Using Blocks](#using-blocks)
4. [Configuring Blocks](#configuring-blocks)
5. [Publishing Pages](#publishing-pages)
6. [Keyboard Shortcuts](#keyboard-shortcuts)
7. [Troubleshooting](#troubleshooting)

---

## Getting Started

The CMS Page Builder allows you to create beautiful, responsive landing pages without writing code. You can drag and drop blocks, configure them with a visual editor, and publish your pages instantly.

### Accessing the Page Builder

1. Navigate to **CMS > Landing Pages** in the admin panel
2. Click **"Create New Page"** or select an existing page to edit
3. The page editor will open with a 3-panel layout:
   - **Left Panel**: Block Library
   - **Center Panel**: Canvas (your page preview)
   - **Right Panel**: Settings/Inspector

---

## Creating Landing Pages

### Step 1: Create a New Page

1. Click **"Create New Page"** from the landing pages list
2. Fill in the basic information:
   - **Title**: The name of your page
   - **Slug**: The URL-friendly identifier (auto-generated from title)
   - **Description**: Optional description for your page
3. Click **"Create"** to open the editor

### Step 2: Add Blocks

1. Browse the **Block Library** on the left
2. Blocks are organized by category:
   - **Hero**: Eye-catching header sections
   - **Features**: Product/service features
   - **CTA**: Call-to-action sections
   - **Testimonials**: Customer reviews
   - **Pricing**: Pricing tables
   - **Forms**: Contact and newsletter forms
   - And more...
3. Click any block to add it to your page
4. The block will appear in the canvas

### Step 3: Configure Blocks

1. Click on a block in the canvas to select it
2. The **Settings Panel** on the right will open
3. Configure the block's fields:
   - **Text fields**: Enter text content
   - **Image fields**: Click "Select Image" to choose from media library
   - **Color pickers**: Choose colors for backgrounds, text, etc.
   - **Sliders**: Adjust numeric values (padding, spacing, etc.)
   - **Repeater fields**: Add multiple items (e.g., features, testimonials)
4. Changes are saved automatically (auto-save)

### Step 4: Reorder Blocks

- **Drag and Drop**: Click and hold the drag handle (⋮⋮) on a block, then drag it to a new position
- **Keyboard**: Use Arrow Up/Down keys when a block is selected

### Step 5: Remove Blocks

- Click the **trash icon** (🗑️) on a block
- Or select a block and press **Delete** key

---

## Using Blocks

### Available Block Categories

#### Hero Blocks
- **Background Image Hero**: Full-width hero with background image
- **Video Background Hero**: Hero with video background
- **Split Layout Hero**: Image and content side-by-side
- **Minimal Hero**: Clean, simple hero section
- **Gradient Hero**: Hero with gradient background

#### Feature Blocks
- **3-Column Grid**: Feature grid with 3 columns
- **Alternating Layout**: Alternating image and content
- **Icon Boxes**: Features with icons
- **Screenshots**: Features with screenshot showcase

#### CTA Blocks
- **Full-Width Banner**: Full-width call-to-action
- **Card Style**: CTA in a card format
- **Split Layout**: Split CTA section

#### Form Blocks
- **Contact Form**: Customizable contact form
- **Newsletter Signup**: Email newsletter subscription

#### Other Blocks
- Testimonials (Carousel & Grid)
- Pricing Tables
- Team Grid
- Stats Showcase
- Logo Grid
- FAQ Accordion
- Gallery Grid

---

## Configuring Blocks

### Common Field Types

#### Text Fields
- Enter text directly
- Supports basic formatting
- Character limits shown when applicable

#### Image Fields
1. Click **"Select Image"**
2. Choose from media library or upload new image
3. Images are automatically optimized
4. Recommended dimensions shown when applicable

#### Color Pickers
- Click the color swatch to open color picker
- Enter hex code directly
- Choose from preset colors

#### Repeater Fields
- Click **"Add Item"** to add new entries
- Drag items to reorder
- Collapse/expand items for easier editing
- Each item has its own set of fields

#### Sliders
- Drag the slider or enter value directly
- Min/max values enforced
- Units shown (px, %, etc.)

---

## Publishing Pages

### Page Settings

Click the **"Page Settings"** button in the header to configure:

- **Basic Information**: Title, slug, description
- **Status**: Draft, Published, Scheduled, Archived
- **SEO Settings**: 
  - SEO Title (60 characters recommended)
  - SEO Description (160 characters recommended)
  - SEO Keywords
  - Open Graph settings

### Publishing

1. Configure your page settings
2. Click **"Save Changes"** (or wait for auto-save)
3. Set status to **"Published"** in Page Settings
4. Your page will be live at `/landing/[your-slug]`

### Preview

- Click **"Preview"** button to view your page in a new tab
- Use **Device Preview** buttons to see how it looks on:
  - Desktop
  - Tablet
  - Mobile

---

## Keyboard Shortcuts

- **Ctrl+S**: Save page
- **Ctrl+Z**: Undo last action
- **Ctrl+Y** or **Ctrl+Shift+Z**: Redo
- **Delete**: Remove selected block
- **Arrow Up**: Select previous block
- **Arrow Down**: Select next block

---

## Auto-Save

The editor automatically saves your work:
- Saves 2 seconds after you stop making changes
- Shows status indicator: "Auto-saving...", "Auto-saved", or "Auto-save failed"
- Backs up to browser storage if network fails
- Manual save button also available

---

## Block Duplication

To duplicate a block:
1. Select the block
2. Click the **copy icon** (📋) in the block toolbar
3. The duplicate appears right after the original

---

## Troubleshooting

### Blocks Not Appearing
- Check if blocks are visible (not hidden on current device)
- Verify block is saved (check auto-save status)
- Refresh the page

### Images Not Uploading
- Check Cloudinary configuration in environment variables
- Verify file size (max 10MB recommended)
- Check file format (JPG, PNG, WebP supported)

### Form Submissions Not Working
- Verify contact form API endpoint is configured
- Check admin email settings for notifications
- Review browser console for errors

### Changes Not Saving
- Check auto-save status indicator
- Verify network connection
- Try manual save (Ctrl+S)
- Check browser console for errors

### Page Not Publishing
- Verify page status is set to "Published"
- Check if slug is unique
- Ensure at least one block is added
- Review page settings for required fields

---

## Tips & Best Practices

1. **Start with a Hero Block**: Every landing page should have a compelling hero section
2. **Use Device Preview**: Always check how your page looks on mobile devices
3. **Optimize Images**: Use recommended image dimensions for best performance
4. **Test Forms**: Always test contact and newsletter forms before publishing
5. **SEO Optimization**: Fill in SEO fields for better search engine visibility
6. **Save Frequently**: While auto-save works, use Ctrl+S for important changes
7. **Use Revisions**: Create revisions before major changes to easily revert

---

## Need Help?

- Check the [Developer Guide](./CMS_DEVELOPER_GUIDE.md) for technical details
- Review [Block Catalog](./plans/04_BLOCK_TEMPLATES_CATALOG.md) for block specifications
- Contact your system administrator for access issues

