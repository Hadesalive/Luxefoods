export interface MenuItem {
  id: string
  name: string
  description: string
  category: "pizza" | "mini-pizza" | "kebbeh" | "fataya"
  price: number | { [key: string]: number } // Single price or size-based pricing
  image: string
  available: boolean
  popular: boolean
}

export interface WhatsAppOrder {
  id: string
  customerName: string
  customerPhone: string
  items: string
  total: number
  deliveryMethod: "pickup" | "delivery"
  paymentMethod: "cash" | "orange-money"
  status: "pending" | "preparing" | "ready" | "delivered" | "cancelled"
  timestamp: string
  notes?: string
}

export interface OrderAnalytics {
  todayOrders: number
  todayRevenue: number
  revenueGrowth: number
  orderGrowth: number
  dailyRevenue: { date: string; revenue: number }[]
  paymentMethods: { name: string; value: number }[]
  popularItems: { name: string; count: number }[]
}
