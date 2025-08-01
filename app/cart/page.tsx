"use client"

import { useCart } from "@/contexts/CartContext"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { Trash2, ArrowLeft, ShoppingBag } from "lucide-react"

export default function CartPage() {
  const { items, removeItem, getTotal } = useCart()

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-indigo-50 dark:from-gray-950 dark:via-gray-900 dark:to-indigo-950 flex items-center justify-center transition-colors duration-300">
        <div className="container mx-auto px-4 py-16 text-center max-w-md">
          <Card className="shadow-xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-white/20 dark:border-gray-700/20">
            <CardContent className="p-8">
              <ShoppingBag className="h-16 w-16 text-gray-400 dark:text-gray-500 mx-auto mb-4" />
              <h1 className="text-2xl lg:text-3xl font-bold mb-4 text-indigo-900 dark:text-indigo-100">
                Your Cart is Empty
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mb-8">Add some delicious items to get started!</p>
              <Link href="/#menu">
                <Button
                  size="lg"
                  className="w-full bg-indigo-900 hover:bg-indigo-800 dark:bg-indigo-700 dark:hover:bg-indigo-600 text-white rounded-2xl"
                >
                  View Menu
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-indigo-50 dark:from-gray-950 dark:via-gray-900 dark:to-indigo-950 transition-colors duration-300">
      <div className="container mx-auto px-4 py-6 lg:py-8 max-w-6xl">
        <Link
          href="/"
          className="inline-flex items-center text-indigo-900 dark:text-indigo-100 hover:text-indigo-700 dark:hover:text-indigo-300 mb-6 lg:mb-8 transition-colors group"
        >
          <ArrowLeft className="h-4 w-4 mr-2 group-hover:-translate-x-1 transition-transform" />
          <span className="font-medium">Back to Menu</span>
        </Link>

        <div className="text-center mb-6 lg:mb-8">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-indigo-900 dark:text-indigo-100">
            Your Order
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            {items.length} {items.length === 1 ? "item" : "items"} in your cart
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6 lg:gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <div className="space-y-4">
              {items.map((item, index) => (
                <Card
                  key={index}
                  className="shadow-lg hover:shadow-xl transition-shadow duration-300 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-white/20 dark:border-gray-700/20"
                >
                  <CardContent className="p-4 lg:p-6">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg text-indigo-900 dark:text-indigo-100">{item.name}</h3>
                        <p className="text-gray-600 dark:text-gray-400 text-sm capitalize">{item.type}</p>
                        {item.size && <p className="text-gray-500 dark:text-gray-500 text-xs">Size: {item.size}</p>}
                      </div>

                      <div className="flex items-center justify-between sm:justify-end gap-4">
                        <div className="font-bold text-xl text-indigo-900 dark:text-indigo-100">
                          NLe{item.price.toFixed(2)}
                        </div>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => removeItem(item.id)}
                          className="rounded-full hover:scale-105 transition-transform bg-red-600 hover:bg-red-700 dark:bg-red-700 dark:hover:bg-red-600"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Order Summary - Sticky on desktop */}
          <div className="lg:sticky lg:top-6 lg:h-fit">
            <Card className="shadow-xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-white/20 dark:border-gray-700/20">
              <CardHeader>
                <CardTitle className="text-xl text-indigo-900 dark:text-indigo-100">Order Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4 mb-6">
                  <div className="flex justify-between text-lg text-gray-900 dark:text-gray-100">
                    <span>Subtotal:</span>
                    <span>NLe{getTotal().toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-lg text-gray-900 dark:text-gray-100">
                    <span>Delivery:</span>
                    <span className="text-green-600 dark:text-green-400 font-semibold">Free</span>
                  </div>
                  <div className="border-t border-gray-200 dark:border-gray-600 pt-4">
                    <div className="flex justify-between font-bold text-xl text-indigo-900 dark:text-indigo-100">
                      <span>Total:</span>
                      <span>NLe{getTotal().toFixed(2)}</span>
                    </div>
                  </div>
                </div>

                <Link href="/checkout">
                  <Button
                    className="w-full bg-red-600 hover:bg-red-700 dark:bg-red-700 dark:hover:bg-red-600 text-white py-3 text-lg font-semibold rounded-2xl"
                    size="lg"
                  >
                    Proceed to Checkout
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* Additional Info */}
            <div className="mt-6 bg-indigo-50 dark:bg-indigo-950/50 p-4 rounded-lg border border-indigo-200 dark:border-indigo-800">
              <h3 className="font-bold text-indigo-900 dark:text-indigo-100 mb-2">Need Help?</h3>
              <p className="text-gray-700 dark:text-gray-300 text-sm mb-2">Call us for assistance with your order:</p>
              <p className="font-bold text-indigo-900 dark:text-indigo-100">077 254220 / 076 369828</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
