import type { Metadata } from "next"
import CartPageClient from "./CartPageClient"

export const metadata: Metadata = {
  title: "Shopping Cart - LUXE FOOD | Review Your Order | Freetown, Sierra Leone",
  description:
    "Review your shopping cart at LUXE FOOD. Check your selected items, quantities, and total before proceeding to checkout. Fast delivery in Freetown, Sierra Leone.",
  keywords: [
    "shopping cart LUXE FOOD",
    "food cart Freetown",
    "food cart review",
    "order review LUXE FOOD",
    "cart checkout Freetown",
    "LUXE FOOD cart",
    "food order cart",
  ],
  openGraph: {
    title: "Shopping Cart - LUXE FOOD | Review Your Order | Freetown, Sierra Leone",
    description:
      "Review your shopping cart at LUXE FOOD. Check your selected items before checkout.",
    url: "https://luxefood.com/cart",
  },
}

export default function CartPage() {
  return <CartPageClient />
}
