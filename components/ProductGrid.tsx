"use client"

import { useState, useMemo, useEffect } from "react"
import ProductCard from "./ProductCard"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { MenuService, type MenuItemWithCategory, type Category } from "@/lib/menu-service"

export default function ProductGrid() {
  const [searchTerm, setSearchTerm] = useState("")
  const [sortBy, setSortBy] = useState("name")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [menuItems, setMenuItems] = useState<MenuItemWithCategory[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Load menu data from database
  useEffect(() => {
    const loadMenuData = async () => {
      try {
        setIsLoading(true)
        setError(null)
        
        const [menuData, categoriesData] = await Promise.all([
          MenuService.getMenuItems(true),
          MenuService.getCategories(true),
        ])
        
        setMenuItems(menuData)
        setCategories(categoriesData)
      } catch (error) {
        console.error("Error loading menu data:", error)
        setError("Failed to load menu. Please try again.")
      } finally {
        setIsLoading(false)
      }
    }

    loadMenuData()
  }, [])

  const filteredAndSortedProducts = useMemo(() => {
    const filtered = menuItems.filter((item) => {
      const matchesSearch =
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (item.description && item.description.toLowerCase().includes(searchTerm.toLowerCase()))
      
      // Show all items if "all" is selected, otherwise filter by category
      const matchesCategory = categoryFilter === "all" || item.category?.slug === categoryFilter
      
      return matchesSearch && matchesCategory
    })

    filtered.sort((a, b) => {
      switch (sortBy) {
        case "price-low":
          return a.price - b.price
        case "price-high":
          return b.price - a.price
        case "name":
          return a.name.localeCompare(b.name)
        default:
          return 0
      }
    })

    return filtered
  }, [searchTerm, sortBy, categoryFilter, menuItems])

  if (isLoading) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto mb-4"></div>
        <p className="text-gray-600 dark:text-gray-400">Loading menu...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="text-red-600 dark:text-red-400 text-6xl mb-4">⚠️</div>
        <h2 className="text-xl font-bold mb-2 text-gray-900 dark:text-gray-100">Failed to Load Menu</h2>
        <p className="text-gray-600 dark:text-gray-400 mb-4">{error}</p>
        <button 
          onClick={() => window.location.reload()} 
          className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-lg"
        >
          Try Again
        </button>
      </div>
    )
  }

  return (
    <div>
      {/* Filters */}
      <div className="mb-8 flex flex-col md:flex-row gap-4">
        <Input
          placeholder="Search products..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="md:w-1/3"
        />
        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
          <SelectTrigger className="md:w-48">
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            {categories.map((category) => (
              <SelectItem key={category.slug} value={category.slug}>
                {category.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={sortBy} onValueChange={setSortBy}>
          <SelectTrigger className="md:w-48">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="name">Name</SelectItem>
            <SelectItem value="price-low">Price: Low to High</SelectItem>
            <SelectItem value="price-high">Price: High to Low</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredAndSortedProducts.map((item) => (
          <ProductCard key={item.id} product={item} />
        ))}
      </div>

      {filteredAndSortedProducts.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-400 dark:text-gray-600 text-6xl mb-4">🍽️</div>
          <p className="text-gray-500 dark:text-gray-400 text-lg">
            {searchTerm || categoryFilter !== "all" 
              ? "No products found matching your criteria." 
              : "No menu items available at the moment."}
          </p>
        </div>
      )}
    </div>
  )
}
