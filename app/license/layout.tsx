import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Software License Agreement - LUXE FOOD",
  description: "Software license agreement for LUXE FOOD website system.",
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