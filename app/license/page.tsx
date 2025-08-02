import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Software License Agreement - Kings Bakery",
  description: "Software license agreement for Kings Bakery website system.",
}

export default function LicensePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-red-50 dark:from-gray-900 dark:via-gray-800 dark:to-orange-900 transition-colors duration-300">
      <div className="container mx-auto px-4 py-16 max-w-4xl">
        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-xl border border-orange-200 dark:border-orange-800 p-8">
          
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Software License Agreement
            </h1>
            <p className="text-gray-600 dark:text-gray-400 text-lg">
              Last updated: {new Date().toLocaleDateString('en-US', { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </p>
            <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
              <p className="text-blue-800 dark:text-blue-200 font-semibold">
                📋 This agreement governs the use of the Kings Bakery website system
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
                  <strong>Licensor (Developer):</strong> Ahmad (074762243)<br />
                  <strong>Licensee (Client):</strong> Kings Bakery<br />
                  <strong>Software:</strong> Kings Bakery Website System<br />
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
                  The Developer (Ahmad) retains full ownership of all intellectual property rights, including but not limited to:
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
                3. License Grant
              </h2>
              <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6 mb-4">
                <p className="text-blue-800 dark:text-blue-200 font-semibold mb-2">
                  📜 LICENSE TERMS:
                </p>
                <p className="text-blue-700 dark:text-blue-300 mb-3">
                  The Developer grants Kings Bakery a perpetual, non-exclusive, worldwide license to:
                </p>
                <ul className="list-disc pl-6 text-blue-700 dark:text-blue-300 space-y-2">
                  <li><strong>Use:</strong> Access and use the website system for business operations</li>
                  <li><strong>Modify:</strong> Customize, alter, and modify the system as needed</li>
                  <li><strong>Maintain:</strong> Update, maintain, and improve the system</li>
                  <li><strong>Host:</strong> Deploy and host the system on any platform</li>
                  <li><strong>Integrate:</strong> Connect with third-party services and APIs</li>
                </ul>
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
                  <p><strong>No Additional Fees:</strong> No recurring payments, maintenance fees, or renewal charges</p>
                  <p><strong>Perpetual Rights:</strong> Full access granted immediately upon payment</p>
                </div>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                4. Modification Rights
              </h2>
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                Kings Bakery has the right to modify the system in any way, including but not limited to:
              </p>
              <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 space-y-2 mb-4">
                <li>Changing colors, fonts, and visual design</li>
                <li>Adding or removing features and functionality</li>
                <li>Modifying database structure and content</li>
                <li>Integrating with new services and platforms</li>
                <li>Updating content, images, and branding</li>
                <li>Customizing user interface and experience</li>
                <li>Adding new pages, sections, or components</li>
                <li>Modifying business logic and workflows</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                5. Perpetual Access
              </h2>
              <div className="bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-lg p-6 mb-4">
                <p className="text-purple-800 dark:text-purple-200 font-semibold mb-2">
                  🔄 PERPETUAL RIGHTS:
                </p>
                <ul className="list-disc pl-6 text-purple-700 dark:text-purple-300 space-y-2">
                  <li><strong>No Expiration:</strong> This license has no expiration date</li>
                  <li><strong>Unlimited Use:</strong> Kings Bakery can use the system indefinitely</li>
                  <li><strong>No Renewal Fees:</strong> No ongoing licensing fees or payments</li>
                  <li><strong>One-Time Payment:</strong> $100 USD paid in full - no additional charges</li>
                  <li><strong>Transfer of Access:</strong> Access rights cannot be revoked by the Developer</li>
                  <li><strong>Business Continuity:</strong> System remains available for business operations</li>
                </ul>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                6. Restrictions and Limitations
              </h2>
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6 mb-4">
                <p className="text-red-800 dark:text-red-200 font-semibold mb-2">
                  ⚠️ IMPORTANT RESTRICTIONS:
                </p>
                <ul className="list-disc pl-6 text-red-700 dark:text-red-300 space-y-2">
                  <li><strong>NO RESALE:</strong> Kings Bakery may not sell, resell, or commercially distribute the system</li>
                  <li><strong>NO TRANSFER:</strong> Kings Bakery may not transfer the license to another business</li>
                  <li><strong>NO SUBLICENSING:</strong> Kings Bakery may not sublicense the system to third parties</li>
                  <li><strong>NO WHITE-LABELING:</strong> Kings Bakery may not rebrand the system as their own product</li>
                  <li><strong>ATTRIBUTION:</strong> Developer attribution must remain visible and unmodified</li>
                </ul>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                7. Attribution Requirements
              </h2>
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                Kings Bakery must maintain the original developer attribution in the following forms:
              </p>
              <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 space-y-2 mb-4">
                <li>The watermark displaying "made by ahmad 074762243" must remain visible</li>
                <li>Developer attribution in the terms and conditions page</li>
                <li>Any other attribution elements that identify the original developer</li>
                <li>These elements may not be removed, hidden, or modified</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                8. Support and Maintenance
              </h2>
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                The Developer is not obligated to provide ongoing support, maintenance, or updates. Kings Bakery is responsible for:
              </p>
              <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 space-y-2 mb-4">
                <li>Maintaining and updating the system</li>
                <li>Fixing bugs and issues</li>
                <li>Adding new features and functionality</li>
                <li>Ensuring system security and performance</li>
                <li>Backing up data and configurations</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                9. Warranty and Liability
              </h2>
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                The system is provided "as is" without any warranties. The Developer shall not be liable for any damages arising from the use or modification of the system by Kings Bakery.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                10. Termination
              </h2>
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                This license is perpetual and cannot be terminated by the Developer. However, Kings Bakery's rights may be limited if they violate the restrictions outlined in Section 6.
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
                For questions about this software license agreement, please contact:
              </p>
              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                <p className="text-gray-700 dark:text-gray-300">
                  <strong>Developer:</strong> Ahmad<br />
                  <strong>Contact:</strong> 074762243<br />
                  <strong>Email:</strong>ahmadbahofficial@gmail.com<br />
                  <strong>Location:</strong> Sierra Leone
                </p>
              </div>
            </section>

            {/* Agreement Summary */}
            <section className="mt-12 p-6 bg-gradient-to-r from-orange-100 to-red-100 dark:from-orange-900/20 dark:to-red-900/20 rounded-lg border border-orange-200 dark:border-orange-800">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                📋 Agreement Summary
              </h3>
              <div className="grid md:grid-cols-2 gap-4 text-sm mb-4">
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-2">✅ What Kings Bakery Can Do:</h4>
                  <ul className="text-gray-700 dark:text-gray-300 space-y-1">
                    <li>• Use the system forever</li>
                    <li>• Modify and customize freely</li>
                    <li>• Add new features</li>
                    <li>• Change design and content</li>
                    <li>• Host on any platform</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-2">❌ What Kings Bakery Cannot Do:</h4>
                  <ul className="text-gray-700 dark:text-gray-300 space-y-1">
                    <li>• Sell the system to others</li>
                    <li>• Give it to another business</li>
                    <li>• Remove developer attribution</li>
                    <li>• Claim ownership of the code</li>
                    <li>• Resell as their own product</li>
                  </ul>
                </div>
              </div>
              <div className="bg-white/50 dark:bg-gray-700/50 rounded-lg p-4 border border-orange-200 dark:border-orange-800">
                <h4 className="font-semibold text-gray-900 dark:text-white mb-2">💰 Payment Information:</h4>
                <div className="text-gray-700 dark:text-gray-300">
                  <p><strong>License Fee:</strong> $100 USD (One-time payment)</p>
                  <p><strong>Payment Status:</strong> ✅ Paid in full</p>
                  <p><strong>No Additional Fees:</strong> No recurring payments or renewal charges</p>
                </div>
              </div>
            </section>

          </div>
        </div>
      </div>
    </div>
  )
} 