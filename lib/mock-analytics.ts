import { OrderAnalytics } from "@/types/admin"

// Simple seeded random based on a string (date) to avoid hydration mismatch
function seededRandom(seed: string): () => number {
  let hash = 0
  for (let i = 0; i < seed.length; i++) {
    hash = (hash << 5) - hash + seed.charCodeAt(i)
    hash |= 0
  }
  return () => {
    hash = (hash * 1103515245 + 12345) & 0x7fffffff
    return hash / 0x7fffffff
  }
}

export function generateMockAnalytics(
  menuItems: { name: string; price: number; is_popular?: boolean }[],
  categories: { name: string }[]
): OrderAnalytics {
  const today = new Date().toISOString().split("T")[0]
  const rand = seededRandom(today)

  // Generate 7-day revenue
  const dailyRevenue: { date: string; revenue: number }[] = []
  for (let i = 6; i >= 0; i--) {
    const d = new Date()
    d.setDate(d.getDate() - i)
    const dayName = d.toLocaleDateString("en-US", { weekday: "short" })
    dailyRevenue.push({
      date: dayName,
      revenue: Math.round(150000 + rand() * 350000),
    })
  }

  const todayRevenue = dailyRevenue[dailyRevenue.length - 1].revenue
  const yesterdayRevenue = dailyRevenue[dailyRevenue.length - 2].revenue
  const revenueGrowth =
    yesterdayRevenue > 0
      ? Math.round(((todayRevenue - yesterdayRevenue) / yesterdayRevenue) * 100)
      : 0

  const todayOrders = Math.round(20 + rand() * 40)
  const yesterdayOrders = Math.round(20 + rand() * 40)
  const orderGrowth =
    yesterdayOrders > 0
      ? Math.round(((todayOrders - yesterdayOrders) / yesterdayOrders) * 100)
      : 0

  // Derive popular items from actual menu data
  const popular = menuItems
    .filter((item) => item.is_popular)
    .slice(0, 5)
  const popularItems = popular.length > 0
    ? popular.map((item) => ({
        name: item.name,
        count: Math.round(5 + rand() * 25),
      }))
    : menuItems.slice(0, 5).map((item) => ({
        name: item.name,
        count: Math.round(5 + rand() * 25),
      }))

  // Sort by count descending
  popularItems.sort((a, b) => b.count - a.count)

  // Payment method split
  const paymentMethods = [
    { name: "Orange Money", value: 60 },
    { name: "Cash", value: 40 },
  ]

  return {
    todayOrders,
    todayRevenue,
    revenueGrowth,
    orderGrowth,
    dailyRevenue,
    paymentMethods,
    popularItems,
  }
}
