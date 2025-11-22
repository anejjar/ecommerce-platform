import { prisma } from './prisma'

/**
 * Check if a feature is enabled
 */
export async function isFeatureEnabled(featureName: string): Promise<boolean> {
  try {
    const feature = await prisma.featureFlag.findUnique({
      where: { name: featureName },
    })
    return feature?.enabled ?? false
  } catch (error) {
    console.error(`Error checking feature flag ${featureName}:`, error)
    return false
  }
}

/**
 * Get all enabled features
 */
export async function getEnabledFeatures(): Promise<string[]> {
  try {
    const features = await prisma.featureFlag.findMany({
      where: { enabled: true },
      select: { name: true },
    })
    return features.map(f => f.name)
  } catch (error) {
    console.error('Error getting enabled features:', error)
    return []
  }
}
