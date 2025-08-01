"use client"

import { useEffect } from "react"
import { usePathname } from "next/navigation"

export default function ScrollToTop() {
  const pathname = usePathname()

  useEffect(() => {
    // Scroll to top when route changes
    window.scrollTo(0, 0)
  }, [pathname])

  useEffect(() => {
    // Ensure page starts at top on initial load
    const handleLoad = () => {
      window.scrollTo(0, 0)
    }

    if (document.readyState === "complete") {
      handleLoad()
    } else {
      window.addEventListener("load", handleLoad)
      return () => window.removeEventListener("load", handleLoad)
    }
  }, [])

  return null
}
