# Inventory Management API Documentation

## Overview

This document provides comprehensive documentation for all Inventory Management API endpoints in the ecommerce platform. All endpoints require admin authentication and appropriate permissions.

## Authentication & Permissions

All endpoints require:
- **Authentication**: Valid admin session (ADMIN, MANAGER, SUPERADMIN)
- **Permissions**: Specific resource permissions (INVENTORY, SUPPLIER, PURCHASE_ORDER, STOCK_ALERT)
- **Activity Logging**: All actions are automatically logged in AdminActivityLog

## Endpoints Summary

### Inventory Management
1. Stock History - `/api/admin/inventory/stock-history`
2. Bulk Update - `/api/admin/inventory/bulk-update`
3. Low Stock - `/api/admin/inventory/low-stock`
4. Stock Alerts - `/api/admin/inventory/alerts/[productId]`
5. Reports - `/api/admin/inventory/reports`

### Supplier Management
6. Suppliers List - `/api/admin/suppliers`
7. Single Supplier - `/api/admin/suppliers/[id]`

### Purchase Orders
8. Purchase Orders List - `/api/admin/purchase-orders`
9. Single Purchase Order - `/api/admin/purchase-orders/[id]`
10. Receive Purchase Order - `/api/admin/purchase-orders/[id]/receive`

---

## 1. Stock History

### GET `/api/admin/inventory/stock-history`

List all stock history records with filtering and pagination.

**Required Permission**: `INVENTORY:VIEW`

**Query Parameters**:
- `page` (number, default: 1) - Page number
- `limit` (number, default: 50) - Items per page
- `productId` (string, optional) - Filter by product
- `variantId` (string, optional) - Filter by variant
- `changeType` (StockChangeType, optional) - Filter by change type
- `supplierId` (string, optional) - Filter by supplier
- `startDate` (ISO date, optional) - Start date filter
- `endDate` (ISO date, optional) - End date filter

**Change Types**:
- `SALE` - Stock decreased due to sale
- `REFUND` - Stock increased due to refund
- `RESTOCK` - Stock increased from supplier
- `ADJUSTMENT` - Manual adjustment
- `DAMAGE` - Stock decreased due to damage
- `RETURN` - Stock increased from customer return
- `TRANSFER` - Stock transferred between locations

**Response**:
```json
{
  "history": [
    {
      "id": "clx...",
      "productId": "clx...",
      "variantId": null,
      "changeType": "RESTOCK",
      "quantityBefore": 10,
      "quantityAfter": 60,
      "quantityChange": 50,
      "reason": "Received from PO PO-000001",
      "notes": null,
      "supplierId": "clx...",
      "userId": "clx...",
      "createdAt": "2025-01-20T10:00:00.000Z",
      "product": {
        "id": "clx...",
        "name": "Product Name",
        "sku": "SKU-001",
        "slug": "product-name"
      },
      "supplier": {
        "id": "clx...",
        "name": "Supplier Name",
        "contactName": "John Doe"
      },
      "user": {
        "id": "clx...",
        "name": "Admin User",
        "email": "admin@example.com",
        "role": "ADMIN"
      }
    }
  ],
  "total": 100,
  "page": 1,
  "limit": 50,
  "totalPages": 2
}
```

---

## 2. Bulk Inventory Update

### POST `/api/admin/inventory/bulk-update`

Update stock for multiple products at once.

**Required Permission**: `INVENTORY:UPDATE`

**Request Body**:
```json
{
  "updates": [
    {
      "productId": "clx...",
      "variantId": "clx...", // Optional
      "quantity": 50,
      "changeType": "RESTOCK",
      "reason": "Weekly restock"
    },
    {
      "productId": "clx...",
      "quantity": 5,
      "changeType": "DAMAGE",
      "reason": "Damaged items removed"
    }
  ],
  "supplierId": "clx..." // Optional - for RESTOCK operations
}
```

**Validation**:
- Maximum 100 items per request
- Each item must have `productId`, `quantity`, and `changeType`
- Stock cannot go negative
- Quantity must be positive for increases, negative for decreases

**Response**:
```json
{
  "success": true,
  "results": {
    "success": 2,
    "failed": 0,
    "errors": []
  },
  "message": "Successfully updated 2 items. 0 failed."
}
```

**Features**:
- Atomic transaction - all updates succeed or all fail
- Automatic StockHistory record creation
- Activity logging
- Stock validation (prevents negative stock)

---

## 3. Low Stock Alerts

### GET `/api/admin/inventory/low-stock`

Get all products with stock below threshold.

**Required Permission**: `INVENTORY:VIEW`

**Query Parameters**:
- `page` (number, default: 1)
- `limit` (number, default: 50)
- `threshold` (number, default: 10) - Default threshold for products without alerts

**Response**:
```json
{
  "products": [
    {
      "id": "clx...",
      "name": "Product Name",
      "slug": "product-name",
      "sku": "SKU-001",
      "stock": 3,
      "threshold": 10,
      "belowThresholdBy": 7,
      "category": {
        "id": "clx...",
        "name": "Category Name",
        "slug": "category-name"
      },
      "variants": [],
      "hasAlert": true
    }
  ],
  "variants": [
    {
      "id": "clx...",
      "sku": "SKU-001-RED",
      "stock": 2,
      "optionValues": "[\"Red\", \"Medium\"]",
      "product": {
        "id": "clx...",
        "name": "Product Name",
        "slug": "product-name",
        "sku": "SKU-001"
      }
    }
  ],
  "total": 15,
  "page": 1,
  "limit": 50,
  "totalPages": 1,
  "defaultThreshold": 10,
  "summary": {
    "totalLowStockProducts": 15,
    "totalLowStockVariants": 8,
    "criticalStock": 3
  }
}
```

---

## 4. Stock Alert Management

### PATCH `/api/admin/inventory/alerts/[productId]`

Update stock alert threshold for a product.

**Required Permission**: `STOCK_ALERT:UPDATE`

**Request Body**:
```json
{
  "threshold": 15,
  "notified": false
}
```

**Response**:
```json
{
  "alert": {
    "id": "clx...",
    "productId": "clx...",
    "threshold": 15,
    "notified": false,
    "createdAt": "2025-01-20T10:00:00.000Z",
    "updatedAt": "2025-01-20T11:00:00.000Z"
  },
  "product": {
    "id": "clx...",
    "name": "Product Name",
    "sku": "SKU-001"
  }
}
```

### POST `/api/admin/inventory/alerts/[productId]`

Create new stock alert for a product.

**Required Permission**: `STOCK_ALERT:CREATE`

**Request Body**:
```json
{
  "threshold": 10
}
```

**Response**: Same as PATCH (status: 201)

### DELETE `/api/admin/inventory/alerts/[productId]`

Delete stock alert for a product.

**Required Permission**: `STOCK_ALERT:DELETE`

**Response**:
```json
{
  "success": true,
  "message": "Stock alert deleted successfully"
}
```

---

## 5. Inventory Reports

### GET `/api/admin/inventory/reports`

Generate comprehensive inventory reports.

**Required Permissions**: `INVENTORY:VIEW`, `ANALYTICS:VIEW`

**Query Parameters**:
- `type` (required) - Report type: `current-stock`, `low-stock`, `valuation`, `movement`
- `startDate` (ISO date, optional) - For movement reports
- `endDate` (ISO date, optional) - For movement reports
- `categoryId` (string, optional) - Filter by category

### Report Types

#### 1. Current Stock Report (`type=current-stock`)

```json
{
  "report": {
    "type": "current-stock",
    "summary": {
      "totalProducts": 150,
      "totalStock": 5420,
      "totalVariants": 320,
      "totalVariantStock": 2100,
      "productsInStock": 140,
      "productsOutOfStock": 10,
      "productsLowStock": 15
    },
    "products": [...]
  },
  "generatedAt": "2025-01-20T10:00:00.000Z",
  "generatedBy": {...}
}
```

#### 2. Low Stock Report (`type=low-stock`)

Returns products below their alert thresholds.

#### 3. Valuation Report (`type=valuation`)

```json
{
  "report": {
    "type": "valuation",
    "summary": {
      "totalProducts": 150,
      "totalInventoryValue": 125430.50,
      "averageProductValue": 836.20
    },
    "products": [
      {
        "id": "clx...",
        "name": "Product Name",
        "stock": 50,
        "price": 99.99,
        "productValue": 4999.50,
        "variantsValue": 1500.00,
        "totalValue": 6499.50
      }
    ]
  }
}
```

#### 4. Movement Report (`type=movement`)

```json
{
  "report": {
    "type": "movement",
    "period": {
      "startDate": "2025-01-01T00:00:00.000Z",
      "endDate": "2025-01-31T23:59:59.999Z"
    },
    "summary": {
      "totalMovements": 450,
      "byChangeType": {
        "SALE": { "count": 200, "totalChange": -850 },
        "RESTOCK": { "count": 50, "totalChange": 2000 },
        "REFUND": { "count": 20, "totalChange": 45 }
      },
      "totalStockIn": 2045,
      "totalStockOut": 850
    },
    "chartData": [
      {
        "date": "2025-01-20",
        "in": 150,
        "out": 45
      }
    ],
    "movements": [...]
  }
}
```

---

## 6. Supplier Management

### GET `/api/admin/suppliers`

List all suppliers with pagination.

**Required Permission**: `SUPPLIER:VIEW`

**Query Parameters**:
- `page` (number, default: 1)
- `limit` (number, default: 20)
- `search` (string, optional) - Search by name, contact name, or email
- `isActive` (boolean, optional) - Filter by active status

**Response**:
```json
{
  "suppliers": [
    {
      "id": "clx...",
      "name": "Supplier Name",
      "contactName": "John Doe",
      "email": "supplier@example.com",
      "phone": "+1234567890",
      "address": "123 Main St, City, Country",
      "website": "https://supplier.com",
      "notes": "Preferred supplier for electronics",
      "isActive": true,
      "createdAt": "2025-01-01T00:00:00.000Z",
      "updatedAt": "2025-01-20T10:00:00.000Z",
      "_count": {
        "purchaseOrders": 25,
        "stockHistory": 150
      }
    }
  ],
  "total": 10,
  "page": 1,
  "limit": 20,
  "totalPages": 1
}
```

### POST `/api/admin/suppliers`

Create a new supplier.

**Required Permission**: `SUPPLIER:CREATE`

**Request Body**:
```json
{
  "name": "Supplier Name",
  "contactName": "John Doe",
  "email": "supplier@example.com",
  "phone": "+1234567890",
  "address": "123 Main St, City, Country",
  "website": "https://supplier.com",
  "notes": "Preferred supplier",
  "isActive": true
}
```

**Validation**:
- `name` is required
- `email` must be valid format if provided

**Response**: Created supplier object (status: 201)

---

## 7. Single Supplier Operations

### GET `/api/admin/suppliers/[id]`

Get detailed supplier information.

**Required Permission**: `SUPPLIER:VIEW`

**Response**:
```json
{
  "supplier": {
    "id": "clx...",
    "name": "Supplier Name",
    "contactName": "John Doe",
    "email": "supplier@example.com",
    "phone": "+1234567890",
    "address": "123 Main St",
    "website": "https://supplier.com",
    "notes": "Notes",
    "isActive": true,
    "createdAt": "2025-01-01T00:00:00.000Z",
    "updatedAt": "2025-01-20T10:00:00.000Z",
    "purchaseOrders": [
      {
        "id": "clx...",
        "orderNumber": "PO-000001",
        "status": "RECEIVED",
        "orderDate": "2025-01-15T00:00:00.000Z",
        "total": 5000.00
      }
    ],
    "stockHistory": [...],
    "_count": {
      "purchaseOrders": 25,
      "stockHistory": 150
    }
  }
}
```

### PATCH `/api/admin/suppliers/[id]`

Update supplier information.

**Required Permission**: `SUPPLIER:UPDATE`

**Request Body**: Any of the fields from POST (all optional)

**Response**: Updated supplier object

### DELETE `/api/admin/suppliers/[id]`

Delete a supplier.

**Required Permission**: `SUPPLIER:DELETE`

**Constraints**:
- Cannot delete suppliers with existing purchase orders or stock history
- Recommend deactivating instead with `isActive: false`

**Response**:
```json
{
  "success": true,
  "message": "Supplier deleted successfully"
}
```

---

## 8. Purchase Orders

### GET `/api/admin/purchase-orders`

List all purchase orders.

**Required Permission**: `PURCHASE_ORDER:VIEW`

**Query Parameters**:
- `page` (number, default: 1)
- `limit` (number, default: 20)
- `status` (PurchaseOrderStatus, optional)
- `supplierId` (string, optional)
- `search` (string, optional) - Search by order number

**Purchase Order Statuses**:
- `DRAFT` - Being created
- `PENDING` - Awaiting supplier confirmation
- `CONFIRMED` - Confirmed by supplier
- `SHIPPED` - In transit
- `RECEIVED` - Fully received
- `CANCELLED` - Cancelled

**Response**:
```json
{
  "purchaseOrders": [
    {
      "id": "clx...",
      "orderNumber": "PO-000001",
      "status": "RECEIVED",
      "orderDate": "2025-01-15T00:00:00.000Z",
      "expectedDate": "2025-01-25T00:00:00.000Z",
      "receivedDate": "2025-01-24T00:00:00.000Z",
      "subtotal": 4500.00,
      "tax": 360.00,
      "shipping": 140.00,
      "total": 5000.00,
      "notes": "Urgent order",
      "supplier": {
        "id": "clx...",
        "name": "Supplier Name",
        "contactName": "John Doe",
        "email": "supplier@example.com"
      },
      "createdBy": {
        "id": "clx...",
        "name": "Admin User",
        "email": "admin@example.com"
      },
      "items": [...],
      "_count": {
        "items": 5
      }
    }
  ],
  "total": 50,
  "page": 1,
  "limit": 20,
  "totalPages": 3
}
```

### POST `/api/admin/purchase-orders`

Create a new purchase order.

**Required Permission**: `PURCHASE_ORDER:CREATE`

**Request Body**:
```json
{
  "supplierId": "clx...",
  "expectedDate": "2025-02-01T00:00:00.000Z",
  "notes": "Priority order",
  "tax": 360.00,
  "shipping": 140.00,
  "items": [
    {
      "productId": "clx...",
      "variantId": "clx...", // Optional
      "quantity": 50,
      "unitCost": 45.00
    },
    {
      "productId": "clx...",
      "quantity": 100,
      "unitCost": 25.00
    }
  ]
}
```

**Validation**:
- `supplierId` and `items` are required
- Each item must have `productId`, `quantity`, and `unitCost`
- Quantity must be positive, unitCost must be non-negative

**Features**:
- Auto-generates order number (PO-000001, PO-000002, etc.)
- Automatically calculates subtotal and total
- Creates purchase order and items in single transaction
- Logs activity

**Response**: Created purchase order (status: 201)

---

## 9. Single Purchase Order Operations

### GET `/api/admin/purchase-orders/[id]`

Get detailed purchase order information.

**Required Permission**: `PURCHASE_ORDER:VIEW`

**Response**: Full purchase order with supplier, items, and product details

### PATCH `/api/admin/purchase-orders/[id]`

Update purchase order.

**Required Permission**: `PURCHASE_ORDER:UPDATE`

**Request Body**:
```json
{
  "status": "CONFIRMED",
  "expectedDate": "2025-02-05T00:00:00.000Z",
  "notes": "Updated notes",
  "items": [...] // Only allowed in DRAFT status
}
```

**Constraints**:
- Cannot update received orders
- Items can only be updated in DRAFT status
- Status must be valid PurchaseOrderStatus

**Response**: Updated purchase order

### DELETE `/api/admin/purchase-orders/[id]`

Delete a purchase order.

**Required Permission**: `PURCHASE_ORDER:DELETE`

**Constraints**:
- Can only delete orders in DRAFT or CANCELLED status
- Cannot delete received or confirmed orders

**Response**:
```json
{
  "success": true,
  "message": "Purchase order deleted successfully"
}
```

---

## 10. Receive Purchase Order

### POST `/api/admin/purchase-orders/[id]/receive`

Mark purchase order items as received and update inventory.

**Required Permissions**: `PURCHASE_ORDER:UPDATE`, `INVENTORY:UPDATE`

**Request Body**:
```json
{
  "items": [
    {
      "itemId": "clx...",
      "receivedQuantity": 50
    },
    {
      "itemId": "clx...",
      "receivedQuantity": 95
    }
  ],
  "partialReceive": true
}
```

**Validation**:
- Purchase order must be in CONFIRMED or SHIPPED status
- Cannot receive already RECEIVED orders
- Received quantity cannot exceed ordered quantity
- Received quantity must be non-negative

**Process**:
1. Updates `receivedQuantity` for each item
2. Increments product/variant stock by received quantity
3. Creates `StockHistory` record with type RESTOCK
4. If all items fully received, sets status to RECEIVED
5. Logs activity for both purchase order and inventory

**Response**:
```json
{
  "success": true,
  "purchaseOrder": {...},
  "stockUpdates": [
    {
      "productId": "clx...",
      "variantId": "clx...",
      "productName": "Product Name",
      "quantityChange": 50,
      "newStock": 150
    }
  ],
  "message": "Purchase order fully received and stock updated"
}
```

---

## Error Responses

All endpoints follow consistent error response format:

### 401 Unauthorized
```json
{
  "error": "Unauthorized"
}
```

### 403 Forbidden
```json
{
  "error": "Insufficient permissions"
}
```

### 404 Not Found
```json
{
  "error": "Resource not found"
}
```

### 400 Bad Request
```json
{
  "error": "Validation error message"
}
```

### 409 Conflict
```json
{
  "error": "Conflict message",
  "details": {...}
}
```

### 500 Internal Server Error
```json
{
  "error": "Internal server error"
}
```

---

## Best Practices

### 1. Stock Updates
- Always use bulk-update for multiple products
- Use appropriate changeType for accurate reporting
- Include reason/notes for audit trail

### 2. Purchase Orders
- Create in DRAFT status first
- Verify items before confirming
- Use partial receive for incomplete shipments
- Cannot modify after receiving - create new PO if needed

### 3. Stock Alerts
- Set realistic thresholds based on sales velocity
- Monitor low-stock report regularly
- Create purchase orders proactively

### 4. Reports
- Use movement reports to analyze trends
- Generate valuation reports monthly for accounting
- Export data for deeper analysis

### 5. Suppliers
- Deactivate instead of deleting
- Keep contact information updated
- Track performance via purchase orders

---

## Activity Logging

All inventory operations are automatically logged:

- **Resource**: INVENTORY, PURCHASE_ORDER, SUPPLIER, STOCK_ALERT
- **Actions**: CREATE, UPDATE, DELETE, VIEW
- **Details**: Includes relevant information about the operation
- **Metadata**: IP address, user agent, timestamp

Access logs via `/api/admin/activity-logs`

---

## Database Schema

### Key Models

**StockHistory**
- Tracks all stock changes
- Links to product, variant, supplier, user
- Immutable audit trail

**Supplier**
- Supplier information
- Linked to purchase orders and stock history

**PurchaseOrder**
- Header information
- Status workflow
- Financial totals

**PurchaseOrderItem**
- Line items
- Tracks ordered vs received quantity
- Product/variant references

**StockAlert**
- Per-product thresholds
- Notification tracking

---

## Permission Matrix

| Resource | SUPERADMIN | ADMIN | MANAGER | EDITOR | SUPPORT | VIEWER |
|----------|-----------|-------|---------|--------|---------|--------|
| INVENTORY | MANAGE | MANAGE | MANAGE | - | - | VIEW |
| SUPPLIER | MANAGE | MANAGE | VIEW | - | - | - |
| PURCHASE_ORDER | MANAGE | MANAGE | MANAGE | - | - | - |
| STOCK_ALERT | MANAGE | MANAGE | VIEW | VIEW | - | VIEW |

**MANAGE** = VIEW + CREATE + UPDATE + DELETE

---

## Testing

### Example Test Scenarios

1. **Create Supplier → Create PO → Receive PO**
   - Tests full workflow
   - Verifies stock updates

2. **Bulk Stock Update**
   - Test transaction rollback on error
   - Verify stock history creation

3. **Low Stock Alerts**
   - Set threshold
   - Update stock below threshold
   - Verify appears in low-stock report

4. **Reports Generation**
   - Generate all report types
   - Verify calculations
   - Test date filtering

---

## Migration & Setup

### Required Permissions Update

The permissions system has been updated to include:
- `INVENTORY` resource type
- `SUPPLIER` resource type
- `PURCHASE_ORDER` resource type

These are automatically assigned based on role in `src/lib/permissions.ts`.

### Database

All required models already exist in Prisma schema:
- StockHistory
- Supplier
- PurchaseOrder
- PurchaseOrderItem
- StockAlert

No migrations needed if schema is up to date.

---

## Support & Troubleshooting

### Common Issues

**Stock going negative:**
- Bulk update validates and prevents this
- Check stock before manual updates

**Cannot receive PO:**
- Verify status is CONFIRMED or SHIPPED
- Check item quantities don't exceed ordered

**Permission denied:**
- Verify user has correct role
- Check permission assignments in `/lib/permissions.ts`

**Report performance:**
- Use date ranges for movement reports
- Consider caching for large inventories
- Limit to specific categories if needed

---

## Version History

- **v1.0** (2025-01-24) - Initial release
  - All 10 endpoints implemented
  - Full CRUD operations
  - Comprehensive reporting
  - Activity logging
  - Permission system integrated

---

For questions or issues, contact the development team or check the admin activity logs for detailed operation history.
