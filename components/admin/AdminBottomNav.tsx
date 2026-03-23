"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { SquaresFour, ShoppingBag, ClipboardText, ForkKnife, DotsThree } from "@phosphor-icons/react"
import { cn } from "@/lib/utils"

const nav = [
  { href: "/admin/dashboard",  label: "Home",    icon: SquaresFour },
  { href: "/admin/pos",        label: "POS",     icon: ShoppingBag },
  { href: "/admin/orders",     label: "Orders",  icon: ClipboardText },
  { href: "/admin/menu",       label: "Menu",    icon: ForkKnife },
  { href: "/admin/categories", label: "More",    icon: DotsThree },
]

export default function AdminBottomNav({ role }: { role: string }) {
  const pathname = usePathname()
  const isCashier = role === 'cashier'
  const items = isCashier
    ? [{ href: "/admin/pos", label: "POS", icon: ShoppingBag }]
    : nav

  return (
    <nav className="lg:hidden fixed bottom-0 inset-x-0 bg-stone-950 border-t border-stone-800 z-40 safe-area-bottom">
      <div className="flex items-center justify-around h-16 px-2">
        {items.map(({ href, label, icon: Icon }) => {
          const active = pathname === href || pathname.startsWith(href + "/")
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex flex-col items-center gap-1 px-3 py-2 rounded-xl transition-colors min-w-0",
                active ? "text-yellow-400" : "text-stone-500 hover:text-stone-300"
              )}
            >
              <Icon size={20} weight={active ? "duotone" : "regular"} className="flex-shrink-0" />
              <span className="text-[9px] font-medium truncate">{label}</span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
