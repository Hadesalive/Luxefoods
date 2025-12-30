import { MapPin, Phone, Mail } from "lucide-react"

export default function ContactSection() {
  return (
    <section className="py-16 bg-gray-900 border-t border-gray-800 transition-colors duration-300">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4 text-white">📍 Find Us 📍</h2>
            <div className="w-24 h-1 bg-orange-500 mx-auto"></div>
          </div>

          <div className="bg-gray-800 text-white p-8 rounded-lg shadow-lg border border-gray-700 hover:border-gray-600 transition-colors">
            <div className="flex flex-col md:flex-row gap-8">
              <div className="md:w-1/2">
                <h3 className="text-2xl font-bold mb-6 text-white">📞 Contact Information</h3>

                <div className="space-y-6">
                  <div className="flex items-start">
                    <MapPin className="h-6 w-6 mr-4 flex-shrink-0 mt-1 text-orange-400" />
                    <p className="text-lg text-gray-200">
                      🏠 117 MAIN REGENT ROAD, HILL STATION
                      <br />
                      OPPOSITE CITY SUPERMARKET
                    </p>
                  </div>

                  <div className="flex items-center">
                    <Phone className="h-6 w-6 mr-4 flex-shrink-0 text-orange-400" />
                    <p className="text-lg text-gray-200">📱 076 533655</p>
                  </div>

                  <div className="flex items-center">
                    <Mail className="h-6 w-6 mr-4 flex-shrink-0 text-orange-400" />
                    <p className="text-lg text-gray-200">📧 info@thekingsbakerysl.com</p>
                  </div>
                </div>

                <div className="mt-8">
                  <h4 className="text-xl font-bold mb-4 text-white">🕐 Opening Hours</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between text-gray-200">
                      <span>Monday - Friday</span>
                      <span className="text-orange-400 font-semibold">10:00 AM - 10:00 PM</span>
                    </div>
                    <div className="flex justify-between text-gray-200">
                      <span>Saturday - Sunday</span>
                      <span className="text-orange-400 font-semibold">11:00 AM - 11:00 PM</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="md:w-1/2">
                <div className="h-full bg-gray-700 rounded-lg overflow-hidden">
                  {/* This would be a map in a real implementation */}
                  <div className="h-full flex items-center justify-center p-8 text-gray-300 text-center">
                    <p>
                      Map location would be displayed here.
                      <br />
                      117 MAIN REGENT ROAD, HILL STATION
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="text-center mt-8 text-white text-xl italic">
            "Enjoy HomeStyle cooking"
          </div>
        </div>
      </div>
    </section>
  )
}
