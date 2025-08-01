import { NextResponse } from "next/server"
import { MenuService } from "@/lib/menu-service"

export async function GET() {
  try {
    const menuItems = await MenuService.getMenuItems(false) // Don't use cache for admin
    return NextResponse.json({ success: true, data: menuItems })
  } catch (error) {
    console.error("Menu Items API Error:", error)
    return NextResponse.json({ success: false, error: "Failed to fetch menu items" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const menuItem = await MenuService.createMenuItem(body)
    return NextResponse.json({ success: true, data: menuItem })
  } catch (error) {
    console.error("Create Menu Item Error:", error)
    return NextResponse.json({ success: false, error: "Failed to create menu item" }, { status: 500 })
  }
} 