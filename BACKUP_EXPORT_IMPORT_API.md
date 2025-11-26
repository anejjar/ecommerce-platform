# Backup, Export, and Import API Documentation

Complete API documentation for database backup, data export, and data import features in the ecommerce platform.

## Table of Contents
- [Authentication](#authentication)
- [Database Backup API](#database-backup-api)
- [Data Export API](#data-export-api)
- [Data Import API](#data-import-api)
- [Supported Data Types](#supported-data-types)
- [File Formats](#file-formats)
- [Error Handling](#error-handling)
- [Examples](#examples)

---

## Authentication

All endpoints require SUPERADMIN role authentication.

**Headers Required:**
```
Authorization: Bearer {session-token}
Cookie: next-auth.session-token={token}
```

**Response Codes:**
- `401 Unauthorized` - Not authenticated
- `403 Forbidden` - Insufficient permissions (not SUPERADMIN)

---

## Database Backup API

### 1. List All Backups

**Endpoint:** `GET /api/admin/backup`

**Description:** List all database backups with pagination and filtering.

**Query Parameters:**
- `page` (number, optional) - Page number (default: 1)
- `limit` (number, optional) - Items per page (default: 20)
- `type` (string, optional) - Filter by type: MANUAL, SCHEDULED, AUTO
- `status` (string, optional) - Filter by status: PENDING, IN_PROGRESS, COMPLETED, FAILED

**Response:**
```json
{
  "backups": [
    {
      "id": "backup-id",
      "filename": "backup-1234567890.json",
      "fileSize": 1048576,
      "type": "MANUAL",
      "status": "COMPLETED",
      "includeProducts": true,
      "includeOrders": true,
      "includeCustomers": true,
      "includeMedia": false,
      "includeSettings": true,
      "fileUrl": "https://cloudinary.com/...",
      "recordCount": 1500,
      "createdBy": {
        "id": "user-id",
        "name": "Admin User",
        "email": "admin@example.com"
      },
      "createdAt": "2025-01-15T10:30:00Z",
      "completedAt": "2025-01-15T10:32:00Z"
    }
  ],
  "total": 50,
  "page": 1,
  "limit": 20,
  "totalPages": 3
}
```

---

### 2. Create Backup

**Endpoint:** `POST /api/admin/backup`

**Description:** Create a new database backup. Processing happens asynchronously.

**Request Body:**
```json
{
  "type": "MANUAL",
  "includeProducts": true,
  "includeOrders": true,
  "includeCustomers": true,
  "includeMedia": false,
  "includeSettings": true
}
```

**Response (201 Created):**
```json
{
  "backup": {
    "id": "backup-id",
    "status": "IN_PROGRESS",
    "message": "Backup started. Check status at /api/admin/backup/backup-id"
  }
}
```

**What Gets Backed Up:**

- **Products:** Full product data including images, variants, categories, translations, and customization fields
- **Orders:** Complete order history with items, addresses, notes, and refunds
- **Customers:** Customer accounts with addresses (passwords excluded)
- **Settings:** Store settings, discount codes, and feature flags
- **Media:** Media library metadata (file references, not actual files)

---

### 3. Get Backup Details

**Endpoint:** `GET /api/admin/backup/{id}`

**Description:** Get detailed information about a specific backup.

**Response:**
```json
{
  "backup": {
    "id": "backup-id",
    "filename": "backup-1234567890.json",
    "fileSize": 1048576,
    "type": "MANUAL",
    "status": "COMPLETED",
    "includeProducts": true,
    "includeOrders": true,
    "includeCustomers": true,
    "includeMedia": false,
    "includeSettings": true,
    "fileUrl": "https://cloudinary.com/...",
    "recordCount": 1500,
    "errorMessage": null,
    "createdBy": {
      "id": "user-id",
      "name": "Admin User",
      "email": "admin@example.com"
    },
    "createdAt": "2025-01-15T10:30:00Z",
    "completedAt": "2025-01-15T10:32:00Z"
  }
}
```

---

### 4. Download Backup

**Endpoint:** `GET /api/admin/backup/{id}/download`

**Description:** Download the backup file (JSON format).

**Response:** File stream with JSON content

**Headers:**
```
Content-Type: application/json
Content-Disposition: attachment; filename="backup-1234567890.json"
Content-Length: 1048576
```

---

### 5. Restore from Backup

**Endpoint:** `POST /api/admin/backup/{id}/restore`

**Description:** Restore database from a backup file. Supports preview mode and conflict resolution.

**Request Body:**
```json
{
  "preview": false,
  "conflictStrategy": "skip",
  "restoreProducts": true,
  "restoreOrders": false,
  "restoreCustomers": true,
  "restoreSettings": true
}
```

**Parameters:**
- `preview` (boolean) - Dry run mode, doesn't actually restore
- `conflictStrategy` (string) - "skip" or "overwrite" for existing records
- `restoreProducts` (boolean) - Restore products and categories
- `restoreOrders` (boolean) - Restore orders (use with caution)
- `restoreCustomers` (boolean) - Restore customer accounts
- `restoreSettings` (boolean) - Restore store settings

**Response:**
```json
{
  "message": "Restore completed",
  "results": {
    "preview": false,
    "products": {
      "created": 50,
      "updated": 20,
      "skipped": 10,
      "errors": []
    },
    "categories": {
      "created": 5,
      "updated": 2,
      "skipped": 0,
      "errors": []
    },
    "customers": {
      "created": 100,
      "updated": 0,
      "skipped": 5,
      "errors": []
    },
    "settings": {
      "created": 10,
      "updated": 5,
      "skipped": 0,
      "errors": []
    }
  }
}
```

**Important Notes:**
- Orders are intentionally NOT restored by default to prevent duplicate processing
- Use preview mode first to see what would be restored
- Conflict strategy "overwrite" will replace existing data
- Conflict strategy "skip" will preserve existing data

---

### 6. Delete Backup

**Endpoint:** `DELETE /api/admin/backup/{id}`

**Description:** Delete a backup file and database record.

**Response:**
```json
{
  "message": "Backup deleted successfully"
}
```

---

## Data Export API

### 1. List All Exports

**Endpoint:** `GET /api/admin/export`

**Description:** List all data exports with pagination and filtering.

**Query Parameters:**
- `page` (number, optional) - Page number (default: 1)
- `limit` (number, optional) - Items per page (default: 20)
- `type` (string, optional) - Filter by type: PRODUCTS, ORDERS, CUSTOMERS, CATEGORIES, INVENTORY
- `status` (string, optional) - Filter by status: PENDING, IN_PROGRESS, COMPLETED, FAILED

**Response:**
```json
{
  "exports": [
    {
      "id": "export-id",
      "type": "PRODUCTS",
      "format": "CSV",
      "status": "COMPLETED",
      "filename": "export-products-1234567890.csv",
      "fileUrl": "https://cloudinary.com/...",
      "fileSize": 524288,
      "recordCount": 250,
      "filters": null,
      "errorMessage": null,
      "createdBy": {
        "id": "user-id",
        "name": "Admin User",
        "email": "admin@example.com"
      },
      "createdAt": "2025-01-15T11:00:00Z",
      "completedAt": "2025-01-15T11:01:00Z",
      "expiresAt": "2025-01-22T11:01:00Z"
    }
  ],
  "total": 30,
  "page": 1,
  "limit": 20,
  "totalPages": 2
}
```

---

### 2. Create Export

**Endpoint:** `POST /api/admin/export`

**Description:** Create a new data export job. Processing happens asynchronously.

**Request Body:**
```json
{
  "type": "PRODUCTS",
  "format": "CSV",
  "filters": {
    "categoryId": "category-id",
    "published": true
  }
}
```

**Parameters:**
- `type` (required) - Export type: PRODUCTS, ORDERS, CUSTOMERS, CATEGORIES, INVENTORY
- `format` (optional) - Export format: CSV or JSON (default: CSV)
- `filters` (optional) - Type-specific filters

**Filters by Type:**

**PRODUCTS:**
```json
{
  "categoryId": "category-id",
  "published": true,
  "featured": true
}
```

**ORDERS:**
```json
{
  "status": "COMPLETED",
  "startDate": "2025-01-01",
  "endDate": "2025-01-31"
}
```

**INVENTORY:**
```json
{
  "lowStock": true
}
```

**Response (201 Created):**
```json
{
  "export": {
    "id": "export-id",
    "status": "IN_PROGRESS",
    "message": "Export started. Check status at /api/admin/export/export-id"
  }
}
```

**Note:** Exports automatically expire after 7 days.

---

### 3. Get Export Details

**Endpoint:** `GET /api/admin/export/{id}`

**Description:** Get detailed information about a specific export.

**Response:**
```json
{
  "export": {
    "id": "export-id",
    "type": "PRODUCTS",
    "format": "CSV",
    "status": "COMPLETED",
    "filename": "export-products-1234567890.csv",
    "fileUrl": "https://cloudinary.com/...",
    "fileSize": 524288,
    "recordCount": 250,
    "filters": "{\"categoryId\":\"cat-123\"}",
    "createdBy": {
      "id": "user-id",
      "name": "Admin User",
      "email": "admin@example.com"
    },
    "createdAt": "2025-01-15T11:00:00Z",
    "completedAt": "2025-01-15T11:01:00Z",
    "expiresAt": "2025-01-22T11:01:00Z"
  }
}
```

---

### 4. Download Export

**Endpoint:** `GET /api/admin/export/{id}/download`

**Description:** Download the exported file.

**Response:** File stream with CSV or JSON content

**Headers:**
```
Content-Type: text/csv (or application/json)
Content-Disposition: attachment; filename="export-products-1234567890.csv"
Content-Length: 524288
```

**Response Codes:**
- `410 Gone` - Export file has expired

---

### 5. Download Import Template

**Endpoint:** `GET /api/admin/export/{type}/template`

**Description:** Download a CSV template for importing data of the specified type.

**Parameters:**
- `{type}` - One of: products, orders, customers, categories, inventory

**Example:** `GET /api/admin/export/products/template`

**Response:** CSV file with headers and one sample row

**Products Template:**
```csv
SKU,Name,Price,Compare Price,Stock,Category,Published,Featured,Description,Created At
SAMPLE-SKU-001,Sample Product Name,99.99,,100,Sample Category,Yes,,,
```

---

### 6. Delete Export

**Endpoint:** `DELETE /api/admin/export/{id}`

**Description:** Delete an export file and database record.

**Response:**
```json
{
  "message": "Export deleted successfully"
}
```

---

## Data Import API

### 1. List All Imports

**Endpoint:** `GET /api/admin/import`

**Description:** List all data imports with pagination and filtering.

**Query Parameters:**
- `page` (number, optional) - Page number (default: 1)
- `limit` (number, optional) - Items per page (default: 20)
- `type` (string, optional) - Filter by type: PRODUCTS, ORDERS, CUSTOMERS, CATEGORIES, INVENTORY
- `status` (string, optional) - Filter by status: PENDING, VALIDATING, IN_PROGRESS, COMPLETED, FAILED, PARTIAL

**Response:**
```json
{
  "imports": [
    {
      "id": "import-id",
      "type": "PRODUCTS",
      "format": "CSV",
      "mode": "UPSERT",
      "status": "COMPLETED",
      "filename": "products-import.csv",
      "fileUrl": "https://cloudinary.com/...",
      "fileSize": 102400,
      "totalRows": 100,
      "successCount": 95,
      "failedCount": 3,
      "skippedCount": 2,
      "errors": null,
      "isPreview": false,
      "createdBy": {
        "id": "user-id",
        "name": "Admin User",
        "email": "admin@example.com"
      },
      "createdAt": "2025-01-15T12:00:00Z",
      "completedAt": "2025-01-15T12:05:00Z"
    }
  ],
  "total": 15,
  "page": 1,
  "limit": 20,
  "totalPages": 1
}
```

---

### 2. Upload Import File

**Endpoint:** `POST /api/admin/import`

**Description:** Upload a file for import. File is validated before processing.

**Content-Type:** `multipart/form-data`

**Form Fields:**
- `file` (required) - CSV or JSON file
- `type` (required) - Import type: PRODUCTS, ORDERS, CUSTOMERS, CATEGORIES, INVENTORY
- `mode` (optional) - Import mode: CREATE, UPDATE, or UPSERT (default: CREATE)

**Import Modes:**
- `CREATE` - Only create new records, skip existing ones
- `UPDATE` - Only update existing records, skip new ones
- `UPSERT` - Create new records or update existing ones

**Example Request (using curl):**
```bash
curl -X POST http://localhost:3000/api/admin/import \
  -H "Authorization: Bearer {token}" \
  -F "file=@products.csv" \
  -F "type=PRODUCTS" \
  -F "mode=UPSERT"
```

**Response (201 Created):**
```json
{
  "import": {
    "id": "import-id",
    "type": "PRODUCTS",
    "format": "CSV",
    "mode": "UPSERT",
    "status": "PENDING",
    "filename": "products-import.csv",
    "fileUrl": "https://cloudinary.com/...",
    "fileSize": 102400,
    "createdAt": "2025-01-15T12:00:00Z"
  },
  "message": "File uploaded successfully. Validate at /api/admin/import/import-id/validate"
}
```

---

### 3. Validate Import

**Endpoint:** `POST /api/admin/import/{id}/validate`

**Description:** Validate import file without actually importing data. Checks for errors, duplicates, and provides preview.

**Response:**
```json
{
  "valid": true,
  "results": {
    "totalRows": 100,
    "validRows": 98,
    "invalidRows": 2,
    "warnings": [
      "5 SKUs already exist in database. Use UPDATE or UPSERT mode."
    ],
    "errors": [
      "Row 45: Valid price is required",
      "Row 67: SKU is required"
    ],
    "preview": [
      {
        "SKU": "PROD-001",
        "Name": "Product 1",
        "Price": "99.99",
        "Stock": "50"
      },
      {
        "SKU": "PROD-002",
        "Name": "Product 2",
        "Price": "149.99",
        "Stock": "25"
      }
    ]
  },
  "message": "Validation passed. Ready to process."
}
```

**Validation Checks:**
- Required fields are present
- Data types are correct (numbers for prices/stock)
- Email format is valid
- Duplicate detection within file
- Existing record detection in database
- Foreign key validation (categories exist, etc.)

---

### 4. Process Import

**Endpoint:** `POST /api/admin/import/{id}/process`

**Description:** Process and import validated data into the database.

**Response:**
```json
{
  "message": "Import completed",
  "results": {
    "total": 100,
    "success": 95,
    "failed": 3,
    "skipped": 2,
    "errors": [
      {
        "row": 45,
        "error": "Category 'Electronics' not found"
      },
      {
        "row": 67,
        "error": "Duplicate SKU in database"
      },
      {
        "row": 89,
        "error": "Invalid price format"
      }
    ]
  }
}
```

**Processing Notes:**
- Uses database transactions for data integrity
- Rolls back all changes if critical error occurs
- Tracks success, failure, and skip counts
- Provides detailed error messages with row numbers
- Updates import status to COMPLETED, PARTIAL, or FAILED

---

### 5. Get Import Details

**Endpoint:** `GET /api/admin/import/{id}`

**Description:** Get detailed information about a specific import.

**Response:**
```json
{
  "import": {
    "id": "import-id",
    "type": "PRODUCTS",
    "format": "CSV",
    "mode": "UPSERT",
    "status": "COMPLETED",
    "filename": "products-import.csv",
    "fileUrl": "https://cloudinary.com/...",
    "fileSize": 102400,
    "totalRows": 100,
    "successCount": 95,
    "failedCount": 3,
    "skippedCount": 2,
    "errors": [
      {
        "row": 45,
        "error": "Category not found"
      }
    ],
    "createdBy": {
      "id": "user-id",
      "name": "Admin User",
      "email": "admin@example.com"
    },
    "createdAt": "2025-01-15T12:00:00Z",
    "completedAt": "2025-01-15T12:05:00Z"
  }
}
```

---

### 6. Delete Import

**Endpoint:** `DELETE /api/admin/import/{id}`

**Description:** Delete an import record and uploaded file.

**Response:**
```json
{
  "message": "Import deleted successfully"
}
```

**Note:** Cannot delete imports that are currently IN_PROGRESS or VALIDATING.

---

## Supported Data Types

### 1. Products Export/Import

**CSV Columns:**
- SKU (required)
- Name (required)
- Price (required, decimal)
- Compare Price (optional, decimal)
- Stock (required, integer)
- Category (optional, string)
- Published (optional, Yes/No)
- Featured (optional, Yes/No)
- Description (optional, text)
- Created At (auto-generated)

### 2. Orders Export

**CSV Columns:**
- Order Number
- Date
- Customer Email
- Status (PENDING, PROCESSING, SHIPPED, DELIVERED, CANCELLED)
- Payment Status (PENDING, PAID, FAILED, REFUNDED)
- Total
- Items (count)
- Tracking Number

**Note:** Orders are exported but not imported to prevent duplicate processing.

### 3. Customers Export/Import

**CSV Columns:**
- Email (required)
- Name (required)
- Total Orders (auto-calculated)
- Total Spent (auto-calculated)
- Created At (auto-generated)
- Email Verified (Yes/No)

### 4. Categories Export/Import

**CSV Columns:**
- Name (required)
- Slug (required)
- Description (optional)
- Parent Category (optional)
- Product Count (auto-calculated)

### 5. Inventory Export/Import

**CSV Columns:**
- SKU (required)
- Product Name
- Current Stock (required, integer)
- Alert Threshold (optional)
- Category
- Price
- Last Updated

---

## File Formats

### CSV Format
- UTF-8 encoding
- Comma-separated values
- Double quotes for fields containing commas or newlines
- First row must contain headers
- Empty fields are allowed for optional columns

### JSON Format
- UTF-8 encoding
- Array of objects
- Each object represents one record
- Property names match CSV headers
- Supports nested objects and arrays

---

## Error Handling

### Common Error Responses

**400 Bad Request**
```json
{
  "error": "Invalid export type"
}
```

**401 Unauthorized**
```json
{
  "error": "Unauthorized"
}
```

**403 Forbidden**
```json
{
  "error": "Insufficient permissions"
}
```

**404 Not Found**
```json
{
  "error": "Backup not found"
}
```

**410 Gone**
```json
{
  "error": "Export file has expired"
}
```

**500 Internal Server Error**
```json
{
  "error": "Internal server error",
  "message": "Detailed error message"
}
```

---

## Examples

### Complete Backup Workflow

```javascript
// 1. Create backup
const createResponse = await fetch('/api/admin/backup', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    type: 'MANUAL',
    includeProducts: true,
    includeOrders: true,
    includeCustomers: true,
    includeSettings: true
  })
});
const { backup } = await createResponse.json();
const backupId = backup.id;

// 2. Check status
const statusResponse = await fetch(`/api/admin/backup/${backupId}`);
const { backup: backupInfo } = await statusResponse.json();

if (backupInfo.status === 'COMPLETED') {
  // 3. Download backup
  window.location.href = `/api/admin/backup/${backupId}/download`;
}
```

### Complete Export Workflow

```javascript
// 1. Create export
const exportResponse = await fetch('/api/admin/export', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    type: 'PRODUCTS',
    format: 'CSV',
    filters: { categoryId: 'cat-123' }
  })
});
const { export: exportInfo } = await exportResponse.json();
const exportId = exportInfo.id;

// 2. Poll for completion
const checkStatus = async () => {
  const response = await fetch(`/api/admin/export/${exportId}`);
  const { export: exp } = await response.json();

  if (exp.status === 'COMPLETED') {
    // 3. Download file
    window.location.href = `/api/admin/export/${exportId}/download`;
  } else if (exp.status === 'FAILED') {
    console.error('Export failed:', exp.errorMessage);
  }
};

// Check every 2 seconds
const interval = setInterval(checkStatus, 2000);
```

### Complete Import Workflow

```javascript
// 1. Upload file
const formData = new FormData();
formData.append('file', fileInput.files[0]);
formData.append('type', 'PRODUCTS');
formData.append('mode', 'UPSERT');

const uploadResponse = await fetch('/api/admin/import', {
  method: 'POST',
  body: formData
});
const { import: importInfo } = await uploadResponse.json();
const importId = importInfo.id;

// 2. Validate
const validateResponse = await fetch(`/api/admin/import/${importId}/validate`, {
  method: 'POST'
});
const { valid, results } = await validateResponse.json();

if (!valid) {
  console.error('Validation failed:', results.errors);
  return;
}

// 3. Show preview and warnings
console.log('Preview:', results.preview);
console.log('Warnings:', results.warnings);

// 4. Confirm and process
const confirmed = confirm('Continue with import?');
if (confirmed) {
  const processResponse = await fetch(`/api/admin/import/${importId}/process`, {
    method: 'POST'
  });
  const processResult = await processResponse.json();

  console.log('Import completed:', processResult.results);
}
```

### Download Template

```javascript
// Download import template for products
window.location.href = '/api/admin/export/products/template';
```

### Restore from Backup (with Preview)

```javascript
// 1. Preview restore
const previewResponse = await fetch(`/api/admin/backup/${backupId}/restore`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    preview: true,
    restoreProducts: true,
    restoreCustomers: true,
    restoreSettings: true
  })
});
const { results: previewResults } = await previewResponse.json();

console.log('Would restore:', previewResults);

// 2. Confirm and restore
const confirmed = confirm('Proceed with restore?');
if (confirmed) {
  const restoreResponse = await fetch(`/api/admin/backup/${backupId}/restore`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      preview: false,
      conflictStrategy: 'skip',
      restoreProducts: true,
      restoreCustomers: true,
      restoreSettings: true
    })
  });
  const { results } = await restoreResponse.json();

  console.log('Restore completed:', results);
}
```

---

## Best Practices

### Backups
1. Schedule regular automated backups
2. Test restore functionality periodically
3. Store backups in multiple locations (Cloudinary + local)
4. Include media files in critical backups
5. Never restore orders unless absolutely necessary
6. Always use preview mode before restoring

### Exports
1. Use filters to export specific data subsets
2. Export large datasets during off-peak hours
3. Clean up expired exports regularly
4. Download exports immediately after creation
5. Use CSV for compatibility, JSON for data structure

### Imports
1. Always download and use the template file
2. Validate data before uploading
3. Use preview/validation before processing
4. Start with small test imports
5. Use UPSERT mode for updates
6. Keep original files as backup
7. Review error messages carefully
8. Process during low-traffic periods

---

## Rate Limiting & Performance

- Backup creation: ~2-5 minutes for average database
- Export creation: ~30 seconds - 2 minutes depending on size
- Import validation: ~10-30 seconds
- Import processing: ~1-5 minutes for 1000 records
- All operations use async processing to prevent timeouts
- File size limit: 50MB (configurable in Cloudinary)

---

## Security Considerations

1. All endpoints require SUPERADMIN authentication
2. Files are stored securely in Cloudinary
3. Passwords are never included in exports/backups
4. Sensitive data can be excluded from backups
5. All operations are logged in activity log
6. Import validation prevents SQL injection
7. File upload validation prevents malicious files
8. Export files expire after 7 days

---

## Troubleshooting

### Backup fails with "Timeout"
- Reduce scope by excluding media or orders
- Increase timeout in backup route.ts

### Export shows as IN_PROGRESS forever
- Check server logs for errors
- Restart the export job
- Reduce data size with filters

### Import validation fails
- Check CSV format and encoding (must be UTF-8)
- Ensure headers match template exactly
- Verify required fields are not empty
- Check for special characters in data

### Restore conflicts
- Use preview mode to see conflicts
- Choose appropriate conflict strategy
- Consider manual data migration for complex cases

---

## Support

For issues or questions:
1. Check server logs for detailed error messages
2. Verify file formats match templates
3. Test with small datasets first
4. Review API documentation
5. Contact development team

---

**Version:** 1.0
**Last Updated:** 2025-01-15
**API Base URL:** `/api/admin`
**Authentication:** SUPERADMIN role required
