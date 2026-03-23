import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Privacy Policy - LUXE FOOD",
  description: "Privacy policy for LUXE FOOD website and services.",
  robots: {
    index: true,
    follow: true,
  },
}

export default function PrivacyLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
} 