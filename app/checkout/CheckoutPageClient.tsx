"use client"

import type React from "react"
import { useState } from "react"
import { useCart } from "@/contexts/CartContext"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { useRouter } from "next/navigation"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Loader2, Upload, X, ArrowLeft, CheckCircle, AlertTriangle } from "lucide-react"
import { WhatsappIcon } from "@/components/WhatsappIcon"
import Link from "next/link"

export default function CheckoutPageClient() {
  const { items, getTotal, clearCart } = useCart()
  const router = useRouter()
  const [isProcessing, setIsProcessing] = useState(false)
  const [deliveryMethod, setDeliveryMethod] = useState("delivery")
  const [paymentMethod, setPaymentMethod] = useState("cash")
  const [uploadedImage, setUploadedImage] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [orderStatus, setOrderStatus] = useState<{
    step: "form" | "processing" | "success" | "error"
    message?: string
    orderId?: string
    whatsappUrl?: string
  }>({ step: "form" })

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    address: "",
    city: "",
    notes: "",
    transactionId: "",
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setUploadedImage(file)
      const reader = new FileReader()
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const removeImage = () => {
    setUploadedImage(null)
    setImagePreview(null)
  }

  const generateOrderId = () => {
    const timestamp = Date.now()
    const random = Math.random().toString(36).substring(2, 8).toUpperCase()
    return `kings bakery-${timestamp}-${random}`
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsProcessing(true)
    setOrderStatus({ step: "processing", message: "Processing your order..." })

    try {
      // Generate order ID
      const orderId = generateOrderId()

      // Prepare order data
      const orderData = {
        orderId,
        customer: {
          name: formData.name,
          phone: formData.phone,
          email: formData.email || undefined,
          address: deliveryMethod === "delivery" ? formData.address : undefined,
          city: deliveryMethod === "delivery" ? formData.city : undefined,
          notes: formData.notes || undefined,
        },
        items: items.map((item) => ({
          id: item.id,
          name: item.name,
          price: item.price,
          type: item.type,
          size: item.size,
          quantity: item.quantity,
        })),
        deliveryMethod,
        paymentMethod,
        paymentDetails:
          paymentMethod === "orange-money"
            ? {
                transactionId: formData.transactionId,
              }
            : undefined,
        total: getTotal(),
        timestamp: new Date().toISOString(),
        status: "pending",
      }

      // Create FormData for API call
      const apiFormData = new FormData()
      apiFormData.append("orderData", JSON.stringify(orderData))

      if (paymentMethod === "orange-money" && uploadedImage) {
        apiFormData.append("image", uploadedImage)
      }

      setOrderStatus({ step: "processing", message: "Preparing WhatsApp message..." })

      // Send to API to prepare WhatsApp message
      const response = await fetch("/api/send-whatsapp", {
        method: "POST",
        body: apiFormData,
      })

      const result = await response.json()

      if (result.success) {
        setOrderStatus({
          step: "success",
          message: "Order prepared successfully!",
          orderId: result.orderId,
          whatsappUrl: result.whatsappUrl,
        })

        // Store order ID for confirmation page
        sessionStorage.setItem("lastOrderId", orderId)
        sessionStorage.setItem("orderDetails", JSON.stringify(orderData))

        // Clear cart
        clearCart()
      } else {
        throw new Error(result.error || "Failed to prepare order")
      }
    } catch (error) {
      console.error("Error processing order:", error)
      setOrderStatus({
        step: "error",
        message: "Failed to prepare order. Please try again or contact us directly.",
      })
    } finally {
      setIsProcessing(false)
    }
  }

  // Show success screen
  if (orderStatus.step === "success") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-red-50 dark:from-gray-900 dark:via-gray-800 dark:to-orange-900 flex items-center justify-center transition-colors duration-300">
        <div className="container mx-auto px-4 py-16 text-center max-w-lg">
          <Card className="shadow-xl border-green-200 dark:border-green-800 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
            <CardContent className="p-8">
              <div className="mb-6">
                <CheckCircle className="h-20 w-20 text-green-600 dark:text-green-400 mx-auto mb-4" />
                <h1 className="text-3xl font-bold mb-4 text-green-800 dark:text-green-200">🎉 Order Ready! 🎉</h1>
                <p className="text-green-700 dark:text-green-300 mb-4">{orderStatus.message}</p>
                {orderStatus.orderId && (
                  <div className="bg-green-100 dark:bg-green-900/30 p-4 rounded-lg mb-6">
                    <p className="text-sm text-green-800 dark:text-green-200">
                      <strong>📋 Order ID:</strong> {orderStatus.orderId}
                    </p>
                  </div>
                )}
              </div>

              <div className="space-y-4">
                <div className="bg-white dark:bg-gray-700 p-4 rounded-lg border border-green-200 dark:border-green-700">
                  <div className="flex items-center gap-3 mb-3">
                    <WhatsappIcon className="h-6 w-6 text-green-600 dark:text-green-400" />
                    <span className="font-semibold text-green-800 dark:text-green-200">📱 Send Order via WhatsApp</span>
                  </div>
                  <p className="text-sm text-gray-700 dark:text-gray-300 mb-4">
                    🚀 Click the button below to send your order directly to the restaurant via WhatsApp.
                  </p>
                  {orderStatus.whatsappUrl && (
                    <a href={orderStatus.whatsappUrl} target="_blank" rel="noopener noreferrer">
                      <Button className="w-full bg-green-600 hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-600 text-white rounded-2xl">
                        <WhatsappIcon className="h-5 w-5 mr-2" />📤 Send Order via WhatsApp
                      </Button>
                    </a>
                  )}
                </div>

                <div className="bg-gray-50 dark:bg-gray-950/50 p-4 rounded-lg border border-gray-200 dark:border-gray-800">
                  <h3 className="font-semibold text-black dark:text-white mb-3">🔄 What Happens Next?</h3>
                  <ul className="text-sm text-gray-700 dark:text-gray-300 space-y-2 text-left">
                    <li>✅ Restaurant receives your order via WhatsApp</li>
                    <li>⏱️ They'll confirm and give you an estimated delivery time</li>
                    <li>🚚 Your food will be prepared and delivered to you</li>
                    <li>💳 Pay cash on delivery or with Orange Money</li>
                  </ul>
                </div>

                <div className="bg-orange-50 dark:bg-orange-950/50 p-4 rounded-lg border border-orange-200 dark:border-orange-800">
                  <h3 className="font-semibold text-orange-800 dark:text-orange-200 mb-2">📞 Need Help?</h3>
                  <p className="text-sm text-orange-700 dark:text-orange-300">
                    Call us: <strong>077 254220 / 076 369828</strong>
                  </p>
                </div>
              </div>

              <div className="mt-8 space-y-3">
                <Link href="/">
                  <Button variant="outline" className="w-full border-orange-200 dark:border-orange-800 text-orange-700 dark:text-orange-300 hover:bg-orange-50 dark:hover:bg-orange-950/50">
                    🏠 Back to Home
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  // Show error screen
  if (orderStatus.step === "error") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-red-50 dark:from-gray-900 dark:via-gray-800 dark:to-orange-900 flex items-center justify-center transition-colors duration-300">
        <div className="container mx-auto px-4 py-16 text-center max-w-lg">
          <Card className="shadow-xl border-red-200 dark:border-red-800 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
            <CardContent className="p-8">
              <div className="mb-6">
                <AlertTriangle className="h-20 w-20 text-red-600 dark:text-red-400 mx-auto mb-4" />
                <h1 className="text-3xl font-bold mb-4 text-red-800 dark:text-red-200">❌ Order Failed</h1>
                <p className="text-red-700 dark:text-red-300 mb-4">{orderStatus.message}</p>
              </div>

              <div className="space-y-4">
                <div className="bg-red-50 dark:bg-red-950/50 p-4 rounded-lg border border-red-200 dark:border-red-800">
                  <h3 className="font-semibold text-red-800 dark:text-red-200 mb-2">📞 Contact Us Directly</h3>
                  <p className="text-sm text-red-700 dark:text-red-300 mb-3">
                    You can still place your order by calling us directly:
                  </p>
                  <p className="font-bold text-red-800 dark:text-red-200">077 254220 / 076 369828</p>
                </div>

                <div className="bg-gray-50 dark:bg-gray-950/50 p-4 rounded-lg border border-gray-200 dark:border-gray-800">
                  <h3 className="font-semibold text-black dark:text-white mb-2">📱 Or WhatsApp Us</h3>
                  <p className="text-sm text-gray-700 dark:text-gray-300 mb-3">
                    Send us a WhatsApp message with your order details.
                  </p>
                  <a href="https://wa.me/23277254220" target="_blank" rel="noopener noreferrer">
                    <Button className="w-full bg-green-600 hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-600 text-white rounded-2xl">
                      <WhatsappIcon className="h-5 w-5 mr-2" />📤 WhatsApp Us
                    </Button>
                  </a>
                </div>
              </div>

              <div className="mt-8 space-y-3">
                <Button onClick={() => setOrderStatus({ step: "form" })} variant="outline" className="w-full border-orange-200 dark:border-orange-800 text-orange-700 dark:text-orange-300 hover:bg-orange-50 dark:hover:bg-orange-950/50">
                  🔄 Try Again
                </Button>
                <Link href="/">
                  <Button variant="outline" className="w-full border-gray-200 dark:border-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-950/50">
                    🏠 Back to Home
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  // Show processing screen
  if (orderStatus.step === "processing") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-red-50 dark:from-gray-900 dark:via-gray-800 dark:to-orange-900 flex items-center justify-center transition-colors duration-300">
        <div className="container mx-auto px-4 py-16 text-center max-w-lg">
          <Card className="shadow-xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-orange-200 dark:border-orange-800">
            <CardContent className="p-8">
              <Loader2 className="h-20 w-20 text-orange-600 dark:text-orange-400 mx-auto mb-4 animate-spin" />
              <h1 className="text-2xl font-bold mb-4 text-gray-900 dark:text-gray-100">Processing Your Order...</h1>
              <p className="text-gray-600 dark:text-gray-400">{orderStatus.message}</p>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 flex items-center justify-center transition-colors duration-300">
        <div className="container mx-auto px-4 py-16 text-center max-w-md">
          <Card className="shadow-xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-white/20 dark:border-gray-700/20">
            <CardContent className="p-8">
              <h1 className="text-2xl lg:text-3xl font-bold mb-4 text-black dark:text-white">
                Your Cart is Empty
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mb-8">Add some delicious items before checkout!</p>
              <Button
                onClick={() => router.push("/#menu")}
                className="w-full bg-black hover:bg-gray-800 dark:bg-gray-800 dark:hover:bg-gray-700 text-white rounded-2xl"
              >
                View Menu
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-red-50 dark:from-gray-900 dark:via-gray-800 dark:to-orange-900 transition-colors duration-300">
      <div className="container mx-auto px-4 py-6 lg:py-8 max-w-7xl">
        <Link
          href="/cart"
          className="inline-flex items-center text-black dark:text-white hover:text-gray-700 dark:hover:text-gray-300 mb-6 lg:mb-8 transition-colors group"
        >
          <ArrowLeft className="h-4 w-4 mr-2 group-hover:-translate-x-1 transition-transform" />
          <span className="font-medium">Back to Cart</span>
        </Link>

        <div className="text-center mb-6 lg:mb-8">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-black dark:text-white">Checkout</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">Complete your order details below</p>
        </div>

        {/* Processing Overlay */}
        {(orderStatus.step as string) === "processing" && (
          <div className="fixed inset-0 bg-black/50 dark:bg-black/70 flex items-center justify-center z-50">
            <Card className="max-w-md mx-4 bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm">
              <CardContent className="p-8 text-center">
                <Loader2 className="h-12 w-12 animate-spin text-black dark:text-white mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2 text-black dark:text-white">
                  Processing Your Order
                </h3>
                <p className="text-gray-600 dark:text-gray-400">{orderStatus.message}</p>
              </CardContent>
            </Card>
          </div>
        )}

        <div className="grid lg:grid-cols-5 gap-6 lg:gap-8">
          {/* Form Section */}
          <div className="lg:col-span-3">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Contact Information */}
              <Card className="shadow-lg bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-white/20 dark:border-gray-700/20">
                <CardHeader>
                  <CardTitle className="text-lg lg:text-xl text-black dark:text-white">
                    Contact Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="name" className="text-gray-700 dark:text-gray-300">
                        Full Name *
                      </Label>
                      <Input
                        id="name"
                        name="name"
                        required
                        value={formData.name}
                        onChange={handleInputChange}
                        className="mt-1 bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-700 text-gray-900 dark:text-gray-100"
                      />
                    </div>
                    <div>
                      <Label htmlFor="phone" className="text-gray-700 dark:text-gray-300">
                        Phone Number *
                      </Label>
                      <Input
                        id="phone"
                        name="phone"
                        required
                        value={formData.phone}
                        onChange={handleInputChange}
                        className="mt-1 bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-700 text-gray-900 dark:text-gray-100"
                        placeholder="e.g., 076 123 456"
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="email" className="text-gray-700 dark:text-gray-300">
                      Email (Optional)
                    </Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="mt-1 bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-700 text-gray-900 dark:text-gray-100"
                      placeholder="For order confirmations"
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Delivery Method */}
              <Card className="shadow-lg bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-white/20 dark:border-gray-700/20">
                <CardHeader>
                  <CardTitle className="text-lg lg:text-xl text-black dark:text-white">
                    Delivery Method
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <RadioGroup value={deliveryMethod} onValueChange={setDeliveryMethod} className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="delivery" id="delivery" className="border-gray-400 dark:border-gray-600" />
                      <Label htmlFor="delivery" className="cursor-pointer text-gray-900 dark:text-gray-100">
                        Delivery
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="pickup" id="pickup" className="border-gray-400 dark:border-gray-600" />
                      <Label htmlFor="pickup" className="cursor-pointer text-gray-900 dark:text-gray-100">
                        Pickup
                      </Label>
                    </div>
                  </RadioGroup>

                  {deliveryMethod === "delivery" && (
                    <div className="space-y-4 mt-6 p-4 bg-gray-50 dark:bg-gray-900/50 rounded-lg">
                      <div className="grid sm:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="address" className="text-gray-700 dark:text-gray-300">
                            Delivery Address *
                          </Label>
                          <Input
                            id="address"
                            name="address"
                            required
                            value={formData.address}
                            onChange={handleInputChange}
                            className="mt-1 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-900 dark:text-gray-100"
                            placeholder="Street address"
                          />
                        </div>
                        <div>
                          <Label htmlFor="city" className="text-gray-700 dark:text-gray-300">
                            City/Area *
                          </Label>
                          <Input
                            id="city"
                            name="city"
                            required
                            value={formData.city}
                            onChange={handleInputChange}
                            className="mt-1 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-900 dark:text-gray-100"
                            placeholder="e.g., Lumley, Freetown"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="mt-6">
                    <Label htmlFor="notes" className="text-gray-700 dark:text-gray-300">
                      Special Instructions (Optional)
                    </Label>
                    <textarea
                      id="notes"
                      name="notes"
                      rows={3}
                      className="w-full border border-gray-200 dark:border-gray-700 rounded-md p-3 mt-1 resize-none bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100"
                      value={formData.notes}
                      onChange={handleInputChange}
                      placeholder="Any special requests or delivery instructions..."
                    ></textarea>
                  </div>
                </CardContent>
              </Card>

              {/* Payment Method */}
              <Card className="shadow-lg bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-white/20 dark:border-gray-700/20">
                <CardHeader>
                  <CardTitle className="text-lg lg:text-xl text-black dark:text-white">
                    Payment Method
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod} className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="cash" id="cash" className="border-gray-400 dark:border-gray-600" />
                      <Label htmlFor="cash" className="cursor-pointer text-gray-900 dark:text-gray-100">
                        Cash on Delivery
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem
                        value="orange-money"
                        id="orange-money"
                        className="border-gray-400 dark:border-gray-600"
                      />
                      <Label htmlFor="orange-money" className="cursor-pointer text-gray-900 dark:text-gray-100">
                        Orange Money
                      </Label>
                    </div>
                  </RadioGroup>

                  {/* Orange Money Additional Fields */}
                  {paymentMethod === "orange-money" && (
                    <div className="mt-6 p-4 bg-orange-50 dark:bg-orange-950/30 rounded-lg border border-orange-200 dark:border-orange-800">
                      <h4 className="font-semibold text-orange-800 dark:text-orange-200 mb-4">
                        Orange Money Payment Details
                      </h4>

                      {/* Transaction ID */}
                      <div className="mb-4">
                        <Label htmlFor="transactionId" className="text-orange-700 dark:text-orange-300">
                          Transaction ID *
                        </Label>
                        <Input
                          id="transactionId"
                          name="transactionId"
                          required={paymentMethod === "orange-money"}
                          value={formData.transactionId}
                          onChange={handleInputChange}
                          placeholder="Enter your Orange Money transaction ID"
                          className="mt-1 bg-white dark:bg-gray-800 border-orange-200 dark:border-orange-700 text-gray-900 dark:text-gray-100"
                        />
                      </div>

                      {/* Screenshot Upload */}
                      <div>
                        <Label htmlFor="screenshot" className="text-orange-700 dark:text-orange-300">
                          Payment Screenshot (Optional)
                        </Label>
                        <div className="mt-1">
                          {!imagePreview ? (
                            <div className="border-2 border-dashed border-orange-300 dark:border-orange-700 rounded-lg p-6 text-center hover:border-orange-400 dark:hover:border-orange-600 transition-colors bg-orange-50/50 dark:bg-orange-950/20">
                              <Upload className="h-8 w-8 text-orange-400 dark:text-orange-500 mx-auto mb-2" />
                              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                                Upload screenshot of payment confirmation
                              </p>
                              <input
                                type="file"
                                id="screenshot"
                                accept="image/*"
                                onChange={handleImageUpload}
                                className="hidden"
                              />
                              <Button
                                type="button"
                                variant="outline"
                                onClick={() => document.getElementById("screenshot")?.click()}
                                className="text-orange-600 dark:text-orange-400 border-orange-300 dark:border-orange-700 hover:bg-orange-50 dark:hover:bg-orange-950/50"
                              >
                                Choose File
                              </Button>
                            </div>
                          ) : (
                            <div className="relative">
                              <img
                                src={imagePreview || "/placeholder.svg"}
                                alt="Payment screenshot"
                                className="w-full max-w-sm mx-auto rounded-lg shadow-md"
                              />
                              <Button
                                type="button"
                                variant="destructive"
                                size="sm"
                                onClick={removeImage}
                                className="absolute top-2 right-2 rounded-full w-8 h-8 p-0"
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="mt-4 p-3 bg-orange-100 dark:bg-orange-900/30 rounded-md">
                        <p className="text-sm text-orange-800 dark:text-orange-200">
                          <strong>Instructions:</strong> Please send payment to Orange Money number:{" "}
                          <strong>+076533655</strong>
                          and enter the transaction ID above.
                        </p>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Submit Button */}
              <Button
                type="submit"
                className="w-full bg-green-600 hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-600 text-white flex items-center justify-center gap-2 py-4 text-lg font-semibold rounded-2xl"
                size="lg"
                disabled={isProcessing}
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    Processing Order...
                  </>
                ) : (
                  <>
                    <WhatsappIcon className="h-5 w-5" />
                    Complete Order - NLe{getTotal().toFixed(2)}
                  </>
                )}
              </Button>
            </form>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-2">
            <div className="lg:sticky lg:top-6">
              <Card className="shadow-lg bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-white/20 dark:border-gray-700/20">
                <CardHeader>
                  <CardTitle className="text-lg lg:text-xl text-black dark:text-white">
                    Order Summary
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {/* Order Items */}
                    <div className="max-h-64 overflow-y-auto space-y-3">
                      {items.map((item, index) => (
                        <div
                          key={index}
                          className="flex justify-between items-start py-2 border-b border-gray-100 dark:border-gray-700 last:border-b-0"
                        >
                          <div className="flex-1 pr-2">
                            <span className="font-medium text-sm text-gray-900 dark:text-gray-100">{item.name}</span>
                            <p className="text-xs text-gray-500 dark:text-gray-400">{item.type}</p>
                          </div>
                          <span className="font-semibold text-sm text-gray-900 dark:text-gray-100">
                            NLe{item.price.toFixed(2)}
                          </span>
                        </div>
                      ))}
                    </div>

                    <Separator className="bg-gray-200 dark:bg-gray-700" />

                    {/* Totals */}
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm text-gray-900 dark:text-gray-100">
                        <span>Subtotal:</span>
                        <span>NLe{getTotal().toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between text-sm text-gray-900 dark:text-gray-100">
                        <span>Delivery:</span>
                        <span className="text-green-600 dark:text-green-400">Free</span>
                      </div>
                      <Separator className="bg-gray-200 dark:bg-gray-700" />
                      <div className="flex justify-between font-bold text-lg text-black dark:text-white">
                        <span>Total:</span>
                        <span>NLe{getTotal().toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Contact Info */}
              <div className="mt-6 bg-gray-50 dark:bg-gray-950/50 p-4 rounded-lg border border-gray-200 dark:border-gray-800">
                <h3 className="font-bold text-black dark:text-white mb-2">Restaurant Contact</h3>
                <p className="text-gray-700 dark:text-gray-300 text-sm">For any questions about your order:</p>
                <p className="font-bold text-black dark:text-white mt-1">+23232020263 / +23276533655</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 