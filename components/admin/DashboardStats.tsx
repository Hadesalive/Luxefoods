"use client"

import { Card, CardContent } from "@/components/ui/card"
import { useOrderTracking } from "@/hooks/useOrderTracking"
import { useAdmin } from "@/contexts/AdminContext"
import { DollarSign, ShoppingBag, Menu, TrendingUp, Clock } from "lucide-react"

export function DashboardStats() {
  const { getOrderStats, getAnalytics } = useOrderTracking()
  const { menuItems } = useAdmin()

  const stats = getOrderStats()
  const analytics = getAnalytics()

  const statCards = [
    {
      title: "Today's Revenue",
      value: `NLe${stats.todayRevenue.toFixed(2)}`,
      change: `${analytics.revenueGrowth >= 0 ? "+" : ""}${analytics.revenueGrowth.toFixed(1)}%`,
      changeType: analytics.revenueGrowth >= 0 ? "positive" : "negative",
      icon: DollarSign,
      color: "from-green-500 to-emerald-600",
    },
    {
      title: "Today's Orders",
      value: stats.todayTotal.toString(),
      change: `${analytics.orderGrowth >= 0 ? "+" : ""}${analytics.orderGrowth.toFixed(1)}%`,
      changeType: analytics.orderGrowth >= 0 ? "positive" : "negative",
      icon: ShoppingBag,
      color: "from-blue-500 to-cyan-600",
    },
    {
      title: "Menu Items",
      value: menuItems.length.toString(),
      change: `${menuItems.filter((item) => item.available).length} active`,
      changeType: "neutral",
      icon: Menu,
      color: "from-purple-500 to-pink-600",
    },
    {
      title: "Pending Orders",
      value: stats.pending.toString(),
      change: "Need attention",
      changeType: stats.pending > 0 ? "warning" : "positive",
      icon: Clock,
      color: "from-orange-500 to-red-600",
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {statCards.map((stat, index) => (
        <Card
          key={index}
          className="border-0 shadow-xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm overflow-hidden"
        >
          <CardContent className="p-0">
            <div className={`bg-gradient-to-r ${stat.color} p-4 text-white`}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white/80 text-sm font-medium">{stat.title}</p>
                  <p className="text-2xl font-bold">{stat.value}</p>
                </div>
                <stat.icon className="h-8 w-8 text-white/80" />
              </div>
            </div>
            <div className="p-4">
              <div className="flex items-center gap-2">
                <TrendingUp
                  className={`h-4 w-4 ${
                    stat.changeType === "positive"
                      ? "text-green-500"
                      : stat.changeType === "negative"
                        ? "text-red-500"
                        : stat.changeType === "warning"
                          ? "text-orange-500"
                          : "text-gray-500"
                  }`}
                />
                <span
                  className={`text-sm font-medium ${
                    stat.changeType === "positive"
                      ? "text-green-600 dark:text-green-400"
                      : stat.changeType === "negative"
                        ? "text-red-600 dark:text-red-400"
                        : stat.changeType === "warning"
                          ? "text-orange-600 dark:text-orange-400"
                          : "text-gray-600 dark:text-gray-400"
                  }`}
                >
                  {stat.change}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
