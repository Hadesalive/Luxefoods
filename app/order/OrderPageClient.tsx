"use client"

import { useState, useEffect, useMemo, useCallback, memo } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { ShoppingCart, ArrowLeft, Plus, Minus, Search, X, RefreshCw, ChevronRight, Filter, Menu } from "lucide-react"
import { MenuService, type MenuItemWithCategory, type Category } from "@/lib/menu-service"
import { useCart } from "@/contexts/CartContext"
import Link from "next/link"
import { motion, AnimatePresence, useReducedMotion } from "framer-motion"
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

function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value)
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay)
    return () => clearTimeout(handler)
  }, [value, delay])
  return debouncedValue
}

// Minimalist Pill for Sizes/Options with Orange Theme
const SelectionPill = ({ 
  label, 
  price, 
  isSelected, 
  onClick 
}: { 
  label: string, 
  price?: number, 
  isSelected: boolean, 
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

// Reimagined Minimalist Card
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
  const prefersReducedMotion = useReducedMotion()
  
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
      className="group menu-item-card"
    >
      <div className="bg-gray-900 rounded-3xl p-4 transition-all duration-300 hover:shadow-xl border border-gray-800 h-full flex flex-col relative overflow-hidden will-change-transform">
        
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
            <p className="text-gray-400 text-sm line-clamp-2 leading-relaxed">
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
          <div className="mt-auto pt-4 border-t border-gray-800 flex items-center justify-between gap-4">
            <div className="flex flex-col">
              <span className="text-xs text-gray-400 font-medium uppercase tracking-wider">Total</span>
              <span className="text-xl font-bold text-orange-400">
                NLe{totalPrice.toFixed(2)}
              </span>
            </div>

            <div className="flex items-center gap-2">
              {/* Quantity Controls - Smaller */}
              <div className="flex items-center bg-orange-950/20 rounded-lg p-0.5 border border-orange-800">
                <button 
                  onClick={() => onQuantityChange(-1)}
                  className="w-6 h-6 flex items-center justify-center rounded-md hover:bg-orange-900/30 transition-colors text-orange-400"
                >
                  <Minus className="w-3 h-3" />
                </button>
                <span className="w-5 text-center text-xs font-semibold text-orange-400">{quantity}</span>
                <button 
                  onClick={() => onQuantityChange(1)}
                  className="w-6 h-6 flex items-center justify-center rounded-md hover:bg-orange-900/30 transition-colors text-orange-400"
                >
                  <Plus className="w-3 h-3" />
                </button>
              </div>

              {/* Add Button - Smaller */}
              <Button
                onClick={onAddToCart}
                disabled={isAdded}
                className={cn(
                  "rounded-lg px-4 h-8 text-xs transition-all duration-300 shadow-sm hover:shadow-md font-medium",
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

export default function OrderPageClient() {
  const { addItem, items } = useCart()
  const [activeTab, setActiveTab] = useState("all")
  const [selectedSizes, setSelectedSizes] = useState<{ [key: string]: string }>({})
  const [selectedOptions, setSelectedOptions] = useState<{ [key: string]: string[] }>({})
  const [quantities, setQuantities] = useState<{ [key: string]: number }>({})
  const [menuItems, setMenuItems] = useState<MenuItemWithCategory[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [addedItems, setAddedItems] = useState<{ [key: string]: boolean }>({})
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  
  const itemCount = items.length
  const debouncedSearchQuery = useDebounce(searchQuery, 300)

  // Load Data with optimized loading
  const loadMenuData = useCallback(async (bypassCache = false) => {
    try {
      setIsLoading(true)
      // Parallel data fetching for faster load
      const [menuData, categoriesData] = await Promise.all([
        MenuService.getMenuItems(bypassCache),
        MenuService.getCategories(bypassCache),
      ])
      
      // Use requestIdleCallback for non-critical updates
      if ('requestIdleCallback' in window) {
        requestIdleCallback(() => {
          setMenuItems(menuData)
          setCategories(categoriesData)
          setIsLoading(false)
          setIsRefreshing(false)
        })
      } else {
        setMenuItems(menuData)
        setCategories(categoriesData)
        setIsLoading(false)
        setIsRefreshing(false)
      }
    } catch (error) {
      console.error("Error loading menu:", error)
      setError("Unable to load menu. Please refresh.")
      setIsLoading(false)
      setIsRefreshing(false)
    }
  }, [])

  useEffect(() => { loadMenuData(false) }, [loadMenuData])

  // Filtering
  const filteredItems = useMemo(() => {
    let results = menuItems
    
    // Category Filter
    if (activeTab !== "all") {
      results = results.filter(item => item.category?.slug === activeTab)
    }

    // Search Filter
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

  // Handlers
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
    
    // For base + options pricing model or replacement model, adjust here. 
    // Assuming simple addition for options:
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
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-orange-900">
        <div className="flex flex-col items-center gap-4">
          <motion.div
            className="w-20 h-20 rounded-full overflow-hidden bg-white shadow-xl"
            animate={{
              opacity: [0.5, 1, 0.5],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            <Image
              src="/images/logo.jpg"
              alt="Kings Bakery Logo"
              width={80}
              height={80}
              className="object-cover w-full h-full"
              priority
            />
          </motion.div>
          <div className="flex gap-1">
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                className="w-2 h-2 rounded-full bg-orange-500"
                animate={{
                  y: [0, -8, 0],
                }}
                transition={{
                  duration: 0.6,
                  repeat: Infinity,
                  delay: i * 0.15,
                }}
              />
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="text-center p-8">
          <h2 className="text-xl font-bold mb-2 text-white">Something went wrong</h2>
          <p className="text-gray-400 mb-4">{error}</p>
          <Button onClick={() => loadMenuData(true)}>Retry</Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-orange-900 text-gray-100 font-sans">
      
      {/* Modern Clean Navbar */}
      <header className="sticky top-0 z-50 bg-gray-900/95 backdrop-blur-2xl border-b border-gray-800/50">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="flex items-center justify-between h-16">
            
            {/* Left: Logo & Back */}
            <div className="flex items-center gap-3">
              <Link 
                href="/" 
                className="flex items-center gap-3 group"
              >
                <div className="w-9 h-9 rounded-full overflow-hidden bg-white shadow-md group-hover:shadow-lg transition-shadow">
                  <Image
                    src="/images/logo.jpg"
                    alt="Kings Bakery"
                    width={36}
                    height={36}
                    className="object-cover w-full h-full"
                  />
                </div>
                <div className="hidden sm:block">
                  <div className="text-sm font-bold text-white">The Kings Bakery</div>
                  <div className="text-xs text-gray-400">Order Online</div>
                </div>
              </Link>
            </div>

            {/* Right: Actions */}
            <div className="flex items-center gap-2">
              {/* Mobile Category Menu Button */}
              <button
                onClick={() => setIsMobileMenuOpen(true)}
                className="lg:hidden w-9 h-9 flex items-center justify-center rounded-lg text-gray-400 hover:text-orange-400 hover:bg-gray-800 transition-all"
              >
                <Menu className="w-5 h-5" />
              </button>

              {/* Search Button */}
              <button
                onClick={() => setIsSearchOpen(true)}
                className="w-9 h-9 flex items-center justify-center rounded-lg text-gray-400 hover:text-orange-400 hover:bg-gray-800 transition-all"
              >
                <Search className="w-5 h-5" />
              </button>

              {/* Cart Button */}
              <Link href="/cart">
                <button className="flex items-center gap-2 h-9 px-4 rounded-lg bg-orange-600 hover:bg-orange-700 text-white font-medium transition-all hover:shadow-lg relative">
                  <ShoppingCart className="w-4 h-4" />
                  <span className="hidden sm:inline text-sm">Cart</span>
                  {itemCount > 0 && (
                    <span className="absolute -top-1.5 -right-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white border-2 border-gray-900 shadow-lg">
                      {itemCount}
                    </span>
                  )}
                </button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* Desktop Sidebar Navigation with Orange Theme */}
          <aside className="hidden lg:block w-64 flex-shrink-0">
            <div className="sticky top-24 space-y-8">
              <div>
                <h3 className="text-xs font-semibold text-orange-400 uppercase tracking-wider mb-4 px-2">Categories</h3>
                <nav className="space-y-1">
                  <button
                    onClick={() => setActiveTab("all")}
                    className={cn(
                      "w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium transition-all",
                      activeTab === "all" 
                        ? "bg-orange-600 text-white shadow-lg hover:bg-orange-700" 
                        : "text-gray-300 hover:bg-orange-900/40 hover:text-orange-400"
                    )}
                  >
                    <span className="font-semibold">All Items</span>
                    {activeTab === "all" && <ChevronRight className="w-4 h-4" />}
                  </button>
                  {categories.map((cat) => (
                    <button
                      key={cat.slug}
                      onClick={() => setActiveTab(cat.slug)}
                      className={cn(
                        "w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium transition-all",
                        activeTab === cat.slug 
                          ? "bg-orange-600 text-white shadow-lg hover:bg-orange-700" 
                          : "text-gray-300 hover:bg-orange-900/40 hover:text-orange-400"
                      )}
                    >
                      <span className="font-semibold">{cat.name}</span>
                      {activeTab === cat.slug && <ChevronRight className="w-4 h-4" />}
                    </button>
                  ))}
                </nav>
              </div>
            </div>
          </aside>

          {/* Mobile Category Navigation - Optimized */}
          <div className="lg:hidden mb-6">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-orange-400 uppercase tracking-wider">Browse Categories</h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsMobileMenuOpen(true)}
                className="text-orange-400 hover:bg-orange-950/20 text-xs"
              >
                View All
              </Button>
            </div>
            <div className="overflow-x-auto pb-2 -mx-4 pl-4 pr-4 flex gap-2 snap-x snap-mandatory scrollbar-hide">
              <button
                onClick={() => setActiveTab("all")}
                className={cn(
                  "flex-none px-4 py-2 rounded-lg text-sm font-medium transition-all snap-start whitespace-nowrap border",
                  activeTab === "all"
                    ? "bg-orange-600 text-white border-orange-600 shadow-md hover:bg-orange-700"
                    : "bg-gray-800 text-gray-300 border-gray-700 hover:border-orange-600 hover:bg-gray-700"
                )}
              >
                🍽️ All Items
              </button>
              {categories.slice(0, 6).map((cat) => (
                <button
                  key={cat.slug}
                  onClick={() => setActiveTab(cat.slug)}
                  className={cn(
                    "flex-none px-4 py-2 rounded-lg text-sm font-medium transition-all snap-start whitespace-nowrap border",
                    activeTab === cat.slug
                      ? "bg-orange-600 text-white border-orange-600 shadow-md hover:bg-orange-700"
                      : "bg-gray-800 text-gray-300 border-gray-700 hover:border-orange-600 hover:bg-gray-700"
                  )}
                >
                  {cat.name}
                </button>
              ))}
              {categories.length > 6 && (
                <button
                  onClick={() => setIsMobileMenuOpen(true)}
                  className="flex-none px-4 py-2 rounded-lg text-sm font-medium bg-gray-800 text-orange-400 border border-gray-700 hover:border-orange-600 hover:bg-gray-700 whitespace-nowrap"
                >
                  +{categories.length - 6} More
                </button>
              )}
            </div>
          </div>

          {/* Product Grid */}
          <div className="flex-1">
            {/* Header for Grid */}
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold tracking-tight text-white">
                {activeTab === "all" ? "All Menu Items" : categories.find(c => c.slug === activeTab)?.name || "Menu"}
              </h2>
              <span className="text-sm text-orange-400 font-semibold bg-orange-950/20 px-3 py-1.5 rounded-full border border-orange-800">
                {filteredItems.length} {filteredItems.length === 1 ? 'item' : 'items'}
              </span>
            </div>

            {filteredItems.length > 0 ? (
              <motion.div 
                layout
                className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6"
              >
                <AnimatePresence mode="popLayout">
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
                </AnimatePresence>
              </motion.div>
            ) : (
              <div className="flex flex-col items-center justify-center py-24 bg-gray-900 rounded-3xl border border-dashed border-gray-800">
                <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center mb-4">
                  <Filter className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-semibold text-white">No items found</h3>
                <p className="text-gray-400 text-sm mt-1">Try changing the category or search term.</p>
                <Button 
                  variant="link" 
                  onClick={() => { setActiveTab("all"); setSearchQuery(""); }}
                  className="mt-4 text-white underline"
                >
                  Clear all filters
                </Button>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Mobile Category Menu - Slide up from bottom */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
            />
            
            {/* Bottom Sheet */}
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="fixed bottom-0 left-0 right-0 z-50 bg-gray-900 rounded-t-3xl shadow-2xl max-h-[70vh] overflow-hidden"
            >
              {/* Handle */}
              <div className="flex justify-center pt-3 pb-2">
                <div className="w-12 h-1 rounded-full bg-gray-700" />
              </div>
              
              {/* Header */}
              <div className="px-6 pb-4">
                <h3 className="text-lg font-bold text-white">All Categories</h3>
                <p className="text-sm text-gray-400 mt-0.5">Browse our menu</p>
              </div>
              
              {/* Categories Grid */}
              <div className="overflow-y-auto px-4 pb-6 max-h-[calc(70vh-100px)]">
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => {
                      setActiveTab("all")
                      setIsMobileMenuOpen(false)
                    }}
                    className={cn(
                      "p-4 rounded-2xl text-left transition-all",
                      activeTab === "all" 
                        ? "bg-orange-600 text-white shadow-lg" 
                        : "bg-gray-800 text-gray-300 hover:bg-gray-700 active:scale-95"
                    )}
                  >
                    <div className="text-2xl mb-1">🍽️</div>
                    <div className="font-semibold text-sm">All Items</div>
                    <div className="text-xs opacity-70 mt-0.5">{menuItems.length} items</div>
                  </button>
                  {categories.map((cat) => (
                    <button
                      key={cat.slug}
                      onClick={() => {
                        setActiveTab(cat.slug)
                        setIsMobileMenuOpen(false)
                      }}
                      className={cn(
                        "p-4 rounded-2xl text-left transition-all",
                        activeTab === cat.slug 
                          ? "bg-orange-600 text-white shadow-lg" 
                          : "bg-gray-800 text-gray-300 hover:bg-gray-700 active:scale-95"
                      )}
                    >
                      <div className="font-semibold text-sm">{cat.name}</div>
                      <div className="text-xs opacity-70 mt-0.5">
                        {menuItems.filter(item => item.category?.slug === cat.slug).length} items
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Search Modal - Bottom Sheet */}
      <AnimatePresence>
        {isSearchOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsSearchOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
            />
            
            {/* Search Bottom Sheet */}
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="fixed bottom-0 left-0 right-0 z-50 bg-gray-900 rounded-t-3xl shadow-2xl max-h-[85vh] overflow-hidden flex flex-col"
            >
              {/* Handle */}
              <div className="flex justify-center pt-3 pb-2">
                <div className="w-12 h-1 rounded-full bg-gray-700" />
              </div>
              
              {/* Search Input */}
              <div className="px-4 pb-4">
                <div className="flex items-center gap-3 px-4 py-3 bg-gray-800 rounded-2xl border border-gray-700">
                  <Search className="w-5 h-5 text-gray-400 flex-shrink-0" />
                  <input
                    className="flex-1 bg-transparent border-none outline-none text-base placeholder:text-gray-500 text-white"
                    placeholder="Search for food..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    autoFocus
                  />
                  {searchQuery && (
                    <button 
                      onClick={() => setSearchQuery("")}
                      className="w-6 h-6 flex items-center justify-center rounded-full hover:bg-gray-700 transition-colors"
                    >
                      <X className="w-4 h-4 text-gray-400" />
                    </button>
                  )}
                </div>
              </div>
              
              {/* Results */}
              <div className="flex-1 overflow-y-auto px-4 pb-6">
                {searchQuery ? (
                  filteredItems.length > 0 ? (
                    <div className="space-y-2">
                      {filteredItems.map((item) => (
                        <button
                          key={item.id}
                          onClick={() => {
                            setIsSearchOpen(false)
                            setSearchQuery("")
                            setActiveTab(item.category?.slug || "all")
                          }}
                          className="w-full flex items-center gap-3 p-3 hover:bg-gray-800 rounded-2xl transition-all active:scale-98 text-left"
                        >
                          {item.image_url && (
                            <div className="w-14 h-14 rounded-xl overflow-hidden bg-gray-800 flex-shrink-0">
                              <Image
                                src={optimizeImageUrl(item.image_url, 100)}
                                alt={item.name}
                                width={56}
                                height={56}
                                className="object-cover w-full h-full"
                              />
                            </div>
                          )}
                          <div className="flex-1 min-w-0">
                            <div className="font-semibold text-white truncate">{item.name}</div>
                            <div className="text-sm text-gray-400">{item.category?.name}</div>
                          </div>
                          <div className="text-orange-400 font-bold flex-shrink-0">NLe{item.price.toFixed(2)}</div>
                        </button>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Search className="w-8 h-8 text-gray-600" />
                      </div>
                      <p className="text-gray-400 text-sm">No items found for "{searchQuery}"</p>
                    </div>
                  )
                ) : (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Search className="w-8 h-8 text-gray-600" />
                    </div>
                    <p className="text-gray-400 text-sm">Search our menu</p>
                    <p className="text-gray-500 text-xs mt-1">Try "pizza", "burger", or "chicken"</p>
                  </div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}
