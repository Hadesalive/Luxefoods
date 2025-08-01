import type { Metadata } from "next"
import ContactPageClient from "./ContactPageClient"

export const metadata: Metadata = {
  title: "Contact Kings Bakery - Call 077 254220 | Freetown, Sierra Leone",
  description:
    "Contact Kings Bakery in Freetown, Sierra Leone. Call 077 254220 or 076 369828 for delivery. Located at 40F Sheriff Drive, Regent Road, Lumley. Open daily with fast delivery service.",
  keywords: [
    "contact Kings Bakery",
    "bread delivery phone number Freetown",
    "bakery contact Lumley",
    "bakery delivery phone Sierra Leone",
    "Kings Bakery address Freetown",
    "077 254220",
    "076 369828",
    "Kings Bakery phone number",
    "bakery delivery Freetown",
  ],
  openGraph: {
    title: "Contact Kings Bakery - Call 077 254220 | Freetown, Sierra Leone",
    description:
      "Get in touch with Kings Bakery in Freetown, Sierra Leone. Fast delivery in Lumley and surrounding areas. Call now or visit us at 40F Sheriff Drive, Regent Road.",
    url: "https://thekingsbakerysl.com/contact",
  },
}

export default function ContactPage() {
  return <ContactPageClient />
}
