"use client"

import { useState, useEffect } from "react"
import { useTheme } from "next-themes"
import { Sun, Moon, SunMoon } from "lucide-react"
import { motion } from "framer-motion"

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  // Avoid hydration mismatch
  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <div className="w-10 h-10 rounded-full bg-indigo-100 dark:bg-indigo-800 flex items-center justify-center">
        <SunMoon className="h-5 w-5 text-indigo-600 dark:text-indigo-300" />
      </div>
    )
  }

  const isDark = theme === "dark"

  return (
    <motion.button
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      whileTap={{ scale: 0.9 }}
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className={`relative w-12 h-12 rounded-full flex items-center justify-center overflow-hidden ${
        isDark
          ? "bg-gradient-to-br from-indigo-900 to-purple-900 text-yellow-300"
          : "bg-gradient-to-br from-blue-400 to-indigo-500 text-yellow-300"
      } shadow-lg hover:shadow-xl transition-all duration-500`}
      aria-label="Toggle theme"
    >
      <div className="absolute inset-0 flex items-center justify-center">
        <div
          className={`absolute w-full h-full transition-all duration-700 ${
            isDark ? "opacity-0 rotate-180 scale-0" : "opacity-100 rotate-0 scale-100"
          }`}
        >
          <Sun className="h-6 w-6 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
          {!isDark && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="absolute inset-0 bg-yellow-300 rounded-full blur-xl opacity-30"
            />
          )}
        </div>
        <div
          className={`absolute w-full h-full transition-all duration-700 ${
            isDark ? "opacity-100 rotate-0 scale-100" : "opacity-0 rotate-180 scale-0"
          }`}
        >
          <Moon className="h-6 w-6 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
          {isDark && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="absolute inset-0 bg-blue-500 rounded-full blur-xl opacity-30"
            />
          )}
        </div>
      </div>

      {/* Stars for dark mode */}
      {isDark && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="absolute top-2 left-2 w-1 h-1 bg-white rounded-full"
          />
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="absolute top-3 right-3 w-1.5 h-1.5 bg-white rounded-full"
          />
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="absolute bottom-2 right-4 w-1 h-1 bg-white rounded-full"
          />
        </>
      )}

      {/* Sun rays for light mode */}
      {!isDark && (
        <>
          {[...Array(8)].map((_, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 + i * 0.05, duration: 0.5 }}
              className="absolute w-6 h-0.5 bg-yellow-300 opacity-70"
              style={{
                transform: `rotate(${i * 45}deg) translateX(8px)`,
                transformOrigin: "center left",
              }}
            />
          ))}
        </>
      )}
    </motion.button>
  )
}
