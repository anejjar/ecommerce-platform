# Update Contact Form Block Template

The Contact Form block component has been enhanced with new features. To see these improvements in the Page Builder, you need to update the block template in your database.

## Quick Update

Run this command to update the contact form template:

```bash
npm run update:contact-form
```

Or directly:

```bash
tsx prisma/update-contact-form-template.ts
```

## What's New

The updated Contact Form block now includes:

### New Configuration Options

1. **Subheading** - Optional subheading text
2. **Success Message** - Customizable message shown after form submission
3. **Background Color** - Custom background color for the form section
4. **Spam Protection** - Toggle honeypot spam protection on/off

### Enhanced Form Fields Configuration

The form fields are now fully configurable via a repeater field with options for:

- **Field Types**: Text, Email, Phone, Textarea, Select, Checkbox, Number
- **Validation**: Min/max length, regex patterns
- **UX Options**: Placeholders, help text, character counters
- **Select Options**: Configure dropdown options with nested repeater
- **Textarea Rows**: Customizable number of rows

### New Features

- ✅ Field-level validation with inline error messages
- ✅ Real-time validation on blur
- ✅ Character counters for fields with maxLength
- ✅ Icons for different field types
- ✅ Better error handling and user feedback
- ✅ Spam protection (honeypot)
- ✅ "Send Another Message" button in success state

## After Running the Update

1. **Refresh your browser** - Clear cache if needed
2. **Open Page Builder** - Navigate to any landing page editor
3. **Add/Edit Contact Form** - The new configuration options will be available in the settings panel

## Manual Update (Alternative)

If the script doesn't work, you can manually update the template via the admin panel:

1. Go to **CMS > Block Templates**
2. Find "Contact Form" template
3. Edit the template and update the `configSchema` field with the new schema
4. Update the `defaultConfig` with the new default values

## Troubleshooting

### Template Not Updating

- Make sure you're connected to the correct database
- Check that the template slug is exactly `contact-form`
- Verify you have admin permissions

### Options Not Showing

- Clear your browser cache
- Hard refresh (Ctrl+Shift+R or Cmd+Shift+R)
- Check browser console for errors

### Nested Repeaters Not Working

The RepeaterField component supports nested repeaters (for select options). If you see issues:
- Make sure the ConfigForm is properly rendering nested fields
- Check that the schema structure matches the expected format







