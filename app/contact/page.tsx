import type { Metadata } from "next"
import Header from "@/components/Header"
import Footer from "@/components/Footer"
import ContactPageClient from "./ContactPageClient"
import { getCMS } from "@/lib/cms"

export const metadata: Metadata = {
  title: "Contact LUXE FOOD - Call 074 762 243 | Freetown, Sierra Leone",
  description:
    "Contact LUXE FOOD in Freetown, Sierra Leone. Call 074 762 243 for delivery. The Bites Of Delight - Open daily with fast delivery service.",
  keywords: [
    "contact LUXE FOOD",
    "food delivery phone number Freetown",
    "LUXE FOOD contact",
    "food delivery phone Sierra Leone",
    "074 762 243",
    "LUXE FOOD phone number",
    "food delivery Freetown",
  ],
  openGraph: {
    title: "Contact LUXE FOOD - Call 074 762 243 | Freetown, Sierra Leone",
    description:
      "Get in touch with LUXE FOOD in Freetown, Sierra Leone. The Bites Of Delight. Fast delivery service.",
    url: "https://luxefood.com/contact",
  },
}

export default async function ContactPage() {
  const cms = await getCMS()
  return (
    <>
      <Header />
      <ContactPageClient cms={cms} />
      <Footer />
    </>
  )
}
