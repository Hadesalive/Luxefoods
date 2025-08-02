import type { Metadata } from "next"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export const metadata: Metadata = {
  title: "About Kings Bakery - Fresh Food & Local Dishes | Freetown, Sierra Leone",
  description:
    "Learn about Kings Bakery in Freetown, Sierra Leone. Serving fresh bread, pastries, local dishes, and international cuisine since 2024. Quality food delivered to your door.",
  keywords: [
    "about Kings Bakery",
    "Kings Bakery history",
    "bakery Freetown Sierra Leone",
    "fresh bread bakery",
    "local food restaurant",
    "Kings Bakery story",
    "bakery about us",
    "restaurant Freetown about",
  ],
  openGraph: {
    title: "About Kings Bakery - Fresh Food & Local Dishes | Freetown, Sierra Leone",
    description:
      "Learn about Kings Bakery in Freetown, Sierra Leone. Serving fresh bread, pastries, local dishes, and international cuisine since 2024.",
    url: "https://thekingsbakerysl.com/about",
  },
}

export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">About Kings Bakery</h1>
          <p className="text-xl text-gray-600">Your trusted source for fresh food and local dishes in Freetown since 2024</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <Card>
            <CardHeader>
              <CardTitle>Our Mission</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                To provide our community with the freshest bread, pastries, local dishes, and international cuisine, 
                delivered with love and care to your doorstep. We believe everyone deserves quality food made with 
                the finest ingredients.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Our Values</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="text-gray-600 space-y-2">
                <li>• Fresh ingredients sourced locally</li>
                <li>• Traditional recipes with modern twists</li>
                <li>• Fast and reliable delivery service</li>
                <li>• Exceptional customer satisfaction</li>
                <li>• Community-focused business</li>
              </ul>
            </CardContent>
          </Card>
        </div>

        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Why Choose Kings Bakery?</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="bg-orange-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🍞</span>
              </div>
              <h3 className="font-semibold mb-2">Fresh Daily</h3>
              <p className="text-gray-600 text-sm">All our bread and pastries are baked fresh every day</p>
            </div>

            <div className="text-center">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🚚</span>
              </div>
              <h3 className="font-semibold mb-2">Fast Delivery</h3>
              <p className="text-gray-600 text-sm">Quick delivery to Lumley and surrounding areas</p>
            </div>

            <div className="text-center">
              <div className="bg-yellow-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🌍</span>
              </div>
              <h3 className="font-semibold mb-2">Local & International</h3>
              <p className="text-gray-600 text-sm">From local dishes to international cuisine</p>
            </div>
          </div>
        </div>

        <div className="mt-12 p-6 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <h3 className="text-xl font-bold mb-4 text-center">Our Story</h3>
          <p className="text-gray-600 text-center max-w-3xl mx-auto">
            Kings Bakery started with a simple dream: to bring the best of local and international cuisine 
            to the people of Freetown. Located in the heart of Lumley, we've become a beloved part of the 
            community, serving fresh bread, delicious pastries, and authentic local dishes. Our commitment 
            to quality and customer satisfaction has made us a trusted name in food delivery across Freetown.
          </p>
        </div>
      </div>
    </div>
  )
}
