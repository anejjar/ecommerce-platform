/**
 * Export/Import utility functions
 * Handles CSV, JSON, and data transformation
 */

export interface ExportColumn {
  key: string
  header: string
  transform?: (value: any, row: any) => any
}

/**
 * Convert array of objects to CSV string
 */
export function convertToCSV(data: any[], columns: ExportColumn[]): string {
  if (!data || data.length === 0) {
    return columns.map((col) => col.header).join(',') + '\n'
  }

  // Headers
  const headers = columns.map((col) => col.header).join(',')

  // Rows
  const rows = data.map((row) => {
    return columns
      .map((col) => {
        let value = row[col.key]

        // Apply transform if provided
        if (col.transform) {
          value = col.transform(value, row)
        }

        // Handle different data types
        if (value === null || value === undefined) {
          return ''
        }

        if (typeof value === 'object') {
          value = JSON.stringify(value)
        }

        // Escape CSV special characters
        const stringValue = String(value)
        if (
          stringValue.includes(',') ||
          stringValue.includes('"') ||
          stringValue.includes('\n')
        ) {
          return `"${stringValue.replace(/"/g, '""')}"`
        }

        return stringValue
      })
      .join(',')
  })

  return headers + '\n' + rows.join('\n')
}

/**
 * Parse CSV string to array of objects
 */
export function parseCSV(csvString: string): any[] {
  const lines = csvString.split('\n').filter((line) => line.trim())

  if (lines.length === 0) {
    return []
  }

  // Parse headers
  const headers = parseCSVLine(lines[0])

  // Parse rows
  const data = []
  for (let i = 1; i < lines.length; i++) {
    const values = parseCSVLine(lines[i])
    const row: any = {}

    headers.forEach((header, index) => {
      row[header] = values[index] || ''
    })

    data.push(row)
  }

  return data
}

/**
 * Parse a single CSV line handling quotes
 */
function parseCSVLine(line: string): string[] {
  const result = []
  let current = ''
  let inQuotes = false

  for (let i = 0; i < line.length; i++) {
    const char = line[i]
    const nextChar = line[i + 1]

    if (char === '"') {
      if (inQuotes && nextChar === '"') {
        // Escaped quote
        current += '"'
        i++ // Skip next quote
      } else {
        // Toggle quotes
        inQuotes = !inQuotes
      }
    } else if (char === ',' && !inQuotes) {
      // End of field
      result.push(current.trim())
      current = ''
    } else {
      current += char
    }
  }

  // Add last field
  result.push(current.trim())

  return result
}

/**
 * Product export columns
 */
export const PRODUCT_EXPORT_COLUMNS: ExportColumn[] = [
  { key: 'sku', header: 'SKU' },
  { key: 'name', header: 'Name' },
  { key: 'price', header: 'Price' },
  { key: 'comparePrice', header: 'Compare Price' },
  { key: 'stock', header: 'Stock' },
  {
    key: 'category',
    header: 'Category',
    transform: (value) => value?.name || '',
  },
  {
    key: 'published',
    header: 'Published',
    transform: (value) => (value ? 'Yes' : 'No'),
  },
  {
    key: 'featured',
    header: 'Featured',
    transform: (value) => (value ? 'Yes' : 'No'),
  },
  { key: 'description', header: 'Description' },
  {
    key: 'createdAt',
    header: 'Created At',
    transform: (value) => new Date(value).toISOString(),
  },
]

/**
 * Order export columns
 */
export const ORDER_EXPORT_COLUMNS: ExportColumn[] = [
  { key: 'orderNumber', header: 'Order Number' },
  {
    key: 'createdAt',
    header: 'Date',
    transform: (value) => new Date(value).toISOString(),
  },
  {
    key: 'user',
    header: 'Customer Email',
    transform: (value, row) => value?.email || row.guestEmail || '',
  },
  { key: 'status', header: 'Status' },
  { key: 'paymentStatus', header: 'Payment Status' },
  { key: 'total', header: 'Total' },
  {
    key: 'items',
    header: 'Items',
    transform: (value) => value?.length || 0,
  },
  { key: 'trackingNumber', header: 'Tracking Number' },
]

/**
 * Customer export columns
 */
export const CUSTOMER_EXPORT_COLUMNS: ExportColumn[] = [
  { key: 'email', header: 'Email' },
  { key: 'name', header: 'Name' },
  {
    key: 'orders',
    header: 'Total Orders',
    transform: (value) => value?.length || 0,
  },
  {
    key: 'orders',
    header: 'Total Spent',
    transform: (value) =>
      value?.reduce((sum: number, order: any) => sum + Number(order.total), 0) || 0,
  },
  {
    key: 'createdAt',
    header: 'Created At',
    transform: (value) => new Date(value).toISOString(),
  },
  {
    key: 'emailVerified',
    header: 'Email Verified',
    transform: (value) => (value ? 'Yes' : 'No'),
  },
]

/**
 * Category export columns
 */
export const CATEGORY_EXPORT_COLUMNS: ExportColumn[] = [
  { key: 'name', header: 'Name' },
  { key: 'slug', header: 'Slug' },
  { key: 'description', header: 'Description' },
  {
    key: 'parent',
    header: 'Parent Category',
    transform: (value) => value?.name || '',
  },
  {
    key: 'products',
    header: 'Product Count',
    transform: (value) => value?.length || 0,
  },
]

/**
 * Inventory export columns
 */
export const INVENTORY_EXPORT_COLUMNS: ExportColumn[] = [
  { key: 'sku', header: 'SKU' },
  { key: 'name', header: 'Product Name' },
  { key: 'stock', header: 'Current Stock' },
  {
    key: 'stockAlert',
    header: 'Alert Threshold',
    transform: (value) => value?.threshold || '',
  },
  {
    key: 'category',
    header: 'Category',
    transform: (value) => value?.name || '',
  },
  { key: 'price', header: 'Price' },
  {
    key: 'updatedAt',
    header: 'Last Updated',
    transform: (value) => new Date(value).toISOString(),
  },
]

/**
 * Get export columns by type
 */
export function getExportColumns(type: string): ExportColumn[] {
  switch (type) {
    case 'PRODUCTS':
      return PRODUCT_EXPORT_COLUMNS
    case 'ORDERS':
      return ORDER_EXPORT_COLUMNS
    case 'CUSTOMERS':
      return CUSTOMER_EXPORT_COLUMNS
    case 'CATEGORIES':
      return CATEGORY_EXPORT_COLUMNS
    case 'INVENTORY':
      return INVENTORY_EXPORT_COLUMNS
    default:
      return []
  }
}

/**
 * Validate import row for products
 */
export function validateProductRow(row: any, rowNumber: number): string[] {
  const errors: string[] = []

  if (!row.SKU || !row.SKU.trim()) {
    errors.push(`Row ${rowNumber}: SKU is required`)
  }

  if (!row.Name || !row.Name.trim()) {
    errors.push(`Row ${rowNumber}: Name is required`)
  }

  if (!row.Price || isNaN(Number(row.Price))) {
    errors.push(`Row ${rowNumber}: Valid price is required`)
  }

  if (!row.Stock || isNaN(Number(row.Stock))) {
    errors.push(`Row ${rowNumber}: Valid stock quantity is required`)
  }

  return errors
}

/**
 * Validate import row for orders
 */
export function validateOrderRow(row: any, rowNumber: number): string[] {
  const errors: string[] = []

  if (!row['Order Number'] || !row['Order Number'].trim()) {
    errors.push(`Row ${rowNumber}: Order Number is required`)
  }

  if (!row['Customer Email'] || !row['Customer Email'].trim()) {
    errors.push(`Row ${rowNumber}: Customer Email is required`)
  }

  if (!row.Total || isNaN(Number(row.Total))) {
    errors.push(`Row ${rowNumber}: Valid total is required`)
  }

  return errors
}

/**
 * Validate import row for customers
 */
export function validateCustomerRow(row: any, rowNumber: number): string[] {
  const errors: string[] = []

  if (!row.Email || !row.Email.trim()) {
    errors.push(`Row ${rowNumber}: Email is required`)
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(row.Email)) {
    errors.push(`Row ${rowNumber}: Invalid email format`)
  }

  if (!row.Name || !row.Name.trim()) {
    errors.push(`Row ${rowNumber}: Name is required`)
  }

  return errors
}

/**
 * Validate import data by type
 */
export function validateImportData(
  type: string,
  data: any[]
): { valid: boolean; errors: string[] } {
  const errors: string[] = []

  data.forEach((row, index) => {
    const rowNumber = index + 2 // +2 because index starts at 0 and we skip header

    switch (type) {
      case 'PRODUCTS':
        errors.push(...validateProductRow(row, rowNumber))
        break
      case 'ORDERS':
        errors.push(...validateOrderRow(row, rowNumber))
        break
      case 'CUSTOMERS':
        errors.push(...validateCustomerRow(row, rowNumber))
        break
    }
  })

  return {
    valid: errors.length === 0,
    errors,
  }
}
