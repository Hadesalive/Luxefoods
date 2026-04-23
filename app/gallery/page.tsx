import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { ArrowRight } from "lucide-react"
import Header from "@/components/Header"
import Footer from "@/components/Footer"
import GalleryGrid from "@/components/GalleryGrid"
import { createClient } from "@supabase/supabase-js"

export const metadata: Metadata = {
  title: "Gallery - LUXE FOOD | Freetown, Sierra Leone",
  description:
    "Browse our gallery of dishes, catering setups, and events from LUXE FOOD in Freetown, Sierra Leone.",
  openGraph: {
    title: "Gallery - LUXE FOOD",
    description: "A look inside our kitchen and the moments we've been part of.",
    url: "https://luxefood.com/gallery",
  },
}

interface GalleryItem {
  id: string
  title: string | null
  image_url: string
  category: string | null
  sort_order: number
}

const FALLBACK: GalleryItem[] = [
  { id: "1", title: "Fine Dining",        image_url: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&q=80", category: null, sort_order: 1 },
  { id: "2", title: "Fresh & Seasonal",   image_url: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&q=80",  category: null, sort_order: 2 },
  { id: "3", title: "Artisan Baking",     image_url: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=800&q=80", category: null, sort_order: 3 },
  { id: "4", title: "Event Catering",     image_url: "https://images.unsplash.com/photo-1555244162-803834f70033?w=600&q=80",  category: null, sort_order: 4 },
  { id: "5", title: "Breakfast Service",  image_url: "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=800&q=80", category: null, sort_order: 5 },
  { id: "6", title: "Light Bites",        image_url: "https://images.unsplash.com/photo-1482049016688-2d3e1b311543?w=800&q=80", category: null, sort_order: 6 },
  { id: "7", title: "Wholesome Bowls",    image_url: "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=600&q=80",  category: null, sort_order: 7 },
  { id: "8", title: "Pasta & Mains",      image_url: "https://images.unsplash.com/photo-1473093295043-cdd812d0e601?w=800&q=80", category: null, sort_order: 8 },
  { id: "9", title: "Wedding Receptions", image_url: "https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=800&q=80", category: null, sort_order: 9 },
  { id: "10", title: "BBQ & Grills",      image_url: "https://images.unsplash.com/photo-1424847651672-bf20a4b0982b?w=600&q=80",  category: null, sort_order: 10 },
  { id: "11", title: "Premium Burgers",   image_url: "https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=800&q=80", category: null, sort_order: 11 },
  { id: "12", title: "Hearty Soups",      image_url: "https://images.unsplash.com/photo-1547592166-23ac45744acd?w=800&q=80", category: null, sort_order: 12 },
  { id: "13", title: "Celebrations",      image_url: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80",  category: null, sort_order: 13 },
  { id: "14", title: "From Our Kitchen",  image_url: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&q=80", category: null, sort_order: 14 },
  { id: "15", title: "Corporate Events",  image_url: "https://images.unsplash.com/photo-1511578314322-379afb476865?w=800&q=80", category: null, sort_order: 15 },
]

async function getGalleryItems(): Promise<GalleryItem[]> {
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      { global: { fetch: (url, opts) => fetch(url, { ...opts, cache: "no-store" }) } }
    )
    const { data } = await supabase
      .from("gallery_items")
      .select("id, title, image_url, category, sort_order")
      .eq("is_active", true)
      .order("sort_order")
      .order("created_at")

    if (data?.length) return data
  } catch {}
  return FALLBACK
}

export default async function GalleryPage() {
  const items = await getGalleryItems()

  return (
    <div className="min-h-screen font-sans">
      <Header />

      {/* Dark hero */}
      <section
        className="pt-24 pb-16 lg:pt-32 lg:pb-20"
        style={{ backgroundColor: "#1C1917" }}
      >
        <div className="container mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center max-w-6xl mx-auto">
            <div>
              <p className="text-xs font-bold tracking-[0.2em] uppercase text-yellow-500 mb-5">
                Gallery
              </p>
              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-white leading-[0.92] mb-6">
                Food made<br />with purpose.
              </h1>
              <p className="text-stone-400 text-base lg:text-lg leading-relaxed max-w-sm">
                A look inside our kitchen and the moments we&apos;ve had the privilege of being part of.
              </p>
            </div>

            <div className="relative aspect-[4/5] rounded-2xl overflow-hidden">
              <Image
                src={items[0]?.image_url ?? "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=900&h=1100&fit=crop&q=85"}
                alt="LUXE FOOD featured dish"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-stone-950/40 to-transparent" />
            </div>
          </div>
        </div>
      </section>

      {/* Masonry gallery with lightbox */}
      <section
        className="py-14 lg:py-20"
        style={{ backgroundColor: "#FFFDF8" }}
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <GalleryGrid items={items} />
        </div>
      </section>

      {/* Dark CTA */}
      <section
        className="py-20 lg:py-28"
        style={{ backgroundColor: "#1C1917" }}
      >
        <div className="container mx-auto px-6 text-center">
          <p className="text-xs font-bold tracking-[0.2em] uppercase text-yellow-500 mb-4">
            Catering & Events
          </p>
          <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4 leading-tight">
            Like what you see?
          </h2>
          <p className="text-stone-400 text-base leading-relaxed max-w-md mx-auto mb-10">
            We bring the same quality and care to every occasion — from intimate dinners to grand celebrations.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/services"
              className="inline-flex items-center justify-center gap-2 bg-yellow-500 hover:bg-yellow-400 text-stone-900 px-7 py-3.5 rounded-lg font-semibold text-sm transition-colors"
            >
              See Our Services
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/order"
              className="inline-flex items-center justify-center gap-2 border border-stone-700 hover:border-stone-500 text-stone-300 hover:text-white px-7 py-3.5 rounded-lg font-semibold text-sm transition-colors"
            >
              Order Now
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
