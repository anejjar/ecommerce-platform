import FeatureGateLayout from '@/components/admin/FeatureGateLayout'

export default function ProtectedPOSLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <FeatureGateLayout
      featureName="pos_system"
      featureDisplayName="POS System"
    >
      {children}
    </FeatureGateLayout>
  )
}

