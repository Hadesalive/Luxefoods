"use client"

import { useState, useEffect, useCallback } from "react"
import Image from "next/image"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { ArrowRight } from "lucide-react"
import type { CMSData } from "@/lib/cms"

const slides = [
  {
    src: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=1920&h=1080&fit=crop&q=85",
    dish: "Pizza",
    label: "Freshly baked to order",
  },
  {
    src: "https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=1920&h=1080&fit=crop&q=85",
    dish: "Fried Rice",
    label: "Made with premium rice",
  },
  {
    src: "https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=1920&h=1080&fit=crop&q=85",
    dish: "Jollof Rice",
    label: "Sierra Leone's classic",
  },
  {
    src: "https://images.unsplash.com/photo-1608039829573-8c4c85b0e1a5?w=1920&h=1080&fit=crop&q=85",
    dish: "Grilled Chicken",
    label: "Marinated & flame-grilled",
  },
  {
    src: "https://images.unsplash.com/photo-1555939594-58d7cb561b1a?w=1920&h=1080&fit=crop&q=85",
    dish: "Cassava Leaf",
    label: "A taste of home",
  },
  {
    src: "https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?w=1920&h=1080&fit=crop&q=85",
    dish: "African Cuisine",
    label: "Bold, rich flavours",
  },
]

export default function HeroClient({ cms }: { cms: CMSData }) {
  const [current, setCurrent] = useState(0)
  const [intervalKey, setIntervalKey] = useState(0)

  useEffect(() => {
    slides.forEach(({ src }) => {
      const img = new window.Image()
      img.src = src
    })
  }, [])

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((p) => (p + 1) % slides.length)
    }, 5000)
    return () => clearInterval(timer)
  }, [intervalKey])

  const goTo = useCallback((i: number) => {
    setCurrent(i)
    setIntervalKey((k) => k + 1)
  }, [])

  return (
    <section className="relative h-screen overflow-hidden bg-stone-950">

      {/* Full-bleed photos */}
      {slides.map(({ src, dish }, i) => (
        <motion.div
          key={src}
          initial={false}
          animate={{ opacity: i === current ? 1 : 0 }}
          transition={{ duration: 1.4, ease: "easeInOut" }}
          className="absolute inset-0"
        >
          <Image
            src={src}
            alt={`${cms.brand_name} — ${dish}`}
            fill
            className="object-cover"
            priority={i === 0}
            sizes="100vw"
          />
        </motion.div>
      ))}

      {/* Mobile overlay */}
      <div className="lg:hidden absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/40 to-transparent" />
      <div className="lg:hidden absolute top-0 inset-x-0 h-32 bg-gradient-to-b from-stone-950/70 to-transparent" />

      {/* Desktop overlay */}
      <div className="hidden lg:block absolute inset-0 bg-gradient-to-r from-stone-950 via-stone-950/65 to-stone-950/10" />

      {/* ── MOBILE LAYOUT ── */}
      <div className="lg:hidden relative z-10 h-full flex flex-col justify-end px-6 pb-10">

        <AnimatePresence mode="wait">
          <motion.div
            key={current}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="flex items-center gap-2.5 mb-5"
          >
            <span className="w-6 h-px bg-yellow-500" />
            <span className="text-[10px] font-bold tracking-[0.28em] uppercase text-yellow-500">
              {slides[current].dish} — {slides[current].label}
            </span>
          </motion.div>
        </AnimatePresence>

        <h1
          className="font-bold text-white leading-[0.88] tracking-tight mb-4"
          style={{ fontSize: "clamp(3.2rem, 14vw, 4.8rem)" }}
        >
          {cms.hero_headline.includes(" ") ? (
            <>
              {cms.hero_headline.split(" ")[0]}<br />{cms.hero_headline.split(" ").slice(1).join(" ")}
            </>
          ) : (
            cms.hero_headline
          )}
        </h1>

        <p className="text-stone-400 text-sm leading-relaxed mb-7 max-w-[280px]">
          {cms.hero_tagline_mobile}
        </p>

        <div className="flex items-center gap-3 mb-8">
          <Link
            href="/order"
            className="inline-flex items-center gap-2 px-6 py-3 bg-yellow-500 hover:bg-yellow-400 text-stone-900 font-semibold rounded-lg text-sm transition-colors"
          >
            {cms.hero_cta_primary}
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            href="/services"
            className="inline-flex items-center gap-2 px-5 py-3 border border-white/20 hover:border-white/40 text-white font-medium rounded-lg text-sm transition-colors"
          >
            Services
          </Link>
        </div>

        {/* Progress indicators */}
        <div className="flex items-center gap-1.5">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => goTo(i)}
              aria-label={`Go to slide ${i + 1}`}
              className={`h-0.5 rounded-full transition-all duration-500 ${
                i === current ? "w-8 bg-yellow-500" : "w-2.5 bg-white/25 hover:bg-white/45"
              }`}
            />
          ))}
        </div>

      </div>

      {/* ── DESKTOP LAYOUT ── */}
      <div className="hidden lg:flex relative z-10 h-full flex-col justify-center px-14 xl:px-20">

        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.1 }}
          className="text-yellow-500 text-xs font-bold tracking-[0.3em] uppercase mb-7"
        >
          {cms.brand_location}
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.2 }}
          className="font-bold text-white leading-[0.88] tracking-tight mb-5"
          style={{ fontSize: "clamp(3.5rem, 11vw, 8.5rem)" }}
        >
          {cms.hero_headline.includes(" ") ? (
            <>
              {cms.hero_headline.split(" ")[0]}<br />{cms.hero_headline.split(" ").slice(1).join(" ")}
            </>
          ) : (
            cms.hero_headline
          )}
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.3 }}
          className="text-yellow-400/75 text-base lg:text-lg italic font-medium mb-5"
        >
          &ldquo;{cms.brand_tagline}&rdquo;
        </motion.p>

        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.38 }}
          className="text-stone-400 text-sm lg:text-base leading-relaxed max-w-sm mb-10"
        >
          {cms.hero_tagline_desktop}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.46 }}
          className="flex flex-wrap gap-3"
        >
          <Link
            href="/order"
            className="inline-flex items-center gap-2 px-7 py-3.5 bg-yellow-500 hover:bg-yellow-400 text-stone-900 font-semibold rounded-lg text-sm transition-colors"
          >
            {cms.hero_cta_primary}
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            href="/services"
            className="inline-flex items-center gap-2 px-7 py-3.5 border border-white/20 hover:border-white/50 text-white font-medium rounded-lg text-sm transition-colors"
          >
            {cms.hero_cta_secondary}
          </Link>
        </motion.div>

      </div>

      {/* Slide counter — top right */}
      <div className="hidden lg:block absolute top-8 right-10 xl:right-16 z-10">
        <AnimatePresence mode="wait">
          <motion.span
            key={current}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="text-xs font-mono text-white/30 tracking-widest"
            style={{ textShadow: "0 1px 6px rgba(0,0,0,0.8)" }}
          >
            {String(current + 1).padStart(2, "0")} / {String(slides.length).padStart(2, "0")}
          </motion.span>
        </AnimatePresence>
      </div>

      {/* Vertical nav — right center */}
      <div className="hidden lg:flex absolute right-10 xl:right-16 top-1/2 -translate-y-1/2 z-10 flex-col items-center gap-2.5">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => goTo(i)}
            aria-label={`Go to slide ${i + 1}`}
            className={`rounded-full transition-all duration-300 ${
              i === current
                ? "w-0.5 h-8 bg-yellow-500"
                : "w-0.5 h-3 bg-white/25 hover:bg-white/50"
            }`}
          />
        ))}
      </div>

      {/* Dish callout — bottom right */}
      <div className="hidden lg:block absolute bottom-14 right-10 xl:right-16 z-10 text-right">
        <AnimatePresence mode="wait">
          <motion.div
            key={current}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.35 }}
          >
            <p
              className="text-[10px] uppercase tracking-[0.22em] text-stone-400 mb-1.5"
              style={{ textShadow: "0 1px 8px rgba(0,0,0,0.9)" }}
            >
              Now Serving
            </p>
            <p
              className="text-white font-bold text-2xl leading-tight mb-1"
              style={{ textShadow: "0 2px 12px rgba(0,0,0,0.9)" }}
            >
              {slides[current].dish}
            </p>
            <p
              className="text-stone-400 text-xs mb-4"
              style={{ textShadow: "0 1px 8px rgba(0,0,0,0.9)" }}
            >
              {slides[current].label}
            </p>
            <Link
              href="/order"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-yellow-500 hover:text-yellow-400 transition-colors"
              style={{ textShadow: "0 1px 6px rgba(0,0,0,0.8)" }}
            >
              Order this dish
              <ArrowRight className="w-3 h-3" />
            </Link>
          </motion.div>
        </AnimatePresence>
      </div>

    </section>
  )
}
