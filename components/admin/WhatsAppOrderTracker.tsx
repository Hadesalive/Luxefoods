"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Clock, MapPin, Phone, DollarSign } from "lucide-react"
import { useOrderTracking } from "@/hooks/useOrderTracking"

export function WhatsAppOrderTracker() {
  const { orders, addOrder, updateOrderStatus, getOrderStats } = useOrderTracking()
  const [isAddOrderOpen, setIsAddOrderOpen] = useState(false)
  const [newOrder, setNewOrder] = useState({
    customerName: "",
    customerPhone: "",
    items: "",
    total: "",
    deliveryMethod: "delivery",
    paymentMethod: "cash",
    notes: "",
  })

  const stats = getOrderStats()

  const handleAddOrder = () => {
    if (newOrder.customerName && newOrder.customerPhone && newOrder.items && newOrder.total) {
      addOrder({
        ...newOrder,
        total: Number.parseFloat(newOrder.total),
        timestamp: new Date().toISOString(),
        status: "pending",
      })
      setNewOrder({
        customerName: "",
        customerPhone: "",
        items: "",
        total: "",
        deliveryMethod: "delivery",
        paymentMethod: "cash",
        notes: "",
      })
      setIsAddOrderOpen(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300"
      case "preparing":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300"
      case "ready":
        return "bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300"
      case "delivered":
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/50 dark:text-gray-300"
      case "cancelled":
        return "bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/50 dark:text-gray-300"
    }
  }

  return (
    <Card className="border-0 shadow-xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="text-indigo-900 dark:text-indigo-100">WhatsApp Orders</CardTitle>
          <Dialog open={isAddOrderOpen} onOpenChange={setIsAddOrderOpen}>
            <DialogTrigger asChild>
              <Button size="sm" className="bg-green-600 hover:bg-green-700">
                <Plus className="h-4 w-4 mr-2" />
                Add Order
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Add WhatsApp Order</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="customerName">Customer Name</Label>
                    <Input
                      id="customerName"
                      value={newOrder.customerName}
                      onChange={(e) => setNewOrder({ ...newOrder, customerName: e.target.value })}
                      placeholder="John Doe"
                    />
                  </div>
                  <div>
                    <Label htmlFor="customerPhone">Phone</Label>
                    <Input
                      id="customerPhone"
                      value={newOrder.customerPhone}
                      onChange={(e) => setNewOrder({ ...newOrder, customerPhone: e.target.value })}
                      placeholder="076 123 456"
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="items">Order Items</Label>
                  <Textarea
                    id="items"
                    value={newOrder.items}
                    onChange={(e) => setNewOrder({ ...newOrder, items: e.target.value })}
                    placeholder="2x Chicken Pizza (L), 1x Kebbeh (6pcs)"
                    rows={3}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="total">Total (NLe)</Label>
                    <Input
                      id="total"
                      type="number"
                      value={newOrder.total}
                      onChange={(e) => setNewOrder({ ...newOrder, total: e.target.value })}
                      placeholder="520"
                    />
                  </div>
                  <div>
                    <Label htmlFor="deliveryMethod">Delivery</Label>
                    <Select
                      value={newOrder.deliveryMethod}
                      onValueChange={(value) => setNewOrder({ ...newOrder, deliveryMethod: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="delivery">Delivery</SelectItem>
                        <SelectItem value="pickup">Pickup</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div>
                  <Label htmlFor="paymentMethod">Payment Method</Label>
                  <Select
                    value={newOrder.paymentMethod}
                    onValueChange={(value) => setNewOrder({ ...newOrder, paymentMethod: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="cash">Cash on Delivery</SelectItem>
                      <SelectItem value="orange-money">Orange Money</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="notes">Notes</Label>
                  <Textarea
                    id="notes"
                    value={newOrder.notes}
                    onChange={(e) => setNewOrder({ ...newOrder, notes: e.target.value })}
                    placeholder="Special instructions..."
                    rows={2}
                  />
                </div>
                <Button onClick={handleAddOrder} className="w-full">
                  Add Order
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
        <div className="grid grid-cols-4 gap-4 mt-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-yellow-600">{stats.pending}</div>
            <div className="text-xs text-gray-500">Pending</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">{stats.preparing}</div>
            <div className="text-xs text-gray-500">Preparing</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">{stats.ready}</div>
            <div className="text-xs text-gray-500">Ready</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-600">{stats.delivered}</div>
            <div className="text-xs text-gray-500">Delivered</div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3 max-h-96 overflow-y-auto">
          {orders.slice(0, 10).map((order) => (
            <div
              key={order.id}
              className="flex items-center justify-between p-3 rounded-lg bg-gray-50 dark:bg-gray-700/50"
            >
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-medium text-sm text-indigo-900 dark:text-indigo-100">{order.customerName}</span>
                  <Badge className={getStatusColor(order.status)}>{order.status}</Badge>
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                  <Phone className="h-3 w-3 inline mr-1" />
                  {order.customerPhone}
                </div>
                <div className="text-xs text-gray-600 dark:text-gray-300 mb-2">{order.items}</div>
                <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-500">
                  <div className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {new Date(order.timestamp).toLocaleTimeString()}
                  </div>
                  <div className="flex items-center gap-1">
                    <MapPin className="h-3 w-3" />
                    {order.deliveryMethod}
                  </div>
                  <div className="flex items-center gap-1">
                    <DollarSign className="h-3 w-3" />
                    {order.paymentMethod}
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="font-bold text-indigo-900 dark:text-indigo-100 mb-2">NLe{order.total.toFixed(2)}</div>
                <Select value={order.status} onValueChange={(value) => updateOrderStatus(order.id, value)}>
                  <SelectTrigger className="w-24 h-8 text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="preparing">Preparing</SelectItem>
                    <SelectItem value="ready">Ready</SelectItem>
                    <SelectItem value="delivered">Delivered</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
