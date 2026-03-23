import { MOCK_CATEGORIES, MOCK_MENU_ITEMS } from "./mock-data"
import type { Category, MenuItem, MenuItemSize, MenuItemOption, MenuItemWithCategory } from "./types"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

// Check if Supabase is configured
const isSupabaseConfigured = !!(supabaseUrl && supabaseAnonKey)

// Only import and initialize Supabase if configured
let supabase: any = null
if (isSupabaseConfigured) {
  try {
    const { createClient } = require("@supabase/supabase-js")
    supabase = createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
      },
      db: {
        schema: "public",
      },
      global: {
        headers: {
          "x-application-name": "luxe-food",
        },
      },
    })
  } catch (error) {
    console.warn("Supabase not available, using mock data")
  }
}

export { supabase }

// Re-export types
export type { Category, MenuItem, MenuItemSize, MenuItemOption, MenuItemWithCategory }

// Optimized Menu service for Supabase free tier
export class MenuService {
  // Enhanced caching with localStorage fallback
  private static menuCache: MenuItemWithCategory[] | null = null
  private static categoriesCache: Category[] | null = null
  private static cacheExpiry = 0
  private static CACHE_DURATION = 15 * 60 * 1000 // 15 minutes (increased from 5)
  private static CACHE_KEY = 'luxe-foods-menu-cache'
  private static CATEGORIES_CACHE_KEY = 'luxe-foods-categories-cache'

  // Get Supabase client (no auth required since we use local storage auth)
  private static getAuthenticatedClient() {
    if (!isSupabaseConfigured) {
      throw new Error("Supabase is not configured. Cannot perform admin operations with mock data.")
    }
    return supabase
  }

  // Check if using mock data
  private static isUsingMockData() {
    return !isSupabaseConfigured || !supabase
  }

  // Enhanced cache management with localStorage
  private static getFromLocalStorage(key: string) {
    if (typeof window === 'undefined') return null
    try {
      const item = localStorage.getItem(key)
      if (!item) return null
      const { data, expiry } = JSON.parse(item)
      if (Date.now() > expiry) {
        localStorage.removeItem(key)
        return null
      }
      return data
    } catch {
      return null
    }
  }

  private static setToLocalStorage(key: string, data: any) {
    if (typeof window === 'undefined') return
    try {
      const cacheData = {
        data,
        expiry: Date.now() + this.CACHE_DURATION
      }
      localStorage.setItem(key, JSON.stringify(cacheData))
    } catch {
      // Ignore localStorage errors
    }
  }

  // Optimized: Get all categories with better caching
  static async getCategories(useCache = true): Promise<Category[]> {
    // Use mock data if Supabase not configured
    if (this.isUsingMockData()) {
      return MOCK_CATEGORIES.filter(cat => cat.is_active)
    }

    // Check memory cache first
    if (useCache && this.categoriesCache && Date.now() < this.cacheExpiry) {
      return this.categoriesCache
    }

    // Check localStorage cache
    if (useCache) {
      const cached = this.getFromLocalStorage(this.CATEGORIES_CACHE_KEY)
      if (cached) {
        this.categoriesCache = cached
        this.cacheExpiry = Date.now() + this.CACHE_DURATION
        return cached
      }
    }

    // Fetch from database with optimized query
    const { data, error } = await supabase
      .from("categories")
      .select("*")
      .eq("is_active", true)
      .order("sort_order", { ascending: true })
      .order("name", { ascending: true })

    if (error) {
      console.error("Error fetching categories:", error)
      throw error
    }

    // Update caches
    this.categoriesCache = data || []
    this.cacheExpiry = Date.now() + this.CACHE_DURATION
    this.setToLocalStorage(this.CATEGORIES_CACHE_KEY, data || [])

    return data || []
  }

  // Optimized: Get menu items with single query and better caching
  static async getMenuItems(useCache = true, limit?: number): Promise<MenuItemWithCategory[]> {
    // Use mock data if Supabase not configured
    if (this.isUsingMockData()) {
      const items = MOCK_MENU_ITEMS
        .filter(item => item.is_available)
        .map(item => {
          const category = MOCK_CATEGORIES.find(cat => cat.id === item.category_id)!
          return {
            ...item,
            category,
            sizes: item.sizes || [],
            options: item.options || []
          } as MenuItemWithCategory
        })
      return limit ? items.slice(0, limit) : items
    }

    // Check memory cache first
    if (useCache && this.menuCache && Date.now() < this.cacheExpiry) {
      return limit ? this.menuCache.slice(0, limit) : this.menuCache
    }

    // Check localStorage cache
    if (useCache) {
      const cached = this.getFromLocalStorage(this.CACHE_KEY)
      if (cached) {
        this.menuCache = cached
        this.cacheExpiry = Date.now() + this.CACHE_DURATION
        return limit ? cached.slice(0, limit) : cached
      }
    }

    // Optimized single query with joins
    let query = supabase
      .from("menu_items")
      .select(`
        *,
        category:categories(*),
        sizes:menu_item_sizes(*),
        options:menu_item_options(*)
      `)
      .eq("is_available", true)
      .order("sort_order", { ascending: true })
      .order("name", { ascending: true })

    if (limit) {
      query = query.limit(limit)
    }

    const { data, error } = await query

    if (error) {
      console.error("Error fetching menu items:", error)
      throw error
    }

    // Transform data to match interface
    const transformedData = (data || []).map((item: any) => ({
      ...item,
      category: item.category,
      sizes: item.sizes || [],
      options: item.options || []
    }))

    // Update caches
    this.menuCache = transformedData
    this.cacheExpiry = Date.now() + this.CACHE_DURATION
    this.setToLocalStorage(this.CACHE_KEY, transformedData)

    return transformedData
  }

  // Optimized: Get menu items by category with pagination
  static async getMenuItemsByCategory(
    categorySlug: string, 
    page = 1, 
    pageSize = 12
  ): Promise<{ items: MenuItemWithCategory[], total: number, hasMore: boolean }> {
    // Use mock data if Supabase not configured
    if (this.isUsingMockData()) {
      const category = MOCK_CATEGORIES.find(cat => cat.slug === categorySlug && cat.is_active)
      if (!category) {
        return { items: [], total: 0, hasMore: false }
      }

      const allItems = MOCK_MENU_ITEMS
        .filter(item => item.category_id === category.id && item.is_available)
        .map(item => ({
          ...item,
          category,
          sizes: item.sizes || [],
          options: item.options || []
        } as MenuItemWithCategory))

      const offset = (page - 1) * pageSize
      const items = allItems.slice(offset, offset + pageSize)
      
      return {
        items,
        total: allItems.length,
        hasMore: allItems.length > offset + pageSize
      }
    }

    const offset = (page - 1) * pageSize

    // Get category first
    const { data: category } = await supabase
      .from("categories")
      .select("id")
      .eq("slug", categorySlug)
      .eq("is_active", true)
      .single()

    if (!category) {
      return { items: [], total: 0, hasMore: false }
    }

    // Get total count
    const { count } = await supabase
      .from("menu_items")
      .select("*", { count: "exact", head: true })
      .eq("category_id", category.id)
      .eq("is_available", true)

    // Get paginated items
    const { data, error } = await supabase
      .from("menu_items")
      .select(`
        *,
        category:categories(*),
        sizes:menu_item_sizes(*),
        options:menu_item_options(*)
      `)
      .eq("category_id", category.id)
      .eq("is_available", true)
      .order("sort_order", { ascending: true })
      .order("name", { ascending: true })
      .range(offset, offset + pageSize - 1)

    if (error) {
      console.error("Error fetching menu items by category:", error)
      throw error
    }

    const transformedData = (data || []).map((item: any) => ({
      ...item,
      category: item.category,
      sizes: item.sizes || [],
      options: item.options || []
    }))

    return {
      items: transformedData,
      total: count || 0,
      hasMore: (count || 0) > offset + pageSize
    }
  }

  // Optimized: Get popular menu items (limited to reduce bandwidth)
  static async getPopularMenuItems(limit = 8): Promise<MenuItemWithCategory[]> {
    // Use mock data if Supabase not configured
    if (this.isUsingMockData()) {
      const items = MOCK_MENU_ITEMS
        .filter(item => item.is_available && item.is_popular)
        .slice(0, limit)
        .map(item => {
          const category = MOCK_CATEGORIES.find(cat => cat.id === item.category_id)!
          return {
            ...item,
            category,
            sizes: item.sizes || [],
            options: item.options || []
          } as MenuItemWithCategory
        })
      return items
    }

    const { data, error } = await supabase
      .from("menu_items")
      .select(`
        *,
        category:categories(*),
        sizes:menu_item_sizes(*),
        options:menu_item_options(*)
      `)
      .eq("is_available", true)
      .eq("is_popular", true)
      .order("sort_order", { ascending: true })
      .limit(limit)

    if (error) {
      console.error("Error fetching popular menu items:", error)
      throw error
    }

    return (data || []).map((item: any) => ({
      ...item,
      category: item.category,
      sizes: item.sizes || [],
      options: item.options || []
    }))
  }

  // Clear all caches
  static clearCache() {
    this.menuCache = null
    this.categoriesCache = null
    this.cacheExpiry = 0
    
    if (typeof window !== 'undefined') {
      localStorage.removeItem(this.CACHE_KEY)
      localStorage.removeItem(this.CATEGORIES_CACHE_KEY)
    }
  }

  // Admin methods (only for authenticated users)
  static async createCategory(categoryData: Omit<Category, "id" | "created_at" | "updated_at">): Promise<Category> {
    const client = await this.getAuthenticatedClient()
    const { data, error } = await client
      .from("categories")
      .insert([categoryData])
      .select()
      .single()

    if (error) throw error
    this.clearCache()
    return data
  }

  static async updateCategory(id: string, updates: Partial<Category>): Promise<Category> {
    const client = await this.getAuthenticatedClient()
    const { data, error } = await client
      .from("categories")
      .update(updates)
      .eq("id", id)
      .select()
      .single()

    if (error) throw error
    this.clearCache()
    return data
  }

  static async deleteCategory(id: string): Promise<void> {
    const client = await this.getAuthenticatedClient()
    const { error } = await client
      .from("categories")
      .delete()
      .eq("id", id)

    if (error) throw error
    this.clearCache()
  }

  static async createMenuItem(menuItemData: Omit<MenuItem, "id" | "created_at" | "updated_at">): Promise<MenuItem> {
    const client = await this.getAuthenticatedClient()
    const { data, error } = await client
      .from("menu_items")
      .insert([menuItemData])
      .select()
      .single()

    if (error) throw error
    this.clearCache()
    return data
  }

  static async updateMenuItem(id: string, updates: Partial<MenuItem>): Promise<MenuItem> {
    const client = await this.getAuthenticatedClient()
    const { data, error } = await client
      .from("menu_items")
      .update(updates)
      .eq("id", id)
      .select()
      .single()

    if (error) throw error
    this.clearCache()
    return data
  }

  static async deleteMenuItem(id: string): Promise<void> {
    const client = await this.getAuthenticatedClient()
    const { error } = await client
      .from("menu_items")
      .delete()
      .eq("id", id)

    if (error) throw error
    this.clearCache()
  }

  // Size and option methods (admin only)
  static async createMenuItemSize(sizeData: Omit<MenuItemSize, "id" | "created_at">): Promise<MenuItemSize> {
    const client = await this.getAuthenticatedClient()
    const { data, error } = await client
      .from("menu_item_sizes")
      .insert([sizeData])
      .select()
      .single()

    if (error) throw error
    this.clearCache()
    return data
  }

  static async updateMenuItemSize(id: string, updates: Partial<MenuItemSize>): Promise<MenuItemSize> {
    const client = await this.getAuthenticatedClient()
    const { data, error } = await client
      .from("menu_item_sizes")
      .update(updates)
      .eq("id", id)
      .select()
      .single()

    if (error) throw error
    this.clearCache()
    return data
  }

  static async deleteMenuItemSize(id: string): Promise<void> {
    const client = await this.getAuthenticatedClient()
    const { error } = await client
      .from("menu_item_sizes")
      .delete()
      .eq("id", id)

    if (error) throw error
    this.clearCache()
  }

  static async createMenuItemOption(optionData: Omit<MenuItemOption, "id" | "created_at">): Promise<MenuItemOption> {
    const client = await this.getAuthenticatedClient()
    const { data, error } = await client
      .from("menu_item_options")
      .insert([optionData])
      .select()
      .single()

    if (error) throw error
    this.clearCache()
    return data
  }

  static async updateMenuItemOption(id: string, updates: Partial<MenuItemOption>): Promise<MenuItemOption> {
    const client = await this.getAuthenticatedClient()
    const { data, error } = await client
      .from("menu_item_options")
      .update(updates)
      .eq("id", id)
      .select()
      .single()

    if (error) throw error
    this.clearCache()
    return data
  }

  static async deleteMenuItemOption(id: string): Promise<void> {
    const client = await this.getAuthenticatedClient()
    const { error } = await client
      .from("menu_item_options")
      .delete()
      .eq("id", id)

    if (error) throw error
    this.clearCache()
  }
} 