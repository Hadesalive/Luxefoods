import { MapPin, Phone, Mail, Clock } from "lucide-react"
import Link from "next/link"
import { getCMS } from "@/lib/cms"

export default async function ContactSection() {
  const cms = await getCMS()

  return (
    <section className="relative py-20 lg:py-28 bg-grain overflow-hidden" style={{ backgroundColor: "#FFFDF8" }}>
      <div className="container mx-auto px-6">
        <div className="max-w-5xl mx-auto">

          {/* Section Header */}
          <div className="grid lg:grid-cols-2 gap-8 items-end mb-14">
            <div>
              <p className="text-xs font-bold tracking-[0.2em] uppercase text-yellow-700 mb-4">Contact</p>
              <h2 className="text-3xl lg:text-4xl font-bold text-stone-800 leading-[1.1]">Find Us</h2>
            </div>
            <div>
              <p className="text-base lg:text-lg text-stone-500 leading-relaxed">
                Visit us in {cms.contact_address} or get in touch — we&apos;d love to hear from you.
              </p>
            </div>
          </div>

          {/* Content Grid */}
          <div className="grid md:grid-cols-2 gap-6 lg:gap-8">

            {/* Contact Info */}
            <div className="space-y-8">
              <div className="space-y-4">
                <Link
                  href={`https://maps.google.com/?q=${encodeURIComponent(cms.contact_address)}`}
                  target="_blank"
                  className="flex items-center gap-3 group"
                >
                  <MapPin className="h-4 w-4 text-yellow-600 flex-shrink-0" />
                  <div>
                    <p className="text-xs text-stone-400 mb-0.5">Address</p>
                    <p className="text-stone-800 font-medium text-sm group-hover:text-yellow-700 transition-colors">{cms.contact_address}</p>
                  </div>
                </Link>

                <Link href={`tel:${cms.contact_phone_intl}`} className="flex items-center gap-3 group">
                  <Phone className="h-4 w-4 text-yellow-600 flex-shrink-0" />
                  <div>
                    <p className="text-xs text-stone-400 mb-0.5">Phone</p>
                    <p className="text-stone-800 font-medium text-sm group-hover:text-yellow-700 transition-colors">{cms.contact_phone}</p>
                  </div>
                </Link>

                <Link href={`mailto:${cms.contact_email}`} className="flex items-center gap-3 group">
                  <Mail className="h-4 w-4 text-yellow-600 flex-shrink-0" />
                  <div>
                    <p className="text-xs text-stone-400 mb-0.5">Email</p>
                    <p className="text-stone-800 font-medium text-sm group-hover:text-yellow-700 transition-colors">{cms.contact_email}</p>
                  </div>
                </Link>
              </div>

              {/* Hours */}
              <div className="border-t border-stone-100 pt-7">
                <p className="text-xs font-bold tracking-[0.15em] uppercase text-stone-400 mb-4 flex items-center gap-2">
                  <Clock className="h-3.5 w-3.5" /> Opening Hours
                </p>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-stone-500">{cms.hours_weekday_label}</span>
                    <span className="text-stone-800 font-medium">{cms.hours_weekday_times}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-stone-500">{cms.hours_weekend_label}</span>
                    <span className="text-stone-800 font-medium">{cms.hours_weekend_times}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Map Placeholder */}
            <div className="bg-stone-100 rounded-xl overflow-hidden min-h-[320px] flex items-center justify-center">
              <div className="text-center p-8">
                <MapPin className="w-7 h-7 text-stone-400 mx-auto mb-3" />
                <p className="text-stone-500 text-sm">{cms.contact_address}</p>
              </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  )
}
