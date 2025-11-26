# Inventory Management API - Quick Reference

## Endpoints at a Glance

### Inventory Management
```
GET    /api/admin/inventory/stock-history          - List stock history
POST   /api/admin/inventory/bulk-update            - Bulk update stock
GET    /api/admin/inventory/low-stock              - Get low stock products
PATCH  /api/admin/inventory/alerts/[productId]     - Update stock alert
POST   /api/admin/inventory/alerts/[productId]     - Create stock alert
DELETE /api/admin/inventory/alerts/[productId]     - Delete stock alert
GET    /api/admin/inventory/reports                - Generate reports
```

### Suppliers
```
GET    /api/admin/suppliers                        - List suppliers
POST   /api/admin/suppliers                        - Create supplier
GET    /api/admin/suppliers/[id]                   - Get supplier details
PATCH  /api/admin/suppliers/[id]                   - Update supplier
DELETE /api/admin/suppliers/[id]                   - Delete supplier
```

### Purchase Orders
```
GET    /api/admin/purchase-orders                  - List purchase orders
POST   /api/admin/purchase-orders                  - Create purchase order
GET    /api/admin/purchase-orders/[id]             - Get PO details
PATCH  /api/admin/purchase-orders/[id]             - Update purchase order
DELETE /api/admin/purchase-orders/[id]             - Delete purchase order
POST   /api/admin/purchase-orders/[id]/receive     - Receive purchase order
```

---

## Common Use Cases

### 1. Restock from Supplier
```bash
# Step 1: Create Purchase Order
POST /api/admin/purchase-orders
{
  "supplierId": "supplier-id",
  "items": [
    {"productId": "prod-id", "quantity": 100, "unitCost": 25.00}
  ]
}

# Step 2: Update Status to Confirmed
PATCH /api/admin/purchase-orders/[id]
{"status": "CONFIRMED"}

# Step 3: Receive Items
POST /api/admin/purchase-orders/[id]/receive
{
  "items": [
    {"itemId": "item-id", "receivedQuantity": 100}
  ]
}
```

### 2. Manual Stock Adjustment
```bash
POST /api/admin/inventory/bulk-update
{
  "updates": [
    {
      "productId": "prod-id",
      "quantity": 10,
      "changeType": "DAMAGE",
      "reason": "Damaged during shipping"
    }
  ]
}
```

### 3. Set Low Stock Alert
```bash
POST /api/admin/inventory/alerts/[productId]
{"threshold": 15}
```

### 4. Check Low Stock
```bash
GET /api/admin/inventory/low-stock?threshold=10
```

### 5. Generate Inventory Report
```bash
# Current Stock
GET /api/admin/inventory/reports?type=current-stock

# Movement Report (last 30 days)
GET /api/admin/inventory/reports?type=movement&startDate=2025-01-01&endDate=2025-01-31

# Valuation Report
GET /api/admin/inventory/reports?type=valuation

# Low Stock Report
GET /api/admin/inventory/reports?type=low-stock
```

---

## Stock Change Types

| Type | Effect | Use Case |
|------|--------|----------|
| `SALE` | Decrease | Order placed |
| `REFUND` | Increase | Order refunded |
| `RESTOCK` | Increase | Purchase order received |
| `ADJUSTMENT` | Decrease | Manual correction |
| `DAMAGE` | Decrease | Damaged inventory |
| `RETURN` | Increase | Customer return |
| `TRANSFER` | Decrease | Transfer to another location |

---

## Purchase Order Status Flow

```
DRAFT → PENDING → CONFIRMED → SHIPPED → RECEIVED
  ↓        ↓         ↓           ↓
  └────────┴─────────┴───────────→ CANCELLED
```

**Editable States**: DRAFT
**Receivable States**: CONFIRMED, SHIPPED
**Deletable States**: DRAFT, CANCELLED

---

## Permission Requirements

### Inventory Operations
- View: `INVENTORY:VIEW`
- Update: `INVENTORY:UPDATE`
- Reports: `INVENTORY:VIEW` + `ANALYTICS:VIEW`

### Supplier Operations
- View: `SUPPLIER:VIEW`
- Create: `SUPPLIER:CREATE`
- Update: `SUPPLIER:UPDATE`
- Delete: `SUPPLIER:DELETE`

### Purchase Order Operations
- View: `PURCHASE_ORDER:VIEW`
- Create: `PURCHASE_ORDER:CREATE`
- Update: `PURCHASE_ORDER:UPDATE`
- Delete: `PURCHASE_ORDER:DELETE`
- Receive: `PURCHASE_ORDER:UPDATE` + `INVENTORY:UPDATE`

### Stock Alert Operations
- View: `STOCK_ALERT:VIEW`
- Create: `STOCK_ALERT:CREATE`
- Update: `STOCK_ALERT:UPDATE`
- Delete: `STOCK_ALERT:DELETE`

---

## Quick Tips

### Stock Updates
- ✅ Use bulk-update for efficiency
- ✅ Include reason for audit trail
- ✅ Use correct changeType
- ❌ Don't allow negative stock
- ❌ Don't skip activity logging

### Purchase Orders
- ✅ Create in DRAFT first
- ✅ Verify supplier info
- ✅ Double-check quantities
- ❌ Don't modify after receiving
- ❌ Don't delete confirmed orders

### Stock Alerts
- ✅ Set realistic thresholds
- ✅ Monitor regularly
- ✅ Update when needed
- ❌ Don't ignore critical stock
- ❌ Don't set too high (unnecessary alerts)

### Reports
- ✅ Use date ranges for performance
- ✅ Filter by category when possible
- ✅ Export for deeper analysis
- ❌ Don't run without filters on large datasets

---

## Response Codes

| Code | Meaning | Action |
|------|---------|--------|
| 200 | Success | Request completed |
| 201 | Created | Resource created successfully |
| 400 | Bad Request | Check request validation |
| 401 | Unauthorized | Login required |
| 403 | Forbidden | Insufficient permissions |
| 404 | Not Found | Resource doesn't exist |
| 409 | Conflict | Resource state conflict |
| 500 | Server Error | Contact support |

---

## Files Created

All API endpoints are located in:

```
src/app/api/admin/
├── inventory/
│   ├── stock-history/route.ts
│   ├── bulk-update/route.ts
│   ├── low-stock/route.ts
│   ├── alerts/[productId]/route.ts
│   └── reports/route.ts
├── suppliers/
│   ├── route.ts
│   └── [id]/route.ts
└── purchase-orders/
    ├── route.ts
    ├── [id]/route.ts
    └── [id]/receive/route.ts
```

Updated permissions in:
```
src/lib/permissions.ts
```

---

## Testing Checklist

- [ ] Create supplier
- [ ] Create purchase order
- [ ] Update PO status to CONFIRMED
- [ ] Receive purchase order
- [ ] Verify stock increased
- [ ] Check stock history created
- [ ] Create stock alert
- [ ] Test bulk update
- [ ] Generate all report types
- [ ] Test low stock detection
- [ ] Verify activity logging
- [ ] Test permission checks
- [ ] Try invalid operations (should fail gracefully)

---

## Support

For detailed documentation, see: `INVENTORY_API_DOCUMENTATION.md`

For issues:
1. Check activity logs: `/api/admin/activity-logs`
2. Verify permissions: `/lib/permissions.ts`
3. Review Prisma schema: `/prisma/schema.prisma`
4. Check server logs for errors
