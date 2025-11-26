import FeatureGateLayout from '@/components/admin/FeatureGateLayout'

export default function RefundsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <FeatureGateLayout
      featureName="refund_management"
      featureDisplayName="Refund Management"
    >
      {children}
    </FeatureGateLayout>
  )
}
