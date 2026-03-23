"use client"

import { useState, useEffect, useRef } from "react"
import { useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { CalendarDots, UsersThree, ChatCircleDots } from "@phosphor-icons/react"
import { WhatsappIcon } from "@/components/WhatsappIcon"
import { motion } from "framer-motion"

const WHATSAPP_NUMBER = "23233484356"

const serviceOptions = [
  "Workshops & Events Catering",
  "Wedding Receptions",
  "Bridal Showers",
  "Birthdays",
  "Anniversary Dinner Parties",
  "Kids Birthday Parties",
  "Funeral Repast",
  "Soup Bowls",
  "Surprise Trays",
]

export default function ServicesInquiryForm() {
  const searchParams = useSearchParams()
  const sectionRef = useRef<HTMLElement>(null)

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    service: "",
    date: "",
    guests: "",
    details: "",
  })

  // Pre-fill service from URL query param and scroll into view
  useEffect(() => {
    const serviceParam = searchParams.get("service")
    if (serviceParam && serviceOptions.includes(serviceParam)) {
      setFormData((prev) => ({ ...prev, service: serviceParam }))
      // Scroll to form after a short delay for render
      setTimeout(() => {
        sectionRef.current?.scrollIntoView({ behavior: "smooth", block: "start" })
      }, 300)
    }
  }, [searchParams])

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const buildWhatsAppUrl = () => {
    const lines = [
      `*Service Inquiry - LUXE FOOD*`,
      ``,
      `*Name:* ${formData.name}`,
      `*Phone:* ${formData.phone}`,
      `*Service:* ${formData.service}`,
      formData.date ? `*Preferred Date:* ${formData.date}` : null,
      formData.guests ? `*Estimated Guests:* ${formData.guests}` : null,
      formData.details ? `*Additional Details:* ${formData.details}` : null,
    ]
      .filter(Boolean)
      .join("\n")

    return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(lines)}`
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const url = buildWhatsAppUrl()
    window.open(url, "_blank")
  }

  const isValid = formData.name && formData.phone && formData.service

  return (
    <section
      ref={sectionRef}
      id="inquiry"
      className="relative py-20 lg:py-28 overflow-hidden"
      style={{ backgroundColor: "#F5ECD7" }}
    >
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-yellow-400/[0.04] rounded-full blur-[140px] translate-x-1/3 -translate-y-1/3 pointer-events-none" />

      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-3xl mx-auto">
          {/* Header */}
          <motion.div
            className="mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
          >
            <p className="text-xs font-bold tracking-[0.2em] uppercase text-yellow-700 mb-4">
              Get in Touch
            </p>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-stone-800 leading-tight mb-4">
              Book a Service
            </h2>
            <p className="text-base lg:text-lg text-stone-500 leading-relaxed max-w-xl">
              Fill out the form below and we&apos;ll get back to you on WhatsApp to discuss your event.
            </p>
          </motion.div>

          {/* Form */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <Card className="shadow-lg bg-white border border-stone-100 rounded-2xl">
              <CardContent className="p-6 lg:p-10">
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Name & Phone */}
                  <div className="grid sm:grid-cols-2 gap-5">
                    <div>
                      <Label htmlFor="name" className="text-stone-600 text-sm">
                        Your Name *
                      </Label>
                      <Input
                        id="name"
                        name="name"
                        required
                        value={formData.name}
                        onChange={handleInputChange}
                        placeholder="Full name"
                        className="mt-1.5 bg-stone-50 border-stone-200 text-stone-800 rounded-xl h-12"
                      />
                    </div>
                    <div>
                      <Label htmlFor="phone" className="text-stone-600 text-sm">
                        Phone Number *
                      </Label>
                      <Input
                        id="phone"
                        name="phone"
                        required
                        value={formData.phone}
                        onChange={handleInputChange}
                        placeholder="e.g., 076 123 456"
                        className="mt-1.5 bg-stone-50 border-stone-200 text-stone-800 rounded-xl h-12"
                      />
                    </div>
                  </div>

                  {/* Service Select */}
                  <div>
                    <Label htmlFor="service" className="text-stone-600 text-sm">
                      Service Type *
                    </Label>
                    <select
                      id="service"
                      name="service"
                      required
                      value={formData.service}
                      onChange={handleInputChange}
                      className="mt-1.5 w-full bg-stone-50 border border-stone-200 text-stone-800 rounded-xl h-12 px-4 appearance-none focus:outline-none focus:ring-2 focus:ring-yellow-500/50 focus:border-yellow-500"
                    >
                      <option value="" disabled>
                        Select a service...
                      </option>
                      {serviceOptions.map((opt) => (
                        <option key={opt} value={opt}>
                          {opt}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Date & Guests */}
                  <div className="grid sm:grid-cols-2 gap-5">
                    <div>
                      <Label htmlFor="date" className="text-stone-600 text-sm flex items-center gap-1.5">
                        <CalendarDots className="w-4 h-4" />
                        Preferred Date
                      </Label>
                      <Input
                        id="date"
                        name="date"
                        type="date"
                        value={formData.date}
                        onChange={handleInputChange}
                        className="mt-1.5 bg-stone-50 border-stone-200 text-stone-800 rounded-xl h-12"
                      />
                    </div>
                    <div>
                      <Label htmlFor="guests" className="text-stone-600 text-sm flex items-center gap-1.5">
                        <UsersThree className="w-4 h-4" />
                        Estimated Guests
                      </Label>
                      <Input
                        id="guests"
                        name="guests"
                        type="number"
                        min="1"
                        value={formData.guests}
                        onChange={handleInputChange}
                        placeholder="e.g., 50"
                        className="mt-1.5 bg-stone-50 border-stone-200 text-stone-800 rounded-xl h-12"
                      />
                    </div>
                  </div>

                  {/* Additional Details */}
                  <div>
                    <Label htmlFor="details" className="text-stone-600 text-sm">
                      Additional Details
                    </Label>
                    <textarea
                      id="details"
                      name="details"
                      rows={4}
                      value={formData.details}
                      onChange={handleInputChange}
                      placeholder="Tell us about your event — menu preferences, dietary requirements, location, etc."
                      className="mt-1.5 w-full bg-stone-50 border border-stone-200 text-stone-800 rounded-xl p-4 resize-none focus:outline-none focus:ring-2 focus:ring-yellow-500/50 focus:border-yellow-500"
                    />
                  </div>

                  {/* Submit */}
                  <Button
                    type="submit"
                    size="lg"
                    disabled={!isValid}
                    className="w-full bg-yellow-500 hover:bg-yellow-600 text-black text-base lg:text-lg py-4 rounded-xl shadow-lg hover:shadow-2xl hover:shadow-yellow-500/20 transition-all duration-300 font-bold disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <WhatsappIcon className="h-5 w-5 mr-2" />
                    Send Inquiry via WhatsApp
                  </Button>

                  <p className="text-center text-stone-400 text-xs">
                    This will open WhatsApp with your inquiry details pre-filled.
                  </p>
                </form>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
