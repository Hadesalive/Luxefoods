/**
 * Shared types for menu, categories, and related entities.
 * Used by mock data and menu service.
 */

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

export interface MenuItemOption {
  id: string
  menu_item_id: string
  option_name: string
  price_adjustment: number
  is_available: boolean
  sort_order: number
  created_at: string
}

export interface MenuItemWithCategory extends MenuItem {
  category: Category
  sizes: MenuItemSize[]
  options: MenuItemOption[]
}
