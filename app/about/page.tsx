import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">About ShopEase</h1>
          <p className="text-xl text-gray-600">Your trusted online shopping destination since 2024</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <Card>
            <CardHeader>
              <CardTitle>Our Mission</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                To provide customers with high-quality products at competitive prices, while delivering an exceptional
                online shopping experience that exceeds expectations.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Our Values</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="text-gray-600 space-y-2">
                <li>• Quality products from trusted brands</li>
                <li>• Competitive pricing and great deals</li>
                <li>• Fast and reliable shipping</li>
                <li>• Excellent customer service</li>
              </ul>
            </CardContent>
          </Card>
        </div>

        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Why Choose ShopEase?</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🚚</span>
              </div>
              <h3 className="font-semibold mb-2">Free Shipping</h3>
              <p className="text-gray-600 text-sm">Free shipping on all orders over $50</p>
            </div>

            <div className="text-center">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🔒</span>
              </div>
              <h3 className="font-semibold mb-2">Secure Payment</h3>
              <p className="text-gray-600 text-sm">Your payment information is always protected</p>
            </div>

            <div className="text-center">
              <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">↩️</span>
              </div>
              <h3 className="font-semibold mb-2">Easy Returns</h3>
              <p className="text-gray-600 text-sm">30-day return policy on all items</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
