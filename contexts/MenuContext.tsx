"use client"

import { createContext, useContext, useReducer, useEffect, type ReactNode } from "react"
import { MenuService, type Category, type MenuItemWithCategory } from "@/lib/menu-service"

interface MenuState {
  categories: Category[]
  menuItems: MenuItemWithCategory[]
  isLoading: boolean
  error: string | null
}

interface MenuContextType extends MenuState {
  refreshMenu: () => Promise<void>
  refreshCategories: () => Promise<void>
  addCategory: (category: Omit<Category, "id" | "created_at" | "updated_at">) => Promise<void>
  updateCategory: (id: string, updates: Partial<Category>) => Promise<void>
  deleteCategory: (id: string) => Promise<void>
  addMenuItem: (menuItem: Omit<MenuItemWithCategory, "id" | "created_at" | "updated_at" | "category" | "sizes" | "options">, sizes?: any[], options?: any[]) => Promise<void>
  updateMenuItem: (id: string, updates: Partial<MenuItemWithCategory>, sizes?: any[], options?: any[]) => Promise<void>
  deleteMenuItem: (id: string) => Promise<void>
}

const MenuContext = createContext<MenuContextType | undefined>(undefined)

type MenuAction =
  | { type: "SET_LOADING"; payload: boolean }
  | { type: "SET_ERROR"; payload: string | null }
  | { type: "SET_CATEGORIES"; payload: Category[] }
  | { type: "SET_MENU_ITEMS"; payload: MenuItemWithCategory[] }
  | { type: "ADD_CATEGORY"; payload: Category }
  | { type: "UPDATE_CATEGORY"; payload: { id: string; updates: Partial<Category> } }
  | { type: "DELETE_CATEGORY"; payload: string }
  | { type: "ADD_MENU_ITEM"; payload: MenuItemWithCategory }
  | { type: "UPDATE_MENU_ITEM"; payload: { id: string; updates: Partial<MenuItemWithCategory> } }
  | { type: "DELETE_MENU_ITEM"; payload: string }

function menuReducer(state: MenuState, action: MenuAction): MenuState {
  switch (action.type) {
    case "SET_LOADING":
      return { ...state, isLoading: action.payload }
    case "SET_ERROR":
      return { ...state, error: action.payload }
    case "SET_CATEGORIES":
      return { ...state, categories: action.payload }
    case "SET_MENU_ITEMS":
      return { ...state, menuItems: action.payload }
    case "ADD_CATEGORY":
      return { ...state, categories: [...state.categories, action.payload] }
    case "UPDATE_CATEGORY":
      return {
        ...state,
        categories: state.categories.map((cat) =>
          cat.id === action.payload.id ? { ...cat, ...action.payload.updates } : cat
        ),
      }
    case "DELETE_CATEGORY":
      return {
        ...state,
        categories: state.categories.filter((cat) => cat.id !== action.payload),
      }
    case "ADD_MENU_ITEM":
      return { ...state, menuItems: [...state.menuItems, action.payload] }
    case "UPDATE_MENU_ITEM":
      return {
        ...state,
        menuItems: state.menuItems.map((item) =>
          item.id === action.payload.id ? { ...item, ...action.payload.updates } : item
        ),
      }
    case "DELETE_MENU_ITEM":
      return {
        ...state,
        menuItems: state.menuItems.filter((item) => item.id !== action.payload),
      }
    default:
      return state
  }
}

const initialState: MenuState = {
  categories: [],
  menuItems: [],
  isLoading: false,
  error: null,
}

export function MenuProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(menuReducer, initialState)

  const refreshMenu = async () => {
    try {
      dispatch({ type: "SET_LOADING", payload: true })
      dispatch({ type: "SET_ERROR", payload: null })
      
      const [categories, menuItems] = await Promise.all([
        MenuService.getCategories(false),
        MenuService.getMenuItems(false),
      ])
      
      dispatch({ type: "SET_CATEGORIES", payload: categories })
      dispatch({ type: "SET_MENU_ITEMS", payload: menuItems })
    } catch (error) {
      console.error("Error refreshing menu:", error)
      dispatch({ type: "SET_ERROR", payload: "Failed to load menu data" })
    } finally {
      dispatch({ type: "SET_LOADING", payload: false })
    }
  }

  const refreshCategories = async () => {
    try {
      dispatch({ type: "SET_ERROR", payload: null })
      const categories = await MenuService.getCategories(false)
      dispatch({ type: "SET_CATEGORIES", payload: categories })
    } catch (error) {
      console.error("Error refreshing categories:", error)
      dispatch({ type: "SET_ERROR", payload: "Failed to load categories" })
    }
  }

  const addCategory = async (categoryData: Omit<Category, "id" | "created_at" | "updated_at">) => {
    try {
      dispatch({ type: "SET_ERROR", payload: null })
      const newCategory = await MenuService.createCategory(categoryData)
      dispatch({ type: "ADD_CATEGORY", payload: newCategory })
    } catch (error) {
      console.error("Error adding category:", error)
      dispatch({ type: "SET_ERROR", payload: "Failed to add category" })
      throw error
    }
  }

  const updateCategory = async (id: string, updates: Partial<Category>) => {
    try {
      dispatch({ type: "SET_ERROR", payload: null })
      await MenuService.updateCategory(id, updates)
      dispatch({ type: "UPDATE_CATEGORY", payload: { id, updates } })
    } catch (error) {
      console.error("Error updating category:", error)
      dispatch({ type: "SET_ERROR", payload: "Failed to update category" })
      throw error
    }
  }

  const deleteCategory = async (id: string) => {
    try {
      dispatch({ type: "SET_ERROR", payload: null })
      await MenuService.deleteCategory(id)
      dispatch({ type: "DELETE_CATEGORY", payload: id })
    } catch (error) {
      console.error("Error deleting category:", error)
      dispatch({ type: "SET_ERROR", payload: "Failed to delete category" })
      throw error
    }
  }

  const addMenuItem = async (menuItemData: Omit<MenuItemWithCategory, "id" | "created_at" | "updated_at" | "category" | "sizes" | "options">, sizes?: any[], options?: any[]) => {
    try {
      dispatch({ type: "SET_ERROR", payload: null })
      const newMenuItem = await MenuService.createMenuItem(menuItemData)
      
      // Create sizes if provided
      if (sizes && sizes.length > 0) {
        for (const size of sizes) {
          if (size.size_name.trim()) {
            await MenuService.createMenuItemSize({
              menu_item_id: newMenuItem.id,
              size_name: size.size_name,
              price: size.price,
              is_default: size.is_default
            })
          }
        }
      }
      
      // Create options if provided
      if (options && options.length > 0) {
        for (const option of options) {
          if (option.name.trim()) {
            await MenuService.createMenuItemOption({
              menu_item_id: newMenuItem.id,
              option_name: option.name,
              price_adjustment: option.price_adjustment,
              is_available: true,
              sort_order: option.sort_order || 0
            })
          }
        }
      }
      
      // Fetch the complete menu item with category, sizes, and options
      const menuItems = await MenuService.getMenuItems(false)
      const completeMenuItem = menuItems.find(item => item.id === newMenuItem.id)
      if (completeMenuItem) {
        dispatch({ type: "ADD_MENU_ITEM", payload: completeMenuItem })
      }
    } catch (error) {
      console.error("Error adding menu item:", error)
      console.error("Error details:", JSON.stringify(error, null, 2))
      dispatch({ type: "SET_ERROR", payload: `Failed to add menu item: ${error instanceof Error ? error.message : 'Unknown error'}` })
      throw error
    }
  }

  const updateMenuItem = async (id: string, updates: Partial<MenuItemWithCategory>, sizes?: any[], options?: any[]) => {
    try {
      dispatch({ type: "SET_ERROR", payload: null })
      
      // Update the menu item first
      await MenuService.updateMenuItem(id, updates)
      
      // Handle sizes if provided
      if (sizes !== undefined) {
        // Delete existing sizes
        const existingSizes = await MenuService.getMenuItems(false)
        const currentItem = existingSizes.find(item => item.id === id)
        if (currentItem?.sizes) {
          for (const size of currentItem.sizes) {
            await MenuService.deleteMenuItemSize(size.id)
          }
        }
        
        // Create new sizes
        if (sizes.length > 0) {
          for (const size of sizes) {
            if (size.size_name.trim()) {
              await MenuService.createMenuItemSize({
                menu_item_id: id,
                size_name: size.size_name,
                price: size.price,
                is_default: size.is_default
              })
            }
          }
        }
      }
      
      // Handle options if provided
      if (options !== undefined) {
        // Delete existing options
        const existingItems = await MenuService.getMenuItems(false)
        const currentItem = existingItems.find(item => item.id === id)
        if (currentItem?.options) {
          for (const option of currentItem.options) {
            await MenuService.deleteMenuItemOption(option.id)
          }
        }
        
        // Create new options
        if (options.length > 0) {
          for (const option of options) {
            if (option.name.trim()) {
              await MenuService.createMenuItemOption({
                menu_item_id: id,
                option_name: option.name,
                price_adjustment: option.price_adjustment,
                is_available: true,
                sort_order: option.sort_order || 0
              })
            }
          }
        }
      }
      
      // Fetch the complete updated menu item
      const menuItems = await MenuService.getMenuItems(false)
      const updatedMenuItem = menuItems.find(item => item.id === id)
      if (updatedMenuItem) {
        dispatch({ type: "UPDATE_MENU_ITEM", payload: { id, updates: updatedMenuItem } })
      }
    } catch (error) {
      console.error("Error updating menu item:", error)
      console.error("Error details:", JSON.stringify(error, null, 2))
      dispatch({ type: "SET_ERROR", payload: `Failed to update menu item: ${error instanceof Error ? error.message : 'Unknown error'}` })
      throw error
    }
  }

  const deleteMenuItem = async (id: string) => {
    try {
      dispatch({ type: "SET_ERROR", payload: null })
      await MenuService.deleteMenuItem(id)
      dispatch({ type: "DELETE_MENU_ITEM", payload: id })
    } catch (error) {
      console.error("Error deleting menu item:", error)
      dispatch({ type: "SET_ERROR", payload: "Failed to delete menu item" })
      throw error
    }
  }

  // Load initial data
  useEffect(() => {
    refreshMenu()
  }, [])

  return (
    <MenuContext.Provider
      value={{
        ...state,
        refreshMenu,
        refreshCategories,
        addCategory,
        updateCategory,
        deleteCategory,
        addMenuItem,
        updateMenuItem,
        deleteMenuItem,
      }}
    >
      {children}
    </MenuContext.Provider>
  )
}

export function useMenu() {
  const context = useContext(MenuContext)
  if (context === undefined) {
    throw new Error("useMenu must be used within a MenuProvider")
  }
  return context
} 