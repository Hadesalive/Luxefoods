import Header from "@/components/Header"
import Hero from "@/components/Hero"
import MenuSection from "@/components/MenuSection"
import DeliverySection from "@/components/DeliverySection"
import ServicesSection from "@/components/ServicesSection"
import ContactSection from "@/components/ContactSection"
import Footer from "@/components/Footer"
import SocialMediaIntegration from "@/components/SocialMediaIntegration"
import SectionDivider from "@/components/SectionDivider"
import { getCMS } from "@/lib/cms"

export default async function Home() {
  const cms = await getCMS()

  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <Hero />
        <SectionDivider topColor="#0c0a09" bottomColor="#FFFDF8" variant="wave" goldLine />
        <MenuSection />
        <SectionDivider topColor="#FFFDF8" bottomColor="#F5ECD7" variant="curve" />
        <DeliverySection />
        <SectionDivider topColor="#F5ECD7" bottomColor="#FFFDF8" variant="slant" goldLine />
        <ServicesSection heading={cms.services_heading} description={cms.services_description} />
        <SectionDivider topColor="#FFFDF8" bottomColor="#F5ECD7" variant="wave" />
        <SocialMediaIntegration />
        <SectionDivider topColor="#F5ECD7" bottomColor="#FFFDF8" variant="curve" />
        <ContactSection />
        <SectionDivider topColor="#FFFDF8" bottomColor="#1C1917" variant="curve" goldLine />
      </main>
      <Footer />
    </div>
  )
}
