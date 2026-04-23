import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { SpeedInsights } from "@vercel/speed-insights/next"
import { ThemeProvider } from "@/components/theme-provider"
import { CartProvider } from "@/contexts/CartContext"
import { Toaster } from "@/components/ui/toaster"
import { Toaster as SonnerToaster } from "sonner"
import ScrollToTop from "@/components/ScrollToTop"
import TermsPopup from "@/components/TermsPopup"
import { ErrorBoundary } from "@/components/ErrorBoundary"

const inter = Inter({ 
  subsets: ["latin"],
  display: 'swap',
  preload: true,
  variable: '--font-inter',
})



export const metadata: Metadata = {
  metadataBase: new URL('https://luxefood.com'),
  title: {
    default: "LUXE FOOD — Affordable Food Delivery Across Freetown, Sierra Leone",
    template: "%s | LUXE FOOD Freetown",
  },
  description:
    "Luxe Food is Freetown's favourite food delivery service — homestyle Sierra Leone cooking delivered straight to you at affordable prices. Jollof rice, grilled chicken, soups, catering and more. Order now for fast delivery across Freetown, Sierra Leone.",
  keywords: [
    "Luxe Food",
    "Luxe Foods",
    "LUXE FOOD Freetown",
    "luxefood",
    "luxe food Sierra Leone",
    "food delivery Freetown",
    "affordable food Freetown Sierra Leone",
    "food cart Freetown",
    "street food Freetown",
    "fast food Freetown",
    "fast food delivery Freetown",
    "best fast food Freetown",
    "food near me Freetown",
    "food order Freetown",
    "jollof rice delivery Freetown",
    "Sierra Leone food delivery",
    "cheap food delivery Freetown",
    "homestyle cooking Freetown",
    "mobile food vendor Sierra Leone",
    "food tricycle Freetown",
    "catering Freetown Sierra Leone",
    "local food Freetown",
    "cassava leaf delivery",
    "grilled chicken Freetown",
    "order food online Freetown",
    "food delivery Sierra Leone",
    "Sierra Leone restaurant",
    "Freetown restaurant",
    "best food Freetown",
    "food catering Sierra Leone",
    "event catering Freetown",
    "wedding catering Freetown",
    "affordable catering Sierra Leone",
    "West African food delivery",
    "African food Freetown",
    "rice delivery Freetown",
    "fried rice Freetown",
    "soup delivery Freetown",
    "online food order Sierra Leone",
    "food delivery app Sierra Leone",
  ],
  authors: [{ name: "LUXE FOOD", url: "https://luxefood.com" }],
  creator: "LUXE FOOD",
  publisher: "LUXE FOOD",
  openGraph: {
    title: "LUXE FOOD — Affordable Food Delivery Across Freetown, Sierra Leone",
    description:
      "Freetown's favourite mobile food cart. Homestyle Sierra Leone cooking — jollof rice, grilled chicken, soups and more — delivered fast at prices everyone can afford.",
    url: "https://luxefood.com",
    siteName: "LUXE FOOD",
    images: [
      {
        url: "/images/logo.png",
        width: 1200,
        height: 630,
        alt: "LUXE FOOD — The Bites Of Delight, Freetown Sierra Leone",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "LUXE FOOD — Affordable Food Delivery Across Freetown",
    description:
      "Freetown's favourite mobile food cart. Homestyle Sierra Leone cooking delivered fast at prices everyone can afford.",
    images: ["/images/logo.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Resource Hints for Performance */}
        <link rel="preconnect" href="https://res.cloudinary.com" />
        <link rel="dns-prefetch" href="https://res.cloudinary.com" />
        
        {/* Favicon */}
        <link rel="icon" type="image/x-icon" href="/favicon.ico" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="192x192" href="/android-chrome-192x192.png" />
        <link rel="icon" type="image/png" sizes="512x512" href="/android-chrome-512x512.png" />
        
        {/* Web App Manifest */}
        <link rel="manifest" href="/site.webmanifest" />
        <meta name="theme-color" content="#eab308" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="LUXE FOOD" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "FoodEstablishment",
              "name": "LUXE FOOD",
              "alternateName": "Luxe Food Freetown",
              "description": "Mobile food cart delivering homestyle Sierra Leone cooking across Freetown at affordable prices. Specialising in jollof rice, grilled chicken, cassava leaf, soups, and catering for events.",
              "slogan": "The Bites Of Delight",
              "url": "https://luxefood.com",
              "telephone": "+23274762243",
              "email": "info@luxefood.com",
              "address": {
                "@type": "PostalAddress",
                "addressLocality": "Freetown",
                "addressRegion": "Western Area",
                "addressCountry": "SL"
              },
              "geo": {
                "@type": "GeoCoordinates",
                "latitude": "8.4840",
                "longitude": "-13.2299"
              },
              "areaServed": {
                "@type": "City",
                "name": "Freetown",
                "addressCountry": "SL"
              },
              "openingHours": "Mo-Fr 10:00-22:00, Sa-Su 11:00-23:00",
              "priceRange": "Le",
              "servesCuisine": [
                "Sierra Leonean",
                "West African",
                "Local Dishes",
                "Street Food"
              ],
              "hasOfferCatalog": {
                "@type": "OfferCatalog",
                "name": "LUXE FOOD Menu",
                "itemListElement": [
                  { "@type": "Offer", "itemOffered": { "@type": "MenuItem", "name": "Jollof Rice" } },
                  { "@type": "Offer", "itemOffered": { "@type": "MenuItem", "name": "Grilled Chicken" } },
                  { "@type": "Offer", "itemOffered": { "@type": "MenuItem", "name": "Cassava Leaf" } },
                  { "@type": "Offer", "itemOffered": { "@type": "MenuItem", "name": "Soup Bowls" } },
                  { "@type": "Offer", "itemOffered": { "@type": "MenuItem", "name": "Fried Rice" } }
                ]
              },
              "sameAs": [
                "https://www.facebook.com/luxefood",
                "https://www.instagram.com/luxefood"
              ]
            }),
          }}
        />
      </head>
      <body className={inter.className}>
        <ErrorBoundary>
          <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem={false}
            disableTransitionOnChange
          >
              <CartProvider>
                {children}
                <Toaster />
                <SonnerToaster />
                <ScrollToTop />
                <TermsPopup />
              </CartProvider>
        </ThemeProvider>
        </ErrorBoundary>
        <SpeedInsights />
      </body>
    </html>
  )
}
