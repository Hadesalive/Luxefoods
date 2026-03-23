"use client"

import { useState, useEffect, useCallback, useReducer } from "react"
import Image from "next/image"
import { Plus, Minus, X, ShoppingBag, Check, CaretRight } from "@phosphor-icons/react"
import { Drawer } from "vaul"
import { MenuService, type MenuItemWithCategory, type Category } from "@/lib/menu-service"
import { formatOrderRef } from "@/lib/order-service"
import { toast } from "sonner"
import { cn } from "@/lib/utils"

// ── Cart state ──────────────────────────────────────────────
interface CartItem {
  id: string
  name: string
  price: number
  quantity: number
  image_url?: string | null
}
type CartAction =
  | { type: "ADD"; item: CartItem }
  | { type: "INC"; id: string }
  | { type: "DEC"; id: string }
  | { type: "REMOVE"; id: string }
  | { type: "CLEAR" }

function cartReducer(state: CartItem[], action: CartAction): CartItem[] {
  switch (action.type) {
    case "ADD": {
      const exists = state.find(i => i.id === action.item.id)
      if (exists) return state.map(i => i.id === action.item.id ? { ...i, quantity: i.quantity + 1 } : i)
      return [...state, { ...action.item, quantity: 1 }]
    }
    case "INC": return state.map(i => i.id === action.id ? { ...i, quantity: i.quantity + 1 } : i)
    case "DEC": return state.map(i => i.id === action.id ? { ...i, quantity: Math.max(1, i.quantity - 1) } : i)
    case "REMOVE": return state.filter(i => i.id !== action.id)
    case "CLEAR": return []
    default: return state
  }
}

// ── POS Item card ───────────────────────────────────────────
function POSItem({ item, onAdd, flash }: { item: MenuItemWithCategory; onAdd: () => void; flash: boolean }) {
  return (
    <button
      onClick={onAdd}
      disabled={!item.is_available}
      className={cn(
        "relative bg-stone-900 rounded-xl overflow-hidden text-left transition-all active:scale-95 border",
        item.is_available ? "border-stone-800 hover:border-yellow-500/50" : "opacity-40 cursor-not-allowed border-stone-800",
        flash && "border-yellow-500 ring-1 ring-yellow-500/30"
      )}
    >
      <div className="relative aspect-square bg-stone-800">
        {item.image_url ? (
          <Image src={item.image_url} alt={item.name} fill className="object-cover" sizes="33vw" />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <ShoppingBag size={32} weight="duotone" className="text-stone-700" />
          </div>
        )}
        {flash && (
          <div className="absolute inset-0 bg-yellow-500/20 flex items-center justify-center">
            <Check size={24} weight="bold" className="text-yellow-400" />
          </div>
        )}
      </div>
      <div className="p-2.5">
        <p className="text-white text-xs font-semibold leading-tight line-clamp-2 mb-1">{item.name}</p>
        <p className="text-yellow-400 text-xs font-bold">NLe {item.price.toFixed(0)}</p>
      </div>
    </button>
  )
}

// ── Main POS ────────────────────────────────────────────────
export default function POSClient() {
  const [menuItems, setMenuItems] = useState<MenuItemWithCategory[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [activeCategory, setActiveCategory] = useState("all")
  const [cart, dispatch] = useReducer(cartReducer, [])
  const [cartOpen, setCartOpen] = useState(false)
  const [flash, setFlash] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  // Checkout state
  const [customerName, setCustomerName] = useState("")
  const [customerPhone, setCustomerPhone] = useState("")
  const [paymentMethod, setPaymentMethod] = useState<"cash" | "card" | "mobile_money">("cash")
  const [discount, setDiscount] = useState(0)
  const [placing, setPlacing] = useState(false)
  const [success, setSuccess] = useState(false)

  useEffect(() => {
    Promise.all([MenuService.getMenuItems(), MenuService.getCategories()]).then(([items, cats]) => {
      setMenuItems(items)
      setCategories(cats)
      setLoading(false)
    })
  }, [])

  const filtered = activeCategory === "all"
    ? menuItems
    : menuItems.filter(i => i.category?.slug === activeCategory)

  const cartCount = cart.reduce((s, i) => s + i.quantity, 0)
  const subtotal = cart.reduce((s, i) => s + i.price * i.quantity, 0)
  const total = Math.max(0, subtotal - discount)

  const handleAdd = useCallback((item: MenuItemWithCategory) => {
    dispatch({ type: "ADD", item: { id: item.id, name: item.name, price: item.price, quantity: 1, image_url: item.image_url } })
    setFlash(item.id)
    setTimeout(() => setFlash(null), 600)
  }, [])

  const handleCheckout = async () => {
    if (cart.length === 0) return
    setPlacing(true)
    try {
      const res = await fetch("/api/admin/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          order_ref:      formatOrderRef(),
          source:         "pos",
          status:         "confirmed",
          customer_name:  customerName || null,
          customer_phone: customerPhone || null,
          delivery_method: "pickup",
          payment_method: paymentMethod,
          discount_amount: discount,
          items: cart.map(i => ({ id: i.id, name: i.name, price: i.price, quantity: i.quantity })),
          subtotal,
          total,
        }),
      })
      if (!res.ok) throw new Error("Failed")
      setSuccess(true)
      setTimeout(() => {
        dispatch({ type: "CLEAR" })
        setCustomerName("")
        setCustomerPhone("")
        setDiscount(0)
        setPaymentMethod("cash")
        setCartOpen(false)
        setSuccess(false)
      }, 1800)
      toast.success("Order placed!")
    } catch {
      toast.error("Failed to place order. Try again.")
    } finally {
      setPlacing(false)
    }
  }

  return (
    <div className="flex flex-col bg-stone-950 min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-stone-800">
        <div>
          <h1 className="text-white font-bold text-base">Point of Sale</h1>
          <p className="text-stone-500 text-[10px]">{new Date().toLocaleDateString("en-GB", { weekday: "short", day: "numeric", month: "short" })}</p>
        </div>
        {cartCount > 0 && (
          <button
            onClick={() => setCartOpen(true)}
            className="flex items-center gap-2 bg-yellow-500 hover:bg-yellow-400 text-stone-900 px-3 py-2 rounded-xl text-sm font-semibold transition-colors"
          >
            <ShoppingBag size={16} weight="fill" />
            {cartCount} · NLe {total.toFixed(0)}
          </button>
        )}
      </div>

      {/* Category tabs */}
      <div className="overflow-x-auto border-b border-stone-800">
        <div className="flex gap-1 px-3 py-2 min-w-max">
          <button
            onClick={() => setActiveCategory("all")}
            className={cn(
              "px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors",
              activeCategory === "all" ? "bg-yellow-500 text-stone-900" : "text-stone-400 hover:text-stone-200 hover:bg-stone-800"
            )}
          >
            All
          </button>
          {categories.map(cat => (
            <button
              key={cat.slug}
              onClick={() => setActiveCategory(cat.slug)}
              className={cn(
                "px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors",
                activeCategory === cat.slug ? "bg-yellow-500 text-stone-900" : "text-stone-400 hover:text-stone-200 hover:bg-stone-800"
              )}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      {/* Item grid */}
      <div className="flex-1 overflow-y-auto p-3 pb-24">
        {loading ? (
          <div className="grid grid-cols-3 gap-2">
            {[...Array(9)].map((_, i) => (
              <div key={i} className="bg-stone-900 rounded-xl aspect-square animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2">
            {filtered.map(item => (
              <POSItem
                key={item.id}
                item={item}
                onAdd={() => handleAdd(item)}
                flash={flash === item.id}
              />
            ))}
          </div>
        )}
      </div>

      {/* Sticky cart bar */}
      {cartCount > 0 && (
        <div className="fixed bottom-16 lg:bottom-0 inset-x-0 z-30 px-4 pb-3 pt-2 bg-gradient-to-t from-stone-950 via-stone-950 to-transparent">
          <button
            onClick={() => setCartOpen(true)}
            className="w-full flex items-center justify-between bg-yellow-500 hover:bg-yellow-400 text-stone-900 px-5 py-3.5 rounded-2xl font-semibold transition-colors"
          >
            <span className="flex items-center gap-2">
              <ShoppingBag size={20} weight="fill" />
              {cartCount} item{cartCount !== 1 ? "s" : ""}
            </span>
            <span className="flex items-center gap-1">
              NLe {total.toFixed(0)}
              <CaretRight size={16} weight="bold" />
            </span>
          </button>
        </div>
      )}

      {/* Cart drawer */}
      <Drawer.Root open={cartOpen} onOpenChange={setCartOpen}>
        <Drawer.Portal>
          <Drawer.Overlay className="fixed inset-0 bg-black/60 z-40" />
          <Drawer.Content className="fixed bottom-0 left-0 right-0 z-50 bg-stone-950 rounded-t-2xl border-t border-stone-800 max-h-[92vh] flex flex-col lg:max-w-md lg:left-auto lg:right-6 lg:bottom-6 lg:rounded-2xl lg:border">
            <Drawer.Title className="sr-only">Order Summary</Drawer.Title>
            <div className="flex justify-center pt-3 pb-1 flex-shrink-0">
              <div className="w-10 h-1 rounded-full bg-stone-700" />
            </div>

            {success ? (
              <div className="flex-1 flex flex-col items-center justify-center gap-3 py-12">
                <div className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center">
                  <Check size={32} weight="bold" className="text-green-400" />
                </div>
                <p className="text-white font-bold text-lg">Order Placed!</p>
                <p className="text-stone-400 text-sm">Sending to kitchen…</p>
              </div>
            ) : (
              <>
                {/* Cart header */}
                <div className="flex items-center justify-between px-5 py-3 border-b border-stone-800 flex-shrink-0">
                  <h2 className="text-white font-bold">Order ({cartCount})</h2>
                  <button
                    onClick={() => dispatch({ type: "CLEAR" })}
                    className="text-xs text-stone-500 hover:text-red-400 transition-colors"
                  >
                    Clear all
                  </button>
                </div>

                {/* Items */}
                <div className="flex-1 overflow-y-auto px-5 py-3 space-y-2">
                  {cart.map(item => (
                    <div key={item.id} className="flex items-center gap-3">
                      <div className="flex-1 min-w-0">
                        <p className="text-white text-sm font-medium truncate">{item.name}</p>
                        <p className="text-stone-400 text-xs">NLe {item.price.toFixed(0)} each</p>
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <button onClick={() => dispatch({ type: "DEC", id: item.id })} className="w-7 h-7 rounded-full bg-stone-800 hover:bg-stone-700 flex items-center justify-center transition-colors">
                          <Minus size={12} weight="bold" className="text-stone-300" />
                        </button>
                        <span className="w-5 text-center text-white text-sm font-semibold">{item.quantity}</span>
                        <button onClick={() => dispatch({ type: "INC", id: item.id })} className="w-7 h-7 rounded-full bg-stone-800 hover:bg-stone-700 flex items-center justify-center transition-colors">
                          <Plus size={12} weight="bold" className="text-stone-300" />
                        </button>
                        <button onClick={() => dispatch({ type: "REMOVE", id: item.id })} className="w-7 h-7 rounded-full hover:bg-red-500/20 flex items-center justify-center transition-colors ml-1">
                          <X size={12} weight="bold" className="text-stone-500 hover:text-red-400" />
                        </button>
                      </div>
                      <p className="text-yellow-400 text-sm font-bold w-16 text-right flex-shrink-0">
                        NLe {(item.price * item.quantity).toFixed(0)}
                      </p>
                    </div>
                  ))}
                </div>

                {/* Checkout form */}
                <div className="px-5 py-4 border-t border-stone-800 space-y-3 flex-shrink-0">
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      value={customerName}
                      onChange={e => setCustomerName(e.target.value)}
                      placeholder="Customer name"
                      className="px-3 py-2 bg-stone-900 border border-stone-700 rounded-lg text-white text-sm placeholder:text-stone-500 outline-none focus:border-yellow-500/50"
                    />
                    <input
                      value={customerPhone}
                      onChange={e => setCustomerPhone(e.target.value)}
                      placeholder="Phone (optional)"
                      className="px-3 py-2 bg-stone-900 border border-stone-700 rounded-lg text-white text-sm placeholder:text-stone-500 outline-none focus:border-yellow-500/50"
                    />
                  </div>

                  {/* Payment method */}
                  <div className="grid grid-cols-3 gap-2">
                    {(["cash", "card", "mobile_money"] as const).map(pm => (
                      <button
                        key={pm}
                        onClick={() => setPaymentMethod(pm)}
                        className={cn(
                          "py-2 rounded-lg text-xs font-semibold transition-colors border",
                          paymentMethod === pm
                            ? "bg-yellow-500 text-stone-900 border-yellow-500"
                            : "bg-stone-900 text-stone-400 border-stone-700 hover:border-stone-500"
                        )}
                      >
                        {pm === "cash" ? "Cash" : pm === "card" ? "Card" : "Mobile"}
                      </button>
                    ))}
                  </div>

                  {/* Discount */}
                  <div className="flex items-center gap-3">
                    <label className="text-xs text-stone-400 w-20 flex-shrink-0">Discount</label>
                    <div className="flex items-center gap-1 bg-stone-900 border border-stone-700 rounded-lg px-3 py-2 flex-1">
                      <span className="text-stone-500 text-xs">NLe</span>
                      <input
                        type="number"
                        min={0}
                        value={discount || ""}
                        onChange={e => setDiscount(Math.max(0, Number(e.target.value)))}
                        placeholder="0"
                        className="bg-transparent text-white text-sm outline-none w-full"
                      />
                    </div>
                  </div>

                  {/* Totals */}
                  <div className="space-y-1 py-2 border-t border-stone-800">
                    <div className="flex justify-between text-sm text-stone-400">
                      <span>Subtotal</span><span>NLe {subtotal.toFixed(0)}</span>
                    </div>
                    {discount > 0 && (
                      <div className="flex justify-between text-sm text-green-400">
                        <span>Discount</span><span>−NLe {discount.toFixed(0)}</span>
                      </div>
                    )}
                    <div className="flex justify-between font-bold text-white text-base pt-1">
                      <span>Total</span><span>NLe {total.toFixed(0)}</span>
                    </div>
                  </div>

                  <button
                    onClick={handleCheckout}
                    disabled={placing || cart.length === 0}
                    className="w-full bg-yellow-500 hover:bg-yellow-400 disabled:bg-stone-700 text-stone-900 disabled:text-stone-500 font-bold py-3.5 rounded-xl transition-colors text-sm"
                  >
                    {placing ? "Placing…" : `Complete Sale · NLe ${total.toFixed(0)}`}
                  </button>
                </div>
              </>
            )}
          </Drawer.Content>
        </Drawer.Portal>
      </Drawer.Root>
    </div>
  )
}
