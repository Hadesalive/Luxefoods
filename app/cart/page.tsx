import type { Metadata } from "next"
import CartPageClient from "./CartPageClient"

export const metadata: Metadata = {
  title: "Shopping Cart - Kings Bakery | Review Your Order | Freetown, Sierra Leone",
  description:
    "Review your shopping cart at Kings Bakery. Check your selected items, quantities, and total before proceeding to checkout. Fast delivery in Freetown, Sierra Leone.",
  keywords: [
    "shopping cart Kings Bakery",
    "bakery cart Freetown",
    "food cart review",
    "order review bakery",
    "cart checkout Freetown",
    "Kings Bakery cart",
    "food order cart",
  ],
  openGraph: {
    title: "Shopping Cart - Kings Bakery | Review Your Order | Freetown, Sierra Leone",
    description:
      "Review your shopping cart at Kings Bakery. Check your selected items before checkout.",
    url: "https://thekingsbakerysl.com/cart",
  },
}

export default function CartPage() {
  return <CartPageClient />
}
