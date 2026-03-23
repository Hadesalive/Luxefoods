"use client"

import { useState } from "react"
import { Facebook, Share2, Copy, MessageCircle } from "lucide-react"
import { toast } from "@/hooks/use-toast"
import Link from "next/link"

const socialLinks = {
  facebook: "https://www.facebook.com/luxefood",
  instagram: "https://www.instagram.com/luxefood",
}

const shareUrl = typeof window !== "undefined" ? window.location.origin : ""
const shareText = "Experience delicious meals with quality ingredients and exceptional taste!"

export default function SocialMediaIntegration() {
  const handleShare = async (platform: string) => {
    switch (platform) {
      case "facebook":
        window.open(
          `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`,
          "_blank",
          "width=600,height=400",
        )
        break
      case "instagram":
        try {
          await navigator.clipboard.writeText(shareUrl)
          toast({ title: "Link copied!", description: "Share it on Instagram!" })
        } catch {
          toast({ title: "Failed to copy", description: "Please copy the link manually.", variant: "destructive" })
        }
        break
      case "whatsapp":
        window.open(`https://wa.me/?text=${encodeURIComponent(`${shareText} ${shareUrl}`)}`, "_blank")
        break
      case "copy":
        try {
          await navigator.clipboard.writeText(shareUrl)
          toast({ title: "Link copied!", description: "The link has been copied to your clipboard." })
        } catch {
          toast({ title: "Failed to copy", description: "Please copy the link manually.", variant: "destructive" })
        }
        break
    }
  }

  return (
    <section className="relative py-20 lg:py-28 bg-grain overflow-hidden" style={{ backgroundColor: "#F5ECD7" }}>
      <div className="container mx-auto px-6">
        <div className="max-w-5xl mx-auto">

          {/* Header */}
          <div className="grid lg:grid-cols-2 gap-8 items-end mb-14">
            <div>
              <p className="text-xs font-bold tracking-[0.2em] uppercase text-yellow-700 mb-4">Stay Connected</p>
              <h2 className="text-3xl lg:text-4xl font-bold text-stone-800 leading-[1.1]">
                Follow us for<br />daily updates.
              </h2>
            </div>
            <div>
              <p className="text-base text-stone-500 leading-relaxed">
                Daily food inspiration, special offers, and behind-the-scenes content — straight from our kitchen.
              </p>
            </div>
          </div>

          {/* Social + Share row */}
          <div className="flex flex-col sm:flex-row gap-10 sm:gap-16 border-t border-stone-200 pt-10">

            {/* Follow */}
            <div>
              <p className="text-xs font-semibold tracking-widest uppercase text-stone-400 mb-4">Follow Us</p>
              <div className="flex flex-col gap-3">
                <Link
                  href={socialLinks.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-3 text-sm font-medium text-stone-700 hover:text-blue-600 transition-colors"
                >
                  <Facebook className="h-4 w-4" />
                  Facebook
                </Link>
                <button
                  onClick={() => window.open(socialLinks.instagram, "_blank")}
                  className="inline-flex items-center gap-3 text-sm font-medium text-stone-700 hover:text-pink-600 transition-colors"
                >
                  <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                  </svg>
                  Instagram
                </button>
              </div>
            </div>

            {/* Share */}
            <div>
              <p className="text-xs font-semibold tracking-widest uppercase text-stone-400 mb-4">Share This Page</p>
              <div className="flex flex-wrap gap-3">
                <button
                  onClick={() => handleShare("facebook")}
                  className="inline-flex items-center gap-2 text-sm font-medium text-stone-600 hover:text-blue-600 transition-colors"
                >
                  <Facebook className="h-4 w-4" /> Facebook
                </button>
                <span className="text-stone-300">·</span>
                <button
                  onClick={() => handleShare("whatsapp")}
                  className="inline-flex items-center gap-2 text-sm font-medium text-stone-600 hover:text-green-600 transition-colors"
                >
                  <MessageCircle className="h-4 w-4" /> WhatsApp
                </button>
                <span className="text-stone-300">·</span>
                <button
                  onClick={() => handleShare("copy")}
                  className="inline-flex items-center gap-2 text-sm font-medium text-stone-600 hover:text-stone-900 transition-colors"
                >
                  <Copy className="h-4 w-4" /> Copy Link
                </button>
              </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  )
}
