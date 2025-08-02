"use client"

import { useState, useEffect } from "react"
import { Tabs, TabsContent } from "@/components/ui/tabs"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { ShoppingCart, Star, Plus, Minus, Check, Heart, Sparkles } from "lucide-react"
import { useCart } from "@/contexts/CartContext"
import { motion, AnimatePresence } from "framer-motion"
import { MenuService, type MenuItemWithCategory, type Category } from "@/lib/menu-service"

export default function MenuSection() {
  const { addItem } = useCart()
  const [activeTab, setActiveTab] = useState("")
  const [selectedSizes, setSelectedSizes] = useState<{ [key: string]: string }>({})
  const [selectedOptions, setSelectedOptions] = useState<{ [key: string]: string[] }>({})
  const [quantities, setQuantities] = useState<{ [key: string]: number }>({})
  const [menuItems, setMenuItems] = useState<MenuItemWithCategory[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [addedItems, setAddedItems] = useState<{ [key: string]: boolean }>({})
  const [favorites, setFavorites] = useState<{ [key: string]: boolean }>({})

  useEffect(() => {
    const loadMenuData = async () => {
      try {
        setIsLoading(true)
        setError(null)
        
        // Use the optimized service with caching
        const [menuData, categoriesData] = await Promise.all([
          MenuService.getMenuItems(true, 20), // Limit to 20 items for homepage
          MenuService.getCategories(true),
        ])
        
        setMenuItems(menuData)
        setCategories(categoriesData)
        
        // Set "all" as the default active tab
        setActiveTab("all")
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

  const getItemPrice = (item: MenuItemWithCategory, selectedSize?: string, selectedOptions?: string[], quantity: number = 1) => {
    let basePrice = item.price

    // Apply size price adjustment (quantity is handled separately in cart)
    if (selectedSize && item.sizes && item.sizes.length > 0) {
      const size = item.sizes.find(s => s.size_name === selectedSize)
      if (size) {
        basePrice = size.price
      }
    }

    // Apply options price adjustments (quantity is handled separately in cart)
    if (selectedOptions && item.options && item.options.length > 0) {
      selectedOptions.forEach(optionName => {
        const option = item.options.find(opt => opt.option_name === optionName)
        if (option && option.price_adjustment) {
          basePrice += option.price_adjustment
        }
      })
    }

    // Calculate total price including quantity
    const pricePerItem = basePrice
    return pricePerItem * quantity
  }

  const getItemSizes = (item: MenuItemWithCategory) => {
    return item.sizes || []
  }

  const getItemOptions = (item: MenuItemWithCategory) => {
    return item.options || []
  }

  const handleAddToCart = (item: MenuItemWithCategory) => {
    const itemKey = `${item.id}-${selectedSizes[item.id] || 'default'}`
    const quantity = quantities[itemKey] || 1
    const selectedSize = selectedSizes[item.id]
    const selectedOptionsList = selectedOptions[item.id] || []
    const totalPrice = getItemPrice(item, selectedSize, selectedOptionsList, quantity)

    // Add to cart as 1 item with total price
    addItem({
      id: item.id,
      name: item.name,
      price: totalPrice,
      type: item.category?.slug || "menu-item",
      size: selectedSize,
      options: selectedOptionsList,
      quantity: 1 // Set to 1 since price already includes quantity
    })

    // Show success feedback
    setAddedItems(prev => ({ ...prev, [item.id]: true }))
    
    // Hide success feedback after 2 seconds
    setTimeout(() => {
      setAddedItems(prev => ({ ...prev, [item.id]: false }))
    }, 2000)
  }

  const getItemsByCategory = (categorySlug: string) => {
    // If "all" is selected, return all items
    if (categorySlug === "all") {
      return menuItems
    }
    // Otherwise filter by category
    return menuItems.filter(item => item.category?.slug === categorySlug)
  }

  if (isLoading) {
    return (
      <section className="py-16 bg-gradient-to-br from-orange-50 via-white to-red-50 dark:from-gray-900 dark:via-gray-800 dark:to-orange-900">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              className="w-16 h-16 border-4 border-orange-200 border-t-orange-600 rounded-full mx-auto"
            />
            <p className="mt-4 text-gray-600 dark:text-gray-400">Loading delicious menu...</p>
          </div>
        </div>
      </section>
    )
  }

  if (error) {
    return (
      <section className="py-16 bg-gradient-to-br from-orange-50 via-white to-red-50 dark:from-gray-900 dark:via-gray-800 dark:to-orange-900">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <p className="text-red-600 dark:text-red-400 mb-4">{error}</p>
            <Button onClick={() => window.location.reload()}>
              Try Again
            </Button>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="py-16 bg-gradient-to-br from-orange-50 via-white to-red-50 dark:from-gray-900 dark:via-gray-800 dark:to-orange-900">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            Our Menu
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Discover our delicious selection of fresh bread, pastries, and local dishes
          </p>
        </motion.div>

        {categories.length > 0 && (
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
              className="flex flex-wrap justify-center gap-2 mb-8"
            >
              {/* All Button */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: 0 }}
                viewport={{ once: true }}
              >
                <Button
                  variant={activeTab === "all" ? "default" : "outline"}
                  onClick={() => setActiveTab("all")}
                  className="rounded-full px-6 py-2 hover:scale-105 transition-transform duration-200"
                >
                  🍽️ All
                </Button>
              </motion.div>
              {categories.map((category, index) => (
                <motion.div
                  key={category.id}
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3, delay: (index + 1) * 0.1 }}
                  viewport={{ once: true }}
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

            {/* All Items Tab */}
            <TabsContent value="all" className="mt-0">
              <motion.div
                variants={container}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              >
                {getItemsByCategory("all").map((item) => {
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
                              <p className="text-sm opacity-90">Delicious choice! 🎉</p>
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
                        <div className="absolute bottom-3 right-3 bg-orange-600 text-white px-3 py-1 rounded-full text-sm font-bold shadow-lg">
                          NLe {getItemPrice(item, selectedSizes[item.id], selectedOptions[item.id], quantity)}
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
                              <div className="space-y-3">
                                <div className="flex items-center gap-2">
                                  <div className="w-1.5 h-1.5 bg-orange-500 rounded-full"></div>
                                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                    Choose Size
                                  </p>
                                </div>
                                <div className="grid grid-cols-2 gap-2">
                                  {sizes.map((size) => (
                                    <motion.button
                                      key={size.size_name}
                                      whileHover={{ scale: 1.02 }}
                                      whileTap={{ scale: 0.98 }}
                                      onClick={() => handleSizeSelect(item.id, size.size_name)}
                                      className={`relative p-3 rounded-xl border-2 transition-all duration-200 ${
                                        selectedSizes[item.id] === size.size_name
                                          ? "border-orange-500 bg-orange-50 dark:bg-orange-950/30 shadow-sm"
                                          : "border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 hover:border-orange-300 dark:hover:border-orange-600"
                                      }`}
                                    >
                                      <div className="text-center">
                                        <div className={`font-semibold text-sm ${
                                          selectedSizes[item.id] === size.size_name
                                            ? "text-orange-700 dark:text-orange-300"
                                            : "text-gray-900 dark:text-gray-100"
                                        }`}>
                                          {size.size_name}
                                        </div>
                                        <div className={`text-xs mt-1 ${
                                          selectedSizes[item.id] === size.size_name
                                            ? "text-orange-600 dark:text-orange-400"
                                            : "text-gray-500 dark:text-gray-400"
                                        }`}>
                                          NLe{size.price.toFixed(2)}
                                        </div>
                                      </div>
                                      {selectedSizes[item.id] === size.size_name && (
                                        <div className="absolute -top-1 -right-1 w-5 h-5 bg-orange-500 rounded-full flex items-center justify-center">
                                          <Check className="h-3 w-3 text-white" />
                                        </div>
                                      )}
                                    </motion.button>
                                  ))}
                                </div>
                              </div>
                            )}

                            {options.length > 0 && (
                              <div className="space-y-3">
                                <div className="flex items-center gap-2">
                                  <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                    Customize
                                  </p>
                                </div>
                                <div className="space-y-2">
                                  {options.map((option) => (
                                    <motion.button
                                      key={option.option_name}
                                      whileHover={{ scale: 1.01 }}
                                      whileTap={{ scale: 0.99 }}
                                      onClick={() => handleOptionToggle(item.id, option.option_name)}
                                      className={`w-full flex items-center justify-between p-3 rounded-xl border transition-all duration-200 ${
                                        selectedOptions[item.id]?.includes(option.option_name)
                                          ? "border-green-500 bg-green-50 dark:bg-green-950/30"
                                          : "border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 hover:border-green-300 dark:hover:border-green-600"
                                      }`}
                                    >
                                      <div className="flex items-center gap-3">
                                        <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                                          selectedOptions[item.id]?.includes(option.option_name)
                                            ? "border-green-500 bg-green-500"
                                            : "border-gray-300 dark:border-gray-500"
                                        }`}>
                                          {selectedOptions[item.id]?.includes(option.option_name) && (
                                            <Check className="h-2.5 w-2.5 text-white" />
                                          )}
                                        </div>
                                        <span className={`font-medium text-sm ${
                                          selectedOptions[item.id]?.includes(option.option_name)
                                            ? "text-green-700 dark:text-green-300"
                                            : "text-gray-900 dark:text-gray-100"
                                        }`}>
                                          {option.option_name}
                                        </span>
                                      </div>
                                      <span className={`text-sm font-medium ${
                                        selectedOptions[item.id]?.includes(option.option_name)
                                          ? "text-green-600 dark:text-green-400"
                                          : "text-gray-500 dark:text-gray-400"
                                      }`}>
                                        +NLe{option.price_adjustment?.toFixed(2) || "0.00"}
                                      </span>
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

              {getItemsByCategory("all").length === 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-center py-12"
                >
                  <p className="text-gray-500 dark:text-gray-400">
                    No menu items available.
                  </p>
                </motion.div>
              )}
            </TabsContent>

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
                                <p className="text-sm opacity-90">Delicious choice! 🎉</p>
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
                          <div className="absolute bottom-3 right-3 bg-orange-600 text-white px-3 py-1 rounded-full text-sm font-bold shadow-lg">
                            NLe {getItemPrice(item, selectedSizes[item.id], selectedOptions[item.id], quantity)}
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
                                        key={size.size_name}
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={() => handleSizeSelect(item.id, size.size_name)}
                                        className={`px-3 py-1 rounded-full text-xs font-medium transition-all duration-200 ${
                                          selectedSizes[item.id] === size.size_name
                                            ? 'bg-orange-600 text-white shadow-md'
                                            : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-orange-100 dark:hover:bg-orange-900/20'
                                        }`}
                                      >
                                        {size.size_name} - NLe{size.price.toFixed(2)}
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
                                        key={option.option_name}
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={() => handleOptionToggle(item.id, option.option_name)}
                                        className={`px-3 py-1 rounded-full text-xs font-medium transition-all duration-200 ${
                                          selectedOptions[item.id]?.includes(option.option_name)
                                            ? 'bg-green-600 text-white shadow-md'
                                            : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-green-100 dark:hover:bg-green-900/20'
                                        }`}
                                      >
                                        {option.option_name} +NLe{option.price_adjustment?.toFixed(2) || "0.00"}
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
    </section>
  )
}
