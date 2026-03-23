import AdminSidebar from "@/components/admin/AdminSidebar"
import AdminBottomNav from "@/components/admin/AdminBottomNav"

export const metadata = { title: "Admin — LUXE FOOD" }

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-stone-50">
      <AdminSidebar />
      <div className="lg:pl-64 pb-16 lg:pb-0">
        {children}
      </div>
      <AdminBottomNav />
    </div>
  )
}
