import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Privacy Policy - Kings Bakery",
  description: "Privacy policy for Kings Bakery website system.",
  robots: {
    index: false,
    follow: false,
  },
}

export default function PrivacyLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
} 