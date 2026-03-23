"use client"

import { useState, useEffect, useMemo, useCallback, memo } from "react"
import Image from "next/image"
import { Plus, Minus, Search, X, Check } from "lucide-react"

import { MenuService, type MenuItemWithCategory, type Category } from "@/lib/menu-service"
import { useCart } from "@/contexts/CartContext"
import { motion, AnimatePresence } from "framer-motion"
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

function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value)
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay)
    return () => clearTimeout(handler)
  }, [value, delay])
  return debouncedValue
}

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
    <div className="group bg-white rounded-2xl border border-stone-100 overflow-hidden flex flex-col h-full">
      {/* Image */}
      <div className="relative aspect-[4/3] bg-stone-100 overflow-hidden">
        <Image
          src={optimizeImageUrl(item.image_url, 600)}
          alt={item.name}
          fill
          sizes="(max-width: 768px) 50vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
          placeholder="blur"
          blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAb/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWEREiMxUf/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="
        />
        {item.is_popular && (
          <span className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm text-stone-700 text-[10px] font-semibold uppercase tracking-wide px-2 py-1 rounded-md">
            Popular
          </span>
        )}
        <AnimatePresence>
          {isAdded && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-white/95 flex flex-col items-center justify-center gap-2"
            >
              <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                <Check className="w-5 h-5 text-green-600" />
              </div>
              <span className="text-sm font-medium text-stone-800">Added to cart</span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Content */}
      <div className="p-3 sm:p-4 flex flex-col flex-1">
        <div className="flex items-start justify-between gap-2 mb-1">
          <h3 className="font-semibold text-stone-900 text-sm sm:text-base leading-tight">{item.name}</h3>
          <span className="text-stone-400 text-xs sm:text-sm whitespace-nowrap flex-shrink-0">NLe {basePrice.toFixed(0)}</span>
        </div>

        <p className="text-stone-400 text-xs sm:text-sm leading-relaxed line-clamp-2 mb-3 hidden sm:block">
          {item.description || "Freshly prepared with premium ingredients."}
        </p>

        <div className="space-y-1.5 mb-3 flex-1">
          {item.sizes && item.sizes.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {item.sizes.map((size) => (
                <button
                  key={size.size_name}
                  onClick={() => onSizeSelect(size.size_name)}
                  className={cn(
                    "px-2 py-0.5 text-[10px] sm:text-xs font-medium rounded-md transition-colors",
                    selectedSize === size.size_name
                      ? "bg-stone-900 text-white"
                      : "bg-stone-100 text-stone-600 hover:bg-stone-200"
                  )}
                >
                  {size.size_name}
                  {size.price !== item.price && (
                    <span className="ml-1 opacity-60">+{(size.price - item.price).toFixed(0)}</span>
                  )}
                </button>
              ))}
            </div>
          )}

          {item.options && item.options.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {item.options.map((opt) => (
                <button
                  key={opt.option_name}
                  onClick={() => onOptionToggle(opt.option_name)}
                  className={cn(
                    "px-2 py-0.5 text-[10px] sm:text-xs font-medium rounded-md transition-colors",
                    selectedOptionsList.includes(opt.option_name)
                      ? "bg-stone-900 text-white"
                      : "bg-stone-100 text-stone-600 hover:bg-stone-200"
                  )}
                >
                  {opt.option_name}
                  {opt.price_adjustment && opt.price_adjustment > 0 && (
                    <span className="ml-1 opacity-60">+{opt.price_adjustment.toFixed(0)}</span>
                  )}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Footer: price + controls */}
        <div className="mt-auto space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-bold text-stone-900">NLe {totalPrice.toFixed(0)}</span>
            <div className="flex items-center gap-0.5">
              <button
                onClick={() => onQuantityChange(-1)}
                className="w-7 h-7 rounded-full bg-stone-100 hover:bg-stone-200 flex items-center justify-center transition-colors"
              >
                <Minus className="w-3 h-3 text-stone-600" />
              </button>
              <span className="w-6 text-center text-sm font-semibold text-stone-800">{quantity}</span>
              <button
                onClick={() => onQuantityChange(1)}
                className="w-7 h-7 rounded-full bg-stone-100 hover:bg-stone-200 flex items-center justify-center transition-colors"
              >
                <Plus className="w-3 h-3 text-stone-600" />
              </button>
            </div>
          </div>
          <button
            onClick={onAddToCart}
            disabled={isAdded}
            className={cn(
              "w-full py-2 rounded-lg text-xs font-semibold transition-colors",
              isAdded
                ? "bg-stone-100 text-stone-400 cursor-not-allowed"
                : "bg-yellow-500 hover:bg-yellow-400 text-stone-900"
            )}
          >
            {isAdded ? "Added!" : "Add to cart"}
          </button>
        </div>
      </div>
    </div>
  )
})

MenuItemCard.displayName = "MenuItemCard"

export default function OrderPageClient() {
  const { addItem } = useCart()
  const [activeTab, setActiveTab] = useState("all")
  const [selectedSizes, setSelectedSizes] = useState<{ [key: string]: string }>({})
  const [selectedOptions, setSelectedOptions] = useState<{ [key: string]: string[] }>({})
  const [quantities, setQuantities] = useState<{ [key: string]: number }>({})
  const [menuItems, setMenuItems] = useState<MenuItemWithCategory[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [addedItems, setAddedItems] = useState<{ [key: string]: boolean }>({})
  const [searchQuery, setSearchQuery] = useState("")

  const debouncedSearchQuery = useDebounce(searchQuery, 300)

  const loadMenuData = useCallback(async (bypassCache = false) => {
    try {
      setIsLoading(true)
      const [menuData, categoriesData] = await Promise.all([
        MenuService.getMenuItems(bypassCache),
        MenuService.getCategories(bypassCache),
      ])
      if ('requestIdleCallback' in window) {
        requestIdleCallback(() => {
          setMenuItems(menuData)
          setCategories(categoriesData)
          setIsLoading(false)
        })
      } else {
        setMenuItems(menuData)
        setCategories(categoriesData)
        setIsLoading(false)
      }
    } catch (err) {
      console.error("Error loading menu:", err)
      setError("Unable to load menu. Please refresh.")
      setIsLoading(false)
    }
  }, [])

  useEffect(() => { loadMenuData(false) }, [loadMenuData])

  const filteredItems = useMemo(() => {
    let results = menuItems
    if (activeTab !== "all") {
      results = results.filter(item => item.category?.slug === activeTab)
    }
    if (debouncedSearchQuery.trim()) {
      const q = debouncedSearchQuery.toLowerCase()
      results = results.filter(item =>
        item.name.toLowerCase().includes(q) ||
        item.description?.toLowerCase().includes(q) ||
        item.category?.name.toLowerCase().includes(q)
      )
    }
    return results
  }, [menuItems, activeTab, debouncedSearchQuery])

  const handleSizeSelect = useCallback((key: string, size: string) => {
    setSelectedSizes(p => ({ ...p, [key]: size }))
  }, [])

  const handleOptionToggle = useCallback((key: string, opt: string) => {
    setSelectedOptions(p => {
      const curr = p[key] || []
      return { ...p, [key]: curr.includes(opt) ? curr.filter(o => o !== opt) : [...curr, opt] }
    })
  }, [])

  const handleQuantityChange = useCallback((key: string, delta: number) => {
    setQuantities(p => ({ ...p, [key]: Math.max(1, (p[key] || 1) + delta) }))
  }, [])

  const handleAddToCart = useCallback((item: MenuItemWithCategory) => {
    const size = selectedSizes[item.id]
    const opts = selectedOptions[item.id] || []
    const qty = quantities[item.id] || 1

    let price = item.price
    if (size && item.sizes) {
      const s = item.sizes.find(sz => sz.size_name === size)
      if (s) price = s.price
    }

    let optPrice = 0
    if (item.options) {
      opts.forEach(optName => {
        const o = item.options?.find(opt => opt.option_name === optName)
        if (o) optPrice += (o.price_adjustment || 0)
      })
    }

    addItem({
      id: item.id,
      name: item.name,
      price: price + optPrice,
      type: item.category?.slug || "item",
      size,
      options: opts,
      quantity: qty
    })

    setAddedItems(p => ({ ...p, [item.id]: true }))
    setTimeout(() => setAddedItems(p => ({ ...p, [item.id]: false })), 2000)
  }, [selectedSizes, selectedOptions, quantities, addItem])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-stone-50">
        <section className="pt-16 lg:pt-20" style={{ backgroundColor: "#1C1917" }}>
          <div className="container mx-auto px-4 sm:px-6 pt-8 pb-8 lg:pt-12 lg:pb-10">
            <div className="h-3 w-20 bg-white/10 rounded mb-4 animate-pulse" />
            <div className="h-10 w-48 bg-white/10 rounded animate-pulse" />
          </div>
        </section>
        <main className="container mx-auto px-4 lg:px-8 py-10">
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-5">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-white rounded-2xl border border-stone-100 overflow-hidden animate-pulse">
                <div className="aspect-[4/3] bg-stone-100" />
                <div className="p-3 sm:p-4 space-y-3">
                  <div className="flex justify-between">
                    <div className="h-4 bg-stone-100 rounded w-2/3" />
                    <div className="h-4 bg-stone-100 rounded w-1/5" />
                  </div>
                  <div className="h-3 bg-stone-100 rounded w-full hidden sm:block" />
                  <div className="flex justify-between items-center pt-1">
                    <div className="h-5 bg-stone-100 rounded w-1/4" />
                    <div className="h-7 bg-stone-100 rounded w-1/3" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: "#FFFDF8" }}>
        <div className="text-center p-8">
          <h2 className="text-xl font-bold mb-2 text-stone-800">Something went wrong</h2>
          <p className="text-stone-500 mb-6 text-sm">{error}</p>
          <button
            onClick={() => loadMenuData(true)}
            className="px-5 py-2.5 bg-stone-900 hover:bg-stone-800 text-white text-sm font-semibold rounded-lg transition-colors"
          >
            Try again
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen font-sans" style={{ backgroundColor: "#FFFDF8" }}>

      {/* Page header */}
      <section className="pt-16 lg:pt-20" style={{ backgroundColor: "#1C1917" }}>
        <div className="container mx-auto px-4 sm:px-6 pt-8 pb-8 lg:pt-12 lg:pb-12">
          <p className="text-xs font-bold tracking-[0.2em] uppercase text-yellow-500 mb-3">
            Order Online
          </p>
          <div className="flex items-end justify-between gap-6 mb-6">
            <h1 className="text-4xl lg:text-6xl font-bold text-white leading-[0.92]">
              Our Menu
            </h1>
            <p className="text-stone-400 text-sm lg:text-base hidden sm:block mb-1">
              Made fresh, delivered fast.
            </p>
          </div>
          {/* Inline search */}
          <div className="flex items-center gap-3 px-4 py-3 bg-white/8 border border-white/10 rounded-xl w-full sm:max-w-md">
            <Search className="w-4 h-4 text-stone-400 flex-shrink-0" />
            <input
              className="flex-1 bg-transparent border-none outline-none text-sm placeholder:text-stone-500 text-white"
              placeholder="Search the menu..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="w-5 h-5 flex items-center justify-center rounded-full hover:bg-white/10 transition-colors"
              >
                <X className="w-3 h-3 text-stone-400" />
              </button>
            )}
          </div>
        </div>
      </section>

      {/* Mobile sticky category bar */}
      <div className="lg:hidden sticky top-16 z-30 bg-white border-b border-stone-100 shadow-sm">
        <div className="overflow-x-auto px-4 py-3 flex gap-2 scrollbar-hide">
          <button
            onClick={() => setActiveTab("all")}
            className={cn(
              "flex-none px-4 py-1.5 rounded-lg text-sm font-medium transition-colors whitespace-nowrap",
              activeTab === "all"
                ? "bg-stone-900 text-white"
                : "bg-stone-100 text-stone-600 hover:bg-stone-200"
            )}
          >
            All
          </button>
          {categories.map((cat) => (
            <button
              key={cat.slug}
              onClick={() => setActiveTab(cat.slug)}
              className={cn(
                "flex-none px-4 py-1.5 rounded-lg text-sm font-medium transition-colors whitespace-nowrap",
                activeTab === cat.slug
                  ? "bg-stone-900 text-white"
                  : "bg-stone-100 text-stone-600 hover:bg-stone-200"
              )}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      <main className="container mx-auto px-4 lg:px-8 py-8 lg:py-12">
        <div className="flex flex-col lg:flex-row gap-10">

          {/* Desktop sidebar */}
          <aside className="hidden lg:block w-48 flex-shrink-0">
            <div className="sticky top-24">
              <p className="text-xs font-semibold tracking-widest uppercase text-stone-400 mb-3 px-2">
                Categories
              </p>
              <nav className="space-y-0.5">
                <button
                  onClick={() => setActiveTab("all")}
                  className={cn(
                    "w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm transition-colors text-left",
                    activeTab === "all"
                      ? "bg-stone-900 text-white font-semibold"
                      : "text-stone-600 hover:bg-stone-100 hover:text-stone-900"
                  )}
                >
                  <span>All Items</span>
                  <span className={cn("text-xs", activeTab === "all" ? "text-white/50" : "text-stone-400")}>
                    {menuItems.length}
                  </span>
                </button>
                {categories.map((cat) => (
                  <button
                    key={cat.slug}
                    onClick={() => setActiveTab(cat.slug)}
                    className={cn(
                      "w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm transition-colors text-left",
                      activeTab === cat.slug
                        ? "bg-stone-900 text-white font-semibold"
                        : "text-stone-600 hover:bg-stone-100 hover:text-stone-900"
                    )}
                  >
                    <span>{cat.name}</span>
                    <span className={cn("text-xs", activeTab === cat.slug ? "text-white/50" : "text-stone-400")}>
                      {menuItems.filter(item => item.category?.slug === cat.slug).length}
                    </span>
                  </button>
                ))}
              </nav>
            </div>
          </aside>

          {/* Main grid */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-5 lg:mb-6">
              <div>
                <h2 className="text-lg font-bold tracking-tight text-stone-900">
                  {activeTab === "all" ? "All Items" : categories.find(c => c.slug === activeTab)?.name || "Menu"}
                </h2>
                <p className="text-xs text-stone-400 mt-0.5">
                  {filteredItems.length} {filteredItems.length === 1 ? "item" : "items"}
                </p>
              </div>
            </div>

            {filteredItems.length > 0 ? (
              <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 lg:gap-5">
                {filteredItems.map((item) => (
                  <MenuItemCard
                    key={item.id}
                    item={item}
                    selectedSize={selectedSizes[item.id]}
                    selectedOptionsList={selectedOptions[item.id] || []}
                    quantity={quantities[item.id] || 1}
                    isAdded={addedItems[item.id] || false}
                    onSizeSelect={(s) => handleSizeSelect(item.id, s)}
                    onOptionToggle={(o) => handleOptionToggle(item.id, o)}
                    onQuantityChange={(q) => handleQuantityChange(item.id, q)}
                    onAddToCart={() => handleAddToCart(item)}
                  />
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-24 text-center">
                <p className="font-semibold text-stone-800">No items found</p>
                <p className="text-stone-400 text-sm mt-1">Try a different category or search term.</p>
                <button
                  onClick={() => { setActiveTab("all"); setSearchQuery("") }}
                  className="mt-5 text-sm font-medium text-stone-900 underline underline-offset-4"
                >
                  Clear filters
                </button>
              </div>
            )}
          </div>
        </div>
      </main>


    </div>
  )
}
