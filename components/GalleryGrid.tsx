"use client"

import { useState, useEffect, useCallback } from "react"
import { X, ChevronLeft, ChevronRight } from "lucide-react"

interface GalleryItem {
  id: string
  title: string | null
  image_url: string
  category: string | null
}

export default function GalleryGrid({ items }: { items: GalleryItem[] }) {
  const [lightbox, setLightbox] = useState<number | null>(null)

  const open = (i: number) => setLightbox(i)
  const close = useCallback(() => setLightbox(null), [])
  const prev = useCallback(() => setLightbox(i => i !== null ? (i - 1 + items.length) % items.length : null), [items.length])
  const next = useCallback(() => setLightbox(i => i !== null ? (i + 1) % items.length : null), [items.length])

  useEffect(() => {
    if (lightbox === null) return
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") close()
      if (e.key === "ArrowLeft") prev()
      if (e.key === "ArrowRight") next()
    }
    window.addEventListener("keydown", handler)
    return () => window.removeEventListener("keydown", handler)
  }, [lightbox, close, prev, next])

  return (
    <>
      {/* Masonry grid — natural image heights, no forced aspect ratio */}
      <div className="columns-2 sm:columns-3 gap-3 sm:gap-4">
        {items.map((item, i) => (
          <div
            key={item.id}
            className="group relative overflow-hidden rounded-xl mb-3 sm:mb-4 break-inside-avoid cursor-pointer"
            onClick={() => open(i)}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={item.image_url}
              alt={item.title ?? "LUXE FOOD gallery"}
              className="w-full h-auto object-cover transition-transform duration-700 group-hover:scale-105 block"
              loading={i < 6 ? "eager" : "lazy"}
            />
            <div className="absolute inset-0 bg-stone-950/0 group-hover:bg-stone-950/50 transition-colors duration-300" />
            {item.title && (
              <div className="absolute bottom-0 left-0 right-0 p-3 sm:p-4 translate-y-1 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                <span className="text-white text-[10px] sm:text-xs font-bold uppercase tracking-[0.15em]">
                  {item.title}
                </span>
              </div>
            )}
            {/* Tap-to-expand indicator on mobile */}
            <div className="absolute top-2 right-2 w-7 h-7 rounded-full bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity sm:hidden">
              <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-5h-4m4 0v4m0-4l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
              </svg>
            </div>
          </div>
        ))}
      </div>

      {/* Lightbox overlay */}
      {lightbox !== null && (
        <div
          className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center"
          onClick={close}
        >
          {/* Close */}
          <button
            className="absolute top-4 right-4 z-10 w-10 h-10 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
            onClick={close}
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Prev */}
          <button
            className="absolute left-3 sm:left-6 z-10 w-10 h-10 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
            onClick={(e) => { e.stopPropagation(); prev() }}
            aria-label="Previous"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          {/* Image */}
          <div
            className="relative flex flex-col items-center px-14 max-w-5xl w-full"
            onClick={(e) => e.stopPropagation()}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={items[lightbox].image_url}
              alt={items[lightbox].title ?? "LUXE FOOD"}
              className="max-h-[82vh] max-w-full object-contain rounded-xl shadow-2xl"
            />
            {items[lightbox].title && (
              <p className="text-white/80 text-sm text-center mt-4 font-medium tracking-wide">
                {items[lightbox].title}
              </p>
            )}
            <p className="text-white/40 text-xs mt-1">
              {lightbox + 1} / {items.length}
            </p>
          </div>

          {/* Next */}
          <button
            className="absolute right-3 sm:right-6 z-10 w-10 h-10 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
            onClick={(e) => { e.stopPropagation(); next() }}
            aria-label="Next"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </div>
      )}
    </>
  )
}
