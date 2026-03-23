import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowLeft, Check, ArrowRight } from "lucide-react"
import { createClient } from "@supabase/supabase-js"
import Header from "@/components/Header"
import Footer from "@/components/Footer"

// ── Fallback hardcoded data (used if DB row has no detail fields) ──
const FALLBACK: Record<string, {
  tagline: string; full_description: string; form_title: string
  hero_image_url: string; gallery_images: string[]; includes: string[]
}> = {
  "workshops-events": {
    form_title: "Workshops & Events Catering",
    tagline: "Professional catering for corporate events, workshops, and conferences.",
    full_description: "We deliver full-scale catering for professional events of all sizes — from intimate boardroom lunches to large-scale conference days. Our team handles everything: custom menu design, professional setup, and seamless service throughout your event so you can focus on what matters.",
    includes: ["Custom menu planning to match your brief", "Professional on-site setup and service", "Dietary accommodations (vegetarian, vegan, halal)", "Beverages and refreshments included", "Full cleanup after service"],
    hero_image_url: "https://images.unsplash.com/photo-1511578314322-379afb476865?w=1920&h=1080&fit=crop&q=85",
    gallery_images: ["https://images.unsplash.com/photo-1555244162-803834f70033?w=800&h=600&fit=crop&q=80", "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&h=600&fit=crop&q=80", "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&h=600&fit=crop&q=80"],
  },
  "wedding-receptions": {
    form_title: "Wedding Receptions",
    tagline: "Elegant menus crafted to make your special day unforgettable.",
    full_description: "Your wedding deserves food as special as the occasion. We create bespoke menus that reflect your tastes and vision — from the cocktail hour to the final course. Our experienced team ensures impeccable service so you can focus entirely on celebrating.",
    includes: ["Bespoke menu tasting session", "Full multi-course service", "Wedding cake coordination", "Dedicated service staff", "Elegant presentation and table decor"],
    hero_image_url: "https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=1920&h=1080&fit=crop&q=85",
    gallery_images: ["https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&h=600&fit=crop&q=80", "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&h=600&fit=crop&q=80", "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=800&h=600&fit=crop&q=80"],
  },
  "bridal-showers": {
    form_title: "Bridal Showers",
    tagline: "Beautiful spreads for celebrating the bride-to-be in style.",
    full_description: "From elegant finger food to beautifully styled dessert tables, we create the perfect atmosphere to celebrate the bride-to-be. We handle the food so you can focus on making memories with the people who matter most.",
    includes: ["Curated finger food and canapé selection", "Dessert table and sweet treats", "Themed presentation options", "Drinks and mocktail service", "Elegant styling and garnishes"],
    hero_image_url: "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=1920&h=1080&fit=crop&q=85",
    gallery_images: ["https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=800&h=600&fit=crop&q=80", "https://images.unsplash.com/photo-1482049016688-2d3e1b311543?w=800&h=600&fit=crop&q=80", "https://images.unsplash.com/photo-1473093295043-cdd812d0e601?w=800&h=600&fit=crop&q=80"],
  },
  "birthdays": {
    form_title: "Birthdays",
    tagline: "Party platters and custom menus for every age.",
    full_description: "Whether it's a milestone birthday or a casual gathering, we bring the food that makes the party. Custom menus, party platters, and crowd-pleasing dishes prepared fresh for your celebration.",
    includes: ["Custom party menu design", "Shareable platters and individual servings", "Cake and dessert coordination", "Flexible guest count accommodation", "Delivery or on-site service available"],
    hero_image_url: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1920&h=1080&fit=crop&q=85",
    gallery_images: ["https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&h=600&fit=crop&q=80", "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=800&h=600&fit=crop&q=80", "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&h=600&fit=crop&q=80"],
  },
  "anniversary-dinners": {
    form_title: "Anniversary Dinner Parties",
    tagline: "Intimate, refined dining for milestone celebrations.",
    full_description: "Mark your anniversary with a dining experience to remember. Whether at home or at a venue, we design intimate multi-course menus that reflect the elegance of the occasion — because some moments deserve something truly special.",
    includes: ["Curated multi-course menu", "Fine dining presentation", "Personalised menu cards", "Premium ingredient sourcing", "Optional in-home service"],
    hero_image_url: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1920&h=1080&fit=crop&q=85",
    gallery_images: ["https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&h=600&fit=crop&q=80", "https://images.unsplash.com/photo-1473093295043-cdd812d0e601?w=800&h=600&fit=crop&q=80", "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=800&h=600&fit=crop&q=80"],
  },
  "kids-birthday-parties": {
    form_title: "Kids Birthday Parties",
    tagline: "Fun, kid-friendly menus that little ones will love.",
    full_description: "We create colourful, delicious, and kid-safe menus that little ones will love. From mini sliders to fruit skewers and birthday treats — we make party food that keeps the kids happy and parents stress-free.",
    includes: ["Kid-friendly menu options", "Fun, colourful food presentation", "Allergy-conscious preparation", "Party snacks and sweets", "Themed cake and dessert coordination"],
    hero_image_url: "https://images.unsplash.com/photo-1602631985686-1bb0e6a8696e?w=1920&h=1080&fit=crop&q=85",
    gallery_images: ["https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=800&h=600&fit=crop&q=80", "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&h=600&fit=crop&q=80", "https://images.unsplash.com/photo-1482049016688-2d3e1b311543?w=800&h=600&fit=crop&q=80"],
  },
  "funeral-repast": {
    form_title: "Funeral Repast",
    tagline: "Thoughtful, comforting meals during difficult times.",
    full_description: "We provide compassionate, respectful catering for funeral repasts. Our team understands the sensitivity of these occasions and works quietly behind the scenes to ensure guests are fed and comforted with warm, home-style meals.",
    includes: ["Warm, comforting home-style dishes", "Respectful and discreet service", "Flexible quantity planning", "Dietary accommodations", "Full setup and cleanup included"],
    hero_image_url: "https://images.unsplash.com/photo-1555244162-803834f70033?w=1920&h=1080&fit=crop&q=85",
    gallery_images: ["https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&h=600&fit=crop&q=80", "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=800&h=600&fit=crop&q=80", "https://images.unsplash.com/photo-1473093295043-cdd812d0e601?w=800&h=600&fit=crop&q=80"],
  },
  "soup-bowls": {
    form_title: "Soup Bowls",
    tagline: "Hearty, homestyle soups for any gathering.",
    full_description: "Our signature soup bowls are prepared fresh with premium ingredients and rich, slow-cooked flavours. Perfect for community gatherings, casual events, or a warm addition to any spread.",
    includes: ["Multiple soup varieties available", "Fresh bread and accompaniments", "Individual bowl or buffet-style service", "Hot-holding equipment provided", "Customisable portion sizes"],
    hero_image_url: "https://images.unsplash.com/photo-1547592166-23ac45744acd?w=1920&h=1080&fit=crop&q=85",
    gallery_images: ["https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&h=600&fit=crop&q=80", "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&h=600&fit=crop&q=80", "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=800&h=600&fit=crop&q=80"],
  },
  "surprise-trays": {
    form_title: "Surprise Trays",
    tagline: "Beautifully arranged trays to delight your guests.",
    full_description: "Our surprise trays are curated platters of our best items — thoughtfully arranged and beautifully presented. Perfect for gifting, surprise celebrations, or adding a spectacular centrepiece to any gathering.",
    includes: ["Curated selection of premium items", "Beautiful tray styling and garnish", "Custom wrap and presentation", "Delivery available throughout Freetown", "Personalised message card option"],
    hero_image_url: "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=1920&h=1080&fit=crop&q=85",
    gallery_images: ["https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&h=600&fit=crop&q=80", "https://images.unsplash.com/photo-1482049016688-2d3e1b311543?w=800&h=600&fit=crop&q=80", "https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=800&h=600&fit=crop&q=80"],
  },
}

async function getService(slug: string) {
  try {
    const db = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )
    const { data } = await db
      .from("services")
      .select("*")
      .eq("slug", slug)
      .eq("is_active", true)
      .single()

    if (!data) return null

    const fb = FALLBACK[slug] ?? {}
    return {
      title:          data.title,
      tagline:        data.tagline        ?? fb.tagline        ?? "",
      full_description: data.full_description ?? fb.full_description ?? data.description ?? "",
      form_title:     data.form_title     ?? fb.form_title     ?? data.title,
      hero_image_url: data.hero_image_url ?? fb.hero_image_url ?? data.image_url ?? "",
      gallery_images: (data.gallery_images?.length ? data.gallery_images : null) ?? fb.gallery_images ?? [],
      includes:       (data.includes?.length ? data.includes : null)       ?? fb.includes       ?? [],
    }
  } catch {
    return null
  }
}

export async function generateStaticParams() {
  return Object.keys(FALLBACK).map(slug => ({ slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const service = await getService(slug)
  if (!service) return {}
  return {
    title: `${service.title} - LUXE FOOD | Freetown, Sierra Leone`,
    description: service.full_description,
    openGraph: {
      title: `${service.title} - LUXE FOOD`,
      description: service.tagline,
      images: [{ url: service.hero_image_url }],
      url: `https://luxefood.com/services/${slug}`,
    },
  }
}

export default async function ServiceDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const service = await getService(slug)
  if (!service) notFound()

  const bookUrl = `/services?service=${encodeURIComponent(service.form_title)}#inquiry`

  return (
    <div className="min-h-screen font-sans" style={{ backgroundColor: "#FFFDF8" }}>
      <Header />

      {/* Hero */}
      <div className="relative h-[55vh] min-h-[400px] overflow-hidden">
        <Image
          src={service.hero_image_url}
          alt={service.title}
          fill
          sizes="100vw"
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-stone-950/65" />
        <div className="absolute inset-0 flex flex-col justify-end container mx-auto px-6 pb-12 lg:pb-16">
          <Link
            href="/services"
            className="flex items-center gap-1.5 text-white/60 hover:text-white text-sm mb-8 transition-colors w-fit"
          >
            <ArrowLeft className="w-4 h-4" />
            All services
          </Link>
          <p className="text-xs font-bold tracking-[0.2em] uppercase text-yellow-400 mb-3">LUXE FOOD</p>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight max-w-2xl">
            {service.title}
          </h1>
        </div>
      </div>

      {/* Content */}
      <main className="container mx-auto px-6 py-16 lg:py-24">
        <div className="max-w-5xl mx-auto">

          {/* Description + Includes */}
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 mb-16">
            <div>
              <p className="text-xl lg:text-2xl font-semibold text-stone-800 leading-snug mb-6">
                {service.tagline}
              </p>
              <p className="text-stone-500 leading-relaxed text-sm lg:text-base">
                {service.full_description}
              </p>
            </div>
            {service.includes.length > 0 && (
              <div>
                <p className="text-xs font-bold tracking-[0.2em] uppercase text-stone-400 mb-5">
                  What&apos;s included
                </p>
                <ul className="space-y-3">
                  {service.includes.map((item: string, i: number) => (
                    <li key={i} className="flex items-start gap-3 text-sm text-stone-700">
                      <div className="w-5 h-5 rounded-full bg-yellow-500/15 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <Check className="w-3 h-3 text-yellow-700" />
                      </div>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Gallery */}
          {service.gallery_images.length > 0 && (
            <div className="grid grid-cols-3 gap-3 sm:gap-4 mb-16">
              {service.gallery_images.map((src: string, i: number) => (
                <div key={i} className="group relative aspect-[4/3] rounded-xl overflow-hidden bg-stone-100">
                  <Image
                    src={src}
                    alt={`${service.title} ${i + 1}`}
                    fill
                    sizes="(max-width: 768px) 33vw, 400px"
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                    loading="lazy"
                  />
                </div>
              ))}
            </div>
          )}

          {/* CTA */}
          <div className="border-t border-stone-100 pt-12 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            <div>
              <h3 className="text-lg font-bold text-stone-900 mb-1">Ready to book?</h3>
              <p className="text-stone-500 text-sm">
                Send us your event details and we&apos;ll get back to you on WhatsApp.
              </p>
            </div>
            <Link
              href={bookUrl}
              className="inline-flex items-center gap-2.5 bg-stone-900 hover:bg-stone-800 text-white px-7 py-3.5 rounded-lg font-semibold text-sm transition-colors flex-shrink-0"
            >
              Book this service
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

        </div>
      </main>

      <Footer />
    </div>
  )
}
