import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

interface ProductRow {
  Name?: string;
  SKU?: string;
  Description?: string;
  Price?: string;
  'Compare Price'?: string;
  'Regular price'?: string;
  'Sale price'?: string;
  Stock?: string;
  Category?: string;
  Categories?: string;
  Featured?: string;
  Published?: string;
  'Image URL'?: string;
  Images?: string;
}

function parseCSV(text: string): ProductRow[] {
  const lines = text.split('\n').filter(line => line.trim());
  if (lines.length === 0) return [];

  const headers = lines[0].split(',').map(h => h.trim().replace(/^"|"$/g, ''));
  const rows: ProductRow[] = [];

  for (let i = 1; i < lines.length; i++) {
    const line = lines[i];
    const values: string[] = [];
    let current = '';
    let inQuotes = false;

    for (let j = 0; j < line.length; j++) {
      const char = line[j];
      if (char === '"') {
        inQuotes = !inQuotes;
      } else if (char === ',' && !inQuotes) {
        values.push(current.trim());
        current = '';
      } else {
        current += char;
      }
    }
    values.push(current.trim());

    const row: ProductRow = {};
    headers.forEach((header, index) => {
      row[header as keyof ProductRow] = values[index]?.replace(/^"|"$/g, '');
    });
    rows.push(row);
  }

  return rows;
}

function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function parseBoolean(value: string | undefined): boolean {
  if (!value) return false;
  const lower = value.toLowerCase();
  return lower === 'true' || lower === '1' || lower === 'yes';
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    const text = await file.text();
    const rows = parseCSV(text);

    if (rows.length === 0) {
      return NextResponse.json({ error: 'CSV file is empty' }, { status: 400 });
    }

    let imported = 0;
    let skipped = 0;
    const errors: string[] = [];

    for (const row of rows) {
      try {
        // Get product name (required)
        const name = row.Name;
        if (!name) {
          errors.push('Row skipped: Missing product name');
          skipped++;
          continue;
        }

        // Get price (required)
        const priceStr = row.Price || row['Regular price'];
        if (!priceStr) {
          errors.push(`Row skipped: "${name}" - Missing price`);
          skipped++;
          continue;
        }

        const price = parseFloat(priceStr.replace(/[^0-9.]/g, ''));
        if (isNaN(price)) {
          errors.push(`Row skipped: "${name}" - Invalid price`);
          skipped++;
          continue;
        }

        // Check if SKU already exists
        const sku = row.SKU;
        if (sku) {
          const existing = await prisma.product.findUnique({
            where: { sku },
          });
          if (existing) {
            errors.push(`Skipped: "${name}" - SKU "${sku}" already exists`);
            skipped++;
            continue;
          }
        }

        // Parse optional fields
        const comparePriceStr = row['Compare Price'] || row['Sale price'];
        const comparePrice = comparePriceStr
          ? parseFloat(comparePriceStr.replace(/[^0-9.]/g, ''))
          : null;

        const stockStr = row.Stock;
        const stock = stockStr ? parseInt(stockStr) : 0;

        const description = row.Description || null;
        const featured = parseBoolean(row.Featured);
        const published = row.Published ? parseBoolean(row.Published) : true;

        // Handle category
        let categoryId: string | null = null;
        const categoryName = row.Category || row.Categories;
        if (categoryName) {
          const categorySlug = generateSlug(categoryName);
          let category = await prisma.category.findUnique({
            where: { slug: categorySlug },
          });

          if (!category) {
            // Create category if it doesn't exist
            category = await prisma.category.create({
              data: {
                name: categoryName,
                slug: categorySlug,
              },
            });
          }

          categoryId = category.id;
        }

        // Create product
        const slug = generateSlug(name);
        let finalSlug = slug;
        let counter = 1;

        // Ensure unique slug
        while (
          await prisma.product.findUnique({ where: { slug: finalSlug } })
        ) {
          finalSlug = `${slug}-${counter}`;
          counter++;
        }

        const product = await prisma.product.create({
          data: {
            name,
            slug: finalSlug,
            description,
            price,
            comparePrice: comparePrice && !isNaN(comparePrice) ? comparePrice : null,
            stock,
            sku: sku || null,
            featured,
            published,
            categoryId,
          },
        });

        // Handle image if provided
        const imageUrl = row['Image URL'] || row.Images;
        if (imageUrl && product.id) {
          try {
            await prisma.productImage.create({
              data: {
                url: imageUrl,
                alt: name,
                position: 0,
                productId: product.id,
              },
            });
          } catch (imgError) {
            // Image creation failed, but product is created
            errors.push(`Warning: "${name}" - Failed to add image`);
          }
        }

        imported++;
      } catch (error) {
        const name = row.Name || 'Unknown';
        errors.push(`Error importing "${name}": ${error instanceof Error ? error.message : 'Unknown error'}`);
        skipped++;
      }
    }

    return NextResponse.json({
      success: true,
      message: `Import completed: ${imported} products imported, ${skipped} skipped`,
      imported,
      skipped,
      errors: errors.length > 0 ? errors : undefined,
    });
  } catch (error) {
    console.error('Import error:', error);
    return NextResponse.json(
      { error: 'Failed to import products' },
      { status: 500 }
    );
  }
}
