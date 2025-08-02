import type { Metadata } from "next"
import OrderPageClient from "./OrderPageClient"

export const metadata: Metadata = {
  title: "Order Food Online - Restaurant & Food Delivery | Fried Rice, Jollof Rice, Grilled Chicken, Burgers, Shawarma | Freetown",
  description:
    "Order delicious food online in Freetown, Sierra Leone. Fried rice, jollof rice, grilled chicken, fried chicken, shawarma, burgers, breakfast, lunch, dinner. Fast food delivery to Lumley and surrounding areas.",
  keywords: [
    "order food online Freetown",
    "food delivery Lumley",
    "restaurant delivery Sierra Leone",
    "fried rice delivery Freetown",
    "jollof rice delivery",
    "grilled chicken delivery",
    "fried chicken delivery",
    "shawarma delivery Freetown",
    "burger delivery",
    "breakfast delivery",
    "lunch delivery",
    "dinner delivery",
    "online food order",
    "food delivery service",
    "restaurant food delivery",
    "fast food delivery",
    "local restaurant delivery",
    "international cuisine delivery",
    "African food delivery",
    "European food delivery",
    "Asian food delivery",
    "date night food delivery",
    "family meal delivery",
    "party food delivery",
    "catering delivery Freetown",
    "Kings Restaurant delivery",
    "Kings Bakery food delivery",
  ],
  openGraph: {
    title: "Order Food Online - Restaurant & Food Delivery | Fried Rice, Jollof Rice, Grilled Chicken, Burgers, Shawarma | Freetown",
    description:
      "Order delicious food online in Freetown, Sierra Leone. Fried rice, jollof rice, grilled chicken, fried chicken, shawarma, burgers, breakfast, lunch, dinner. Fast delivery.",
    url: "https://thekingsbakerysl.com/order",
  },
}

export default function OrderPage() {
  return <OrderPageClient />
}
