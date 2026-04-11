import { type NextRequest, NextResponse } from "next/server"

interface OrderItem {
  name: string
  price: number
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const orderData = JSON.parse(formData.get("orderData") as string)

    // Format the order message for WhatsApp
    let message = "*NEW ORDER - LUXE FOOD*\n\n"

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
    orderData.items.forEach((item: OrderItem, index: number) => {
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
    message += "Thank you for choosing LUXE FOOD!\n"
    message += "⚡ Please confirm this order ASAP"

    // Restaurant WhatsApp number (Sierra Leone format)
    // Make sure to use the international format without any spaces or special characters
    const restaurantNumber = "23276825325" // +232 076 825 325

    // Create WhatsApp URL with proper encoding
    // Using encodeURIComponent to ensure special characters are properly encoded
    const encodedMessage = encodeURIComponent(message)
    const whatsappUrl = `https://api.whatsapp.com/send?phone=${restaurantNumber}&text=${encodedMessage}`

    // Persist to Supabase (fire-and-forget)
    try {
      const { createClient } = await import('@supabase/supabase-js')
      const sUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
      const sKey = process.env.SUPABASE_SERVICE_ROLE_KEY
      if (sUrl && sKey) {
        const db = createClient(sUrl, sKey)
        await db.from('orders').insert({
          order_ref:       orderData.orderId,
          source:          'online',
          status:          'pending',
          customer_name:   orderData.customer?.name || null,
          customer_phone:  orderData.customer?.phone || null,
          customer_address: orderData.deliveryMethod === 'delivery'
            ? `${orderData.customer?.address || ''}, ${orderData.customer?.city || ''}`.trim()
            : null,
          delivery_method: orderData.deliveryMethod === 'delivery' ? 'delivery' : 'pickup',
          payment_method:  orderData.paymentMethod === 'orange-money' ? 'orange_money' : (orderData.paymentMethod || 'cash'),
          discount_amount: 0,
          items: (orderData.items || []).map((item: OrderItem, idx: number) => ({
            id: String(idx), name: item.name, price: item.price, quantity: 1,
          })),
          subtotal: orderData.total,
          total:    orderData.total,
          notes:    orderData.customer?.notes || null,
        })
      }
    } catch { /* DB failure never blocks the WhatsApp response */ }

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
