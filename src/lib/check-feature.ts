import { prisma } from '@/lib/prisma';

export async function isFeatureEnabled(featureName: string): Promise<boolean> {
  try {
    const feature = await prisma.featureFlag.findUnique({
      where: { name: featureName },
      select: { enabled: true },
    });

    return feature?.enabled || false;
  } catch (error) {
    console.error(`Error checking feature ${featureName}:`, error);
    return false;
  }
}
