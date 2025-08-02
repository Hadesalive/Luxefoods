import type { Metadata } from "next"
import CheckoutPageClient from "./CheckoutPageClient"

export const metadata: Metadata = {
  title: "Checkout - Kings Bakery | Complete Your Order | Freetown, Sierra Leone",
  description:
    "Complete your order at Kings Bakery. Enter delivery details and payment information for fast delivery in Freetown, Sierra Leone. Secure checkout process.",
  keywords: [
    "checkout Kings Bakery",
    "food delivery checkout",
    "bakery order completion",
    "delivery details Freetown",
    "payment Kings Bakery",
    "secure checkout bakery",
    "order completion Freetown",
  ],
  openGraph: {
    title: "Checkout - Kings Bakery | Complete Your Order | Freetown, Sierra Leone",
    description:
      "Complete your order at Kings Bakery. Enter delivery details and payment information for fast delivery.",
    url: "https://thekingsbakerysl.com/checkout",
  },
}

export default function CheckoutPage() {
  return <CheckoutPageClient />
}
