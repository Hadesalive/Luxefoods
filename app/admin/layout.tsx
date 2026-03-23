import type React from "react"
import AdminShell from "@/components/admin/AdminShell"
import { createSupabaseServerClient } from "@/lib/supabase-server"

export const metadata = { title: "Admin — LUXE FOOD" }

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createSupabaseServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  const role = (user?.app_metadata?.role as string) ?? 'cashier'

  return <AdminShell role={role}>{children}</AdminShell>
}
