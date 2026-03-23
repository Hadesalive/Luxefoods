export type OrderStatus = 'pending' | 'confirmed' | 'preparing' | 'ready' | 'delivered' | 'cancelled'
export type OrderSource = 'online' | 'pos'
export type PaymentMethod = 'cash' | 'card' | 'mobile_money' | 'orange_money'
export type DeliveryMethod = 'pickup' | 'delivery'

export interface OrderItem {
  id: string
  name: string
  price: number
  quantity: number
  size?: string | null
  category_name?: string | null
}

export interface Order {
  id: string
  order_ref: string
  source: OrderSource
  status: OrderStatus
  customer_name?: string | null
  customer_phone?: string | null
  customer_address?: string | null
  delivery_method: DeliveryMethod
  payment_method: PaymentMethod
  discount_amount: number
  items: OrderItem[]
  subtotal: number
  total: number
  notes?: string | null
  created_at: string
  updated_at: string
}

export interface CreateOrderInput {
  order_ref?: string
  source: OrderSource
  status?: OrderStatus
  customer_name?: string
  customer_phone?: string
  customer_address?: string
  delivery_method?: DeliveryMethod
  payment_method?: PaymentMethod
  discount_amount?: number
  items: OrderItem[]
  subtotal: number
  total: number
  notes?: string
}

export interface DashboardStats {
  revenue: number
  orderCount: number
  onlineOrders: number
  posOrders: number
  avgOrderValue: number
  pendingCount: number
}

export function computeStats(orders: Order[]): DashboardStats {
  const active = orders.filter(o => o.status !== 'cancelled')
  const revenue = active.reduce((s, o) => s + o.total, 0)
  return {
    revenue,
    orderCount: active.length,
    onlineOrders: active.filter(o => o.source === 'online').length,
    posOrders: active.filter(o => o.source === 'pos').length,
    avgOrderValue: active.length > 0 ? revenue / active.length : 0,
    pendingCount: orders.filter(o => o.status === 'pending').length,
  }
}

export function formatOrderRef(): string {
  const ts = Date.now().toString(36).toUpperCase()
  const r = Math.random().toString(36).substring(2, 5).toUpperCase()
  return `POS-${ts}-${r}`
}

// Status transition map — what actions are available from each status
export const STATUS_TRANSITIONS: Record<OrderStatus, OrderStatus[]> = {
  pending:   ['confirmed', 'cancelled'],
  confirmed: ['preparing', 'cancelled'],
  preparing: ['ready', 'cancelled'],
  ready:     ['delivered'],
  delivered: [],
  cancelled: [],
}

export const STATUS_LABELS: Record<OrderStatus, string> = {
  pending:   'Pending',
  confirmed: 'Confirmed',
  preparing: 'Preparing',
  ready:     'Ready',
  delivered: 'Delivered',
  cancelled: 'Cancelled',
}

export const STATUS_COLORS: Record<OrderStatus, { bg: string; text: string }> = {
  pending:   { bg: 'bg-yellow-500/20', text: 'text-yellow-400' },
  confirmed: { bg: 'bg-blue-500/20',   text: 'text-blue-400' },
  preparing: { bg: 'bg-orange-500/20', text: 'text-orange-400' },
  ready:     { bg: 'bg-green-500/20',  text: 'text-green-400' },
  delivered: { bg: 'bg-stone-500/20',  text: 'text-stone-400' },
  cancelled: { bg: 'bg-red-500/20',    text: 'text-red-400' },
}
