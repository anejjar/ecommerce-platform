import FeatureGateLayout from '@/components/admin/FeatureGateLayout'

export default function InventoryLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <FeatureGateLayout
      featureName="inventory_management"
      featureDisplayName="Inventory Management"
    >
      {children}
    </FeatureGateLayout>
  )
}
