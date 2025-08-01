"use client"

import { useEffect, useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import { Card, CardContent } from '@/components/ui/card'
import { Loader2 } from 'lucide-react'

interface AuthGuardProps {
  children: React.ReactNode
}

export default function AuthGuard({ children }: AuthGuardProps) {
  const { user, isLoading, isAuthenticated } = useAuth()
  const router = useRouter()
  const [isChecking, setIsChecking] = useState(true)

  useEffect(() => {
    if (!isLoading) {
      if (!isAuthenticated) {
        console.log('AuthGuard - Not authenticated, redirecting to login')
        router.push('/login')
      } else {
        console.log('AuthGuard - Authenticated, allowing access')
        setIsChecking(false)
      }
    }
  }, [isLoading, isAuthenticated, router])

  // Show loading while checking authentication
  if (isLoading || isChecking) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 dark:from-gray-950 dark:via-gray-900 dark:to-indigo-950 flex items-center justify-center">
        <Card className="border-0 shadow-2xl bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm">
          <CardContent className="p-8 text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-indigo-600" />
            <p className="text-gray-600 dark:text-gray-400">Checking authentication...</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  // If not authenticated, don't render children (will redirect)
  if (!isAuthenticated) {
    return null
  }

  // If authenticated, render children
  return <>{children}</>
} 