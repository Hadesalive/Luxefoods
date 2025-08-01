import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const orderData = JSON.parse(formData.get("orderData") as string)

    // Format the order message for WhatsApp
    let message = "🍞 *NEW ORDER - KINGS BAKERY* 🍞\n\n"

    // Customer info
    message += "👤 *Customer Details:*\n"
    message += `📝 Name: ${orderData.customer.name}\n`
    message += `📞 Phone: ${orderData.customer.phone}\n`

    if (orderData.deliveryMethod === "delivery") {
      message += `🏠 Address: ${orderData.customer.address}, ${orderData.customer.city}\n`
    } else {
      message += "🏪 *PICKUP ORDER*\n"
    }

    if (orderData.customer.notes) {
      message += `💬 Notes: ${orderData.customer.notes}\n`
    }

    // Order items
    message += "\n🛒 *Order Items:*\n"
    orderData.items.forEach((item: any, index: number) => {
      message += `${index + 1}. ${item.name} - NLe${item.price.toFixed(2)}\n`
    })

    // Total
    message += `\n💰 *Total: NLe${orderData.total.toFixed(2)}*\n`
    message += `💳 Payment: ${orderData.paymentMethod === "cash" ? "💵 Cash on Delivery" : "📱 Orange Money"}\n`

    if (orderData.paymentMethod === "orange-money") {
      message += `🔢 Transaction ID: ${orderData.paymentDetails.transactionId}\n`
    }

    message += `\n📋 Order ID: ${orderData.orderId}\n`
    message += `⏰ Time: ${new Date(orderData.timestamp).toLocaleString()}\n\n`
    message += "🙏 Thank you for choosing Kings Bakery!\n"
    message += "⚡ Please confirm this order ASAP"

    // Restaurant WhatsApp number (Sierra Leone format)
    // Make sure to use the international format without any spaces or special characters
    const restaurantNumber = "23276533655" // +232 76 533655

    // Create WhatsApp URL with proper encoding
    // Using encodeURIComponent to ensure special characters are properly encoded
    const encodedMessage = encodeURIComponent(message)
    const whatsappUrl = `https://api.whatsapp.com/send?phone=${restaurantNumber}&text=${encodedMessage}`

    // Simulate successful sending (in real implementation, this would open WhatsApp)
    console.log("Order message prepared:", message)
    console.log("WhatsApp URL:", whatsappUrl)

    return NextResponse.json({
      success: true,
      message: "Order prepared successfully",
      orderId: orderData.orderId,
      whatsappUrl: whatsappUrl,
    })
  } catch (error) {
    console.error("Error preparing order:", error)
    return NextResponse.json({ success: false, error: "Failed to prepare order" }, { status: 500 })
  }
}
