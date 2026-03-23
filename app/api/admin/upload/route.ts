import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

const BUCKET = "media"

function db() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
}

export async function POST(request: Request) {
  const formData = await request.formData()
  const file = formData.get("file") as File | null

  if (!file) {
    return NextResponse.json({ error: "No file provided" }, { status: 400 })
  }

  // Validate type
  if (!file.type.startsWith("image/")) {
    return NextResponse.json({ error: "Only image files are allowed" }, { status: 400 })
  }

  // Validate size (5 MB)
  if (file.size > 5 * 1024 * 1024) {
    return NextResponse.json({ error: "File too large (max 5 MB)" }, { status: 400 })
  }

  const ext = file.name.split(".").pop()?.toLowerCase() ?? "jpg"
  const name = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`
  const path = `uploads/${name}`

  const arrayBuffer = await file.arrayBuffer()
  const { error } = await db().storage.from(BUCKET).upload(path, arrayBuffer, {
    contentType: file.type,
    upsert: false,
  })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  const { data } = db().storage.from(BUCKET).getPublicUrl(path)
  return NextResponse.json({ url: data.publicUrl })
}
