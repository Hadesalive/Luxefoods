import type { Metadata } from "next"
import OrderPageClient from "./OrderPageClient"

export const metadata: Metadata = {
  title: "Full Menu - Kings Bakery | Fresh food, Pastries & Local Dishes | Freetown",
  description:
    "Explore our complete menu at Kings Bakery. Fresh food, pastries, local dishes, international cuisine, breakfast, lunch, dinner. Order online for delivery in Freetown, Sierra Leone.",
  keywords: [
    "Kings Bakery menu",
    "fresh bread Freetown",
    "pastries Sierra Leone",
    "local dishes Freetown",
    "international cuisine",
    "bakery menu online",
    "fresh baked goods",
    "breakfast menu",
    "lunch menu",
    "dinner menu",
    "bakery delivery Freetown",
    "fresh bread delivery",
    "pastry delivery",
    "local food delivery",
    "bakery items online",
    "fresh bread Sierra Leone",
    "pastries Freetown",
    "bakery menu Sierra Leone",
    "fresh baked bread",
    "local bakery menu",
    "international bakery",
    "fresh pastries delivery",
    "bakery food delivery",
    "Kings Bakery menu online",
    "fresh bread menu",
    "pastry menu Freetown",
  ],
  openGraph: {
    title: "Full Menu - Kings Bakery | Fresh food, Pastries & Local Dishes | Freetown",
    description:
      "Explore our complete menu at Kings Bakery. Fresh food, pastries, local dishes, international cuisine, breakfast, lunch, dinner. Order online for delivery in Freetown, Sierra Leone.",
    url: "https://thekingsbakerysl.com/order",
  },
}

export default function OrderPage() {
  return <OrderPageClient />
}
