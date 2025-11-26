'use client'

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'

interface FeatureGateLayoutProps {
  featureName: string
  featureDisplayName: string
  children: React.ReactNode
}

export default function FeatureGateLayout({
  featureName,
  featureDisplayName,
  children,
}: FeatureGateLayoutProps) {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [featureEnabled, setFeatureEnabled] = useState<boolean | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const checkFeatureAccess = async () => {
      try {
        // Check if feature is enabled
        const response = await fetch('/api/features/enabled')
        if (response.ok) {
          const data = await response.json()
          const isEnabled = data.features?.includes(featureName)
          setFeatureEnabled(isEnabled)

          if (!isEnabled) {
            // Feature is disabled - redirect to admin dashboard
            toast.error(`${featureDisplayName} feature is not available`)
            router.push('/admin')
            return
          }
        } else {
          // If API fails, assume feature is disabled
          setFeatureEnabled(false)
          router.push('/admin')
          return
        }
      } catch (error) {
        console.error('Error checking feature access:', error)
        setFeatureEnabled(false)
        toast.error('Unable to verify feature access')
        router.push('/admin')
      } finally {
        setIsLoading(false)
      }
    }

    if (status !== 'loading' && session) {
      checkFeatureAccess()
    }
  }, [status, session, router, featureName, featureDisplayName])

  // Show loading state while checking
  if (status === 'loading' || isLoading || featureEnabled === null) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  // If feature is disabled, show nothing (will redirect)
  if (!featureEnabled) {
    return null
  }

  // Feature is enabled - render children
  return <>{children}</>
}
