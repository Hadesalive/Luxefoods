import Header from "@/components/Header"
import Hero from "@/components/Hero"
import MenuSection from "@/components/MenuSection"
import DeliverySection from "@/components/DeliverySection"
import ContactSection from "@/components/ContactSection"
import Footer from "@/components/Footer"
import SocialMediaIntegration from "@/components/SocialMediaIntegration"

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-red-50 dark:from-gray-900 dark:via-gray-800 dark:to-orange-900">
      <Header />
      <main>
        <Hero />
        <MenuSection />
        <DeliverySection />
        <SocialMediaIntegration />
        <ContactSection />
      </main>
      <Footer />
    </div>
  )
}
