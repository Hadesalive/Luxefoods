import type { Metadata } from "next"
import ProductGrid from "@/components/ProductGrid"

export const metadata: Metadata = {
  title: "Our Menu - Kings Restaurant | Fried Rice, Jollof Rice, Grilled Chicken, Burgers, Shawarma | Freetown, Sierra Leone",
  description:
    "Explore our complete menu at Kings Restaurant in Freetown, Sierra Leone. Fried rice, jollof rice, grilled chicken, fried chicken, shawarma, burgers, breakfast, lunch, dinner. Order online for delivery.",
  keywords: [
    "Kings Restaurant menu",
    "restaurant menu Freetown",
    "fried rice menu",
    "jollof rice menu",
    "grilled chicken menu",
    "fried chicken menu",
    "shawarma menu",
    "burger menu",
    "breakfast menu",
    "lunch menu",
    "dinner menu",
    "food menu Kings Restaurant",
    "restaurant food menu",
    "fast food menu",
    "local food menu",
    "international cuisine menu",
  ],
  openGraph: {
    title: "Our Menu - Kings Restaurant | Fried Rice, Jollof Rice, Grilled Chicken, Burgers, Shawarma | Freetown, Sierra Leone",
    description:
      "Explore our complete menu at Kings Restaurant in Freetown, Sierra Leone. Fried rice, jollof rice, grilled chicken, fried chicken, shawarma, burgers, breakfast, lunch, dinner.",
    url: "https://thekingsbakerysl.com/products",
  },
}

export default function ProductsPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Our Menu</h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Discover our delicious selection of fresh bread, pastries, local dishes, and international cuisine. 
          From traditional favorites to modern delights, we have something for everyone.
        </p>
      </div>
      <ProductGrid />
    </div>
  )
}
