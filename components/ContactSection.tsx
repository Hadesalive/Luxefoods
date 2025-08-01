import { MapPin, Phone, Mail } from "lucide-react"

export default function ContactSection() {
  return (
    <section className="py-16 bg-white dark:bg-gray-900 transition-colors duration-300">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4 text-black dark:text-white">📍 Find Us 📍</h2>
            <div className="w-24 h-1 bg-red-600 dark:bg-red-500 mx-auto"></div>
          </div>

          <div className="bg-black dark:bg-gray-800 text-white p-8 rounded-lg shadow-lg border dark:border-gray-700">
            <div className="flex flex-col md:flex-row gap-8">
              <div className="md:w-1/2">
                <h3 className="text-2xl font-bold mb-6">📞 Contact Information</h3>

                <div className="space-y-6">
                  <div className="flex items-start">
                    <MapPin className="h-6 w-6 mr-4 flex-shrink-0 mt-1" />
                    <p className="text-lg">
                      🏠 117 MAIN REGENT ROAD, HILL STATION
                      <br />
                      OPPOSITE CITY SUPERMARKET
                    </p>
                  </div>

                  <div className="flex items-center">
                    <Phone className="h-6 w-6 mr-4 flex-shrink-0" />
                    <p className="text-lg">📱 076 533655</p>
                  </div>

                  <div className="flex items-center">
                    <Mail className="h-6 w-6 mr-4 flex-shrink-0" />
                    <p className="text-lg">📧 info@thekingsbakerysl.com</p>
                  </div>
                </div>

                <div className="mt-8">
                  <h4 className="text-xl font-bold mb-4">🕐 Opening Hours</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Monday - Friday</span>
                      <span>10:00 AM - 10:00 PM</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Saturday - Sunday</span>
                      <span>11:00 AM - 11:00 PM</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="md:w-1/2">
                <div className="h-full bg-gray-300 dark:bg-gray-700 rounded-lg overflow-hidden">
                  {/* This would be a map in a real implementation */}
                  <div className="h-full flex items-center justify-center p-8 text-gray-700 dark:text-gray-300 text-center">
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

          <div className="text-center mt-8 text-black dark:text-white text-xl italic">
            "Enjoy HomeStyle cooking"
          </div>
        </div>
      </div>
    </section>
  )
}
