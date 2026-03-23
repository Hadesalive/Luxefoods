import type { Metadata } from "next"
import { getCMS } from "@/lib/cms"

export const metadata: Metadata = {
  title: "About LUXE FOOD - Quality Meals & Catering | Freetown, Sierra Leone",
  description:
    "Learn about LUXE FOOD in Freetown, Sierra Leone. Quality meals, local dishes, international cuisine, and professional catering services. The Bites Of Delight.",
  keywords: [
    "about LUXE FOOD",
    "LUXE FOOD Freetown",
    "quality food Freetown",
    "catering Freetown Sierra Leone",
    "LUXE FOOD story",
    "restaurant Freetown",
    "food delivery Sierra Leone",
  ],
  openGraph: {
    title: "About LUXE FOOD - Quality Meals & Catering | Freetown, Sierra Leone",
    description:
      "Learn about LUXE FOOD in Freetown, Sierra Leone. Quality meals, local dishes, international cuisine, and professional catering services.",
    url: "https://luxefood.com/about",
  },
}

export default async function AboutPage() {
  const cms = await getCMS()

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">{cms.about_heading}</h1>
          <p className="text-xl text-gray-600">{cms.about_subheading}</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <div className="bg-white dark:bg-gray-800 rounded-lg border p-6">
            <h2 className="text-xl font-bold mb-4">Our Mission</h2>
            <p className="text-gray-600 dark:text-gray-300">{cms.about_mission}</p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg border p-6">
            <h2 className="text-xl font-bold mb-4">Our Values</h2>
            <ul className="text-gray-600 dark:text-gray-300 space-y-2">
              <li>- Quality ingredients sourced locally</li>
              <li>- Traditional recipes with modern twists</li>
              <li>- Fast and reliable delivery service</li>
              <li>- Exceptional customer satisfaction</li>
              <li>- Community-focused business</li>
            </ul>
          </div>
        </div>

        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Why Choose {cms.brand_name}?</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="bg-yellow-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">&#127860;</span>
              </div>
              <h3 className="font-semibold mb-2">Quality Meals</h3>
              <p className="text-gray-600 text-sm">Every dish is prepared with premium ingredients</p>
            </div>

            <div className="text-center">
              <div className="bg-yellow-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">&#128666;</span>
              </div>
              <h3 className="font-semibold mb-2">Fast Delivery</h3>
              <p className="text-gray-600 text-sm">Quick delivery across Freetown and surrounding areas</p>
            </div>

            <div className="text-center">
              <div className="bg-yellow-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">&#127758;</span>
              </div>
              <h3 className="font-semibold mb-2">Local &amp; International</h3>
              <p className="text-gray-600 text-sm">From local dishes to international cuisine</p>
            </div>
          </div>
        </div>

        <div className="mt-12 p-6 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <h3 className="text-xl font-bold mb-4 text-center">Our Story</h3>
          <p className="text-gray-600 dark:text-gray-300 text-center max-w-3xl mx-auto">
            {cms.about_story}
          </p>
        </div>
      </div>
    </div>
  )
}
