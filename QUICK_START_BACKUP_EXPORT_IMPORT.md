# Quick Start Guide - Backup, Export & Import

## Quick Reference for API Usage

### Authentication
All endpoints require SUPERADMIN role. Include authentication headers:
```javascript
headers: {
  'Authorization': 'Bearer YOUR_TOKEN'
}
```

---

## Backup Operations

### Create Backup
```javascript
POST /api/admin/backup
{
  "type": "MANUAL",
  "includeProducts": true,
  "includeOrders": true,
  "includeCustomers": true,
  "includeMedia": false,
  "includeSettings": true
}
```

### List Backups
```javascript
GET /api/admin/backup?page=1&limit=20
```

### Download Backup
```javascript
GET /api/admin/backup/{id}/download
```

### Restore with Preview
```javascript
POST /api/admin/backup/{id}/restore
{
  "preview": true,
  "conflictStrategy": "skip",
  "restoreProducts": true,
  "restoreCustomers": true
}
```

---

## Export Operations

### Create Export
```javascript
POST /api/admin/export
{
  "type": "PRODUCTS",
  "format": "CSV",
  "filters": {
    "categoryId": "cat-123"
  }
}
```

**Export Types:** PRODUCTS, ORDERS, CUSTOMERS, CATEGORIES, INVENTORY

### Download Export
```javascript
GET /api/admin/export/{id}/download
```

### Download Template
```javascript
GET /api/admin/export/products/template
GET /api/admin/export/customers/template
GET /api/admin/export/categories/template
GET /api/admin/export/inventory/template
```

---

## Import Operations

### Upload File
```javascript
POST /api/admin/import
Content-Type: multipart/form-data

FormData:
- file: [CSV or JSON file]
- type: "PRODUCTS"
- mode: "UPSERT"
```

**Import Modes:**
- `CREATE` - Only create new records
- `UPDATE` - Only update existing records
- `UPSERT` - Create or update

### Validate Import
```javascript
POST /api/admin/import/{id}/validate
```

Response includes:
- Validation results
- Error list with row numbers
- Preview of first 5 rows
- Warnings about duplicates

### Process Import
```javascript
POST /api/admin/import/{id}/process
```

Response includes:
- Success count
- Failed count
- Skipped count
- Detailed error list

---

## CSV Format Examples

### Products CSV
```csv
SKU,Name,Price,Compare Price,Stock,Category,Published,Featured,Description
PROD-001,Product 1,99.99,149.99,100,Electronics,Yes,No,Product description
PROD-002,Product 2,149.99,,50,Electronics,Yes,Yes,Another product
```

### Customers CSV
```csv
Email,Name,Total Orders,Total Spent,Created At
john@example.com,John Doe,5,500.00,2025-01-01T00:00:00Z
jane@example.com,Jane Smith,3,300.00,2025-01-02T00:00:00Z
```

### Categories CSV
```csv
Name,Slug,Description,Parent Category
Electronics,electronics,Electronic devices,
Computers,computers,Computer equipment,Electronics
```

### Inventory CSV
```csv
SKU,Product Name,Current Stock,Alert Threshold,Category,Price
PROD-001,Product 1,100,10,Electronics,99.99
PROD-002,Product 2,50,5,Electronics,149.99
```

---

## Complete Workflow Examples

### 1. Export Products, Modify, and Re-Import

```javascript
// Step 1: Export all products
const exportRes = await fetch('/api/admin/export', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    type: 'PRODUCTS',
    format: 'CSV'
  })
});
const { export: exp } = await exportRes.json();

// Step 2: Wait for completion and download
// (Check status endpoint until status is COMPLETED)
window.location.href = `/api/admin/export/${exp.id}/download`;

// Step 3: Modify the CSV file (update prices, stock, etc.)

// Step 4: Upload modified file
const formData = new FormData();
formData.append('file', modifiedFile);
formData.append('type', 'PRODUCTS');
formData.append('mode', 'UPDATE');

const uploadRes = await fetch('/api/admin/import', {
  method: 'POST',
  body: formData
});
const { import: imp } = await uploadRes.json();

// Step 5: Validate
const validateRes = await fetch(`/api/admin/import/${imp.id}/validate`, {
  method: 'POST'
});
const { valid, results } = await validateRes.json();

// Step 6: Process if valid
if (valid) {
  const processRes = await fetch(`/api/admin/import/${imp.id}/process`, {
    method: 'POST'
  });
  const processResult = await processRes.json();
  console.log('Import completed:', processResult);
}
```

### 2. Daily Automated Backup

```javascript
// Create daily backup (can be triggered by cron job)
async function createDailyBackup() {
  const res = await fetch('/api/admin/backup', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      type: 'SCHEDULED',
      includeProducts: true,
      includeOrders: true,
      includeCustomers: true,
      includeSettings: true
    })
  });

  const { backup } = await res.json();

  // Store backup ID for later retrieval
  console.log('Backup created:', backup.id);

  return backup.id;
}
```

### 3. Import New Products

```javascript
// Download template first
window.location.href = '/api/admin/export/products/template';

// Fill in the CSV with product data

// Upload and process
const formData = new FormData();
formData.append('file', csvFile);
formData.append('type', 'PRODUCTS');
formData.append('mode', 'CREATE');

const uploadRes = await fetch('/api/admin/import', {
  method: 'POST',
  body: formData
});

const { import: imp } = await uploadRes.json();

// Validate
await fetch(`/api/admin/import/${imp.id}/validate`, { method: 'POST' });

// Process
const result = await fetch(`/api/admin/import/${imp.id}/process`, { method: 'POST' });
console.log('Import result:', await result.json());
```

---

## Status Codes

| Code | Meaning |
|------|---------|
| 200 | Success |
| 201 | Created |
| 400 | Bad Request - Invalid input |
| 401 | Unauthorized - Not authenticated |
| 403 | Forbidden - Not SUPERADMIN |
| 404 | Not Found |
| 410 | Gone - File expired |
| 500 | Server Error |

---

## Common Import Errors

| Error | Solution |
|-------|----------|
| "Row X: SKU is required" | Add SKU value in column |
| "Row X: Valid price is required" | Ensure price is numeric |
| "Row X: Invalid email format" | Fix email format |
| "Duplicate SKUs found" | Remove duplicates or use UPDATE/UPSERT |
| "Category 'X' not found" | Create category first or use existing |

---

## Tips & Best Practices

### Backups
- Schedule automated backups daily
- Test restore process monthly
- Keep multiple backup versions
- Store backups in multiple locations

### Exports
- Use filters for large datasets
- CSV for spreadsheet editing
- JSON for programmatic access
- Clean up expired exports

### Imports
- Always download template first
- Validate before processing
- Start with small test imports
- Use UPSERT for safety
- Review validation results carefully

---

## File Locations

### API Routes
```
src/app/api/admin/
├── backup/
│   ├── route.ts (GET, POST)
│   └── [id]/
│       ├── route.ts (GET, DELETE)
│       ├── download/route.ts (GET)
│       └── restore/route.ts (POST)
├── export/
│   ├── route.ts (GET, POST)
│   ├── [id]/
│   │   ├── route.ts (GET, DELETE)
│   │   └── download/route.ts (GET)
│   └── [type]/
│       └── template/route.ts (GET)
└── import/
    ├── route.ts (GET, POST)
    └── [id]/
        ├── route.ts (GET, DELETE)
        ├── validate/route.ts (POST)
        └── process/route.ts (POST)
```

### Utilities
```
src/lib/
└── export-utils.ts
```

### Documentation
```
BACKUP_EXPORT_IMPORT_API.md         # Full API docs
BACKUP_EXPORT_IMPORT_SUMMARY.md     # Implementation summary
QUICK_START_BACKUP_EXPORT_IMPORT.md # This file
```

---

## Need Help?

1. Check full API documentation: `BACKUP_EXPORT_IMPORT_API.md`
2. Review implementation details: `BACKUP_EXPORT_IMPORT_SUMMARY.md`
3. Check server logs for detailed errors
4. Test with small datasets first
5. Use preview/validation modes

---

**Version:** 1.0
**Last Updated:** 2025-01-15
