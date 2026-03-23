"use client"

import { useState, useEffect, useCallback } from "react"
import { TrendUp, ShoppingBag, Clock, Money, ArrowClockwise } from "@phosphor-icons/react"
import { type Order, computeStats } from "@/lib/order-service"
import { STATUS_LABELS, STATUS_COLORS } from "@/lib/order-service"

function formatTime(iso: string) {
  return new Date(iso).toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" })
}

function formatCurrency(n: number) {
  return `NLe ${n.toFixed(0)}`
}

function hourlyBuckets(orders: Order[]) {
  const buckets: Record<string, number> = {}
  for (let h = 8; h <= 22; h++) {
    buckets[`${h}`] = 0
  }
  orders.forEach(o => {
    if (o.status === "cancelled") return
    const h = new Date(o.created_at).getHours()
    const key = `${h}`
    if (key in buckets) buckets[key] += o.total
  })
  return Object.entries(buckets).map(([hour, revenue]) => ({ hour: `${hour}h`, revenue }))
}

// ── Custom bar chart — no recharts ──────────────────────────
function RevenueChart({ data }: { data: { hour: string; revenue: number }[] }) {
  const [hovered, setHovered] = useState<number | null>(null)
  const max = Math.max(...data.map(d => d.revenue), 1)

  return (
    <div className="relative">
      <div className="flex items-end gap-[3px] h-40">
        {data.map((d, i) => {
          const pct = (d.revenue / max) * 100
          const isHovered = hovered === i
          return (
            <div
              key={d.hour}
              className="relative flex-1 flex flex-col items-center justify-end gap-0.5 group cursor-default"
              onMouseEnter={() => setHovered(i)}
              onMouseLeave={() => setHovered(null)}
            >
              {isHovered && d.revenue > 0 && (
                <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 bg-stone-800 text-white text-[10px] font-semibold px-2 py-1 rounded-lg whitespace-nowrap z-10 pointer-events-none">
                  NLe {d.revenue.toFixed(0)}
                  <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-stone-800" />
                </div>
              )}
              <div
                className="w-full rounded-t-sm transition-all duration-200"
                style={{
                  height: pct > 0 ? `${Math.max(pct, 4)}%` : "2px",
                  background: d.revenue > 0
                    ? isHovered ? "#ca8a04" : "#eab308"
                    : "#44403c",
                }}
              />
            </div>
          )
        })}
      </div>
      {/* X-axis labels */}
      <div className="flex gap-[3px] mt-1.5">
        {data.map((d, i) => (
          <div key={d.hour} className="flex-1 text-center">
            {i % 3 === 0 && (
              <span className="text-[9px] text-stone-500">{d.hour}</span>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

export default function DashboardClient() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [lastSync, setLastSync] = useState<Date | null>(null)

  const load = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/orders")
      if (res.ok) {
        const data = await res.json()
        setOrders(data)
        setLastSync(new Date())
      }
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { load() }, [load])

  const stats = computeStats(orders)
  const chart = hourlyBuckets(orders)
  const recent = [...orders].slice(0, 8)

  const statCards = [
    { label: "Today's Revenue", value: formatCurrency(stats.revenue), icon: Money, color: "text-yellow-500" },
    { label: "Total Orders", value: String(stats.orderCount), icon: ShoppingBag, color: "text-blue-400" },
    { label: "Avg Order Value", value: formatCurrency(stats.avgOrderValue), icon: TrendUp, color: "text-green-400" },
    { label: "Pending", value: String(stats.pendingCount), icon: Clock, color: "text-orange-400" },
  ]

  return (
    <div className="p-4 lg:p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6 lg:mb-8">
        <div>
          <h1 className="text-xl lg:text-2xl font-bold text-white">Dashboard</h1>
          <p className="text-sm text-stone-400 mt-0.5">
            {new Date().toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long" })}
          </p>
        </div>
        <button
          onClick={load}
          disabled={loading}
          className="flex items-center gap-2 px-3 py-2 bg-stone-900 border border-stone-800 rounded-lg text-sm text-stone-300 hover:bg-stone-800 transition-colors disabled:opacity-50"
        >
          <ArrowClockwise size={14} className={loading ? "animate-spin" : ""} />
          <span className="hidden sm:inline">Refresh</span>
        </button>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4 mb-6 lg:mb-8">
        {statCards.map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="bg-stone-900 rounded-2xl border border-stone-800 p-4 lg:p-5">
            <div className="flex items-start justify-between mb-3">
              <p className="text-xs text-stone-400 font-medium leading-tight">{label}</p>
              <Icon size={16} weight="duotone" className={`${color} flex-shrink-0`} />
            </div>
            {loading ? (
              <div className="h-7 bg-stone-800 rounded animate-pulse w-3/4" />
            ) : (
              <p className="text-xl lg:text-2xl font-bold text-white">{value}</p>
            )}
          </div>
        ))}
      </div>

      {/* Source breakdown */}
      <div className="grid grid-cols-2 gap-3 mb-6 lg:mb-8">
        <div className="bg-stone-900 rounded-2xl border border-stone-800 p-4">
          <p className="text-xs text-stone-400 mb-1">Online Orders</p>
          <p className="text-2xl font-bold text-white">{loading ? "—" : stats.onlineOrders}</p>
        </div>
        <div className="bg-stone-900 rounded-2xl border border-stone-800 p-4">
          <p className="text-xs text-stone-400 mb-1">POS Orders</p>
          <p className="text-2xl font-bold text-white">{loading ? "—" : stats.posOrders}</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-5 gap-4 lg:gap-6">
        {/* Revenue chart */}
        <div className="lg:col-span-3 bg-stone-900 rounded-2xl border border-stone-800 p-4 lg:p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-white">Revenue by Hour</h2>
            <p className="text-[10px] text-stone-400">Today · NLe {stats.revenue.toFixed(0)}</p>
          </div>
          {loading ? (
            <div className="h-48 bg-stone-800 rounded-xl animate-pulse" />
          ) : (
            <RevenueChart data={chart} />
          )}
        </div>

        {/* Recent orders */}
        <div className="lg:col-span-2 bg-stone-900 rounded-2xl border border-stone-800 p-4 lg:p-6">
          <h2 className="text-sm font-semibold text-white mb-4">Recent Orders</h2>
          {loading ? (
            <div className="space-y-3">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-12 bg-stone-800 rounded-lg animate-pulse" />
              ))}
            </div>
          ) : recent.length === 0 ? (
            <p className="text-sm text-stone-400 text-center py-8">No orders today</p>
          ) : (
            <div className="space-y-2 overflow-y-auto max-h-64">
              {recent.map(o => {
                const c = STATUS_COLORS[o.status]
                return (
                  <div key={o.id} className="flex items-center justify-between gap-2 py-2 border-b border-stone-800 last:border-0">
                    <div className="min-w-0">
                      <p className="text-xs font-semibold text-stone-100 truncate">{o.order_ref}</p>
                      <p className="text-[10px] text-stone-400">{o.customer_name || "Walk-in"} · {formatTime(o.created_at)}</p>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${c.bg} ${c.text}`}>
                        {STATUS_LABELS[o.status]}
                      </span>
                      <span className="text-xs font-bold text-white">NLe {o.total.toFixed(0)}</span>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>

      {lastSync && (
        <p className="text-[10px] text-stone-400 text-center mt-6">
          Last synced {lastSync.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit", second: "2-digit" })}
        </p>
      )}
    </div>
  )
}
