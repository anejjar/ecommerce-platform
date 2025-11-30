import { prisma } from './prisma';

export type PageOverrideType = 'HOME' | 'SHOP' | 'PRODUCT' | 'CART' | 'CHECKOUT' | 'BLOG' | 'BLOG_POST';

/**
 * Get a published page that overrides a specific storefront page type
 * @param pageType The type of page to check for override
 * @returns The override page if found, null otherwise
 */
export async function getPageOverride(pageType: PageOverrideType) {
  try {
    const overridePage = await prisma.page.findFirst({
      where: {
        overridesStorefrontPage: true,
        overriddenPageType: pageType,
        status: 'PUBLISHED',
      },
      include: {
        blocks: {
          include: {
            template: true,
          },
          orderBy: {
            order: 'asc',
          },
        },
      },
    });

    return overridePage;
  } catch (error) {
    console.error(`Error fetching page override for ${pageType}:`, error);
    return null;
  }
}

/**
 * Get all page override types that are currently active
 * @returns Array of page types that have active overrides
 */
export async function getActiveOverrides(): Promise<PageOverrideType[]> {
  try {
    const overrides = await prisma.page.findMany({
      where: {
        overridesStorefrontPage: true,
        status: 'PUBLISHED',
        overriddenPageType: {
          not: null,
        },
      },
      select: {
        overriddenPageType: true,
      },
    });

    return overrides
      .map((o) => o.overriddenPageType)
      .filter((type): type is PageOverrideType => type !== null);
  } catch (error) {
    console.error('Error fetching active overrides:', error);
    return [];
  }
}

/**
 * Check if a specific page type has an active override
 * @param pageType The page type to check
 * @returns true if an override exists, false otherwise
 */
export async function hasPageOverride(pageType: PageOverrideType): Promise<boolean> {
  const override = await getPageOverride(pageType);
  return override !== null;
}

