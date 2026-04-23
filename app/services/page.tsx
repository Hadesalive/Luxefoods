import type { Metadata } from "next"
import { Suspense } from "react"
import Image from "next/image"
import Header from "@/components/Header"
import Footer from "@/components/Footer"
import ServicesSection from "@/components/ServicesSection"
import ServicesInquiryForm from "@/components/ServicesInquiryForm"
import SectionDivider from "@/components/SectionDivider"
import { getCMS } from "@/lib/cms"
import { getPublicServices } from "@/lib/services-data"

export const metadata: Metadata = {
  title: "Our Services - LUXE FOOD | Catering & Events | Freetown, Sierra Leone",
  description:
    "Discover LUXE FOOD's catering services for weddings, birthdays, corporate events, and more. Quality food for every occasion in Freetown, Sierra Leone.",
  keywords: [
    "LUXE FOOD catering",
    "event catering Freetown",
    "wedding catering Sierra Leone",
    "birthday party catering",
    "corporate catering",
    "funeral repast catering",
    "food services Freetown",
  ],
  openGraph: {
    title: "Our Services - LUXE FOOD | Catering & Events | Freetown, Sierra Leone",
    description:
      "Discover LUXE FOOD's catering services for weddings, birthdays, corporate events, and more.",
    url: "https://luxefood.com/services",
  },
}

export default async function ServicesPage() {
  const [cms, services] = await Promise.all([getCMS(), getPublicServices()])

  return (
    <div className="min-h-screen">
      <Header />
      <main>
        {/* Hero */}
        <section className="relative pt-32 pb-20 lg:pt-40 lg:pb-28 overflow-hidden" style={{ backgroundColor: "#1C1917" }}>
          <Image
            src="https://images.unsplash.com/photo-1555244162-803834f70033?w=1920&h=1080&fit=crop&q=85"
            alt="LUXE FOOD catering services"
            fill
            className="object-cover"
            priority
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-stone-950/75" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(234,179,8,0.12),transparent_60%)]" />

          <div className="container mx-auto px-6 relative z-10">
            <div className="max-w-3xl mx-auto text-center">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-yellow-500/10 border border-yellow-500/20 text-yellow-400 text-sm font-medium tracking-wide uppercase mb-6 backdrop-blur-sm">
                {cms.brand_name}
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6 drop-shadow-lg">
                {cms.services_page_heading}
              </h1>
              <p className="text-lg lg:text-xl text-stone-300 max-w-2xl mx-auto leading-relaxed drop-shadow-sm">
                {cms.services_page_body}
              </p>
            </div>
          </div>
        </section>

        <SectionDivider topColor="#1C1917" bottomColor="#FFFDF8" variant="wave" goldLine />
        <ServicesSection heading={cms.services_heading} description={cms.services_description} services={services} />
        <SectionDivider topColor="#FFFDF8" bottomColor="#F5ECD7" variant="slant" goldLine />
        <Suspense>
          <ServicesInquiryForm whatsappNumber={cms.contact_phone_intl} />
        </Suspense>
        <SectionDivider topColor="#F5ECD7" bottomColor="#1C1917" variant="curve" goldLine />
      </main>
      <Footer />
    </div>
  )
}
