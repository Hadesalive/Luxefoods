import { Phone, Clock, MapPin } from "lucide-react"
import Link from "next/link"
import { getCMS } from "@/lib/cms"

const features = [
  {
    num: "01",
    icon: Clock,
    title: "Fast Delivery",
    desc: "Quick delivery straight to your door",
  },
  {
    num: "02",
    icon: MapPin,
    title: "Wide Coverage",
    desc: "Delivering throughout Freetown",
  },
  {
    num: "03",
    icon: Phone,
    title: "Easy Ordering",
    desc: "Call us or order online anytime",
  },
]

export default async function DeliverySection() {
  const cms = await getCMS()

  return (
    <section
      id="order"
      className="relative py-20 lg:py-32 bg-grain overflow-hidden"
      style={{ backgroundColor: "#F5ECD7" }}
    >
      <div className="container mx-auto px-6">
        <div className="max-w-5xl mx-auto">

          {/* Section Header */}
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-end mb-16 lg:mb-20">
            <div>
              <p className="text-xs font-bold tracking-[0.2em] uppercase text-yellow-700 mb-4">
                Delivery
              </p>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-stone-800 leading-[1.1]">
                {cms.delivery_heading}
              </h2>
            </div>
            <div className="lg:pb-1">
              <p className="text-base lg:text-lg text-stone-500 leading-relaxed">
                {cms.delivery_description}
              </p>
            </div>
          </div>

          {/* Features */}
          <div className="grid sm:grid-cols-3 gap-5 lg:gap-6 mb-16">
            {features.map(({ num, icon: Icon, title, desc }) => (
              <div
                key={title}
                className="group relative bg-white p-8 rounded-2xl border border-stone-100 shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden"
              >
                <span className="absolute top-5 right-6 text-4xl font-bold text-stone-100 select-none leading-none">
                  {num}
                </span>
                <div className="w-11 h-11 rounded-xl bg-yellow-500/10 flex items-center justify-center mb-5 group-hover:bg-yellow-500/15 transition-colors relative z-10">
                  <Icon className="h-5 w-5 text-yellow-600" />
                </div>
                <h3 className="font-semibold text-lg text-stone-800 mb-2 relative z-10">{title}</h3>
                <p className="text-stone-500 text-sm leading-relaxed relative z-10">{desc}</p>
              </div>
            ))}
          </div>

          {/* CTA Card */}
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-stone-800 via-stone-900 to-stone-900 p-8 lg:p-14 text-center">
            <div className="absolute top-0 right-0 w-64 h-64 bg-yellow-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
            <h3 className="text-2xl lg:text-3xl font-bold text-white mb-3 relative z-10">
              {cms.delivery_cta_heading}
            </h3>
            <p className="text-stone-300 mb-8 text-base lg:text-lg max-w-xl mx-auto relative z-10">
              {cms.delivery_cta_body}
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center relative z-10">
              <Link
                href="/order"
                className="inline-flex items-center justify-center gap-2 bg-yellow-500 hover:bg-yellow-400 text-stone-900 px-7 py-3.5 rounded-lg font-semibold transition-colors"
              >
                Order Now
              </Link>
              <Link
                href={`tel:${cms.contact_phone_intl}`}
                className="inline-flex items-center justify-center gap-2 border border-stone-600 hover:border-stone-400 text-stone-300 hover:text-white px-7 py-3.5 rounded-lg font-medium transition-colors"
              >
                <Phone className="h-4 w-4" />
                {cms.contact_phone}
              </Link>
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}
