"use client"

import { usePathname } from "next/navigation"
import AdminSidebar from "./AdminSidebar"
import AdminBottomNav from "./AdminBottomNav"

export default function AdminShell({ children, role }: { children: React.ReactNode; role: string }) {
  const pathname = usePathname()

  if (pathname === "/admin/login") {
    return <>{children}</>
  }

  return (
    <div className="min-h-screen bg-stone-950">
      <AdminSidebar role={role} />
      <div className="lg:pl-64 pb-16 lg:pb-0">
        {children}
      </div>
      <AdminBottomNav role={role} />
    </div>
  )
}
