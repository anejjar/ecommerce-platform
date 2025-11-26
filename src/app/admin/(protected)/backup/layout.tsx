import FeatureGateLayout from '@/components/admin/FeatureGateLayout'

export default function BackupLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <FeatureGateLayout
      featureName="backup_export"
      featureDisplayName="Backup & Data Export"
    >
      {children}
    </FeatureGateLayout>
  )
}
