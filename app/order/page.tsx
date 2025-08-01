"use client"

import { useState, useEffect } from "react"
import { Tabs, TabsContent } from "@/components/ui/tabs"
import { Card, CardContent } from "@/components/ui/card"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { ShoppingCart, ArrowLeft, Plus, Minus, Star, Check, Home, Phone, Clock, Heart, Sparkles } from "lucide-react"
import { MenuService, type MenuItemWithCategory, type Category } from "@/lib/menu-service"
import { useCart } from "@/contexts/CartContext"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"

export default function OrderPage() {
  const { addItem, items } = useCart()
  const [activeTab, setActiveTab] = useState("")
  const [selectedSizes, setSelectedSizes] = useState<{ [key: string]: string }>({})
  const [selectedOptions, setSelectedOptions] = useState<{ [key: string]: string[] }>({})
  const [quantities, setQuantities] = useState<{ [key: string]: number }>({})
  const [menuItems, setMenuItems] = useState<MenuItemWithCategory[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [hasMore, setHasMore] = useState(false)
  const [addedItems, setAddedItems] = useState<{ [key: string]: boolean }>({})
  const [favorites, setFavorites] = useState<{ [key: string]: boolean }>({})

  const itemCount = items.length

  useEffect(() => {
    const loadMenuData = async () => {
      try {
        setIsLoading(true)
        setError(null)
        
        // Use the optimized service with caching
        const [menuData, categoriesData] = await Promise.all([
          MenuService.getMenuItems(true), // Get all items for order page
          MenuService.getCategories(true),
        ])
        
        setMenuItems(menuData)
        setCategories(categoriesData)
        
        if (categoriesData.length > 0) {
          setActiveTab(categoriesData[0].slug)
        }
      } catch (error) {
        console.error("Error loading menu data:", error)
        setError("Failed to load menu. Please try again.")
      } finally {
        setIsLoading(false)
      }
    }

    loadMenuData()
  }, [])

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const itemVariant = {
    hidden: { opacity: 0, y: 20, scale: 0.95 },
    show: { 
      opacity: 1, 
      y: 0, 
      scale: 1,
      transition: {
        type: "spring" as const,
        stiffness: 100,
        damping: 15
      }
    },
  }

  const handleSizeSelect = (itemKey: string, size: string) => {
    setSelectedSizes((prev) => ({ ...prev, [itemKey]: size }))
  }

  const handleOptionToggle = (itemKey: string, optionName: string) => {
    setSelectedOptions((prev) => {
      const currentOptions = prev[itemKey] || []
      const newOptions = currentOptions.includes(optionName)
        ? currentOptions.filter(opt => opt !== optionName)
        : [...currentOptions, optionName]
      return { ...prev, [itemKey]: newOptions }
    })
  }

  const handleQuantityChange = (itemKey: string, change: number) => {
    setQuantities((prev) => ({
      ...prev,
      [itemKey]: Math.max(1, (prev[itemKey] || 1) + change),
    }))
  }

  const toggleFavorite = (itemId: string) => {
    setFavorites(prev => ({
      ...prev,
      [itemId]: !prev[itemId]
    }))
  }

  const getItemPrice = (item: MenuItemWithCategory, selectedSize?: string, selectedOptions?: string[]) => {
    let basePrice = item.price

    if (selectedSize && item.sizes && item.sizes.length > 0) {
      const size = item.sizes.find(s => s.size_name === selectedSize)
      if (size) {
        basePrice = size.price
      }
    }

    if (selectedOptions && item.options && item.options.length > 0) {
      selectedOptions.forEach(optionName => {
        const option = item.options.find(opt => opt.option_name === optionName)
        if (option) {
          basePrice += option.price_adjustment
        }
      })
    }

    return basePrice
  }

  const getItemSizes = (item: MenuItemWithCategory) => {
    if (item.sizes && item.sizes.length > 0) {
      return item.sizes.map(s => s.size_name)
    }
    return []
  }

  const getItemOptions = (item: MenuItemWithCategory) => {
    if (item.options && item.options.length > 0) {
      return item.options.filter(opt => opt.is_available).map(opt => opt.option_name)
    }
    return []
  }

  const handleAddToCart = (item: MenuItemWithCategory) => {
    const itemKey = `${item.id}-${selectedSizes[item.id] || 'default'}`
    const quantity = quantities[itemKey] || 1
    const selectedSize = selectedSizes[item.id]
    const selectedOptionsList = selectedOptions[item.id] || []
    const price = getItemPrice(item, selectedSize, selectedOptionsList)

    addItem({
      id: item.id,
      name: item.name,
      price: price,
      type: item.category?.slug || "menu-item",
      size: selectedSize,
      options: selectedOptionsList,
      quantity: quantity
    })

    // Show success feedback
    setAddedItems(prev => ({ ...prev, [item.id]: true }))
    
    // Hide success feedback after 2 seconds
    setTimeout(() => {
      setAddedItems(prev => ({ ...prev, [item.id]: false }))
    }, 2000)

    setQuantities(prev => {
      const newQuantities = { ...prev }
      delete newQuantities[itemKey]
      return newQuantities
    })
  }

  const getItemsByCategory = (categorySlug: string) => {
    return menuItems.filter(item => item.category?.slug === categorySlug)
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-red-50 dark:from-gray-900 dark:via-gray-800 dark:to-orange-900">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              className="w-16 h-16 border-4 border-orange-200 border-t-orange-600 rounded-full mx-auto"
            />
            <p className="mt-4 text-gray-600 dark:text-gray-400">Loading delicious menu...</p>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-red-50 dark:from-gray-900 dark:via-gray-800 dark:to-orange-900">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <p className="text-red-600 dark:text-red-400 mb-4">{error}</p>
            <Button onClick={() => window.location.reload()}>
              Try Again
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-red-50 dark:from-gray-900 dark:via-gray-800 dark:to-orange-900">
      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white dark:bg-gray-800 shadow-lg border-b border-gray-200 dark:border-gray-700 sticky top-0 z-10"
      >
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link
              href="/"
              className="flex items-center text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors hover:scale-105"
            >
              <ArrowLeft className="h-5 w-5 mr-2" />
              Back to Home
            </Link>

            <div className="flex items-center gap-4">
              <Link
                href="/cart"
                className="relative flex items-center text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors hover:scale-105"
              >
                <ShoppingCart className="h-6 w-6" />
                {itemCount > 0 && (
                  <motion.span 
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-2 -right-2 bg-gradient-to-r from-orange-600 to-red-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold shadow-lg"
                  >
                    {itemCount}
                  </motion.span>
                )}
              </Link>
            </div>
          </div>
        </div>
      </motion.div>

      <div className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            Order Online
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Browse our menu and add items to your cart for quick ordering
          </p>
        </motion.div>

        {categories.length > 0 && (
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="flex flex-wrap justify-center gap-2 mb-8"
            >
              {categories.map((category, index) => (
                <motion.div
                  key={category.id}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  <Button
                    variant={activeTab === category.slug ? "default" : "outline"}
                    onClick={() => setActiveTab(category.slug)}
                    className="rounded-full px-6 py-2 hover:scale-105 transition-transform duration-200"
                  >
                    {category.name}
                  </Button>
                </motion.div>
              ))}
            </motion.div>

            {categories.map((category) => (
              <TabsContent key={category.id} value={category.slug} className="mt-0">
                <motion.div
                  variants={container}
                  initial="hidden"
                  whileInView="show"
                  viewport={{ once: true }}
                  className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                >
                  {getItemsByCategory(category.slug).map((item) => {
                    const itemKey = `${item.id}-${selectedSizes[item.id] || 'default'}`
                    const quantity = quantities[itemKey] || 1
                    const sizes = getItemSizes(item)
                    const options = getItemOptions(item)
                    const hasVariants = sizes.length > 0 || options.length > 0
                    const isFavorite = favorites[item.id]
                    const isAdded = addedItems[item.id]

                    return (
                      <motion.div
                        key={item.id}
                        variants={itemVariant}
                        whileHover={{ 
                          y: -8,
                          transition: { duration: 0.2 }
                        }}
                        className="group relative bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100 dark:border-gray-700"
                      >
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
                                <Check className="h-12 w-12 mx-auto mb-2" />
                                <p className="font-bold text-lg">Added to Cart!</p>
                                <p className="text-sm opacity-90">Great choice! 🎉</p>
                              </motion.div>
                            </motion.div>
                          )}
                        </AnimatePresence>

                        <div className="relative h-48 bg-gray-100 dark:bg-gray-700 overflow-hidden">
                          <Image
                            src={item.image_url || "/placeholder.jpg"}
                            alt={item.name}
                            fill
                            className="object-cover group-hover:scale-110 transition-transform duration-500"
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                            priority={false}
                          />
                          
                          {/* Popular badge */}
                          {item.is_popular && (
                            <motion.div
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              className="absolute top-3 left-3 bg-gradient-to-r from-yellow-400 to-orange-500 text-black px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 shadow-lg"
                            >
                              <Sparkles className="h-3 w-3" />
                              Popular
                            </motion.div>
                          )}

                          {/* Favorite button */}
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => toggleFavorite(item.id)}
                            className="absolute top-3 right-3 p-2 bg-white/90 dark:bg-gray-800/90 rounded-full shadow-lg hover:bg-white dark:hover:bg-gray-800 transition-colors duration-200"
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
                            NLe {getItemPrice(item, selectedSizes[item.id], selectedOptions[item.id])}
                          </div>
                        </div>

                        <div className="p-6">
                          <div className="mb-3">
                            <h3 className="text-xl font-bold text-gray-900 dark:text-white group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors duration-200">
                              {item.name}
                            </h3>
                          </div>

                          {item.description && (
                            <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-2 text-sm">
                              {item.description}
                            </p>
                          )}

                          {hasVariants && (
                            <div className="space-y-3 mb-4">
                              {sizes.length > 0 && (
                                <div>
                                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-1">
                                    <span className="w-2 h-2 bg-orange-500 rounded-full"></span>
                                    Choose Size:
                                  </p>
                                  <div className="flex gap-2">
                                    {sizes.map((size) => (
                                      <motion.button
                                        key={size}
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={() => handleSizeSelect(item.id, size)}
                                        className={`px-3 py-1 rounded-full text-xs font-medium transition-all duration-200 ${
                                          selectedSizes[item.id] === size
                                            ? 'bg-orange-600 text-white shadow-md'
                                            : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-orange-100 dark:hover:bg-orange-900/20'
                                        }`}
                                      >
                                        {size}
                                      </motion.button>
                                    ))}
                                  </div>
                                </div>
                              )}

                              {options.length > 0 && (
                                <div>
                                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-1">
                                    <span className="w-2 h-2 bg-orange-500 rounded-full"></span>
                                    Add Extras:
                                  </p>
                                  <div className="flex flex-wrap gap-2">
                                    {options.map((option) => (
                                      <motion.button
                                        key={option}
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={() => handleOptionToggle(item.id, option)}
                                        className={`px-3 py-1 rounded-full text-xs font-medium transition-all duration-200 ${
                                          selectedOptions[item.id]?.includes(option)
                                            ? 'bg-green-600 text-white shadow-md'
                                            : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-green-100 dark:hover:bg-green-900/20'
                                        }`}
                                      >
                                        {option}
                                      </motion.button>
                                    ))}
                                  </div>
                                </div>
                              )}
                            </div>
                          )}

                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2 bg-gray-50 dark:bg-gray-700 rounded-lg p-1">
                              <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={() => handleQuantityChange(itemKey, -1)}
                                disabled={quantity <= 1}
                                className="p-1 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors disabled:opacity-50"
                              >
                                <Minus className="h-4 w-4" />
                              </motion.button>
                              <span className="w-8 text-center font-bold text-lg">{quantity}</span>
                              <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={() => handleQuantityChange(itemKey, 1)}
                                className="p-1 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                              >
                                <Plus className="h-4 w-4" />
                              </motion.button>
                            </div>

                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={() => handleAddToCart(item)}
                              className="bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white px-6 py-2 rounded-full font-medium shadow-lg hover:shadow-xl transition-all duration-200 flex items-center gap-2"
                            >
                              <ShoppingCart className="h-4 w-4" />
                              Add to Cart
                            </motion.button>
                          </div>
                        </div>
                      </motion.div>
                    )
                  })}
                </motion.div>

                {getItemsByCategory(category.slug).length === 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center py-12"
                  >
                    <p className="text-gray-500 dark:text-gray-400">
                      No items available in this category.
                    </p>
                  </motion.div>
                )}
              </TabsContent>
            ))}
          </Tabs>
        )}

        {categories.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-12"
          >
            <p className="text-gray-500 dark:text-gray-400">
              No menu categories available.
            </p>
          </motion.div>
        )}
      </div>
    </div>
  )
}
