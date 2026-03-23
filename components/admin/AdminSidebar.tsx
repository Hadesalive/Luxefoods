"use client"

import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { SquaresFour, ShoppingBag, ClipboardText, ForkKnife, Tag, Article, Briefcase, Images } from "@phosphor-icons/react"
import { cn } from "@/lib/utils"

const nav = [
  { href: "/admin/dashboard",  label: "Dashboard",  icon: SquaresFour },
  { href: "/admin/pos",        label: "POS",         icon: ShoppingBag },
  { href: "/admin/orders",     label: "Orders",      icon: ClipboardText },
  { href: "/admin/menu",       label: "Menu",        icon: ForkKnife },
  { href: "/admin/categories", label: "Categories",  icon: Tag },
]

const manage = [
  { href: "/admin/content",  label: "Content",  icon: Article },
  { href: "/admin/services", label: "Services", icon: Briefcase },
  { href: "/admin/gallery",  label: "Gallery",  icon: Images },
]

export default function AdminSidebar() {
  const pathname = usePathname()

  const NavLink = ({ href, label, icon: Icon }: { href: string; label: string; icon: React.ElementType }) => {
    const active = pathname === href || pathname.startsWith(href + "/")
    return (
      <Link
        href={href}
        className={cn(
          "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all",
          active
            ? "bg-yellow-500/10 text-yellow-400"
            : "text-stone-400 hover:text-stone-100 hover:bg-stone-800"
        )}
      >
        <Icon
          size={16}
          weight={active ? "duotone" : "regular"}
          className={cn("flex-shrink-0", active ? "text-yellow-400" : "text-stone-500")}
        />
        {label}
        {active && <span className="ml-auto w-1 h-4 rounded-full bg-yellow-500" />}
      </Link>
    )
  }

  return (
    <aside className="hidden lg:flex fixed inset-y-0 left-0 w-64 flex-col bg-stone-950 border-r border-stone-800 z-40">
      {/* Logo */}
      <div className="flex items-center gap-3 px-6 h-16 border-b border-stone-800">
        <div className="w-8 h-8 relative flex-shrink-0">
          <Image src="/images/logo.png" alt="LUXE FOOD" fill className="object-contain" />
        </div>
        <div>
          <p className="text-sm font-bold text-yellow-400 tracking-wider">LUXE FOOD</p>
          <p className="text-[10px] text-stone-500">Admin Dashboard</p>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
        <p className="text-[9px] font-semibold text-stone-600 uppercase tracking-widest px-3 mb-2">Operations</p>
        {nav.map(item => <NavLink key={item.href} {...item} />)}
        <p className="text-[9px] font-semibold text-stone-600 uppercase tracking-widest px-3 mt-4 mb-2 pt-3 border-t border-stone-800">Manage</p>
        {manage.map(item => <NavLink key={item.href} {...item} />)}
      </nav>

      {/* Footer */}
      <div className="px-6 py-4 border-t border-stone-800">
        <p className="text-[10px] text-stone-600">LUXE FOOD · Admin v2</p>
      </div>
    </aside>
  )
}
