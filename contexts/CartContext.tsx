"use client"

import { createContext, useContext, useReducer, useEffect, type ReactNode } from "react"

interface MenuItem {
  id: string
  name: string
  price: number
  type: string
  size?: string
  options?: string[]
  quantity?: number
}

interface CartState {
  items: MenuItem[]
}

interface CartContextType extends CartState {
  addItem: (item: MenuItem) => void
  removeItem: (itemId: string) => void
  clearCart: () => void
  getTotal: () => number
}

const CartContext = createContext<CartContextType | undefined>(undefined)

type CartAction =
  | { type: "ADD_ITEM"; payload: MenuItem }
  | { type: "REMOVE_ITEM"; payload: string }
  | { type: "CLEAR_CART" }
  | { type: "LOAD_CART"; payload: MenuItem[] }

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case "ADD_ITEM":
      const newState = {
        ...state,
        items: [...state.items, action.payload],
      }
      // Save to localStorage
      if (typeof window !== "undefined") {
        localStorage.setItem("cart", JSON.stringify(newState.items))
      }
      return newState

    case "REMOVE_ITEM":
      const filteredState = {
        ...state,
        items: state.items.filter((item) => item.id !== action.payload),
      }
      // Save to localStorage
      if (typeof window !== "undefined") {
        localStorage.setItem("cart", JSON.stringify(filteredState.items))
      }
      return filteredState

    case "CLEAR_CART":
      // Clear localStorage
      if (typeof window !== "undefined") {
        localStorage.removeItem("cart")
      }
      return { items: [] }

    case "LOAD_CART":
      return { items: action.payload }

    default:
      return state
  }
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, { items: [] })

  // Load cart from localStorage on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedCart = localStorage.getItem("cart")
      if (savedCart) {
        try {
          const parsedCart = JSON.parse(savedCart)
          dispatch({ type: "LOAD_CART", payload: parsedCart })
        } catch (error) {
          console.error("Error loading cart from localStorage:", error)
        }
      }
    }
  }, [])

  const addItem = (item: MenuItem) => {
    dispatch({ type: "ADD_ITEM", payload: item })
  }

  const removeItem = (itemId: string) => {
    dispatch({ type: "REMOVE_ITEM", payload: itemId })
  }

  const clearCart = () => {
    dispatch({ type: "CLEAR_CART" })
  }

  const getTotal = () => {
    return state.items.reduce((total, item) => total + item.price * (item.quantity || 1), 0)
  }

  return (
    <CartContext.Provider
      value={{
        ...state,
        addItem,
        removeItem,
        clearCart,
        getTotal,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider")
  }
  return context
}
