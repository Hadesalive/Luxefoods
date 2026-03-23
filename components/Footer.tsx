import Link from "next/link"
import Image from "next/image"
import { Phone, Mail, MapPin, Facebook, Clock, ArrowUpRight } from "lucide-react"
import { getCMS } from "@/lib/cms"

export default async function Footer() {
  const cms = await getCMS()

  const links = [
    { href: "/", label: "Home" },
    { href: "/order", label: "Menu" },
    { href: "/services", label: "Services" },
    { href: "/gallery", label: "Gallery" },
    { href: "/contact", label: "Contact" },
  ]

  return (
    <footer className="bg-stone-900 text-white">
      <div className="container mx-auto px-6">
        {/* Main Footer */}
        <div className="py-16 lg:py-20 grid lg:grid-cols-12 gap-12 lg:gap-8">
          {/* Brand */}
          <div className="lg:col-span-4">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-12 h-12 relative">
                <Image src="/images/logo.png" alt={`${cms.brand_name} Logo`} fill className="object-contain" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-yellow-400 tracking-wide">{cms.brand_name}</h3>
                <p className="text-gray-500 text-xs italic">&ldquo;{cms.brand_tagline}&rdquo;</p>
              </div>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed mb-6 max-w-xs">
              {cms.footer_description}
            </p>
            <div className="flex gap-3">
              <Link
                href={cms.social_facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-gray-800 hover:bg-blue-600 rounded-xl flex items-center justify-center transition-all duration-300 border border-gray-700 hover:border-blue-600"
              >
                <Facebook className="h-4 w-4" />
              </Link>
              <Link
                href={cms.social_instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-gray-800 hover:bg-gradient-to-br hover:from-purple-600 hover:to-pink-600 rounded-xl flex items-center justify-center transition-all duration-300 border border-gray-700 hover:border-purple-600"
              >
                <svg className="h-4 w-4 fill-white" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
              </Link>
            </div>
          </div>

          {/* Links */}
          <div className="lg:col-span-2">
            <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-widest mb-5">Navigation</h4>
            <ul className="space-y-3">
              {links.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-gray-400 hover:text-yellow-400 transition-colors text-sm flex items-center gap-1 group"
                  >
                    {link.label}
                    <ArrowUpRight className="w-3 h-3 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div className="lg:col-span-3">
            <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-widest mb-5">Contact</h4>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <MapPin className="h-4 w-4 text-yellow-400 flex-shrink-0" />
                <span className="text-gray-400 text-sm">{cms.contact_address}</span>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="h-4 w-4 text-yellow-400 flex-shrink-0" />
                <Link href={`tel:${cms.contact_phone_intl}`} className="text-gray-400 hover:text-yellow-400 transition-colors text-sm">
                  {cms.contact_phone}
                </Link>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="h-4 w-4 text-yellow-400 flex-shrink-0" />
                <Link href={`mailto:${cms.contact_email}`} className="text-gray-400 hover:text-yellow-400 transition-colors text-sm">
                  {cms.contact_email}
                </Link>
              </div>
            </div>
          </div>

          {/* Hours */}
          <div className="lg:col-span-3">
            <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-widest mb-5 flex items-center gap-2">
              <Clock className="h-3.5 w-3.5" />
              Hours
            </h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-400">{cms.hours_weekday_label}</span>
                <span className="text-gray-300">{cms.hours_weekday_times}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">{cms.hours_weekend_label}</span>
                <span className="text-gray-300">{cms.hours_weekend_times}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 py-6 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-gray-500 text-xs">
            {cms.footer_copyright}
          </p>
          <p className="text-gray-600 text-xs italic">
            &ldquo;{cms.brand_tagline}&rdquo;
          </p>
        </div>
      </div>
    </footer>
  )
}
