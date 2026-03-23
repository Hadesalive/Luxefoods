"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Link from "next/link"

export default function TermsPopup() {
  const [showPopup, setShowPopup] = useState(false)

  useEffect(() => {
    const hasSeenTerms = localStorage.getItem("luxe-food-terms-accepted")
    if (!hasSeenTerms) {
      const timer = setTimeout(() => setShowPopup(true), 2000)
      return () => clearTimeout(timer)
    }
  }, [])

  const handleAccept = () => {
    localStorage.setItem("luxe-food-terms-accepted", "true")
    setShowPopup(false)
  }

  const handleDecline = () => {
    window.location.href = "https://google.com"
  }

  if (!showPopup) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center p-4"
      >
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 24 }}
          transition={{ duration: 0.25, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="w-full max-w-lg bg-white rounded-2xl shadow-xl overflow-hidden"
        >
          {/* Top accent */}
          <div className="h-1 bg-yellow-500" />

          <div className="p-7 sm:p-8">
            <h2 className="text-xl font-bold text-stone-900 mb-1">Before you continue</h2>
            <p className="text-stone-500 text-sm mb-6">
              By using this site you agree to a few things.
            </p>

            <ul className="space-y-2.5 mb-8">
              {[
                "We use cookies to improve your experience.",
                "Your personal data is never shared with third parties.",
                "Orders depend on availability and business hours.",
                "Please let us know about any food allergies before ordering.",
                "Delivery times are estimates and may vary.",
              ].map((item) => (
                <li key={item} className="flex items-start gap-2.5 text-sm text-stone-600">
                  <span className="w-1 h-1 rounded-full bg-yellow-500 mt-2 flex-shrink-0" />
                  {item}
                </li>
              ))}
            </ul>

            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={handleAccept}
                className="flex-1 bg-stone-900 hover:bg-stone-800 text-white text-sm font-semibold px-6 py-3 rounded-lg transition-colors"
              >
                Accept & Continue
              </button>
              <Link
                href="/terms"
                className="flex-1 text-center border border-stone-200 hover:border-stone-300 text-stone-600 text-sm font-medium px-6 py-3 rounded-lg transition-colors"
              >
                Read Full Terms
              </Link>
            </div>

            <div className="mt-4 text-center">
              <button
                onClick={handleDecline}
                className="text-xs text-stone-400 hover:text-stone-600 transition-colors"
              >
                Decline and leave
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
