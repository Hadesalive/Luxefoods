import { getCMS } from "@/lib/cms"
import HeaderClient from "./HeaderClient"

export default async function Header() {
  const cms = await getCMS()
  return <HeaderClient cms={cms} />
}
