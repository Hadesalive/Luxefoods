"use client"

import { useState, useEffect, useMemo, memo } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Plus, Minus, Check, ArrowRight } from "lucide-react"
import { useCart } from "@/contexts/CartContext"
import { motion, AnimatePresence } from "framer-motion"
import { MenuService, type MenuItemWithCategory } from "@/lib/menu-service"
import { cn } from "@/lib/utils"

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

const SkeletonCard = () => (
  <div className="bg-white rounded-2xl border border-stone-100 shadow-sm overflow-hidden animate-pulse">
    <div className="aspect-[4/3] bg-stone-100" />
    <div className="p-5">
      <div className="flex justify-between items-start gap-3 mb-3">
        <div className="h-5 bg-stone-100 rounded w-2/3" />
        <div className="h-4 bg-stone-100 rounded w-12" />
      </div>
      <div className="h-3.5 bg-stone-100 rounded w-full mb-1.5" />
      <div className="h-3.5 bg-stone-100 rounded w-4/5 mb-6" />
      <div className="border-t border-stone-100 pt-4 flex items-center justify-between">
        <div className="h-6 bg-stone-100 rounded w-16" />
        <div className="h-8 bg-stone-100 rounded w-16" />
      </div>
    </div>
  </div>
)

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
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
    >
      <div className="bg-white rounded-2xl border border-stone-100 shadow-sm h-full flex flex-col relative overflow-hidden">

        {/* Added to cart overlay */}
        <AnimatePresence>
          {isAdded && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              className="absolute inset-0 bg-white/95 flex items-center justify-center z-20"
            >
              <div className="text-center">
                <div className="w-11 h-11 rounded-full bg-green-50 border border-green-100 flex items-center justify-center mx-auto mb-2">
                  <Check className="w-5 h-5 text-green-600" />
                </div>
                <p className="text-sm font-semibold text-stone-800">Added to cart</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Image — flush to top, no inner rounding */}
        <div className="relative aspect-[4/3] bg-stone-100 overflow-hidden">
          <Image
            src={optimizeImageUrl(item.image_url, 600)}
            alt={item.name}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover"
            loading="lazy"
            placeholder="blur"
            blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAb/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWEREiMxUf/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="
          />
          {item.is_popular && (
            <span className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm text-stone-700 text-[10px] font-semibold px-2 py-0.5 rounded-full tracking-wide uppercase">
              Popular
            </span>
          )}
        </div>

        {/* Content */}
        <div className="p-5 flex flex-col flex-1">

          {/* Name + base price on same row */}
          <div className="flex items-start justify-between gap-3 mb-2">
            <h3 className="font-semibold text-stone-900 text-base leading-snug">
              {item.name}
            </h3>
            <span className="text-stone-400 text-sm font-medium shrink-0 mt-px">
              NLe {basePrice.toFixed(0)}
            </span>
          </div>

          {/* Description */}
          <p className="text-stone-400 text-sm line-clamp-2 leading-relaxed mb-4">
            {item.description || "Freshly prepared with quality ingredients."}
          </p>

          {/* Sizes */}
          {item.sizes && item.sizes.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mb-2">
              {item.sizes.map((size) => (
                <button
                  key={size.size_name}
                  onClick={() => onSizeSelect(size.size_name)}
                  className={cn(
                    "px-2.5 py-1 text-xs font-medium rounded-md border transition-colors",
                    selectedSize === size.size_name
                      ? "bg-stone-900 text-white border-stone-900"
                      : "text-stone-500 border-stone-200 hover:border-stone-400 hover:text-stone-700"
                  )}
                >
                  {size.size_name}
                  {size.price !== item.price && (
                    <span className="ml-1 opacity-60">+{size.price - item.price}</span>
                  )}
                </button>
              ))}
            </div>
          )}

          {/* Options */}
          {item.options && item.options.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mb-4">
              {item.options.map((opt) => (
                <button
                  key={opt.option_name}
                  onClick={() => onOptionToggle(opt.option_name)}
                  className={cn(
                    "px-2.5 py-1 text-xs font-medium rounded-md border transition-colors",
                    selectedOptionsList.includes(opt.option_name)
                      ? "bg-stone-900 text-white border-stone-900"
                      : "text-stone-500 border-stone-200 hover:border-stone-400 hover:text-stone-700"
                  )}
                >
                  {opt.option_name}
                  {opt.price_adjustment > 0 && (
                    <span className="ml-1 opacity-60">+{opt.price_adjustment}</span>
                  )}
                </button>
              ))}
            </div>
          )}

          {/* Bottom bar */}
          <div className="mt-auto pt-4 border-t border-stone-100 flex items-center justify-between">
            <span className="text-lg font-bold text-stone-900">
              NLe {totalPrice.toFixed(0)}
            </span>

            <div className="flex items-center gap-3">
              {/* Qty controls */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => onQuantityChange(-1)}
                  className="w-7 h-7 rounded-full flex items-center justify-center text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors"
                >
                  <Minus className="w-3 h-3" />
                </button>
                <span className="w-4 text-center text-sm font-semibold text-stone-900">{quantity}</span>
                <button
                  onClick={() => onQuantityChange(1)}
                  className="w-7 h-7 rounded-full flex items-center justify-center text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors"
                >
                  <Plus className="w-3 h-3" />
                </button>
              </div>

              {/* Add button */}
              <button
                onClick={onAddToCart}
                disabled={isAdded}
                className={cn(
                  "px-4 h-8 rounded-lg text-xs font-semibold transition-colors",
                  isAdded
                    ? "bg-stone-100 text-stone-400 cursor-default"
                    : "bg-yellow-500 hover:bg-yellow-400 text-stone-900"
                )}
              >
                {isAdded ? "Added" : "Add"}
              </button>
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
      const menuData = await MenuService.getPopularMenuItems(3)
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
    if (selectedSize && item.sizes) {
      const size = item.sizes.find(s => s.size_name === selectedSize)
      if (size) basePrice = size.price
    }
    if (selectedOptions && selectedOptions.length > 0 && item.options) {
      let customPrice = 0
      selectedOptions.forEach(optionName => {
        const option = item.options?.find(opt => opt.option_name === optionName)
        if (option) customPrice += option.price_adjustment || 0
      })
      return basePrice + customPrice
    }
    return basePrice
  }

  const handleAddToCart = (item: MenuItemWithCategory) => {
    const itemId = item.id
    const selectedSize = selectedSizes[itemId]
    const selectedOptionsList = selectedOptions[itemId] || []
    const quantity = quantities[itemId] || 1
    const pricePerItem = getItemPrice(item, selectedSize, selectedOptionsList)

    addItem({
      id: item.id,
      name: item.name,
      price: pricePerItem,
      type: item.category?.slug || "menu-item",
      size: selectedSize,
      options: selectedOptionsList,
      quantity: quantity
    })

    setAddedItems((prev) => ({ ...prev, [itemId]: true }))
    setTimeout(() => {
      setAddedItems((prev) => ({ ...prev, [itemId]: false }))
    }, 2000)
  }

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  }

  if (isLoading) {
    return (
      <section className="relative py-20 lg:py-28 bg-grain" style={{ backgroundColor: "#FFFDF8" }}>
        <div className="container mx-auto px-6">
          <div className="flex items-end justify-between mb-12">
            <div>
              <div className="h-3 bg-stone-200/60 rounded w-24 mb-4 animate-pulse" />
              <div className="h-9 bg-stone-200/60 rounded w-48 animate-pulse" />
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
          </div>
        </div>
      </section>
    )
  }

  if (error) {
    return (
      <section className="relative py-20 lg:py-28" style={{ backgroundColor: "#FFFDF8" }}>
        <div className="container mx-auto px-6 relative z-10">
          <div className="text-center">
            <p className="text-red-500 mb-4">{error}</p>
            <Button onClick={() => window.location.reload()}>Try Again</Button>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="relative py-20 lg:py-28 bg-grain overflow-hidden" style={{ backgroundColor: "#FFFDF8" }}>
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="flex items-end justify-between flex-wrap gap-6 mb-12"
        >
          <div>
            <p className="text-xs font-bold tracking-[0.2em] uppercase text-yellow-700 mb-4">From Our Kitchen</p>
            <h2 className="text-3xl lg:text-5xl font-bold text-stone-800">Popular Items</h2>
          </div>
          <a
            href="/order"
            className="text-sm font-semibold text-stone-600 hover:text-yellow-700 transition-colors inline-flex items-center gap-1.5 mb-1 shrink-0"
          >
            View Full Menu
            <ArrowRight className="w-4 h-4" />
          </a>
        </motion.div>

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 relative z-10"
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

        {menuItems.length === 0 && !isLoading && (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-stone-100 rounded-full mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-stone-700 mb-2">No popular items available</h3>
            <p className="text-stone-500">Check back later for our most loved dishes!</p>
          </div>
        )}
      </div>
    </section>
  )
}
