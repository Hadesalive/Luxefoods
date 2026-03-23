import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'

function serviceClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const body = await request.json()
  const client = serviceClient()

  const updates: Record<string, unknown> = { updated_at: new Date().toISOString() }
  if (body.status)         updates.status = body.status
  if (body.payment_method) updates.payment_method = body.payment_method
  if (body.notes !== undefined) updates.notes = body.notes

  const { data, error } = await client
    .from('orders')
    .update(updates)
    .eq('id', id)
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}
