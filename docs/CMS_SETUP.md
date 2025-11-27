# CMS Page Builder - Setup Instructions

## Required Dependencies

Install the following npm packages:

```bash
npm install swr date-fns
```

## Regenerate Prisma Client

After the schema changes, regenerate the Prisma client to include the new enums (`BlockCategory`, `PageStatus`):

```bash
npx prisma generate
```

If you encounter permission errors, try:
1. Close your code editor
2. Run the command again
3. Reopen your code editor

## Apply Database Changes

If you haven't already applied the schema changes to your database:

```bash
npx prisma db push
```

## Seed Block Templates

Populate the database with the 23 system block templates:

```bash
npx tsx prisma/seed-block-templates.ts
```

## Verify Installation

1. Start the development server: `npm run dev`
2. Navigate to `/admin/cms/templates` to see the Block Templates page
3. Navigate to `/admin/cms/landing-pages` to see the Landing Pages page

## Troubleshooting

### Missing Prisma Types
If you see errors like "Module '@prisma/client' has no exported member 'BlockCategory'":
- Run `npx prisma generate` to regenerate the Prisma client
- Restart your TypeScript server in VS Code (Cmd/Ctrl + Shift + P → "TypeScript: Restart TS Server")

### Toast Notifications Not Working
- Ensure `react-hot-toast` is installed
- The `<Toaster />` component should already be in your root layout

### Navigation Not Showing
- Clear your browser cache
- Check that you're logged in as an ADMIN, MANAGER, or SUPERADMIN user
