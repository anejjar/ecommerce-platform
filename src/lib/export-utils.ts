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
 * Product Images export columns
 */
export const PRODUCT_IMAGES_EXPORT_COLUMNS: ExportColumn[] = [
  {
    key: 'product',
    header: 'Product SKU',
    transform: (value) => value?.sku || '',
  },
  {
    key: 'product',
    header: 'Product Name',
    transform: (value) => value?.name || '',
  },
  { key: 'url', header: 'Image URL' },
  { key: 'alt', header: 'Alt Text' },
  { key: 'position', header: 'Position' },
  {
    key: 'createdAt',
    header: 'Created At',
    transform: (value) => new Date(value).toISOString(),
  },
]

/**
 * Product Variants export columns
 */
export const PRODUCT_VARIANTS_EXPORT_COLUMNS: ExportColumn[] = [
  {
    key: 'product',
    header: 'Product SKU',
    transform: (value) => value?.sku || '',
  },
  {
    key: 'product',
    header: 'Product Name',
    transform: (value) => value?.name || '',
  },
  { key: 'sku', header: 'Variant SKU' },
  { key: 'optionValues', header: 'Options (JSON)' },
  { key: 'price', header: 'Price' },
  { key: 'comparePrice', header: 'Compare Price' },
  { key: 'stock', header: 'Stock' },
  { key: 'image', header: 'Image URL' },
]

/**
 * Blog Posts export columns
 */
export const BLOG_POSTS_EXPORT_COLUMNS: ExportColumn[] = [
  { key: 'title', header: 'Title' },
  { key: 'slug', header: 'Slug' },
  { key: 'excerpt', header: 'Excerpt' },
  { key: 'content', header: 'Content' },
  { key: 'featuredImage', header: 'Featured Image URL' },
  {
    key: 'status',
    header: 'Status',
    transform: (value) => value || 'DRAFT',
  },
  {
    key: 'publishedAt',
    header: 'Published At',
    transform: (value) => (value ? new Date(value).toISOString() : ''),
  },
  {
    key: 'category',
    header: 'Category',
    transform: (value) => value?.name || '',
  },
  {
    key: 'author',
    header: 'Author Email',
    transform: (value) => value?.email || '',
  },
  { key: 'seoTitle', header: 'SEO Title' },
  { key: 'seoDescription', header: 'SEO Description' },
  {
    key: 'createdAt',
    header: 'Created At',
    transform: (value) => new Date(value).toISOString(),
  },
]

/**
 * Pages export columns
 */
export const PAGES_EXPORT_COLUMNS: ExportColumn[] = [
  { key: 'title', header: 'Title' },
  { key: 'slug', header: 'Slug' },
  { key: 'content', header: 'Content' },
  {
    key: 'status',
    header: 'Status',
    transform: (value) => value || 'DRAFT',
  },
  {
    key: 'parent',
    header: 'Parent Page Slug',
    transform: (value) => value?.slug || '',
  },
  { key: 'template', header: 'Template' },
  { key: 'seoTitle', header: 'SEO Title' },
  { key: 'seoDescription', header: 'SEO Description' },
  {
    key: 'createdAt',
    header: 'Created At',
    transform: (value) => new Date(value).toISOString(),
  },
]

/**
 * Media Library export columns
 */
export const MEDIA_LIBRARY_EXPORT_COLUMNS: ExportColumn[] = [
  { key: 'filename', header: 'Filename' },
  { key: 'originalName', header: 'Original Name' },
  { key: 'url', header: 'URL' },
  { key: 'mimeType', header: 'MIME Type' },
  {
    key: 'fileSize',
    header: 'File Size (bytes)',
    transform: (value) => value || 0,
  },
  { key: 'altText', header: 'Alt Text' },
  { key: 'title', header: 'Title' },
  { key: 'caption', header: 'Caption' },
  {
    key: 'uploadedBy',
    header: 'Uploaded By',
    transform: (value) => value?.email || '',
  },
  {
    key: 'createdAt',
    header: 'Created At',
    transform: (value) => new Date(value).toISOString(),
  },
]

/**
 * Reviews export columns
 */
export const REVIEWS_EXPORT_COLUMNS: ExportColumn[] = [
  {
    key: 'product',
    header: 'Product SKU',
    transform: (value) => value?.sku || '',
  },
  {
    key: 'product',
    header: 'Product Name',
    transform: (value) => value?.name || '',
  },
  {
    key: 'user',
    header: 'Customer Email',
    transform: (value) => value?.email || '',
  },
  {
    key: 'user',
    header: 'Customer Name',
    transform: (value) => value?.name || '',
  },
  { key: 'rating', header: 'Rating (1-5)' },
  { key: 'title', header: 'Review Title' },
  { key: 'comment', header: 'Comment' },
  {
    key: 'verified',
    header: 'Verified Purchase',
    transform: (value) => (value ? 'Yes' : 'No'),
  },
  {
    key: 'approved',
    header: 'Approved',
    transform: (value) => (value ? 'Yes' : 'No'),
  },
  {
    key: 'createdAt',
    header: 'Created At',
    transform: (value) => new Date(value).toISOString(),
  },
]

/**
 * Newsletter Subscribers export columns
 */
export const NEWSLETTER_SUBSCRIBERS_EXPORT_COLUMNS: ExportColumn[] = [
  { key: 'email', header: 'Email' },
  { key: 'name', header: 'Name' },
  {
    key: 'isActive',
    header: 'Active',
    transform: (value) => (value ? 'Yes' : 'No'),
  },
  { key: 'source', header: 'Source' },
  {
    key: 'subscribedAt',
    header: 'Subscribed At',
    transform: (value) => (value ? new Date(value).toISOString() : ''),
  },
  {
    key: 'unsubscribedAt',
    header: 'Unsubscribed At',
    transform: (value) => (value ? new Date(value).toISOString() : ''),
  },
]

/**
 * Discount Codes export columns
 */
export const DISCOUNT_CODES_EXPORT_COLUMNS: ExportColumn[] = [
  { key: 'code', header: 'Code' },
  {
    key: 'type',
    header: 'Type',
    transform: (value) => value || 'PERCENTAGE',
  },
  { key: 'value', header: 'Discount Value' },
  { key: 'minOrderAmount', header: 'Min Order Amount' },
  { key: 'maxUses', header: 'Max Uses' },
  { key: 'usedCount', header: 'Times Used' },
  {
    key: 'startDate',
    header: 'Start Date',
    transform: (value) => (value ? new Date(value).toISOString() : ''),
  },
  {
    key: 'endDate',
    header: 'End Date',
    transform: (value) => (value ? new Date(value).toISOString() : ''),
  },
  {
    key: 'isActive',
    header: 'Active',
    transform: (value) => (value ? 'Yes' : 'No'),
  },
  {
    key: 'createdAt',
    header: 'Created At',
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
    case 'PRODUCT_IMAGES':
      return PRODUCT_IMAGES_EXPORT_COLUMNS
    case 'PRODUCT_VARIANTS':
      return PRODUCT_VARIANTS_EXPORT_COLUMNS
    case 'ORDERS':
      return ORDER_EXPORT_COLUMNS
    case 'CUSTOMERS':
      return CUSTOMER_EXPORT_COLUMNS
    case 'CATEGORIES':
      return CATEGORY_EXPORT_COLUMNS
    case 'INVENTORY':
      return INVENTORY_EXPORT_COLUMNS
    case 'BLOG_POSTS':
      return BLOG_POSTS_EXPORT_COLUMNS
    case 'PAGES':
      return PAGES_EXPORT_COLUMNS
    case 'MEDIA_LIBRARY':
      return MEDIA_LIBRARY_EXPORT_COLUMNS
    case 'REVIEWS':
      return REVIEWS_EXPORT_COLUMNS
    case 'NEWSLETTER_SUBSCRIBERS':
      return NEWSLETTER_SUBSCRIBERS_EXPORT_COLUMNS
    case 'DISCOUNT_CODES':
      return DISCOUNT_CODES_EXPORT_COLUMNS
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
 * Validate import row for product images
 */
export function validateProductImageRow(row: any, rowNumber: number): string[] {
  const errors: string[] = []

  if (!row['Product SKU'] || !row['Product SKU'].trim()) {
    errors.push(`Row ${rowNumber}: Product SKU is required`)
  }

  if (!row['Image URL'] || !row['Image URL'].trim()) {
    errors.push(`Row ${rowNumber}: Image URL is required`)
  } else if (
    !row['Image URL'].startsWith('http://') &&
    !row['Image URL'].startsWith('https://')
  ) {
    errors.push(`Row ${rowNumber}: Image URL must be a valid HTTP/HTTPS URL`)
  }

  if (row.Position && isNaN(Number(row.Position))) {
    errors.push(`Row ${rowNumber}: Position must be a number`)
  }

  return errors
}

/**
 * Validate import row for product variants
 */
export function validateProductVariantRow(row: any, rowNumber: number): string[] {
  const errors: string[] = []

  if (!row['Product SKU'] || !row['Product SKU'].trim()) {
    errors.push(`Row ${rowNumber}: Product SKU is required`)
  }

  if (!row['Variant SKU'] || !row['Variant SKU'].trim()) {
    errors.push(`Row ${rowNumber}: Variant SKU is required`)
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
 * Validate import row for blog posts
 */
export function validateBlogPostRow(row: any, rowNumber: number): string[] {
  const errors: string[] = []

  if (!row.Title || !row.Title.trim()) {
    errors.push(`Row ${rowNumber}: Title is required`)
  }

  if (!row.Slug || !row.Slug.trim()) {
    errors.push(`Row ${rowNumber}: Slug is required`)
  }

  if (!row.Content || !row.Content.trim()) {
    errors.push(`Row ${rowNumber}: Content is required`)
  }

  if (row.Status && !['DRAFT', 'PUBLISHED'].includes(row.Status.toUpperCase())) {
    errors.push(`Row ${rowNumber}: Status must be DRAFT or PUBLISHED`)
  }

  return errors
}

/**
 * Validate import row for pages
 */
export function validatePageRow(row: any, rowNumber: number): string[] {
  const errors: string[] = []

  if (!row.Title || !row.Title.trim()) {
    errors.push(`Row ${rowNumber}: Title is required`)
  }

  if (!row.Slug || !row.Slug.trim()) {
    errors.push(`Row ${rowNumber}: Slug is required`)
  }

  if (!row.Content || !row.Content.trim()) {
    errors.push(`Row ${rowNumber}: Content is required`)
  }

  if (row.Status && !['DRAFT', 'PUBLISHED'].includes(row.Status.toUpperCase())) {
    errors.push(`Row ${rowNumber}: Status must be DRAFT or PUBLISHED`)
  }

  return errors
}

/**
 * Validate import row for media library
 */
export function validateMediaLibraryRow(row: any, rowNumber: number): string[] {
  const errors: string[] = []

  if (!row.URL || !row.URL.trim()) {
    errors.push(`Row ${rowNumber}: URL is required`)
  } else if (!row.URL.startsWith('http://') && !row.URL.startsWith('https://')) {
    errors.push(`Row ${rowNumber}: URL must be a valid HTTP/HTTPS URL`)
  }

  if (!row.Filename || !row.Filename.trim()) {
    errors.push(`Row ${rowNumber}: Filename is required`)
  }

  return errors
}

/**
 * Validate import row for reviews
 */
export function validateReviewRow(row: any, rowNumber: number): string[] {
  const errors: string[] = []

  if (!row['Product SKU'] || !row['Product SKU'].trim()) {
    errors.push(`Row ${rowNumber}: Product SKU is required`)
  }

  if (!row['Customer Email'] || !row['Customer Email'].trim()) {
    errors.push(`Row ${rowNumber}: Customer Email is required`)
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(row['Customer Email'])) {
    errors.push(`Row ${rowNumber}: Invalid email format`)
  }

  if (!row['Rating (1-5)'] || isNaN(Number(row['Rating (1-5)']))) {
    errors.push(`Row ${rowNumber}: Valid rating (1-5) is required`)
  } else {
    const rating = Number(row['Rating (1-5)'])
    if (rating < 1 || rating > 5) {
      errors.push(`Row ${rowNumber}: Rating must be between 1 and 5`)
    }
  }

  if (!row.Comment || !row.Comment.trim()) {
    errors.push(`Row ${rowNumber}: Comment is required`)
  }

  return errors
}

/**
 * Validate import row for newsletter subscribers
 */
export function validateNewsletterSubscriberRow(
  row: any,
  rowNumber: number
): string[] {
  const errors: string[] = []

  if (!row.Email || !row.Email.trim()) {
    errors.push(`Row ${rowNumber}: Email is required`)
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(row.Email)) {
    errors.push(`Row ${rowNumber}: Invalid email format`)
  }

  return errors
}

/**
 * Validate import row for discount codes
 */
export function validateDiscountCodeRow(row: any, rowNumber: number): string[] {
  const errors: string[] = []

  if (!row.Code || !row.Code.trim()) {
    errors.push(`Row ${rowNumber}: Code is required`)
  }

  if (!row.Type || !['PERCENTAGE', 'FIXED'].includes(row.Type.toUpperCase())) {
    errors.push(`Row ${rowNumber}: Type must be PERCENTAGE or FIXED`)
  }

  if (!row['Discount Value'] || isNaN(Number(row['Discount Value']))) {
    errors.push(`Row ${rowNumber}: Valid discount value is required`)
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
      case 'PRODUCT_IMAGES':
        errors.push(...validateProductImageRow(row, rowNumber))
        break
      case 'PRODUCT_VARIANTS':
        errors.push(...validateProductVariantRow(row, rowNumber))
        break
      case 'ORDERS':
        errors.push(...validateOrderRow(row, rowNumber))
        break
      case 'CUSTOMERS':
        errors.push(...validateCustomerRow(row, rowNumber))
        break
      case 'BLOG_POSTS':
        errors.push(...validateBlogPostRow(row, rowNumber))
        break
      case 'PAGES':
        errors.push(...validatePageRow(row, rowNumber))
        break
      case 'MEDIA_LIBRARY':
        errors.push(...validateMediaLibraryRow(row, rowNumber))
        break
      case 'REVIEWS':
        errors.push(...validateReviewRow(row, rowNumber))
        break
      case 'NEWSLETTER_SUBSCRIBERS':
        errors.push(...validateNewsletterSubscriberRow(row, rowNumber))
        break
      case 'DISCOUNT_CODES':
        errors.push(...validateDiscountCodeRow(row, rowNumber))
        break
    }
  })

  return {
    valid: errors.length === 0,
    errors,
  }
}

/**
 * Helper function to upload image from URL to Cloudinary
 */
export async function uploadImageFromUrl(imageUrl: string): Promise<string> {
  const cloudinaryUrl = `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`

  const formData = new FormData()
  formData.append('file', imageUrl)
  formData.append('upload_preset', process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || '')

  const response = await fetch(cloudinaryUrl, {
    method: 'POST',
    body: formData,
  })

  if (!response.ok) {
    throw new Error(`Failed to upload image: ${response.statusText}`)
  }

  const data = await response.json()
  return data.secure_url
}
