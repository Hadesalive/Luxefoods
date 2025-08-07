"use client"

import Link from "next/link"
import { ShoppingCart, Phone } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useCart } from "@/contexts/CartContext"
import { useState } from "react"
import Image from "next/image"


export default function Header() {
  const { items } = useCart()
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const itemCount = items.reduce((sum, item) => sum + 1, 0)

  return (
    <header className="bg-black dark:bg-gray-900 text-white sticky top-0 z-50 shadow-lg transition-colors duration-300">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16 lg:h-20">
          <Link href="/" className="flex items-center space-x-2 lg:space-x-3">
            <div className="w-10 h-10 lg:w-12 lg:h-12 relative rounded-full overflow-hidden bg-white p-1 shadow-lg">
              <Image src="/images/logo.jpg" alt="Kings Bakery Logo" fill className="object-contain" />
            </div>
            <div className="hidden sm:block">
              <span className="text-base lg:text-xl font-bold">The Kings Bakery</span>
              <div className="text-xs lg:text-sm text-yellow-300 dark:text-yellow-400 italic">
                "Fresh Baked Goods & Delicious Treats"
              </div>
            </div>
            <span className="sm:hidden text-base font-bold">Kings Bakery</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-8">
            <Link
              href="/"
              className="text-white hover:text-yellow-300 dark:hover:text-yellow-400 transition-colors font-medium"
            >
              Home
            </Link>
            <Link
              href="/order"
              className="text-white hover:text-yellow-300 dark:hover:text-yellow-400 transition-colors font-medium"
            >
              Menu
            </Link>
            <Link
              href="/order"
              className="text-white hover:text-yellow-300 dark:hover:text-yellow-400 transition-colors font-medium"
            >
              Order
            </Link>
            <Link
              href="/contact"
              className="text-white hover:text-yellow-300 dark:hover:text-yellow-400 transition-colors font-medium"
            >
              Contact
            </Link>
          </nav>

          <div className="flex items-center space-x-2 lg:space-x-4">
            <Link
              href="tel:076533655"
              className="hidden md:flex items-center text-white hover:text-yellow-300 dark:hover:text-yellow-400 transition-colors"
            >
              <Phone className="h-4 w-4 mr-2" />
              <span className="text-sm lg:text-base">076533655</span>
            </Link>

            <Link href="/cart">
              <Button
                variant="outline"
                size="sm"
                className="relative border-2 border-amber-200/40 dark:border-amber-100/40 text-amber-200/90 dark:text-amber-100/90 hover:bg-amber-200/20 dark:hover:bg-amber-100/20 hover:text-amber-200 dark:hover:text-amber-100 hover:border-amber-200/60 dark:hover:border-amber-100/60 transition-all duration-300 font-semibold shadow-lg"
              >
                <ShoppingCart className="h-4 w-4" />
                <span className="hidden sm:inline ml-2">Cart</span>
                {itemCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-600 dark:bg-red-500 text-white text-xs rounded-full h-6 w-6 flex items-center justify-center font-bold animate-pulse">
                    {itemCount}
                  </span>
                )}
              </Button>
            </Link>

            {/* Mobile Menu Button - Enhanced */}
            <div className="lg:hidden">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="relative w-10 h-10 rounded-xl bg-gradient-to-br from-amber-200/20 to-amber-100/20 dark:from-amber-200/30 dark:to-amber-100/30 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 flex items-center justify-center group"
                aria-label="Toggle menu"
              >
                <div className="relative w-6 h-6 flex flex-col justify-center items-center">
                  <span
                    className={`block w-6 h-0.5 bg-amber-200/90 dark:bg-amber-100/90 transition-all duration-300 transform ${
                      isMenuOpen ? "rotate-45 translate-y-0.5" : "-translate-y-1.5"
                    }`}
                  />
                  <span
                    className={`block w-6 h-0.5 bg-amber-200/90 dark:bg-amber-100/90 transition-all duration-300 ${
                      isMenuOpen ? "opacity-0" : "opacity-100"
                    }`}
                  />
                  <span
                    className={`block w-6 h-0.5 bg-amber-200/90 dark:bg-amber-100/90 transition-all duration-300 transform ${
                      isMenuOpen ? "-rotate-45 -translate-y-0.5" : "translate-y-1.5"
                    }`}
                  />
                </div>
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation - Enhanced */}
        {isMenuOpen && (
          <div className="lg:hidden absolute top-full left-0 right-0 bg-gradient-to-br from-black via-gray-900 to-black dark:from-black dark:via-gray-900 dark:to-black shadow-2xl border-t border-amber-200/20 dark:border-amber-100/20 backdrop-blur-lg transition-colors duration-300">
            <nav className="py-6 px-4">
              <div className="flex flex-col space-y-1">
                <Link
                  href="/"
                  className="group flex items-center text-white hover:text-yellow-300 dark:hover:text-yellow-400 transition-all duration-300 py-4 px-6 rounded-2xl hover:bg-white/10 backdrop-blur-sm"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <span className="text-2xl mr-4 group-hover:scale-110 transition-transform duration-300">🏠</span>
                  <span className="font-medium text-lg">Home</span>
                </Link>
                <Link
                  href="/order"
                  className="group flex items-center text-white hover:text-yellow-300 dark:hover:text-yellow-400 transition-all duration-300 py-4 px-6 rounded-2xl hover:bg-white/10 backdrop-blur-sm"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <span className="text-2xl mr-4 group-hover:scale-110 transition-transform duration-300">🍽️</span>
                  <span className="font-medium text-lg">Menu</span>
                </Link>
                <Link
                  href="/order"
                  className="group flex items-center text-white hover:text-yellow-300 dark:hover:text-yellow-400 transition-all duration-300 py-4 px-6 rounded-2xl hover:bg-white/10 backdrop-blur-sm"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <span className="text-2xl mr-4 group-hover:scale-110 transition-transform duration-300">🛒</span>
                  <span className="font-medium text-lg">Order</span>
                </Link>
                <Link
                  href="/contact"
                  className="group flex items-center text-white hover:text-yellow-300 dark:hover:text-yellow-400 transition-all duration-300 py-4 px-6 rounded-2xl hover:bg-white/10 backdrop-blur-sm"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <span className="text-2xl mr-4 group-hover:scale-110 transition-transform duration-300">📞</span>
                  <span className="font-medium text-lg">Contact</span>
                </Link>

                {/* Phone number with special styling */}
                <div className="mt-4 pt-4 border-t border-amber-200/20 dark:border-amber-100/20">
                  <Link
                    href="tel:076533655"
                    className="group flex items-center text-white hover:text-yellow-300 dark:hover:text-yellow-400 transition-all duration-300 py-4 px-6 rounded-2xl hover:bg-white/10 backdrop-blur-sm"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <Phone className="h-6 w-6 mr-4 group-hover:scale-110 transition-transform duration-300" />
                    <div>
                      <span className="font-medium text-lg block">Call Us Now</span>
                      <span className="text-yellow-300 dark:text-yellow-400 text-sm">076 533655</span>
                    </div>
                  </Link>
                </div>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}
