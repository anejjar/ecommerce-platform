# AI Rules & Guidelines

## UI/UX Guidelines

### Dark Mode Compatibility
- **ALWAYS** ensure that all UI elements look good in both Light and Dark modes.
- **NEVER** use hardcoded colors (e.g., `bg-white`, `text-black`, `bg-gray-100`) without providing a dark mode variant (e.g., `dark:bg-gray-800`, `dark:text-white`).
- Use CSS variables (e.g., `bg-background`, `text-foreground`, `border-border`) whenever possible as they automatically handle theme switching.
- Test contrast ratios in both modes.
- For status badges and colored elements, ensure the colors are legible against dark backgrounds.
