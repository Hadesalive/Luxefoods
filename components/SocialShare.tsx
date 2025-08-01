"use client"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Facebook, Twitter, MessageCircle, Copy, Share2 } from "lucide-react"
import { toast } from "@/hooks/use-toast"

interface SocialShareProps {
  title: string
  price: string
  image?: string
}

export default function SocialShare({ title, price, image }: SocialShareProps) {
  const shareText = `Check out this delicious ${title} for ${price} at Kings Bakery! 🍞✨`
  const shareUrl = typeof window !== "undefined" ? window.location.href : ""

  const handleShare = async (platform: string) => {
    switch (platform) {
      case "facebook":
        window.open(
          `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`,
          "_blank",
          "width=600,height=400",
        )
        break
      case "twitter":
        window.open(
          `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`,
          "_blank",
          "width=600,height=400",
        )
        break
      case "whatsapp":
        window.open(`https://wa.me/?text=${encodeURIComponent(`${shareText} ${shareUrl}`)}`, "_blank")
        break
      case "copy":
        try {
          await navigator.clipboard.writeText(`${shareText} ${shareUrl}`)
          toast({
            title: "Link copied!",
            description: "The item link has been copied to your clipboard.",
          })
        } catch (err) {
          toast({
            title: "Failed to copy",
            description: "Please copy the link manually.",
            variant: "destructive",
          })
        }
        break
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
          <Share2 className="h-4 w-4" />
          <span className="sr-only">Share {title}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuItem onClick={() => handleShare("facebook")}>
          <Facebook className="mr-2 h-4 w-4" />
          Share on Facebook
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleShare("twitter")}>
          <Twitter className="mr-2 h-4 w-4" />
          Share on Twitter
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleShare("whatsapp")}>
          <MessageCircle className="mr-2 h-4 w-4" />
          Share on WhatsApp
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleShare("copy")}>
          <Copy className="mr-2 h-4 w-4" />
          Copy Link
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
