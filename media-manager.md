# Media Manager - WordPress-Style Implementation Plan

## Executive Summary

A comprehensive media library system for the ecommerce platform that provides centralized media asset management similar to WordPress Media Library. This system will integrate with the existing Cloudinary infrastructure and serve all media needs across products, blog posts, pages, and categories.

---

## 1. Core Features Overview

### 1.1 Upload & Storage
- **Multi-file Upload**: Drag-and-drop interface supporting batch uploads
- **Upload Methods**:
  - Direct file selection
  - Drag-and-drop zone
  - URL import (fetch from external URLs)
  - Integration with Cloudinary widget
- **File Type Support**:
  - Images: JPG, PNG, GIF, WebP, SVG, AVIF
  - Documents: PDF, DOC, DOCX, XLS, XLSX
  - Videos: MP4, WebM, MOV
  - Audio: MP3, WAV, OGG
- **Upload Constraints**:
  - Max file size: 10MB (configurable per file type)
  - Max batch upload: 20 files
  - File type validation
  - Image dimension validation

### 1.2 Media Organization
- **Folder Structure**: Hierarchical folder system for organization
- **Tags**: Multi-tag support for flexible categorization
- **Collections**: Reusable media collections (e.g., "Summer Campaign 2024")
- **Search & Filter**:
  - Full-text search on filename, alt text, caption
  - Filter by type, date, size, dimensions, tags
  - Filter by uploader
  - Advanced search with multiple criteria
- **Sorting**:
  - Name (A-Z, Z-A)
  - Date uploaded (newest/oldest)
  - File size
  - Dimensions
  - Last modified

### 1.3 View Modes
- **Grid View**: Thumbnail grid (default)
  - Adjustable thumbnail size (small, medium, large)
  - Lazy loading for performance
  - Hover preview with quick actions
- **List View**: Detailed table view
  - Columns: thumbnail, name, uploader, date, file size, dimensions
  - Sortable columns
  - Inline quick edit
- **Detail View**: Single media item with full metadata
  - Large preview
  - All metadata fields
  - Usage tracking (where the media is used)
  - Edit capabilities

### 1.4 Media Editing
- **Image Manipulation**:
  - Crop with preset ratios (1:1, 16:9, 4:3, custom)
  - Resize (by width, height, or percentage)
  - Rotate (90°, 180°, 270°)
  - Flip (horizontal, vertical)
  - Adjust brightness, contrast, saturation
  - Apply filters (grayscale, sepia, blur)
  - Smart crop (AI-powered focal point detection)
- **Image Optimization**:
  - Auto-optimization on upload
  - Manual compression with quality slider
  - Format conversion (JPG ↔ PNG ↔ WebP)
  - Generate responsive variants
- **Metadata Editing**:
  - Alt text (SEO-critical)
  - Title
  - Caption
  - Description
  - Custom fields
  - Tags
  - Folder assignment

### 1.5 Media Selection & Insertion
- **Modal Interface**: Reusable media picker component
- **Selection Modes**:
  - Single selection
  - Multiple selection
  - Gallery selection (ordered)
- **Integration Points**:
  - Product images
  - Product variant images
  - Category images
  - Blog post featured images
  - Blog post content (via TipTap editor)
  - Page content
  - User avatars
  - Store settings (logo, favicon, etc.)
- **Insert Options**:
  - Choose image size (thumbnail, medium, large, full, custom)
  - Set alignment (left, center, right, none)
  - Add link
  - Set display dimensions

---

## 2. Technical Architecture

### 2.1 Database Schema (Prisma)

```prisma
// ============================================
// MEDIA LIBRARY
// ============================================

enum MediaType {
  IMAGE
  VIDEO
  AUDIO
  DOCUMENT
  OTHER
}

enum MediaUsageType {
  PRODUCT_IMAGE
  PRODUCT_VARIANT
  CATEGORY_IMAGE
  BLOG_FEATURED_IMAGE
  BLOG_CONTENT
  PAGE_CONTENT
  USER_AVATAR
  STORE_SETTING
  OTHER
}

model MediaLibrary {
  id              String      @id @default(cuid())

  // File Information
  filename        String
  originalName    String
  mimeType        String
  fileSize        Int         // in bytes
  type            MediaType

  // Cloudinary Information
  cloudinaryId    String      @unique
  url             String      @db.Text
  secureUrl       String      @db.Text
  publicId        String
  version         Int?
  format          String?

  // Image-specific fields
  width           Int?
  height          Int?
  aspectRatio     Float?

  // Metadata
  altText         String?     @db.Text
  title           String?
  caption         String?     @db.Text
  description     String?     @db.Text

  // Organization
  folderId        String?
  folder          MediaFolder? @relation(fields: [folderId], references: [id], onDelete: SetNull)
  tags            MediaTag[]

  // Tracking
  uploadedById    String
  uploadedBy      User        @relation(fields: [uploadedById], references: [id])
  usageCount      Int         @default(0)
  lastUsedAt      DateTime?

  // Timestamps
  createdAt       DateTime    @default(now())
  updatedAt       DateTime    @updatedAt

  // Relations
  usage           MediaUsage[]
  variants        MediaVariant[]

  @@index([type])
  @@index([folderId])
  @@index([uploadedById])
  @@index([createdAt])
  @@index([cloudinaryId])
  @@fulltext([filename, altText, title, caption])
}

model MediaFolder {
  id          String        @id @default(cuid())
  name        String
  slug        String
  parentId    String?
  parent      MediaFolder?  @relation("FolderToFolder", fields: [parentId], references: [id])
  children    MediaFolder[] @relation("FolderToFolder")

  media       MediaLibrary[]

  createdAt   DateTime      @default(now())
  updatedAt   DateTime      @updatedAt

  @@unique([parentId, slug])
  @@index([parentId])
}

model MediaTag {
  id          String         @id @default(cuid())
  name        String         @unique
  slug        String         @unique

  media       MediaLibrary[]

  createdAt   DateTime       @default(now())
  updatedAt   DateTime       @updatedAt
}

// Track where media is being used
model MediaUsage {
  id              String          @id @default(cuid())

  mediaId         String
  media           MediaLibrary    @relation(fields: [mediaId], references: [id], onDelete: Cascade)

  usageType       MediaUsageType
  resourceType    String          // "Product", "BlogPost", "Page", etc.
  resourceId      String          // ID of the resource
  fieldName       String?         // e.g., "featuredImage", "content"

  createdAt       DateTime        @default(now())

  @@index([mediaId])
  @@index([resourceType, resourceId])
  @@unique([mediaId, usageType, resourceType, resourceId, fieldName])
}

// Store different size variants of images
model MediaVariant {
  id              String       @id @default(cuid())

  mediaId         String
  media           MediaLibrary @relation(fields: [mediaId], references: [id], onDelete: Cascade)

  name            String       // "thumbnail", "medium", "large", "custom_300x200"
  width           Int
  height          Int
  url             String       @db.Text
  cloudinaryId    String?

  createdAt       DateTime     @default(now())

  @@unique([mediaId, name])
  @@index([mediaId])
}
```

### 2.2 API Routes Structure

```
/api/media/
├── upload                    # POST - Upload media files
├── [id]                      # GET, PATCH, DELETE - Single media operations
├── bulk                      # POST - Bulk operations (delete, move, tag)
├── search                    # GET - Search and filter media
├── folders/
│   ├── index                 # GET, POST - List/create folders
│   ├── [id]                  # GET, PATCH, DELETE - Folder operations
│   └── [id]/media            # GET - Media in folder
├── tags/
│   ├── index                 # GET, POST - List/create tags
│   ├── [id]                  # PATCH, DELETE - Tag operations
│   └── popular               # GET - Most used tags
├── edit/
│   ├── crop                  # POST - Crop image
│   ├── resize                # POST - Resize image
│   ├── rotate                # POST - Rotate image
│   └── optimize              # POST - Optimize image
├── usage/
│   └── [id]                  # GET - Get usage information
└── stats                     # GET - Library statistics
```

### 2.3 Frontend Components Structure

```
/src/components/media-manager/
├── MediaLibrary/
│   ├── MediaLibrary.tsx              # Main container
│   ├── MediaHeader.tsx               # Search, filters, view toggles
│   ├── MediaGrid.tsx                 # Grid view
│   ├── MediaList.tsx                 # List view
│   ├── MediaItem.tsx                 # Single media item card
│   └── MediaDetail.tsx               # Detail sidebar/modal
├── MediaPicker/
│   ├── MediaPicker.tsx               # Picker modal component
│   ├── MediaPickerProvider.tsx      # Context for picker state
│   └── useMediaPicker.ts             # Hook for picker functionality
├── MediaUploader/
│   ├── MediaUploader.tsx             # Upload interface
│   ├── DropZone.tsx                  # Drag & drop zone
│   ├── UploadProgress.tsx            # Upload progress indicator
│   └── FilePreview.tsx               # Preview before upload
├── MediaEditor/
│   ├── ImageEditor.tsx               # Image editing modal
│   ├── CropTool.tsx                  # Cropping interface
│   ├── ResizeTool.tsx                # Resize interface
│   ├── AdjustTool.tsx                # Color adjustments
│   └── FilterTool.tsx                # Filter presets
├── MediaOrganization/
│   ├── FolderTree.tsx                # Folder navigation
│   ├── FolderBreadcrumb.tsx          # Current path display
│   ├── TagManager.tsx                # Tag management
│   └── BulkActions.tsx               # Bulk operation toolbar
├── MediaMetadata/
│   ├── MetadataForm.tsx              # Edit metadata
│   ├── UsageTracker.tsx              # Show where media is used
│   └── FileInfo.tsx                  # Technical file information
└── shared/
    ├── MediaThumbnail.tsx            # Reusable thumbnail
    ├── MediaIcon.tsx                 # File type icons
    └── MediaSize.tsx                 # Size selector
```

### 2.4 State Management

```typescript
// Redux Toolkit Slices

// mediaLibrarySlice.ts
interface MediaLibraryState {
  items: MediaItem[]
  selectedItems: string[]
  viewMode: 'grid' | 'list'
  currentFolder: string | null
  filters: MediaFilters
  searchQuery: string
  sortBy: SortOption
  loading: boolean
  uploadProgress: UploadProgress[]
}

// mediaPickerSlice.ts
interface MediaPickerState {
  isOpen: boolean
  mode: 'single' | 'multiple' | 'gallery'
  selectedMedia: MediaItem[]
  onSelect: (media: MediaItem[]) => void
  filters: MediaFilters
}

// mediaEditorSlice.ts
interface MediaEditorState {
  isOpen: boolean
  currentMedia: MediaItem | null
  editType: 'crop' | 'resize' | 'adjust' | 'filter'
  changes: EditorChanges
  history: EditorHistory[]
}
```

---

## 3. User Flows

### 3.1 Upload Flow
1. User clicks "Upload" or drags files to drop zone
2. Files are validated (type, size, dimensions)
3. Upload progress shown with thumbnails
4. Files uploaded to Cloudinary
5. Database records created
6. Automatic variant generation (thumbnail, medium, large)
7. User prompted to add metadata (optional)
8. Media appears in library

### 3.2 Browse & Search Flow
1. User navigates to Media Library
2. Grid view shown by default
3. User can:
   - Browse folders
   - Filter by type, date, tags
   - Search by filename/metadata
   - Toggle view mode
   - Sort results
4. Click media item to view details
5. Select multiple items for bulk actions

### 3.3 Media Selection Flow (from Editor)
1. User editing product/blog post
2. Click "Add Image" button
3. Media Picker modal opens
4. User can:
   - Browse existing media
   - Upload new media
   - Search/filter
   - Select media
5. Choose insert options (size, alignment)
6. Confirm selection
7. Media inserted into content

### 3.4 Edit Flow
1. User selects media item
2. Click "Edit" action
3. Editor modal opens with tools:
   - Crop (with ratio presets)
   - Resize (maintain aspect ratio option)
   - Rotate/flip
   - Adjust (brightness, contrast, saturation)
   - Filters
4. Preview changes in real-time
5. Save creates new version or updates original
6. All usages updated automatically

### 3.5 Organization Flow
1. User creates folder structure
2. Drag-drop media into folders
3. Apply tags to media (individual or bulk)
4. Create collections for campaigns
5. Archive old media (soft delete)

---

## 4. Permission System Integration

### 4.1 Role-Based Access

```typescript
// Extend existing PermissionResource enum
enum PermissionResource {
  // ... existing
  MEDIA_LIBRARY
  MEDIA_FOLDER
  MEDIA_TAG
}

// Permission Matrix
const mediaPermissions = {
  SUPERADMIN: ['VIEW', 'CREATE', 'UPDATE', 'DELETE', 'MANAGE'],
  ADMIN: ['VIEW', 'CREATE', 'UPDATE', 'DELETE'],
  MANAGER: ['VIEW', 'CREATE', 'UPDATE', 'DELETE'],
  EDITOR: ['VIEW', 'CREATE', 'UPDATE'],  // Can't delete
  SUPPORT: ['VIEW'],
  VIEWER: ['VIEW'],
  CUSTOMER: [] // No access to media library
}
```

### 4.2 Folder Permissions (Future Enhancement)
- Per-folder access control
- User/role can only see specific folders
- Useful for multi-vendor scenarios

---

## 5. Integration Points

### 5.1 Product Management
```typescript
// Update product image upload to use Media Library
const ProductImagePicker = () => {
  const { openPicker } = useMediaPicker();

  const handleAddImage = () => {
    openPicker({
      mode: 'multiple',
      accept: 'image/*',
      onSelect: (media) => {
        // Create ProductImage records
        // Link to Media Library via MediaUsage
      }
    });
  };
};
```

### 5.2 Blog Post Editor (TipTap Integration)
```typescript
// Custom TipTap image extension
const MediaLibraryImage = Image.extend({
  addCommands() {
    return {
      insertMediaImage: (mediaId: string) => ({ commands }) => {
        const media = await fetchMedia(mediaId);
        return commands.insertContent({
          type: 'image',
          attrs: {
            src: media.url,
            alt: media.altText,
            'data-media-id': mediaId
          }
        });
      }
    };
  }
});
```

### 5.3 Category Image
```typescript
// Single image selection for categories
const CategoryForm = () => {
  const [categoryImage, setCategoryImage] = useState<MediaItem | null>(null);

  const handleSelectImage = () => {
    openPicker({
      mode: 'single',
      accept: 'image/*',
      onSelect: ([media]) => {
        setCategoryImage(media);
        // Update category.image with media.id or media.url
      }
    });
  };
};
```

---

## 6. Performance Optimization

### 6.1 Frontend Optimizations
- **Virtual Scrolling**: For large media libraries (react-window)
- **Lazy Loading**: Load thumbnails as user scrolls
- **Image Optimization**: Use Cloudinary transformations
  - Automatic format selection (WebP, AVIF)
  - Responsive images with srcset
  - Lazy loading with blur placeholders
- **Caching**: Redis cache for frequently accessed media
- **Pagination**: Load 50 items per page with infinite scroll

### 6.2 Backend Optimizations
- **Database Indexing**: On common query fields
- **CDN**: Cloudinary CDN for fast delivery
- **Batch Operations**: Bulk uploads/deletes processed in queue
- **Search**: Implement full-text search or Algolia integration
- **Cloudinary Optimizations**:
  - Auto format (f_auto)
  - Auto quality (q_auto)
  - Lazy loading (loading_lazy)
  - Responsive breakpoints

### 6.3 Upload Optimizations
- **Client-side Compression**: Before upload (browser-image-compression)
- **Chunked Uploads**: For large files
- **Concurrent Uploads**: Max 3 simultaneous uploads
- **Progress Tracking**: Real-time feedback
- **Resume Capability**: For failed uploads

---

## 7. Advanced Features

### 7.1 AI-Powered Features (Future)
- **Auto-tagging**: Automatic tag suggestions based on image content
- **Smart Crop**: AI detects important areas for cropping
- **Alt Text Generation**: Auto-generate SEO-friendly alt text
- **Duplicate Detection**: Find similar/duplicate images
- **Background Removal**: One-click background removal
- **Image Enhancement**: Auto-enhance photo quality

### 7.2 Asset Delivery Network (ADN)
- Multiple CDN endpoints for global delivery
- Regional optimization
- Automatic format selection
- Bandwidth optimization

### 7.3 Media Analytics
- Most used media
- Storage usage by folder/tag/user
- Upload trends over time
- Media performance (views, usage)
- Unused media detection (cleanup suggestions)

### 7.4 Version Control
- Track media edit history
- Restore previous versions
- Compare versions side-by-side
- Version naming and notes

### 7.5 Collections & Galleries
- Create media collections
- Reusable gallery templates
- Collection sharing (public URLs)
- Collection embedding

---

## 8. Security Considerations

### 8.1 Upload Security
- File type validation (MIME type + extension)
- File size limits
- Malware scanning (ClamAV integration)
- SVG sanitization (DOMPurify)
- Rate limiting on uploads

### 8.2 Access Control
- URL signing for private media
- Expiring links for sensitive content
- IP-based access restrictions
- User-based access control

### 8.3 Data Protection
- Soft delete for media (30-day recovery)
- Backup to separate storage
- GDPR compliance (data export, deletion)
- Audit logging for all operations

---

## 9. Implementation Phases

### Phase 1: Core Foundation (Week 1-2)
- [ ] Database schema implementation
- [ ] Basic upload functionality (Cloudinary integration)
- [ ] Media library grid view
- [ ] Basic search and filtering
- [ ] Permission system integration

### Phase 2: Organization & Management (Week 3-4)
- [ ] Folder structure
- [ ] Tag system
- [ ] Bulk operations
- [ ] Media metadata editing
- [ ] List view implementation

### Phase 3: Media Picker Integration (Week 5-6)
- [ ] Reusable media picker component
- [ ] Product image integration
- [ ] Blog post integration (TipTap)
- [ ] Category image integration
- [ ] Page content integration

### Phase 4: Image Editing (Week 7-8)
- [ ] Crop tool
- [ ] Resize tool
- [ ] Rotate/flip functionality
- [ ] Color adjustments
- [ ] Filter presets
- [ ] Variant generation

### Phase 5: Advanced Features (Week 9-10)
- [ ] Usage tracking
- [ ] Media analytics dashboard
- [ ] Version control
- [ ] Collections/galleries
- [ ] URL import
- [ ] Video upload support

### Phase 6: Optimization & Polish (Week 11-12)
- [ ] Performance optimization
- [ ] Virtual scrolling
- [ ] Caching implementation
- [ ] Mobile responsive design
- [ ] Accessibility improvements
- [ ] Documentation

---

## 10. Testing Strategy

### 10.1 Unit Tests
- API route handlers
- Utility functions
- Component logic
- State management

### 10.2 Integration Tests
- Upload flow
- Media selection flow
- Edit and save flow
- Bulk operations
- Permission checks

### 10.3 E2E Tests
- Complete user journeys
- Cross-browser testing
- Mobile device testing
- Performance benchmarks

### 10.4 Load Testing
- Concurrent uploads
- Large library performance
- Search performance
- CDN stress testing

---

## 11. Documentation Requirements

### 11.1 User Documentation
- Media library user guide
- How to upload media
- How to organize media
- How to edit images
- How to insert media into content
- Keyboard shortcuts

### 11.2 Developer Documentation
- API reference
- Component documentation
- Integration guide
- Extending the media manager
- Custom media types
- Webhook integration

### 11.3 Admin Documentation
- Permission configuration
- Storage management
- Performance monitoring
- Troubleshooting guide

---

## 12. Success Metrics

### 12.1 Performance Metrics
- Upload success rate: >99%
- Average upload time: <5s for 2MB image
- Library load time: <1s for 1000 items
- Search response time: <500ms

### 12.2 User Metrics
- Time to upload and insert media: <30s
- User satisfaction score: >4.5/5
- Reduction in duplicate uploads: 50%
- Support tickets related to media: <5% of total

### 12.3 Technical Metrics
- API response time: <200ms (p95)
- Error rate: <0.1%
- Storage efficiency: 30% reduction via optimization
- CDN cache hit rate: >95%

---

## 13. Future Enhancements

### 13.1 Short-term (3-6 months)
- Mobile app for media management
- Bulk import from external sources
- Advanced search with AI
- Media expiration dates
- Watermarking

### 13.2 Long-term (6-12 months)
- Video editing capabilities
- 3D model support
- AR/VR asset management
- Real-time collaboration
- Multi-language media metadata
- Integration with external DAM systems
- Blockchain-based asset verification

---

## 14. Estimated Resource Requirements

### 14.1 Development Team
- 1 Backend Developer (full-time)
- 1 Frontend Developer (full-time)
- 1 UI/UX Designer (part-time)
- 1 QA Engineer (part-time)

### 14.2 Infrastructure
- Cloudinary Storage: Based on usage (estimate $100-500/month)
- Database: Existing MySQL instance
- Redis Cache: For session and media caching
- CDN: Included with Cloudinary

### 14.3 Third-party Services
- Cloudinary (Image CDN & Transformations)
- (Optional) Algolia for advanced search
- (Optional) ClamAV for malware scanning
- (Optional) AI services for auto-tagging

---

## 15. Conclusion

This media manager will transform how media assets are managed across the ecommerce platform. By providing a centralized, powerful, and user-friendly interface similar to WordPress Media Library, it will:

1. **Improve Efficiency**: Reduce time spent managing media by 60%
2. **Enhance SEO**: Better alt text and metadata management
3. **Reduce Storage Costs**: Through deduplication and optimization
4. **Improve User Experience**: Consistent, fast media across the site
5. **Enable Scalability**: Handle growing media libraries efficiently
6. **Ensure Security**: Robust access control and validation

The phased approach allows for iterative development and early feedback, ensuring the final product meets all user needs while maintaining high quality standards.
