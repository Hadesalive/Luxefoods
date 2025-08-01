"use client"

import { createContext, useContext, useReducer, useEffect, type ReactNode } from "react"
import type { MenuItem } from "@/types/admin"

interface AdminState {
  menuItems: MenuItem[]
  isLoading: boolean
  error: string | null
}

interface AdminContextType extends AdminState {
  addMenuItem: (item: Omit<MenuItem, "id">) => void
  updateMenuItem: (id: string, updates: Partial<MenuItem>) => void
  deleteMenuItem: (id: string) => void
}

const AdminContext = createContext<AdminContextType | undefined>(undefined)

type AdminAction =
  | { type: "ADD_MENU_ITEM"; payload: MenuItem }
  | { type: "UPDATE_MENU_ITEM"; payload: { id: string; updates: Partial<MenuItem> } }
  | { type: "DELETE_MENU_ITEM"; payload: string }
  | { type: "LOAD_MENU_ITEMS"; payload: MenuItem[] }
  | { type: "SET_LOADING"; payload: boolean }
  | { type: "SET_ERROR"; payload: string | null }

function adminReducer(state: AdminState, action: AdminAction): AdminState {
  switch (action.type) {
    case "ADD_MENU_ITEM":
      const newState = {
        ...state,
        menuItems: [...state.menuItems, action.payload],
      }
      // Save to localStorage
      if (typeof window !== "undefined") {
        localStorage.setItem("admin-menu-items", JSON.stringify(newState.menuItems))
      }
      return newState

    case "UPDATE_MENU_ITEM":
      const updatedState = {
        ...state,
        menuItems: state.menuItems.map((item) =>
          item.id === action.payload.id ? { ...item, ...action.payload.updates } : item,
        ),
      }
      // Save to localStorage
      if (typeof window !== "undefined") {
        localStorage.setItem("admin-menu-items", JSON.stringify(updatedState.menuItems))
      }
      return updatedState

    case "DELETE_MENU_ITEM":
      const filteredState = {
        ...state,
        menuItems: state.menuItems.filter((item) => item.id !== action.payload),
      }
      // Save to localStorage
      if (typeof window !== "undefined") {
        localStorage.setItem("admin-menu-items", JSON.stringify(filteredState.menuItems))
      }
      return filteredState

    case "LOAD_MENU_ITEMS":
      return {
        ...state,
        menuItems: action.payload,
      }

    case "SET_LOADING":
      return {
        ...state,
        isLoading: action.payload,
      }

    case "SET_ERROR":
      return {
        ...state,
        error: action.payload,
      }

    default:
      return state
  }
}

// Initial menu items with sample data
const initialMenuItems: MenuItem[] = [
  {
    id: "pizza-chicken",
    name: "Chicken Pizza",
    description: "Delicious chicken pizza with fresh vegetables and cheese",
    category: "pizza",
    price: { S: 120, M: 200, L: 250 },
    image: "/placeholder.svg?height=200&width=300&text=Chicken+Pizza",
    available: true,
    popular: true,
  },
  {
    id: "pizza-beef",
    name: "Beef Pizza",
    description: "Savory beef pizza with premium toppings",
    category: "pizza",
    price: { S: 130, M: 220, L: 280 },
    image: "/placeholder.svg?height=200&width=300&text=Beef+Pizza",
    available: true,
    popular: true,
  },
  {
    id: "mini-pizza-12",
    name: "Mini Pizza (12 pieces)",
    description: "Perfect for sharing - 12 mini pizzas with assorted toppings",
    category: "mini-pizza",
    price: 220,
    image: "/placeholder.svg?height=200&width=300&text=Mini+Pizza",
    available: true,
    popular: false,
  },
  {
    id: "kebbeh-6",
    name: "Kebbeh (6 pieces)",
    description: "Traditional Lebanese kebbeh, crispy and delicious",
    category: "kebbeh",
    price: 150,
    image: "/placeholder.svg?height=200&width=300&text=Kebbeh",
    available: true,
    popular: true,
  },
  {
    id: "fataya-6",
    name: "Fataya (6 pieces)",
    description: "Spinach-filled pastries, fresh and flavorful",
    category: "fataya",
    price: 120,
    image: "/placeholder.svg?height=200&width=300&text=Fataya",
    available: true,
    popular: false,
  },
]

const initialState: AdminState = {
  menuItems: [],
  isLoading: false,
  error: null,
}

export function AdminProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(adminReducer, initialState)

  // Load menu items from localStorage on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedItems = localStorage.getItem("admin-menu-items")
      if (savedItems) {
        try {
          const parsedItems = JSON.parse(savedItems)
          dispatch({ type: "LOAD_MENU_ITEMS", payload: parsedItems })
        } catch (error) {
          console.error("Error loading menu items:", error)
          // Load default items if parsing fails
          dispatch({ type: "LOAD_MENU_ITEMS", payload: initialMenuItems })
        }
      } else {
        // Load default items if no saved items
        dispatch({ type: "LOAD_MENU_ITEMS", payload: initialMenuItems })
      }
    }
  }, [])

  const addMenuItem = (item: Omit<MenuItem, "id">) => {
    const newItem: MenuItem = {
      ...item,
      id: `item-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    }
    dispatch({ type: "ADD_MENU_ITEM", payload: newItem })
  }

  const updateMenuItem = (id: string, updates: Partial<MenuItem>) => {
    dispatch({ type: "UPDATE_MENU_ITEM", payload: { id, updates } })
  }

  const deleteMenuItem = (id: string) => {
    dispatch({ type: "DELETE_MENU_ITEM", payload: id })
  }

  return (
    <AdminContext.Provider
      value={{
        ...state,
        addMenuItem,
        updateMenuItem,
        deleteMenuItem,
      }}
    >
      {children}
    </AdminContext.Provider>
  )
}

export function useAdmin() {
  const context = useContext(AdminContext)
  if (context === undefined) {
    throw new Error("useAdmin must be used within an AdminProvider")
  }
  return context
}
