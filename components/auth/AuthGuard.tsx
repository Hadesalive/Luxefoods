"use client"

import { useAuth } from "@/contexts/AuthContext"
import { useRouter, usePathname } from "next/navigation"
import { useEffect } from "react"

interface AuthGuardProps {
  children: React.ReactNode
}

export function AuthGuard({ children }: AuthGuardProps) {
  const { isAuthenticated, isLoading } = useAuth()
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    console.log("🔍 AuthGuard Debug:", { isAuthenticated, isLoading, pathname })
    
    // Only redirect if we're sure the user is not authenticated
    if (!isLoading && !isAuthenticated) {
      console.log("🔄 AuthGuard - Redirecting to login")
      router.push("/login")
    }
  }, [isAuthenticated, isLoading, router, pathname])

  // Show loading spinner while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black dark:border-white mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Loading...</p>
        </div>
      </div>
    )
  }

  // Allow access if authenticated or still loading
  if (isAuthenticated || isLoading) {
    return <>{children}</>
  }

  // Don't render anything if not authenticated (will redirect)
  return null

  return <>{children}</>
} 