import Link from "next/link"
import Image from "next/image"
import { Phone, Mail, MapPin, Facebook, Clock, Heart, Star } from "lucide-react"

export default function Footer() {
  return (
    <footer className="bg-gradient-to-br from-black via-gray-900 to-black dark:from-black dark:via-gray-900 dark:to-black text-white relative overflow-hidden transition-colors duration-300">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-10 left-10 text-6xl">🍕</div>
        <div className="absolute top-20 right-20 text-4xl">🥟</div>
        <div className="absolute bottom-20 left-20 text-5xl">🍽️</div>
        <div className="absolute bottom-10 right-10 text-3xl">⭐</div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-8xl opacity-30">
          🏠
        </div>
      </div>

      <div className="relative z-10 py-16 lg:py-20">
        <div className="container mx-auto px-4">
          {/* Main Footer Content */}
          <div className="grid lg:grid-cols-4 md:grid-cols-2 gap-8 lg:gap-12 mb-12">
            {/* Brand Section */}
            <div className="lg:col-span-1">
              <div className="flex items-center mb-6">
                <div className="w-16 h-16 relative mr-4 rounded-full overflow-hidden bg-white p-2 shadow-xl">
                  <Image src="/images/logo.jpg" alt="Kings Bakery Logo" fill className="object-contain" />
                </div>
                <div>
                  <h3 className="text-xl lg:text-2xl font-bold text-yellow-300 dark:text-yellow-400">
                    Kings Bakery
                  </h3>
                  <p className="text-amber-200/90 dark:text-amber-100/90 text-sm italic">"Restaurant & Fresh Baked Goods"</p>
                </div>
              </div>

              <p className="text-amber-200/90 dark:text-amber-100/90 mb-6 leading-relaxed">
                🍽️ Bringing you the finest local dishes, international cuisine, fresh bread and delicious treats with quality ingredients and traditional recipes. Experience the taste of authentic food with every bite! ✨
              </p>

              {/* Rating Display */}
              <div className="flex items-center mb-6 bg-white/10 dark:bg-white/5 backdrop-blur-sm rounded-2xl p-4">
                <div className="flex items-center mr-4">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star key={star} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <div>
                  <p className="font-bold text-yellow-300 dark:text-yellow-400">4.8/5</p>
                  <p className="text-xs text-amber-200/90 dark:text-amber-100/90">Customer Rating</p>
                </div>
              </div>

              {/* Social Media */}
              <div className="flex space-x-4">
                <Link
                  href="https://www.facebook.com/share/14EFU5rMqBc/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-12 h-12 bg-gradient-to-br from-blue-600 to-blue-700 dark:from-blue-700 dark:to-blue-900 rounded-full flex items-center justify-center hover:scale-110 transition-all duration-300 shadow-lg hover:shadow-xl"
                >
                  <Facebook className="h-6 w-6" />
                </Link>
                <Link
                  href="https://www.tiktok.com/@kingsbakery.sl"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-12 h-12 bg-gradient-to-br from-black to-gray-800 dark:from-gray-800 dark:to-black rounded-full flex items-center justify-center hover:scale-110 transition-all duration-300 shadow-lg hover:shadow-xl"
                >
                  <svg className="h-6 w-6 fill-white" viewBox="0 0 24 24">
                    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
                  </svg>
                </Link>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="font-bold text-xl mb-6 text-yellow-300 dark:text-yellow-400 flex items-center">
                <span className="mr-2">🔗</span> Quick Links
              </h4>
              <ul className="space-y-3">
                {[
                  { href: "/", label: "🏠 Home", desc: "Back to homepage" },
                  { href: "#menu", label: "🍽️ Menu", desc: "View our delicious menu" },
                  { href: "/order", label: "🛒 Order Online", desc: "Place your order now" },
                  { href: "/contact", label: "📞 Contact", desc: "Get in touch with us" },
                ].map((link, index) => (
                  <li key={index}>
                    <Link
                      href={link.href}
                      className="group block p-3 rounded-xl hover:bg-white/10 dark:hover:bg-white/5 transition-all duration-300 backdrop-blur-sm"
                    >
                      <div className="font-medium text-white group-hover:text-yellow-300 dark:group-hover:text-yellow-400 transition-colors">
                        {link.label}
                      </div>
                      <div className="text-xs text-amber-200/90 dark:text-amber-100/90 group-hover:text-amber-200 dark:group-hover:text-amber-100">
                        {link.desc}
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact Information */}
            <div>
              <h4 className="font-bold text-xl mb-6 text-yellow-300 dark:text-yellow-400 flex items-center">
                <span className="mr-2">📞</span> Contact Us
              </h4>
              <div className="space-y-4">
                <div className="flex items-start p-4 bg-white/10 dark:bg-white/5 backdrop-blur-sm rounded-xl hover:bg-white/15 dark:hover:bg-white/10 transition-all duration-300">
                  <MapPin className="h-6 w-6 mr-4 flex-shrink-0 mt-1 text-yellow-300 dark:text-yellow-400" />
                  <div>
                    <p className="font-medium text-white mb-1">📍 Our Location</p>
                    <p className="text-amber-200/90 dark:text-amber-100/90 text-sm leading-relaxed">
                      117 MAIN REGENT ROAD, HILL STATION
                      <br />
                      OPPOSITE CITY SUPERMARKET
                    </p>
                  </div>
                </div>

                <div className="flex items-center p-4 bg-white/10 dark:bg-white/5 backdrop-blur-sm rounded-xl hover:bg-white/15 dark:hover:bg-white/10 transition-all duration-300">
                  <Phone className="h-6 w-6 mr-4 flex-shrink-0 text-yellow-300 dark:text-yellow-400" />
                  <div>
                    <p className="font-medium text-white mb-1">📱 Call Us</p>
                    <p className="text-amber-200/90 dark:text-amber-100/90 text-sm">076 533655</p>
                  </div>
                </div>

                <div className="flex items-center p-4 bg-white/10 dark:bg-white/5 backdrop-blur-sm rounded-xl hover:bg-white/15 dark:hover:bg-white/10 transition-all duration-300">
                  <Mail className="h-6 w-6 mr-4 flex-shrink-0 text-yellow-300 dark:text-yellow-400" />
                  <div>
                    <p className="font-medium text-white mb-1">📧 Email</p>
                    <p className="text-amber-200/90 dark:text-amber-100/90 text-sm">info@thekingsbakerysl.com</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Opening Hours */}
            <div>
              <h4 className="font-bold text-xl mb-6 text-yellow-300 dark:text-yellow-400 flex items-center">
                <Clock className="h-6 w-6 mr-2" />
                Opening Hours
              </h4>

              <div className="bg-white/10 dark:bg-white/5 backdrop-blur-sm rounded-xl p-6">
                <div className="space-y-3">
                  <div className="flex justify-between items-center py-2 border-b border-white/20">
                    <span className="text-white font-medium">Monday - Friday</span>
                    <span className="text-yellow-300 dark:text-yellow-400 font-bold">10:00 AM - 10:00 PM</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-white/20">
                    <span className="text-white font-medium">Saturday</span>
                    <span className="text-yellow-300 dark:text-yellow-400 font-bold">11:00 AM - 11:00 PM</span>
                  </div>
                  <div className="flex justify-between items-center py-2">
                    <span className="text-white font-medium">Sunday</span>
                    <span className="text-yellow-300 dark:text-yellow-400 font-bold">11:00 AM - 11:00 PM</span>
                  </div>
                </div>

                <div className="mt-4 p-3 bg-green-500/20 dark:bg-green-500/10 rounded-lg border border-green-400/30 dark:border-green-400/20">
                  <p className="text-green-300 dark:text-green-400 text-sm font-medium flex items-center">
                    <span className="w-2 h-2 bg-green-400 dark:bg-green-500 rounded-full mr-2 animate-pulse"></span>
                    Open Now - Ready to serve you! 🍕
                  </p>
                </div>
              </div>

              {/* Special Notice */}
              <div className="mt-6 p-4 bg-gradient-to-r from-red-500/20 to-orange-500/20 dark:from-red-500/10 dark:to-orange-500/10 rounded-xl border border-red-400/30 dark:border-red-400/20">
                <p className="text-red-200 dark:text-red-300 text-sm font-medium flex items-center">
                  <Heart className="h-4 w-4 mr-2 text-red-400 dark:text-red-500" />
                  We deliver happiness to your doorstep! 🚚
                </p>
              </div>
            </div>
          </div>

          {/* Bottom Section */}
          <div className="border-t border-amber-200/20 dark:border-amber-100/20 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <div className="text-center md:text-left mb-4 md:mb-0">
                <p className="text-amber-200/90 dark:text-amber-100/90 text-sm">
                  &copy; {new Date().getFullYear()} Kings Bakery. All rights reserved.
                </p>
                <p className="text-amber-200/70 dark:text-amber-100/70 text-xs mt-1">
                  Made with <Heart className="h-3 w-3 inline text-red-400 dark:text-red-500" /> for food lovers in
                  Sierra Leone
                </p>
              </div>

              <div className="flex items-center space-x-6 text-sm">
                <Link
                  href="#"
                  className="text-amber-200/90 dark:text-amber-100/90 hover:text-amber-200 dark:hover:text-amber-100 transition-colors"
                >
                  Privacy Policy
                </Link>
                <Link
                  href="#"
                  className="text-amber-200/90 dark:text-amber-100/90 hover:text-amber-200 dark:hover:text-amber-100 transition-colors"
                >
                  Terms of Service
                </Link>
                <div className="text-amber-200/70 dark:text-amber-100/70 italic">"Enjoy HomeStyle cooking" ✨</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
