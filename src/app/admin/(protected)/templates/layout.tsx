import FeatureGateLayout from '@/components/admin/FeatureGateLayout'

export default function TemplatesLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <FeatureGateLayout
      featureName="template_manager"
      featureDisplayName="Template Manager"
    >
      {children}
    </FeatureGateLayout>
  )
}
