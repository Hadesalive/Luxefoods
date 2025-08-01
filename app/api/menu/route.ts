import { NextResponse } from "next/server"
import { MenuService } from "@/lib/menu-service"

// Enable static generation to reduce function calls
export const revalidate = 300 // 5 minutes

export async function GET() {
  try {
    // Get menu items with categories and sizes
    const menuItems = await MenuService.getMenuItems(true)
    
    // Get categories
    const categories = await MenuService.getCategories(true)

    return NextResponse.json(
      {
        success: true,
        data: {
          menuItems,
          categories,
        },
        cached: true,
        timestamp: new Date().toISOString(),
      },
      {
        headers: {
          "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600",
        },
      },
    )
  } catch (error) {
    console.error("Menu API Error:", error)
    return NextResponse.json({ success: false, error: "Failed to fetch menu items" }, { status: 500 })
  }
}
