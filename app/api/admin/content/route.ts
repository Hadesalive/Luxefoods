import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

function db() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
}

export async function GET() {
  const { data, error } = await db()
    .from("content_blocks")
    .select("*")
    .order("group")
    .order("key")

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data ?? [])
}
