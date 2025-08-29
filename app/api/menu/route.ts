import { NextResponse } from "next/server"
import { MenuService, type MenuItemWithCategory, type Category } from "@/lib/menu-service"

// Enable static generation with longer cache to reduce function calls
export const revalidate = 900 // 15 minutes (matches service cache)

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const limit = searchParams.get('limit') ? parseInt(searchParams.get('limit')!, 10) : undefined
    const category = searchParams.get('category')
    const page = searchParams.get('page') ? parseInt(searchParams.get('page')!, 10) : 1
    const pageSize = searchParams.get('pageSize') ? parseInt(searchParams.get('pageSize')!, 10) : 12

    let data: {
      menuItems?: MenuItemWithCategory[]
      categories?: Category[]
      total: number
      hasMore?: boolean
      page?: number
      pageSize?: number
    } = { total: 0 }

    if (category) {
      // Get paginated items by category
      const result = await MenuService.getMenuItemsByCategory(category, page, pageSize)
      data = {
        menuItems: result.items,
        total: result.total,
        hasMore: result.hasMore,
        page,
        pageSize
      }
    } else {
      // Get all menu items (with optional limit)
      const [menuItems, categories] = await Promise.all([
        MenuService.getMenuItems(true, limit),
        MenuService.getCategories(true)
      ])
      
      data = {
        menuItems,
        categories,
        total: menuItems.length
      }
    }

    return NextResponse.json(
      {
        success: true,
        data,
        cached: true,
        timestamp: new Date().toISOString(),
        revalidated: new Date().toISOString(),
      },
      {
        headers: {
          "Cache-Control": "public, s-maxage=900, stale-while-revalidate=1800",
          "CDN-Cache-Control": "public, s-maxage=900",
          "Vercel-CDN-Cache-Control": "public, s-maxage=900",
        },
      },
    )
  } catch (error) {
    console.error("Menu API Error:", error)
    return NextResponse.json(
      { 
        success: false, 
        error: "Failed to fetch menu items",
        timestamp: new Date().toISOString()
      }, 
      { status: 500 }
    )
  }
}
