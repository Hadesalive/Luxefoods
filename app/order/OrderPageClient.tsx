"use client"

import { useState, useEffect } from "react"
import { Tabs, TabsContent } from "@/components/ui/tabs"
import { Card, CardContent } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { ShoppingCart, ArrowLeft, Plus, Minus, Star, Check, Home, Phone, Clock, Heart, Sparkles, Search, X } from "lucide-react"
import { MenuService, type MenuItemWithCategory, type Category } from "@/lib/menu-service"
import { useCart } from "@/contexts/CartContext"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"

export default function OrderPageClient() {
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
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")

  const itemCount = items.length

  // Fuzzy search function
  const fuzzySearch = (query: string, text: string): boolean => {
    const queryLower = query.toLowerCase()
    const textLower = text.toLowerCase()
    
    if (queryLower.length === 0) return true
    
    let queryIndex = 0
    for (let i = 0; i < textLower.length && queryIndex < queryLower.length; i++) {
      if (textLower[i] === queryLower[queryIndex]) {
        queryIndex++
      }
    }
    
    return queryIndex === queryLower.length
  }

  // Filter items based on search query
  const getFilteredItems = (items: MenuItemWithCategory[], query: string) => {
    if (!query.trim()) return items
    
    return items.filter(item => {
      const nameMatch = fuzzySearch(query, item.name)
      const descriptionMatch = item.description ? fuzzySearch(query, item.description) : false
      const categoryMatch = item.category?.name ? fuzzySearch(query, item.category.name) : false
      
      return nameMatch || descriptionMatch || categoryMatch
    })
  }

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
    setFavorites((prev) => ({
      ...prev,
      [itemId]: !prev[itemId],
    }))
  }

  const getItemPrice = (item: MenuItemWithCategory, selectedSize?: string, selectedOptions?: string[], quantity: number = 1) => {
    let basePrice = item.price

    // Apply size price adjustment
    if (selectedSize && item.sizes) {
      const size = item.sizes.find(s => s.size_name === selectedSize)
      if (size) {
        basePrice = size.price
      }
    }

    // Apply options price adjustments
    let optionsPrice = 0
    if (selectedOptions && item.options) {
      selectedOptions.forEach(optionName => {
        const option = item.options?.find(opt => opt.option_name === optionName)
        if (option) {
          optionsPrice += option.price_adjustment || 0
        }
      })
    }

    // Calculate total price including quantity
    const pricePerItem = basePrice + optionsPrice
    return pricePerItem * quantity
  }

  const getItemSizes = (item: MenuItemWithCategory) => {
    return item.sizes || []
  }

  const getItemOptions = (item: MenuItemWithCategory) => {
    return item.options || []
  }

  const handleAddToCart = (item: MenuItemWithCategory) => {
    const itemKey = item.id
    const selectedSize = selectedSizes[itemKey]
    const selectedOptionsList = selectedOptions[itemKey] || []
    const quantity = quantities[itemKey] || 1

    // Get final price (already includes quantity)
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
    setAddedItems((prev) => ({ ...prev, [itemKey]: true }))
    setTimeout(() => {
      setAddedItems((prev) => ({ ...prev, [itemKey]: false }))
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

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      setIsSearchOpen(true)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-red-50 dark:from-gray-900 dark:via-gray-800 dark:to-orange-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading menu...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-red-50 dark:from-gray-900 dark:via-gray-800 dark:to-orange-900 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6">
          <div className="text-red-600 dark:text-red-400 text-6xl mb-4">⚠️</div>
          <h2 className="text-xl font-bold mb-2 text-gray-900 dark:text-gray-100">Failed to Load Menu</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-4">{error}</p>
          <Button onClick={() => window.location.reload()} className="bg-orange-600 hover:bg-orange-700">
            Try Again
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-red-50 dark:from-gray-900 dark:via-gray-800 dark:to-orange-900">
      {/* Header */}
      <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-b border-orange-200 dark:border-orange-800 sticky top-0 z-40">
        <div className="container mx-auto px-4 py-3 sm:py-4">
          <div className="flex items-center justify-between gap-4">
            {/* Back Button */}
            <Link
              href="/"
              className="flex items-center text-orange-900 dark:text-orange-100 hover:text-orange-700 dark:hover:text-orange-300 transition-colors group min-w-0"
            >
              <ArrowLeft className="h-4 w-4 sm:h-5 sm:w-5 mr-1 sm:mr-2 group-hover:-translate-x-1 transition-transform flex-shrink-0" />
              <span className="font-medium text-sm sm:text-base truncate">Back to Home</span>
            </Link>

            {/* Center Title */}
            <div className="text-center flex-1 min-w-0">
              <h1 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-gray-100 truncate">Order Online</h1>
              <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 truncate">Fresh & Delicious</p>
            </div>

            {/* Right Side Actions */}
            <div className="flex items-center gap-2 sm:gap-4 min-w-0">
              {/* Search Button */}
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsSearchOpen(true)}
                className="bg-orange-50 dark:bg-orange-950/50 border-orange-200 dark:border-orange-700 text-orange-900 dark:text-orange-100 hover:bg-orange-100 dark:hover:bg-orange-900/50 p-2 sm:px-3"
              >
                <Search className="h-4 w-4" />
                <span className="hidden sm:inline ml-2">Search</span>
              </Button>

              {/* Cart Button */}
              <Link href="/cart">
                <Button
                  variant="outline"
                  size="sm"
                  className="relative bg-orange-50 dark:bg-orange-950/50 border-orange-200 dark:border-orange-700 text-orange-900 dark:text-orange-100 hover:bg-orange-100 dark:hover:bg-orange-900/50 p-2 sm:px-3"
                >
                  <ShoppingCart className="h-4 w-4" />
                  <span className="hidden sm:inline ml-2">Cart</span>
                  {itemCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                      {itemCount}
                    </span>
                  )}
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-6">
        {/* Category Tabs */}
        {categories.length > 0 && (
          <div className="mb-8">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <div className="flex flex-wrap gap-2 mb-6">
                {/* All Button */}
                <Button
                  variant={activeTab === "all" ? "default" : "outline"}
                  onClick={() => setActiveTab("all")}
                  className={`${
                    activeTab === "all"
                      ? "bg-orange-600 hover:bg-orange-700 text-white"
                      : "bg-white dark:bg-gray-800 border-orange-200 dark:border-orange-700 text-orange-900 dark:text-orange-100 hover:bg-orange-50 dark:hover:bg-orange-950/50"
                  } transition-all duration-200`}
                >
                  🍽️ All
                </Button>
                {categories.map((category) => (
                  <Button
                    key={category.slug}
                    variant={activeTab === category.slug ? "default" : "outline"}
                    onClick={() => setActiveTab(category.slug)}
                    className={`${
                      activeTab === category.slug
                        ? "bg-orange-600 hover:bg-orange-700 text-white"
                        : "bg-white dark:bg-gray-800 border-orange-200 dark:border-orange-700 text-orange-900 dark:text-orange-100 hover:bg-orange-50 dark:hover:bg-orange-950/50"
                    } transition-all duration-200`}
                  >
                    {category.name}
                  </Button>
                ))}
              </div>

              {/* Menu Items Grid */}
              <motion.div
                variants={container}
                initial="hidden"
                animate="show"
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
              >
                <AnimatePresence>
                  {getItemsByCategory(activeTab).map((item) => {
                    const itemKey = item.id
                    const selectedSize = selectedSizes[itemKey]
                    const selectedOptionsList = selectedOptions[itemKey] || []
                    const quantity = quantities[itemKey] || 1
                    const price = getItemPrice(item, selectedSize, selectedOptionsList, quantity)
                    const isFavorite = favorites[itemKey]
                    const isAdded = addedItems[itemKey]

                    return (
                      <motion.div
                        key={item.id}
                        variants={itemVariant}
                        layout
                        className="relative"
                      >
                        <Card className="h-full bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-orange-200 dark:border-orange-700 hover:shadow-xl transition-all duration-300 group overflow-hidden">
                          <CardContent className="p-4">
                            {/* Image */}
                            <div className="relative mb-4 aspect-square overflow-hidden rounded-lg">
                              <Image
                                src={item.image_url || "/placeholder.jpg"}
                                alt={item.name}
                                fill
                                className="object-cover group-hover:scale-105 transition-transform duration-300"
                              />
                              
                              {/* Favorite Button */}
                              <button
                                onClick={() => toggleFavorite(itemKey)}
                                className="absolute top-2 right-2 p-2 rounded-full bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm hover:bg-white dark:hover:bg-gray-800 transition-colors"
                              >
                                <Heart
                                  className={`h-4 w-4 ${
                                    isFavorite
                                      ? "fill-red-500 text-red-500"
                                      : "text-gray-400 hover:text-red-500"
                                  } transition-colors`}
                                />
                              </button>

                              {/* Popular Badge */}
                              {item.is_popular && (
                                <div className="absolute top-2 left-2">
                                  <span className="bg-orange-500 text-white text-xs px-2 py-1 rounded-full flex items-center gap-1">
                                    <Star className="h-3 w-3 fill-current" />
                                    Popular
                                  </span>
                                </div>
                              )}

                              {/* Success Overlay */}
                              {isAdded && (
                                <motion.div
                                  initial={{ opacity: 0, scale: 0.8 }}
                                  animate={{ opacity: 1, scale: 1 }}
                                  exit={{ opacity: 0, scale: 0.8 }}
                                  className="absolute inset-0 bg-green-500/90 flex items-center justify-center rounded-lg"
                                >
                                  <div className="text-center text-white">
                                    <Check className="h-8 w-8 mx-auto mb-2" />
                                    <p className="font-semibold">Added to Cart!</p>
                                  </div>
                                </motion.div>
                              )}
                            </div>

                            {/* Content */}
                            <div className="space-y-3">
                              <div>
                                <h3 className="font-semibold text-gray-900 dark:text-gray-100 text-lg mb-1">
                                  {item.name}
                                </h3>
                                <p className="text-gray-600 dark:text-gray-400 text-sm line-clamp-2">
                                  {item.description}
                                </p>
                              </div>

                              {/* Sizes */}
                              {getItemSizes(item).length > 0 && (
                                <div className="space-y-3">
                                  <div className="flex items-center gap-2">
                                    <div className="w-1.5 h-1.5 bg-orange-500 rounded-full"></div>
                                    <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                      Choose Size
                                    </p>
                                  </div>
                                  <div className="grid grid-cols-2 gap-2">
                                    {getItemSizes(item).map((size) => (
                                      <button
                                        key={size.size_name}
                                        onClick={() => handleSizeSelect(itemKey, size.size_name)}
                                        className={`relative p-3 rounded-xl border-2 transition-all duration-200 ${
                                          selectedSize === size.size_name
                                            ? "border-orange-500 bg-orange-50 dark:bg-orange-950/30 shadow-sm"
                                            : "border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 hover:border-orange-300 dark:hover:border-orange-600"
                                        }`}
                                      >
                                        <div className="text-center">
                                          <div className={`font-semibold text-sm ${
                                            selectedSize === size.size_name
                                              ? "text-orange-700 dark:text-orange-300"
                                              : "text-gray-900 dark:text-gray-100"
                                          }`}>
                                            {size.size_name}
                                          </div>
                                          <div className={`text-xs mt-1 ${
                                            selectedSize === size.size_name
                                              ? "text-orange-600 dark:text-orange-400"
                                              : "text-gray-500 dark:text-gray-400"
                                          }`}>
                                            NLe{size.price.toFixed(2)}
                                          </div>
                                        </div>
                                        {selectedSize === size.size_name && (
                                          <div className="absolute -top-1 -right-1 w-5 h-5 bg-orange-500 rounded-full flex items-center justify-center">
                                            <Check className="h-3 w-3 text-white" />
                                          </div>
                                        )}
                                      </button>
                                    ))}
                                  </div>
                                </div>
                              )}

                              {/* Options */}
                              {getItemOptions(item).length > 0 && (
                                <div className="space-y-3">
                                  <div className="flex items-center gap-2">
                                    <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                                    <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                      Customize
                                    </p>
                                  </div>
                                  <div className="space-y-2">
                                    {getItemOptions(item).map((option) => (
                                      <button
                                        key={option.option_name}
                                        onClick={() => handleOptionToggle(itemKey, option.option_name)}
                                        className={`w-full flex items-center justify-between p-3 rounded-xl border transition-all duration-200 ${
                                          selectedOptionsList.includes(option.option_name)
                                            ? "border-green-500 bg-green-50 dark:bg-green-950/30"
                                            : "border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 hover:border-green-300 dark:hover:border-green-600"
                                        }`}
                                      >
                                        <div className="flex items-center gap-3">
                                          <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                                            selectedOptionsList.includes(option.option_name)
                                              ? "border-green-500 bg-green-500"
                                              : "border-gray-300 dark:border-gray-500"
                                          }`}>
                                            {selectedOptionsList.includes(option.option_name) && (
                                              <Check className="h-2.5 w-2.5 text-white" />
                                            )}
                                          </div>
                                          <span className={`font-medium text-sm ${
                                            selectedOptionsList.includes(option.option_name)
                                              ? "text-green-700 dark:text-green-300"
                                              : "text-gray-900 dark:text-gray-100"
                                          }`}>
                                            {option.option_name}
                                          </span>
                                        </div>
                                        <span className={`text-sm font-medium ${
                                          selectedOptionsList.includes(option.option_name)
                                            ? "text-green-600 dark:text-green-400"
                                            : "text-gray-500 dark:text-gray-400"
                                        }`}>
                                          +NLe{option.price_adjustment?.toFixed(2) || "0.00"}
                                        </span>
                                      </button>
                                    ))}
                                  </div>
                                </div>
                              )}

                              {/* Price and Quantity */}
                              <div className="flex items-center justify-between">
                                <div className="text-right">
                                  <p className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                                    NLe{price.toFixed(2)}
                                  </p>
                                </div>

                                <div className="flex items-center gap-2">
                                  <button
                                    onClick={() => handleQuantityChange(itemKey, -1)}
                                    className="p-1 rounded-full bg-orange-100 dark:bg-orange-900/50 text-orange-600 dark:text-orange-400 hover:bg-orange-200 dark:hover:bg-orange-900/70 transition-colors"
                                  >
                                    <Minus className="h-4 w-4" />
                                  </button>
                                  <span className="w-8 text-center font-medium text-gray-900 dark:text-gray-100">
                                    {quantity}
                                  </span>
                                  <button
                                    onClick={() => handleQuantityChange(itemKey, 1)}
                                    className="p-1 rounded-full bg-orange-100 dark:bg-orange-900/50 text-orange-600 dark:text-orange-400 hover:bg-orange-200 dark:hover:bg-orange-900/70 transition-colors"
                                  >
                                    <Plus className="h-4 w-4" />
                                  </button>
                                </div>
                              </div>

                              {/* Add to Cart Button */}
                              <Button
                                onClick={() => handleAddToCart(item)}
                                className="w-full bg-orange-600 hover:bg-orange-700 dark:bg-orange-700 dark:hover:bg-orange-600 text-white font-medium py-3 rounded-lg transition-all duration-200 transform hover:scale-[1.02] focus:scale-[0.98]"
                                disabled={isAdded}
                              >
                                {isAdded ? (
                                  <>
                                    <Check className="h-4 w-4 mr-2" />
                                    Added!
                                  </>
                                ) : (
                                  <>
                                    <ShoppingCart className="h-4 w-4 mr-2" />
                                    Add to Cart
                                  </>
                                )}
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>
                    )
                  })}
                </AnimatePresence>
              </motion.div>
            </Tabs>
          </div>
        )}

        {/* Empty State */}
        {getItemsByCategory(activeTab).length === 0 && !isLoading && (
          <div className="text-center py-12">
            <div className="text-gray-400 dark:text-gray-600 text-6xl mb-4">🍽️</div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
              {activeTab === "all" ? "No menu items available" : "No items in this category"}
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              {activeTab === "all" 
                ? "We're working on adding delicious items to our menu!" 
                : "Check back later for new menu items in this category!"}
            </p>
          </div>
        )}
      </div>

      {/* Search Modal */}
      <Dialog open={isSearchOpen} onOpenChange={setIsSearchOpen}>
        <DialogContent className="w-[95vw] max-w-2xl max-h-[90vh] overflow-y-auto p-4 sm:p-6">
          <DialogHeader className="pb-4">
            <DialogTitle className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-gray-100">
              Search Menu Items
            </DialogTitle>
          </DialogHeader>
          
          {/* Search Input */}
          <form onSubmit={handleSearchSubmit} className="mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <Input
                type="text"
                placeholder="Search by name, description, or category..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 h-12 text-base"
                autoFocus
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full"
                >
                  <X className="h-4 w-4 text-gray-400" />
                </button>
              )}
            </div>
          </form>

          {/* Search Results */}
          <div className="space-y-4">
            {searchQuery.trim() && (
              <>
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                    Search Results
                  </h3>
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    {getFilteredItems(menuItems, searchQuery).length} items found
                  </span>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {getFilteredItems(menuItems, searchQuery).map((item) => {
                    const itemKey = item.id
                    const selectedSize = selectedSizes[itemKey]
                    const selectedOptionsList = selectedOptions[itemKey] || []
                    const quantity = quantities[itemKey] || 1
                    const price = getItemPrice(item, selectedSize, selectedOptionsList, quantity)
                    const isAdded = addedItems[itemKey]

                    return (
                      <Card key={item.id} className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-orange-200 dark:border-orange-700">
                        <CardContent className="p-4">
                          <div className="flex gap-3">
                            {/* Image */}
                            <div className="relative w-20 h-20 flex-shrink-0 overflow-hidden rounded-lg">
                              <Image
                                src={item.image_url || "/placeholder.jpg"}
                                alt={item.name}
                                fill
                                className="object-cover"
                              />
                            </div>
                            
                            {/* Content */}
                            <div className="flex-1 min-w-0">
                              <h4 className="font-semibold text-gray-900 dark:text-gray-100 text-sm mb-1 truncate">
                                {item.name}
                              </h4>
                              {item.category && (
                                <p className="text-xs text-orange-600 dark:text-orange-400 mb-1">
                                  {item.category.name}
                                </p>
                              )}
                              <p className="text-xs text-gray-600 dark:text-gray-400 line-clamp-2 mb-2">
                                {item.description}
                              </p>
                              
                              <div className="flex items-center justify-between">
                                <span className="text-lg font-bold text-orange-600 dark:text-orange-400">
                                  NLe{getItemPrice(item, selectedSize, selectedOptionsList, quantity).toFixed(2)}
                                </span>
                                
                                <Button
                                  onClick={() => handleAddToCart(item)}
                                  size="sm"
                                  className="bg-orange-600 hover:bg-orange-700 text-white"
                                  disabled={isAdded}
                                >
                                  {isAdded ? (
                                    <>
                                      <Check className="h-3 w-3 mr-1" />
                                      Added
                                    </>
                                  ) : (
                                    <>
                                      <Plus className="h-3 w-3 mr-1" />
                                      Add
                                    </>
                                  )}
                                </Button>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    )
                  })}
                </div>
                
                {getFilteredItems(menuItems, searchQuery).length === 0 && (
                  <div className="text-center py-8">
                    <div className="text-gray-400 dark:text-gray-600 text-4xl mb-3">🔍</div>
                    <h4 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                      No items found
                    </h4>
                    <p className="text-gray-600 dark:text-gray-400 text-sm">
                      Try searching with different keywords
                    </p>
                  </div>
                )}
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
} 