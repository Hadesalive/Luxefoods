"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { motion, AnimatePresence } from "framer-motion"
import Link from "next/link"

export default function TermsPopup() {
  const [showPopup, setShowPopup] = useState(false)

  useEffect(() => {
    // Check if user has seen the terms before
    const hasSeenTerms = localStorage.getItem("kings-bakery-terms-accepted")
    
    if (!hasSeenTerms) {
      // Show popup after a short delay
      const timer = setTimeout(() => {
        setShowPopup(true)
      }, 2000) // 2 seconds delay

      return () => clearTimeout(timer)
    }
  }, [])

  const handleAccept = () => {
    localStorage.setItem("kings-bakery-terms-accepted", "true")
    setShowPopup(false)
  }

  const handleDecline = () => {
    // Redirect to a different page or show a message
    window.location.href = "https://google.com"
  }

  if (!showPopup) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 dark:bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className="w-full max-w-2xl"
        >
          <Card className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm border-orange-200 dark:border-orange-800 shadow-2xl">
            <CardHeader className="text-center pb-4">
              <CardTitle className="text-2xl font-bold text-gray-900 dark:text-white flex items-center justify-center">
                <span className="mr-2">🍕</span>
                Welcome to Kings Bakery
                <span className="ml-2">🍕</span>
              </CardTitle>
              <p className="text-gray-600 dark:text-gray-400">
                Please review our terms and conditions before using our website
              </p>
            </CardHeader>

            <CardContent className="space-y-6">
              {/* Terms Summary */}
              <div className="bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20 rounded-lg p-4 border border-orange-200 dark:border-orange-800">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center">
                  <span className="mr-2">📋</span>
                  Key Terms Summary:
                </h3>
                <ul className="text-sm text-gray-700 dark:text-gray-300 space-y-2">
                  <li className="flex items-start">
                    <span className="mr-2">•</span>
                    <span>We use cookies to enhance your experience</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2">•</span>
                    <span>Your privacy is important to us - we don't share your data</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2">•</span>
                    <span>Orders are subject to availability and business hours</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2">•</span>
                    <span>Please inform us of any food allergies</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2">•</span>
                    <span>Delivery times are estimates and may vary</span>
                  </li>
                </ul>
              </div>

              {/* Important Notice */}
              <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
                <p className="text-yellow-800 dark:text-yellow-200 text-sm font-medium flex items-center">
                  <span className="mr-2">⚠️</span>
                  Important: Please inform us of any food allergies or dietary restrictions before placing your order.
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 pt-4">
                <Button
                  onClick={handleAccept}
                  className="flex-1 bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white font-semibold py-3"
                >
                  <span className="mr-2">✅</span>
                  Accept & Continue
                </Button>
                
                <Link href="/terms" className="flex-1">
                  <Button
                    variant="outline"
                    className="w-full border-orange-300 dark:border-orange-700 text-orange-700 dark:text-orange-300 hover:bg-orange-50 dark:hover:bg-orange-900/20 font-semibold py-3"
                  >
                    <span className="mr-2">📖</span>
                    Read Full Terms
                  </Button>
                </Link>
              </div>

              <div className="text-center">
                <Button
                  onClick={handleDecline}
                  variant="ghost"
                  className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 text-sm"
                >
                  Decline & Leave Site
                </Button>
              </div>

              {/* Footer */}
              <div className="text-center text-xs text-gray-500 dark:text-gray-400 pt-4 border-t border-gray-200 dark:border-gray-700">
                <p>
                  By accepting, you agree to our{" "}
                  <Link href="/terms" className="text-orange-600 dark:text-orange-400 hover:underline">
                    Terms & Conditions
                  </Link>{" "}
                  and{" "}
                  <Link href="#" className="text-orange-600 dark:text-orange-400 hover:underline">
                    Privacy Policy
                  </Link>
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
} 