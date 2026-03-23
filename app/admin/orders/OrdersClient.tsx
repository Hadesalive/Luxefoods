"use client"

import { useState, useEffect, useCallback } from "react"
import { ArrowClockwise, Clock, Globe, ShoppingBag } from "@phosphor-icons/react"
import { type Order, STATUS_LABELS, STATUS_COLORS, STATUS_TRANSITIONS } from "@/lib/order-service"
import { toast } from "sonner"
import { cn } from "@/lib/utils"

const SOURCE_FILTERS = ["all", "online", "pos"] as const
const STATUS_FILTERS = ["all", "pending", "confirmed", "preparing", "ready", "delivered", "cancelled"] as const

function timeAgo(iso: string) {
  const diff = Math.floor((Date.now() - new Date(iso).getTime()) / 1000)
  if (diff < 60) return `${diff}s ago`
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`
  return new Date(iso).toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" })
}

function OrderCard({ order, onStatusChange }: { order: Order; onStatusChange: (id: string, status: string) => void }) {
  const colors = STATUS_COLORS[order.status]
  const transitions = STATUS_TRANSITIONS[order.status]

  return (
    <div className="bg-white rounded-2xl border border-stone-100 p-4 lg:p-5">
      {/* Header row */}
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <p className="text-sm font-bold text-stone-900 font-mono">{order.order_ref}</p>
            <span className={cn("inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full", colors.bg, colors.text)}>
              {STATUS_LABELS[order.status]}
            </span>
            <span className={cn(
              "inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full",
              order.source === "online" ? "bg-blue-500/10 text-blue-500" : "bg-purple-500/10 text-purple-500"
            )}>
              {order.source === "online"
                ? <Globe size={10} weight="fill" />
                : <ShoppingBag size={10} weight="fill" />}
              {order.source === "online" ? "Online" : "POS"}
            </span>
          </div>
          <p className="text-xs text-stone-400 flex items-center gap-1 mt-0.5">
            <Clock size={12} />
            {timeAgo(order.created_at)}
          </p>
        </div>
        <p className="text-sm font-bold text-stone-900 flex-shrink-0">NLe {order.total.toFixed(0)}</p>
      </div>

      {/* Customer */}
      {(order.customer_name || order.customer_phone) && (
        <div className="mb-3 py-2 px-3 bg-stone-50 rounded-xl">
          {order.customer_name && <p className="text-xs font-medium text-stone-700">{order.customer_name}</p>}
          {order.customer_phone && <p className="text-xs text-stone-400">{order.customer_phone}</p>}
          {order.customer_address && <p className="text-xs text-stone-400 mt-0.5">{order.customer_address}</p>}
        </div>
      )}

      {/* Items */}
      <div className="mb-3 space-y-0.5">
        {(order.items as Array<{name: string; quantity: number; price: number}>).map((item, i) => (
          <div key={i} className="flex items-center justify-between text-xs">
            <span className="text-stone-600">{item.name} × {item.quantity}</span>
            <span className="text-stone-500">NLe {(item.price * item.quantity).toFixed(0)}</span>
          </div>
        ))}
        {order.discount_amount > 0 && (
          <div className="flex justify-between text-xs text-green-600 pt-0.5">
            <span>Discount</span><span>−NLe {order.discount_amount.toFixed(0)}</span>
          </div>
        )}
      </div>

      {/* Meta */}
      <div className="flex items-center gap-3 text-[10px] text-stone-400 mb-3">
        <span className="capitalize">{order.payment_method?.replace("_", " ")}</span>
        <span>·</span>
        <span className="capitalize">{order.delivery_method}</span>
        {order.notes && <><span>·</span><span className="italic truncate max-w-[120px]">{order.notes}</span></>}
      </div>

      {/* Status actions */}
      {transitions.length > 0 && (
        <div className="flex flex-wrap gap-2 pt-2 border-t border-stone-100">
          {transitions.map(next => (
            <button
              key={next}
              onClick={() => onStatusChange(order.id, next)}
              className={cn(
                "px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors",
                next === "cancelled"
                  ? "bg-red-50 text-red-600 hover:bg-red-100"
                  : "bg-yellow-50 text-stone-800 hover:bg-yellow-100"
              )}
            >
              → {STATUS_LABELS[next]}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

export default function OrdersClient() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [lastSync, setLastSync] = useState<Date | null>(null)
  const [sourceFilter, setSourceFilter] = useState<typeof SOURCE_FILTERS[number]>("all")
  const [statusFilter, setStatusFilter] = useState<typeof STATUS_FILTERS[number]>("all")
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split("T")[0])

  const load = useCallback(async (showSpinner = false) => {
    if (showSpinner) setLoading(true)
    try {
      const params = new URLSearchParams({ date: selectedDate })
      if (sourceFilter !== "all") params.set("source", sourceFilter)
      const res = await fetch(`/api/admin/orders?${params}`)
      if (res.ok) {
        setOrders(await res.json())
        setLastSync(new Date())
      }
    } finally {
      if (showSpinner) setLoading(false)
    }
  }, [selectedDate, sourceFilter])

  useEffect(() => {
    load(true)
    const interval = setInterval(() => load(false), 30_000)
    return () => clearInterval(interval)
  }, [load])

  const handleStatusChange = async (id: string, status: string) => {
    setOrders(prev => prev.map(o => o.id === id ? { ...o, status: status as Order["status"] } : o))
    try {
      const res = await fetch(`/api/admin/orders/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      })
      if (!res.ok) throw new Error()
      toast.success("Status updated")
    } catch {
      load(false)
      toast.error("Failed to update status")
    }
  }

  const filtered = orders.filter(o => statusFilter === "all" || o.status === statusFilter)
  const pendingCount = orders.filter(o => o.status === "pending").length

  return (
    <div className="p-4 lg:p-8 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div>
          <h1 className="text-xl lg:text-2xl font-bold text-stone-900 flex items-center gap-2">
            Orders
            {pendingCount > 0 && (
              <span className="bg-yellow-500 text-stone-900 text-xs font-bold px-2 py-0.5 rounded-full">{pendingCount}</span>
            )}
          </h1>
          {lastSync && <p className="text-xs text-stone-400 mt-0.5">Synced {lastSync.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit", second: "2-digit" })} · auto-refreshes every 30s</p>}
        </div>
        <div className="flex items-center gap-2">
          <input
            type="date"
            value={selectedDate}
            onChange={e => setSelectedDate(e.target.value)}
            className="px-3 py-2 bg-white border border-stone-200 rounded-lg text-sm text-stone-600 outline-none"
          />
          <button onClick={() => load(true)} className="p-2 bg-white border border-stone-200 rounded-lg hover:bg-stone-50 transition-colors">
            <ArrowClockwise size={16} className={`text-stone-500 ${loading ? "animate-spin" : ""}`} />
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-5">
        <div className="flex gap-1.5">
          {SOURCE_FILTERS.map(f => (
            <button key={f} onClick={() => setSourceFilter(f)}
              className={cn("px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-colors",
                sourceFilter === f ? "bg-stone-900 text-white" : "bg-white border border-stone-200 text-stone-500 hover:bg-stone-50"
              )}>
              {f === "all" ? "All Sources" : f}
            </button>
          ))}
        </div>
        <div className="flex gap-1.5 overflow-x-auto pb-1">
          {STATUS_FILTERS.map(f => (
            <button key={f} onClick={() => setStatusFilter(f)}
              className={cn("flex-none px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-colors whitespace-nowrap",
                statusFilter === f ? "bg-stone-900 text-white" : "bg-white border border-stone-200 text-stone-500 hover:bg-stone-50"
              )}>
              {f === "all" ? "All Statuses" : STATUS_LABELS[f as Order["status"]]}
            </button>
          ))}
        </div>
      </div>

      {/* Order list */}
      {loading ? (
        <div className="grid sm:grid-cols-2 gap-3">
          {[...Array(4)].map((_, i) => <div key={i} className="h-40 bg-white rounded-2xl border border-stone-100 animate-pulse" />)}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-stone-400 text-sm">No orders found</p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 gap-3">
          {filtered.map(order => (
            <OrderCard key={order.id} order={order} onStatusChange={handleStatusChange} />
          ))}
        </div>
      )}
    </div>
  )
}
