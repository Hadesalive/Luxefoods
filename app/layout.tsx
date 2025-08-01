import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { CartProvider } from "@/contexts/CartContext"
import { AuthProvider } from "@/contexts/AuthContext"
import { Toaster } from "@/components/ui/toaster"
import ScrollToTop from "@/components/ScrollToTop"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  metadataBase: new URL('https://thekingsbakerysl.com'),
  title: "Kings Bakery - Restaurant & Bakery | Fresh Food, Bread, Pastries & Local Dishes | Freetown, Sierra Leone",
  description:
    "Kings Bakery Restaurant in Freetown, Sierra Leone. Fresh bread, pastries, local dishes, international cuisine, and delicious food delivered to your door. Order online for fast delivery in Lumley and surrounding areas.",
  keywords: "restaurant Freetown, bakery Freetown, fresh bread Sierra Leone, local food Freetown, international cuisine, food delivery Lumley, Kings Bakery restaurant, online food order, restaurant delivery Freetown, Sierra Leone food, African cuisine, European dishes, Asian food, fresh pastries, cakes Freetown, jollof rice, fried rice, pizza, burgers, seafood, vegetarian options",
  authors: [{ name: "Kings Bakery", url: "https://thekingsbakerysl.com" }],
  creator: "Kings Bakery",
  publisher: "Kings Bakery",
  openGraph: {
    title: "Kings Bakery - Restaurant & Bakery | Fresh Food, Bread, Pastries & Local Dishes | Freetown, Sierra Leone",
    description:
      "Kings Bakery Restaurant in Freetown, Sierra Leone. Fresh bread, pastries, local dishes, international cuisine, and delicious food delivered to your door. Order online for fast delivery in Lumley and surrounding areas.",
    url: "https://thekingsbakerysl.com",
    siteName: "Kings Bakery",
    images: [
      {
        url: "/images/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Kings Bakery Restaurant - Fresh Food, Bread, Pastries & Local Dishes in Freetown, Sierra Leone",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Kings Bakery - Restaurant & Bakery | Fresh Food, Bread, Pastries & Local Dishes | Freetown, Sierra Leone",
    description:
      "Kings Bakery Restaurant in Freetown, Sierra Leone. Fresh bread, pastries, local dishes, international cuisine, and delicious food delivered to your door. Order online for fast delivery in Lumley and surrounding areas.",
    images: ["/images/og-image.jpg"],
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
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#4f46e5" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Kings Bakery" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Restaurant",
              "name": "Kings Bakery",
              "description": "Restaurant and bakery serving fresh bread, pastries, local dishes, and international cuisine in Freetown, Sierra Leone",
              "url": "https://thekingsbakerysl.com",
              "telephone": "+23276533655",
              "email": "info@thekingsbakerysl.com",
              "address": {
                "@type": "PostalAddress",
                "streetAddress": "117 Main Regent Road, Hill Station",
                "addressLocality": "Freetown",
                "addressRegion": "Freetown",
                "addressCountry": "Sierra Leone"
              },
              "geo": {
                "@type": "GeoCoordinates",
                "latitude": "8.4840",
                "longitude": "-13.2299"
              },
              "openingHours": "Mo-Su 10:00-22:00",
              "priceRange": "$$",
              "servesCuisine": ["African", "European", "Asian", "Bakery", "Local Dishes", "International Cuisine", "Bread", "Pastries", "Cakes", "Jollof Rice", "Fried Rice", "Pizza", "Burgers", "Seafood", "Vegetarian"],
              "hasOfferCatalog": {
                "@type": "OfferCatalog",
                "name": "Menu",
                "itemListElement": [
                  {
                    "@type": "Offer",
                    "itemOffered": {
                      "@type": "FoodEstablishment",
                      "name": "Bread & Pastries"
                    }
                  },
                  {
                    "@type": "Offer",
                    "itemOffered": {
                      "@type": "FoodEstablishment",
                      "name": "Local Dishes"
                    }
                  },
                  {
                    "@type": "Offer",
                    "itemOffered": {
                      "@type": "FoodEstablishment",
                      "name": "International Cuisine"
                    }
                  },
                  {
                    "@type": "Offer",
                    "itemOffered": {
                      "@type": "FoodEstablishment",
                      "name": "Cakes & Desserts"
                    }
                  }
                ]
              },
              "sameAs": [
                "https://www.facebook.com/share/14EFU5rMqBc/",
                "https://www.tiktok.com/@kingsbakery.sl"
              ],
              "aggregateRating": {
                "@type": "AggregateRating",
                "ratingValue": "4.8",
                "reviewCount": "450"
              }
            }),
          }}
        />
      </head>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <AuthProvider>
            <CartProvider>
              {children}
              <Toaster />
              <ScrollToTop />
            </CartProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
