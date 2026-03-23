"use client"

import Link from "next/link"
import { ShoppingCart, Phone, Home, ShoppingBag, Wrench, Images } from "lucide-react"
import { useCart } from "@/contexts/CartContext"
import { useState, useEffect } from "react"
import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"
import type { CMSData } from "@/lib/cms"

export default function HeaderClient({ cms }: { cms: CMSData }) {
  const { items } = useCart()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)

  const itemCount = items.reduce((sum) => sum + 1, 0)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled
          ? 'bg-stone-950/90 backdrop-blur-xl shadow-lg shadow-black/10 border-b border-yellow-500/10'
          : 'bg-transparent'
      }`}
    >
      <div className="container mx-auto px-6">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3">
            <div className="w-16 h-16 lg:w-20 lg:h-20 relative flex-shrink-0">
              <Image src="/images/logo.png" alt={`${cms.brand_name} Logo`} fill className="object-contain" />
            </div>
            <div>
              <span className="text-base lg:text-lg font-bold text-yellow-400 tracking-wider">{cms.brand_name}</span>
              <p className="text-[10px] lg:text-xs text-stone-500 italic leading-none hidden sm:block">{cms.brand_tagline}</p>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-1">
            {[
              { href: "/", label: "Home" },
              { href: "/order", label: "Order" },
              { href: "/services", label: "Services" },
              { href: "/gallery", label: "Gallery" },
              { href: "/contact", label: "Contact" },
            ].map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="px-4 py-2 text-sm font-medium text-stone-300 hover:text-yellow-400 rounded-lg hover:bg-white/5 transition-all duration-200"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Right side */}
          <div className="flex items-center gap-3">
            {/* Phone - desktop */}
            <Link
              href={`tel:${cms.contact_phone_intl}`}
              className="hidden md:flex items-center gap-1.5 text-stone-400 hover:text-yellow-400 transition-colors text-sm"
            >
              <Phone className="h-3.5 w-3.5" />
              <span>{cms.contact_phone}</span>
            </Link>

            {/* Divider */}
            <div className="hidden md:block w-px h-5 bg-stone-700" />

            {/* Cart */}
            <Link
              href="/cart"
              className="relative flex items-center gap-1.5 px-3.5 py-2 text-sm font-medium text-stone-300 hover:text-yellow-400 rounded-lg hover:bg-white/5 transition-all duration-200"
            >
              <ShoppingCart className="h-4 w-4" />
              <span className="hidden sm:inline">Cart</span>
              {itemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-yellow-500 text-black text-[10px] rounded-full h-5 w-5 flex items-center justify-center font-bold">
                  {itemCount}
                </span>
              )}
            </Link>

            {/* Mobile menu button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="lg:hidden w-9 h-9 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 transition-colors"
              aria-label="Toggle menu"
            >
              <div className="w-5 h-4 flex flex-col justify-between">
                <span
                  className={`block h-0.5 bg-stone-300 transition-all duration-300 origin-center ${
                    isMenuOpen ? "rotate-45 translate-y-[7px]" : ""
                  }`}
                />
                <span
                  className={`block h-0.5 bg-stone-300 transition-all duration-300 ${
                    isMenuOpen ? "opacity-0 scale-0" : ""
                  }`}
                />
                <span
                  className={`block h-0.5 bg-stone-300 transition-all duration-300 origin-center ${
                    isMenuOpen ? "-rotate-45 -translate-y-[7px]" : ""
                  }`}
                />
              </div>
            </button>
          </div>
        </div>

      </div>

      {/* Mobile Nav — Right Drawer */}
      <AnimatePresence>
        {isMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="lg:hidden fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
              onClick={() => setIsMenuOpen(false)}
            />
            {/* Drawer */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ duration: 0.3, ease: [0.32, 0.72, 0, 1] }}
              className="lg:hidden fixed top-0 right-0 bottom-0 w-72 bg-stone-950 border-l border-white/5 z-50 flex flex-col"
            >
              {/* Drawer header */}
              <div className="flex items-center justify-between px-6 h-16 border-b border-white/5">
                <span className="text-sm font-bold text-yellow-400 tracking-wider">Menu</span>
                <button
                  onClick={() => setIsMenuOpen(false)}
                  className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center hover:bg-white/10 transition-colors"
                  aria-label="Close menu"
                >
                  <svg className="w-4 h-4 text-stone-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Nav links */}
              <nav className="flex-1 py-4 px-4">
                <div className="flex flex-col gap-1">
                  {[
                    { href: "/", label: "Home", icon: Home },
                    { href: "/order", label: "Order", icon: ShoppingBag },
                    { href: "/services", label: "Services", icon: Wrench },
                    { href: "/gallery", label: "Gallery", icon: Images },
                    { href: "/contact", label: "Contact", icon: Phone },
                  ].map(({ href, label, icon: Icon }) => (
                    <Link
                      key={href}
                      href={href}
                      className="flex items-center gap-3 min-h-[48px] px-4 py-3 text-stone-300 hover:text-yellow-400 rounded-xl hover:bg-white/5 transition-all"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <Icon className="h-5 w-5" />
                      <span className="font-medium">{label}</span>
                    </Link>
                  ))}
                </div>
              </nav>

              {/* Drawer footer */}
              <div className="px-4 pb-8 pt-4 border-t border-white/5">
                <Link
                  href={`tel:${cms.contact_phone_intl}`}
                  className="flex items-center gap-3 px-4 py-3 text-stone-300 hover:text-yellow-400 rounded-xl hover:bg-white/5 transition-all"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <Phone className="h-5 w-5" />
                  <div>
                    <span className="font-medium block">Call Us</span>
                    <span className="text-yellow-400/70 text-sm">{cms.contact_phone}</span>
                  </div>
                </Link>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </header>
  )
}
