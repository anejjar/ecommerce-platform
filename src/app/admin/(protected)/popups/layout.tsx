import FeatureGateLayout from '@/components/admin/FeatureGateLayout'

export default function PopupsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <FeatureGateLayout
      featureName="exit_intent_popups"
      featureDisplayName="Exit-Intent Popups"
    >
      {children}
    </FeatureGateLayout>
  )
}
