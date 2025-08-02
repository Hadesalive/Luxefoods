import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { SpeedInsights } from "@vercel/speed-insights/next"
import { ThemeProvider } from "@/components/theme-provider"
import { CartProvider } from "@/contexts/CartContext"
import { AuthProvider } from "@/contexts/AuthContext"
import { Toaster } from "@/components/ui/toaster"
import ScrollToTop from "@/components/ScrollToTop"

const inter = Inter({ subsets: ["latin"] })

// Watermark Component
function Watermark() {
  return (
    <div className="fixed bottom-2 right-2 z-40 pointer-events-none">
      <div className="text-[10px] text-gray-300 dark:text-gray-600 opacity-40 select-none font-light tracking-wide">
        made by ahmad 074762243
      </div>
    </div>
  )
}

export const metadata: Metadata = {
  metadataBase: new URL('https://thekingsbakerysl.com'),
  title: "The Kings Bakery - Food Delivery | Fried Rice, Jollof Rice, Grilled Chicken, Burgers, Shawarma | Freetown, Sierra Leone",
  description:
    "Kings Baker & Restaurant in Freetown, Sierra Leone. Order delicious food online - fried rice, jollof rice, grilled chicken, fried chicken, shawarma, burgers, breakfast, lunch, dinner. Fast food delivery to Lumley and surrounding areas.",
  keywords: "restaurant Freetown, food delivery Freetown, fried rice delivery, jollof rice delivery, grilled chicken delivery, fried chicken delivery, shawarma delivery, burger delivery, breakfast delivery, lunch delivery, dinner delivery, online food order, restaurant delivery Sierra Leone, Kings Restaurant, Kings Bakery, local food Freetown, international cuisine, food delivery Lumley, African food delivery, European food delivery, Asian food delivery, fast food delivery, date night food delivery, family meal delivery, party food delivery, catering delivery Freetown",
  authors: [{ name: "Kings Bakery", url: "https://thekingsbakerysl.com" }],
  creator: "Kings Bakery",
  publisher: "Kings Bakery",
  openGraph: {
    title: "The Kings Bakery - Food Delivery | Fried Rice, Jollof Rice, Grilled Chicken, Burgers, Shawarma | Freetown, Sierra Leone",
    description:
      "The Kings Bakery in Freetown, Sierra Leone. Order delicious food online - fried rice, jollof rice, grilled chicken, fried chicken, shawarma, burgers, breakfast, lunch, dinner. Fast food delivery to Lumley and surrounding areas.",
    url: "https://thekingsbakerysl.com",
    siteName: "The Kings Bakery",
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
    title: "The Kings Restaurant & Bakery - Food Delivery | Fried Rice, Jollof Rice, Grilled Chicken, Burgers, Shawarma | Freetown, Sierra Leone",
    description:
      "The Kings Restaurant & Bakery in Freetown, Sierra Leone. Order delicious food online - fried rice, jollof rice, grilled chicken, fried chicken, shawarma, burgers, breakfast, lunch, dinner. Fast food delivery to Lumley and surrounding areas.",
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
        {/* Favicon */}
        <link rel="icon" type="image/x-icon" href="/favicon.ico" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="192x192" href="/android-chrome-192x192.png" />
        <link rel="icon" type="image/png" sizes="512x512" href="/android-chrome-512x512.png" />
        
        {/* Web App Manifest */}
        <link rel="manifest" href="/site.webmanifest" />
        <meta name="theme-color" content="#f59e0b" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Kings Bakery" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
                             "@context": "https://schema.org",
               "@type": "Restaurant",
               "name": "The Kings Restaurant & Bakery",
               "description": "Restaurant serving delicious food including fried rice, jollof rice, grilled chicken, fried chicken, shawarma, burgers, breakfast, lunch, and dinner in Freetown, Sierra Leone",
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
                             "servesCuisine": ["African", "European", "Asian", "Local Dishes", "International Cuisine", "Fried Rice", "Jollof Rice", "Grilled Chicken", "Fried Chicken", "Shawarma", "Burgers", "Breakfast", "Lunch", "Dinner", "Fast Food", "Restaurant Food"],
              "hasOfferCatalog": {
                "@type": "OfferCatalog",
                "name": "Menu",
                                 "itemListElement": [
                   {
                     "@type": "Offer",
                     "itemOffered": {
                       "@type": "FoodEstablishment",
                       "name": "Fried Rice & Jollof Rice"
                     }
                   },
                   {
                     "@type": "Offer",
                     "itemOffered": {
                       "@type": "FoodEstablishment",
                       "name": "Grilled Chicken & Fried Chicken"
                     }
                   },
                   {
                     "@type": "Offer",
                     "itemOffered": {
                       "@type": "FoodEstablishment",
                       "name": "Shawarma & Burgers"
                     }
                   },
                   {
                     "@type": "Offer",
                     "itemOffered": {
                       "@type": "FoodEstablishment",
                       "name": "Breakfast, Lunch & Dinner"
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
              {/* Admin Access Scripts */}
              <script
                dangerouslySetInnerHTML={{
                  __html: `
                    // Desktop: Keyboard shortcut (Ctrl+Shift+A)
                    document.addEventListener('keydown', function(e) {
                      if (e.ctrlKey && e.shiftKey && e.key === 'A') {
                        e.preventDefault();
                        window.location.href = '/login';
                      }
                    });

                    // Mobile: Triple tap on bottom right corner
                    let tapCount = 0;
                    let tapTimer = null;
                    let lastTapTime = 0;
                    
                    document.addEventListener('touchstart', function(e) {
                      const now = Date.now();
                      const timeDiff = now - lastTapTime;
                      
                      // Check if tap is in bottom right corner (last 100px)
                      const touch = e.touches[0];
                      const isBottomRight = touch.clientX > window.innerWidth - 100 && 
                                          touch.clientY > window.innerHeight - 100;
                      
                      if (isBottomRight && timeDiff < 500) {
                        tapCount++;
                        lastTapTime = now;
                        
                        if (tapCount === 3) {
                          e.preventDefault();
                          window.location.href = '/login';
                          tapCount = 0;
                        }
                        
                        // Reset counter after 2 seconds
                        clearTimeout(tapTimer);
                        tapTimer = setTimeout(() => {
                          tapCount = 0;
                        }, 2000);
                      } else if (timeDiff > 500) {
                        tapCount = 1;
                        lastTapTime = now;
                      }
                    });

                    // Mobile: Long press on logo (3 seconds)
                    let longPressTimer = null;
                    let isLongPress = false;
                    
                    document.addEventListener('touchstart', function(e) {
                      const target = e.target;
                      const logo = target.closest('img[alt*="logo"], img[alt*="Logo"]');
                      
                      if (logo) {
                        longPressTimer = setTimeout(() => {
                          isLongPress = true;
                          window.location.href = '/login';
                        }, 3000);
                      }
                    });
                    
                    document.addEventListener('touchend', function() {
                      if (longPressTimer) {
                        clearTimeout(longPressTimer);
                        longPressTimer = null;
                      }
                      isLongPress = false;
                    });
                    
                    document.addEventListener('touchmove', function() {
                      if (longPressTimer) {
                        clearTimeout(longPressTimer);
                        longPressTimer = null;
                      }
                    });
                  `,
                }}
              />
            </CartProvider>
          </AuthProvider>
        </ThemeProvider>
        <SpeedInsights />
        <Watermark />
      </body>
    </html>
  )
}
