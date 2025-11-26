import FeatureGateLayout from '@/components/admin/FeatureGateLayout'

export default function AnalyticsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <FeatureGateLayout
      featureName="analytics_dashboard"
      featureDisplayName="Analytics Dashboard"
    >
      {children}
    </FeatureGateLayout>
  )
}
