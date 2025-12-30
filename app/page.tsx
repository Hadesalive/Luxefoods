import Header from "@/components/Header"
import Hero from "@/components/Hero"
import MenuSection from "@/components/MenuSection"
import DeliverySection from "@/components/DeliverySection"
import ContactSection from "@/components/ContactSection"
import Footer from "@/components/Footer"
import SocialMediaIntegration from "@/components/SocialMediaIntegration"

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-900">
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
