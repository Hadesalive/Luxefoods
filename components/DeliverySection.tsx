import { Button } from "@/components/ui/button"
import { Phone, Clock, MapPin } from "lucide-react"
import Link from "next/link"

export default function DeliverySection() {
  return (
    <section
      id="order"
      className="py-12 lg:py-20 bg-gradient-to-br from-red-50 via-orange-50 to-yellow-50 dark:from-red-950/20 dark:via-orange-950/20 dark:to-yellow-950/20 transition-colors duration-300"
    >
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center">
          {/* Delivery Badge */}
          <div className="inline-block mb-8 lg:mb-12">
            <div className="bg-red-600 dark:bg-red-700 text-white text-xl lg:text-3xl font-bold px-6 lg:px-8 py-3 lg:py-4 transform -rotate-2 shadow-2xl rounded-lg border-4 border-white dark:border-gray-800">
              WE DO DELIVERY
            </div>
          </div>

          <div className="text-center mb-12 lg:mb-16">
            <h2 className="text-3xl sm:text-4xl lg:text-6xl font-bold mb-4 lg:mb-8 text-black dark:text-white leading-tight">
              🚚 Hungry? We'll Bring It To You! 🚚
            </h2>

            <p className="text-lg lg:text-xl mb-8 lg:mb-12 text-gray-700 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
              🍽️ Enjoy our delicious homestyle cooking from the comfort of your home. Fast delivery available throughout
              the Lumley area and beyond. 🏠
            </p>
          </div>

          {/* Phone Numbers */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8 lg:mb-12">
            <Link href="tel:076533655">
              <Button
                size="lg"
                className="w-full sm:w-auto bg-black hover:bg-gray-800 dark:bg-gray-800 dark:hover:bg-gray-700 text-white text-base lg:text-lg px-6 lg:px-8 py-3 lg:py-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
              >
                <Phone className="mr-2 h-5 w-5" />
                076533655
              </Button>
            </Link>
                            <Link href="tel:076533655">
                  <Button
                    size="lg"
                    variant="outline"
                    className="w-full sm:w-auto border-2 border-black dark:border-gray-700 text-black dark:text-white hover:bg-gray-100 dark:hover:bg-gray-900/20 text-base lg:text-lg px-6 lg:px-8 py-3 lg:py-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                  >
                    <Phone className="mr-2 h-5 w-5" />
                    076 533655
                  </Button>
                </Link>
          </div>

          {/* Features Grid */}
          <div className="grid sm:grid-cols-3 gap-6 lg:gap-8 mb-8 lg:mb-12">
            <div className="bg-white dark:bg-gray-800 p-6 lg:p-8 rounded-2xl shadow-lg border dark:border-gray-700">
              <Clock className="h-8 w-8 lg:h-12 lg:w-12 text-black dark:text-white mx-auto mb-4" />
              <h3 className="font-bold text-lg lg:text-xl mb-2 text-black dark:text-white">
                ⚡ Fast Delivery
              </h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm lg:text-base">
                30-45 minutes average delivery time
              </p>
            </div>
            <div className="bg-white dark:bg-gray-800 p-6 lg:p-8 rounded-2xl shadow-lg border dark:border-gray-700">
              <MapPin className="h-8 w-8 lg:h-12 lg:w-12 text-black dark:text-white mx-auto mb-4" />
              <h3 className="font-bold text-lg lg:text-xl mb-2 text-black dark:text-white">
                🗺️ Wide Coverage
              </h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm lg:text-base">Delivering throughout Lumley area</p>
            </div>
            <div className="bg-white dark:bg-gray-800 p-6 lg:p-8 rounded-2xl shadow-lg border dark:border-gray-700">
              <Phone className="h-8 w-8 lg:h-12 lg:w-12 text-black dark:text-white mx-auto mb-4" />
              <h3 className="font-bold text-lg lg:text-xl mb-2 text-black dark:text-white">
                📱 Easy Ordering
              </h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm lg:text-base">Call or order online</p>
            </div>
          </div>

          {/* Online Order CTA */}
          <div className="bg-gradient-to-r from-black to-gray-900 dark:from-black dark:to-gray-800 p-6 lg:p-10 rounded-2xl shadow-2xl text-white">
            <h3 className="text-2xl lg:text-3xl font-bold mb-4 lg:mb-6">Order Online for Faster Service</h3>
            <p className="text-amber-200/90 dark:text-amber-100/90 mb-6 lg:mb-8 text-base lg:text-lg">
              Skip the wait and get exclusive deals when you order through our website!
            </p>
            <Link href="/order">
              <Button
                size="lg"
                className="bg-red-600 hover:bg-red-700 dark:bg-red-700 dark:hover:bg-red-600 text-white text-lg lg:text-xl px-8 lg:px-12 py-4 lg:py-6 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 font-bold"
              >
                ORDER NOW
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
