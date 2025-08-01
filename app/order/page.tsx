"use client"

import { useState, useEffect } from "react"
import { Tabs, TabsContent } from "@/components/ui/tabs"
import { Card, CardContent } from "@/components/ui/card"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { ShoppingCart, ArrowLeft, Plus, Minus, Star, Check, Home, Phone, Clock } from "lucide-react"
import { MenuService, type MenuItemWithCategory, type Category } from "@/lib/menu-service"
import { useCart } from "@/contexts/CartContext"
import Link from "next/link"
import { motion } from "framer-motion"
import Head from "next/head"

export default function OrderPage() {
  const { addItem, items } = useCart()
  const [activeTab, setActiveTab] = useState("")
  const [selectedSizes, setSelectedSizes] = useState<{ [key: string]: string }>({})
  const [selectedOptions, setSelectedOptions] = useState<{ [key: string]: string[] }>({})
  const [quantities, setQuantities] = useState<{ [key: string]: number }>({})
  const [menuItems, setMenuItems] = useState<MenuItemWithCategory[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const itemCount = items.length

  useEffect(() => {
    const loadMenuData = async () => {
      try {
        setIsLoading(true)
        const [menuData, categoriesData] = await Promise.all([
          MenuService.getMenuItems(),
          MenuService.getCategories(),
        ])
        setMenuItems(menuData)
        setCategories(categoriesData)
        if (categoriesData.length > 0) {
          setActiveTab(categoriesData[0].slug)
        }
      } catch (error) {
        console.error("Error loading menu data:", error)
      } finally {
        setIsLoading(false)
      }
    }

    loadMenuData()
  }, [])

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

  const getItemPrice = (item: MenuItemWithCategory, selectedSize?: string, selectedOptions?: string[]) => {
    let basePrice = item.price

    // Add size price if size is selected
    if (selectedSize && item.sizes && item.sizes.length > 0) {
      const size = item.sizes.find(s => s.size_name === selectedSize)
      if (size) {
        basePrice = size.price
      }
    }

    // Add option price adjustments
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
      return item.options.filter(opt => opt.is_available)
    }
    return []
  }

  if (isLoading) {
    return (
      <>
        <Head>
          <title>Order Online - Restaurant & Bakery | Fresh Food, Local Dishes & International Cuisine | Kings Bakery Freetown</title>
          <meta
            name="description"
            content="Order fresh food, local dishes, international cuisine, bread, pastries, jollof rice, fried rice, pizza and more online from Kings Bakery Restaurant in Freetown, Sierra Leone. Fast delivery in Lumley and surrounding areas. Order now!"
          />
          <meta
            name="keywords"
            content="order food online Freetown, restaurant delivery Lumley, local dishes delivery Freetown, international cuisine order Sierra Leone, online restaurant ordering, food delivery Freetown, Kings Bakery restaurant order, jollof rice, fried rice, pizza delivery"
          />
          <link rel="canonical" href="https://thekingsbakerysl.com/order" />
          <meta
            property="og:title"
            content="Order Online - Restaurant & Bakery | Fresh Food, Local Dishes & International Cuisine | Kings Bakery Freetown"
          />
          <meta
            property="og:description"
            content="Order fresh food, local dishes, international cuisine, bread, pastries, jollof rice, fried rice, pizza and more online from Kings Bakery Restaurant in Freetown, Sierra Leone. Fast delivery in Lumley and surrounding areas."
          />
          <meta property="og:url" content="https://thekingsbakerysl.com/order" />
        </Head>

        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 transition-colors duration-300">
          <div className="container mx-auto px-4 py-6 lg:py-8">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black dark:border-white mx-auto"></div>
              <p className="mt-4 text-gray-600 dark:text-gray-400">Loading menu...</p>
            </div>
          </div>
        </div>
      </>
    )
  }

  return (
    <>
      <Head>
        <title>Order Online - Restaurant & Bakery | Fresh Food, Local Dishes & International Cuisine | Kings Bakery Freetown</title>
        <meta
          name="description"
          content="Order fresh food, local dishes, international cuisine, bread, pastries, jollof rice, fried rice, pizza and more online from Kings Bakery Restaurant in Freetown, Sierra Leone. Fast delivery in Lumley and surrounding areas. Order now!"
        />
        <meta
          name="keywords"
          content="order food online Freetown, restaurant delivery Lumley, local dishes delivery Freetown, international cuisine order Sierra Leone, online restaurant ordering, food delivery Freetown, Kings Bakery restaurant order, jollof rice, fried rice, pizza delivery"
        />
        <link rel="canonical" href="https://thekingsbakerysl.com/order" />
        <meta
          property="og:title"
          content="Order Online - Restaurant & Bakery | Fresh Food, Local Dishes & International Cuisine | Kings Bakery Freetown"
        />
        <meta
          property="og:description"
          content="Order fresh food, local dishes, international cuisine, bread, pastries, jollof rice, fried rice, pizza and more online from Kings Bakery Restaurant in Freetown, Sierra Leone. Fast delivery in Lumley and surrounding areas."
        />
        <meta property="og:url" content="https://thekingsbakerysl.com/order" />
      </Head>

      {/* Header Section */}
      <div className="bg-gradient-to-r from-black via-gray-900 to-black text-white">
        <div className="container mx-auto px-4 py-6">
          {/* Navigation */}
          <div className="flex items-center justify-between mb-6">
            <Link href="/" className="flex items-center space-x-2 hover:text-yellow-300 transition-colors">
              <ArrowLeft className="h-5 w-5" />
              <span className="font-medium">Back to Home</span>
            </Link>
            <Link href="/cart" className="relative">
              <ShoppingCart className="h-6 w-6 hover:text-yellow-300 transition-colors" />
              {itemCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold">
                  {itemCount}
                </span>
              )}
            </Link>
          </div>

          {/* Hero Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">
              🍽️ Order Your Favorites
            </h1>
            <p className="text-lg sm:text-xl text-amber-200/90 dark:text-amber-100/90 mb-6 max-w-2xl mx-auto">
              Browse our delicious menu and add your favorite items to cart. Fresh, hot, and ready for you! 🚀
            </p>
            
            {/* Quick Info Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-2xl mx-auto">
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                <div className="flex items-center justify-center mb-2">
                  <Clock className="h-6 w-6 text-yellow-300" />
                </div>
                <p className="text-sm font-medium">Fast Delivery</p>
                <p className="text-xs text-amber-200/90 dark:text-amber-100/90">30-45 minutes</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                <div className="flex items-center justify-center mb-2">
                  <Star className="h-6 w-6 text-yellow-300" />
                </div>
                <p className="text-sm font-medium">Fresh & Hot</p>
                <p className="text-xs text-amber-200/90 dark:text-amber-100/90">Made to order</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                <div className="flex items-center justify-center mb-2">
                  <Phone className="h-6 w-6 text-yellow-300" />
                </div>
                <p className="text-sm font-medium">Call Us</p>
                                 <p className="text-xs text-amber-200/90 dark:text-amber-100/90">117 Main Regent Road</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 transition-colors duration-300">
        <div className="container mx-auto px-4 py-6 lg:py-8">

          {itemCount > 0 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mb-8 lg:mb-12 flex justify-center sticky top-20 z-40"
            >
              <div className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-lg shadow-2xl rounded-3xl p-4 border border-white/20 dark:border-gray-700/20">
                <Link href="/cart">
                  <Button
                    size="lg"
                    className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 dark:from-red-700 dark:to-red-800 dark:hover:from-red-600 dark:hover:to-red-700 text-white px-8 lg:px-12 py-4 lg:py-4 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 font-bold text-lg"
                  >
                    <ShoppingCart className="mr-3 h-6 w-6" />
                    View Cart ({itemCount} {itemCount === 1 ? "item" : "items"})
                  </Button>
                </Link>
              </div>
            </motion.div>
          )}

          <Tabs defaultValue={activeTab} value={activeTab} onValueChange={setActiveTab} className="w-full">
            {/* Mobile-friendly category tabs with horizontal scroll */}
            <div className="mb-8 lg:mb-12">
              <div className="flex overflow-x-auto gap-3 px-4 pb-4 scrollbar-hide">
                {categories.map((category) => (
                  <Button
                    key={category.id}
                    className={`flex-shrink-0 text-sm sm:text-base lg:text-lg px-4 sm:px-6 lg:px-8 py-2 sm:py-3 lg:py-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 whitespace-nowrap ${
                      activeTab === category.slug
                        ? "bg-black hover:bg-gray-800 dark:bg-gray-800 dark:hover:bg-gray-700 text-white"
                        : "bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 text-black dark:text-white border-2 border-black dark:border-gray-700"
                    }`}
                    onClick={() => setActiveTab(category.slug)}
                  >
                    {category.name}
                  </Button>
                ))}
              </div>
            </div>

            {categories.map((category) => {
              const categoryItems = menuItems.filter((item) => item.category?.slug === category.slug)
              
              return (
                <TabsContent key={category.id} value={category.slug}>
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5 }}
                    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 lg:gap-6 px-2 sm:px-4 lg:px-0"
                  >
                    {categoryItems.map((item, index) => {
                      const itemKey = `item-${item.id}`
                      const itemSizes = getItemSizes(item)
                      const selectedSize = selectedSizes[itemKey] || (itemSizes.length > 0 ? itemSizes[0] : "")
                      const itemSelectedOptions = selectedOptions[itemKey] || []
                      const quantity = quantities[itemKey] || 1
                      const price = getItemPrice(item, selectedSize, itemSelectedOptions)

                      return (
                        <motion.div
                          key={item.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.5, delay: index * 0.1 }}
                        >
                          <Card className="overflow-hidden group hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-white/20 dark:border-gray-700/20">
                            <div className="h-48 lg:h-56 relative overflow-hidden">
                              <Image
                                src={item.image_url || "/placeholder.svg"}
                                alt={item.name}
                                fill
                                className="object-cover group-hover:scale-110 transition-transform duration-700"
                              />
                              {item.is_popular && (
                                <div className="absolute top-3 left-3 bg-gradient-to-r from-yellow-400 to-orange-400 dark:from-yellow-500 dark:to-orange-500 text-black dark:text-white px-3 py-1 rounded-full text-xs font-bold backdrop-blur-sm flex items-center gap-1">
                                  <Star className="h-3 w-3 fill-black dark:fill-white" />
                                  Popular
                                </div>
                              )}
                              <div className="absolute top-3 right-3 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm text-black dark:text-white px-2 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                                <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                                4.8
                              </div>

                              {/* Interactive Size Selection Overlay for items with sizes */}
                              {itemSizes.length > 0 && (
                                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                                  <div className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm rounded-2xl p-4 transform scale-90 group-hover:scale-100 transition-transform duration-300">
                                    <p className="text-center text-sm font-semibold text-gray-800 dark:text-gray-200 mb-3">
                                      Select Size
                                    </p>
                                    <div className="flex gap-2">
                                      {itemSizes.map((size) => (
                                        <button
                                          key={size}
                                          onClick={() => handleSizeSelect(itemKey, size)}
                                          className={`w-12 h-12 rounded-full font-bold text-sm transition-all duration-200 ${
                                            selectedSize === size
                                              ? "bg-black dark:bg-gray-800 text-white scale-110 shadow-lg"
                                              : "bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-500"
                                          }`}
                                        >
                                          {size}
                                        </button>
                                      ))}
                                    </div>
                                  </div>
                                </div>
                              )}

                              {/* Interactive Custom Options Overlay for items with options */}
                              {getItemOptions(item).length > 0 && (
                                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                                  <div className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm rounded-2xl p-4 transform scale-90 group-hover:scale-100 transition-transform duration-300 max-w-xs">
                                    <p className="text-center text-sm font-semibold text-gray-800 dark:text-gray-200 mb-3">
                                      Custom Options
                                    </p>
                                    <div className="space-y-2">
                                      {getItemOptions(item).map((option) => (
                                        <button
                                          key={option.id}
                                          onClick={() => handleOptionToggle(itemKey, option.option_name)}
                                          className={`w-full p-2 rounded-lg text-sm transition-all duration-200 flex items-center justify-between ${
                                            itemSelectedOptions.includes(option.option_name)
                                              ? "bg-black dark:bg-gray-800 text-white"
                                              : "bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-500"
                                          }`}
                                        >
                                          <span>{option.option_name}</span>
                                          {itemSelectedOptions.includes(option.option_name) && (
                                            <Check className="h-4 w-4" />
                                          )}
                                          {option.price_adjustment > 0 && (
                                            <span className="text-xs">+NLe {option.price_adjustment}</span>
                                          )}
                                        </button>
                                      ))}
                                    </div>
                                  </div>
                                </div>
                              )}
                            </div>
                            <CardContent className="p-3 sm:p-4 lg:p-6">
                              <h3 className="font-bold text-sm sm:text-base lg:text-xl mb-2 text-black dark:text-white line-clamp-1">
                                {item.name}
                              </h3>
                              {item.description && (
                                <p className="text-gray-600 dark:text-gray-400 text-xs sm:text-sm mb-3 line-clamp-2 leading-relaxed">
                                  {item.description}
                                </p>
                              )}
                              <div className="flex items-center justify-between mb-3 sm:mb-4">
                                <span className="text-lg sm:text-xl lg:text-2xl font-bold text-red-600 dark:text-red-500">
                                  NLe {price}
                                </span>
                                <div className="flex flex-wrap gap-1 sm:gap-2">
                                  {itemSizes.length > 0 && (
                                    <span className="text-xs text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded-full">
                                      Size: {selectedSize}
                                    </span>
                                  )}
                                  {itemSelectedOptions.length > 0 && (
                                    <span className="text-xs text-gray-500 dark:text-gray-400 bg-blue-100 dark:bg-blue-900 px-2 py-1 rounded-full">
                                      {itemSelectedOptions.length} option{itemSelectedOptions.length > 1 ? 's' : ''}
                                    </span>
                                  )}
                                </div>
                              </div>

                              {/* Show selected custom options */}
                              {itemSelectedOptions.length > 0 && (
                                <div className="mb-4">
                                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Selected Options:</p>
                                  <div className="flex flex-wrap gap-2">
                                    {itemSelectedOptions.map((optionName) => {
                                      const option = getItemOptions(item).find(opt => opt.option_name === optionName)
                                      return (
                                        <div key={optionName} className="text-xs bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-2 py-1 rounded-full flex items-center gap-1">
                                          <Check className="h-3 w-3" />
                                          {optionName}
                                          {option && option.price_adjustment > 0 && (
                                            <span className="text-blue-600 dark:text-blue-400">(+NLe {option.price_adjustment})</span>
                                          )}
                                        </div>
                                      )
                                    })}
                                  </div>
                                </div>
                              )}

                              <div className="flex items-center justify-between mb-3 sm:mb-4">
                                <span className="text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300">Qty:</span>
                                <div className="flex items-center gap-1 sm:gap-2">
                                  <button
                                    onClick={() => handleQuantityChange(itemKey, -1)}
                                    className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-gray-200 dark:bg-gray-600 flex items-center justify-center hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors"
                                  >
                                    <Minus className="h-3 w-3 sm:h-4 sm:w-4 text-gray-700 dark:text-gray-300" />
                                  </button>
                                  <span className="font-bold text-base sm:text-lg w-6 sm:w-8 text-center text-gray-900 dark:text-gray-100">
                                    {quantity}
                                  </span>
                                  <button
                                    onClick={() => handleQuantityChange(itemKey, 1)}
                                    className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-gray-200 dark:bg-gray-600 flex items-center justify-center hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors"
                                  >
                                    <Plus className="h-3 w-3 sm:h-4 sm:w-4 text-gray-700 dark:text-gray-300" />
                                  </button>
                                </div>
                              </div>

                              <Button
                                onClick={() => {
                                  for (let i = 0; i < quantity; i++) {
                                    // Build the item name with size and options
                                    let itemName = item.name
                                    if (itemSizes.length > 0) {
                                      itemName += ` (${selectedSize})`
                                    }
                                    if (itemSelectedOptions.length > 0) {
                                      itemName += ` - ${itemSelectedOptions.join(', ')}`
                                    }

                                    addItem({
                                      id: `${itemKey}-${Date.now()}-${i}`,
                                      name: itemName,
                                      price: price,
                                      type: item.category?.slug || "menu-item",
                                      size: itemSizes.length > 0 ? selectedSize : undefined,
                                      options: itemSelectedOptions.length > 0 ? itemSelectedOptions : undefined,
                                    })
                                  }
                                }}
                                className="w-full bg-black hover:bg-gray-800 dark:bg-gray-800 dark:hover:bg-gray-700 text-white rounded-xl sm:rounded-2xl py-2 sm:py-3 transition-all duration-300 font-semibold text-sm sm:text-base"
                              >
                                <ShoppingCart className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                                Add - NLe {price * quantity}
                              </Button>
                            </CardContent>
                          </Card>
                        </motion.div>
                      )
                    })}
                  </motion.div>
                </TabsContent>
              )
            })}
          </Tabs>
        </div>
      </div>
    </>
  )
}
