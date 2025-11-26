# Inventory Management API - Testing Examples

## Prerequisites

Set your authentication token:
```bash
export TOKEN="your-jwt-token-here"
export API_URL="http://localhost:3000"
```

---

## 1. Supplier Management

### Create a Supplier
```bash
curl -X POST "$API_URL/api/admin/suppliers" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Tech Supplies Inc",
    "contactName": "John Smith",
    "email": "john@techsupplies.com",
    "phone": "+1-555-0123",
    "address": "123 Tech Street, Silicon Valley, CA 94025",
    "website": "https://techsupplies.com",
    "notes": "Preferred supplier for electronics",
    "isActive": true
  }'
```

### List Suppliers
```bash
curl -X GET "$API_URL/api/admin/suppliers?page=1&limit=20&isActive=true" \
  -H "Authorization: Bearer $TOKEN"
```

### Get Supplier Details
```bash
curl -X GET "$API_URL/api/admin/suppliers/[supplier-id]" \
  -H "Authorization: Bearer $TOKEN"
```

### Update Supplier
```bash
curl -X PATCH "$API_URL/api/admin/suppliers/[supplier-id]" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "phone": "+1-555-9999",
    "notes": "Updated contact information"
  }'
```

### Deactivate Supplier
```bash
curl -X PATCH "$API_URL/api/admin/suppliers/[supplier-id]" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"isActive": false}'
```

---

## 2. Purchase Orders

### Create Purchase Order
```bash
curl -X POST "$API_URL/api/admin/purchase-orders" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "supplierId": "[supplier-id]",
    "expectedDate": "2025-02-15T00:00:00.000Z",
    "notes": "Quarterly electronics restock",
    "tax": 450.00,
    "shipping": 125.00,
    "items": [
      {
        "productId": "[product-id-1]",
        "quantity": 100,
        "unitCost": 25.50
      },
      {
        "productId": "[product-id-2]",
        "variantId": "[variant-id]",
        "quantity": 50,
        "unitCost": 45.00
      }
    ]
  }'
```

### List Purchase Orders
```bash
# All purchase orders
curl -X GET "$API_URL/api/admin/purchase-orders?page=1&limit=20" \
  -H "Authorization: Bearer $TOKEN"

# Filter by status
curl -X GET "$API_URL/api/admin/purchase-orders?status=CONFIRMED" \
  -H "Authorization: Bearer $TOKEN"

# Filter by supplier
curl -X GET "$API_URL/api/admin/purchase-orders?supplierId=[supplier-id]" \
  -H "Authorization: Bearer $TOKEN"
```

### Update Purchase Order Status
```bash
# Move to PENDING
curl -X PATCH "$API_URL/api/admin/purchase-orders/[po-id]" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"status": "PENDING"}'

# Confirm order
curl -X PATCH "$API_URL/api/admin/purchase-orders/[po-id]" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"status": "CONFIRMED"}'

# Mark as shipped
curl -X PATCH "$API_URL/api/admin/purchase-orders/[po-id]" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"status": "SHIPPED"}'
```

### Receive Purchase Order (Full)
```bash
curl -X POST "$API_URL/api/admin/purchase-orders/[po-id]/receive" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "items": [
      {
        "itemId": "[po-item-id-1]",
        "receivedQuantity": 100
      },
      {
        "itemId": "[po-item-id-2]",
        "receivedQuantity": 50
      }
    ]
  }'
```

### Receive Purchase Order (Partial)
```bash
curl -X POST "$API_URL/api/admin/purchase-orders/[po-id]/receive" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "items": [
      {
        "itemId": "[po-item-id-1]",
        "receivedQuantity": 80
      },
      {
        "itemId": "[po-item-id-2]",
        "receivedQuantity": 45
      }
    ],
    "partialReceive": true
  }'
```

---

## 3. Stock History

### List Stock History
```bash
# All history
curl -X GET "$API_URL/api/admin/inventory/stock-history?page=1&limit=50" \
  -H "Authorization: Bearer $TOKEN"

# Filter by product
curl -X GET "$API_URL/api/admin/inventory/stock-history?productId=[product-id]" \
  -H "Authorization: Bearer $TOKEN"

# Filter by change type
curl -X GET "$API_URL/api/admin/inventory/stock-history?changeType=RESTOCK" \
  -H "Authorization: Bearer $TOKEN"

# Filter by date range
curl -X GET "$API_URL/api/admin/inventory/stock-history?startDate=2025-01-01&endDate=2025-01-31" \
  -H "Authorization: Bearer $TOKEN"

# Filter by supplier
curl -X GET "$API_URL/api/admin/inventory/stock-history?supplierId=[supplier-id]" \
  -H "Authorization: Bearer $TOKEN"
```

---

## 4. Bulk Stock Updates

### Restock Multiple Products
```bash
curl -X POST "$API_URL/api/admin/inventory/bulk-update" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "updates": [
      {
        "productId": "[product-id-1]",
        "quantity": 50,
        "changeType": "RESTOCK",
        "reason": "Manual restock from warehouse"
      },
      {
        "productId": "[product-id-2]",
        "variantId": "[variant-id]",
        "quantity": 30,
        "changeType": "RESTOCK",
        "reason": "Manual restock from warehouse"
      }
    ],
    "supplierId": "[supplier-id]"
  }'
```

### Remove Damaged Stock
```bash
curl -X POST "$API_URL/api/admin/inventory/bulk-update" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "updates": [
      {
        "productId": "[product-id]",
        "quantity": 5,
        "changeType": "DAMAGE",
        "reason": "Water damage during storage"
      }
    ]
  }'
```

### Process Returns
```bash
curl -X POST "$API_URL/api/admin/inventory/bulk-update" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "updates": [
      {
        "productId": "[product-id]",
        "quantity": 3,
        "changeType": "RETURN",
        "reason": "Customer returns - restocking"
      }
    ]
  }'
```

### Manual Adjustment
```bash
curl -X POST "$API_URL/api/admin/inventory/bulk-update" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "updates": [
      {
        "productId": "[product-id]",
        "quantity": 2,
        "changeType": "ADJUSTMENT",
        "reason": "Physical inventory count correction"
      }
    ]
  }'
```

---

## 5. Stock Alerts

### Create Stock Alert
```bash
curl -X POST "$API_URL/api/admin/inventory/alerts/[product-id]" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"threshold": 15}'
```

### Update Stock Alert
```bash
curl -X PATCH "$API_URL/api/admin/inventory/alerts/[product-id]" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "threshold": 20,
    "notified": false
  }'
```

### Delete Stock Alert
```bash
curl -X DELETE "$API_URL/api/admin/inventory/alerts/[product-id]" \
  -H "Authorization: Bearer $TOKEN"
```

---

## 6. Low Stock Detection

### Get Low Stock Products
```bash
# Default threshold (10)
curl -X GET "$API_URL/api/admin/inventory/low-stock" \
  -H "Authorization: Bearer $TOKEN"

# Custom threshold
curl -X GET "$API_URL/api/admin/inventory/low-stock?threshold=20" \
  -H "Authorization: Bearer $TOKEN"

# With pagination
curl -X GET "$API_URL/api/admin/inventory/low-stock?page=1&limit=50&threshold=15" \
  -H "Authorization: Bearer $TOKEN"
```

---

## 7. Inventory Reports

### Current Stock Report
```bash
curl -X GET "$API_URL/api/admin/inventory/reports?type=current-stock" \
  -H "Authorization: Bearer $TOKEN"

# Filter by category
curl -X GET "$API_URL/api/admin/inventory/reports?type=current-stock&categoryId=[category-id]" \
  -H "Authorization: Bearer $TOKEN"
```

### Low Stock Report
```bash
curl -X GET "$API_URL/api/admin/inventory/reports?type=low-stock" \
  -H "Authorization: Bearer $TOKEN"
```

### Inventory Valuation Report
```bash
curl -X GET "$API_URL/api/admin/inventory/reports?type=valuation" \
  -H "Authorization: Bearer $TOKEN"
```

### Stock Movement Report
```bash
# Last 30 days (default)
curl -X GET "$API_URL/api/admin/inventory/reports?type=movement" \
  -H "Authorization: Bearer $TOKEN"

# Custom date range
curl -X GET "$API_URL/api/admin/inventory/reports?type=movement&startDate=2025-01-01&endDate=2025-01-31" \
  -H "Authorization: Bearer $TOKEN"

# Specific category
curl -X GET "$API_URL/api/admin/inventory/reports?type=movement&categoryId=[category-id]&startDate=2025-01-01" \
  -H "Authorization: Bearer $TOKEN"
```

---

## 8. Complete Workflow Example

### Full Purchase Order to Stock Update Workflow

```bash
# Step 1: Create supplier
SUPPLIER_RESPONSE=$(curl -s -X POST "$API_URL/api/admin/suppliers" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Electronics Wholesale",
    "contactName": "Jane Doe",
    "email": "jane@electronicswholesale.com",
    "phone": "+1-555-0199"
  }')

SUPPLIER_ID=$(echo $SUPPLIER_RESPONSE | jq -r '.supplier.id')
echo "Created supplier: $SUPPLIER_ID"

# Step 2: Create purchase order
PO_RESPONSE=$(curl -s -X POST "$API_URL/api/admin/purchase-orders" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d "{
    \"supplierId\": \"$SUPPLIER_ID\",
    \"expectedDate\": \"2025-02-15T00:00:00.000Z\",
    \"notes\": \"Initial order\",
    \"tax\": 100.00,
    \"shipping\": 50.00,
    \"items\": [
      {
        \"productId\": \"[product-id]\",
        \"quantity\": 100,
        \"unitCost\": 10.00
      }
    ]
  }")

PO_ID=$(echo $PO_RESPONSE | jq -r '.purchaseOrder.id')
echo "Created purchase order: $PO_ID"

# Step 3: Confirm order
curl -s -X PATCH "$API_URL/api/admin/purchase-orders/$PO_ID" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"status": "CONFIRMED"}' | jq '.'

echo "Purchase order confirmed"

# Step 4: Mark as shipped
curl -s -X PATCH "$API_URL/api/admin/purchase-orders/$PO_ID" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"status": "SHIPPED"}' | jq '.'

echo "Purchase order marked as shipped"

# Step 5: Get PO items
PO_DETAILS=$(curl -s -X GET "$API_URL/api/admin/purchase-orders/$PO_ID" \
  -H "Authorization: Bearer $TOKEN")

ITEM_ID=$(echo $PO_DETAILS | jq -r '.purchaseOrder.items[0].id')
echo "PO Item ID: $ITEM_ID"

# Step 6: Receive order
curl -s -X POST "$API_URL/api/admin/purchase-orders/$PO_ID/receive" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d "{
    \"items\": [
      {
        \"itemId\": \"$ITEM_ID\",
        \"receivedQuantity\": 100
      }
    ]
  }" | jq '.'

echo "Purchase order received and stock updated!"

# Step 7: Verify stock history
curl -s -X GET "$API_URL/api/admin/inventory/stock-history?changeType=RESTOCK&limit=5" \
  -H "Authorization: Bearer $TOKEN" | jq '.history[0]'

echo "Workflow complete!"
```

---

## 9. Testing Scenarios

### Scenario 1: Low Stock Alert System

```bash
# 1. Create stock alert
curl -X POST "$API_URL/api/admin/inventory/alerts/[product-id]" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"threshold": 20}'

# 2. Check current stock
curl -X GET "$API_URL/api/admin/products/[product-id]" \
  -H "Authorization: Bearer $TOKEN" | jq '.product.stock'

# 3. Reduce stock below threshold
curl -X POST "$API_URL/api/admin/inventory/bulk-update" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "updates": [{
      "productId": "[product-id]",
      "quantity": 15,
      "changeType": "SALE",
      "reason": "Test sale"
    }]
  }'

# 4. Check low stock report
curl -X GET "$API_URL/api/admin/inventory/low-stock" \
  -H "Authorization: Bearer $TOKEN" | jq '.products[] | select(.id == "[product-id]")'
```

### Scenario 2: Inventory Audit

```bash
# 1. Generate current stock report
curl -X GET "$API_URL/api/admin/inventory/reports?type=current-stock" \
  -H "Authorization: Bearer $TOKEN" > current_stock.json

# 2. Generate valuation report
curl -X GET "$API_URL/api/admin/inventory/reports?type=valuation" \
  -H "Authorization: Bearer $TOKEN" > valuation.json

# 3. Get stock movement for last month
curl -X GET "$API_URL/api/admin/inventory/reports?type=movement&startDate=2025-01-01&endDate=2025-01-31" \
  -H "Authorization: Bearer $TOKEN" > movement.json

# 4. Review all stock history
curl -X GET "$API_URL/api/admin/inventory/stock-history?limit=1000" \
  -H "Authorization: Bearer $TOKEN" > stock_history.json

echo "Audit reports generated!"
```

### Scenario 3: Bulk Inventory Correction

```bash
# After physical inventory count
curl -X POST "$API_URL/api/admin/inventory/bulk-update" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "updates": [
      {
        "productId": "prod-1",
        "quantity": 5,
        "changeType": "ADJUSTMENT",
        "reason": "Physical count adjustment - found 5 more units"
      },
      {
        "productId": "prod-2",
        "quantity": 3,
        "changeType": "DAMAGE",
        "reason": "Found 3 damaged units during count"
      },
      {
        "productId": "prod-3",
        "variantId": "var-1",
        "quantity": 10,
        "changeType": "ADJUSTMENT",
        "reason": "Count discrepancy correction"
      }
    ]
  }'
```

---

## 10. Error Handling Examples

### Handling Validation Errors
```bash
# Try to receive more than ordered (should fail)
curl -X POST "$API_URL/api/admin/purchase-orders/[po-id]/receive" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "items": [{
      "itemId": "[item-id]",
      "receivedQuantity": 999999
    }]
  }'

# Expected: 400 Bad Request
# Error: "Cannot receive more than ordered quantity"
```

### Handling Permission Errors
```bash
# Try to delete supplier with POs (should fail)
curl -X DELETE "$API_URL/api/admin/suppliers/[supplier-id-with-pos]" \
  -H "Authorization: Bearer $TOKEN"

# Expected: 409 Conflict
# Error: "Cannot delete supplier with existing purchase orders"
```

### Handling State Errors
```bash
# Try to receive already received PO (should fail)
curl -X POST "$API_URL/api/admin/purchase-orders/[received-po-id]/receive" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"items": []}'

# Expected: 400 Bad Request
# Error: "Purchase order has already been received"
```

---

## Tips for Testing

1. **Use jq for JSON parsing**:
   ```bash
   curl ... | jq '.supplier.id'
   ```

2. **Save IDs for later use**:
   ```bash
   SUPPLIER_ID=$(curl ... | jq -r '.supplier.id')
   ```

3. **Pretty print responses**:
   ```bash
   curl ... | jq '.'
   ```

4. **Check HTTP status codes**:
   ```bash
   curl -w "\nHTTP Status: %{http_code}\n" ...
   ```

5. **Save responses to files**:
   ```bash
   curl ... > response.json
   ```

6. **Test error cases**: Always test invalid inputs to ensure proper error handling

7. **Verify activity logs**: Check `/api/admin/activity-logs` after each operation

---

## Postman Collection

Import these examples into Postman for easier testing:

1. Create a new collection called "Inventory Management"
2. Set collection variable `{{baseUrl}}` = `http://localhost:3000`
3. Set authorization to Bearer Token with `{{token}}`
4. Add each endpoint as a request

---

## Next Steps

After testing these endpoints:

1. ✅ Verify all endpoints work correctly
2. ✅ Check activity logs are created
3. ✅ Test permission system
4. ✅ Verify stock history is accurate
5. ✅ Test report generation
6. ✅ Validate error handling
7. ✅ Performance test with large datasets
8. 🔄 Build frontend UI for these endpoints
9. 🔄 Add email notifications for low stock
10. 🔄 Implement automated reorder points

---

For more details, see:
- `INVENTORY_API_DOCUMENTATION.md` - Complete API documentation
- `INVENTORY_API_QUICK_REFERENCE.md` - Quick reference guide
