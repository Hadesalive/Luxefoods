"use client"

import type React from "react"
import { useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"
import { Phone, Mail, MapPin, Send, CheckCircle, Loader2, HelpCircle, Clock, Star } from "lucide-react"
import Link from "next/link"
import { WhatsappIcon } from "@/components/WhatsappIcon"
import Header from "@/components/Header"
import Footer from "@/components/Footer"

export default function ContactPageClient() {
  const [formState, setFormState] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  })
  const [formStatus, setFormStatus] = useState<"idle" | "submitting" | "success" | "error">("idle")
  const [activeTab, setActiveTab] = useState("contact")

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormState({
      ...formState,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setFormStatus("submitting")

    // Simulate form submission
    setTimeout(() => {
      setFormStatus("success")
      setFormState({
        name: "",
        email: "",
        phone: "",
        subject: "",
        message: "",
      })
    }, 1500)
  }

  const faqs = [
    {
      question: "What are your opening hours?",
      answer:
        "We are open Monday to Friday from 10:00 AM to 10:00 PM, and on weekends (Saturday and Sunday) from 11:00 AM to 11:00 PM.",
    },
    {
      question: "Do you offer delivery services?",
      answer:
        "Yes, we offer delivery throughout the Lumley area and beyond. Delivery times typically range from 30-45 minutes depending on your location and order volume.",
    },
    {
      question: "What payment methods do you accept?",
      answer:
        "We accept cash on delivery and Orange Money payments. For Orange Money, you'll need to provide the transaction ID during checkout.",
    },
    {
      question: "Can I customize my order?",
      answer:
        "You can add special instructions when placing your order. For more specific customizations, please call us directly.",
    },
    {
      question: "Do you cater for events and parties?",
      answer:
        "Yes, we offer catering services for events of all sizes. Please contact us at least 48 hours in advance to discuss your requirements and get a quote.",
    },
    {
      question: "What is your most popular dish?",
      answer:
        "Our Chicken Pizza and Cocktail Pizza are customer favorites! The Mini Pizza (1 Dozen) is also very popular for gatherings.",
    },
    {
      question: "Do you have vegetarian options?",
      answer: "Yes, we offer Vegetable Pizza and can customize other items to be vegetarian upon request.",
    },
    {
      question: "How can I track my order?",
      answer:
        "After placing your order, you'll receive a confirmation. For delivery status updates, you can contact us directly using the phone numbers provided.",
    },
  ]

  return (
    <div className="min-h-screen bg-gray-900">
      <Header />
      <main className="pt-20">
        <div className="container mx-auto px-4 py-8 lg:py-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-8 lg:mb-12"
          >
            <h1 className="text-3xl sm:text-4xl lg:text-6xl font-bold mb-4 lg:mb-6 text-white">
              Get in Touch
            </h1>
            <p className="text-lg lg:text-xl text-gray-400 max-w-3xl mx-auto leading-relaxed">
              Have questions, feedback, or want to place a special order? We're here to help!
            </p>
          </motion.div>

          {/* Tab Navigation */}
          <div className="flex flex-wrap justify-center gap-3 mb-8 lg:mb-12 px-4">
            <Button
              className={`text-base lg:text-lg px-6 lg:px-8 py-3 lg:py-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 ${
                activeTab === "contact"
                  ? "bg-orange-600 hover:bg-orange-700 text-white"
                  : "bg-gray-800 hover:bg-gray-700 text-gray-200 border-2 border-gray-700 hover:border-gray-600"
              }`}
              onClick={() => setActiveTab("contact")}
            >
              📞 Contact Us
            </Button>
            <Button
              className={`text-base lg:text-lg px-6 lg:px-8 py-3 lg:py-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 ${
                activeTab === "faq"
                  ? "bg-orange-600 hover:bg-orange-700 text-white"
                  : "bg-gray-800 hover:bg-gray-700 text-gray-200 border-2 border-gray-700 hover:border-gray-600"
              }`}
              onClick={() => setActiveTab("faq")}
            >
              ❓ FAQ
            </Button>
            <Button
              className={`text-base lg:text-lg px-6 lg:px-8 py-3 lg:py-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 ${
                activeTab === "location"
                  ? "bg-orange-600 hover:bg-orange-700 text-white"
                  : "bg-gray-800 hover:bg-gray-700 text-gray-200 border-2 border-gray-700 hover:border-gray-600"
              }`}
              onClick={() => setActiveTab("location")}
            >
              📍 Location
            </Button>
          </div>

        {/* Contact Tab */}
        {activeTab === "contact" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 lg:gap-6 px-4 lg:px-0"
          >
            {/* Quick Contact Cards */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <Card className="overflow-hidden group hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 bg-gray-800 border border-gray-700 hover:border-orange-500/50 h-full">
                <CardContent className="p-6 flex flex-col items-center text-center h-full">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-600 to-blue-700 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                    <Phone className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold mb-2 text-white">Call Us</h3>
                  <p className="text-gray-300 mb-4 text-sm">Quick phone support</p>
                  <div className="space-y-2 mt-auto">
                    <Link
                      href="tel:076533655"
                      className="block text-orange-400 font-semibold hover:text-orange-300 transition-colors"
                    >
                      076 533655
                    </Link>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Card className="overflow-hidden group hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 bg-gray-800 border border-gray-700 hover:border-green-500/50 h-full">
                <CardContent className="p-6 flex flex-col items-center text-center h-full">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-green-600 to-green-700 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                    <WhatsappIcon className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold mb-2 text-white">WhatsApp</h3>
                  <p className="text-gray-300 mb-4 text-sm">Instant messaging</p>
                  <div className="mt-auto">
                    <Link
                      href="https://wa.me/23276533655"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block text-green-400 font-semibold hover:text-green-300 transition-colors"
                    >
                      076 533655
                    </Link>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <Card className="overflow-hidden group hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 bg-gray-800 border border-gray-700 hover:border-purple-500/50 h-full">
                <CardContent className="p-6 flex flex-col items-center text-center h-full">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-600 to-pink-700 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                    <Mail className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold mb-2 text-white">Email</h3>
                  <p className="text-gray-300 mb-4 text-sm">Send us a message</p>
                  <div className="mt-auto">
                    <Link
                      href="mailto:info@thekingsbakerysl.com"
                      className="block text-purple-400 font-semibold hover:text-purple-300 transition-colors text-sm"
                    >
                      info@thekingsbakerysl.com
                    </Link>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="sm:col-span-2 lg:col-span-3 xl:col-span-1"
            >
              <Card className="overflow-hidden group hover:shadow-2xl transition-all duration-500 bg-gray-800 border border-gray-700 hover:border-orange-500/50 h-full">
                <CardContent className="p-6">
                  {formStatus === "success" ? (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="text-center py-8"
                    >
                      <CheckCircle className="h-16 w-16 text-green-400 mx-auto mb-4" />
                      <h3 className="text-2xl font-bold text-white mb-2">Message Sent!</h3>
                      <p className="text-gray-300 mb-6">
                        Thank you for reaching out. We'll get back to you shortly.
                      </p>
                      <Button
                        onClick={() => setFormStatus("idle")}
                        className="bg-orange-600 hover:bg-orange-700 text-white"
                      >
                        Send Another Message
                      </Button>
                    </motion.div>
                  ) : (
                    <>
                      <h3 className="text-xl font-bold mb-4 text-white">Send Message</h3>
                      <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                          <Input
                            name="name"
                            placeholder="Your Name"
                            value={formState.name}
                            onChange={handleChange}
                            required
                            className="bg-gray-900 border-gray-700 text-white placeholder:text-gray-500 focus:border-orange-500"
                          />
                        </div>
                        <div>
                          <Input
                            name="email"
                            type="email"
                            placeholder="Email Address"
                            value={formState.email}
                            onChange={handleChange}
                            required
                            className="bg-gray-900 border-gray-700 text-white placeholder:text-gray-500 focus:border-orange-500"
                          />
                        </div>
                        <div>
                          <Input
                            name="phone"
                            placeholder="Phone Number"
                            value={formState.phone}
                            onChange={handleChange}
                            className="bg-gray-900 border-gray-700 text-white placeholder:text-gray-500 focus:border-orange-500"
                          />
                        </div>
                        <div>
                          <Input
                            name="subject"
                            placeholder="Subject"
                            value={formState.subject}
                            onChange={handleChange}
                            required
                            className="bg-gray-900 border-gray-700 text-white placeholder:text-gray-500 focus:border-orange-500"
                          />
                        </div>
                        <div>
                          <Textarea
                            name="message"
                            rows={4}
                            placeholder="Your Message..."
                            value={formState.message}
                            onChange={handleChange}
                            required
                            className="bg-gray-900 border-gray-700 text-white placeholder:text-gray-500 focus:border-orange-500 resize-none"
                          />
                        </div>
                        <Button
                          type="submit"
                          disabled={formStatus === "submitting"}
                          className="w-full bg-orange-600 hover:bg-orange-700 text-white py-3 font-medium flex items-center justify-center gap-2 rounded-2xl"
                        >
                          {formStatus === "submitting" ? (
                            <>
                              <Loader2 className="h-5 w-5 animate-spin" />
                              Sending...
                            </>
                          ) : (
                            <>
                              <Send className="h-5 w-5" />
                              Send Message
                            </>
                          )}
                        </Button>
                      </form>
                    </>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        )}

        {/* FAQ Tab */}
        {activeTab === "faq" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6 px-4 lg:px-0"
          >
            {faqs.map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className="overflow-hidden group hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 bg-gray-800 border border-gray-700 hover:border-orange-500/50 h-full">
                  <CardContent className="p-6">
                    <div className="flex items-start mb-4">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-600 to-orange-700 flex items-center justify-center mr-4 flex-shrink-0">
                        <HelpCircle className="h-5 w-5 text-white" />
                      </div>
                      <h3 className="text-lg font-bold text-white leading-tight">
                        {faq.question}
                      </h3>
                    </div>
                    <p className="text-gray-300 leading-relaxed ml-14">{faq.answer}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* Location Tab */}
        {activeTab === "location" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 px-4 lg:px-0"
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <Card className="overflow-hidden group hover:shadow-2xl transition-all duration-500 bg-gray-800 border border-gray-700 hover:border-orange-500/50 h-full">
                <CardContent className="p-6">
                  <h3 className="text-2xl font-bold mb-6 text-white">Visit Our Restaurant</h3>
                  <div className="space-y-6">
                    <div className="flex items-start">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-orange-600 to-orange-700 flex items-center justify-center mr-4 flex-shrink-0">
                        <MapPin className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <p className="font-bold text-white mb-1">📍 Address</p>
                        <p className="text-gray-300">
                          117 MAIN REGENT ROAD, HILL STATION
                          <br />
                          OPPOSITE CITY SUPERMARKET
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-600 to-blue-700 flex items-center justify-center mr-4 flex-shrink-0">
                        <Clock className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <p className="font-bold text-white mb-2">🕐 Opening Hours</p>
                        <div className="space-y-1 text-gray-300">
                          <div className="flex justify-between">
                            <span>Monday - Friday:</span>
                            <span className="font-semibold text-orange-400">10:00 AM - 10:00 PM</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Saturday - Sunday:</span>
                            <span className="font-semibold text-orange-400">11:00 AM - 11:00 PM</span>
                          </div>
                        </div>
                        <div className="mt-3 p-2 bg-green-900/30 border border-green-700/50 rounded-lg">
                          <p className="text-green-400 text-sm font-medium flex items-center">
                            <span className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></span>
                            Open Now - Ready to serve you! 🍕
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Card className="overflow-hidden group hover:shadow-2xl transition-all duration-500 bg-gray-800 border border-gray-700 hover:border-orange-500/50 h-full">
                <div className="h-[300px] bg-gray-700 relative">
                  <div className="absolute inset-0 flex items-center justify-center p-8 text-gray-300 text-center">
                    <div>
                      <MapPin className="h-12 w-12 mx-auto mb-4 text-orange-400" />
                      <p className="font-medium text-lg mb-2">Map location would be displayed here.</p>
                      <p className="text-sm">117 MAIN REGENT ROAD, HILL STATION</p>
                    </div>
                  </div>
                </div>
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold mb-4 text-white">Customer Rating</h3>
                  <div className="flex items-center mb-4">
                    <div className="flex items-center mr-4">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star key={star} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                      ))}
                    </div>
                    <div>
                      <p className="font-bold text-yellow-400 text-xl">4.8/5</p>
                      <p className="text-xs text-gray-400">Based on 450+ reviews</p>
                    </div>
                  </div>
                  <p className="text-gray-300 text-sm italic">
                    "Amazing homestyle cooking! The pizza is absolutely delicious and the service is excellent." -
                    Recent Customer
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        )}
        </div>
      </main>
      <Footer />
    </div>
  )
}
