import { cache } from "react"
import { createClient } from "@supabase/supabase-js"

export interface ServiceData {
  id: string
  title: string
  slug: string
  description: string | null
  image_url: string | null
  icon: string | null
  is_active: boolean
  sort_order: number
}

function db() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { global: { fetch: (url, opts) => fetch(url, { ...opts, cache: "no-store" }) } }
  )
}

export const getPublicServices = cache(async (): Promise<ServiceData[]> => {
  try {
    const { data } = await db()
      .from("services")
      .select("id, title, slug, description, image_url, icon, is_active, sort_order")
      .eq("is_active", true)
      .order("sort_order")
      .order("created_at")

    if (data?.length) return data
  } catch {}
  return []
})
