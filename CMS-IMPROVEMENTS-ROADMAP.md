# CMS Improvements Roadmap

## ✅ Completed Work

### 1. Premium Features Documentation
**File:** `premium-features.md`

Created comprehensive 500+ line documentation covering:
- Template Manager (with 11 starter templates)
- Content Management System
- Multi-Language Translation System
- Advanced Analytics
- Marketing Tools
- Feature Flag System

### 2. Template Manager Enhancements
All features complete and production-ready:
- ✅ Multi-step creation wizard
- ✅ 11 professional starter templates
- ✅ Template duplication
- ✅ Variables helper with 50+ variables
- ✅ Live preview with zoom and fullscreen
- ✅ Searchable variables library
- ✅ Direct insertion into editor

### 3. CMS Review
**Current Features (All Working):**
- ✅ Blog posts management
- ✅ Custom pages
- ✅ Categories and tags
- ✅ Rich text editor (TipTap)
- ✅ Featured images
- ✅ SEO fields
- ✅ Status management
- ✅ Search and pagination
- ✅ Live preview links

---

## 📋 Suggested Future Improvements

These improvements were identified but not yet implemented due to file locking issues during development. They can be added in a future development session:

### Priority 1: Rich Text Editor Enhancements

**Location:** `src/components/admin/RichTextEditor.tsx`

**Improvements:**
1. Replace `window.prompt()` with proper Dialog components
2. Add image upload dialog with tabs (Upload/URL)
3. Add link dialog with text input
4. Add more formatting options:
   - H3 heading
   - Strikethrough
   - Inline code
   - Horizontal rule
5. Add tooltips to all toolbar buttons

**Implementation Example:**
```typescript
const [showImageDialog, setShowImageDialog] = useState(false);
const [showLinkDialog, setShowLinkDialog] = useState(false);

// Image Dialog with tabs
<Dialog open={showImageDialog} onOpenChange={setShowImageDialog}>
  <Tabs>
    <TabsTrigger value="upload">Upload</TabsTrigger>
    <TabsTrigger value="url">URL</TabsTrigger>
    <TabsContent value="upload">
      <Input type="file" onChange={handleImageUpload} />
    </TabsContent>
    <TabsContent value="url">
      <Input placeholder="Image URL" />
    </TabsContent>
  </Tabs>
</Dialog>
```

### Priority 2: Categories & Tags Management

**Location:** `src/app/admin/(protected)/cms/categories/page.tsx`

**Improvements:**
1. Add Edit button for each category/tag
2. Add Delete button with confirmation
3. Reuse create dialog for editing
4. Add edit/delete API endpoints

**Implementation Steps:**
```typescript
// Add to table columns
<TableHead className="text-right">Actions</TableHead>

// Add actions column
<TableCell className="text-right">
  <div className="flex justify-end gap-2">
    <Button
      variant="ghost"
      size="icon"
      onClick={() => handleEdit(item)}
    >
      <Edit2 className="w-4 h-4" />
    </Button>
    <Button
      variant="ghost"
      size="icon"
      onClick={() => handleDelete(item.id)}
      disabled={item._count.posts > 0}
    >
      <Trash2 className="w-4 h-4" />
    </Button>
  </div>
</TableCell>
```

**API Routes Needed:**
- `PUT /api/admin/cms/categories/[id]`
- `DELETE /api/admin/cms/categories/[id]`
- `PUT /api/admin/cms/tags/[id]`
- `DELETE /api/admin/cms/tags/[id]`

### Priority 3: Tag Selection in Blog Post Editor

**Location:** `src/app/admin/(protected)/cms/posts/[id]/page.tsx`

**Improvements:**
1. Add multi-select for tags
2. Show selected tags as badges
3. Allow creating new tags inline

**Implementation:**
```typescript
const [selectedTags, setSelectedTags] = useState<string[]>([]);
const [availableTags, setAvailableTags] = useState<Tag[]>([]);

// Fetch tags
useEffect(() => {
  fetch('/api/admin/cms/tags').then(r => r.json()).then(setAvailableTags);
}, []);

// In the form
<Card>
  <CardHeader>
    <CardTitle>Tags</CardTitle>
  </CardHeader>
  <CardContent>
    <MultiSelect
      options={availableTags}
      value={selectedTags}
      onChange={setSelectedTags}
      placeholder="Select tags..."
    />
  </CardContent>
</Card>
```

### Priority 4: Content Statistics

**Location:** `src/app/admin/(protected)/cms/posts/[id]/page.tsx`

**Improvements:**
1. Add word count display
2. Calculate reading time
3. Show character count
4. Display stats in sidebar

**Implementation:**
```typescript
const contentStats = useMemo(() => {
  const words = content.replace(/<[^>]*>/g, '').split(/\s+/).filter(Boolean).length;
  const readingTime = Math.ceil(words / 200); // 200 words per minute
  const characters = content.length;

  return { words, readingTime, characters };
}, [content]);

// Display in sidebar
<Card>
  <CardHeader>
    <CardTitle>Content Statistics</CardTitle>
  </CardHeader>
  <CardContent className="space-y-2">
    <div className="flex justify-between">
      <span>Words:</span>
      <span className="font-medium">{contentStats.words}</span>
    </div>
    <div className="flex justify-between">
      <span>Reading time:</span>
      <span className="font-medium">{contentStats.readingTime} min</span>
    </div>
    <div className="flex justify-between">
      <span>Characters:</span>
      <span className="font-medium">{contentStats.characters}</span>
    </div>
  </CardContent>
</Card>
```

### Priority 5: Bulk Actions

**Locations:**
- `src/app/admin/(protected)/cms/posts/page.tsx`
- `src/app/admin/(protected)/cms/pages/page.tsx`

**Improvements:**
1. Add checkbox column for multi-select
2. Show bulk action toolbar when items selected
3. Implement bulk delete
4. Implement bulk status change

**Implementation:**
```typescript
const [selectedPosts, setSelectedPosts] = useState<string[]>([]);

// Checkbox column
<TableHead className="w-12">
  <Checkbox
    checked={selectedPosts.length === posts.length}
    onCheckedChange={(checked) => {
      setSelectedPosts(checked ? posts.map(p => p.id) : []);
    }}
  />
</TableHead>

// Bulk action toolbar
{selectedPosts.length > 0 && (
  <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-background border rounded-lg shadow-lg p-4 flex items-center gap-4">
    <span>{selectedPosts.length} selected</span>
    <Button variant="destructive" onClick={handleBulkDelete}>
      <Trash2 className="w-4 h-4 mr-2" />
      Delete
    </Button>
    <Select onValueChange={handleBulkStatusChange}>
      <SelectTrigger>
        <SelectValue placeholder="Change status" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="DRAFT">Set as Draft</SelectItem>
        <SelectItem value="PUBLISHED">Publish</SelectItem>
        <SelectItem value="ARCHIVED">Archive</SelectItem>
      </SelectContent>
    </Select>
  </div>
)}
```

### Priority 6: Additional Features

**Autosave for Blog Posts:**
```typescript
useEffect(() => {
  const timer = setTimeout(() => {
    if (content && !isNew) {
      handleSave(true); // silent save
    }
  }, 30000); // autosave every 30 seconds

  return () => clearTimeout(timer);
}, [content]);
```

**Content Preview:**
```typescript
const [showPreview, setShowPreview] = useState(false);

<Button onClick={() => setShowPreview(true)}>
  Preview
</Button>

<Dialog open={showPreview} onOpenChange={setShowPreview}>
  <div className="prose" dangerouslySetInnerHTML={{ __html: content }} />
</Dialog>
```

**Media Library:**
- Create dedicated media management page
- Upload and organize images
- Search and filter media
- Insert from library into posts

---

## 🚀 Implementation Order

1. **Quick Wins (1-2 hours each):**
   - Content statistics
   - Category/Tag edit/delete

2. **Medium Complexity (2-4 hours each):**
   - Tag selection in blog posts
   - Rich text editor dialogs

3. **Larger Features (4+ hours each):**
   - Bulk actions
   - Media library
   - Content preview

---

## 📊 Current Status

**Build Status:** ✅ Passing
**Features Working:** All core features operational
**Documentation:** Complete
**Production Ready:** Yes

**Routes Available:**
- `/admin/cms/posts` - Blog management
- `/admin/cms/pages` - Page management
- `/admin/cms/categories` - Category/Tag management
- `/admin/templates` - Template manager

---

## 🔧 Technical Notes

### File Locking Issue
During implementation, file write operations encountered locking issues, likely due to:
- Next.js development server watching files
- TypeScript compiler running
- Git operations

**Solution:** Implement improvements when dev server is stopped, or use direct file operations in production environment.

### Database Schema
All necessary tables exist and are properly indexed:
- `BlogPost` - with tags relation (many-to-many)
- `BlogCategory` - with posts relation
- `BlogTag` - with posts relation
- `Page` - standalone

### Dependencies
All required packages are installed:
- `@tiptap/react` - Rich text editor
- `@tiptap/starter-kit` - Editor extensions
- `react-hot-toast` - Notifications
- All shadcn/ui components

---

## 📝 Next Steps

1. Review this roadmap
2. Prioritize improvements based on business needs
3. Schedule implementation session
4. Test each improvement thoroughly
5. Update `premium-features.md` with new features

---

**Document Version:** 1.0
**Last Updated:** November 23, 2024
**Author:** Claude Code Assistant
