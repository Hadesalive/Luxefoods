"use client"

import { useState } from "react"

const LAST_UPDATED = "2024-12-19T11:00:00Z"
const POLICY_VERSION = "1.0"
const DOCUMENT_ID = "KB-PRIVACY-2024-001"

export default function PrivacyPage() {

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-red-50 dark:from-gray-900 dark:via-gray-800 dark:to-orange-900 transition-colors duration-300">
      <div className="container mx-auto px-4 py-16 max-w-4xl">
        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-xl border border-orange-200 dark:border-orange-800 p-8">
          
          {/* Security Header */}
          <div className="mb-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-800 dark:text-green-200 font-semibold">
                  ✅ Authenticated Access - Privacy Policy
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
                Version: {POLICY_VERSION}
              </div>
            </div>
          </div>
          
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Privacy Policy
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
                📋 This policy describes how LUXE FOOD collects, uses, and protects your information
              </p>
            </div>
          </div>

          {/* Content */}
          <div className="prose prose-lg dark:prose-invert max-w-none">
            
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                1. Introduction
              </h2>
              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 mb-4">
                <p className="text-gray-700 dark:text-gray-300">
                  <strong>Company:</strong> LUXE FOOD<br />
                  <strong>Website:</strong> https://luxefood.com<br />
                  <strong>Contact:</strong> 076825325<br />
                  <strong>Location:</strong> Freetown, Sierra Leone<br />
                  <strong>Effective Date:</strong> {new Date(LAST_UPDATED).toLocaleDateString()}
                </p>
              </div>
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                At LUXE FOOD, we are committed to protecting your privacy and ensuring the security of your personal information. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website, use our services, or interact with us.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                2. Information We Collect
              </h2>
              <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6 mb-4">
                <p className="text-blue-800 dark:text-blue-200 font-semibold mb-2">
                  📊 PERSONAL INFORMATION WE COLLECT:
                </p>
                <div className="text-blue-700 dark:text-blue-300 space-y-3">
                  <p><strong>Contact Information:</strong></p>
                  <ul className="list-disc pl-6 space-y-1">
                    <li>Name and phone number (for order processing)</li>
                    <li>Delivery address and location details</li>
                    <li>Email address (if provided for notifications)</li>
                  </ul>
                  
                  <p><strong>Order Information:</strong></p>
                  <ul className="list-disc pl-6 space-y-1">
                    <li>Food preferences and dietary requirements</li>
                    <li>Order history and purchase patterns</li>
                    <li>Payment information (processed securely)</li>
                  </ul>
                  
                  <p><strong>Technical Information:</strong></p>
                  <ul className="list-disc pl-6 space-y-1">
                    <li>Device information and browser type</li>
                    <li>IP address and location data</li>
                    <li>Website usage and interaction data</li>
                  </ul>
                </div>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                3. How We Use Your Information
              </h2>
              <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-6 mb-4">
                <p className="text-green-800 dark:text-green-200 font-semibold mb-2">
                  🎯 PURPOSES OF DATA COLLECTION:
                </p>
                <div className="text-green-700 dark:text-green-300 space-y-3">
                  <p><strong>Service Delivery:</strong></p>
                  <ul className="list-disc pl-6 space-y-1">
                    <li>Process and fulfill your food orders</li>
                    <li>Coordinate delivery to your location</li>
                    <li>Provide customer support and assistance</li>
                  </ul>
                  
                  <p><strong>Communication:</strong></p>
                  <ul className="list-disc pl-6 space-y-1">
                    <li>Send order confirmations and updates</li>
                    <li>Notify about delivery status</li>
                    <li>Respond to inquiries and feedback</li>
                  </ul>
                  
                  <p><strong>Improvement:</strong></p>
                  <ul className="list-disc pl-6 space-y-1">
                    <li>Enhance our menu and services</li>
                    <li>Improve website functionality</li>
                    <li>Analyze usage patterns for optimization</li>
                  </ul>
                </div>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                4. Information Sharing and Disclosure
              </h2>
              <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-6 mb-4">
                <p className="text-yellow-800 dark:text-yellow-200 font-semibold mb-2">
                  🔒 WE DO NOT SELL YOUR PERSONAL INFORMATION
                </p>
                <div className="text-yellow-700 dark:text-yellow-300 space-y-3">
                  <p><strong>Limited Sharing:</strong> We may share your information only with:</p>
                  <ul className="list-disc pl-6 space-y-1">
                    <li><strong>Delivery Partners:</strong> To fulfill your orders</li>
                    <li><strong>Payment Processors:</strong> To process payments securely</li>
                    <li><strong>Legal Requirements:</strong> When required by law</li>
                    <li><strong>Service Providers:</strong> Who assist in our operations</li>
                  </ul>
                  
                  <p><strong>Your Consent:</strong> We will not share your information for marketing purposes without your explicit consent.</p>
                </div>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                5. Data Security
              </h2>
              <div className="bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-lg p-6 mb-4">
                <p className="text-purple-800 dark:text-purple-200 font-semibold mb-2">
                  🛡️ SECURITY MEASURES:
                </p>
                <div className="text-purple-700 dark:text-purple-300 space-y-3">
                  <p><strong>Technical Safeguards:</strong></p>
                  <ul className="list-disc pl-6 space-y-1">
                    <li>Encryption of sensitive data in transit and at rest</li>
                    <li>Secure payment processing systems</li>
                    <li>Regular security audits and updates</li>
                    <li>Access controls and authentication measures</li>
                  </ul>
                  
                  <p><strong>Operational Safeguards:</strong></p>
                  <ul className="list-disc pl-6 space-y-1">
                    <li>Limited access to personal information</li>
                    <li>Employee training on data protection</li>
                    <li>Regular backup and recovery procedures</li>
                    <li>Incident response and breach notification</li>
                  </ul>
                </div>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                6. Your Rights and Choices
              </h2>
              <div className="bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-800 rounded-lg p-6 mb-4">
                <p className="text-indigo-800 dark:text-indigo-200 font-semibold mb-2">
                  👤 YOUR PRIVACY RIGHTS:
                </p>
                <div className="text-indigo-700 dark:text-indigo-300 space-y-3">
                  <p><strong>Access and Control:</strong></p>
                  <ul className="list-disc pl-6 space-y-1">
                    <li><strong>Access:</strong> Request a copy of your personal information</li>
                    <li><strong>Correction:</strong> Update or correct inaccurate information</li>
                    <li><strong>Deletion:</strong> Request deletion of your personal data</li>
                    <li><strong>Portability:</strong> Receive your data in a portable format</li>
                  </ul>
                  
                  <p><strong>Communication Preferences:</strong></p>
                  <ul className="list-disc pl-6 space-y-1">
                    <li>Opt-out of marketing communications</li>
                    <li>Choose how you receive notifications</li>
                    <li>Control cookie preferences</li>
                  </ul>
                </div>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                7. Contact Information
              </h2>
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                If you have any questions about this Privacy Policy or our data practices, please contact us:
              </p>
              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                <p className="text-gray-700 dark:text-gray-300">
                  <strong>LUXE FOOD</strong><br />
                  <strong>Phone:</strong> 076825325<br />
                  <strong>Address:</strong> Freetown, Sierra Leone<br />
                  <strong>Website:</strong> https://luxefood.com<br />
                  <strong>Developer Contact:</strong> Alpha Amadu Bah (074762243)
                </p>
              </div>
            </section>

            {/* Document Security Information */}
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
                      <strong>Policy Version:</strong> {POLICY_VERSION}
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

          </div>
        </div>
      </div>
    </div>
  )
} 