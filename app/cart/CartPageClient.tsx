"use client"

import { useCart } from "@/contexts/CartContext"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { Trash2, ArrowLeft, ShoppingBag } from "lucide-react"
import { motion } from "framer-motion"

export default function CartPageClient() {
  const { items, removeItem, getTotal } = useCart()

  if (items.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center transition-colors duration-300" style={{ backgroundColor: "#FFFDF8" }}>
        <div className="container mx-auto px-4 py-16 text-center max-w-md">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Card className="shadow-lg bg-white border border-stone-100 rounded-2xl">
              <CardContent className="p-8">
                <ShoppingBag className="h-16 w-16 text-stone-300 mx-auto mb-4" />
                <h1 className="text-2xl lg:text-3xl font-bold mb-4 text-stone-800">
                  Your Cart is Empty
                </h1>
                <p className="text-stone-500 mb-8">Add some delicious items to get started!</p>
                <Link href="/#menu">
                  <Button
                    size="lg"
                    className="w-full bg-yellow-500 hover:bg-yellow-600 text-black rounded-2xl font-semibold"
                  >
                    View Menu
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen transition-colors duration-300" style={{ backgroundColor: "#FFFDF8" }}>
      <div className="container mx-auto px-4 py-6 lg:py-8 max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Link
            href="/"
            className="inline-flex items-center text-stone-800 hover:text-yellow-600 mb-6 lg:mb-8 transition-colors group"
          >
            <ArrowLeft className="h-4 w-4 mr-2 group-hover:-translate-x-1 transition-transform" />
            <span className="font-medium">Back to Menu</span>
          </Link>

          <div className="text-center mb-6 lg:mb-8">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-stone-800">
              Your Order
            </h1>
            <p className="text-stone-500 mt-2">
              {items.length} {items.length === 1 ? "item" : "items"} in your cart
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-6 lg:gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2">
              <div className="space-y-4">
                {items.map((item, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                  >
                    <Card className="shadow-sm hover:shadow-lg transition-all duration-300 bg-white border border-stone-100 rounded-2xl">
                      <CardContent className="p-4 lg:p-6">
                        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                          <div className="flex-1">
                            <h3 className="font-semibold text-lg text-stone-800">{item.name}</h3>
                            <p className="text-stone-500 text-sm capitalize">{item.type}</p>
                            {item.size && <p className="text-stone-400 text-xs">Size: {item.size}</p>}
                          </div>

                          <div className="flex items-center justify-between sm:justify-end gap-4">
                            <div className="font-bold text-xl text-yellow-600">
                              NLe{item.price.toFixed(2)}
                            </div>
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => removeItem(item.id)}
                              className="rounded-full hover:scale-105 transition-transform bg-red-500 hover:bg-red-600"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:sticky lg:top-6 lg:h-fit">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <Card className="shadow-lg bg-white border border-stone-100 rounded-2xl">
                  <CardHeader>
                    <CardTitle className="text-xl text-stone-800">Order Summary</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4 mb-6">
                      <div className="flex justify-between text-lg text-stone-800">
                        <span>Subtotal:</span>
                        <span>NLe{getTotal().toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between text-lg text-stone-800">
                        <span>Delivery:</span>
                        <span className="text-stone-500 text-base italic">Confirmed after order</span>
                      </div>
                      <div className="border-t border-stone-200 pt-4">
                        <div className="flex justify-between font-bold text-xl text-yellow-600">
                          <span>Total:</span>
                          <span>NLe{getTotal().toFixed(2)}</span>
                        </div>
                      </div>
                    </div>

                    <Link href="/checkout">
                      <Button
                        className="w-full bg-yellow-500 hover:bg-yellow-600 text-black py-3 text-lg font-semibold rounded-2xl"
                        size="lg"
                      >
                        Proceed to Checkout
                      </Button>
                    </Link>
                  </CardContent>
                </Card>

                {/* Additional Info */}
                <div className="mt-6 p-4 rounded-2xl border border-stone-200" style={{ backgroundColor: "#F5ECD7" }}>
                  <h3 className="font-bold text-stone-800 mb-2">Need Help?</h3>
                  <p className="text-stone-600 text-sm mb-2">Call us for assistance with your order:</p>
                  <p className="font-bold text-yellow-700">+23232020263 / +23276533655</p>
                </div>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
