"use client"

import Image from "next/image"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { motion } from "framer-motion"

export default function Hero() {
  return (
    <section className="relative h-screen overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <Image 
          src="https://images.unsplash.com/photo-1509440159596-0249088772ff?w=1920&h=1080&fit=crop" 
          alt="Delicious Fresh Baked Goods" 
          fill 
          className="object-cover" 
          priority 
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/60 to-black/90 dark:from-black/90 dark:via-black/70 dark:to-black/95"></div>
      </div>

      {/* Centered Content */}
      <div className="relative z-10 h-full flex items-center justify-center">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-4xl mx-auto">
            {/* Main Content */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="space-y-6 sm:space-y-8"
            >
              {/* Subtitle */}
              <motion.h2
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="text-amber-200/90 dark:text-amber-100/90 text-xl sm:text-2xl lg:text-3xl font-medium"
              >
                🍞 Fresh Baked Excellence
              </motion.h2>

              {/* Restaurant Name */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="space-y-2"
              >
                <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold text-white leading-tight drop-shadow-lg">
                  The KINGS
                </h1>
                <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold bg-gradient-to-r from-amber-200/90 to-amber-100/90 bg-clip-text text-transparent leading-tight drop-shadow-lg">
                  BAKERY 
                </h1>
              </motion.div>

              {/* Tagline */}
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.6 }}
                className="text-lg sm:text-xl lg:text-2xl text-amber-100/80 dark:text-amber-50/80 italic font-medium max-w-2xl mx-auto"
              >
                "✨ Fresh Baked Goods & Delicious Treats ✨"
              </motion.p>

              {/* Address */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.8 }}
                className="text-amber-100/70 dark:text-amber-50/70 text-sm sm:text-base lg:text-lg font-medium"
              >
                📍 117 Main Regent Road, Hill Station, Opposite City Supermarket
              </motion.div>
            </motion.div>

            {/* Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1.0 }}
              className="flex flex-col sm:flex-row gap-4 mt-8 sm:mt-12 justify-center max-w-md mx-auto"
            >
              <Link href="#menu">
                <Button
                  size="lg"
                  className="w-full sm:w-auto bg-red-600 hover:bg-red-700 dark:bg-red-700 dark:hover:bg-red-600 text-white text-lg sm:text-xl font-bold px-8 py-4 sm:py-5 rounded-full shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 border-2 border-red-500"
                >
                  📋 View Menu
                </Button>
              </Link>
              <Link href="/order">
                <Button
                  size="lg"
                  className="w-full sm:w-auto bg-amber-200/20 dark:bg-amber-100/20 text-amber-100 dark:text-amber-50 hover:bg-amber-200/30 dark:hover:bg-amber-100/30 text-lg sm:text-xl font-bold px-8 py-4 sm:py-5 rounded-full shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 border-2 border-amber-200/40 dark:border-amber-100/40 backdrop-blur-sm"
                >
                  🛒 Order Now
                </Button>
              </Link>
            </motion.div>

            {/* Stats Cards */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 1.2 }}
              className="mt-8 sm:mt-12 flex flex-wrap justify-center gap-4 sm:gap-6"
            >
              <div className="bg-black/20 dark:bg-black/30 backdrop-blur-sm rounded-2xl px-4 py-3 border border-amber-200/20 dark:border-amber-100/20">
                <div className="text-amber-200/90 dark:text-amber-100/90 text-2xl mb-1">⭐</div>
                <div className="text-white text-sm font-bold">4.8/5</div>
                <div className="text-white/80 text-xs">Rating</div>
              </div>
              <div className="bg-black/20 dark:bg-black/30 backdrop-blur-sm rounded-2xl px-4 py-3 border border-amber-200/20 dark:border-amber-100/20">
                <div className="text-amber-200/90 dark:text-amber-100/90 text-2xl mb-1">🚚</div>
                <div className="text-white text-sm font-bold">30-45min</div>
                <div className="text-white/80 text-xs">Delivery</div>
              </div>
              <div className="bg-black/20 dark:bg-black/30 backdrop-blur-sm rounded-2xl px-4 py-3 border border-amber-200/20 dark:border-amber-100/20">
                <div className="text-amber-200/90 dark:text-amber-100/90 text-2xl mb-1">🔥</div>
                <div className="text-white text-sm font-bold">Fresh</div>
                <div className="text-white/80 text-xs">Daily</div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 1.5, repeat: Number.POSITIVE_INFINITY, repeatType: "reverse" }}
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-white/80"
      >
        <div className="flex flex-col items-center gap-2">
          <span className="text-xs font-medium">Scroll for Menu</span>
          <div className="w-1 h-6 bg-white/50 rounded-full">
            <div className="w-1 h-2 bg-white rounded-full animate-bounce"></div>
          </div>
        </div>
      </motion.div>
    </section>
  )
}
