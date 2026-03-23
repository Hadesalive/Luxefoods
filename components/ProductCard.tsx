"use client"

import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useCart } from "@/contexts/CartContext"
import type { MenuItemWithCategory } from "@/lib/menu-service"
import { ShoppingCart, Heart, Star, Sparkles } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { useState } from "react"

interface ProductCardProps {
  product: MenuItemWithCategory
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addItem } = useCart()
  const [isFavorite, setIsFavorite] = useState(false)
  const [isAdded, setIsAdded] = useState(false)

  const handleAddToCart = () => {
    // Add the required 'type' property for cart items
    addItem({ 
      id: product.id,
      name: product.name,
      price: product.price,
      type: product.category?.slug || "menu-item",
      quantity: 1
    })
    
    // Show success feedback
    setIsAdded(true)
    
    // Hide success feedback after 2 seconds
    setTimeout(() => {
      setIsAdded(false)
    }, 2000)
  }

  const toggleFavorite = () => {
    setIsFavorite(!isFavorite)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{
        type: "spring",
        stiffness: 100,
        damping: 15
      }}
      whileHover={{ 
        y: -8,
        transition: { duration: 0.2 }
      }}
      className="group"
    >
      <Card className="relative overflow-hidden border border-gray-100 dark:border-gray-700 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 bg-white dark:bg-gray-800">
        {/* Success overlay */}
        <AnimatePresence>
          {isAdded && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="absolute inset-0 bg-green-500/90 flex items-center justify-center z-20 rounded-2xl"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.1, type: "spring" }}
                className="text-white text-center"
              >
                <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-2">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <p className="font-bold text-lg">Added to Cart!</p>
                <p className="text-sm opacity-90">Great choice! 🎉</p>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="relative overflow-hidden">
          <Link href={`/products/${product.id}`}>
            <Image
              src={product.image_url || "/placeholder.svg"}
              alt={product.name}
              width={300}
              height={300}
              className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
            />
          </Link>
          
          {/* Category badge */}
          {product.category && (
            <Badge className="absolute top-3 left-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white border-0 shadow-lg">
              {product.category.name}
            </Badge>
          )}

          {/* Favorite button */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={toggleFavorite}
            className="absolute top-3 right-3 p-2 bg-white/90 dark:bg-gray-800/90 rounded-full shadow-lg hover:bg-white dark:hover:bg-gray-800 transition-colors duration-200 z-10"
          >
            <Heart 
              className={`h-5 w-5 transition-all duration-200 ${
                isFavorite 
                  ? 'text-red-500 fill-red-500' 
                  : 'text-gray-600 dark:text-gray-400'
              }`}
            />
          </motion.button>

          {/* Price badge */}
          <div className="absolute bottom-3 right-3 bg-gradient-to-r from-orange-600 to-red-600 text-white px-3 py-1 rounded-full text-sm font-bold shadow-lg">
            NLe{product.price.toFixed(2)}
          </div>

          {/* Popular indicator */}
          {product.is_popular && (
            <div className="absolute top-3 right-12 bg-yellow-400 text-black px-2 py-1 rounded-full text-xs font-bold flex items-center gap-1 shadow-lg">
              <Star className="h-3 w-3 fill-current" />
              Popular
            </div>
          )}
        </div>

        <CardContent className="p-6">
          <Link href={`/products/${product.id}`}>
            <h3 className="font-bold text-xl mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-200">
              {product.name}
            </h3>
          </Link>
          <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 line-clamp-2">
            {product.description || "Delicious menu item from LUXE FOOD"}
          </p>
          
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                NLe{product.price.toFixed(2)}
              </span>
            </div>
            
            {/* Rating */}
            <div className="flex items-center gap-1">
              <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
              <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                4.8
              </span>
            </div>
          </div>
        </CardContent>

        <CardFooter className="p-6 pt-0">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleAddToCart}
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center gap-2"
          >
            <ShoppingCart className="h-4 w-4" />
            Add to Cart
          </motion.button>
        </CardFooter>
      </Card>
    </motion.div>
  )
}
