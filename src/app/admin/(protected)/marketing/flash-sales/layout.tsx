import FeatureGateLayout from '@/components/admin/FeatureGateLayout'

export default function FlashSalesLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <FeatureGateLayout
      featureName="flash_sales"
      featureDisplayName="Flash Sales & Scheduled Promotions"
    >
      {children}
    </FeatureGateLayout>
  )
}

