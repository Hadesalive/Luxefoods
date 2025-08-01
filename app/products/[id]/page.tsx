"use client"

import { useParams } from "next/navigation"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { useCart } from "@/contexts/CartContext"
import { products } from "@/data/products"
import { ShoppingCart, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { useState } from "react"

export default function ProductPage() {
  const params = useParams()
  const { addItem } = useCart()
  const [quantity, setQuantity] = useState(1)

  const product = products.find((p) => p.id === params.id)

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h1 className="text-2xl font-bold mb-4">Product Not Found</h1>
        <Link href="/products">
          <Button>Back to Products</Button>
        </Link>
      </div>
    )
  }

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      addItem(product)
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Link href="/products" className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-6">
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to Products
      </Link>

      <div className="grid md:grid-cols-2 gap-8">
        <div>
          <Image
            src={product.image || "/placeholder.svg"}
            alt={product.name}
            width={500}
            height={500}
            className="w-full rounded-lg"
          />
        </div>

        <div>
          <Badge className="mb-4">{product.category}</Badge>
          <h1 className="text-3xl font-bold mb-4">{product.name}</h1>
          <p className="text-gray-600 mb-6">{product.description}</p>

          <div className="flex items-center gap-4 mb-6">
            <span className="text-3xl font-bold text-blue-600">${product.price.toFixed(2)}</span>
            {product.originalPrice && (
              <span className="text-xl text-gray-500 line-through">${product.originalPrice.toFixed(2)}</span>
            )}
          </div>

          <Card className="mb-6">
            <CardContent className="p-4">
              <div className="flex items-center gap-4">
                <label htmlFor="quantity" className="font-medium">
                  Quantity:
                </label>
                <select
                  id="quantity"
                  value={quantity}
                  onChange={(e) => setQuantity(Number(e.target.value))}
                  className="border rounded px-3 py-1"
                >
                  {[1, 2, 3, 4, 5].map((num) => (
                    <option key={num} value={num}>
                      {num}
                    </option>
                  ))}
                </select>
              </div>
            </CardContent>
          </Card>

          <Button onClick={handleAddToCart} size="lg" className="w-full md:w-auto">
            <ShoppingCart className="h-5 w-5 mr-2" />
            Add to Cart
          </Button>
        </div>
      </div>
    </div>
  )
}
