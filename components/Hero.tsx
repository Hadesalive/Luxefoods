"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { ArrowRight, MapPin, Clock } from "lucide-react"

const heroImages = [
  "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=1920&h=1080&fit=crop&q=85", // Pizza
  "https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=1920&h=1080&fit=crop&q=85", // Fried Rice
  "https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=1920&h=1080&fit=crop&q=85", // Jollof Rice / West African Rice
  "https://images.unsplash.com/photo-1608039829573-8c4c85b0e1a5?w=1920&h=1080&fit=crop&q=85", // Grilled Chicken
  "https://images.unsplash.com/photo-1555939594-58d7cb561b1a?w=1920&h=1080&fit=crop&q=85", // African Stew / Cassava Leaf
  "https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?w=1920&h=1080&fit=crop&q=85", // African Food Spread
]

export default function Hero() {
  const [currentIndex, setCurrentIndex] = useState(0)

  // Preload images
  useEffect(() => {
    heroImages.forEach((src) => {
      const img = new window.Image()
      img.src = src
    })
  }, [])

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % heroImages.length)
    }, 5000) // Change image every 5 seconds

    return () => clearInterval(interval)
  }, [])

  return (
    <section className="relative h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-orange-900 flex items-center justify-center overflow-hidden border-b border-gray-800">
      {/* Background Image Slideshow */}
      <div className="absolute inset-0">
        {heroImages.map((src, index) => {
          const imageNames = ['Pizza', 'Fried Rice', 'Jollof Rice', 'Grilled Chicken', 'Cassava Leaf Stew', 'African Cuisine']
          const isActive = index === currentIndex
          return (
            <motion.div
              key={`${src}-${index}`}
              initial={false}
              animate={{ 
                opacity: isActive ? 1 : 0,
              }}
              transition={{ duration: 2, ease: "easeInOut" }}
              className="absolute inset-0"
            >
              <Image
                src={src}
                alt={`The Kings Bakery - ${imageNames[index]}`}
                fill
                className="object-cover"
                priority={index === 0}
                sizes="100vw"
              />
            </motion.div>
          )
        })}
        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-black/60 z-10"></div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 lg:px-8 relative z-10 py-20">
        <div className="max-w-4xl mx-auto text-center">
          
          {/* Main Heading */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-light text-white mb-4 md:mb-6 leading-tight tracking-wide drop-shadow-2xl"
          >
            <span className="font-serif italic text-orange-300">The</span>{" "}
            <span className="font-bold">Kings</span>{" "}
            <span className="font-light tracking-wider">Bakery</span>
          </motion.h1>

          {/* Subheading */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-lg md:text-xl lg:text-2xl text-yellow-300 mb-6 md:mb-8 leading-relaxed max-w-2xl mx-auto drop-shadow-lg px-4"
          >
            Authentic African flavors, fresh ingredients, and traditional recipes. 
            From jollof rice to grilled chicken, experience the taste of Sierra Leone.
          </motion.p>

          {/* Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex flex-wrap items-center justify-center gap-4 md:gap-6 mb-6 md:mb-10 text-gray-200"
          >
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 md:w-5 md:h-5 text-orange-400" />
              <span className="text-xs md:text-sm drop-shadow-md">117 Main Regent Road, Hill Station</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 md:w-5 md:h-5 text-orange-400" />
              <span className="text-xs md:text-sm drop-shadow-md">30-45min delivery</span>
            </div>
          </motion.div>

          {/* Call to Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center px-4"
          >
            <Link href="/order">
              <button className="group w-full sm:w-auto px-6 md:px-8 py-3 md:py-4 bg-orange-600 hover:bg-orange-700 text-white font-semibold rounded-lg transition-all flex items-center justify-center gap-2 hover:shadow-xl hover:shadow-orange-600/20 hover:scale-105 active:scale-95 text-sm md:text-base">
                Order Now
                <ArrowRight className="w-4 h-4 md:w-5 md:h-5 group-hover:translate-x-1 transition-transform" />
              </button>
            </Link>
            <Link href="/order">
              <button className="w-full sm:w-auto px-6 md:px-8 py-3 md:py-4 bg-gray-800 hover:bg-gray-700 border border-gray-700 text-white font-medium rounded-lg transition-all hover:border-orange-600 active:scale-95 text-sm md:text-base">
                View Menu
              </button>
            </Link>
          </motion.div>

        </div>
      </div>
    </section>
  )
}
