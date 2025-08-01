"use client"

import { useAdmin } from "@/contexts/AdminContext"

export function useMenuItems() {
  const { menuItems, addMenuItem, updateMenuItem, deleteMenuItem } = useAdmin()

  return {
    menuItems,
    addMenuItem,
    updateMenuItem,
    deleteMenuItem,
  }
}
