import FeatureGateLayout from '@/components/admin/FeatureGateLayout'

export default function AbandonedCartsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <FeatureGateLayout
      featureName="abandoned_cart"
      featureDisplayName="Abandoned Cart Recovery"
    >
      {children}
    </FeatureGateLayout>
  )
}
