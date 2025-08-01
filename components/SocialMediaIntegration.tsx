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
    followers: 2500,
    likes: 15600,
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
    <section className="py-16 bg-gradient-to-br from-gray-50 via-white to-gray-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-bold text-black dark:text-white mb-4">
            Join Our Food Community! 🍽️
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Follow us on social media for daily food inspiration, special offers, and behind-the-scenes content from our kitchen!
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Social Stats */}
          <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-gray-200 dark:border-gray-700">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-black dark:text-white">
                <Users className="h-5 w-5" />
                Community Stats
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-xl">
                  <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{stats.followers.toLocaleString()}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Followers</div>
                </div>
                <div className="text-center p-4 bg-gradient-to-br from-red-50 to-red-100 dark:from-red-900/20 dark:to-red-800/20 rounded-xl">
                  <div className="text-2xl font-bold text-red-600 dark:text-red-400">{stats.likes.toLocaleString()}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Likes</div>
                </div>
                <div className="text-center p-4 bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 rounded-xl">
                  <div className="text-2xl font-bold text-green-600 dark:text-green-400">{stats.reviews}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Reviews</div>
                </div>
                <div className="text-center p-4 bg-gradient-to-br from-yellow-50 to-yellow-100 dark:from-yellow-900/20 dark:to-yellow-800/20 rounded-xl">
                  <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">{stats.rating}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Rating</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Social Actions */}
          <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-gray-200 dark:border-gray-700">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-black dark:text-white">
                <Share2 className="h-5 w-5" />
                Connect & Share
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Follow Buttons */}
              <div>
                <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Follow Us</h3>
                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => window.open(socialLinks.facebook, "_blank")}
                    className="flex items-center gap-2 hover:bg-blue-50 hover:border-blue-300 dark:hover:bg-blue-900/20"
                  >
                    <Facebook className="h-4 w-4 text-blue-600" />
                    Facebook
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => window.open(socialLinks.tiktok, "_blank")}
                    className="flex items-center gap-2 hover:bg-black hover:border-black dark:hover:bg-gray-800"
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
                <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Share This Page</h3>
                <div className="grid grid-cols-2 gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleShare("facebook")}
                    className="flex items-center gap-2"
                  >
                    <Facebook className="h-4 w-4" />
                    Facebook
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleShare("tiktok")}
                    className="flex items-center gap-2"
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
                    className="flex items-center gap-2"
                  >
                    <MessageCircle className="h-4 w-4" />
                    WhatsApp
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleShare("copy")}
                    className="flex items-center gap-2"
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
          <div className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-black to-gray-800 text-white rounded-full font-medium">
            <Heart className="h-5 w-5" />
            Join thousands of food lovers who follow us!
          </div>
        </div>
      </div>
    </section>
  )
}
