import { prisma } from './prisma';

/**
 * Syncs product stock to match the sum of all its variant stocks
 * Should be called whenever variants are created, updated, or deleted
 */
export async function syncProductStockWithVariants(productId: string) {
  // Get all variants for this product
  const variants = await prisma.productVariant.findMany({
    where: { productId },
    select: { stock: true },
  });

  // Calculate total stock from all variants
  const totalStock = variants.reduce((sum, variant) => sum + variant.stock, 0);

  // Update product stock
  await prisma.product.update({
    where: { id: productId },
    data: { stock: totalStock },
  });

  return totalStock;
}

/**
 * Check if a product has variants
 */
export async function productHasVariants(productId: string): Promise<boolean> {
  const variantCount = await prisma.productVariant.count({
    where: { productId },
  });
  return variantCount > 0;
}

/**
 * Get actual available stock for a product
 * If product has variants, returns sum of variant stocks
 * Otherwise returns product stock
 */
export async function getAvailableStock(productId: string): Promise<number> {
  const hasVariants = await productHasVariants(productId);

  if (hasVariants) {
    const variants = await prisma.productVariant.findMany({
      where: { productId },
      select: { stock: true },
    });
    return variants.reduce((sum, variant) => sum + variant.stock, 0);
  }

  const product = await prisma.product.findUnique({
    where: { id: productId },
    select: { stock: true },
  });

  return product?.stock || 0;
}
