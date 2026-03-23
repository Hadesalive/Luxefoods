import type { Metadata } from "next"
import CheckoutPageClient from "./CheckoutPageClient"

export const metadata: Metadata = {
  title: "Checkout - LUXE FOOD | Complete Your Order | Freetown, Sierra Leone",
  description:
    "Complete your order at LUXE FOOD. Enter delivery details and payment information for fast delivery in Freetown, Sierra Leone. Secure checkout process.",
  keywords: [
    "checkout LUXE FOOD",
    "food delivery checkout",
    "LUXE FOOD order completion",
    "delivery details Freetown",
    "payment LUXE FOOD",
    "secure checkout",
    "order completion Freetown",
  ],
  openGraph: {
    title: "Checkout - LUXE FOOD | Complete Your Order | Freetown, Sierra Leone",
    description:
      "Complete your order at LUXE FOOD. Enter delivery details and payment information for fast delivery.",
    url: "https://luxefood.com/checkout",
  },
}

export default function CheckoutPage() {
  return <CheckoutPageClient />
}
