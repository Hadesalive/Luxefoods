import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'
import { formatOrderRef } from '@/lib/order-service'

function serviceClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const date = searchParams.get('date') || new Date().toISOString().split('T')[0]
  const source = searchParams.get('source')
  const status = searchParams.get('status')

  const client = serviceClient()
  let query = client
    .from('orders')
    .select('*')
    .gte('created_at', `${date}T00:00:00.000Z`)
    .lte('created_at', `${date}T23:59:59.999Z`)
    .order('created_at', { ascending: false })

  if (source) query = query.eq('source', source)
  if (status) query = query.eq('status', status)

  const { data, error } = await query
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data ?? [])
}

export async function POST(request: NextRequest) {
  const body = await request.json()
  const client = serviceClient()

  const { data, error } = await client
    .from('orders')
    .insert([{
      order_ref:       body.order_ref || formatOrderRef(),
      source:          body.source || 'pos',
      status:          body.status ?? (body.source === 'pos' ? 'confirmed' : 'pending'),
      customer_name:   body.customer_name || null,
      customer_phone:  body.customer_phone || null,
      customer_address: body.customer_address || null,
      delivery_method: body.delivery_method || 'pickup',
      payment_method:  body.payment_method || 'cash',
      discount_amount: body.discount_amount || 0,
      items:           body.items,
      subtotal:        body.subtotal,
      total:           body.total,
      notes:           body.notes || null,
    }])
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data, { status: 201 })
}
