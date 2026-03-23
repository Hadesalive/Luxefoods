"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"

// Tamper-proof constants - these would be embedded during build
const LAST_UPDATED = "2024-12-19T10:30:00Z"
const BUILD_HASH = "a1b2c3d4e5f6"
const DOCUMENT_ID = "KB-LICENSE-2024-001"

export default function LicensePage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [accessCode, setAccessCode] = useState("")
  const [error, setError] = useState("")
  const router = useRouter()

  // Check for direct access attempts
  useEffect(() => {
    const referrer = document.referrer
    const isDirectAccess = !referrer || referrer === ""
    
    // Allow access from admin pages or specific allowed domains
    const allowedDomains = [
      window.location.origin,
      "https://luxefood.com",
      "http://localhost:3000"
    ]
    
    const isFromAllowedDomain = allowedDomains.some(domain => 
      referrer.startsWith(domain)
    )

    // If direct access and not from allowed domain, require authentication
    if (isDirectAccess && !isFromAllowedDomain) {
      setIsAuthenticated(false)
    } else {
      // Check for admin access patterns
      const urlParams = new URLSearchParams(window.location.search)
      const adminKey = urlParams.get("admin")
      const timestamp = urlParams.get("t")
      
      if (adminKey === "alpha_dev_2024" && timestamp) {
        const currentTime = Date.now()
        const requestTime = parseInt(timestamp)
        const timeDiff = currentTime - requestTime
        
        // Allow access if request is within 5 minutes
        if (timeDiff < 300000) {
          setIsAuthenticated(true)
        }
      }
    }
  }, [])

  const handleAccessCodeSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    // Simple access code validation
    if (accessCode === "kings_license_2024" || accessCode === "alpha_dev_2024") {
      setIsAuthenticated(true)
      setError("")
    } else {
      setError("Invalid access code. Please contact the developer for access.")
    }
  }

  const handleUnauthorizedAccess = () => {
    router.push("/")
  }

  // If not authenticated, show access form
  if (!isAuthenticated) {
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

  // Authenticated content
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-red-50 dark:from-gray-900 dark:via-gray-800 dark:to-orange-900 transition-colors duration-300">
      <div className="container mx-auto px-4 py-16 max-w-4xl">
        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-xl border border-orange-200 dark:border-orange-800 p-8">
          
          {/* Security Header */}
          <div className="mb-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-800 dark:text-green-200 font-semibold">
                  ✅ Authenticated Access - License Agreement
                </p>
                <p className="text-green-700 dark:text-green-300 text-sm">
                  Last Updated: {new Date(LAST_UPDATED).toLocaleString('en-US', { 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                    timeZoneName: 'short'
                  })}
                </p>
              </div>
              <div className="text-xs text-green-600 dark:text-green-400">
                Build: {BUILD_HASH}
              </div>
            </div>
          </div>
          
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Software License Agreement
            </h1>
            <p className="text-gray-600 dark:text-gray-400 text-lg">
              Last updated: {new Date(LAST_UPDATED).toLocaleDateString('en-US', { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </p>
            <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
              <p className="text-blue-800 dark:text-blue-200 font-semibold">
                📋 This agreement governs the use of the LUXE FOOD website system
              </p>
            </div>
          </div>

          {/* Content */}
          <div className="prose prose-lg dark:prose-invert max-w-none">
            
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                1. Parties to This Agreement
              </h2>
              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 mb-4">
                <p className="text-gray-700 dark:text-gray-300">
                  <strong>Licensor (Developer):</strong> Alpha Amadu Bah (074762243)<br />
                  <strong>Licensee (Client):</strong> LUXE FOOD<br />
                  <strong>Software:</strong> LUXE FOOD Website System<br />
                  <strong>License Fee:</strong> $100 USD (One-time payment)
                </p>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                2. Ownership of Intellectual Property
              </h2>
              <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-6 mb-4">
                <p className="text-green-800 dark:text-green-200 font-semibold mb-2">
                  ✅ OWNERSHIP DECLARATION:
                </p>
                <p className="text-green-700 dark:text-green-300">
                  The Developer (Alpha Amadu Bah) retains full ownership of all intellectual property rights, including but not limited to:
                </p>
                <ul className="list-disc pl-6 text-green-700 dark:text-green-300 space-y-2 mt-3">
                  <li>Source code and programming logic</li>
                  <li>System architecture and design patterns</li>
                  <li>Database structure and schema</li>
                  <li>Custom components and libraries</li>
                  <li>Technical documentation and specifications</li>
                </ul>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                3. License Grant and Access Rights
              </h2>
              <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6 mb-4">
                <p className="text-blue-800 dark:text-blue-200 font-semibold mb-2">
                  📜 LICENSE TERMS:
                </p>
                <p className="text-blue-700 dark:text-blue-300 mb-3">
                  The Developer grants LUXE FOOD a perpetual, non-exclusive, worldwide license to:
                </p>
                <ul className="list-disc pl-6 text-blue-700 dark:text-blue-300 space-y-2">
                  <li><strong>System Access:</strong> Full access to the website system frontend and backend</li>
                  <li><strong>Use:</strong> Access and use the website system for business operations</li>
                  <li><strong>Host:</strong> Deploy and host the system on any platform</li>
                  <li><strong>Integrate:</strong> Connect with third-party services and APIs</li>
                  <li><strong>Content Management:</strong> Update content, images, and business information</li>
                </ul>
                <div className="mt-4 p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded">
                  <p className="text-yellow-800 dark:text-yellow-200 font-semibold">
                    ⚠️ IMPORTANT: Source code access is NOT included in this license. The customer has access to the system functionality but not the underlying source code.
                  </p>
                </div>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                4. Payment and License Fee
              </h2>
              <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-6 mb-4">
                <p className="text-green-800 dark:text-green-200 font-semibold mb-2">
                  💰 PAYMENT DETAILS:
                </p>
                <div className="text-green-700 dark:text-green-300 space-y-2">
                  <p><strong>License Fee:</strong> $100 USD</p>
                  <p><strong>Payment Type:</strong> One-time payment</p>
                  <p><strong>Payment Status:</strong> Paid in full</p>
                  <p><strong>Coverage:</strong> Covers current system access and functionality</p>
                  <p><strong>Perpetual Rights:</strong> Full system access granted immediately upon payment</p>
                </div>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                5. Future Modifications and Maintenance
              </h2>
              <div className="bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-lg p-6 mb-4">
                <p className="text-purple-800 dark:text-purple-200 font-semibold mb-2">
                  🔧 FUTURE SERVICES POLICY:
                </p>
                <div className="text-purple-700 dark:text-purple-300 space-y-3">
                  <p><strong>No Current Agreement:</strong> There is no existing agreement for maintenance, updates, or future modifications.</p>
                  <p><strong>Developer's Sole Discretion:</strong> The Developer reserves the sole right to determine:</p>
                  <ul className="list-disc pl-6 space-y-1">
                    <li>Whether to provide future modifications or updates</li>
                    <li>The pricing for any additional services</li>
                    <li>The scope and timeline of any work</li>
                    <li>Whether to accept requests for new features or changes</li>
                  </ul>
                  <p><strong>Service Evaluation:</strong> Any future services will be evaluated based on:</p>
                  <ul className="list-disc pl-6 space-y-1">
                    <li>The complexity and scope of requested changes</li>
                    <li>The amount originally paid ($100 USD)</li>
                    <li>The caliber and quality of the current system</li>
                    <li>Market rates for similar services</li>
                  </ul>
                </div>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                6. Perpetual Access
              </h2>
              <div className="bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-lg p-6 mb-4">
                <p className="text-purple-800 dark:text-purple-200 font-semibold mb-2">
                  🔄 PERPETUAL RIGHTS:
                </p>
                <ul className="list-disc pl-6 text-purple-700 dark:text-purple-300 space-y-2">
                  <li><strong>No Expiration:</strong> This license has no expiration date</li>
                  <li><strong>Unlimited Use:</strong> LUXE FOOD can use the system indefinitely</li>
                  <li><strong>No Renewal Fees:</strong> No ongoing licensing fees or payments</li>
                  <li><strong>One-Time Payment:</strong> $100 USD paid in full - no additional charges</li>
                  <li><strong>Transfer of Access:</strong> Access rights cannot be revoked by the Developer</li>
                  <li><strong>Business Continuity:</strong> System remains available for business operations</li>
                </ul>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                7. Restrictions and Limitations
              </h2>
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6 mb-4">
                <p className="text-red-800 dark:text-red-200 font-semibold mb-2">
                  ⚠️ IMPORTANT RESTRICTIONS:
                </p>
                <ul className="list-disc pl-6 text-red-700 dark:text-red-300 space-y-2">
                  <li><strong>NO SOURCE CODE ACCESS:</strong> LUXE FOOD does not have access to the underlying source code</li>
                  <li><strong>NO RESALE:</strong> LUXE FOOD may not sell, resell, or commercially distribute the system</li>
                  <li><strong>NO TRANSFER:</strong> LUXE FOOD may not transfer the license to another business</li>
                  <li><strong>NO SUBLICENSING:</strong> LUXE FOOD may not sublicense the system to third parties</li>
                  <li><strong>NO WHITE-LABELING:</strong> LUXE FOOD may not rebrand the system as their own product</li>
                  <li><strong>NO REVERSE ENGINEERING:</strong> LUXE FOOD may not attempt to reverse engineer or decompile the system</li>
                </ul>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                8. Support and Maintenance
              </h2>
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                The Developer is not obligated to provide ongoing support, maintenance, or updates. LUXE FOOD is responsible for:
              </p>
              <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 space-y-2 mb-4">
                <li>Maintaining and updating the system within their access capabilities</li>
                <li>Managing content and business information</li>
                <li>Ensuring system security and performance</li>
                <li>Backing up data and configurations</li>
                <li>Contacting the Developer for any modifications beyond their access level</li>
              </ul>
              <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                <p className="text-blue-800 dark:text-blue-200 font-semibold">
                  💡 Note: For any system modifications, new features, or technical changes, LUXE FOOD must contact the Developer directly. The Developer will evaluate each request individually and determine appropriate pricing and terms.
                </p>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                9. Warranty and Liability
              </h2>
              <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-6 mb-4">
                <p className="text-yellow-800 dark:text-yellow-200 font-semibold mb-2">
                  🔧 DEVELOPER RESPONSIBILITIES:
                </p>
                <div className="text-yellow-700 dark:text-yellow-300 space-y-3">
                  <p><strong>Code and Business Logic Issues:</strong> The Developer will fix bugs and issues related to:</p>
                  <ul className="list-disc pl-6 space-y-1">
                    <li>Codebase functionality and errors</li>
                    <li>Business logic implementation</li>
                    <li>System design flaws</li>
                    <li>Core feature malfunctions</li>
                  </ul>
                  <p><strong>Scaling Issues:</strong> The Developer is NOT responsible for:</p>
                  <ul className="list-disc pl-6 space-y-1">
                    <li>Performance issues due to high traffic or usage</li>
                    <li>Server capacity limitations</li>
                    <li>Database scaling problems</li>
                    <li>Infrastructure-related performance issues</li>
                    <li>Third-party service limitations</li>
                  </ul>
                </div>
              </div>
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                The system is provided "as is" without any warranties beyond the specific responsibilities outlined above. The Developer shall not be liable for any damages arising from the use or modification of the system by LUXE FOOD, except for issues directly related to the Developer's code or business logic implementation.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                10. Termination
              </h2>
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                This license is perpetual and cannot be terminated by the Developer. However, LUXE FOOD's rights may be limited if they violate the restrictions outlined in Section 7.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                11. Governing Law
              </h2>
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                This agreement shall be governed by and construed in accordance with the laws of Sierra Leone.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                12. Contact Information
              </h2>
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                For questions about this software license agreement or to request future modifications, please contact:
              </p>
              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                <p className="text-gray-700 dark:text-gray-300">
                  <strong>Developer:</strong> Alpha Amadu Bah<br />
                  <strong>Contact:</strong> 074762243<br />
                  <strong>Email:</strong>ahmadbahofficial@gmail.com<br />
                  <strong>Location:</strong> Sierra Leone
                </p>
              </div>
            </section>


            <section className="mt-12 p-6 bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700 rounded-lg border border-gray-300 dark:border-gray-600">
              <div className="text-center">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
                  🔒 Document Security Information
                </h3>
                <div className="grid md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray-700 dark:text-gray-300">
                      <strong>Document ID:</strong> {DOCUMENT_ID}
                    </p>
                    <p className="text-gray-700 dark:text-gray-300">
                      <strong>Last Updated:</strong> {new Date(LAST_UPDATED).toLocaleString()}
                    </p>
                    <p className="text-gray-700 dark:text-gray-300">
                      <strong>Build Hash:</strong> {BUILD_HASH}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-700 dark:text-gray-300">
                      <strong>Access Method:</strong> Authenticated
                    </p>
                    <p className="text-gray-700 dark:text-gray-300">
                      <strong>Session Time:</strong> {new Date().toLocaleString()}
                    </p>
                    <p className="text-gray-700 dark:text-gray-300">
                      <strong>Document Status:</strong> Valid
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* Agreement Summary */}
            <section className="mt-12 p-6 bg-gradient-to-r from-orange-100 to-red-100 dark:from-orange-900/20 dark:to-red-900/20 rounded-lg border border-orange-200 dark:border-orange-800">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                📋 Agreement Summary
              </h3>
              <div className="grid md:grid-cols-2 gap-4 text-sm mb-4">
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-2">✅ What LUXE FOOD Can Do:</h4>
                  <ul className="text-gray-700 dark:text-gray-300 space-y-1">
                    <li>• Use the system forever</li>
                    <li>• Access frontend and backend</li>
                    <li>• Update content and information</li>
                    <li>• Host on any platform</li>
                    <li>• Integrate with third-party services</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-2">❌ What LUXE FOOD Cannot Do:</h4>
                  <ul className="text-gray-700 dark:text-gray-300 space-y-1">
                    <li>• Access the source code</li>
                    <li>• Sell the system to others</li>
                    <li>• Give it to another business</li>
                    <li>• Claim ownership of the code</li>
                    <li>• Reverse engineer the system</li>
                  </ul>
                </div>
              </div>
              <div className="bg-white/50 dark:bg-gray-700/50 rounded-lg p-4 border border-orange-200 dark:border-orange-800">
                <h4 className="font-semibold text-gray-900 dark:text-white mb-2">💰 Payment Information:</h4>
                <div className="text-gray-700 dark:text-gray-300">
                  <p><strong>License Fee:</strong> $100 USD (One-time payment)</p>
                  <p><strong>Payment Status:</strong> ✅ Paid in full</p>
                  <p><strong>Future Services:</strong> At Developer's sole discretion and pricing</p>
                </div>
              </div>
            </section>

          </div>
        </div>
      </div>
    </div>
  )
} 