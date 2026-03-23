"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { SquaresFour, ShoppingBag, ClipboardText, ForkKnife, DotsThree, Tag, Article, Briefcase, Images, UsersThree, X } from "@phosphor-icons/react"
import { cn } from "@/lib/utils"

const primary = [
  { href: "/admin/dashboard",  label: "Home",   icon: SquaresFour },
  { href: "/admin/pos",        label: "POS",    icon: ShoppingBag },
  { href: "/admin/orders",     label: "Orders", icon: ClipboardText },
  { href: "/admin/menu",       label: "Menu",   icon: ForkKnife },
]

const more = [
  { href: "/admin/categories", label: "Categories", icon: Tag },
  { href: "/admin/content",    label: "Content",    icon: Article },
  { href: "/admin/services",   label: "Services",   icon: Briefcase },
  { href: "/admin/gallery",    label: "Gallery",    icon: Images },
  { href: "/admin/users",      label: "Users",      icon: UsersThree },
]

export default function AdminBottomNav({ role }: { role: string }) {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)
  const isCashier = role === "cashier"

  if (isCashier) {
    return (
      <nav className="lg:hidden fixed bottom-0 inset-x-0 bg-stone-950 border-t border-stone-800 z-40">
        <div className="flex items-center justify-around h-16 px-2">
          <Link
            href="/admin/pos"
            className={cn(
              "flex flex-col items-center gap-1 px-3 py-2 rounded-xl transition-colors",
              pathname === "/admin/pos" ? "text-yellow-400" : "text-stone-500"
            )}
          >
            <ShoppingBag size={20} weight={pathname === "/admin/pos" ? "duotone" : "regular"} />
            <span className="text-[9px] font-medium">POS</span>
          </Link>
        </div>
      </nav>
    )
  }

  const isMoreActive = more.some(i => pathname === i.href || pathname.startsWith(i.href + "/"))

  return (
    <>
      {/* Backdrop */}
      {open && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-40"
          onClick={() => setOpen(false)}
        />
      )}

      {/* More drawer */}
      {open && (
        <div className="lg:hidden fixed bottom-16 inset-x-0 z-50 bg-stone-950 border-t border-stone-800 rounded-t-2xl shadow-2xl">
          <div className="flex items-center justify-between px-5 py-3 border-b border-stone-800">
            <span className="text-xs font-semibold text-stone-400 uppercase tracking-wider">More</span>
            <button onClick={() => setOpen(false)} className="w-7 h-7 rounded-lg bg-stone-800 flex items-center justify-center">
              <X size={14} className="text-stone-400" />
            </button>
          </div>
          <div className="grid grid-cols-3 gap-1 p-3">
            {more.map(({ href, label, icon: Icon }) => {
              const active = pathname === href || pathname.startsWith(href + "/")
              return (
                <Link
                  key={href}
                  href={href}
                  onClick={() => setOpen(false)}
                  className={cn(
                    "flex flex-col items-center gap-2 py-4 rounded-xl transition-colors",
                    active ? "bg-yellow-500/10 text-yellow-400" : "text-stone-400 hover:bg-stone-800 hover:text-stone-200"
                  )}
                >
                  <Icon size={22} weight={active ? "duotone" : "regular"} />
                  <span className="text-[10px] font-medium">{label}</span>
                </Link>
              )
            })}
          </div>
        </div>
      )}

      {/* Bottom bar */}
      <nav className="lg:hidden fixed bottom-0 inset-x-0 bg-stone-950 border-t border-stone-800 z-40">
        <div className="flex items-center justify-around h-16 px-2">
          {primary.map(({ href, label, icon: Icon }) => {
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

          {/* More button */}
          <button
            onClick={() => setOpen(v => !v)}
            className={cn(
              "flex flex-col items-center gap-1 px-3 py-2 rounded-xl transition-colors min-w-0",
              open || isMoreActive ? "text-yellow-400" : "text-stone-500 hover:text-stone-300"
            )}
          >
            <DotsThree size={20} weight={open || isMoreActive ? "duotone" : "regular"} className="flex-shrink-0" />
            <span className="text-[9px] font-medium">More</span>
          </button>
        </div>
      </nav>
    </>
  )
}
