import { Metadata } from "next"
import { AdminProvider } from "@/contexts/AdminContext"
import { MenuProvider } from "@/contexts/MenuContext"
import { CartProvider } from "@/contexts/CartContext"
import { AdminHeader } from "@/components/admin/AdminHeader"
import AuthGuard from "@/components/auth/AuthGuard"

export const metadata: Metadata = {
  title: "Admin Dashboard | Kings Bakery",
  description: "Manage your bakery menu, orders, and settings for Kings Bakery in Freetown, Sierra Leone",
  robots: {
    index: false,
    follow: false,
  },
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <MenuProvider>
      <AdminProvider>
        <CartProvider>
          <AuthGuard>
            <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-indigo-50 dark:from-gray-950 dark:via-gray-900 dark:to-indigo-950">
              <AdminHeader />
              <main className="container mx-auto px-4 py-8">
                {children}
              </main>
            </div>
          </AuthGuard>
        </CartProvider>
      </AdminProvider>
    </MenuProvider>
  )
}
