import type { Metadata } from "next"
import ProductGrid from "@/components/ProductGrid"

export const metadata: Metadata = {
  title: "Our Menu - LUXE FOOD | Quality Meals & Local Dishes | Freetown, Sierra Leone",
  description:
    "Explore our complete menu at LUXE FOOD in Freetown, Sierra Leone. Fried rice, jollof rice, grilled chicken, shawarma, burgers, and more. Order online for delivery.",
  keywords: [
    "LUXE FOOD menu",
    "restaurant menu Freetown",
    "fried rice menu",
    "jollof rice menu",
    "grilled chicken menu",
    "shawarma menu",
    "burger menu",
    "food menu LUXE FOOD",
    "local food menu",
    "international cuisine menu",
    "food delivery Freetown",
  ],
  openGraph: {
    title: "Our Menu - LUXE FOOD | Quality Meals & Local Dishes | Freetown, Sierra Leone",
    description:
      "Explore our complete menu at LUXE FOOD in Freetown, Sierra Leone. Quality meals, local dishes, and international cuisine.",
    url: "https://luxefood.com/products",
  },
}

export default function ProductsPage() {
  return (
    <main>
      <ProductGrid />
    </main>
  )
}
