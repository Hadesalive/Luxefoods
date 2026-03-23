import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'

function serviceClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
}

export async function GET() {
  const client = serviceClient()
  const { data, error } = await client
    .from('menu_items')
    .select('*, category:categories(*), sizes:menu_item_sizes(*), options:menu_item_options(*)')
    .order('sort_order', { ascending: true })
    .order('name', { ascending: true })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data ?? [])
}

export async function POST(request: NextRequest) {
  const body = await request.json()
  const client = serviceClient()

  const { data, error } = await client
    .from('menu_items')
    .insert([{
      name:        body.name,
      description: body.description || null,
      price:       body.price,
      category_id: body.category_id,
      image_url:   body.image_url || null,
      is_available: body.is_available ?? true,
      is_popular:  body.is_popular ?? false,
      sort_order:  body.sort_order ?? 0,
    }])
    .select('*, category:categories(*)')
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data, { status: 201 })
}
