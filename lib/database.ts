import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: false,
  },
  db: {
    schema: "public",
  },
  global: {
    headers: {
      "x-application-name": "kings-bakery",
    },
  },
})

// Types for the new schema
export interface Category {
  id: string
  name: string
  slug: string
  description?: string
  image_url?: string
  sort_order: number
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface MenuItem {
  id: string
  category_id: string
  name: string
  description?: string
  price: number
  image_url?: string
  is_available: boolean
  is_popular: boolean
  sort_order: number
  created_at: string
  updated_at: string
  category?: Category
  sizes?: MenuItemSize[]
}

export interface MenuItemSize {
  id: string
  menu_item_id: string
  size_name: string
  price: number
  is_default: boolean
  created_at: string
}

export interface MenuItemWithCategory extends MenuItem {
  category: Category
  sizes: MenuItemSize[]
}

// Optimized database operations for menu management
export class MenuService {
  // Cache for menu data
  private static menuCache: MenuItemWithCategory[] | null = null
  private static categoriesCache: Category[] | null = null
  private static cacheExpiry = 0
  private static CACHE_DURATION = 5 * 60 * 1000 // 5 minutes

  // Get all categories
  static async getCategories(useCache = true): Promise<Category[]> {
    if (useCache && this.categoriesCache && Date.now() < this.cacheExpiry) {
      return this.categoriesCache
    }

    const { data, error } = await supabase
      .from("categories")
      .select("*")
      .eq("is_active", true)
      .order("sort_order", { ascending: true })

    if (error) throw error

    this.categoriesCache = data
    this.cacheExpiry = Date.now() + this.CACHE_DURATION

    return data
  }

  // Get all menu items with categories and sizes
  static async getMenuItems(useCache = true): Promise<MenuItemWithCategory[]> {
    if (useCache && this.menuCache && Date.now() < this.cacheExpiry) {
      return this.menuCache
    }

    const { data, error } = await supabase
      .from("menu_items")
      .select(`
        *,
        category:categories(*),
        sizes:menu_item_sizes(*)
      `)
      .eq("is_available", true)
      .order("sort_order", { ascending: true })

    if (error) throw error

    this.menuCache = data
    this.cacheExpiry = Date.now() + this.CACHE_DURATION

    return data
  }

  // Get menu items by category
  static async getMenuItemsByCategory(categorySlug: string): Promise<MenuItemWithCategory[]> {
    const { data, error } = await supabase
      .from("menu_items")
      .select(`
        *,
        category:categories(*),
        sizes:menu_item_sizes(*)
      `)
      .eq("is_available", true)
      .eq("categories.slug", categorySlug)
      .order("sort_order", { ascending: true })

    if (error) throw error
    return data
  }

  // Get popular menu items
  static async getPopularMenuItems(): Promise<MenuItemWithCategory[]> {
    const { data, error } = await supabase
      .from("menu_items")
      .select(`
        *,
        category:categories(*),
        sizes:menu_item_sizes(*)
      `)
      .eq("is_available", true)
      .eq("is_popular", true)
      .order("sort_order", { ascending: true })

    if (error) throw error
    return data
  }

  // Admin operations
  static async createCategory(categoryData: Omit<Category, "id" | "created_at" | "updated_at">): Promise<Category> {
    this.clearCache()
    
    const { data, error } = await supabase
      .from("categories")
      .insert([categoryData])
      .select()
      .single()

    if (error) throw error
    return data
  }

  static async updateCategory(id: string, updates: Partial<Category>): Promise<Category> {
    this.clearCache()
    
    const { data, error } = await supabase
      .from("categories")
      .update(updates)
      .eq("id", id)
      .select()
      .single()

    if (error) throw error
    return data
  }

  static async deleteCategory(id: string): Promise<void> {
    this.clearCache()
    
    const { error } = await supabase
      .from("categories")
      .delete()
      .eq("id", id)

    if (error) throw error
  }

  static async createMenuItem(menuItemData: Omit<MenuItem, "id" | "created_at" | "updated_at">): Promise<MenuItem> {
    this.clearCache()
    
    const { data, error } = await supabase
      .from("menu_items")
      .insert([menuItemData])
      .select()
      .single()

    if (error) throw error
    return data
  }

  static async updateMenuItem(id: string, updates: Partial<MenuItem>): Promise<MenuItem> {
    this.clearCache()
    
    const { data, error } = await supabase
      .from("menu_items")
      .update(updates)
      .eq("id", id)
      .select()
      .single()

    if (error) throw error
    return data
  }

  static async deleteMenuItem(id: string): Promise<void> {
    this.clearCache()
    
    const { error } = await supabase
      .from("menu_items")
      .delete()
      .eq("id", id)

    if (error) throw error
  }

  // Menu item sizes operations
  static async createMenuItemSize(sizeData: Omit<MenuItemSize, "id" | "created_at">): Promise<MenuItemSize> {
    this.clearCache()
    
    const { data, error } = await supabase
      .from("menu_item_sizes")
      .insert([sizeData])
      .select()
      .single()

    if (error) throw error
    return data
  }

  static async updateMenuItemSize(id: string, updates: Partial<MenuItemSize>): Promise<MenuItemSize> {
    this.clearCache()
    
    const { data, error } = await supabase
      .from("menu_item_sizes")
      .update(updates)
      .eq("id", id)
      .select()
      .single()

    if (error) throw error
    return data
  }

  static async deleteMenuItemSize(id: string): Promise<void> {
    this.clearCache()
    
    const { error } = await supabase
      .from("menu_item_sizes")
      .delete()
      .eq("id", id)

    if (error) throw error
  }

  // Clear cache when data is modified
  private static clearCache() {
    this.menuCache = null
    this.categoriesCache = null
    this.cacheExpiry = 0
  }
}

// Legacy database service for backward compatibility
export class DatabaseService {
  static async getMenuItems(useCache = true) {
    return MenuService.getMenuItems(useCache)
  }

  static async createOrder(orderData: any) {
    const { data, error } = await supabase.from("orders").insert([orderData]).select().single()
    if (error) throw error
    return data
  }

  static async updateMenuItem(id: string, updates: any) {
    return MenuService.updateMenuItem(id, updates)
  }
}
