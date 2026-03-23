"use client"

import {
  Buildings,
  Heart,
  Gift,
  Cake,
  Trophy,
  Smiley,
  HandWaving,
  Fire,
  SquaresFour,
  ArrowRight,
} from "@phosphor-icons/react"
import Image from "next/image"
import Link from "next/link"
import { motion } from "framer-motion"

interface Service {
  icon: React.ComponentType<{ className?: string }>
  title: string
  desc: string
  image: string
  slug: string
}

const services: Service[] = [
  {
    icon: Buildings,
    title: "Workshops & Events",
    desc: "Professional catering for corporate events, workshops, and conferences.",
    image: "https://images.unsplash.com/photo-1511578314322-379afb476865?w=800&h=1000&fit=crop&q=80",
    slug: "workshops-events",
  },
  {
    icon: Heart,
    title: "Wedding Receptions",
    desc: "Elegant menus crafted to make your special day unforgettable.",
    image: "https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=800&h=1000&fit=crop&q=80",
    slug: "wedding-receptions",
  },
  {
    icon: Gift,
    title: "Bridal Showers",
    desc: "Beautiful spreads for celebrating the bride-to-be in style.",
    image: "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=800&h=1000&fit=crop&q=80",
    slug: "bridal-showers",
  },
  {
    icon: Cake,
    title: "Birthdays",
    desc: "Party platters and custom menus for every age.",
    image: "",
    slug: "birthdays",
  },
  {
    icon: Trophy,
    title: "Anniversary Dinners",
    desc: "Intimate, refined dining for milestone celebrations.",
    image: "",
    slug: "anniversary-dinners",
  },
  {
    icon: Smiley,
    title: "Kids Birthday Parties",
    desc: "Fun, kid-friendly menus that little ones will love.",
    image: "",
    slug: "kids-birthday-parties",
  },
  {
    icon: HandWaving,
    title: "Funeral Repast",
    desc: "Thoughtful, comforting meals during difficult times.",
    image: "",
    slug: "funeral-repast",
  },
  {
    icon: Fire,
    title: "Soup Bowls",
    desc: "Hearty, homestyle soups for any gathering.",
    image: "",
    slug: "soup-bowls",
  },
  {
    icon: SquaresFour,
    title: "Surprise Trays",
    desc: "Beautifully arranged trays to delight your guests.",
    image: "",
    slug: "surprise-trays",
  },
]

const featured = services.slice(0, 3)
const secondary = services.slice(3)

function FeaturedCard({ service, index }: { service: Service; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.55, delay: index * 0.08, ease: [0.25, 0.46, 0.45, 0.94] }}
      className="group"
    >
      <Link href={`/services/${service.slug}`} className="flex flex-col h-full">
        {/* Image */}
        <div className="relative aspect-[3/4] overflow-hidden rounded-xl mb-4">
          <Image
            src={service.image}
            alt={service.title}
            fill
            sizes="(max-width: 768px) 100vw, 33vw"
            className="object-cover transition-transform duration-700 group-hover:scale-105"
            loading="lazy"
          />
          <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/30 to-transparent" />
        </div>

        {/* Text */}
        <h3 className="font-bold text-stone-800 text-lg mb-1 leading-snug">{service.title}</h3>
        <p className="text-stone-500 text-sm leading-relaxed flex-1 mb-3">{service.desc}</p>
        <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-stone-700 group-hover:text-yellow-700 transition-colors">
          View details
          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
        </span>
      </Link>
    </motion.div>
  )
}

function SecondaryItem({ service, index }: { service: Service; index: number }) {
  const { icon: Icon, title, desc, slug } = service
  const isLeftCol = index % 2 === 0
  const isLastRow = index >= secondary.length - 2

  return (
    <motion.div
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      className={[
        isLeftCol ? "sm:border-r border-stone-200" : "",
        !isLastRow ? "border-b border-stone-200" : "",
      ].join(" ")}
    >
      <Link
        href={`/services/${slug}`}
        className="group flex items-start gap-4 p-6 hover:bg-stone-50/70 transition-colors w-full h-full block"
      >
        <div className="w-8 h-8 rounded-lg bg-stone-100 group-hover:bg-yellow-500/15 flex items-center justify-center flex-shrink-0 mt-0.5 transition-colors">
          <Icon className="h-4 w-4 text-stone-500 group-hover:text-yellow-700 transition-colors" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2 mb-1">
            <h3 className="font-semibold text-stone-800 text-sm">{title}</h3>
            <ArrowRight className="w-4 h-4 text-stone-300 group-hover:text-yellow-600 group-hover:translate-x-0.5 transition-all flex-shrink-0" />
          </div>
          <p className="text-stone-400 text-xs leading-relaxed">{desc}</p>
        </div>
      </Link>
    </motion.div>
  )
}

export default function ServicesSection({
  heading = "Catering for every occasion.",
  description = "From weddings to birthdays, we bring exceptional food and service to your most important moments.",
}: {
  heading?: string
  description?: string
}) {
  return (
    <section
      className="relative py-20 lg:py-32 bg-grain overflow-hidden"
      style={{ backgroundColor: "#FFFDF8" }}
    >
      <div className="container mx-auto px-6">
        <div className="max-w-6xl mx-auto">

          {/* Section Header */}
          <motion.div
            className="grid lg:grid-cols-2 gap-8 items-end mb-14 lg:mb-18"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
          >
            <div>
              <p className="text-xs font-bold tracking-[0.2em] uppercase text-yellow-700 mb-4">
                What We Do
              </p>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-stone-800 leading-[1.1]">
                {heading}
              </h2>
            </div>
            <div className="lg:pb-1">
              <p className="text-base lg:text-lg text-stone-500 leading-relaxed">
                {description}
              </p>
            </div>
          </motion.div>

          {/* Featured 3 — portrait cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 lg:gap-8 mb-10">
            {featured.map((service, i) => (
              <FeaturedCard key={service.title} service={service} index={i} />
            ))}
          </div>

          {/* Secondary 6 — text list with dividers */}
          <div className="border border-stone-200 rounded-2xl overflow-hidden mb-16">
            <div className="grid grid-cols-1 sm:grid-cols-2">
              {secondary.map((service, i) => (
                <SecondaryItem key={service.title} service={service} index={i} />
              ))}
            </div>
          </div>

          {/* CTA */}
          <motion.div
            className="text-center"
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.5 }}
          >
            <Link
              href="/services#inquiry"
              className="inline-flex items-center gap-2.5 bg-stone-900 hover:bg-stone-800 text-white px-8 py-3.5 rounded-lg font-semibold transition-colors"
            >
              Book Our Services
              <ArrowRight className="w-4 h-4" />
            </Link>
          </motion.div>

        </div>
      </div>
    </section>
  )
}
