"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

interface LicenseAuthProps {
  onAuthenticated: () => void
}

export default function LicenseAuth({ onAuthenticated }: LicenseAuthProps) {
  const [accessCode, setAccessCode] = useState("")
  const [error, setError] = useState("")
  const router = useRouter()

  const handleAccessCodeSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    // Access codes for different user types
    const validCodes = [
      "kings_license_2024", // Client access
      "alpha_dev_2024",     // Developer access
      "admin_alpha_2024"    // Admin access
    ]
    
    if (validCodes.includes(accessCode)) {
      onAuthenticated()
      setError("")
    } else {
      setError("Invalid access code. Please contact the developer for access.")
    }
  }

  const handleUnauthorizedAccess = () => {
    router.push("/")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-red-50 dark:from-gray-900 dark:via-gray-800 dark:to-orange-900 transition-colors duration-300">
      <div className="container mx-auto px-4 py-16 max-w-md">
        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-xl border border-orange-200 dark:border-orange-800 p-8">
          
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              🔒 Protected License Agreement
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              This page contains sensitive legal information and requires authentication.
            </p>
          </div>

          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 mb-6">
            <p className="text-red-800 dark:text-red-200 text-sm">
              ⚠️ <strong>Access Restricted:</strong> This license agreement is protected and requires proper authorization to view.
            </p>
          </div>

          <form onSubmit={handleAccessCodeSubmit} className="space-y-4">
            <div>
              <label htmlFor="accessCode" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Access Code
              </label>
              <input
                type="password"
                id="accessCode"
                value={accessCode}
                onChange={(e) => setAccessCode(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 dark:bg-gray-700 dark:text-white"
                placeholder="Enter access code"
                required
              />
            </div>
            
            {error && (
              <div className="text-red-600 dark:text-red-400 text-sm">
                {error}
              </div>
            )}
            
            <div className="flex space-x-3">
              <button
                type="submit"
                className="flex-1 bg-orange-600 hover:bg-orange-700 text-white font-medium py-2 px-4 rounded-md transition-colors duration-200"
              >
                Access License
              </button>
              <button
                type="button"
                onClick={handleUnauthorizedAccess}
                className="flex-1 bg-gray-500 hover:bg-gray-600 text-white font-medium py-2 px-4 rounded-md transition-colors duration-200"
              >
                Go Back
              </button>
            </div>
          </form>

          <div className="mt-6 text-center">
            <p className="text-xs text-gray-500 dark:text-gray-400">
              For access, contact: Alpha Amadu Bah (074762243)
            </p>
          </div>
        </div>
      </div>
    </div>
  )
} 