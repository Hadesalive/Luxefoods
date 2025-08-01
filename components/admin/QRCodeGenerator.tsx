"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { QrCode, Download, Copy, Share2, Smartphone } from "lucide-react"
import { toast } from "@/hooks/use-toast"

export function QRCodeGenerator() {
  const [qrCodeUrl, setQrCodeUrl] = useState("")
  const [isGenerating, setIsGenerating] = useState(false)
  const [orderPageUrl, setOrderPageUrl] = useState("")
  const [qrStyle, setQrStyle] = useState("classic")

  const generateQRCode = async () => {
    setIsGenerating(true)
    try {
      // Get the current domain
      const domain = window.location.origin
      const url = `${domain}/order`
      setOrderPageUrl(url)
      
      // Generate QR code with custom styling based on selected style
      let qrApiUrl = ""
      switch (qrStyle) {
        case "purple":
          qrApiUrl = `https://api.qrserver.com/v1/create-qr-code/?size=400x400&data=${encodeURIComponent(url)}&format=png&margin=2&color=7C3AED&bgcolor=FFFFFF&ecc=M&qzone=2`
          break
        case "pink":
          qrApiUrl = `https://api.qrserver.com/v1/create-qr-code/?size=400x400&data=${encodeURIComponent(url)}&format=png&margin=2&color=EC4899&bgcolor=FFFFFF&ecc=M&qzone=2`
          break
        case "indigo":
          qrApiUrl = `https://api.qrserver.com/v1/create-qr-code/?size=400x400&data=${encodeURIComponent(url)}&format=png&margin=2&color=4F46E5&bgcolor=FFFFFF&ecc=M&qzone=2`
          break
        case "gradient":
          qrApiUrl = `https://api.qrserver.com/v1/create-qr-code/?size=400x400&data=${encodeURIComponent(url)}&format=png&margin=2&color=1F2937&bgcolor=F3F4F6&ecc=M&qzone=2`
          break
        default:
          qrApiUrl = `https://api.qrserver.com/v1/create-qr-code/?size=400x400&data=${encodeURIComponent(url)}&format=png&margin=2&color=1F2937&bgcolor=FFFFFF&ecc=M&qzone=2`
      }
      setQrCodeUrl(qrApiUrl)
      
      toast({
        title: "QR Code Generated! 🎉",
        description: `Your beautiful ${qrStyle} QR code is ready to share with customers`,
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate QR code. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsGenerating(false)
    }
  }

  const downloadQRCode = () => {
    if (!qrCodeUrl) return
    
    // Create a canvas to generate a custom branded QR code image
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    
    // Set canvas size for high quality
    canvas.width = 800
    canvas.height = 1000
    
    // Create gradient background with yellow/black theme
    const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height)
    gradient.addColorStop(0, '#fefce8') // yellow-50
    gradient.addColorStop(0.5, '#fef3c7') // yellow-100
    gradient.addColorStop(1, '#fde68a') // yellow-200
    ctx.fillStyle = gradient
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    
    // Add decorative elements with yellow/black theme
    ctx.fillStyle = 'rgba(245, 158, 11, 0.1)' // amber circles
    ctx.beginPath()
    ctx.arc(100, 100, 50, 0, 2 * Math.PI)
    ctx.fill()
    
    ctx.fillStyle = 'rgba(251, 191, 36, 0.1)' // yellow circles
    ctx.beginPath()
    ctx.arc(canvas.width - 100, 150, 40, 0, 2 * Math.PI)
    ctx.fill()
    
    ctx.fillStyle = 'rgba(217, 119, 6, 0.1)' // orange circles
    ctx.beginPath()
    ctx.arc(80, canvas.height - 120, 35, 0, 2 * Math.PI)
    ctx.fill()
    
    // Add header section with black background
    ctx.fillStyle = '#000000' // black
    ctx.fillRect(0, 0, canvas.width, 120)
    
    // Load and add the actual logo image
    const logoImage = new Image()
    logoImage.crossOrigin = 'anonymous'
    logoImage.onload = () => {
      // Draw logo in header
      const logoSize = 60
      const logoX = (canvas.width - logoSize) / 2
      const logoY = 30
      
      // Add white background circle for logo
      ctx.fillStyle = 'white'
      ctx.beginPath()
      ctx.arc(logoX + logoSize/2, logoY + logoSize/2, logoSize/2 + 5, 0, 2 * Math.PI)
      ctx.fill()
      
      // Draw logo
      ctx.drawImage(logoImage, logoX, logoY, logoSize, logoSize)
      
      // Add restaurant name
      ctx.fillStyle = 'white'
      ctx.font = 'bold 28px Arial, sans-serif'
      ctx.textAlign = 'center'
      ctx.fillText('the Kings bakery', canvas.width / 2, logoY + logoSize + 25)
      
      ctx.font = '16px Arial, sans-serif'
      ctx.fillText('Local & International Cuisine', canvas.width / 2, logoY + logoSize + 45)
      
      // Add welcoming message
      ctx.fillStyle = '#1f2937'
      ctx.font = 'bold 28px Arial, sans-serif'
      ctx.textAlign = 'center'
      ctx.fillText('Welcome to the Kings Restaurant! 🎉', canvas.width / 2, 180)
      
      ctx.font = '20px Arial, sans-serif'
      ctx.fillStyle = '#6b7280'
      ctx.fillText('Scan this QR code to order your favorite', canvas.width / 2, 210)
      ctx.fillText('local and international dishes online!', canvas.width / 2, 235)
      
      // Add QR code
      const qrImage = new Image()
      qrImage.crossOrigin = 'anonymous'
      qrImage.onload = () => {
        // Calculate QR code position and size
        const qrSize = 400
        const qrX = (canvas.width - qrSize) / 2
        const qrY = 280
        
        // Add white background for QR code with shadow
        ctx.fillStyle = 'white'
        ctx.shadowColor = 'rgba(0, 0, 0, 0.1)'
        ctx.shadowBlur = 10
        ctx.shadowOffsetX = 0
        ctx.shadowOffsetY = 5
        ctx.fillRect(qrX - 20, qrY - 20, qrSize + 40, qrSize + 40)
        
        // Reset shadow
        ctx.shadowColor = 'transparent'
        ctx.shadowBlur = 0
        ctx.shadowOffsetX = 0
        ctx.shadowOffsetY = 0
        
        // Draw QR code
        ctx.drawImage(qrImage, qrX, qrY, qrSize, qrSize)
        
        // Add call-to-action text
        ctx.fillStyle = '#000000'
        ctx.font = 'bold 24px Arial, sans-serif'
        ctx.textAlign = 'center'
        ctx.fillText('📱 Scan to Order Online', canvas.width / 2, qrY + qrSize + 60)
        
        // Add product highlights
        ctx.font = '18px Arial, sans-serif'
        ctx.fillStyle = '#6b7280'
        ctx.fillText('Local Cuisine • International Dishes • Fresh Food', canvas.width / 2, qrY + qrSize + 85)
        
        // Add contact info
        ctx.font = '16px Arial, sans-serif'
        ctx.fillStyle = '#9ca3af'
        ctx.fillText('📞 Call us: 076 533655', canvas.width / 2, qrY + qrSize + 115)
        ctx.fillText('📍 117 Main Regent Road, Hill Station', canvas.width / 2, qrY + qrSize + 135)
        
        // Add decorative border with yellow/black theme
        ctx.strokeStyle = '#000000'
        ctx.lineWidth = 3
        ctx.strokeRect(10, 10, canvas.width - 20, canvas.height - 20)
        
        // Add corner decorations
        ctx.strokeStyle = '#f59e0b'
        ctx.lineWidth = 2
        const cornerSize = 20
        
        // Top-left corner
        ctx.beginPath()
        ctx.moveTo(30, 30)
        ctx.lineTo(30 + cornerSize, 30)
        ctx.moveTo(30, 30)
        ctx.lineTo(30, 30 + cornerSize)
        ctx.stroke()
        
        // Top-right corner
        ctx.beginPath()
        ctx.moveTo(canvas.width - 30, 30)
        ctx.lineTo(canvas.width - 30 - cornerSize, 30)
        ctx.moveTo(canvas.width - 30, 30)
        ctx.lineTo(canvas.width - 30, 30 + cornerSize)
        ctx.stroke()
        
        // Bottom-left corner
        ctx.beginPath()
        ctx.moveTo(30, canvas.height - 30)
        ctx.lineTo(30 + cornerSize, canvas.height - 30)
        ctx.moveTo(30, canvas.height - 30)
        ctx.lineTo(30, canvas.height - 30 - cornerSize)
        ctx.stroke()
        
        // Bottom-right corner
        ctx.beginPath()
        ctx.moveTo(canvas.width - 30, canvas.height - 30)
        ctx.lineTo(canvas.width - 30 - cornerSize, canvas.height - 30)
        ctx.moveTo(canvas.width - 30, canvas.height - 30)
        ctx.lineTo(canvas.width - 30, canvas.height - 30 - cornerSize)
        ctx.stroke()
        
        // Convert canvas to blob and download
        canvas.toBlob((blob) => {
          if (blob) {
            const url = URL.createObjectURL(blob)
            const link = document.createElement('a')
            link.href = url
            link.download = 'kings-bakery-qr-code.png'
            document.body.appendChild(link)
            link.click()
            document.body.removeChild(link)
            URL.revokeObjectURL(url)
            
            toast({
              title: "Downloaded! 📱",
              description: "Beautiful branded QR code saved to your device",
            })
          }
        }, 'image/png')
      }
      
      qrImage.src = qrCodeUrl
    }
    
    // Load logo from public directory
    logoImage.src = '/images/logo.jpg'
  }

  const copyOrderUrl = () => {
    if (!orderPageUrl) return
    
    navigator.clipboard.writeText(orderPageUrl)
    toast({
      title: "Copied! 📋",
      description: "Order page URL copied to clipboard",
    })
  }

  return (
    <Card className="w-full bg-gradient-to-br from-yellow-50 via-white to-amber-50 dark:from-yellow-950 dark:via-yellow-900 dark:to-amber-950 border-0 shadow-2xl">
      <CardHeader className="text-center">
        <div className="flex items-center justify-center mb-2">
          <QrCode className="h-8 w-8 text-yellow-600 dark:text-yellow-400 mr-3" />
          <CardTitle className="text-2xl font-bold text-slate-900 dark:text-slate-100">
            QR Code Generator
          </CardTitle>
        </div>
        <CardDescription className="text-slate-700 dark:text-slate-300 text-lg">
          🚀 Generate QR codes to help customers easily access your order page!
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Style Selection */}
        <div className="text-center">
          <h4 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-4">
            🎨 Choose Your Style
          </h4>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mb-6">
            <button
              onClick={() => setQrStyle("classic")}
              className={`p-3 rounded-xl border-2 transition-all duration-300 ${
                qrStyle === "classic"
                  ? "border-yellow-500 bg-yellow-50 dark:bg-yellow-950/20"
                  : "border-gray-200 dark:border-gray-700 hover:border-yellow-300"
              }`}
            >
              <div className="w-8 h-8 bg-slate-800 rounded mx-auto mb-2"></div>
              <span className="text-xs font-medium">Classic</span>
            </button>
            <button
              onClick={() => setQrStyle("purple")}
              className={`p-3 rounded-xl border-2 transition-all duration-300 ${
                qrStyle === "purple"
                  ? "border-yellow-500 bg-yellow-50 dark:bg-yellow-950/20"
                  : "border-gray-200 dark:border-gray-700 hover:border-yellow-300"
              }`}
            >
              <div className="w-8 h-8 bg-purple-600 rounded mx-auto mb-2"></div>
              <span className="text-xs font-medium">Purple</span>
            </button>
            <button
              onClick={() => setQrStyle("pink")}
              className={`p-3 rounded-xl border-2 transition-all duration-300 ${
                qrStyle === "pink"
                  ? "border-yellow-500 bg-yellow-50 dark:bg-yellow-950/20"
                  : "border-gray-200 dark:border-gray-700 hover:border-yellow-300"
              }`}
            >
              <div className="w-8 h-8 bg-pink-500 rounded mx-auto mb-2"></div>
              <span className="text-xs font-medium">Pink</span>
            </button>
            <button
              onClick={() => setQrStyle("indigo")}
              className={`p-3 rounded-xl border-2 transition-all duration-300 ${
                qrStyle === "indigo"
                  ? "border-yellow-500 bg-yellow-50 dark:bg-yellow-950/20"
                  : "border-gray-200 dark:border-gray-700 hover:border-yellow-300"
              }`}
            >
              <div className="w-8 h-8 bg-indigo-600 rounded mx-auto mb-2"></div>
              <span className="text-xs font-medium">Indigo</span>
            </button>
            <button
              onClick={() => setQrStyle("gradient")}
              className={`p-3 rounded-xl border-2 transition-all duration-300 ${
                qrStyle === "gradient"
                  ? "border-yellow-500 bg-yellow-50 dark:bg-yellow-950/20"
                  : "border-gray-200 dark:border-gray-700 hover:border-yellow-300"
              }`}
            >
              <div className="w-8 h-8 bg-gradient-to-r from-slate-800 to-slate-600 rounded mx-auto mb-2"></div>
              <span className="text-xs font-medium">Gradient</span>
            </button>
          </div>
        </div>

        {/* Generate Button */}
        <div className="text-center">
          <Button
            onClick={generateQRCode}
            disabled={isGenerating}
            size="lg"
            className="bg-gradient-to-r from-yellow-600 to-amber-600 hover:from-yellow-700 hover:to-amber-700 text-white text-lg font-bold px-8 py-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
          >
            {isGenerating ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                Generating...
              </>
            ) : (
              <>
                <QrCode className="h-5 w-5 mr-2" />
                Generate QR Code
              </>
            )}
          </Button>
        </div>

        {/* QR Code Display */}
        {qrCodeUrl && (
          <div className="space-y-4">
            <div className="text-center">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-4">
                📱 Your Beautiful QR Code is Ready!
              </h3>
              <div className="relative inline-block">
                {/* Main QR Code Container with Design */}
                <div className="bg-gradient-to-br from-slate-50 via-white to-indigo-50 dark:from-slate-950 dark:via-slate-900 dark:to-indigo-950 p-8 rounded-3xl shadow-2xl border-0 relative overflow-hidden">
                  {/* Decorative Background Elements */}
                  <div className="absolute top-0 left-0 w-full h-full opacity-10">
                    <div className="absolute top-4 left-4 w-16 h-16 bg-indigo-300 dark:bg-indigo-600 rounded-full"></div>
                    <div className="absolute top-8 right-8 w-12 h-12 bg-purple-300 dark:bg-purple-600 rounded-full"></div>
                    <div className="absolute bottom-6 left-8 w-10 h-10 bg-emerald-300 dark:bg-emerald-600 rounded-full"></div>
                    <div className="absolute bottom-4 right-4 w-14 h-14 bg-blue-300 dark:bg-blue-600 rounded-full"></div>
                  </div>
                  
                  {/* Header Section */}
                  <div className="text-center mb-6 relative z-10">
                    <div className="bg-gradient-to-r from-slate-800 to-slate-700 text-white px-6 py-3 rounded-2xl shadow-lg mb-4 inline-block">
                      <h4 className="font-bold text-lg">🍞 Kings Bakery</h4>
                      <p className="text-sm opacity-90">Order Online</p>
                    </div>
                  </div>
                  
                  {/* QR Code */}
                  <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-lg border border-slate-100 dark:border-slate-700 relative z-10">
                    <img 
                      src={qrCodeUrl} 
                      alt="QR Code for Kings Bakery Order Page" 
                      className="w-72 h-72 mx-auto"
                    />
                  </div>
                  
                  {/* Footer Section */}
                  <div className="text-center mt-6 relative z-10">
                    <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-4 py-2 rounded-xl shadow-lg inline-block">
                      <p className="text-sm font-medium">📱 Scan to Order</p>
                    </div>
                    <p className="text-xs text-indigo-600 dark:text-indigo-400 mt-2 font-medium">
                      Fresh Bread • Pastries • Cakes
                    </p>
                  </div>
                  
                  {/* Decorative Corner Elements */}
                  <div className="absolute top-2 left-2 w-6 h-6 border-l-2 border-t-2 border-indigo-400 dark:border-indigo-300 rounded-tl-lg"></div>
                  <div className="absolute top-2 right-2 w-6 h-6 border-r-2 border-t-2 border-purple-400 dark:border-purple-300 rounded-tr-lg"></div>
                  <div className="absolute bottom-2 left-2 w-6 h-6 border-l-2 border-b-2 border-emerald-400 dark:border-emerald-300 rounded-bl-lg"></div>
                  <div className="absolute bottom-2 right-2 w-6 h-6 border-r-2 border-b-2 border-blue-400 dark:border-blue-300 rounded-br-lg"></div>
                </div>
                
                {/* Floating Elements */}
                <div className="absolute -top-4 -right-4 w-8 h-8 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full flex items-center justify-center shadow-lg">
                  <span className="text-white text-sm">⭐</span>
                </div>
                <div className="absolute -bottom-4 -left-4 w-8 h-8 bg-gradient-to-r from-green-400 to-emerald-400 rounded-full flex items-center justify-center shadow-lg">
                  <span className="text-white text-sm">🚚</span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Button
                onClick={downloadQRCode}
                variant="outline"
                className="border-indigo-300 dark:border-indigo-600 text-indigo-700 dark:text-indigo-300 hover:bg-indigo-50 dark:hover:bg-indigo-950/20"
              >
                <Download className="h-4 w-4 mr-2" />
                Download Branded QR
              </Button>
              
              <Button
                onClick={copyOrderUrl}
                variant="outline"
                className="border-purple-300 dark:border-purple-600 text-purple-700 dark:text-purple-300 hover:bg-purple-50 dark:hover:bg-purple-950/20"
              >
                <Copy className="h-4 w-4 mr-2" />
                Copy URL
              </Button>
              
              <Dialog>
                <DialogTrigger asChild>
                  <Button
                    variant="outline"
                    className="border-emerald-300 dark:border-emerald-600 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-50 dark:hover:bg-emerald-950/20"
                  >
                    <Share2 className="h-4 w-4 mr-2" />
                    Share
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md">
                  <DialogHeader>
                    <DialogTitle className="flex items-center">
                      <Share2 className="h-5 w-5 mr-2" />
                      Share QR Code
                    </DialogTitle>
                    <DialogDescription>
                      Share this QR code with your customers to help them order easily!
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-lg">
                      <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">
                        <strong>Order Page URL:</strong>
                      </p>
                      <p className="text-sm font-mono bg-white dark:bg-slate-700 p-2 rounded border">
                        {orderPageUrl}
                      </p>
                    </div>
                    <div className="flex justify-center">
                      <div className="bg-gradient-to-br from-slate-50 via-white to-indigo-50 dark:from-slate-950 dark:via-slate-900 dark:to-indigo-950 p-4 rounded-2xl border-0">
                        <div className="bg-white dark:bg-slate-800 p-3 rounded-xl shadow-sm">
                          <img 
                            src={qrCodeUrl} 
                            alt="QR Code" 
                            className="w-40 h-40"
                          />
                        </div>
                        <div className="text-center mt-3">
                          <p className="text-xs text-indigo-600 dark:text-indigo-400 font-medium">
                            🍞 Kings Bakery
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            {/* Download Preview */}
            <div className="bg-gradient-to-r from-emerald-50 to-green-50 dark:from-emerald-950/20 dark:to-green-950/20 p-4 rounded-xl border border-emerald-200 dark:border-emerald-800">
              <h4 className="font-semibold text-emerald-900 dark:text-emerald-100 mb-2 flex items-center">
                <Download className="h-4 w-4 mr-2" />
                Download Preview:
              </h4>
              <p className="text-sm text-emerald-800 dark:text-emerald-200 mb-3">
                Your downloaded QR code will include:
              </p>
              <ul className="text-sm text-emerald-800 dark:text-emerald-200 space-y-1">
                <li>• 🍞 Kings Bakery logo and branding</li>
                <li>• 🎉 Welcoming message</li>
                <li>• 📱 High-quality QR code</li>
                <li>• 📞 Contact information</li>
                <li>• 🎨 Beautiful design with gradients</li>
                <li>• 📄 Print-ready format (800x1000px)</li>
              </ul>
            </div>

            {/* Usage Instructions */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 p-4 rounded-xl border border-blue-200 dark:border-blue-800">
              <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-2 flex items-center">
                <Smartphone className="h-4 w-4 mr-2" />
                How to Use:
              </h4>
              <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
                <li>• 📱 Print and display at your bakery</li>
                <li>• 📧 Send via email to customers</li>
                <li>• 📱 Share on social media</li>
                <li>• 🏪 Use on business cards or flyers</li>
              </ul>
            </div>
          </div>
        )}

        {/* Info Section */}
        <div className="bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-950/20 dark:to-orange-950/20 p-4 rounded-xl border border-yellow-200 dark:border-yellow-800">
          <h4 className="font-semibold text-yellow-900 dark:text-yellow-100 mb-2">
            💡 Pro Tips:
          </h4>
          <p className="text-sm text-yellow-800 dark:text-yellow-200">
            QR codes make it super easy for customers to order! They just scan with their phone camera and go straight to your order page. Perfect for increasing online orders! 🚀
          </p>
        </div>
      </CardContent>
    </Card>
  )
} 