import type { Metadata } from "next"
import Header from "@/components/Header"
import Footer from "@/components/Footer"
import OrderPageClient from "./OrderPageClient"

export const metadata: Metadata = {
  title: "Order Online - LUXE FOOD | The Bites Of Delight | Freetown",
  description:
    "Explore our complete menu at LUXE FOOD. Quality ingredients, exceptional taste. Order online for delivery in Freetown, Sierra Leone.",
  keywords: [
    "LUXE FOOD menu",
    "food delivery Freetown",
    "quality meals Sierra Leone",
    "local dishes Freetown",
    "international cuisine",
    "online food order",
    "food delivery",
    "LUXE FOOD online",
    "quality food Freetown",
  ],
  openGraph: {
    title: "Order Online - LUXE FOOD | The Bites Of Delight | Freetown",
    description:
      "Explore our complete menu at LUXE FOOD. Quality ingredients, exceptional taste. Order online for delivery in Freetown, Sierra Leone.",
    url: "https://luxefood.com/order",
  },
}

// Enable static rendering where possible
export const dynamic = 'force-dynamic'
export const revalidate = 300 // Revalidate every 5 minutes

export default function OrderPage() {
  return (
    <>
      <Header />
      <OrderPageClient />
      <Footer />
    </>
  )
}
