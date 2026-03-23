import { getCMS } from "@/lib/cms"
import HeroClient from "./HeroClient"

export default async function Hero() {
  const cms = await getCMS()
  return <HeroClient cms={cms} />
}
