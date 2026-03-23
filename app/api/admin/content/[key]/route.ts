import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"
import { revalidatePath } from "next/cache"

function db() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ key: string }> }
) {
  const { key } = await params
  const body = await request.json()

  const { data, error } = await db()
    .from("content_blocks")
    .update({ value: body.value })
    .eq("key", key)
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  revalidatePath("/", "layout")
  return NextResponse.json(data)
}
