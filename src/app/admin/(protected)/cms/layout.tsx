import FeatureGateLayout from '@/components/admin/FeatureGateLayout'

export default function CMSLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <FeatureGateLayout
      featureName="cms"
      featureDisplayName="Content Management System"
    >
      {children}
    </FeatureGateLayout>
  )
}
