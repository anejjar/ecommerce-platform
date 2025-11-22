import { prisma } from './prisma'
import type { Product, Category, ProductTranslation, CategoryTranslation } from '@prisma/client'

/**
 * Apply product translation to a product object
 * If translation exists for the locale, use it; otherwise use the default values
 */
export function applyProductTranslation<
  T extends Product & { translations?: ProductTranslation[] }
>(product: T, locale: string): T {
  if (!product.translations || product.translations.length === 0) {
    return product
  }

  const translation = product.translations.find(t => t.locale === locale)

  if (!translation) {
    return product
  }

  return {
    ...product,
    name: translation.name,
    description: translation.description || product.description,
    slug: translation.slug,
  }
}

/**
 * Apply category translation to a category object
 */
export function applyCategoryTranslation<
  T extends Category & { translations?: CategoryTranslation[] }
>(category: T, locale: string): T {
  if (!category.translations || category.translations.length === 0) {
    return category
  }

  const translation = category.translations.find(t => t.locale === locale)

  if (!translation) {
    return category
  }

  return {
    ...category,
    name: translation.name,
    description: translation.description || category.description,
    slug: translation.slug,
  }
}

/**
 * Fetch a product by slug with translations applied for the given locale
 */
export async function getProductBySlug(slug: string, locale: string) {
  // Try to find by translated slug first
  const translatedProduct = await prisma.product.findFirst({
    where: {
      translations: {
        some: {
          slug,
          locale,
        },
      },
    },
    include: {
      images: {
        orderBy: { position: 'asc' },
      },
      category: {
        include: {
          translations: true,
        },
      },
      variantOptions: {
        include: {
          values: {
            orderBy: { position: 'asc' },
          },
        },
        orderBy: { position: 'asc' },
      },
      variants: {
        orderBy: { createdAt: 'asc' },
      },
      translations: true,
    },
  })

  if (translatedProduct) {
    return {
      ...applyProductTranslation(translatedProduct, locale),
      category: translatedProduct.category
        ? applyCategoryTranslation(translatedProduct.category, locale)
        : null,
    }
  }

  // Fallback to default slug
  const product = await prisma.product.findUnique({
    where: { slug },
    include: {
      images: {
        orderBy: { position: 'asc' },
      },
      category: {
        include: {
          translations: true,
        },
      },
      variantOptions: {
        include: {
          values: {
            orderBy: { position: 'asc' },
          },
        },
        orderBy: { position: 'asc' },
      },
      variants: {
        orderBy: { createdAt: 'asc' },
      },
      translations: true,
    },
  })

  if (!product) {
    return null
  }

  return {
    ...applyProductTranslation(product, locale),
    category: product.category
      ? applyCategoryTranslation(product.category, locale)
      : null,
  }
}

/**
 * Fetch products with translations applied for the given locale
 */
export async function getProducts(
  options: {
    where?: any
    orderBy?: any
    take?: number
    skip?: number
  },
  locale: string
) {
  const products = await prisma.product.findMany({
    ...options,
    include: {
      images: {
        orderBy: { position: 'asc' },
        take: 1,
      },
      category: {
        include: {
          translations: true,
        },
      },
      translations: true,
    },
  })

  return products.map(product => ({
    ...applyProductTranslation(product, locale),
    category: product.category
      ? applyCategoryTranslation(product.category, locale)
      : null,
  }))
}

/**
 * Fetch categories with translations applied for the given locale
 */
export async function getCategories(locale: string) {
  const categories = await prisma.category.findMany({
    include: {
      translations: true,
    },
    orderBy: { name: 'asc' },
  })

  return categories.map(category => applyCategoryTranslation(category, locale))
}

/**
 * Fetch a category by slug with translations applied for the given locale
 */
export async function getCategoryBySlug(slug: string, locale: string) {
  // Try to find by translated slug first
  const translatedCategory = await prisma.category.findFirst({
    where: {
      translations: {
        some: {
          slug,
          locale,
        },
      },
    },
    include: {
      translations: true,
    },
  })

  if (translatedCategory) {
    return applyCategoryTranslation(translatedCategory, locale)
  }

  // Fallback to default slug
  const category = await prisma.category.findUnique({
    where: { slug },
    include: {
      translations: true,
    },
  })

  if (!category) {
    return null
  }

  return applyCategoryTranslation(category, locale)
}
