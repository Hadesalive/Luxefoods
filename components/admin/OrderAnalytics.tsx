"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts"
import { useOrderTracking } from "@/hooks/useOrderTracking"
import { TrendingUp, TrendingDown, DollarSign, ShoppingBag } from "lucide-react"

export function OrderAnalytics() {
  const { orders, getAnalytics } = useOrderTracking()
  const analytics = getAnalytics()

  const COLORS = ["#6366f1", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6"]

  return (
    <Card className="border-0 shadow-xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-indigo-900 dark:text-indigo-100">Order Analytics</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Key Metrics */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gradient-to-r from-indigo-500 to-purple-600 p-4 rounded-lg text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-indigo-100 text-sm">Today's Revenue</p>
                  <p className="text-2xl font-bold">NLe{analytics.todayRevenue.toFixed(2)}</p>
                </div>
                <DollarSign className="h-8 w-8 text-indigo-200" />
              </div>
              <div className="flex items-center mt-2">
                {analytics.revenueGrowth >= 0 ? (
                  <TrendingUp className="h-4 w-4 text-green-300 mr-1" />
                ) : (
                  <TrendingDown className="h-4 w-4 text-red-300 mr-1" />
                )}
                <span className="text-sm text-indigo-100">
                  {analytics.revenueGrowth >= 0 ? "+" : ""}
                  {analytics.revenueGrowth.toFixed(1)}% vs yesterday
                </span>
              </div>
            </div>

            <div className="bg-gradient-to-r from-green-500 to-emerald-600 p-4 rounded-lg text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-100 text-sm">Today's Orders</p>
                  <p className="text-2xl font-bold">{analytics.todayOrders}</p>
                </div>
                <ShoppingBag className="h-8 w-8 text-green-200" />
              </div>
              <div className="flex items-center mt-2">
                {analytics.orderGrowth >= 0 ? (
                  <TrendingUp className="h-4 w-4 text-green-300 mr-1" />
                ) : (
                  <TrendingDown className="h-4 w-4 text-red-300 mr-1" />
                )}
                <span className="text-sm text-green-100">
                  {analytics.orderGrowth >= 0 ? "+" : ""}
                  {analytics.orderGrowth.toFixed(1)}% vs yesterday
                </span>
              </div>
            </div>
          </div>

          {/* Daily Revenue Chart */}
          <div>
            <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-3">Daily Revenue (Last 7 Days)</h4>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={analytics.dailyRevenue}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip formatter={(value) => [`NLe${value}`, "Revenue"]} />
                <Line type="monotone" dataKey="revenue" stroke="#6366f1" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Payment Methods */}
          <div>
            <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-3">Payment Methods</h4>
            <ResponsiveContainer width="100%" height={150}>
              <PieChart>
                <Pie
                  data={analytics.paymentMethods}
                  cx="50%"
                  cy="50%"
                  innerRadius={40}
                  outerRadius={60}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {analytics.paymentMethods.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex justify-center gap-4 mt-2">
              {analytics.paymentMethods.map((entry, index) => (
                <div key={entry.name} className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    {entry.name}: {entry.value}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Popular Items */}
          <div>
            <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-3">Popular Items</h4>
            <div className="space-y-2">
              {analytics.popularItems.slice(0, 5).map((item, index) => (
                <div key={index} className="flex justify-between items-center">
                  <span className="text-sm text-gray-600 dark:text-gray-400">{item.name}</span>
                  <span className="font-medium text-indigo-900 dark:text-indigo-100">{item.count} orders</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
