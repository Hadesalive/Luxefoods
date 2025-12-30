"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Facebook, Share2, Copy, MessageCircle, Heart, Users, Star } from "lucide-react"
import { toast } from "@/hooks/use-toast"

interface SocialStats {
  followers: number
  likes: number
  reviews: number
  rating: number
}

export default function SocialMediaIntegration() {
  const [stats] = useState<SocialStats>({
    followers: 106400,
    likes: 237200,
    reviews: 450,
    rating: 4.8,
  })

  const socialLinks = {
    facebook: "https://www.facebook.com/share/14EFU5rMqBc/",
    tiktok: "https://www.tiktok.com/@kingsbakery.sl",
  }

  const shareContent = {
    title: "Kings Bakery Restaurant - Fresh Food, Local Dishes & International Cuisine",
    text: "Experience the finest local dishes and international cuisine! Fresh bread, pastries, jollof rice, fried rice, pizza, and delicious treats. 🍽️✨",
    url: typeof window !== "undefined" ? window.location.origin : "",
  }

  const handleShare = async (platform: string) => {
    const { title, text, url } = shareContent

    switch (platform) {
      case "facebook":
        window.open(
          `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
          "_blank",
          "width=600,height=400",
        )
        break
      case "tiktok":
        // TikTok doesn't have a direct share URL, so we'll copy the link
        try {
          await navigator.clipboard.writeText(url)
          toast({
            title: "Link copied!",
            description: "The link has been copied to your clipboard. Share it on TikTok!",
          })
        } catch (err) {
          toast({
            title: "Failed to copy",
            description: "Please copy the link manually.",
            variant: "destructive",
          })
        }
        break
      case "whatsapp":
        window.open(`https://wa.me/?text=${encodeURIComponent(`${text} ${url}`)}`, "_blank")
        break
      case "copy":
        try {
          await navigator.clipboard.writeText(url)
          toast({
            title: "Link copied!",
            description: "The link has been copied to your clipboard.",
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
    <section className="py-16 bg-gray-900 border-t border-gray-800">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">
            Join Our Food Community! 🍽️
          </h2>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto">
            Follow us on social media for daily food inspiration, special offers, and behind-the-scenes content from our kitchen!
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Social Stats */}
          <Card className="bg-gray-800 border-gray-700 hover:border-gray-600 transition-colors">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white">
                <Users className="h-5 w-5 text-orange-400" />
                Community Stats
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-4 bg-gray-900/50 rounded-xl border border-gray-700 hover:border-blue-500/50 transition-colors">
                  <div className="text-2xl font-bold text-blue-400">106.4k</div>
                  <div className="text-sm text-gray-300">Followers</div>
                </div>
                <div className="text-center p-4 bg-gray-900/50 rounded-xl border border-gray-700 hover:border-red-500/50 transition-colors">
                  <div className="text-2xl font-bold text-red-400">237.2k</div>
                  <div className="text-sm text-gray-300">Likes</div>
                </div>
                <div className="text-center p-4 bg-gray-900/50 rounded-xl border border-gray-700 hover:border-green-500/50 transition-colors">
                  <div className="text-2xl font-bold text-green-400">{stats.reviews}</div>
                  <div className="text-sm text-gray-300">Reviews</div>
                </div>
                <div className="text-center p-4 bg-gray-900/50 rounded-xl border border-gray-700 hover:border-yellow-500/50 transition-colors">
                  <div className="text-2xl font-bold text-yellow-400">{stats.rating}</div>
                  <div className="text-sm text-gray-300">Rating</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Social Actions */}
          <Card className="bg-gray-800 border-gray-700 hover:border-gray-600 transition-colors">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white">
                <Share2 className="h-5 w-5 text-orange-400" />
                Connect & Share
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Follow Buttons */}
              <div>
                <h3 className="text-sm font-medium text-gray-300 mb-3">Follow Us</h3>
                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => window.open(socialLinks.facebook, "_blank")}
                    className="flex items-center gap-2 border-gray-600 bg-transparent text-gray-200 hover:bg-blue-600 hover:border-blue-600 hover:text-white transition-colors"
                  >
                    <Facebook className="h-4 w-4" />
                    Facebook
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => window.open(socialLinks.tiktok, "_blank")}
                    className="flex items-center gap-2 border-gray-600 bg-transparent text-gray-200 hover:bg-gray-700 hover:border-gray-500 hover:text-white transition-colors"
                  >
                    <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24">
                      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
                    </svg>
                    TikTok
                  </Button>
                </div>
              </div>

              {/* Share Buttons */}
              <div>
                <h3 className="text-sm font-medium text-gray-300 mb-3">Share This Page</h3>
                <div className="grid grid-cols-2 gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleShare("facebook")}
                    className="flex items-center gap-2 border-gray-600 bg-transparent text-gray-200 hover:bg-blue-600 hover:border-blue-600 hover:text-white transition-colors"
                  >
                    <Facebook className="h-4 w-4" />
                    Facebook
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleShare("tiktok")}
                    className="flex items-center gap-2 border-gray-600 bg-transparent text-gray-200 hover:bg-gray-700 hover:border-gray-500 hover:text-white transition-colors"
                  >
                    <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24">
                      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
                    </svg>
                    TikTok
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleShare("whatsapp")}
                    className="flex items-center gap-2 border-gray-600 bg-transparent text-gray-200 hover:bg-green-600 hover:border-green-600 hover:text-white transition-colors"
                  >
                    <MessageCircle className="h-4 w-4" />
                    WhatsApp
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleShare("copy")}
                    className="flex items-center gap-2 border-gray-600 bg-transparent text-gray-200 hover:bg-gray-700 hover:border-gray-500 hover:text-white transition-colors"
                  >
                    <Copy className="h-4 w-4" />
                    Copy Link
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Call to Action */}
        <div className="text-center mt-12">
          <div className="inline-flex items-center gap-2 px-6 py-3 bg-gray-800 border border-gray-700 text-white rounded-full font-medium hover:border-orange-500/50 transition-colors">
            <Heart className="h-5 w-5 text-orange-400" />
            Join thousands of food lovers who follow us!
          </div>
        </div>
      </div>
    </section>
  )
}
