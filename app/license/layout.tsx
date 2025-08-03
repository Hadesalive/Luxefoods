import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Software License Agreement - Kings Bakery",
  description: "Software license agreement for Kings Bakery website system.",
  robots: {
    index: false,
    follow: false,
  },
}

export default function LicenseLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
} 