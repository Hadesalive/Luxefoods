import { NextResponse } from "next/server"
import { MenuService } from "@/lib/menu-service"

export async function GET() {
  try {
    const categories = await MenuService.getCategories(false) // Don't use cache for admin
    return NextResponse.json({ success: true, data: categories })
  } catch (error) {
    console.error("Categories API Error:", error)
    return NextResponse.json({ success: false, error: "Failed to fetch categories" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const category = await MenuService.createCategory(body)
    return NextResponse.json({ success: true, data: category })
  } catch (error) {
    console.error("Create Category Error:", error)
    return NextResponse.json({ success: false, error: "Failed to create category" }, { status: 500 })
  }
} 