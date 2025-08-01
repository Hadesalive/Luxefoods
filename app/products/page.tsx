import ProductGrid from "@/components/ProductGrid"

export default function ProductsPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Our Products</h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Discover our wide range of high-quality products. From electronics to fashion, we have everything you need at
          competitive prices.
        </p>
      </div>
      <ProductGrid />
    </div>
  )
}
