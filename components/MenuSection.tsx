"use client"

import { useState, useEffect } from "react"
import { Tabs, TabsContent } from "@/components/ui/tabs"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { ShoppingCart, Star, Plus, Minus, Check } from "lucide-react"
import { useCart } from "@/contexts/CartContext"
import { motion } from "framer-motion"
import { MenuService, type MenuItemWithCategory, type Category } from "@/lib/menu-service"

export default function MenuSection() {
  const { addItem } = useCart()
  const [activeTab, setActiveTab] = useState("pizza")
  const [selectedSizes, setSelectedSizes] = useState<{ [key: string]: string }>({})
  const [selectedOptions, setSelectedOptions] = useState<{ [key: string]: string[] }>({})
  const [quantities, setQuantities] = useState<{ [key: string]: number }>({})
  const [menuItems, setMenuItems] = useState<MenuItemWithCategory[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [isLoading, setIsLoading] = useState(true)

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
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
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
      <section className="py-16 lg:py-24 bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black dark:border-white mx-auto"></div>
            <p className="mt-4 text-gray-600 dark:text-gray-400">Loading menu...</p>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section
      id="menu"
      className="py-16 lg:py-24 bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 transition-colors duration-300"
    >
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12 lg:mb-16"
        >
          <h2 className="text-3xl sm:text-4xl lg:text-6xl font-bold mb-4 lg:mb-6 text-black dark:text-white">
            🍽️ FOOD MENU 🍽️
          </h2>
          <div className="w-16 lg:w-24 h-1 bg-red-600 dark:bg-red-500 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400 text-base lg:text-lg max-w-2xl mx-auto">
            ✨ Discover our delicious homestyle cooking with authentic flavors ✨
          </p>
        </motion.div>

        <Tabs defaultValue={activeTab} value={activeTab} onValueChange={setActiveTab} className="w-full">
          <div className="flex flex-wrap justify-center gap-3 mb-8 lg:mb-12 px-4">
            {categories.map((category) => (
              <Button
                key={category.id}
                className={`text-base lg:text-lg px-6 lg:px-8 py-3 lg:py-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 ${
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

          {categories.map((category) => {
            const categoryItems = menuItems.filter((item) => item.category?.slug === category.slug)
            
            return (
              <TabsContent key={category.id} value={category.slug}>
                <motion.div
                  variants={container}
                  initial="hidden"
                  whileInView="show"
                  viewport={{ once: true }}
                  className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8"
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
                         variants={itemVariant}
                         className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl overflow-hidden group hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 border dark:border-gray-700"
                       >
                        <div className="relative h-64 overflow-hidden">
                          <Image
                            src={item.image_url || "/placeholder.svg"}
                            alt={item.name}
                            fill
                            className="object-cover group-hover:scale-110 transition-transform duration-700"
                          />
                          {item.is_popular && (
                            <div className="absolute top-4 left-4 bg-yellow-400 dark:bg-yellow-500 text-black dark:text-white px-3 py-1 rounded-full text-sm font-bold flex items-center gap-1">
                              <Star className="h-3 w-3 fill-black dark:fill-white" />
                              Popular
                            </div>
                          )}

                          {/* Interactive Size Selection Overlay for items with sizes */}
                          {itemSizes.length > 0 && (
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
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
                                          ? "bg-black dark:bg-gray-800 text-white scale-110"
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
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
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

                        <div className="p-6">
                          <h3 className="text-xl font-bold text-black dark:text-white mb-2">{item.name}</h3>
                          {item.description && (
                            <p className="text-gray-600 dark:text-gray-400 mb-4">{item.description}</p>
                          )}
                          <div className="flex items-center justify-between mb-4">
                            <div className="text-2xl font-bold text-red-600 dark:text-red-500">NLe {price}</div>
                            <div className="flex flex-wrap gap-2">
                              {itemSizes.length > 0 && (
                                <div className="text-sm text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 px-3 py-1 rounded-full">
                                  Size: {selectedSize}
                                </div>
                              )}
                              {itemSelectedOptions.length > 0 && (
                                <div className="text-sm text-gray-500 dark:text-gray-400 bg-blue-100 dark:bg-blue-900 px-3 py-1 rounded-full">
                                  {itemSelectedOptions.length} option{itemSelectedOptions.length > 1 ? 's' : ''}
                                </div>
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

                          <div className="flex items-center justify-between mb-4">
                            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Quantity:</span>
                            <div className="flex items-center gap-3">
                              <button
                                onClick={() => handleQuantityChange(itemKey, -1)}
                                className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-600 flex items-center justify-center hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors"
                              >
                                <Minus className="h-4 w-4 text-gray-700 dark:text-gray-300" />
                              </button>
                              <span className="font-bold text-lg w-8 text-center text-gray-900 dark:text-gray-100">
                                {quantity}
                              </span>
                              <button
                                onClick={() => handleQuantityChange(itemKey, 1)}
                                className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-600 flex items-center justify-center hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors"
                              >
                                <Plus className="h-4 w-4 text-gray-700 dark:text-gray-300" />
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
                            className="w-full bg-black hover:bg-gray-800 dark:bg-gray-800 dark:hover:bg-gray-700 text-white rounded-2xl py-3 transition-all duration-300 font-semibold"
                          >
                            <ShoppingCart className="h-5 w-5 mr-2" />
                            Add to Cart - NLe {price * quantity}
                          </Button>
                        </div>
                      </motion.div>
                    )
                  })}
                </motion.div>
              </TabsContent>
            )
          })}
        </Tabs>
      </div>
    </section>
  )
}
