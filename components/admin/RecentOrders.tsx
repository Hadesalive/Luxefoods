"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Clock, MapPin } from "lucide-react"

export default function RecentOrders() {
  const orders = [
    {
      id: "ORD-001",
      customer: "John Doe",
      items: "2x Chicken Pizza (L), 1x Kebbeh (6pcs)",
      total: "NLe 520",
      status: "preparing",
      time: "5 min ago",
      type: "delivery",
    },
    {
      id: "ORD-002",
      customer: "Sarah Wilson",
      items: "1x Beef Pizza (M), 2x Fataya (6pcs)",
      total: "NLe 470",
      status: "ready",
      time: "12 min ago",
      type: "pickup",
    },
    {
      id: "ORD-003",
      customer: "Mike Johnson",
      items: "1x Mini Pizza (12pcs)",
      total: "NLe 220",
      status: "delivered",
      time: "25 min ago",
      type: "delivery",
    },
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case "preparing":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300"
      case "ready":
        return "bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300"
      case "delivered":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/50 dark:text-gray-300"
    }
  }

  return (
    <Card className="border-0 shadow-xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-indigo-900 dark:text-indigo-100">Recent Orders</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {orders.map((order) => (
            <div
              key={order.id}
              className="flex items-center justify-between p-4 rounded-lg bg-gray-50 dark:bg-gray-700/50"
            >
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-medium text-indigo-900 dark:text-indigo-100">{order.id}</span>
                  <Badge className={getStatusColor(order.status)}>{order.status}</Badge>
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">{order.customer}</div>
                <div className="text-xs text-gray-500 dark:text-gray-500 mb-2">{order.items}</div>
                <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-500">
                  <div className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {order.time}
                  </div>
                  <div className="flex items-center gap-1">
                    <MapPin className="h-3 w-3" />
                    {order.type}
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="font-bold text-indigo-900 dark:text-indigo-100">{order.total}</div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
