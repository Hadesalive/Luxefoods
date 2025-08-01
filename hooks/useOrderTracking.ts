"use client"

import { useState, useEffect } from "react"

interface WhatsAppOrder {
  id: string
  customerName: string
  customerPhone: string
  items: string
  total: number
  deliveryMethod: string
  paymentMethod: string
  status: "pending" | "preparing" | "ready" | "delivered" | "cancelled"
  timestamp: string
  notes?: string
}

export function useOrderTracking() {
  const [orders, setOrders] = useState<WhatsAppOrder[]>([])

  // Load orders from localStorage on mount
  useEffect(() => {
    const savedOrders = localStorage.getItem("whatsapp-orders")
    if (savedOrders) {
      try {
        setOrders(JSON.parse(savedOrders))
      } catch (error) {
        console.error("Error loading orders:", error)
      }
    }
  }, [])

  // Save orders to localStorage whenever orders change
  useEffect(() => {
    localStorage.setItem("whatsapp-orders", JSON.stringify(orders))
  }, [orders])

  const addOrder = (orderData: Omit<WhatsAppOrder, "id">) => {
    const newOrder: WhatsAppOrder = {
      ...orderData,
      id: `order-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    }
    setOrders((prev) => [newOrder, ...prev])
  }

  const updateOrderStatus = (orderId: string, status: WhatsAppOrder["status"]) => {
    setOrders((prev) => prev.map((order) => (order.id === orderId ? { ...order, status } : order)))
  }

  const getOrderStats = () => {
    const today = new Date().toDateString()
    const todayOrders = orders.filter((order) => new Date(order.timestamp).toDateString() === today)

    return {
      pending: orders.filter((order) => order.status === "pending").length,
      preparing: orders.filter((order) => order.status === "preparing").length,
      ready: orders.filter((order) => order.status === "ready").length,
      delivered: orders.filter((order) => order.status === "delivered").length,
      cancelled: orders.filter((order) => order.status === "cancelled").length,
      todayTotal: todayOrders.length,
      todayRevenue: todayOrders.reduce((sum, order) => sum + order.total, 0),
    }
  }

  const getAnalytics = () => {
    const today = new Date()
    const yesterday = new Date(today)
    yesterday.setDate(yesterday.getDate() - 1)

    const todayOrders = orders.filter((order) => new Date(order.timestamp).toDateString() === today.toDateString())
    const yesterdayOrders = orders.filter(
      (order) => new Date(order.timestamp).toDateString() === yesterday.toDateString(),
    )

    const todayRevenue = todayOrders.reduce((sum, order) => sum + order.total, 0)
    const yesterdayRevenue = yesterdayOrders.reduce((sum, order) => sum + order.total, 0)

    // Daily revenue for last 7 days
    const dailyRevenue = []
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today)
      date.setDate(date.getDate() - i)
      const dayOrders = orders.filter((order) => new Date(order.timestamp).toDateString() === date.toDateString())
      dailyRevenue.push({
        date: date.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
        revenue: dayOrders.reduce((sum, order) => sum + order.total, 0),
      })
    }

    // Payment methods distribution
    const paymentMethods = [
      {
        name: "Cash",
        value: orders.filter((order) => order.paymentMethod === "cash").length,
      },
      {
        name: "Orange Money",
        value: orders.filter((order) => order.paymentMethod === "orange-money").length,
      },
    ]

    // Popular items analysis
    const itemCounts: { [key: string]: number } = {}
    orders.forEach((order) => {
      // Simple parsing of items string
      const items = order.items.split(",")
      items.forEach((item) => {
        const trimmedItem = item.trim()
        if (trimmedItem) {
          itemCounts[trimmedItem] = (itemCounts[trimmedItem] || 0) + 1
        }
      })
    })

    const popularItems = Object.entries(itemCounts)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)

    return {
      todayOrders: todayOrders.length,
      todayRevenue,
      revenueGrowth: yesterdayRevenue > 0 ? ((todayRevenue - yesterdayRevenue) / yesterdayRevenue) * 100 : 0,
      orderGrowth:
        yesterdayOrders.length > 0 ? ((todayOrders.length - yesterdayOrders.length) / yesterdayOrders.length) * 100 : 0,
      dailyRevenue,
      paymentMethods,
      popularItems,
    }
  }

  return {
    orders,
    addOrder,
    updateOrderStatus,
    getOrderStats,
    getAnalytics,
  }
}
