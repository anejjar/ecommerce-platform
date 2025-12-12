import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { parseCSV, uploadImageFromUrl } from '@/lib/export-utils'
import { logActivity, getClientIp, getUserAgent } from '@/lib/activity-log'
import { Decimal } from '@prisma/client/runtime/library'

/**
 * POST /api/admin/import/[id]/process
 * Process and import data from validated file
 */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  try {
    // Check authentication
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Check if user is SUPERADMIN
    if (session.user.role !== 'SUPERADMIN') {
      return NextResponse.json({ error: 'Insufficient permissions' }, { status: 403 })
    }

    // Get import record
    const dataImport = await prisma.dataImport.findUnique({
      where: { id },
    })

    if (!dataImport) {
      return NextResponse.json({ error: 'Import not found' }, { status: 404 })
    }

    if (dataImport.status === 'COMPLETED') {
      return NextResponse.json(
        { error: 'Import already processed' },
        { status: 400 }
      )
    }

    // Update status to in progress
    await prisma.dataImport.update({
      where: { id },
      data: { status: 'IN_PROGRESS' },
    })

    // Fetch file
    const response = await fetch(dataImport.fileUrl)
    if (!response.ok) {
      throw new Error('Failed to fetch import file')
    }

    let data: any[]
    const fileContent = await response.text()

    // Parse file
    if (dataImport.format === 'CSV') {
      data = parseCSV(fileContent)
    } else if (dataImport.format === 'JSON') {
      data = JSON.parse(fileContent)
    } else {
      throw new Error('Unsupported file format')
    }

    const results = {
      successCount: 0,
      failedCount: 0,
      skippedCount: 0,
      errors: [] as { row: number; error: string }[],
    }

    // Process in transaction
    await prisma.$transaction(
      async (tx) => {
        for (let i = 0; i < data.length; i++) {
          const row = data[i]
          const rowNumber = i + 2 // Account for header

          try {
            switch (dataImport.type) {
              case 'PRODUCTS':
                await processProductRow(row, dataImport.mode, tx, results, rowNumber)
                break

              case 'PRODUCT_IMAGES':
                await processProductImageRow(row, dataImport.mode, tx, results, rowNumber)
                break

              case 'PRODUCT_VARIANTS':
                await processProductVariantRow(row, dataImport.mode, tx, results, rowNumber)
                break

              case 'CUSTOMERS':
                await processCustomerRow(row, dataImport.mode, tx, results, rowNumber)
                break

              case 'CATEGORIES':
                await processCategoryRow(row, dataImport.mode, tx, results, rowNumber)
                break

              case 'INVENTORY':
                await processInventoryRow(row, tx, results, rowNumber)
                break

              case 'BLOG_POSTS':
                await processBlogPostRow(row, dataImport.mode, tx, results, rowNumber)
                break

              case 'PAGES':
                await processPageRow(row, dataImport.mode, tx, results, rowNumber)
                break

              case 'MEDIA_LIBRARY':
                await processMediaLibraryRow(row, dataImport.mode, tx, results, rowNumber)
                break

              case 'REVIEWS':
                await processReviewRow(row, dataImport.mode, tx, results, rowNumber)
                break

              case 'NEWSLETTER_SUBSCRIBERS':
                await processNewsletterSubscriberRow(row, dataImport.mode, tx, results, rowNumber)
                break

              case 'DISCOUNT_CODES':
                await processDiscountCodeRow(row, dataImport.mode, tx, results, rowNumber)
                break

              default:
                results.skippedCount++
                results.errors.push({
                  row: rowNumber,
                  error: 'Unsupported import type',
                })
            }
          } catch (error) {
            results.failedCount++
            results.errors.push({
              row: rowNumber,
              error: error instanceof Error ? error.message : 'Unknown error',
            })
          }
        }
      },
      {
        timeout: 120000, // 2 minute timeout
      }
    )

    // Update import record
    await prisma.dataImport.update({
      where: { id },
      data: {
        status: results.failedCount > 0 ? 'PARTIAL' : 'COMPLETED',
        totalRows: data.length,
        successCount: results.successCount,
        failedCount: results.failedCount,
        skippedCount: results.skippedCount,
        errors: JSON.stringify(results.errors),
        completedAt: new Date(),
      },
    })

    // Log activity
    await logActivity({
      userId: session.user.id,
      action: 'UPDATE',
      resource: 'DATA_IMPORT',
      resourceId: id,
      details: `Processed import: ${results.successCount} success, ${results.failedCount} failed`,
      ipAddress: getClientIp(request),
      userAgent: getUserAgent(request),
    })

    return NextResponse.json({
      message: 'Import completed',
      results: {
        total: data.length,
        success: results.successCount,
        failed: results.failedCount,
        skipped: results.skippedCount,
        errors: results.errors,
      },
    })
  } catch (error) {
    console.error('Error processing import:', error)

    // Update status to failed
    try {
      await prisma.dataImport.update({
        where: { id: id },
        data: {
          status: 'FAILED',
          errors: JSON.stringify({
            error: error instanceof Error ? error.message : 'Unknown error',
          }),
        },
      })
    } catch (updateError) {
      console.error('Error updating import status:', updateError)
    }

    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

/**
 * Process a product row
 */
async function processProductRow(
  row: any,
  mode: string,
  tx: any,
  results: any,
  rowNumber: number
) {
  const sku = row.SKU?.trim()
  const name = row.Name?.trim()
  const price = parseFloat(row.Price)
  const stock = parseInt(row.Stock)
  const published = row.Published?.toLowerCase() === 'yes'

  if (!sku || !name || isNaN(price) || isNaN(stock)) {
    throw new Error('Missing required fields')
  }

  // Check if product exists
  const existingProduct = await tx.product.findUnique({
    where: { sku },
  })

  if (mode === 'CREATE') {
    if (existingProduct) {
      results.skippedCount++
      return
    }

    // Generate slug from name
    const slug = name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '')

    await tx.product.create({
      data: {
        sku,
        name,
        slug: `${slug}-${Date.now()}`,
        price: new Decimal(price),
        comparePrice: row['Compare Price'] ? new Decimal(parseFloat(row['Compare Price'])) : null,
        stock,
        published,
        featured: row.Featured?.toLowerCase() === 'yes',
        description: row.Description || null,
      },
    })
    results.successCount++
  } else if (mode === 'UPDATE') {
    if (!existingProduct) {
      results.skippedCount++
      return
    }

    await tx.product.update({
      where: { sku },
      data: {
        name,
        price: new Decimal(price),
        comparePrice: row['Compare Price'] ? new Decimal(parseFloat(row['Compare Price'])) : null,
        stock,
        published,
        featured: row.Featured?.toLowerCase() === 'yes',
        description: row.Description || null,
      },
    })
    results.successCount++
  } else if (mode === 'UPSERT') {
    const slug = name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '')

    await tx.product.upsert({
      where: { sku },
      create: {
        sku,
        name,
        slug: `${slug}-${Date.now()}`,
        price: new Decimal(price),
        comparePrice: row['Compare Price'] ? new Decimal(parseFloat(row['Compare Price'])) : null,
        stock,
        published,
        featured: row.Featured?.toLowerCase() === 'yes',
        description: row.Description || null,
      },
      update: {
        name,
        price: new Decimal(price),
        comparePrice: row['Compare Price'] ? new Decimal(parseFloat(row['Compare Price'])) : null,
        stock,
        published,
        featured: row.Featured?.toLowerCase() === 'yes',
        description: row.Description || null,
      },
    })
    results.successCount++
  }
}

/**
 * Process a customer row
 */
async function processCustomerRow(
  row: any,
  mode: string,
  tx: any,
  results: any,
  rowNumber: number
) {
  const email = row.Email?.trim()
  const name = row.Name?.trim()

  if (!email || !name) {
    throw new Error('Missing required fields')
  }

  // Check if customer exists
  const existingCustomer = await tx.user.findUnique({
    where: { email },
  })

  if (mode === 'CREATE') {
    if (existingCustomer) {
      results.skippedCount++
      return
    }

    await tx.user.create({
      data: {
        email,
        name,
        role: 'CUSTOMER',
      },
    })
    results.successCount++
  } else if (mode === 'UPDATE') {
    if (!existingCustomer) {
      results.skippedCount++
      return
    }

    await tx.user.update({
      where: { email },
      data: { name },
    })
    results.successCount++
  } else if (mode === 'UPSERT') {
    await tx.user.upsert({
      where: { email },
      create: {
        email,
        name,
        role: 'CUSTOMER',
      },
      update: { name },
    })
    results.successCount++
  }
}

/**
 * Process a category row
 */
async function processCategoryRow(
  row: any,
  mode: string,
  tx: any,
  results: any,
  rowNumber: number
) {
  const name = row.Name?.trim()
  const slug = row.Slug?.trim()

  if (!name || !slug) {
    throw new Error('Missing required fields')
  }

  // Check if category exists
  const existingCategory = await tx.category.findUnique({
    where: { slug },
  })

  if (mode === 'CREATE') {
    if (existingCategory) {
      results.skippedCount++
      return
    }

    await tx.category.create({
      data: {
        name,
        slug,
        description: row.Description || null,
      },
    })
    results.successCount++
  } else if (mode === 'UPDATE') {
    if (!existingCategory) {
      results.skippedCount++
      return
    }

    await tx.category.update({
      where: { slug },
      data: {
        name,
        description: row.Description || null,
      },
    })
    results.successCount++
  } else if (mode === 'UPSERT') {
    await tx.category.upsert({
      where: { slug },
      create: {
        name,
        slug,
        description: row.Description || null,
      },
      update: {
        name,
        description: row.Description || null,
      },
    })
    results.successCount++
  }
}

/**
 * Process an inventory row (stock update)
 */
async function processInventoryRow(
  row: any,
  tx: any,
  results: any,
  rowNumber: number
) {
  const sku = row.SKU?.trim()
  const stock = parseInt(row['Current Stock'])

  if (!sku || isNaN(stock)) {
    throw new Error('Missing required fields')
  }

  // Update product stock
  const product = await tx.product.findUnique({
    where: { sku },
  })

  if (!product) {
    results.skippedCount++
    return
  }

  await tx.product.update({
    where: { sku },
    data: { stock },
  })

  results.successCount++
}

/**
 * Process a product image row
 */
async function processProductImageRow(
  row: any,
  mode: string,
  tx: any,
  results: any,
  rowNumber: number
) {
  const productSku = row['Product SKU']?.trim()
  const imageUrl = row['Image URL']?.trim()
  const altText = row['Alt Text']?.trim() || ''
  const position = parseInt(row.Position) || 0

  if (!productSku || !imageUrl) {
    throw new Error('Missing required fields: Product SKU and Image URL')
  }

  // Find product by SKU
  const product = await tx.product.findUnique({
    where: { sku: productSku },
  })

  if (!product) {
    throw new Error(`Product with SKU ${productSku} not found`)
  }

  // Upload image from URL to Cloudinary
  const cloudinaryUrl = await uploadImageFromUrl(imageUrl)

  // Check if image already exists for this product
  const existingImage = await tx.productImage.findFirst({
    where: {
      productId: product.id,
      url: cloudinaryUrl,
    },
  })

  if (mode === 'CREATE') {
    if (existingImage) {
      results.skippedCount++
      return
    }

    await tx.productImage.create({
      data: {
        productId: product.id,
        url: cloudinaryUrl,
        altText,
        position,
      },
    })
    results.successCount++
  } else if (mode === 'UPSERT') {
    if (existingImage) {
      await tx.productImage.update({
        where: { id: existingImage.id },
        data: {
          altText,
          position,
        },
      })
    } else {
      await tx.productImage.create({
        data: {
          productId: product.id,
          url: cloudinaryUrl,
          altText,
          position,
        },
      })
    }
    results.successCount++
  }
}

/**
 * Process a product variant row
 */
async function processProductVariantRow(
  row: any,
  mode: string,
  tx: any,
  results: any,
  rowNumber: number
) {
  const productSku = row['Product SKU']?.trim()
  const variantSku = row['Variant SKU']?.trim()
  const options = row.Options ? JSON.parse(row.Options) : {}
  const price = parseFloat(row.Price)
  const stock = parseInt(row.Stock)

  if (!productSku || !variantSku || isNaN(price) || isNaN(stock)) {
    throw new Error('Missing required fields')
  }

  // Find product
  const product = await tx.product.findUnique({
    where: { sku: productSku },
  })

  if (!product) {
    throw new Error(`Product with SKU ${productSku} not found`)
  }

  const existingVariant = await tx.productVariant.findUnique({
    where: { sku: variantSku },
  })

  if (mode === 'CREATE') {
    if (existingVariant) {
      results.skippedCount++
      return
    }

    await tx.productVariant.create({
      data: {
        productId: product.id,
        sku: variantSku,
        options,
        price: new Decimal(price),
        comparePrice: row['Compare Price'] ? new Decimal(parseFloat(row['Compare Price'])) : null,
        stock,
      },
    })
    results.successCount++
  } else if (mode === 'UPDATE') {
    if (!existingVariant) {
      results.skippedCount++
      return
    }

    await tx.productVariant.update({
      where: { sku: variantSku },
      data: {
        options,
        price: new Decimal(price),
        comparePrice: row['Compare Price'] ? new Decimal(parseFloat(row['Compare Price'])) : null,
        stock,
      },
    })
    results.successCount++
  } else if (mode === 'UPSERT') {
    await tx.productVariant.upsert({
      where: { sku: variantSku },
      create: {
        productId: product.id,
        sku: variantSku,
        options,
        price: new Decimal(price),
        comparePrice: row['Compare Price'] ? new Decimal(parseFloat(row['Compare Price'])) : null,
        stock,
      },
      update: {
        options,
        price: new Decimal(price),
        comparePrice: row['Compare Price'] ? new Decimal(parseFloat(row['Compare Price'])) : null,
        stock,
      },
    })
    results.successCount++
  }
}

/**
 * Process a blog post row
 */
async function processBlogPostRow(
  row: any,
  mode: string,
  tx: any,
  results: any,
  rowNumber: number
) {
  const title = row.Title?.trim()
  const slug = row.Slug?.trim()
  const content = row.Content?.trim()
  const status = row.Status?.toUpperCase() || 'DRAFT'
  const authorEmail = row['Author Email']?.trim()

  if (!title || !slug || !content) {
    throw new Error('Missing required fields: Title, Slug, Content')
  }

  // Find author by email
  let authorId = null
  if (authorEmail) {
    const author = await tx.user.findUnique({
      where: { email: authorEmail },
    })
    authorId = author?.id
  }

  // Find category by name if provided
  let categoryId = null
  if (row['Category Name']) {
    const category = await tx.blogCategory.findFirst({
      where: { name: row['Category Name'].trim() },
    })
    categoryId = category?.id
  }

  const existingPost = await tx.blogPost.findUnique({
    where: { slug },
  })

  const postData: any = {
    title,
    slug,
    excerpt: row.Excerpt || null,
    content,
    featuredImage: row['Featured Image'] || null,
    status,
    publishedAt: row['Published At'] ? new Date(row['Published At']) : null,
    categoryId,
    authorId,
    metaTitle: row['Meta Title'] || null,
    metaDescription: row['Meta Description'] || null,
    metaKeywords: row['Meta Keywords'] || null,
  }

  if (mode === 'CREATE') {
    if (existingPost) {
      results.skippedCount++
      return
    }

    await tx.blogPost.create({ data: postData })
    results.successCount++
  } else if (mode === 'UPDATE') {
    if (!existingPost) {
      results.skippedCount++
      return
    }

    await tx.blogPost.update({
      where: { slug },
      data: postData,
    })
    results.successCount++
  } else if (mode === 'UPSERT') {
    await tx.blogPost.upsert({
      where: { slug },
      create: postData,
      update: postData,
    })
    results.successCount++
  }
}

/**
 * Process a page row
 */
async function processPageRow(
  row: any,
  mode: string,
  tx: any,
  results: any,
  rowNumber: number
) {
  const title = row.Title?.trim()
  const slug = row.Slug?.trim()
  const content = row.Content?.trim()
  const status = row.Status?.toUpperCase() || 'DRAFT'

  if (!title || !slug || !content) {
    throw new Error('Missing required fields: Title, Slug, Content')
  }

  // Find parent page by slug if provided
  let parentId = null
  if (row['Parent Page Slug']) {
    const parent = await tx.page.findUnique({
      where: { slug: row['Parent Page Slug'].trim() },
    })
    parentId = parent?.id
  }

  const existingPage = await tx.page.findUnique({
    where: { slug },
  })

  const pageData: any = {
    title,
    slug,
    content,
    status,
    parentId,
    template: row.Template || null,
    metaTitle: row['Meta Title'] || null,
    metaDescription: row['Meta Description'] || null,
  }

  if (mode === 'CREATE') {
    if (existingPage) {
      results.skippedCount++
      return
    }

    await tx.page.create({ data: pageData })
    results.successCount++
  } else if (mode === 'UPDATE') {
    if (!existingPage) {
      results.skippedCount++
      return
    }

    await tx.page.update({
      where: { slug },
      data: pageData,
    })
    results.successCount++
  } else if (mode === 'UPSERT') {
    await tx.page.upsert({
      where: { slug },
      create: pageData,
      update: pageData,
    })
    results.successCount++
  }
}

/**
 * Process a media library row
 */
async function processMediaLibraryRow(
  row: any,
  mode: string,
  tx: any,
  results: any,
  rowNumber: number
) {
  const url = row.URL?.trim()
  const filename = row.Filename?.trim()
  const originalName = row['Original Name']?.trim() || filename

  if (!url || !filename) {
    throw new Error('Missing required fields: URL, Filename')
  }

  // Upload from URL to Cloudinary
  const cloudinaryUrl = await uploadImageFromUrl(url)

  const existingFile = await tx.file.findFirst({
    where: { url: cloudinaryUrl },
  })

  const fileData: any = {
    filename,
    originalName,
    url: cloudinaryUrl,
    mimeType: row['MIME Type'] || 'image/jpeg',
    fileSize: parseInt(row['File Size']) || 0,
    altText: row['Alt Text'] || null,
    title: row.Title || null,
    caption: row.Caption || null,
  }

  if (mode === 'CREATE') {
    if (existingFile) {
      results.skippedCount++
      return
    }

    await tx.file.create({ data: fileData })
    results.successCount++
  } else if (mode === 'UPSERT') {
    if (existingFile) {
      await tx.file.update({
        where: { id: existingFile.id },
        data: fileData,
      })
    } else {
      await tx.file.create({ data: fileData })
    }
    results.successCount++
  }
}

/**
 * Process a review row
 */
async function processReviewRow(
  row: any,
  mode: string,
  tx: any,
  results: any,
  rowNumber: number
) {
  const productSku = row['Product SKU']?.trim()
  const customerEmail = row['Customer Email']?.trim()
  const rating = parseInt(row.Rating)
  const comment = row.Comment?.trim()

  if (!productSku || !customerEmail || isNaN(rating) || !comment) {
    throw new Error('Missing required fields')
  }

  // Find product
  const product = await tx.product.findUnique({
    where: { sku: productSku },
  })

  if (!product) {
    throw new Error(`Product with SKU ${productSku} not found`)
  }

  // Find user
  const user = await tx.user.findUnique({
    where: { email: customerEmail },
  })

  if (!user) {
    throw new Error(`User with email ${customerEmail} not found`)
  }

  const existingReview = await tx.review.findFirst({
    where: {
      productId: product.id,
      userId: user.id,
    },
  })

  const reviewData: any = {
    productId: product.id,
    userId: user.id,
    rating,
    title: row.Title || null,
    comment,
    verified: row.Verified?.toLowerCase() === 'yes',
    approved: row.Approved?.toLowerCase() === 'yes',
  }

  if (mode === 'CREATE') {
    if (existingReview) {
      results.skippedCount++
      return
    }

    await tx.review.create({ data: reviewData })
    results.successCount++
  } else if (mode === 'UPDATE') {
    if (!existingReview) {
      results.skippedCount++
      return
    }

    await tx.review.update({
      where: { id: existingReview.id },
      data: reviewData,
    })
    results.successCount++
  } else if (mode === 'UPSERT') {
    if (existingReview) {
      await tx.review.update({
        where: { id: existingReview.id },
        data: reviewData,
      })
    } else {
      await tx.review.create({ data: reviewData })
    }
    results.successCount++
  }
}

/**
 * Process a newsletter subscriber row
 */
async function processNewsletterSubscriberRow(
  row: any,
  mode: string,
  tx: any,
  results: any,
  rowNumber: number
) {
  const email = row.Email?.trim()

  if (!email) {
    throw new Error('Missing required field: Email')
  }

  const existingSubscriber = await tx.newsletterSubscriber.findUnique({
    where: { email },
  })

  const subscriberData: any = {
    email,
    name: row.Name || null,
    active: row.Active?.toLowerCase() !== 'no',
    source: row.Source || 'IMPORT',
  }

  if (mode === 'CREATE') {
    if (existingSubscriber) {
      results.skippedCount++
      return
    }

    await tx.newsletterSubscriber.create({ data: subscriberData })
    results.successCount++
  } else if (mode === 'UPDATE') {
    if (!existingSubscriber) {
      results.skippedCount++
      return
    }

    await tx.newsletterSubscriber.update({
      where: { email },
      data: subscriberData,
    })
    results.successCount++
  } else if (mode === 'UPSERT') {
    await tx.newsletterSubscriber.upsert({
      where: { email },
      create: subscriberData,
      update: subscriberData,
    })
    results.successCount++
  }
}

/**
 * Process a discount code row
 */
async function processDiscountCodeRow(
  row: any,
  mode: string,
  tx: any,
  results: any,
  rowNumber: number
) {
  const code = row.Code?.trim()
  const type = row.Type?.toUpperCase()
  const discountValue = parseFloat(row['Discount Value'])

  if (!code || !type || isNaN(discountValue)) {
    throw new Error('Missing required fields: Code, Type, Discount Value')
  }

  const existingCode = await tx.discountCode.findUnique({
    where: { code },
  })

  const codeData: any = {
    code,
    type,
    discountValue: new Decimal(discountValue),
    minOrderValue: row['Min Order Value'] ? new Decimal(parseFloat(row['Min Order Value'])) : null,
    maxUses: row['Max Uses'] ? parseInt(row['Max Uses']) : null,
    validFrom: row['Valid From'] ? new Date(row['Valid From']) : null,
    validUntil: row['Valid Until'] ? new Date(row['Valid Until']) : null,
    active: row.Active?.toLowerCase() !== 'no',
  }

  if (mode === 'CREATE') {
    if (existingCode) {
      results.skippedCount++
      return
    }

    await tx.discountCode.create({ data: codeData })
    results.successCount++
  } else if (mode === 'UPDATE') {
    if (!existingCode) {
      results.skippedCount++
      return
    }

    await tx.discountCode.update({
      where: { code },
      data: codeData,
    })
    results.successCount++
  } else if (mode === 'UPSERT') {
    await tx.discountCode.upsert({
      where: { code },
      create: codeData,
      update: codeData,
    })
    results.successCount++
  }
}
