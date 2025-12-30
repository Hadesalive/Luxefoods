import { Button } from "@/components/ui/button"
import { Phone, Clock, MapPin } from "lucide-react"
import Link from "next/link"

export default function DeliverySection() {
  return (
    <section
      id="order"
      className="py-12 lg:py-20 bg-gray-900 border-t border-gray-800 transition-colors duration-300"
    >
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center">
          {/* Delivery Badge */}
          <div className="inline-block mb-8 lg:mb-12">
            <div className="bg-orange-600 text-white text-xl lg:text-3xl font-bold px-6 lg:px-8 py-3 lg:py-4 transform -rotate-2 shadow-2xl rounded-lg border-4 border-gray-800">
              WE DO DELIVERY
            </div>
          </div>

          <div className="text-center mb-12 lg:mb-16">
            <h2 className="text-3xl sm:text-4xl lg:text-6xl font-bold mb-4 lg:mb-8 text-white leading-tight">
              🚚 Hungry? We'll Bring It To You! 🚚
            </h2>

            <p className="text-lg lg:text-xl mb-8 lg:mb-12 text-gray-400 max-w-3xl mx-auto leading-relaxed">
              🍽️ Enjoy our delicious homestyle cooking from the comfort of your home. Fast delivery available throughout
              the Lumley area and beyond. 🏠
            </p>
          </div>

          {/* Phone Numbers */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8 lg:mb-12">
            <Link href="tel:076533655">
              <Button
                size="lg"
                className="w-full sm:w-auto bg-orange-600 hover:bg-orange-700 text-white text-base lg:text-lg px-6 lg:px-8 py-3 lg:py-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
              >
                <Phone className="mr-2 h-5 w-5" />
                076533655
              </Button>
            </Link>
            <Link href="tel:076533655">
              <Button
                size="lg"
                variant="outline"
                className="w-full sm:w-auto border-2 border-gray-600 bg-transparent text-white hover:bg-gray-800 hover:border-gray-500 text-base lg:text-lg px-6 lg:px-8 py-3 lg:py-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
              >
                <Phone className="mr-2 h-5 w-5" />
                076 533655
              </Button>
            </Link>
          </div>

          {/* Features Grid */}
          <div className="grid sm:grid-cols-3 gap-6 lg:gap-8 mb-8 lg:mb-12">
            <div className="bg-gray-800 p-6 lg:p-8 rounded-2xl shadow-lg border border-gray-700 hover:border-orange-500/50 hover:shadow-xl transition-all duration-300">
              <Clock className="h-8 w-8 lg:h-12 lg:w-12 text-orange-400 mx-auto mb-4" />
              <h3 className="font-bold text-lg lg:text-xl mb-2 text-white">
                ⚡ Fast Delivery
              </h3>
              <p className="text-gray-300 text-sm lg:text-base">
                30-45 minutes average delivery time
              </p>
            </div>
            <div className="bg-gray-800 p-6 lg:p-8 rounded-2xl shadow-lg border border-gray-700 hover:border-orange-500/50 hover:shadow-xl transition-all duration-300">
              <MapPin className="h-8 w-8 lg:h-12 lg:w-12 text-orange-400 mx-auto mb-4" />
              <h3 className="font-bold text-lg lg:text-xl mb-2 text-white">
                🗺️ Wide Coverage
              </h3>
              <p className="text-gray-300 text-sm lg:text-base">Delivering throughout Lumley area</p>
            </div>
            <div className="bg-gray-800 p-6 lg:p-8 rounded-2xl shadow-lg border border-gray-700 hover:border-orange-500/50 hover:shadow-xl transition-all duration-300">
              <Phone className="h-8 w-8 lg:h-12 lg:w-12 text-orange-400 mx-auto mb-4" />
              <h3 className="font-bold text-lg lg:text-xl mb-2 text-white">
                📱 Easy Ordering
              </h3>
              <p className="text-gray-300 text-sm lg:text-base">Call or order online</p>
            </div>
          </div>

          {/* Online Order CTA */}
          <div className="bg-gray-800 p-6 lg:p-10 rounded-2xl shadow-2xl text-white border border-gray-700 hover:border-orange-500/50 transition-all duration-300">
            <h3 className="text-2xl lg:text-3xl font-bold mb-4 lg:mb-6 text-white">Order Online for Faster Service</h3>
            <p className="text-gray-300 mb-6 lg:mb-8 text-base lg:text-lg">
              Skip the wait and get exclusive deals when you order through our website!
            </p>
            <Link href="/order">
              <Button
                size="lg"
                className="bg-orange-600 hover:bg-orange-700 text-white text-lg lg:text-xl px-8 lg:px-12 py-4 lg:py-6 rounded-full shadow-lg hover:shadow-xl hover:shadow-orange-600/20 transition-all duration-300 transform hover:scale-105 font-bold"
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
