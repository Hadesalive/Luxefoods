"use client"

import { useState, useEffect, useMemo, memo } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Plus, Minus } from "lucide-react"
import { useCart } from "@/contexts/CartContext"
import { motion, AnimatePresence } from "framer-motion"
import { MenuService, type MenuItemWithCategory } from "@/lib/menu-service"
import { cn } from "@/lib/utils"

// Helper function to optimize Cloudinary image URLs
const optimizeImageUrl = (url: string | null | undefined, width = 600, quality = 75): string => {
  if (!url) return "/placeholder.jpg"
  if (url.includes('res.cloudinary.com')) {
    const parts = url.split('/upload/')
    if (parts.length === 2) {
      return `${parts[0]}/upload/w_${width},q_${quality},f_auto,c_fill,g_auto,dpr_auto/${parts[1]}`
    }
  }
  return url
}

// Minimalist Pill for Sizes/Options with Orange Theme
const SelectionPill = ({ 
  label, 
  price, 
  isSelected, 
  onClick 
}: { 
  label: string
  price?: number
  isSelected: boolean
  onClick: () => void
}) => (
  <button
    onClick={onClick}
    className={cn(
      "px-3 py-1.5 text-xs font-medium rounded-full transition-all duration-200 border",
      isSelected
        ? "bg-orange-600 text-white border-orange-600 shadow-sm hover:bg-orange-700"
        : "bg-gray-800 text-gray-300 border-gray-700 hover:border-orange-600 hover:text-orange-400"
    )}
  >
    {label}
    {price && price > 0 && <span className="ml-1 opacity-80">+NLe{price.toFixed(2)}</span>}
  </button>
)

// Menu Item Card - Adapted from OrderPageClient
const MenuItemCard = memo(({ 
  item, 
  selectedSize, 
  selectedOptionsList, 
  quantity, 
  isAdded,
  onSizeSelect,
  onOptionToggle,
  onQuantityChange,
  onAddToCart,
}: {
  item: MenuItemWithCategory
  selectedSize?: string
  selectedOptionsList: string[]
  quantity: number
  isAdded: boolean
  onSizeSelect: (size: string) => void
  onOptionToggle: (option: string) => void
  onQuantityChange: (change: number) => void
  onAddToCart: () => void
}) => {
  // Calculate price dynamically
  const basePrice = useMemo(() => {
    let price = item.price
    if (selectedSize && item.sizes) {
      const size = item.sizes.find(s => s.size_name === selectedSize)
      if (size) price = size.price
    }
    return price
  }, [item, selectedSize])

  const optionsPrice = useMemo(() => {
    let price = 0
    if (selectedOptionsList.length > 0 && item.options) {
      selectedOptionsList.forEach(optName => {
        const opt = item.options?.find(o => o.option_name === optName)
        if (opt) price += (opt.price_adjustment || 0)
      })
    }
    return price
  }, [item, selectedOptionsList])

  const totalPrice = (basePrice + optionsPrice) * quantity

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ y: -4 }}
      className="group menu-item-card"
    >
      <div className="bg-gray-800 rounded-3xl p-4 transition-all duration-300 hover:shadow-xl hover:border-orange-500/50 border border-gray-700 h-full flex flex-col relative overflow-hidden will-change-transform">
        
        {/* Success overlay */}
        <AnimatePresence>
          {isAdded && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="absolute inset-0 bg-green-600/90 flex items-center justify-center z-20 rounded-3xl"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.1, type: "spring" }}
                className="text-white text-center"
              >
                <p className="font-bold text-lg">Added to Cart!</p>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
        
        {/* Image Area */}
        <div className="relative aspect-[4/3] rounded-2xl overflow-hidden mb-4 bg-gray-800">
          <Image
            src={optimizeImageUrl(item.image_url, 600)}
            alt={item.name}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
            placeholder="blur"
            blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAb/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWEREiMxUf/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="
          />
          {item.is_popular && (
            <span className="absolute top-3 left-3 bg-orange-500 text-white backdrop-blur-sm text-xs font-semibold px-2.5 py-1 rounded-full shadow-lg">
              ⭐ Popular
            </span>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 flex flex-col">
          <div className="mb-2">
            <h3 className="font-bold text-white text-lg leading-tight mb-1">
              {item.name}
            </h3>
            <p className="text-gray-300 text-sm line-clamp-2 leading-relaxed">
              {item.description || "Freshly prepared with premium ingredients."}
            </p>
          </div>

          {/* Configuration Area */}
          <div className="space-y-3 mb-4 flex-1">
            {/* Sizes */}
            {item.sizes && item.sizes.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {item.sizes.map((size) => (
                  <SelectionPill
                    key={size.size_name}
                    label={size.size_name}
                    price={size.price !== item.price ? size.price : undefined}
                    isSelected={selectedSize === size.size_name}
                    onClick={() => onSizeSelect(size.size_name)}
                  />
                ))}
              </div>
            )}

            {/* Options */}
            {item.options && item.options.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {item.options.map((opt) => (
                  <SelectionPill
                    key={opt.option_name}
                    label={opt.option_name}
                    price={opt.price_adjustment}
                    isSelected={selectedOptionsList.includes(opt.option_name)}
                    onClick={() => onOptionToggle(opt.option_name)}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Action Area */}
          <div className="mt-auto pt-4 border-t border-gray-700 flex items-center justify-between gap-4">
            <div className="flex flex-col">
              <span className="text-xs text-gray-300 font-medium uppercase tracking-wider">Total</span>
              <span className="text-xl font-bold text-orange-400">
                NLe{totalPrice.toFixed(2)}
              </span>
            </div>

            <div className="flex items-center gap-2">
              {/* Quantity Controls - Smaller */}
              <div className="flex items-center bg-gray-900/50 rounded-lg p-0.5 border border-gray-700 hover:border-orange-500/50 transition-colors">
                <button 
                  onClick={() => onQuantityChange(-1)}
                  className="w-6 h-6 flex items-center justify-center rounded-md hover:bg-orange-600/20 transition-colors text-orange-400 hover:text-orange-300"
                >
                  <Minus className="w-3 h-3" />
                </button>
                <span className="w-5 text-center text-xs font-semibold text-orange-400">{quantity}</span>
                <button 
                  onClick={() => onQuantityChange(1)}
                  className="w-6 h-6 flex items-center justify-center rounded-md hover:bg-orange-600/20 transition-colors text-orange-400 hover:text-orange-300"
                >
                  <Plus className="w-3 h-3" />
                </button>
              </div>

              {/* Add Button - Smaller */}
              <Button
                onClick={onAddToCart}
                disabled={isAdded}
                className={cn(
                  "rounded-lg px-4 h-8 text-xs transition-all duration-300 shadow-sm hover:shadow-md hover:shadow-orange-600/20 font-medium",
                  isAdded 
                    ? "bg-green-600 hover:bg-green-700 text-white" 
                    : "bg-orange-600 hover:bg-orange-700 text-white"
                )}
              >
                {isAdded ? "✓ Added" : "Add"}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )
})

MenuItemCard.displayName = "MenuItemCard"

export default function MenuSection() {
  const { addItem } = useCart()
  const [selectedSizes, setSelectedSizes] = useState<{ [key: string]: string }>({})
  const [selectedOptions, setSelectedOptions] = useState<{ [key: string]: string[] }>({})
  const [quantities, setQuantities] = useState<{ [key: string]: number }>({})
  const [menuItems, setMenuItems] = useState<MenuItemWithCategory[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [addedItems, setAddedItems] = useState<{ [key: string]: boolean }>({})

  const loadMenuData = async () => {
    try {
      setIsLoading(true)
      setError(null)
      
      // Only fetch popular items for the homepage menu section
      const menuData = await MenuService.getPopularMenuItems(3) // Limit to 3 popular items
      
      setMenuItems(menuData)
    } catch (error) {
      console.error("Error loading menu data:", error)
      setError("Failed to load menu. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadMenuData()
  }, [])

  const handleSizeSelect = (itemId: string, size: string) => {
    setSelectedSizes((prev) => ({ ...prev, [itemId]: size }))
  }

  const handleOptionToggle = (itemId: string, optionName: string) => {
    setSelectedOptions((prev) => {
      const currentOptions = prev[itemId] || []
      const newOptions = currentOptions.includes(optionName)
        ? currentOptions.filter(opt => opt !== optionName)
        : [...currentOptions, optionName]
      return { ...prev, [itemId]: newOptions }
    })
  }

  const handleQuantityChange = (itemId: string, change: number) => {
    setQuantities((prev) => ({
      ...prev,
      [itemId]: Math.max(1, (prev[itemId] || 1) + change),
    }))
  }

  const getItemPrice = (item: MenuItemWithCategory, selectedSize?: string, selectedOptions?: string[]) => {
    let basePrice = item.price

    // Apply size price adjustment
    if (selectedSize && item.sizes) {
      const size = item.sizes.find(s => s.size_name === selectedSize)
      if (size) {
        basePrice = size.price
      }
    }

    // If custom options are selected, use only the custom option price (not base + custom)
    if (selectedOptions && selectedOptions.length > 0 && item.options) {
      let customPrice = 0
      selectedOptions.forEach(optionName => {
        const option = item.options?.find(opt => opt.option_name === optionName)
        if (option) {
          customPrice += option.price_adjustment || 0
        }
      })
      // Use the custom price instead of base price
      return customPrice
    }

    return basePrice
  }

  const handleAddToCart = (item: MenuItemWithCategory) => {
    const itemId = item.id
    const selectedSize = selectedSizes[itemId]
    const selectedOptionsList = selectedOptions[itemId] || []
    const quantity = quantities[itemId] || 1

    // Get price per item
    const pricePerItem = getItemPrice(item, selectedSize, selectedOptionsList)

    // Add to cart with correct quantity and price
    addItem({
      id: item.id,
      name: item.name,
      price: pricePerItem,
      type: item.category?.slug || "menu-item",
      size: selectedSize,
      options: selectedOptionsList,
      quantity: quantity
    })

    // Show success feedback
    setAddedItems((prev) => ({ ...prev, [itemId]: true }))
    setTimeout(() => {
      setAddedItems((prev) => ({ ...prev, [itemId]: false }))
    }, 2000)
  }

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  if (isLoading) {
    return (
      <section className="py-16 bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto mb-4"></div>
            <p className="text-gray-400">Loading popular items...</p>
          </div>
        </div>
      </section>
    )
  }

  if (error) {
    return (
      <section className="py-16 bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <p className="text-red-400 mb-4">{error}</p>
            <Button onClick={() => window.location.reload()}>
              Try Again
            </Button>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="py-16 bg-gray-900 border-t border-gray-800">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl lg:text-5xl font-bold text-white mb-4">
            Popular Items
          </h2>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto mb-6">
            Our most loved dishes - fresh from our kitchen to your table
          </p>
          
          {/* View Full Menu Button */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.3 }}
            viewport={{ once: true }}
            className="flex justify-center"
          >
            <Button
              asChild
              size="sm"
              className="bg-orange-600 hover:bg-orange-700 text-white transition-all duration-200"
            >
              <a href="/order">
                🍽️ View Full Menu
              </a>
            </Button>
          </motion.div>
        </motion.div>

        {/* Popular Items Grid */}
        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {menuItems.map((item) => {
            const itemId = item.id
            const quantity = quantities[itemId] || 1
            const isAdded = addedItems[itemId]

            return (
              <MenuItemCard
                key={item.id}
                item={item}
                selectedSize={selectedSizes[itemId]}
                selectedOptionsList={selectedOptions[itemId] || []}
                quantity={quantity}
                isAdded={isAdded}
                onSizeSelect={(size) => handleSizeSelect(itemId, size)}
                onOptionToggle={(option) => handleOptionToggle(itemId, option)}
                onQuantityChange={(change) => handleQuantityChange(itemId, change)}
                onAddToCart={() => handleAddToCart(item)}
              />
            )
          })}
        </motion.div>

        {/* Empty State */}
        {menuItems.length === 0 && !isLoading && (
          <div className="text-center py-12">
            <div className="text-gray-600 text-6xl mb-4">🍽️</div>
            <h3 className="text-xl font-semibold text-white mb-2">
              No popular items available
            </h3>
            <p className="text-gray-400">
              Check back later for our most loved dishes!
            </p>
          </div>
        )}
      </div>
    </section>
  )
}
